import React from 'react';

export default function BackgroundVideo({ isDimmed }) {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-slate-950">
      {/* Dynamic Highway Dusk/Night Gradient */}
      <div 
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at bottom, #1e1b4b 0%, #0f172a 55%, #020617 100%)'
        }}
      />

      {/* Highway Headlights Ambient Glow Accents */}
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse" />

      {/* Aesthetic Vignette & Gradient Overlays */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/60 transition-opacity duration-500 ${isDimmed ? 'opacity-90' : 'opacity-70'}`} />
      
      {/* Warm Road Dusk Lighting Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 via-transparent to-indigo-950/30 mix-blend-color-dodge pointer-events-none" />

      {/* Micro Dust Particles / Fog Effect overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}

