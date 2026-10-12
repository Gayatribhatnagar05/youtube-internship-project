import SubscriptionModal from "@/components/SubscriptionModal";
import Videogrid from "@/components/Videogrid";
import { PlaySquare, Sparkles } from "lucide-react";
import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";

export default function SubscriptionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600/10 text-red-600 rounded-xl">
            <PlaySquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Subscriptions</h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Latest videos from your subscribed channels & premium tier features.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-semibold gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Upgrade Plan
        </Button>
      </div>

      <Suspense fallback={<div className="text-gray-400">Loading subscribed videos...</div>}>
        <Videogrid selectedCategory="All" />
      </Suspense>

      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
