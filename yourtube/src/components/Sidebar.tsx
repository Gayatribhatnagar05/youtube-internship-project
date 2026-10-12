import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
  Download,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Channeldialogue from "./channeldialogue";
import { useUser } from "@/lib/AuthContext";

const Sidebar = () => {
  const { user } = useUser();

  const [isdialogeopen, setisdialogeopen] = useState(false);
  return (
    <>
      <aside className="hidden md:block w-64 shrink-0 bg-white dark:bg-zinc-950 dark:text-white dark:border-zinc-800 border-r min-h-screen p-2">
      <nav className="space-y-1">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-5 h-5 mr-3" />
            Home
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="ghost" className="w-full justify-start">
            <Compass className="w-5 h-5 mr-3" />
            Explore
          </Button>
        </Link>
        <Link href="/subscriptions">
          <Button variant="ghost" className="w-full justify-start">
            <PlaySquare className="w-5 h-5 mr-3" />
            Subscriptions
          </Button>
        </Link>

        {user && (
          <>
            <div className="border-t pt-2 mt-2">
              <Link href="/history">
                <Button variant="ghost" className="w-full justify-start">
                  <History className="w-5 h-5 mr-3" />
                  History
                </Button>
              </Link>
              <Link href="/liked">
                <Button variant="ghost" className="w-full justify-start">
                  <ThumbsUp className="w-5 h-5 mr-3" />
                  Liked videos
                </Button>
              </Link>
              <Link href="/watch-later">
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="w-5 h-5 mr-3" />
                  Watch later
                </Button>
              </Link>
              <Link href="/downloads">
                <Button variant="ghost" className="w-full justify-start">
                  <Download className="w-5 h-5 mr-3" />
                  Downloads
                </Button>
              </Link>
              {user?.channelname ? (
                <Link href={`/channel/${user?._id || user?.id}`}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-5 h-5 mr-3" />
                    Your channel
                  </Button>
                </Link>
              ) : (
                <div className="px-2 py-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setisdialogeopen(true)}
                  >
                    Create Channel
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
      <Channeldialogue
        isopen={isdialogeopen}
        onclose={() => setisdialogeopen(false)}
        mode="create"
      />
    </aside>

    {/* Mobile Bottom Navigation Bar */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md dark:border-zinc-800 border-t flex items-center justify-around py-2 px-1 text-[10px] text-gray-600 dark:text-zinc-400">
      <Link href="/" className="flex flex-col items-center gap-0.5 hover:text-red-600 transition-colors">
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>
      <Link href="/explore" className="flex flex-col items-center gap-0.5 hover:text-red-600 transition-colors">
        <Compass className="w-5 h-5" />
        <span>Explore</span>
      </Link>
      <Link href="/subscriptions" className="flex flex-col items-center gap-0.5 hover:text-red-600 transition-colors">
        <PlaySquare className="w-5 h-5" />
        <span>Subs</span>
      </Link>
      <Link href="/downloads" className="flex flex-col items-center gap-0.5 hover:text-red-600 transition-colors">
        <Download className="w-5 h-5" />
        <span>Downloads</span>
      </Link>
      <Link href="/history" className="flex flex-col items-center gap-0.5 hover:text-red-600 transition-colors">
        <History className="w-5 h-5" />
        <span>History</span>
      </Link>
    </nav>
  </>
  );
};

export default Sidebar;
