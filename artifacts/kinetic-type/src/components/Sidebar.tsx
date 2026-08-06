import React, { useMemo } from 'react';
import { ParamDef } from '../types/effects';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface SidebarProps {
  paramsDef: Record<string, ParamDef>;
  params: Record<string, any>;
  onChange: (key: string, value: any) => void;
  typeColor: string;
  setTypeColor: (color: string) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
}

export function Sidebar({ paramsDef, params, onChange, typeColor, setTypeColor, bgColor, setBgColor }: SidebarProps) {
  const groups = useMemo(() => {
    const res: Record<string, { key: string; def: ParamDef }[]> = {
      'EFFECT': [],
      'WAVE': [],
      'TYPE': [],
      'CAMERA': [],
      'PHYSICS': [],
      'OTHER': []
    };

    Object.entries(paramsDef).forEach(([key, def]) => {
      const parts = key.split('.');
      if (parts.length > 1) {
        const groupName = parts[0].toUpperCase();
        if (!res[groupName]) res[groupName] = [];
        res[groupName].push({ key, def });
      } else {
        res['EFFECT'].push({ key, def });
      }
    });

    return Object.entries(res).filter(([_, items]) => items.length > 0);
  }, [paramsDef]);

  return (
    <div className="w-[260px] h-full bg-[#0a0a0a] border-r border-[#222] overflow-y-auto flex flex-col z-10 shrink-0 text-xs">
      <Accordion.Root type="multiple" defaultValue={groups.map(g => g[0])} className="w-full">
        {groups.map(([groupName, items]) => (
          <Accordion.Item value={groupName} key={groupName} className="border-b border-[#222]">
            <Accordion.Header className="flex">
              <Accordion.Trigger className="group flex flex-1 items-center justify-between px-4 py-3 bg-[#111] hover:bg-[#1a1a1a] transition-colors font-bold uppercase tracking-wider text-[#eee]">
                {groupName}
                <ChevronDown className="h-3 w-3 text-[#666] transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="px-4 py-3 space-y-4 bg-[#0a0a0a]">
                {items.map(({ key, def }) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center text-[#999]">
                      <span>{def.label}</span>
                      {def.type === 'number' && (
                        <span className="font-mono text-[#eee]">{Number(params[key] ?? def.default).toFixed(def.step && def.step < 1 ? 1 : 0)}</span>
                      )}
                    </div>
                    {def.type === 'number' && (
                      <input
                        type="range"
                        min={def.min}
                        max={def.max}
                        step={def.step}
                        value={params[key] ?? def.default}
                        onChange={(e) => onChange(key, parseFloat(e.target.value))}
                      />
                    )}
                    {def.type === 'select' && (
                      <select 
                        value={params[key] ?? def.default} 
                        onChange={(e) => onChange(key, e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#333] text-white p-1 rounded-none outline-none focus:border-[#666]"
                      >
                        {def.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}

        {/* Global Colors Group */}
        <Accordion.Item value="COLORS" className="border-b border-[#222]">
          <Accordion.Header className="flex">
            <Accordion.Trigger className="group flex flex-1 items-center justify-between px-4 py-3 bg-[#111] hover:bg-[#1a1a1a] transition-colors font-bold uppercase tracking-wider text-[#eee]">
              COLORS
              <ChevronDown className="h-3 w-3 text-[#666] transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="px-4 py-3 space-y-4 bg-[#0a0a0a]">
              <div className="flex justify-between items-center">
                <span className="text-[#999]">TYPE</span>
                <input 
                  type="color" 
                  value={typeColor} 
                  onChange={e => setTypeColor(e.target.value)}
                  className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#999]">BACKGROUND</span>
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={e => setBgColor(e.target.value)}
                  className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
