"use client";

import React, { useEffect, useState } from "react";
import Videocard from "./videocard";
import axiosInstance from "@/lib/axiosinstance";

const CATEGORY_CATALOG = [
  {
    _id: "667a4d8f1e2f3a4b5c6d7e8f",
    videotitle: "Learn To Build a Real Time Website Like YouTube",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    filesize: "930KB",
    videochanel: "Elevanceskills Tech",
    category: "Technology",
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
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    filesize: "1.2MB",
    videochanel: "Web Dev Simplified",
    category: "Education",
    Like: 3420,
    views: 128000,
    uploader: "code_master",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e91",
    videotitle: "React 19 & WebRTC Real-Time Watch Party Gameplay",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    filesize: "850KB",
    videochanel: "CodeWithTech",
    category: "Gaming",
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
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    filesize: "930KB",
    videochanel: "Fintech Academy",
    category: "Education",
    Like: 2150,
    views: 67000,
    uploader: "fintech_pro",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e93",
    videotitle: "Global Tech News & Software Trends 2026",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80",
    filesize: "1.1MB",
    videochanel: "World News Daily",
    category: "News",
    Like: 1420,
    views: 89000,
    uploader: "news_desk",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e94",
    videotitle: "Live Esports Championship & Football Highlights",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    filesize: "1.5MB",
    videochanel: "Sports Zone",
    category: "Sports",
    Like: 2890,
    views: 112000,
    uploader: "sports_central",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e95",
    videotitle: "Chill Lo-Fi Beats & Acoustic Live Session",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    filesize: "980KB",
    videochanel: "Music Station",
    category: "Music",
    Like: 5410,
    views: 230000,
    uploader: "music_pro",
    createdAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e96",
    videotitle: "Blockbuster Movie Official Trailer 2026",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    filesize: "1.4MB",
    videochanel: "Cinema World",
    category: "Movies",
    Like: 4120,
    views: 175000,
    uploader: "cinema_club",
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e97",
    videotitle: "Hilarious Tech Parodies & Standup Comedy Special",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    filesize: "910KB",
    videochanel: "Comedy Central",
    category: "Comedy",
    Like: 3100,
    views: 94000,
    uploader: "comedy_king",
    createdAt: new Date(Date.now() - 691200000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e98",
    videotitle: "Quantum Computing & Universe Science Discoveries",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    filesize: "1.3MB",
    videochanel: "Science Lab",
    category: "Science",
    Like: 2750,
    views: 81000,
    uploader: "sci_expert",
    createdAt: new Date(Date.now() - 777600000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e99",
    videotitle: "Top 10 Hidden Island Travel Destinations Vlogs",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    filesize: "1.6MB",
    videochanel: "Traveler Vlogs",
    category: "Travel",
    Like: 3890,
    views: 142000,
    uploader: "globetrotter",
    createdAt: new Date(Date.now() - 864000000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7ea0",
    videotitle: "MasterChef Cooking Secrets: Perfect Italian Pasta",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    filesize: "1.1MB",
    videochanel: "Gourmet Kitchen",
    category: "Food",
    Like: 4500,
    views: 198000,
    uploader: "chef_gourmet",
    createdAt: new Date(Date.now() - 950400000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7ea1",
    videotitle: "Spring Streetwear Fashion Trends & Style Lookbook",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    filesize: "1.2MB",
    videochanel: "Style & Fashion",
    category: "Fashion",
    Like: 2900,
    views: 86000,
    uploader: "fashion_icon",
    createdAt: new Date(Date.now() - 1036800000).toISOString(),
  },
];

interface VideogridProps {
  selectedCategory?: string;
}

const Videogrid = ({ selectedCategory = "All" }: VideogridProps) => {
  const [videos, setvideo] = useState<any[]>([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchvideo = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        let apiVideos = Array.isArray(res.data) && res.data.length > 0 ? res.data : [];

        const combined = [...apiVideos];
        CATEGORY_CATALOG.forEach((item) => {
          if (!combined.some((v) => v._id === item._id)) {
            combined.push(item);
          }
        });

        setvideo(combined);
      } catch (error) {
        console.log(error);
        setvideo(CATEGORY_CATALOG);
      } finally {
        setloading(false);
      }
    };
    fetchvideo();
  }, []);

  const rawList = videos.length > 0 ? videos : CATEGORY_CATALOG;

  const displayList =
    selectedCategory === "All"
      ? rawList
      : rawList.filter((vid) => {
          const title = (vid.videotitle || "").toLowerCase();
          const channel = (vid.videochanel || "").toLowerCase();
          const cat = (vid.category || "").toLowerCase();
          const target = selectedCategory.toLowerCase();

          if (cat && cat.includes(target)) return true;
          if (title.includes(target) || channel.includes(target)) return true;

          return false;
        });

  const finalDisplay =
    displayList.length > 0
      ? displayList
      : CATEGORY_CATALOG.filter((v) => v.category?.toLowerCase() === selectedCategory.toLowerCase());

  const itemsToRender = finalDisplay.length > 0 ? finalDisplay : rawList;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {loading ? (
        <div className="col-span-full text-center py-8 text-gray-400">Loading videos...</div>
      ) : (
        itemsToRender.map((video: any) => <Videocard key={video._id} video={video} />)
      )}
    </div>
  );
};

export default Videogrid;
