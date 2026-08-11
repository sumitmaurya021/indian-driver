import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, ListMusic, Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer({ 
  playlistId, 
  onTogglePlaylistModal, 
  currentTrackInfo, 
  setCurrentTrackInfo 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Initialize YouTube Iframe API
  useEffect(() => {
    const loadYT = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    };

    const initPlayer = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player('yt-audio-player', {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 1,
          controls: 0,
          listType: 'playlist',
          list: playlistId || import.meta.env.VITE_YOUTUBE_PLAYLIST_ID || 'PLbNSgY8jW4F0',
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            setPlayerReady(true);
            event.target.setVolume(volume);
            event.target.playVideo();
            setIsPlaying(true);
            updateTrackData();
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              updateTrackData();
              startProgressTimer();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopProgressTimer();
            } else if (event.data === window.YT.PlayerState.ENDED) {
              if (playerRef.current) playerRef.current.nextVideo();
            }
          },
        },
      });
    };

    loadYT();

    return () => {
      stopProgressTimer();
    };
  }, []);

  // Update YouTube Playlist when prop changes
  useEffect(() => {
    if (playerReady && playerRef.current && playlistId) {
      if (playlistId.startsWith('PL') || playlistId.length > 15) {
        playerRef.current.loadPlaylist({
          list: playlistId,
          listType: 'playlist',
          index: 0,
          startSeconds: 0,
        });
      } else {
        playerRef.current.loadVideoById(playlistId);
      }
      setIsPlaying(true);
    }
  }, [playlistId, playerReady]);

  const updateTrackData = () => {
    if (!playerRef.current || !playerRef.current.getVideoData) return;
    const data = playerRef.current.getVideoData();
    const dur = playerRef.current.getDuration() || 0;
    setDuration(dur);
    if (data && data.title) {
      setCurrentTrackInfo({
        title: data.title,
        artist: data.author || 'Indian Highway Beats',
        video_id: data.video_id,
        cover: `https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg`,
      });
    }
  };

  const startProgressTimer = () => {
    stopProgressTimer();
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime() || 0);
        const dur = playerRef.current.getDuration() || 0;
        if (dur) setDuration(dur);
      }
    }, 500);
  };

  const stopProgressTimer = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const nextTrack = () => {
    if (playerRef.current && playerRef.current.nextVideo) {
      playerRef.current.nextVideo();
    }
  };

  const prevTrack = () => {
    if (playerRef.current && playerRef.current.previousVideo) {
      playerRef.current.previousVideo();
    }
  };

  const toggleShuffle = () => {
    if (playerRef.current && playerRef.current.setShuffle) {
      const nextShuffle = !isShuffle;
      setIsShuffle(nextShuffle);
      playerRef.current.setShuffle(nextShuffle);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(val);
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl select-none">
      {/* Hidden YouTube Iframe Container */}
      <div id="yt-audio-player" className="hidden pointer-events-none" />

      {/* Main Glassmorphic Dock Container matching screenshot */}
      <div className="relative bg-black/45 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-3 text-white transition-all duration-300 hover:border-white/30">
        
        {/* Track Thumbnail + Title & Time */}
        <div className="flex items-center space-x-3.5 w-full sm:w-auto min-w-0">
          {/* Animated Vinyl Cover Art */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white/20 shadow-md group">
            <img 
              src={currentTrackInfo?.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80"} 
              alt="Track Artwork"
              className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_12s_linear_infinite]' : ''}`}
            />
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-black" />
            </div>
          </div>

          {/* Title & Artist */}
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-sm font-bold text-white truncate tracking-wide leading-tight">
              {currentTrackInfo?.title || "Barsaat Ke Mausam Mein"}
            </h4>
            <p className="text-xs text-amber-200/80 truncate mt-0.5 font-medium">
              {currentTrackInfo?.artist || "Kumar Sanu & Roop Kumar Rathod"}
            </p>

            {/* Time Indicator */}
            <div className="text-[11px] text-gray-300 font-mono mt-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Center Progress Bar & Player Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
          {/* Shuffle Toggle */}
          <button
            onClick={toggleShuffle}
            title="Shuffle Playlist"
            className={`p-2 rounded-full transition-all ${
              isShuffle ? 'text-amber-400 bg-amber-400/20' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Prev Track */}
          <button
            onClick={prevTrack}
            title="Previous Song"
            className="p-2 text-gray-300 hover:text-white transition-colors transform hover:scale-110 active:scale-95"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Big Circular Play / Pause Button matching user image */}
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 group"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={nextTrack}
            title="Next Song"
            className="p-2 text-gray-300 hover:text-white transition-colors transform hover:scale-110 active:scale-95"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Playlist Drawer Modal Trigger */}
          <button
            onClick={onTogglePlaylistModal}
            title="Choose Playlist"
            className="p-2 text-gray-300 hover:text-amber-300 transition-colors"
          >
            <ListMusic className="w-5 h-5" />
          </button>

          {/* Mute / Volume */}
          <div className="hidden md:flex items-center space-x-1.5 group relative">
            <button onClick={toggleMute} className="text-gray-300 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 accent-amber-400 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Progress Bar (Bottom Edge Accent) */}
      <div className="relative w-full px-4 -mt-2.5 z-10">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 accent-amber-400 bg-white/20 hover:bg-white/40 rounded-lg cursor-pointer transition-all"
        />
      </div>
    </div>
  );
}
