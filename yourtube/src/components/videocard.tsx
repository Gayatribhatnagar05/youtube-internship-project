"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";

const CATEGORY_POSTERS: Record<string, string> = {
  technology: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
  education: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
  gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
  news: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80",
  sports: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
  music: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
  movies: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
  comedy: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
  science: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
  travel: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  food: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
  fashion: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
};

const getThumbnailForVideo = (video: any): string => {
  if (video?.thumbnail) return video.thumbnail;
  if (video?.poster) return video.poster;

  const cat = (video?.category || "").toLowerCase();
  if (CATEGORY_POSTERS[cat]) return CATEGORY_POSTERS[cat];

  const title = (video?.videotitle || "").toLowerCase();
  if (title.includes("tech") || title.includes("code") || title.includes("website") || title.includes("react")) {
    return CATEGORY_POSTERS.technology;
  }
  if (title.includes("next.js") || title.includes("masterclass") || title.includes("guide") || title.includes("razorpay")) {
    return CATEGORY_POSTERS.education;
  }
  if (title.includes("game") || title.includes("watch party") || title.includes("esports")) {
    return CATEGORY_POSTERS.gaming;
  }
  if (title.includes("news") || title.includes("trend")) {
    return CATEGORY_POSTERS.news;
  }
  if (title.includes("sport") || title.includes("football") || title.includes("championship")) {
    return CATEGORY_POSTERS.sports;
  }
  if (title.includes("music") || title.includes("beats") || title.includes("lo-fi") || title.includes("acoustic")) {
    return CATEGORY_POSTERS.music;
  }
  if (title.includes("movie") || title.includes("trailer") || title.includes("cinema")) {
    return CATEGORY_POSTERS.movies;
  }
  if (title.includes("comedy") || title.includes("funny") || title.includes("parody")) {
    return CATEGORY_POSTERS.comedy;
  }
  if (title.includes("science") || title.includes("quantum") || title.includes("universe")) {
    return CATEGORY_POSTERS.science;
  }
  if (title.includes("travel") || title.includes("island") || title.includes("destination")) {
    return CATEGORY_POSTERS.travel;
  }
  if (title.includes("food") || title.includes("pasta") || title.includes("cooking")) {
    return CATEGORY_POSTERS.food;
  }
  if (title.includes("fashion") || title.includes("lookbook") || title.includes("style")) {
    return CATEGORY_POSTERS.fashion;
  }

  return CATEGORY_POSTERS.technology;
};

export default function VideoCard({ video }: { video: any }) {
  if (!video) return null;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const videoSrc = video.filepath
    ? `${backendUrl}/${video.filepath}`
    : "/video/vdo.mp4";

  const posterImage = getThumbnailForVideo(video);
  const viewsCount = typeof video.views === "number" ? video.views.toLocaleString() : "1.2K";

  let timeAgo = "recently";
  if (video.createdAt) {
    try {
      const d = new Date(video.createdAt);
      if (!isNaN(d.getTime())) {
        timeAgo = `${formatDistanceToNow(d)} ago`;
      }
    } catch (e) {}
  }

  const channelName = video.videochanel || video.uploader || "YouTube 2.0";
  const initial = channelName.charAt(0).toUpperCase();

  return (
    <Link href={`/watch/${video._id}`} className="group block">
      <div className="space-y-3 bg-white dark:bg-zinc-900/60 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800/80 hover:shadow-lg transition-all">
        {/* Video Thumbnail Container with Poster Image Cover */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
          <img
            src={posterImage}
            alt={video.videotitle || "Video thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono px-1.5 py-0.5 rounded font-medium">
            10:24
          </div>
        </div>

        {/* Video Metadata */}
        <div className="flex gap-3 pt-0.5">
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="bg-red-600 text-white font-bold text-xs">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
              {video.videotitle || "Untitled Video"}
            </h3>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 font-medium truncate">
              {channelName}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">
              {viewsCount} views • {timeAgo}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
