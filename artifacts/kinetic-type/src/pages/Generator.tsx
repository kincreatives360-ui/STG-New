import React, { useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { EffectCanvas } from '../components/EffectCanvas';
import { getEffect } from '../effects/registry';

export default function Generator() {
  const effect = useMemo(() => getEffect('BLANK'), []);
  const [params, setParams] = useState<Record<string, any>>({});
  const [text, setText] = useState('KINETIC TYPE GENERATOR');
  const [typeColor, setTypeColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');

  const updateParam = (key: string, value: any) => setParams(current => ({ ...current, [key]: value }));

  return (
    <main className="w-full h-[100dvh] flex bg-black text-white font-mono overflow-hidden select-none">
      <Sidebar paramsDef={effect.params} params={params} onChange={updateParam} typeColor={typeColor} setTypeColor={setTypeColor} bgColor={bgColor} setBgColor={setBgColor} />
      <section className="relative flex-1 min-w-0 h-full overflow-hidden">
        <EffectCanvas effect={effect} params={params} text={text} typeColor={typeColor} bgColor={bgColor} />
        <div className="absolute bottom-4 left-4 z-20 w-[300px] max-w-[calc(100vw-320px)]">
          <input
            data-testid="input-generator-text"
            value={text}
            onChange={e => setText(e.target.value.toUpperCase())}
            className="w-full bg-transparent border-b border-[#555] py-2 text-xs tracking-widest text-white placeholder-[#666] outline-none focus:border-white"
            aria-label="Generator text"
          />
        </div>
      </section>
    </main>
  );
}
