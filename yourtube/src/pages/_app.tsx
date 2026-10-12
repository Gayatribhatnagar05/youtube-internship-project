import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { ThemeProvider } from "../lib/ThemeContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
          <title>Your-Tube Clone</title>
          <Header />
          <Toaster />
          <div className="flex pb-14 md:pb-0">
            <Sidebar />
            <div className="flex-1 min-w-0">
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </UserProvider>
  );
}
