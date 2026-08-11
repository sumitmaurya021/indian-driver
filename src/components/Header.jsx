import React, { useState, useEffect } from 'react';

export default function Header({ 
  onOpenPlaylistModal, 
  driversCount 
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between text-white font-medium select-none">
      {/* Time Display (Top Left) */}
      <div className="flex items-center space-x-2 text-sm tracking-wide text-gray-200 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
        <svg className="w-4 h-4 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{timeStr || '1:20 pm'}</span>
      </div>

      {/* Live Highway Driver Status (Center) */}
      <div className="flex items-center space-x-2 text-xs md:text-sm bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
        <span className="font-semibold text-emerald-400">{driversCount}</span>
        <span className="text-gray-300">on the highway</span>
      </div>

      {/* Control Buttons (Top Right) */}
      <div className="flex items-center space-x-2">

        {/* Change Playlist */}
        <button
          onClick={onOpenPlaylistModal}
          title="Highway Playlists"
          className="flex items-center space-x-1.5 text-xs bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/30 text-amber-300 hover:text-amber-100 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="hidden sm:inline">Playlist</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title="Fullscreen"
          className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/15 text-gray-300 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4" />
          </svg>
        </button>
      </div>
    </header>
  );
}
