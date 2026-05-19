"use client";

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { useEffect, useState } from "react";

type Job = Database["public"]["Tables"]["crawl_jobs"]["Row"];

export function useJobProgress(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!jobId) return;

    // Initial fetch
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("crawl_jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (!error && data) {
        setJob(data);
      }
    };

    fetchJob();

    // Subscribe to changes
    console.log(
      `[useJobProgress] Subscribing to realtime updates for job: ${jobId}`,
    );
    const channel = supabase
      .channel(`job-updates-${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, etc)
          schema: "public",
          table: "crawl_jobs",
          filter: `id=eq.${jobId}`,
        },
        (payload: any) => {
          console.log("[useJobProgress] Realtime update received:", payload);
          if (payload.new && Object.keys(payload.new).length > 0) {
            setJob(payload.new as Job);
          }
        },
      )
      .subscribe((status: string, err: Error | null) => {
        console.log(
          `[useJobProgress] Subscription status for job ${jobId}:`,
          status,
        );
        if (err) {
          console.error(
            `[useJobProgress] Subscription error for job ${jobId}:`,
            err,
          );
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  return job;
}
