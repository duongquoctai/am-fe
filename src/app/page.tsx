"use client";

import { ControlPanel } from "@/components/dashboard/control-panel";
import { ProgressTracker } from "@/components/dashboard/progress-tracker";
import { VideoGallery } from "@/components/dashboard/video-gallery";
import { useJobProgress } from "@/hooks/use-job-progress";
import { useVideos } from "@/hooks/use-videos";
import {
  Bell,
  Database,
  LayoutDashboard,
  Moon,
  Search,
  Settings,
  User,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { triggerCrawl } from "./actions";

export default function DashboardPage() {
  const [activeJobId, setActiveJobId] = React.useState<string | null>(null);
  const [isTriggering, setIsTriggering] = React.useState(false);

  const activeJob = useJobProgress(activeJobId);
  const { videos, isLoading: isVideosLoading } = useVideos(activeJobId);

  const handleStartCrawl = async (params: {
    platform: string;
    target: string;
    crawlType: string;
    limit: number;
  }) => {
    setIsTriggering(true);
    try {
      const { jobId } = await triggerCrawl(params);
      setActiveJobId(jobId);
      toast.success("Crawl job started successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to start crawl");
    } finally {
      setIsTriggering(false);
    }
  };

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
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active
            />
            <SidebarItem icon={<Database size={18} />} label="Asset Library" />
            <SidebarItem icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-[#1c1c1c]">
          <SidebarItem icon={<User size={18} />} label="Profile" />
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
              placeholder="Search assets..."
              className="w-full bg-[#121212] border-[#1c1c1c] rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3e3e42]"
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
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Crawler Dashboard
            </h1>
            <p className="text-[#a1a1a1]">
              Configure target parameters and monitor active ingestion streams.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <ControlPanel
                onStartCrawl={handleStartCrawl}
                isLoading={isTriggering}
              />
            </div>
            <div className="lg:col-span-7">
              <ProgressTracker
                status={activeJob ? activeJob.status : "idle"}
                savedCount={activeJob ? activeJob.saved_count : 0}
                targetCount={activeJob ? activeJob.target_count : 5}
                errorMessage={activeJob?.error_message}
              />
            </div>
          </div>

          <VideoGallery videos={videos} isLoading={isVideosLoading} />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
        active
          ? "bg-[#121212] text-white font-medium"
          : "text-[#a1a1a1] hover:bg-[#121212] hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
