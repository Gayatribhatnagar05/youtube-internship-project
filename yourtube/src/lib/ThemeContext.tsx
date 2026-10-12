"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "./axiosinstance";

interface ThemeContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  isAutoIST: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
  isAutoIST: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<"light" | "dark">("dark");
  const [isAutoIST, setIsAutoIST] = useState(false);

  const calculateISTTheme = (): "light" | "dark" => {
    const now = new Date();
    // IST = UTC + 5:30 (330 minutes)
    const utcOffsetMin = now.getTimezoneOffset();
    const istTimeMs = now.getTime() + (utcOffsetMin + 330) * 60 * 1000;
    const istDate = new Date(istTimeMs);

    const istHours = istDate.getHours();
    const istMinutes = istDate.getMinutes();
    const totalMinutes = istHours * 60 + istMinutes;

    // 10:00 AM IST = 600 minutes
    // 12:00 PM IST = 720 minutes
    const inLightWindow = totalMinutes >= 600 && totalMinutes <= 720;
    return inLightWindow ? "light" : "dark";
  };

  useEffect(() => {
    // Check saved theme or IST auto theme
    const savedTheme = localStorage.getItem("theme_override") as "light" | "dark" | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      setIsAutoIST(false);
    } else {
      const autoTheme = calculateISTTheme();
      setThemeState(autoTheme);
      setIsAutoIST(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    localStorage.setItem("theme_override", newTheme);
    setIsAutoIST(false);

    // Save preference to user profile in backend if logged in
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        axiosInstance.post("/security/theme", {
          userId: u._id,
          themePreference: newTheme,
        });
      } catch (err) {}
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isAutoIST }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
