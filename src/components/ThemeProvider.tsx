"use client";
import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem("theme") || "light";
      document.body.classList.toggle("theme-dark", theme === "dark");
      document.body.classList.toggle("theme-light", theme !== "dark");
    };
    applyTheme();
    window.addEventListener("storage", applyTheme);
    return () => window.removeEventListener("storage", applyTheme);
  }, []);
  return <>{children}</>;
} 