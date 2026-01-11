// components/NetworkStatus.tsx
"use client";

import { useState, useEffect } from "react";
import { IoCloudOffline, IoWifi } from "react-icons/io5";
import { toast } from "sonner";

export const NetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Back Online", { icon: <IoWifi /> });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.error("Connection Lost", { 
        description: "Please check your internet settings.",
        icon: <IoCloudOffline /> 
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-6 right-6 z-90 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="relative">
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <IoCloudOffline className="text-xl" />
      </div>
      <span>You are offline</span>
    </div>
  );
};