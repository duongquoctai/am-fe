import { createClient } from "@/lib/supabase/server";
import {
  Bell,
  Database,
  LayoutDashboard,
  Moon,
  Search,
  Settings,
  User,
  ExternalLink,
  RefreshCw,
  Compass,
  Film,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

export const dynamic = "force-dynamic";

export default async function JobsHistoryPage() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("crawl_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#f2f2f2] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1c1c1c] bg-[#0a0a0a] hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">AM</span>
            </div>
            <span className="font-bold text-lg tracking-tight">AM Engine</span>
          </div>

          <nav className="space-y-1">
            <Link
              href="/"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#a1a1a1] hover:bg-[#121212] hover:text-white transition-all"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link
              href="/jobs"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-[#121212] text-white font-medium transition-all"
            >
              <Database size={18} />
              Crawl Jobs
            </Link>
            <Link
              href="#"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#a1a1a1] hover:bg-[#121212] hover:text-white transition-all"
            >
              <Settings size={18} />
              Settings
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-[#1c1c1c]">
          <div className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#a1a1a1]">
            <User size={18} />
            Profile
          </div>
        </div>
      </aside>

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
              placeholder="Search jobs..."
              className="w-full bg-[#121212] border-[#1c1c1c] rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3e3e42] text-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/jobs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#121212] border border-[#2a2a2a] text-xs font-semibold text-white hover:bg-[#1c1c1c] transition-colors"
            >
              <RefreshCw size={12} className="animate-spin-slow" />
              Refresh
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Crawl Jobs History</h1>
              <p className="text-[#a1a1a1]">
                Review all past and active social media ingestion streams.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
            >
              Create New Job
            </Link>
          </div>

          {/* Table Container */}
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
            {error ? (
              <div className="p-8 text-center text-red-500">
                Failed to load jobs: {error.message}
              </div>
            ) : !jobs || jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-12 h-12 rounded-full bg-[#1c1c1c] flex items-center justify-center mb-4 border border-[#2a2a2a]">
                  <Compass className="w-6 h-6 text-[#a1a1a1]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f2f2f2] mb-1">No Jobs Found</h3>
                <p className="text-sm text-[#a1a1a1] text-center max-w-sm mb-6">
                  You haven't initiated any crawling tasks yet. Create your first job to start.
                </p>
                <Link
                  href="/"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md transition-colors"
                >
                  Start First Crawl
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]/50 text-xs font-semibold uppercase tracking-wider text-[#a1a1a1]">
                      <th className="px-6 py-4">Job ID</th>
                      <th className="px-6 py-4">Platform</th>
                      <th className="px-6 py-4">Target Keyword</th>
                      <th className="px-6 py-4">Progress / Saved</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c1c] text-sm">
                    {jobs.map((job) => {
                      const platformColor =
                        job.platform === "instagram"
                          ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
                          : job.platform === "douyin"
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                            : job.platform === "tiktok"
                              ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                              : job.platform === "xiaohongshu"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-gray-500/10 text-gray-400 border-gray-500/20";

                      const statusColor =
                        job.status === "completed"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : job.status === "processing"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse"
                            : job.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20";

                      const percentage =
                        job.target_count > 0
                          ? Math.round((job.saved_count / job.target_count) * 100)
                          : 0;

                      return (
                        <tr
                          key={job.id}
                          className="hover:bg-[#1a1a1a]/30 transition-colors group"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-[#a1a1a1]">
                            <span className="bg-[#1c1c1c] border border-[#2a2a2a] px-2 py-1 rounded select-all group-hover:text-white transition-colors">
                              {job.id.substring(0, 8)}...
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${platformColor}`}
                            >
                              {job.platform}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-[#f2f2f2] max-w-[200px] truncate">
                            {job.keyword}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-16 bg-[#1c1c1c] rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-blue-600 h-full rounded-full"
                                  style={{ width: `${Math.min(100, percentage)}%` }}
                                />
                              </div>
                              <span className="font-semibold text-xs text-[#a1a1a1]">
                                {job.saved_count}/{job.target_count}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusColor}`}
                            >
                              {job.status === "processing" && (
                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                              )}
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-[#a1a1a1]">
                            {new Date(job.created_at).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
                            >
                              View Details
                              <ExternalLink size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
