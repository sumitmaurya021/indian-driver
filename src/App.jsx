import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import BackgroundVideo from './components/BackgroundVideo';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MusicPlayer from './components/MusicPlayer';
import PlaylistModal from './components/PlaylistModal';
import { HIGHWAY_STATION_PRESETS } from './utils/truckShayaris';
import './App.css';

import { presenceTracker } from './utils/presenceTracker';

export default function App() {
  const [playlistId, setPlaylistId] = useState(import.meta.env.VITE_YOUTUBE_PLAYLIST_ID || HIGHWAY_STATION_PRESETS[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [driversCount, setDriversCount] = useState(1);
  const [currentTrackInfo, setCurrentTrackInfo] = useState({
    title: "Barsaat Ke Mausam Mein",
    artist: "Kumar Sanu & Roop Kumar Rathod",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80"
  });

  // Real-time live active website listeners counter
  useEffect(() => {
    presenceTracker.init((count) => {
      setDriversCount(count);
    });
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-950 text-white font-sans">
      {/* Background Highway Dark Atmosphere */}
      <BackgroundVideo />

      {/* Top Navigation Header Bar */}
      <Header 
        onOpenPlaylistModal={() => setIsModalOpen(true)}
        driversCount={driversCount}
      />

      {/* Center Hero Section ("इंडियन ड्राइवर" Title + Slogans) */}
      <HeroSection />

      {/* Bottom Floating Music Player Dock */}
      <MusicPlayer 
        playlistId={playlistId}
        onTogglePlaylistModal={() => setIsModalOpen(true)}
        currentTrackInfo={currentTrackInfo}
        setCurrentTrackInfo={setCurrentTrackInfo}
      />

      {/* YouTube Playlist Selector Modal */}
      <PlaylistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activePlaylistId={playlistId}
        onSelectPlaylist={(id) => setPlaylistId(id)}
      />

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </main>
  );
}

