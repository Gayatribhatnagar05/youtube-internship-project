import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface RelatedVideosProps {
  videos: Array<{
    _id: string;
    videotitle: string;
    videochanel?: string;
    category?: string;
    thumbnail?: string;
    filepath?: string;
    views?: number;
    createdAt?: string;
  }>;
}

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
  const cat = (video?.category || "").toLowerCase();
  if (CATEGORY_POSTERS[cat]) return CATEGORY_POSTERS[cat];

  const title = (video?.videotitle || "").toLowerCase();
  for (const [key, poster] of Object.entries(CATEGORY_POSTERS)) {
    if (title.includes(key)) return poster;
  }
  return CATEGORY_POSTERS.technology;
};

export default function RelatedVideos({ videos }: RelatedVideosProps) {
  if (!Array.isArray(videos) || videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white px-1">Related Videos</h3>
      {videos.map((video) => {
        const posterImage = getThumbnailForVideo(video);
        let timeAgo = "recently";
        if (video.createdAt) {
          try {
            const d = new Date(video.createdAt);
            if (!isNaN(d.getTime())) timeAgo = `${formatDistanceToNow(d)} ago`;
          } catch (e) {}
        }

        return (
          <Link
            key={video._id}
            href={`/watch/${video._id}`}
            className="flex gap-2.5 group p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900/80 transition-colors"
          >
            <div className="relative w-40 aspect-video bg-zinc-900 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-zinc-800">
              <img
                src={posterImage}
                alt={video.videotitle || "Video thumbnail"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-1 rounded">
                10:24
              </div>
            </div>
            <div className="flex-1 min-w-0 py-0.5">
              <h4 className="font-semibold text-xs leading-snug line-clamp-2 text-gray-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">
                {video.videotitle}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 truncate">
                {video.videochanel || "Channel"}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                {(video.views || 0).toLocaleString()} views • {timeAgo}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
