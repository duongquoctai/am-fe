"use client";

import { ProgressTracker } from "@/components/progress-tracker";
import { VideoGalleryGrid } from "@/components/video-gallery-grid";
import { useJobProgress } from "@/hooks/use-job-progress";
import { useVideos } from "@/hooks/use-videos";
import { Sidebar } from "@/components/shared/sidebar";
import {
  Bell,
  Database,
  Moon,
  Search,
  ArrowLeft,
  Calendar,
  Compass,
  Layers,
  Link2,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  // Unwrap the dynamic params promise in React 19/Next 15+ using React.use()
  const resolvedParams = React.use(params);
  const jobId = resolvedParams.id;

  const job = useJobProgress(jobId);
  const { videos, isLoading: isVideosLoading } = useVideos(jobId);

  // Configure styling for the status badge
  const statusColor =
    job?.status === "completed"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : job?.status === "processing"
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse"
        : job?.status === "pending"
          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          : job?.status === "failed"
            ? "bg-red-500/10 text-red-400 border-red-500/20"
            : "bg-gray-500/10 text-gray-400 border-gray-500/20";

  const platformColor =
    job?.platform === "instagram"
      ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
      : job?.platform === "douyin"
        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
        : job?.platform === "tiktok"
          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
          : job?.platform === "xiaohongshu"
            ? "bg-red-500/10 text-red-400 border-red-500/20"
            : "bg-gray-500/10 text-gray-400 border-gray-500/20";

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
              placeholder="Search assets..."
              className="w-full bg-[#121212] border-[#1c1c1c] rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3e3e42] text-white"
            />
          </div>

          <div className="flex items-center gap-4">
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
          {/* Back button and page title */}
          <div className="space-y-4">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#a1a1a1] hover:text-white bg-[#121212] border border-[#2a2a2a] px-3 py-1.5 rounded-md hover:bg-[#1a1a1a] transition-all"
            >
              <ArrowLeft size={14} />
              Back to Jobs History
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#1c1c1c] pb-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-[#a1a1a1] bg-[#121212] border border-[#2a2a2a] px-2 py-0.5 rounded-md">
                    Job ID: {jobId}
                  </span>
                  {job?.platform && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${platformColor}`}
                    >
                      {job.platform}
                    </span>
                  )}
                  {job?.status && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusColor}`}
                    >
                      {job.status === "processing" && (
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                      )}
                      {job.status}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="text-[#a1a1a1]">Target:</span>{" "}
                  {job ? job.keyword : "Loading parameters..."}
                </h1>
              </div>

              {job && (
                <div className="flex flex-wrap gap-4 text-sm bg-[#121212]/50 border border-[#1c1c1c] p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-[#a1a1a1]">
                    <Layers size={16} />
                    <span>Target Count: <strong className="text-white">{job.target_count}</strong></span>
                  </div>
                  <div className="w-px h-5 bg-[#1c1c1c] hidden sm:block" />
                  <div className="flex items-center gap-2 text-[#a1a1a1]">
                    <Calendar size={16} />
                    <span>
                      Created:{" "}
                      <strong className="text-white">
                        {new Date(job.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Job Progress */}
          <div className="grid grid-cols-1 gap-8">
            <div className="h-fit">
              <ProgressTracker
                status={job ? job.status : "pending"}
                savedCount={job ? job.saved_count : 0}
                targetCount={job ? job.target_count : 5}
                errorMessage={job?.error_message}
              />
            </div>
          </div>

          {/* Ingested Videos Grid */}
          <div className="pt-4">
            <VideoGalleryGrid
              videos={videos}
              isLoading={isVideosLoading}
              title="Assets Crawled for this Job"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
