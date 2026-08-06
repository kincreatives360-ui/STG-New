import React, { useEffect, useRef } from 'react';
import { Effect } from '../types/effects';

interface EffectCanvasProps {
  effect: Effect;
  params: Record<string, any>;
  text: string;
  typeColor: string;
  bgColor: string;
}

export function EffectCanvas({ effect, params, text, typeColor, bgColor }: EffectCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    effect.init(canvasRef.current, containerRef.current);
    return () => effect.dispose();
  }, [effect]);

  useEffect(() => {
    effect.update(params, text, typeColor, bgColor);
  }, [effect, params, text, typeColor, bgColor]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
