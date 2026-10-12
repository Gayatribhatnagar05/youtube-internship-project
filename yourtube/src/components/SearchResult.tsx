"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axiosInstance from "@/lib/axiosinstance";

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
  study: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
};

const DEMO_CATALOG = [
  {
    _id: "667a4d8f1e2f3a4b5c6d7ea2",
    videotitle: "Aesthetic Productive Study Vlog: 4-Hour Study With Me & Exam Prep",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    videochanel: "Study & Productivity Vlogs",
    category: "Education",
    views: 165000,
    uploader: "study_vlogger",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e8f",
    videotitle: "Learn To Build a Real Time Website Like YouTube",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    videochanel: "Elevanceskills Tech",
    category: "Technology",
    views: 45000,
    uploader: "instructor",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e90",
    videotitle: "Full-Stack Next.js 15 & Node.js Masterclass",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    videochanel: "Web Dev Simplified",
    category: "Education",
    views: 128000,
    uploader: "code_master",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e91",
    videotitle: "React 19 & WebRTC Real-Time Watch Party Gameplay",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    videochanel: "CodeWithTech",
    category: "Gaming",
    views: 23000,
    uploader: "tech_guru",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e92",
    videotitle: "Razorpay Payment Gateway Integration Guide",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    videochanel: "Fintech Academy",
    category: "Education",
    views: 67000,
    uploader: "fintech_pro",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e93",
    videotitle: "Global Tech News & Software Trends 2026",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80",
    videochanel: "World News Daily",
    category: "News",
    views: 89000,
    uploader: "news_desk",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e99",
    videotitle: "Top 10 Hidden Island Travel Destinations Vlogs",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    videochanel: "Traveler Vlogs",
    category: "Travel",
    views: 142000,
    uploader: "globetrotter",
    createdAt: new Date(Date.now() - 864000000).toISOString(),
  },
];

const getThumbnailForVideo = (video: any): string => {
  if (video?.thumbnail) return video.thumbnail;
  if (video?.poster) return video.poster;
  const cat = (video?.category || "").toLowerCase();
  if (CATEGORY_POSTERS[cat]) return CATEGORY_POSTERS[cat];

  const title = (video?.videotitle || "").toLowerCase();
  if (title.includes("study") || title.includes("vlog") || title.includes("exam")) {
    return CATEGORY_POSTERS.study;
  }
  return CATEGORY_POSTERS.technology;
};

const SearchResult = ({ query }: { query?: string }) => {
  const searchTerm = (query || "").trim();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/video/getall");
        let pool = Array.isArray(res.data) && res.data.length > 0 ? res.data : DEMO_CATALOG;

        const combined = [...pool];
        DEMO_CATALOG.forEach((demo) => {
          if (!combined.some((v) => v._id === demo._id)) {
            combined.push(demo);
          }
        });

        if (!searchTerm) {
          setResults(combined);
        } else {
          const lowerQuery = searchTerm.toLowerCase();
          const words = lowerQuery.split(" ").filter((w) => w.length > 0);

          let filtered = combined.filter((vid) => {
            const title = (vid.videotitle || "").toLowerCase();
            const channel = (vid.videochanel || "").toLowerCase();
            const cat = (vid.category || "").toLowerCase();

            return words.some(
              (w) => title.includes(w) || channel.includes(w) || cat.includes(w)
            );
          });

          if (filtered.length === 0) {
            filtered = combined;
          }

          setResults(filtered);
        }
      } catch (error) {
        setResults(DEMO_CATALOG);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [searchTerm]);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Searching videos...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Search results for "{searchTerm || "All Videos"}" ({results.length})
      </h2>

      <div className="space-y-4">
        {results.map((video: any) => {
          const poster = getThumbnailForVideo(video);
          return (
            <div key={video._id} className="flex flex-col sm:flex-row gap-4 group">
              <Link href={`/watch/${video._id}`} className="shrink-0">
                <div className="relative w-full sm:w-72 aspect-video bg-gray-900 rounded-xl overflow-hidden border border-zinc-800">
                  <img
                    src={poster}
                    alt={video.videotitle || "Thumbnail"}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-mono px-1.5 py-0.5 rounded font-medium">
                    10:24
                  </div>
                </div>
              </Link>

              <div className="flex-1 min-w-0 py-1 space-y-2">
                <Link href={`/watch/${video._id}`}>
                  <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.videotitle}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
                  <span>{(video.views || 0).toLocaleString()} views</span>
                  <span>•</span>
                  <span>
                    {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) : "recently"} ago
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-red-600 text-white font-bold text-xs">
                      {video.videochanel?.[0]?.toUpperCase() || "V"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                    {video.videochanel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResult;
