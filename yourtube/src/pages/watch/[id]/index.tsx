import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videopplayer from "@/components/Videopplayer";
import WatchPartyModal from "@/components/WatchPartyModal";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const FALLBACK_VIDEOS = [
  {
    _id: "667a4d8f1e2f3a4b5c6d7e8f",
    videotitle: "Learn To Build a Real Time Website Like YouTube",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "930KB",
    videochanel: "Elevanceskills Tech",
    Like: 1250,
    views: 45000,
    uploader: "instructor",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e90",
    videotitle: "Full-Stack Next.js 15 & Node.js Masterclass",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.2MB",
    videochanel: "Web Dev Simplified",
    Like: 3420,
    views: 128000,
    uploader: "code_master",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e91",
    videotitle: "React 19 & WebRTC Real-Time Watch Party Tutorial",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "850KB",
    videochanel: "CodeWithTech",
    Like: 890,
    views: 23000,
    uploader: "tech_guru",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e92",
    videotitle: "Razorpay Payment Gateway Integration Guide",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "930KB",
    videochanel: "Fintech Academy",
    Like: 2150,
    views: 67000,
    uploader: "fintech_pro",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const watchIndex = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const [videos, setvideo] = useState<any>(null);
  const [allVideos, setAllVideos] = useState<any[]>(FALLBACK_VIDEOS);
  const [loading, setloading] = useState(true);
  const [isWatchPartyOpen, setIsWatchPartyOpen] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchvideo = async () => {
      if (!id || typeof id !== "string") return;
      try {
        const res = await axiosInstance.get("/video/getall");
        const list = Array.isArray(res.data) && res.data.length > 0 ? res.data : FALLBACK_VIDEOS;
        const target = list.find((vid: any) => vid._id === id) || FALLBACK_VIDEOS[0];
        setvideo(target);
        setAllVideos(list);
      } catch (error) {
        console.log(error);
        const target = FALLBACK_VIDEOS.find((vid: any) => vid._id === id) || FALLBACK_VIDEOS[0];
        setvideo(target);
        setAllVideos(FALLBACK_VIDEOS);
      } finally {
        setloading(false);
      }
    };
    fetchvideo();
  }, [id]);

  const handleDownloadClick = async () => {
    if (!user) {
      toast.error("Please sign in to download videos.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/download/${id}`, {
        userId: user._id || user.id,
      });

      toast.success(
        `Download starting! Downloads today: ${res.data.downloadsToday}/${res.data.quota} (${res.data.userPlan} Plan)`
      );

      const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/${res.data.downloadUrl}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = res.data.videoTitle || "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error(error.response.data.message || "Daily download limit reached.");
      } else {
        toast.error("Failed to initiate download.");
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading video player...</div>;
  }

  if (!videos) {
    return <div className="p-8 text-center text-gray-400">Video not found</div>;
  }

  const handleNextVideo = () => {
    if (!allVideos || allVideos.length === 0) return;
    const currentIndex = allVideos.findIndex((v: any) => v._id === id);
    const nextIndex = (currentIndex + 1) % allVideos.length;
    const nextVideo = allVideos[nextIndex];
    if (nextVideo) {
      router.push(`/watch/${nextVideo._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 dark:text-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Videopplayer
              video={videos}
              videoElementRef={videoElementRef}
              onNextVideo={handleNextVideo}
            />
            <VideoInfo
              video={videos}
              onWatchPartyClick={() => setIsWatchPartyOpen(true)}
              onDownloadClick={handleDownloadClick}
            />
            <Comments videoId={(id as string) || ""} />
          </div>
          <div className="space-y-4">
            <RelatedVideos videos={allVideos} />
          </div>
        </div>
      </div>

      <WatchPartyModal
        isOpen={isWatchPartyOpen}
        onClose={() => setIsWatchPartyOpen(false)}
        video={videos}
        currentUser={user ? { id: user._id, name: user.name || user.email } : undefined}
        videoRef={videoElementRef}
      />
    </div>
  );
};

export default watchIndex;
