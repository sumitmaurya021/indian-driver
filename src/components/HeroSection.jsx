import React, { useState, useEffect } from 'react';
import { TRUCK_SHAYARIS } from '../utils/truckShayaris';

export default function HeroSection() {
  const [shayariIndex, setShayariIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const nextShayari = () => {
    setIsFading(true);
    setTimeout(() => {
      setShayariIndex((prev) => (prev + 1) % TRUCK_SHAYARIS.length);
      setIsFading(false);
    }, 300);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextShayari();
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4 py-8 select-none gpu-layer">
      {/* Accent Glow Container */}
      <div 
        className="absolute -z-10 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full pointer-events-none opacity-40 gpu-layer"
        style={{
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 75%)'
        }}
      />

      {/* Main Hindi Title "इंडियन ड्राइवर" */}
      <h1 
        className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] font-devanagari transition-transform duration-300 hover:scale-105 gpu-layer"
      >
        इंडियन ड्राइवर
      </h1>

      {/* Slogan / Shayari Container */}
      <div 
        onClick={nextShayari}
        title="Click for next shayari"
        className="mt-6 cursor-pointer group max-w-xl px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-amber-400/40 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 gpu-layer"
      >
        <p className={`text-base sm:text-xl font-medium text-amber-200/90 italic tracking-wide transition-all duration-300 ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          "{TRUCK_SHAYARIS[shayariIndex]}"
        </p>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest block mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          ✦ tap to change shayari ✦
        </span>
      </div>

      {/* Highway Sticker Badges */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider text-amber-300/80 gpu-layer">
        <span className="px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 backdrop-blur-sm shadow-md transition-transform hover:scale-105">
          👑 मातृ-पितृ आशीर्वाद
        </span>
        <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 backdrop-blur-sm shadow-md transition-transform hover:scale-105">
          🧿 बुरी नज़र वाले तेरा मुँह काला
        </span>
        <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-sm shadow-md transition-transform hover:scale-105">
          🚛 National Permit India
        </span>
      </div>
    </div>
  );
}
