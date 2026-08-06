import React from 'react';

interface EffectSelectorProps {
  effects: string[];
  activeEffect: string;
  onSelect: (effectName: string) => void;
}

export function EffectSelector({ effects, activeEffect, onSelect }: EffectSelectorProps) {
  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="relative">
        <select 
          value={activeEffect}
          onChange={(e) => onSelect(e.target.value)}
          className="appearance-none bg-[#111] text-white border border-[#333] pl-4 pr-10 py-2 text-sm uppercase tracking-wider font-bold cursor-pointer hover:bg-[#1a1a1a] transition-colors outline-none focus:border-[#666]"
        >
          {effects.map(effect => (
            <option key={effect} value={effect}>{effect}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#666]">
          ▼
        </div>
      </div>
    </div>
  );
}
