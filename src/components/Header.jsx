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
    <header className="relative z-20 w-full px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between text-white font-medium select-none">
      {/* Time Display (Top Left) */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-sm font-bold tracking-wide text-amber-200 bg-slate-950/90 backdrop-blur-xl px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-amber-500/35 shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{timeStr || '1:20 pm'}</span>
      </div>

      {/* Live Highway Listener Status (Center) */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 text-[11px] sm:text-sm bg-slate-950/90 backdrop-blur-xl px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] mx-1 truncate">
        <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 items-center justify-center shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        </span>
        <span className="font-extrabold text-emerald-400 font-mono tracking-tight text-xs sm:text-sm">{driversCount}</span>
        <span className="text-emerald-100/90 font-semibold tracking-wide text-[10px] sm:text-xs truncate">
          <span className="hidden md:inline">{driversCount === 1 ? 'listener on the highway' : 'listeners on the highway'}</span>
          <span className="md:hidden">listeners</span>
        </span>
      </div>

      {/* Control Buttons (Top Right) */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
        {/* Change Playlist */}
        <button
          onClick={onOpenPlaylistModal}
          title="Highway Playlists"
          className="flex items-center space-x-1.5 text-xs font-bold bg-slate-950/90 hover:bg-amber-950/60 backdrop-blur-xl px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-amber-500/35 hover:border-amber-400 text-amber-300 hover:text-amber-100 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="hidden sm:inline">Playlist</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title="Fullscreen"
          className="p-1.5 sm:p-2 bg-slate-950/90 hover:bg-slate-900/90 backdrop-blur-xl rounded-full border border-white/15 hover:border-white/30 text-gray-300 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4" />
          </svg>
        </button>
      </div>
    </header>
  );
}
