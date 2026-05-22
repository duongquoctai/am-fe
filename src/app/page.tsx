"use client";

import { ControlPanel } from "@/components/dashboard/control-panel";
import { VideoGalleryGrid } from "@/components/video-gallery-grid";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/shared/sidebar";
import {
  Activity,
  Bell,
  Cpu,
  Database,
  Globe,
  Moon,
  Search,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { triggerCrawl } from "./actions";

export default function DashboardPage() {
  const router = useRouter();
  const [isTriggering, setIsTriggering] = React.useState(false);

  // Infinite Scroll & Gallery State
  const [videos, setVideos] = React.useState<any[]>([]);
  const [isVideosLoading, setIsVideosLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const supabase = createClient();

  const fetchVideos = async (start: number, count: number) => {
    setIsVideosLoading(true);
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false })
        .range(start, start + count - 1);

      if (!error && data) {
        if (data.length < count) {
          setHasMore(false);
        }
        setVideos((prev) => {
          const existingIds = new Set(prev.map((v) => v.id));
          const newUnique = data.filter((v: any) => !existingIds.has(v.id));
          return [...prev, ...newUnique];
        });
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setIsVideosLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isVideosLoading || !hasMore) return;
    await fetchVideos(videos.length, 5);
  };

  const handleStartCrawl = async (params: {
    platform: string;
    target: string;
    crawlType: string;
    limit: number;
  }) => {
    setIsTriggering(true);
    try {
      const { jobId } = await triggerCrawl(params);
      toast.success("Crawl job started successfully!");
      // Immediately redirect to the dynamic Job Detail page
      router.push(`/jobs/${jobId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to start crawl");
    } finally {
      setIsTriggering(false);
    }
  };

  // Intersection Observer for Infinite Scroll
  const observerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Initial fetch of 20 videos
    fetchVideos(0, 20);

    // Subscribe to realtime changes
    const channel = supabase
      .channel("global-videos-homepage")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "videos",
        },
        (payload: any) => {
          const newVideo = payload.new as any;
          setVideos((prev) => {
            if (prev.some((v) => v.id === newVideo.id)) return prev;
            return [newVideo, ...prev];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "videos",
        },
        (payload: any) => {
          const updatedVideo = payload.new as any;
          setVideos((prev) =>
            prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "videos",
        },
        (payload: any) => {
          const deletedId = payload.old.id;
          setVideos((prev) => prev.filter((v) => v.id !== deletedId));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isVideosLoading &&
          videos.length > 0
        ) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [observerRef.current, hasMore, isVideosLoading, videos.length]);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#f2f2f2] overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-[#1c1c1c] bg-[#0a0a0a] flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3e3e42]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search parameters..."
              className="w-full bg-[#121212] border-[#1c1c1c] rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3e3e42] text-white"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Header Link to Jobs History */}
            <Link
              href="/jobs"
              className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white hover:bg-[#1a1a1a] transition-all hover:border-[#3e3e42]"
            >
              <Database size={14} className="text-blue-500 animate-pulse" />
              View Jobs History
            </Link>

            <button className="p-2 text-[#a1a1a1] hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 text-[#a1a1a1] hover:text-white transition-colors">
              <Moon size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] overflow-hidden">
              <img src="https://avatar.vercel.sh/am" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Job Creator Dashboard
            </h1>
            <p className="text-[#a1a1a1]">
              Configure target parameters and initialize ingestion streams
              across networks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Creator Panel */}
            <div className="lg:col-span-5">
              <ControlPanel
                onStartCrawl={handleStartCrawl}
                isLoading={isTriggering}
              />
            </div>

            {/* Right Column: Ingestion Status Panel */}
            <div className="lg:col-span-7 bg-[#121212] border border-[#2a2a2a] rounded-xl text-[#f2f2f2] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Activity
                        size={18}
                        className="text-emerald-500 animate-pulse"
                      />
                      Ingestion System Status
                    </h2>
                    <p className="text-xs text-[#a1a1a1] mt-0.5">
                      Operational metrics across active scraper agents
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    All Nodes Live
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatusCard
                    icon={<Zap className="text-yellow-500" size={16} />}
                    title="Platform Latency"
                    value="~1.2s"
                    desc="Avg response time"
                  />
                  <StatusCard
                    icon={<Cpu className="text-blue-500" size={16} />}
                    title="API Server"
                    value="99.98%"
                    desc="Uptime status"
                  />
                  <StatusCard
                    icon={<Globe className="text-purple-500" size={16} />}
                    title="Crawl Nodes"
                    value="12 Active"
                    desc="Distributed scrapers"
                  />
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-semibold text-white">
                    System Highlights
                  </h3>
                  <ul className="space-y-2 text-xs text-[#a1a1a1]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <strong>Parallel Fetching:</strong> Pulls asset URLs
                      simultaneously bypassing standard rate limits.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <strong>Deduplication Filter:</strong> Centralized check
                      skips pre-existing download assets.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <strong>Real-Time Sync:</strong> Subscriptions propagate
                      new resources directly to details page.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action/Info Banner */}
              <div className="mt-8 pt-4 border-t border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a1a1a1]">
                <span>To track active jobs or review historic assets:</span>
                <Link
                  href="/jobs"
                  className="font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 border border-blue-500/20 px-3 py-1.5 rounded bg-blue-500/5 hover:bg-blue-500/10 transition-all"
                >
                  Go to Job History
                  <Database size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Video Ingested Assets with Infinite Scroll */}
          <div className="pt-8 border-t border-[#1c1c1c]">
            <VideoGalleryGrid
              videos={videos}
              isLoading={isVideosLoading && videos.length === 0}
              onDelete={(deletedId) => {
                setVideos((prev) => prev.filter((v) => v.id !== deletedId));
              }}
              title="Latest Ingested Assets"
            />

            {/* Infinite Scroll Trigger Indicator */}
            {hasMore && (
              <div
                ref={observerRef}
                className="flex justify-center items-center py-12"
              >
                <div className="flex items-center gap-2 text-[#a1a1a1]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                  <span className="text-xs font-semibold">
                    Loading more videos...
                  </span>
                </div>
              </div>
            )}

            {!hasMore && videos.length > 0 && (
              <div className="flex justify-center items-center py-12 text-xs text-[#3e3e42] font-semibold">
                Showing all crawled assets.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  value,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="p-4 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-[#a1a1a1] font-medium">{title}</span>
      </div>
      <div className="text-lg font-bold text-white tracking-tight">{value}</div>
      <p className="text-[10px] text-[#71717a]">{desc}</p>
    </div>
  );
}
