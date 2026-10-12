import CategoryTabs from "@/components/category-tabs";
import Videogrid from "@/components/Videogrid";
import { Compass, Flame, TrendingUp } from "lucide-react";
import React, { useState, Suspense } from "react";

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div className="p-3 bg-red-600/10 text-red-600 rounded-xl">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Explore Trending Videos</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Discover popular content across technology, gaming, music, news, and sports.
          </p>
        </div>
      </div>

      <CategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      <Suspense fallback={<div className="text-gray-400">Loading explore videos...</div>}>
        <Videogrid selectedCategory={activeCategory} />
      </Suspense>
    </main>
  );
}
