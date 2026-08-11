import React from 'react';

export default function BackgroundVideo({ isDimmed }) {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-slate-950 gpu-layer">
      {/* Rich Highway Dusk & Midnight Atmosphere */}
      <div 
        className="absolute inset-0 w-full h-full transition-opacity duration-700"
        style={{
          background: `
            radial-gradient(circle at 50% 120%, rgba(245, 158, 11, 0.25) 0%, rgba(185, 28, 28, 0.2) 30%, rgba(30, 27, 75, 0.7) 65%, rgba(3, 7, 18, 0.98) 100%),
            linear-gradient(to bottom, #030712 0%, #0f172a 40%, #1e1b4b 75%, #030712 100%)
          `
        }}
      />

      {/* Highway Lighting Glow Accents */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-t from-amber-500/20 via-red-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Aesthetic Vignette Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 transition-opacity duration-300 ${isDimmed ? 'opacity-90' : 'opacity-65'}`} />
    </div>
  );
}



