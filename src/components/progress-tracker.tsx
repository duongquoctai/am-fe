"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressTrackerProps {
  status: "pending" | "processing" | "completed" | "failed" | "idle";
  savedCount: number;
  targetCount: number;
  errorMessage?: string | null;
}

export function ProgressTracker({
  status,
  savedCount,
  targetCount,
  errorMessage,
}: ProgressTrackerProps) {
  const percentage =
    targetCount > 0 ? Math.min(100, Math.round((savedCount / targetCount) * 100)) : 0;

  const statusConfig = {
    idle: {
      label: "Waiting",
      icon: Clock,
      color: "bg-[#1c1c1c] text-[#a1a1a1]",
    },
    pending: {
      label: "Queued",
      icon: Loader2,
      color: "bg-yellow-500/10 text-yellow-500",
    },
    processing: {
      label: "Processing",
      icon: Loader2,
      color: "bg-blue-500/10 text-blue-500 animate-pulse",
    },
    completed: {
      label: "Finished",
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-500",
    },
    failed: {
      label: "Error",
      icon: XCircle,
      color: "bg-red-500/10 text-red-500",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.idle;
  const StatusIcon = currentStatus.icon;

  return (
    <Card className="bg-[#121212] border-[#2a2a2a] text-[#f2f2f2] h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-[#2a2a2a]">
        <CardTitle className="text-lg font-semibold">Crawl Status</CardTitle>
        <Badge
          variant="outline"
          className={`${currentStatus.color} border-none px-3 py-1 font-medium`}
        >
          <StatusIcon
            className={`mr-2 h-3.5 w-3.5 ${
              status === "processing" || status === "pending"
                ? "animate-spin"
                : ""
            }`}
          />
          {currentStatus.label}
        </Badge>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#a1a1a1]">Job Status</span>
            <span className="font-medium text-[#f2f2f2]">
              {status === "processing"
                ? "Fetching from Platform..."
                : status === "completed"
                  ? "All assets ingested"
                  : status === "failed"
                    ? "Job failed"
                    : status === "pending"
                      ? "In crawl queue..."
                      : "Ready to start"}
            </span>
          </div>
          {errorMessage && (
            <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-sm text-[#a1a1a1]">Progress</span>
              <div className="text-2xl font-bold">{percentage}%</div>
            </div>
            <div className="text-right space-y-1">
              <span className="text-sm text-[#a1a1a1]">Videos Saved</span>
              <div className="text-2xl font-bold">
                {savedCount} / {targetCount}
              </div>
            </div>
          </div>
          <Progress value={percentage} className="h-3 bg-[#1c1c1c]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-blue-600 rounded-full"
            />
          </Progress>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a2a2a]">
          <div className="p-3 bg-[#1c1c1c] rounded-lg border border-[#2a2a2a]">
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Success Rate</div>
            <div className="text-xl font-bold">
              {savedCount > 0 ? `${percentage}%` : "--"}
            </div>
          </div>
          <div className="p-3 bg-[#1c1c1c] rounded-lg border border-[#2a2a2a]">
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Latency</div>
            <div className="text-xl font-bold">~1.2s</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
