"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  SkipForward,
  Loader2,
} from "lucide-react";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
  videoElementRef?: React.MutableRefObject<HTMLVideoElement | null>;
  onNextVideo?: () => void;
}

export default function VideoPlayer({ video, videoElementRef, onNextVideo }: VideoPlayerProps) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = videoElementRef || localVideoRef;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [gestureFeedback, setGestureFeedback] = useState<"-10s" | "+10s" | null>(null);

  const lastTapRef = useRef<{ time: number; side: "left" | "right" }>({
    time: 0,
    side: "right",
  });
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoSrc = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/${video?.filepath}`;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoadedMetadata = () => {
      setDuration(el.duration);
      setIsLoading(false);
    };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [videoRef, video]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  };

  const seek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      Math.max(0, videoRef.current.currentTime + seconds),
      duration || Infinity
    );
  };

  const handleSeekSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Mobile Double-Tap Gesture Handler (Left half = rewind 10s, Right half = skip 10s)
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    const touch = e.changedTouches[0];
    if (!touch || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const side = touch.clientX - rect.left < rect.width / 2 ? "left" : "right";

    if (now - lastTapRef.current.time < 300 && lastTapRef.current.side === side) {
      // Double tap detected!
      if (side === "left") {
        seek(-10);
        triggerGestureAnimation("-10s");
      } else {
        seek(10);
        triggerGestureAnimation("+10s");
      }
    }

    lastTapRef.current = { time: now, side };
  };

  const triggerGestureAnimation = (type: "-10s" | "+10s") => {
    setGestureFeedback(type);
    setTimeout(() => setGestureFeedback(null), 800);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return "0:00";
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchEnd={handleTouchEnd}
      className="relative aspect-video bg-black rounded-xl overflow-hidden group select-none shadow-xl border border-zinc-800"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        poster="/placeholder.svg?height=480&width=854"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-20">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        </div>
      )}

      {/* Double Tap Gesture Feedback Overlay */}
      {gestureFeedback && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 p-6 bg-black/70 backdrop-blur-md rounded-full text-white font-black text-lg flex items-center gap-1 z-30 animate-ping ${
            gestureFeedback === "-10s" ? "left-12" : "right-12"
          }`}
        >
          {gestureFeedback === "-10s" ? "≪ 10s Rewind" : "10s Skip ≫"}
        </div>
      )}

      {/* Custom Control Bar Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4 transition-opacity duration-300 z-10 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top Video Title */}
        <div className="text-white text-sm font-semibold truncate drop-shadow-md">
          {video?.videotitle}
        </div>

        {/* Center Quick Play Overlay Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="p-4 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-transform hover:scale-110 backdrop-blur-sm shadow-lg"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-white ml-0.5" />}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-2">
          {/* Progress Seek Slider */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekSlider}
              className="w-full h-1.5 bg-zinc-700 accent-red-600 rounded-lg appearance-none cursor-pointer hover:h-2 transition-all"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="hover:text-red-500 transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button
                onClick={() => seek(-10)}
                className="hover:text-red-500 transition-colors flex items-center text-[10px] font-bold"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-4 h-4 mr-0.5" /> -10s
              </button>

              <button
                onClick={() => seek(10)}
                className="hover:text-red-500 transition-colors flex items-center text-[10px] font-bold"
                title="Skip 10 seconds"
              >
                <RotateCw className="w-4 h-4 mr-0.5" /> +10s
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1 group/vol">
                <button onClick={toggleMute} className="hover:text-red-500 transition-colors">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-red-500" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-zinc-600 accent-red-600 rounded cursor-pointer"
                />
              </div>

              {/* Time Display */}
              <span className="text-zinc-300 font-mono text-xs ml-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {onNextVideo && (
                <button
                  onClick={onNextVideo}
                  className="flex items-center gap-1 bg-zinc-800/80 hover:bg-zinc-700 text-xs px-2.5 py-1 rounded transition-colors"
                  title="Next Video"
                >
                  <SkipForward className="w-4 h-4" /> Next
                </button>
              )}

              <button onClick={toggleFullscreen} className="hover:text-red-500 transition-colors">
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
