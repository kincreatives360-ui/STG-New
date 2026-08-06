import React from 'react';

interface PresetBarProps {
  presets: string[];
  onSelect: (preset: string) => void;
  activePreset?: string;
}

export function PresetBar({ presets, onSelect, activePreset }: PresetBarProps) {
  if (!presets.length) return null;
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 max-w-[70vw] overflow-x-auto pb-1 scrollbar-hide">
      {presets.map(preset => (
        <button
          key={preset}
          onClick={() => onSelect(preset)}
          className={`whitespace-nowrap px-3 py-1 text-[10px] uppercase tracking-wider border transition-colors ${activePreset === preset ? 'bg-white text-black border-white' : 'bg-transparent text-[#aaa] border-[#444] hover:border-white hover:text-white'}`}
        >
          {preset}
        </button>
      ))}
    </div>
  );
}
