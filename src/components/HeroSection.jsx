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
    <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-3 sm:px-4 py-4 sm:py-8 select-none w-full max-w-4xl mx-auto">
      {/* Background Radial Glow Accent */}
      <div 
        className="absolute -z-10 w-[260px] h-[260px] sm:w-[480px] sm:h-[480px] rounded-full pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(225, 29, 72, 0.12) 45%, transparent 70%)'
        }}
      />

      {/* Main Premium Metallic Title "इंडियन ड्राइवर" */}
      <h1 
        className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight font-devanagari transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-amber-300 via-amber-100 to-red-400 bg-clip-text text-transparent filter drop-shadow-[0_8px_25px_rgba(245,158,11,0.4)] leading-none py-1"
      >
        इंडियन ड्राइवर
      </h1>

      {/* Interactive Floating Shayari Badge Card */}
      <div 
        onClick={nextShayari}
        title="Click for next shayari"
        className="mt-4 sm:mt-6 cursor-pointer group w-[92%] sm:w-full max-w-xl px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-amber-500/25 hover:border-amber-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
      >
        <div className="absolute -left-12 -top-12 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
        
        <p className={`text-xs sm:text-lg md:text-xl font-medium text-amber-200 tracking-wide transition-all duration-300 ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <span className="text-amber-400 font-serif text-lg sm:text-2xl mr-1">“</span>
          {TRUCK_SHAYARIS[shayariIndex]}
          <span className="text-amber-400 font-serif text-lg sm:text-2xl ml-1">”</span>
        </p>
        
        <span className="text-[9px] sm:text-[10px] font-semibold text-amber-400/70 uppercase tracking-widest block mt-1 sm:mt-1.5 group-hover:text-amber-300 transition-colors">
          ✦ Click to change shayari ✦
        </span>
      </div>

      {/* Highway Sticker Badges */}
      <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 max-w-full">
        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-red-950/80 border border-red-500/40 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
          👑 मातृ-पितृ आशीर्वाद
        </span>
        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
          🧿 बुरी नज़र वाले तेरा मुँह काला
        </span>
        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
          🚛 National Permit India
        </span>
      </div>
    </div>
  );
}
