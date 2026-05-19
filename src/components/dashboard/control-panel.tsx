"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play } from "lucide-react";
import * as React from "react";

interface ControlPanelProps {
  onStartCrawl: (data: {
    platform: string;
    target: string;
    crawlType: string;
    limit: number;
  }) => void;
  isLoading?: boolean;
}

export function ControlPanel({ onStartCrawl, isLoading }: ControlPanelProps) {
  const [platform, setPlatform] = React.useState("instagram");
  const [target, setTarget] = React.useState("");
  const [crawlType, setCrawlType] = React.useState("hashtag");
  const [limit, setLimit] = React.useState(5);

  const handleStart = () => {
    if (!target) return;
    onStartCrawl({ platform, target, crawlType, limit });
  };

  return (
    <Card className="bg-[#121212] border-[#2a2a2a] text-[#f2f2f2]">
      <CardHeader className="border-b border-[#2a2a2a] py-4">
        <CardTitle className="text-lg font-semibold">
          Target Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <label className="text-sm text-[#a1a1a1]">Platform</label>
          <Tabs value={platform} onValueChange={setPlatform} className="w-full">
            <TabsList className="grid grid-cols-4 bg-[#1c1c1c] p-1 h-10 border border-[#2a2a2a]">
              <TabsTrigger
                value="instagram"
                className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white"
              >
                Instagram
              </TabsTrigger>
              <TabsTrigger
                value="douyin"
                className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white"
              >
                Douyin
              </TabsTrigger>
              <TabsTrigger
                value="xiaohongshu"
                className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white"
              >
                Red
              </TabsTrigger>
              <TabsTrigger
                value="tiktok"
                className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white"
              >
                TikTok
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#a1a1a1]">
            Target (Keyword or Username)
          </label>
          <Input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="tech_reviewer or aothunnam"
            className="bg-[#0a0a0a] border-[#2a2a2a] text-white focus:ring-1 focus:ring-[#3e3e42]"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm text-[#a1a1a1]">Crawl Type</label>
            <div className="flex gap-2 p-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-md">
              <Button
                variant={crawlType === "hashtag" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 h-8 rounded"
                onClick={() => setCrawlType("hashtag")}
              >
                {platform === "instagram" ? "Hashtag" : "Keyword"}
              </Button>
              {(platform === "instagram" || platform === "tiktok") && (
                <Button
                  variant={crawlType === "profile" ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-1 h-8 rounded"
                  onClick={() => setCrawlType("profile")}
                >
                  Profile
                </Button>
              )}
            </div>
          </div>

          <div className="w-32 space-y-2">
            <label className="text-sm text-[#a1a1a1]">Limit (5-10)</label>
            <Input
              type="number"
              min={5}
              max={10}
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
            />
          </div>
        </div>

        <Button
          onClick={handleStart}
          disabled={isLoading || !target}
          className="w-full bg-[#f2f2f2] text-black hover:bg-[#d1d1d1] font-bold h-11"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4 fill-current" />
          )}
          {isLoading ? "Crawling..." : "Start Crawl"}
        </Button>
      </CardContent>
    </Card>
  );
}
