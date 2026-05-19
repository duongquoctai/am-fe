"use client"

import * as React from "react"
import { VideoCard } from "./video-card"
import { Button } from "@/components/ui/button"
import { Filter, Layers } from "lucide-react"
import { VideoPlayerModal } from "../shared/video-player-modal"

interface VideoGalleryProps {
  videos: any[]
  isLoading?: boolean
  onDelete?: (id: string) => void
}

export function VideoGallery({ videos, isLoading, onDelete }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = React.useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
        <h2 className="text-xl font-bold text-[#f2f2f2]">Ingested Assets</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-[#1c1c1c] border-[#2a2a2a] text-[#f2f2f2] h-8 text-xs">
            <Layers className="mr-2 h-3.5 w-3.5" />
            Select All
          </Button>
          <Button variant="outline" size="sm" className="bg-[#1c1c1c] border-[#2a2a2a] text-[#f2f2f2] h-8 text-xs">
            <Filter className="mr-2 h-3.5 w-3.5" />
            Filter
          </Button>
        </div>
      </div>

      {videos.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#2a2a2a] rounded-xl bg-[#121212]/50">
          <div className="w-12 h-12 rounded-full bg-[#1c1c1c] flex items-center justify-center mb-4">
            <Layers className="w-6 h-6 text-[#3e3e42]" />
          </div>
          <p className="text-[#a1a1a1]">No assets ingested yet. Start a crawl to see videos here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onDelete={onDelete || (() => {})} 
              onClick={setSelectedVideo}
            />
          ))}
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[9/16] bg-[#1c1c1c] animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      <VideoPlayerModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.storage_url || null}
      />
    </div>
  )
}
