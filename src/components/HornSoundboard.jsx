import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundBoard';
import { Volume2, Music, Zap, ShieldAlert, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

export default function HornSoundboard({ onTriggerFlash }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHorn, setActiveHorn] = useState(null);

  const hornsList = [
    { id: 'pressure', name: 'प्रेशर हॉर्न', sub: 'Dual Air Blast', trigger: () => soundEngine.playPressureHorn(), icon: Volume2, color: 'from-amber-500 to-red-600' },
    { id: 'nagin', name: 'नागिन ड्यून', sub: '5-Tone Melodic', trigger: () => soundEngine.playNaginHorn(), icon: Music, color: 'from-emerald-500 to-teal-600' },
    { id: 'peepoo', name: 'पी-पू-पी हॉर्न', sub: 'Multi-Tone Rhythm', trigger: () => soundEngine.playPeePooHorn(), icon: Sparkles, color: 'from-purple-500 to-indigo-600' },
    { id: 'jat', name: 'जाट हॉर्न', sub: 'Heavy Duty Low Frequency', trigger: () => soundEngine.playJatHorn(), icon: Zap, color: 'from-blue-600 to-cyan-600' },
    { id: 'dhoom', name: 'धूम ट्यून', sub: 'Fast Highway Rhythm', trigger: () => soundEngine.playDhoomHorn(), icon: Music, color: 'from-rose-500 to-pink-600' },
    { id: 'reverse', name: 'रिवर्स सायरन', sub: 'Gaddi Aayi Hai Chime', trigger: () => soundEngine.playReverseHorn(), icon: ShieldAlert, color: 'from-yellow-500 to-amber-600' },
  ];

  const playHorn = (horn) => {
    setActiveHorn(horn.id);
    horn.trigger();
    if (onTriggerFlash) onTriggerFlash();
    setTimeout(() => setActiveHorn(null), 800);
  };

  // Keyboard shortcut listener ('H' key or Spacebar to blow pressure horn)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger when user typing in input fields
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'KeyH') {
        playHorn(hornsList[0]);
      } else if (e.code === 'Digit1') {
        playHorn(hornsList[0]);
      } else if (e.code === 'Digit2') {
        playHorn(hornsList[1]);
      } else if (e.code === 'Digit3') {
        playHorn(hornsList[2]);
      } else if (e.code === 'Digit4') {
        playHorn(hornsList[3]);
      } else if (e.code === 'Digit5') {
        playHorn(hornsList[4]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="my-3 sm:my-0 sm:fixed sm:left-8 sm:top-1/2 sm:-translate-y-1/2 z-40 select-none flex flex-col items-center sm:block">
      {/* Main Floating "Horn OK Please" Button */}
      <div className="relative group">
        <button
          onClick={() => {
            playHorn(hornsList[0]);
            setIsOpen(!isOpen);
          }}
          className={`flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2.5 pr-3 sm:pr-5 rounded-full bg-slate-950/85 hover:bg-slate-900/95 backdrop-blur-2xl border-2 border-amber-500/35 hover:border-amber-400/80 shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95 text-white overflow-hidden ${
            activeHorn ? 'ring-4 ring-amber-400/50 bg-amber-950/90 border-amber-400' : ''
          }`}
        >
          {/* Glowing Metallic Horn Circle */}
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-red-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.6)] shrink-0 transition-transform group-hover:scale-110">
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 stroke-slate-950 font-bold" />
            {activeHorn && (
              <span className="absolute inset-0 rounded-full bg-amber-400/50 animate-ping" />
            )}
          </div>

          {/* Typography Details */}
          <div className="text-left leading-none pr-1 min-w-0">
            <div className="text-[11px] sm:text-sm font-extrabold tracking-wider text-amber-300 font-devanagari">
              हॉर्न ओके प्लीज
            </div>
            <div className="text-[9px] sm:text-[10px] text-amber-100/70 font-semibold tracking-wider uppercase mt-0.5 sm:mt-1 hidden xs:block">
              Horn OK Please
            </div>
          </div>

          {/* Keyboard Hotkey Pill + Expand Arrow */}
          <div className="flex items-center space-x-1 ml-0.5 border-l border-white/10 pl-1.5 sm:pl-2">
            <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-500/30 text-[9px] font-mono text-amber-400 hidden sm:inline-block">
              H
            </span>
            <div className="text-amber-400/80 group-hover:text-white transition-colors">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </div>
          </div>
        </button>
      </div>

      {/* Expandable Soundboard Drawer Panel */}
      {isOpen && (
        <div className="mt-2.5 sm:mt-3.5 sm:absolute sm:top-full sm:left-0 w-64 sm:w-80 bg-slate-950/95 backdrop-blur-2xl border-2 border-amber-500/35 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-2.5 sm:space-y-3 animate-in fade-in slide-in-from-left-4 duration-200 overflow-hidden max-h-[55vh] overflow-y-auto">
          <div className="flex items-center justify-between px-1 pb-1.5 border-b border-white/10 text-xs font-bold text-amber-300 tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] sm:text-xs">INDIAN HORNS</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">
              Keys 1-5
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 sm:gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {hornsList.map((horn, idx) => {
              const IconComp = horn.icon;
              const isPlaying = activeHorn === horn.id;
              return (
                <button
                  key={horn.id}
                  onClick={() => playHorn(horn)}
                  className={`w-full flex items-center space-x-2.5 sm:space-x-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all border text-left ${
                    isPlaying
                      ? 'bg-amber-500/30 border-amber-400 text-white scale-[1.02] shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-white/5 hover:bg-amber-500/10 border-white/10 hover:border-amber-400/40 text-gray-200'
                  }`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br ${horn.color} flex items-center justify-center shrink-0 shadow-md`}>
                    <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] sm:text-xs font-bold truncate text-white flex items-center justify-between">
                      <span>{horn.name}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-black/50 text-amber-300 font-mono border border-white/10">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-amber-200/70 truncate mt-0.5 font-medium">{horn.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
