import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, ListMusic, Volume2, VolumeX } from 'lucide-react';
import { presenceTracker } from '../utils/presenceTracker';

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

  // Sync listening state with presence tracker
  useEffect(() => {
    presenceTracker.setListeningState(isPlaying);
  }, [isPlaying]);

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
        const cur = playerRef.current.getCurrentTime() || 0;
        setCurrentTime(Math.floor(cur));
        const dur = playerRef.current.getDuration() || 0;
        if (dur) setDuration(Math.floor(dur));
      }
    }, 1000);
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
    <div className="fixed bottom-2.5 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95%] sm:w-[94%] max-w-2xl select-none">
      {/* Hidden YouTube Iframe Container */}
      <div id="yt-audio-player" className="hidden pointer-events-none" />

      {/* Main Glassmorphic Dock Console */}
      <div className="relative bg-slate-950/90 backdrop-blur-2xl border border-amber-500/30 rounded-2xl sm:rounded-full px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-white transition-all duration-300 hover:border-amber-400/50 group overflow-hidden">
        
        {/* Top Edge Integrated Progress Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-300"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        {/* Track Artwork + Title + Equalizer */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 w-full sm:w-auto min-w-0">
          {/* Glowing Vinyl Record Cover */}
          <div className="relative w-10 h-10 sm:w-13 sm:h-13 rounded-full overflow-hidden shrink-0 border-2 border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:border-amber-400/60 transition-colors">
            <img 
              src={currentTrackInfo?.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80"} 
              alt="Track Artwork"
              className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_15s_linear_infinite]' : ''}`}
            />
            <div className="absolute inset-0 bg-black/25 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-400 border-2 border-black shadow-inner" />
            </div>
          </div>

          {/* Track Details & Audio Wave Equalizer */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate tracking-wide leading-tight">
                {currentTrackInfo?.title || "Barsaat Ke Mausam Mein"}
              </h4>
              {/* Equalizer Bars when Playing */}
              {isPlaying && (
                <div className="flex items-end space-x-0.5 h-2.5 sm:h-3 shrink-0">
                  <span className="w-0.5 bg-amber-400 animate-[bounce_1s_infinite_100ms] h-full rounded-full" />
                  <span className="w-0.5 bg-red-400 animate-[bounce_1s_infinite_300ms] h-2/3 rounded-full" />
                  <span className="w-0.5 bg-amber-300 animate-[bounce_1s_infinite_200ms] h-4/5 rounded-full" />
                </div>
              )}
            </div>
            
            <p className="text-[11px] sm:text-xs text-amber-200/80 truncate mt-0.5 font-medium">
              {currentTrackInfo?.artist || "Kumar Sanu & Roop Kumar Rathod"}
            </p>

            {/* Time Display */}
            <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Player Controls & Interactive Seek Slider */}
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-1.5 sm:pt-0">
          
          {/* Progress Slider (Interactive Seek) */}
          <div className="flex-1 sm:w-28 md:w-36 flex items-center min-w-[60px]">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 accent-amber-400 bg-white/20 hover:bg-white/40 rounded-lg cursor-pointer transition-all"
            />
          </div>

          {/* Shuffle Toggle */}
          <button
            onClick={toggleShuffle}
            title="Shuffle Playlist"
            className={`p-1.5 rounded-full transition-all ${
              isShuffle ? 'text-amber-400 bg-amber-400/20' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Prev Track */}
          <button
            onClick={prevTrack}
            title="Previous Song"
            className="p-1.5 text-gray-300 hover:text-white transition-transform hover:scale-110 active:scale-95"
          >
            <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          </button>

          {/* Glowing Metallic Play / Pause Button */}
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 font-bold"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={nextTrack}
            title="Next Song"
            className="p-1.5 text-gray-300 hover:text-white transition-transform hover:scale-110 active:scale-95"
          >
            <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          </button>

          {/* Playlist Drawer Modal Trigger */}
          <button
            onClick={onTogglePlaylistModal}
            title="Choose Playlist"
            className="p-1.5 text-gray-300 hover:text-amber-300 transition-colors"
          >
            <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Mute / Volume */}
          <div className="hidden lg:flex items-center space-x-1.5">
            <button onClick={toggleMute} className="text-gray-300 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-14 h-1 accent-amber-400 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
