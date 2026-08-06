export function createTextTexture(char: string, font: string, color: string, weight: number = 400): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const size = 128; // High res
  canvas.width = size;
  canvas.height = size;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size * 0.8}px ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.fillText(char, size / 2, size / 2 + size * 0.05);

  return canvas;
}

export function measureTextWidth(text: string, font: string, size: number): number[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  
  ctx.font = `${size}px ${font}`;
  return text.split('').map(char => ctx.measureText(char).width);
}
