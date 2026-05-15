"use client";

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { useEffect, useState } from "react";

type Video = Database["public"]["Tables"]["videos"]["Row"];

export function useVideos(jobId: string | null) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      let query = supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobId) {
        query = query.eq("job_id", jobId);
      }

      const { data, error } = await query.limit(20);

      if (!error && data) {
        setVideos(data);
      }
      setIsLoading(false);
    };

    fetchVideos();

    // Subscribe to new videos
    console.log(
      `[useVideos] Subscribing to videos feed${jobId ? ` for job: ${jobId}` : ""}`,
    );
    const channel = supabase
      .channel(`videos-feed-${jobId || "global"}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "videos",
        },
        (payload) => {
          console.log("[useVideos] New video received via realtime:", payload);
          const newVideo = payload.new as Video;
          if (!jobId || newVideo.job_id === jobId) {
            setVideos((prev) => [newVideo, ...prev]);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "videos",
        },
        (payload) => {
          console.log("[useVideos] Video deleted via realtime:", payload);
          const deletedId = payload.old.id;
          setVideos((prev) => prev.filter((v) => v.id !== deletedId));
        },
      )
      .subscribe((status, err) => {
        console.log(`[useVideos] Subscription status:`, status);
        if (err) {
          console.error(`[useVideos] Subscription error:`, err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  return { videos, isLoading };
}
