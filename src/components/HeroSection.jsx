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
    <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4 py-8 select-none">
      {/* Truck Graphic Silhouette / Accent glow */}
      <div className="absolute -z-10 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Hindi Title "इंडियन ड्राइवर" */}
      <h1 
        className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] font-devanagari transition-transform duration-500 hover:scale-105"
        style={{ textShadow: '0 4px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(239, 68, 68, 0.4)' }}
      >
        इंडियन ड्राइवर
      </h1>

      {/* Slogan / Shayari Container */}
      <div 
        onClick={nextShayari}
        title="Click for next shayari"
        className="mt-6 cursor-pointer group max-w-xl px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-amber-400/40 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <p className={`text-base sm:text-xl font-medium text-amber-200/90 italic tracking-wide transition-opacity duration-300 ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          "{TRUCK_SHAYARIS[shayariIndex]}"
        </p>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest block mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          ✦ tap to change shayari ✦
        </span>
      </div>

      {/* Highway Sticker Badges */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider text-amber-300/80">
        <span className="px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 backdrop-blur-sm shadow-md">
          👑 मातृ-पितृ आशीर्वाद
        </span>
        <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 backdrop-blur-sm shadow-md">
          🧿 बुरी नज़र वाले तेरा मुँह काला
        </span>
        <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-sm shadow-md">
          🚛 National Permit India
        </span>
      </div>
    </div>
  );
}
