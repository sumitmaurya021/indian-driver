import React from 'react';
import { HIGHWAY_STATION_PRESETS } from '../utils/truckShayaris';
import { X, Check } from 'lucide-react';

export default function PlaylistModal({ 
  isOpen, 
  onClose, 
  activePlaylistId, 
  onSelectPlaylist
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gray-900/90 border border-white/20 rounded-3xl p-6 shadow-2xl text-white overflow-hidden">
        {/* Glowing Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <h3 className="text-xl font-bold font-devanagari text-amber-300">
              हाईवे म्यूजिक सेटअप
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Curated Highway Playlists */}
        <div className="space-y-4">
          <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Active Highway Playlist:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {HIGHWAY_STATION_PRESETS.map((preset) => {
              const isSelected = activePlaylistId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    onSelectPlaylist(preset.id);
                    onClose();
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/25'
                  }`}
                >
                  <img 
                    src={preset.cover} 
                    alt={preset.title} 
                    className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate flex items-center justify-between">
                      <span>{preset.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                    </h4>
                    <p className="text-[11px] text-amber-300/80 truncate mt-0.5">{preset.artist}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{preset.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

