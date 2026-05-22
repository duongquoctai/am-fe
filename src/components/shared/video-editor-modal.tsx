"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sliders,
  FlipHorizontal,
  Scissors,
  Gauge,
  Video,
  Loader2,
  Sparkles,
  RotateCcw,
  Check,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// Safe dynamic imports for Remotion to prevent Next.js SSR build errors
const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false }
);

// Inner component for Remotion preview (compiled dynamically only on client side)
interface VideoPreviewProps {
  src: string;
  flipHorizontal: boolean;
  playbackRate: number;
  trimStart: number;
  trimEnd: number;
  fps?: number;
}

let AbsoluteFill: any = null;
let RemotionVideo: any = null;

if (typeof window !== "undefined") {
  // Load Remotion imports strictly on client-side
  const remotion = require("remotion");
  AbsoluteFill = remotion.AbsoluteFill;
  RemotionVideo = remotion.Video;
}

function VideoPreview({
  src,
  flipHorizontal,
  playbackRate,
  trimStart,
  trimEnd,
  fps = 30,
}: VideoPreviewProps) {
  if (!AbsoluteFill || !RemotionVideo) return null;

  const startFrom = Math.floor(trimStart * fps);
  const endAt = Math.ceil(trimEnd * fps);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      <RemotionVideo
        src={src}
        startFrom={startFrom}
        endAt={endAt}
        playbackRate={playbackRate}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: flipHorizontal ? "scaleX(-1)" : "none",
        }}
      />
    </AbsoluteFill>
  );
}

interface VideoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: string;
    storage_url: string;
    duration?: number | null;
  } | null;
}

export function VideoEditorModal({ isOpen, onClose, video }: VideoEditorModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [duration, setDuration] = React.useState<number>(0);
  const [trimStart, setTrimStart] = React.useState<number>(0);
  const [trimEnd, setTrimEnd] = React.useState<number>(0);
  const [flipHorizontal, setFlipHorizontal] = React.useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = React.useState<number>(1.0);
  const [isMetadataLoading, setIsMetadataLoading] = React.useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when modal is active
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Load Video Duration and metadata dynamically
  React.useEffect(() => {
    if (!video?.storage_url || !isOpen) return;

    setIsMetadataLoading(true);
    // Initialize default states
    setFlipHorizontal(false);
    setPlaybackRate(1.0);
    setTrimStart(0);

    const tempVideo = document.createElement("video");
    tempVideo.src = video.storage_url;
    
    const handleLoadedMetadata = () => {
      const vidDuration = tempVideo.duration || video.duration || 30;
      setDuration(vidDuration);
      setTrimEnd(vidDuration);
      setIsMetadataLoading(false);
    };

    const handleError = () => {
      // Fallback
      const fallbackDuration = video.duration || 30;
      setDuration(fallbackDuration);
      setTrimEnd(fallbackDuration);
      setIsMetadataLoading(false);
    };

    tempVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
    tempVideo.addEventListener("error", handleError);

    return () => {
      tempVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
      tempVideo.removeEventListener("error", handleError);
    };
  }, [video?.storage_url, isOpen, video?.duration]);

  if (!mounted || !isOpen || !video) return null;

  const handleReset = () => {
    setTrimStart(0);
    setTrimEnd(duration);
    setFlipHorizontal(false);
    setPlaybackRate(1.0);
    toast.info("Editor settings reset to default");
  };

  const handleApplyChanges = async () => {
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      // 1. Immediately toggle video edit status to 'editing' in database
      // This will instantly trigger the realtime spinner overlay on the video card
      const { error: dbError } = await supabase
        .from("videos")
        .update({ edit_status: "editing" })
        .eq("id", video.id);

      if (dbError) throw new Error("Failed to set video edit status to editing");

      // 2. Dispatch rendering command to python backend
      const response = await fetch(`http://localhost:8000/api/videos/${video.id}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flip_horizontal: flipHorizontal,
          speed: playbackRate,
          trim_start: parseFloat(trimStart.toFixed(2)),
          trim_end: parseFloat(trimEnd.toFixed(2)),
        }),
      });

      if (!response.ok) {
        throw new Error("Rendering service was unable to accept request");
      }

      toast.success("Asset modification applied! Background compilation started.");
      onClose();
    } catch (error: any) {
      console.error("[VideoEditorModal] Error applying changes:", error);
      toast.error(error.message || "Something went wrong during request generation");
      
      // Revert status to failed if request failed
      await supabase
        .from("videos")
        .update({ edit_status: "failed" })
        .eq("id", video.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe Remotion playback settings
  const fps = 30;
  const trimDuration = Math.max(0.1, trimEnd - trimStart);
  const durationInFrames = Math.max(1, Math.ceil((trimDuration / playbackRate) * fps));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      >
        {/* Editor Main Container */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ duration: 0.3, type: "spring", bounce: 0.15 }}
          className="relative bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row h-[85vh] shadow-3xl"
        >
          {/* Header Close button strictly for top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-[#141414] border border-[#232323] hover:bg-[#1f1f1f] transition-all text-[#888] hover:text-white"
            aria-label="Close Editor"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Panel: Remotion Player Console */}
          <div className="flex-1 bg-[#050505] flex flex-col justify-center items-center relative p-6 border-b md:border-b-0 md:border-r border-[#1a1a1a] min-h-[300px] md:h-full">
            <div className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
              <Video className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Real-time Preview
            </div>

            {isMetadataLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm text-gray-400 font-medium">Analyzing asset timelines...</p>
              </div>
            ) : (
              <div className="relative aspect-[9/16] w-full max-w-[320px] max-h-[70vh] rounded-xl overflow-hidden border border-[#232323] shadow-2xl bg-[#000] flex items-center justify-center">
                {typeof window !== "undefined" && (
                  <Player
                    component={VideoPreview as React.ComponentType<any>}
                    inputProps={{
                      src: video.storage_url,
                      flipHorizontal,
                      playbackRate,
                      trimStart,
                      trimEnd,
                      fps,
                    }}
                    durationInFrames={durationInFrames}
                    fps={fps}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    controls
                  />
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Advanced Controls Console */}
          <div className="w-full md:w-[380px] p-6 flex flex-col justify-between bg-[#0a0a0a] overflow-y-auto h-full space-y-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Hybrid Processing
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Studio Editor</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Real-time preview powered by Remotion Player. Execution takes place asynchronously on python nodes.
                </p>
              </div>

              <div className="h-px bg-[#1c1c1c]" />

              {/* Option: Flip Mirroring */}
              <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <FlipHorizontal className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Mirror Orientation</h4>
                      <p className="text-[10px] text-gray-400">Horizontal scale reflection</p>
                    </div>
                  </div>
                  <Switch
                    checked={flipHorizontal}
                    onCheckedChange={setFlipHorizontal}
                  />
                </div>
              </div>

              {/* Option: Playback Speed */}
              <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Playback Rate</h4>
                      <p className="text-[10px] text-gray-400">Speed multiplier index</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#1c1c1c] text-xs font-mono font-bold text-blue-400 border border-[#2a2a2a]">
                    {playbackRate.toFixed(2)}x
                  </span>
                </div>
                <Slider
                  value={[playbackRate]}
                  onValueChange={([val]) => setPlaybackRate(val)}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="py-1"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>0.5x (Slow)</span>
                  <span>1.0x (Normal)</span>
                  <span>2.0x (Fast)</span>
                </div>
              </div>

              {/* Option: Trim Timeline Range */}
              <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Timeline Crop</h4>
                      <p className="text-[10px] text-gray-400">In/Out clipping bounds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-[#1c1c1c] text-[10px] font-mono font-bold text-gray-300 border border-[#2a2a2a]">
                      {trimStart.toFixed(1)}s
                    </span>
                    <span className="text-[10px] text-gray-600">—</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#1c1c1c] text-[10px] font-mono font-bold text-gray-300 border border-[#2a2a2a]">
                      {trimEnd.toFixed(1)}s
                    </span>
                  </div>
                </div>

                {/* Range Slider for trimming - Double thumb control */}
                <div className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Trim Start</label>
                    <Slider
                      value={[trimStart]}
                      onValueChange={([val]) => setTrimStart(Math.min(val, trimEnd - 0.1))}
                      min={0}
                      max={duration || 100}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Trim End</label>
                    <Slider
                      value={[trimEnd]}
                      onValueChange={([val]) => setTrimEnd(Math.max(val, trimStart + 0.1))}
                      min={0}
                      max={duration || 100}
                      step={0.1}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>0.0s</span>
                  <span>Clip Duration: {(duration).toFixed(1)}s</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#1c1c1c] flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="w-12 px-0 bg-transparent border-[#222] hover:bg-[#121212] text-gray-400 hover:text-white h-9"
                title="Reset Settings"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-[#222] hover:bg-[#121212] text-[#f2f2f2] text-xs h-9"
              >
                Cancel
              </Button>

              <Button
                onClick={handleApplyChanges}
                disabled={isSubmitting || isMetadataLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 shadow-lg shadow-blue-500/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Rendering...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Apply & Render
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
