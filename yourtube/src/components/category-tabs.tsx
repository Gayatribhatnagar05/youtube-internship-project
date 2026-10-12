"use client";

import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Technology",
  "Education",
  "Gaming",
  "Music",
  "News",
  "Sports",
  "Movies",
  "Comedy",
  "Science",
  "Travel",
  "Food",
  "Fashion",
];

interface CategoryTabsProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function CategoryTabs({
  activeCategory = "All",
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "secondary"}
          className={`whitespace-nowrap rounded-full text-xs px-4 font-medium transition-colors ${
            activeCategory === category
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200"
          }`}
          onClick={() => onSelectCategory && onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
