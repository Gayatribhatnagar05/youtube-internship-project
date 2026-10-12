import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Clock,
  Download,
  MoreHorizontal,
  Share,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

const VideoInfo = ({ video, onWatchPartyClick, onDownloadClick }: any) => {
  const [likes, setlikes] = useState(video.Like || 0);
  const [dislikes, setDislikes] = useState(video.Dislike || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { user } = useUser();
  const [isWatchLater, setIsWatchLater] = useState(false);

  // const user: any = {
  //   id: "1",
  //   name: "John Doe",
  //   email: "john@example.com",
  //   image: "https://github.com/shadcn.png?height=32&width=32",
  // };
  useEffect(() => {
    setlikes(video.Like || 0);
    setDislikes(video.Dislike || 0);
    setIsLiked(false);
    setIsDisliked(false);
  }, [video]);

  useEffect(() => {
    const handleviews = async () => {
      if (!video?._id) return;
      try {
        if (user) {
          await axiosInstance.post(`/history/${video._id}`, {
            userId: user?._id,
          });
        } else {
          await axiosInstance.post(`/history/views/${video._id}`);
        }
      } catch (error) {
        console.log("View history error:", error);
      }
    };
    handleviews();
  }, [user, video?._id]);
  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.post(`/like/${video._id}`, {
        userId: user?._id,
      });
      if (res.data.liked) {
        if (isLiked) {
          setlikes((prev: any) => prev - 1);
          setIsLiked(false);
        } else {
          setlikes((prev: any) => prev + 1);
          setIsLiked(true);
          if (isDisliked) {
            setDislikes((prev: any) => prev - 1);
            setIsDisliked(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleWatchLater = async () => {
    try {
      const res = await axiosInstance.post(`/watch/${video._id}`, {
        userId: user?._id,
      });
      if (res.data.watchlater) {
        setIsWatchLater(!isWatchLater);
      } else {
        setIsWatchLater(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDislike = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.post(`/like/${video._id}`, {
        userId: user?._id,
      });
      if (!res.data.liked) {
        if (isDisliked) {
          setDislikes((prev: any) => prev - 1);
          setIsDisliked(false);
        } else {
          setDislikes((prev: any) => prev + 1);
          setIsDisliked(true);
          if (isLiked) {
            setlikes((prev: any) => prev - 1);
            setIsLiked(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{video.videotitle}</h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-red-600 text-white font-bold">
              {video?.videochanel?.[0]?.toUpperCase() || "Y"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{video?.videochanel || "YouTube Channel"}</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">1.2M subscribers</p>
          </div>
          <Button className="ml-2 bg-red-600 hover:bg-red-700 text-white">Subscribe</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-l-full dark:hover:bg-zinc-700"
              onClick={handleLike}
            >
              <ThumbsUp
                className={`w-4 h-4 mr-1.5 ${
                  isLiked ? "fill-red-600 text-red-600 dark:fill-red-500" : ""
                }`}
              />
              {likes.toLocaleString()}
            </Button>
            <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700" />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-r-full dark:hover:bg-zinc-700"
              onClick={handleDislike}
            >
              <ThumbsDown
                className={`w-4 h-4 mr-1.5 ${
                  isDisliked ? "fill-red-600 text-red-600 dark:fill-red-500" : ""
                }`}
              />
              {dislikes.toLocaleString()}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full ${
              isWatchLater ? "text-primary font-semibold" : ""
            }`}
            onClick={handleWatchLater}
          >
            <Clock className="w-4 h-4 mr-1.5" />
            {isWatchLater ? "Saved" : "Watch Later"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/60 dark:text-red-400 dark:hover:bg-red-900/50 rounded-full font-semibold border border-red-200 dark:border-red-900/50"
            onClick={onWatchPartyClick}
          >
            <Users className="w-4 h-4 mr-1.5" />
            Watch Party
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full"
            onClick={onDownloadClick}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full"
          >
            <Share className="w-4 h-4 mr-1.5" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full h-8 w-8"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-4">
        <div className="flex gap-4 text-sm font-medium mb-2 text-gray-700 dark:text-zinc-300">
          <span>{(video?.views || 0).toLocaleString()} views</span>
          <span>
            {video?.createdAt ? formatDistanceToNow(new Date(video.createdAt)) : "recently"} ago
          </span>
        </div>
        <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"}`}>
          <p>
            Sample video description. This would contain the actual video
            description from the database.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 p-0 h-auto font-medium"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show less" : "Show more"}
        </Button>
      </div>
    </div>
  );
};

export default VideoInfo;
