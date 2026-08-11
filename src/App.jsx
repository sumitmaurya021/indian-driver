import React, { useState, useEffect } from 'react';
import BackgroundVideo from './components/BackgroundVideo';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HornSoundboard from './components/HornSoundboard';
import MusicPlayer from './components/MusicPlayer';
import PlaylistModal from './components/PlaylistModal';
import { HIGHWAY_STATION_PRESETS } from './utils/truckShayaris';
import './App.css';

export default function App() {
  const [playlistId, setPlaylistId] = useState(import.meta.env.VITE_YOUTUBE_PLAYLIST_ID || HIGHWAY_STATION_PRESETS[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [driversCount, setDriversCount] = useState(534);
  const [currentTrackInfo, setCurrentTrackInfo] = useState({
    title: "Barsaat Ke Mausam Mein",
    artist: "Kumar Sanu & Roop Kumar Rathod",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80"
  });

  // Simulated live drivers on highway counter
  useEffect(() => {
    const interval = setInterval(() => {
      setDriversCount(prev => prev + (Math.floor(Math.random() * 5) - 2));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Flash truck headlights when horn is triggered
  const triggerHeadlightFlash = () => {
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 250);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-950 text-white font-sans">
      {/* Background Highway Dark Atmosphere */}
      <BackgroundVideo />

      {/* Headlight Flash Overlay Effect */}
      {isFlashActive && (
        <div className="fixed inset-0 z-40 bg-amber-100/25 mix-blend-overlay pointer-events-none transition-opacity duration-100 animate-ping" />
      )}

      {/* Top Navigation Header Bar */}
      <Header 
        onOpenPlaylistModal={() => setIsModalOpen(true)}
        driversCount={driversCount}
      />

      {/* Center Hero Section ("ट्रक वाला" Title + Slogans) */}
      <HeroSection />

      {/* Left Floating "Horn OK Please" & Modified Horn Soundboard */}
      <HornSoundboard onTriggerFlash={triggerHeadlightFlash} />

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
    </main>
  );
}

