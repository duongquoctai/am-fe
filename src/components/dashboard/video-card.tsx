"use client";

import { deleteVideo } from "@/app/actions/delete-video";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Play, Trash2, User } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface VideoCardProps {
  video: {
    id: string;
    storage_url: string;
    thumbnail_url?: string | null;
    author_username?: string | null;
    original_caption?: string | null;
    platform: string;
    affiliate_link?: string | null;
  };
  onDelete: (id: string) => void;
  onClick?: (video: any) => void;
}

export function VideoCard({ video, onDelete, onClick }: VideoCardProps) {
  const [affiliateLink, setAffiliateLink] = React.useState(
    video.affiliate_link || "",
  );
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteVideo(
      video.id,
      video.storage_url,
      video.thumbnail_url || null,
    );
    if (result.success) {
      toast.success("Video deleted successfully");
      setOpen(false);
      onDelete(video.id);
    } else {
      toast.error(result.error || "Failed to delete video");
    }
    setIsDeleting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className="bg-[#121212] border-[#2a2a2a] overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick && onClick(video)}
      >
        <div className="relative aspect-[9/16] bg-[#0a0a0a]">
          {isHovered && video.storage_url ? (
            <video
              src={video.storage_url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.original_caption || "Video"}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-12 h-12 text-[#2a2a2a]" />
            </div>
          )}

          <Badge className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border-[#2a2a2a] uppercase font-bold text-[10px] text-gray-400 z-10">
            {video.platform === "instagram" ? "IG" : video.platform}
          </Badge>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-3 right-3 space-y-2">
            <div className="flex items-center gap-2 text-[#f2f2f2] font-semibold text-sm">
              <User className="w-3 h-3" />@{video.author_username || "unknown"}
            </div>
            <p className="text-[#a1a1a1] text-xs line-clamp-2 leading-relaxed">
              {video.original_caption || "No caption available"}
            </p>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          </div>

          {/* Delete Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button 
                onClick={(e) => e.stopPropagation()} 
                className="absolute top-3 right-3 p-2 rounded-md bg-black/60 backdrop-blur-md border border-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:border-red-500/30 z-10"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#a1a1a1] hover:text-red-500 transition-colors" />
              </button>
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Delete Video</DialogTitle>
                <DialogDescription>
                  This will permanently delete this video and its thumbnail.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#1c1c1c] border-[#2a2a2a] text-[#f2f2f2] h-8"
                  onClick={() => setOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <CardContent 
          className="p-4 space-y-4 relative z-10 bg-[#121212]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-[#a1a1a1] tracking-wider">
              Shopee Affiliate Link
            </label>
            <Input
              value={affiliateLink}
              onChange={(e) => setAffiliateLink(e.target.value)}
              placeholder="Paste link here"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-xs h-8 text-white placeholder:text-[#3e3e42]"
            />
          </div>

          <Button className="w-full bg-[#1c1c1c] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-[#f2f2f2] text-xs h-9">
            Post to Facebook
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
