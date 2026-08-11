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
    <div className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 select-none">
      {/* Main Floating "Horn OK Please" Button matching user image */}
      <div className="relative group">
        <button
          onClick={() => {
            playHorn(hornsList[0]);
            setIsOpen(!isOpen);
          }}
          className={`flex items-center space-x-3 px-4 py-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 hover:border-amber-400/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 transform group-hover:scale-105 active:scale-95 text-white ${
            activeHorn ? 'ring-4 ring-amber-400/50 bg-amber-950/60' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg group-hover:animate-bounce">
            <Volume2 className="w-4 h-4 text-white" />
          </div>
          <div className="text-left leading-tight pr-1">
            <div className="text-xs font-black tracking-wider text-amber-300 font-devanagari">
              हॉर्न ओके प्लीज
            </div>
            <div className="text-[10px] text-gray-300 font-medium tracking-tight">
              Horn ok pleaseeee
            </div>
          </div>
          <div className="ml-1 text-gray-400 group-hover:text-white transition-colors">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Hotkey hint tooltip */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
          Press <kbd className="px-1 py-0.5 bg-gray-800 rounded text-amber-300 font-mono">H</kbd> or click
        </div>
      </div>

      {/* Expandable Soundboard Drawer Panel */}
      {isOpen && (
        <div className="mt-3 w-72 bg-black/60 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 shadow-2xl space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 text-xs font-semibold text-amber-300">
            <span>INDIAN DRIVER HORNS</span>
            <span className="text-[10px] text-gray-400">Keys 1-5</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {hornsList.map((horn, idx) => {
              const IconComp = horn.icon;
              const isPlaying = activeHorn === horn.id;
              return (
                <button
                  key={horn.id}
                  onClick={() => playHorn(horn)}
                  className={`w-full flex items-center space-x-3 p-2 rounded-xl transition-all border text-left ${
                    isPlaying
                      ? 'bg-amber-500/30 border-amber-400 text-white scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20 text-gray-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${horn.color} flex items-center justify-center shrink-0 shadow`}>
                    <IconComp className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate text-white flex items-center justify-between">
                      <span>{horn.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-amber-300 font-mono">#{idx + 1}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">{horn.sub}</div>
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
