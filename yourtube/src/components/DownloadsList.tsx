"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Download, Play, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

export default function DownloadsList() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>("Free");
  const [quota, setQuota] = useState<number>(1);
  const [downloadsToday, setDownloadsToday] = useState<number>(0);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadDownloads();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDownloads = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.get(`/download/user/${user._id || user.id}`);
      setDownloads(res.data.downloads || []);
      setUserPlan(res.data.userPlan || "Free");
      setQuota(res.data.quota || 1);
      setDownloadsToday(res.data.downloadsToday || 0);
    } catch (error) {
      console.error("Error loading downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading downloads...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Your Downloads</h2>
        <p className="text-gray-600 text-sm mb-6">
          Sign in to view and manage your downloaded offline videos.
        </p>
      </div>
    );
  }

  const remaining = Math.max(0, quota - downloadsToday);

  return (
    <div className="space-y-6">
      {/* Plan Quota Header Card */}
      <div className="bg-gradient-to-r from-slate-900 to-zinc-800 text-white rounded-xl p-5 shadow-sm border border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-600/30 text-red-400 border border-red-500/30 font-semibold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              {userPlan} Plan
            </span>
            <span className="text-xs text-zinc-400">Daily Video Downloads</span>
          </div>
          <h2 className="text-lg font-bold">
            {downloadsToday} of {userPlan === "Gold" ? "Unlimited" : quota} downloads used today
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {userPlan === "Free"
              ? "Free tier allows 1 download per 24 hours. Upgrade to Bronze, Silver, or Gold for higher limits!"
              : `${remaining} download(s) remaining for today.`}
          </p>
        </div>

        <Link href="/subscription">
          <Button className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white border-0 shadow-md font-semibold gap-2">
            <Sparkles className="w-4 h-4" />
            Upgrade Plan
          </Button>
        </Link>
      </div>

      {downloads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <Download className="w-14 h-14 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800">No Downloads Yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Click the "Download" button under any video player to save videos directly to your account.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {downloads.length} Downloaded {downloads.length === 1 ? "Video" : "Videos"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloads.map((item) => (
              <div
                key={item._id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm line-clamp-2 text-gray-900">
                      {item.videoTitle}
                    </h4>
                    <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded font-medium shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Saved
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Size: {item.fileSize || "Original Standard Quality"}</p>
                    <p>Downloaded on: {new Date(item.downloadDate).toLocaleDateString()}</p>
                    <p className="text-[11px] text-gray-400">
                      Plan tier: {item.userPlan || "Free"}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 border-t flex items-center justify-between gap-2">
                  <Link href={`/watch/${item.videoId}`} className="w-full">
                    <Button size="sm" variant="default" className="w-full gap-2">
                      <Play className="w-4 h-4 fill-white" /> Watch Offline / Online
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
