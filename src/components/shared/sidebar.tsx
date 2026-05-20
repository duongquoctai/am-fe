"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Database, Settings, User } from "lucide-react";
import * as React from "react";

export function Sidebar() {
  const pathname = usePathname();

  // Compute active states dynamically based on current routing path
  const isHomeActive = pathname === "/";
  const isJobsActive = pathname.startsWith("/jobs");

  return (
    <aside className="w-64 border-r border-[#1c1c1c] bg-[#0a0a0a] hidden md:flex flex-col flex-shrink-0">
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
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
              isHomeActive
                ? "bg-[#121212] text-white font-medium"
                : "text-[#a1a1a1] hover:bg-[#121212] hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} />
            Home
          </Link>
          <Link
            href="/jobs"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
              isJobsActive
                ? "bg-[#121212] text-white font-medium"
                : "text-[#a1a1a1] hover:bg-[#121212] hover:text-white"
            }`}
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
  );
}
