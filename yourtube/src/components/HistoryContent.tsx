"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

export default function HistoryContent() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setLoading(true);
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      const historyData = await axiosInstance.get(`/history/${user?._id}`);
      setHistory(historyData.data);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading history...</div>;
  }

  const handleRemoveFromHistory = async (historyId: string) => {
    try {
      console.log("Removing from history:", historyId);
      await axiosInstance.delete(`/history/${historyId}`);
      setHistory((prev) => prev.filter((item) => item._id !== historyId));
    } catch (error) {
      console.error("Error removing from history:", error);
    }
  };

  const handleClearAllHistory = async () => {
    if (!user) return;
    try {
      await axiosInstance.delete(`/history/clear/${user._id || user.id}`);
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Keep track of what you watch
        </h2>
        <p className="text-gray-600">
          Watch history isn't viewable when signed out.
        </p>
      </div>
    );
  }

  const validHistory = history.filter((item) => item && item.videoid);

  if (validHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No watch history yet</h2>
        <p className="text-gray-600 dark:text-zinc-400">Videos you watch will appear here.</p>
      </div>
    );
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-zinc-400">{validHistory.length} videos</p>
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          onClick={handleClearAllHistory}
        >
          Clear all watch history
        </Button>
      </div>

      <div className="space-y-4">
        {validHistory.map((item) => (
          <div key={item._id} className="flex gap-4 group">
            <Link href={`/watch/${item.videoid._id}`} className="flex-shrink-0">
              <div className="relative w-40 aspect-video bg-gray-100 dark:bg-zinc-800 rounded overflow-hidden">
                <video
                  src={item.videoid?.filepath ? `${backendUrl}/${item.videoid.filepath}` : "/video/vdo.mp4"}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/watch/${item.videoid._id}`}>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 dark:text-white mb-1">
                  {item.videoid.videotitle}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                {item.videoid.videochanel || "Channel"}
              </p>
              <p className="text-sm text-gray-600 dark:text-zinc-500">
                {(item.videoid.views || 0).toLocaleString()} views •{" "}
                {item.videoid.createdAt ? formatDistanceToNow(new Date(item.videoid.createdAt)) : "recently"} ago
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                Added {item.createdAt ? formatDistanceToNow(new Date(item.createdAt)) : "recently"} ago
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleRemoveFromHistory(item._id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove from watch history
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}
