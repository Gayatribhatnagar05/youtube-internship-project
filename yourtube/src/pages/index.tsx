"use client";

import CategoryTabs from "@/components/category-tabs";
import Videogrid from "@/components/Videogrid";
import React, { useState, Suspense } from "react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <main className="flex-1 p-4">
      <CategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />
      <Suspense fallback={<div className="text-gray-400">Loading videos...</div>}>
        <Videogrid selectedCategory={activeCategory} />
      </Suspense>
    </main>
  );
}
