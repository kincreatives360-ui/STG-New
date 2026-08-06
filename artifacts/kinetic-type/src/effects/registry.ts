import { Effect, ParamDef } from '../types/effects';

// ─── 3D Perspective Projection ───────────────────────────────────────────────
export function project(x: number, y: number, z: number, w: number, h: number, fov = 500) {
  const pz = z + fov;
  if (pz < 1) return null;
  const s = fov / pz;
  return { x: w / 2 + x * s, y: h / 2 + y * s, s };
}

// ─── Smooth noise ─────────────────────────────────────────────────────────────
export function hash(n: number) { return (Math.sin(n) * 43758.5453) % 1; }
export function noise2(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix + iy * 57), b = hash(ix + 1 + iy * 57);
  const c = hash(ix + (iy + 1) * 57), d = hash(ix + 1 + (iy + 1) * 57);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

// ─── Common params ────────────────────────────────────────────────────────────
export const COMMON: Record<string, ParamDef> = {
  'type.size':   { type: 'number', label: 'X-SCALE', min: 10, max: 180, step: 1, default: 72 },
  'type.weight': { type: 'number', label: 'WEIGHT',  min: 1,  max: 10,  step: 1, default: 5  },
};

// ─── Draw helpers ─────────────────────────────────────────────────────────────
export function fontStr(weight: number, size: number) {
  const w = weight >= 8 ? '900' : weight >= 6 ? '700' : weight >= 4 ? '500' : '400';
  return `${w} ${size}px 'Space Mono','Courier New',monospace`;
}

export function drawChar(
  ctx: CanvasRenderingContext2D,
  ch: string, x: number, y: number,
  size: number, color: string,
  rot = 0, alpha = 1, weight = 5,
  scaleX = 1, scaleY = 1,
) {
  if (!ch || alpha <= 0 || size <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY);
  ctx.fillStyle = color;
  ctx.font = fontStr(weight, size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ch, 0, 0);
  ctx.restore();
}

export function clearCanvas(ctx: CanvasRenderingContext2D, w: number, h: number, bg: string, alpha = 1) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = bg;
  if (alpha < 1) {
    ctx.globalAlpha = alpha;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillRect(0, 0, w, h);
  }
}

// ─── Effect factory ───────────────────────────────────────────────────────────
type State = {
  text: string; color: string; bg: string;
  params: Record<string, any>;
  canvas: HTMLCanvasElement | null;
  t: number; dt: number; raf: number;
  extra: Record<string, any>;
};

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, s: State) => void;

export function make(
  name: string,
  params: Record<string, ParamDef>,
  presets: Record<string, Record<string, any>>,
  drawFn: DrawFn,
): Effect {
  const state: State = {
    text: '', color: '#fff', bg: '#000',
    params: {}, canvas: null, t: 0, dt: 0, raf: 0,
    extra: {},
  };
  return {
    name,
    renderer: '2d',
    params,
    presets,
    init(canvas) {
      state.canvas = canvas;
      if (!canvas) return;
      let last = performance.now();
      const loop = (now: number) => {
        state.dt = now - last; last = now; state.t += state.dt;
        const ctx = canvas.getContext('2d')!;
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth; const h = canvas.clientHeight;
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
          canvas.width = w * dpr; canvas.height = h * dpr;
          ctx.scale(dpr, dpr);
        }
        drawFn(ctx, w, h, state);
        state.raf = requestAnimationFrame(loop);
      };
      state.raf = requestAnimationFrame(loop);
    },
    update(p, text, color, bg) {
      state.params = p; state.text = text; state.color = color; state.bg = bg;
    },
    dispose() { cancelAnimationFrame(state.raf); },
  };
}

// ─── Registry (empty — add effects here) ─────────────────────────────────────
const registry: Record<string, () => Effect> = {
};

export const EFFECT_NAMES = Object.keys(registry);
export function getEffect(name: string): Effect {
  const fn = registry[name];
  if (fn) return fn();
  // Fallback: blank canvas
  return make('BLANK', {}, {}, (ctx, w, h, s) => {
    clearCanvas(ctx, w, h, s.bg);
  });
}
