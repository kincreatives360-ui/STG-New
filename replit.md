# Kinetic Type Generator

A highly sophisticated kinetic typography generator — a replica of spacetypegenerator.com — with 23 parametric animation effects rendered entirely in Canvas 2D with manual 3D perspective projection math (no WebGL required).

## Run & Operate

- `pnpm --filter @workspace/kinetic-type run dev` — run the generator app (port 22320)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite + Tailwind CSS v4
- Animation: HTML5 Canvas 2D only (no WebGL — not available in sandbox)
- 3D effects: manual perspective projection math (`project(x,y,z,w,h,fov)`)
- API: Express 5 (shared monorepo server)
- Font: Space Mono (Google Fonts)

## Where things live

- `artifacts/kinetic-type/src/effects/registry.ts` — ALL 23 effects + the `make()` factory and `project()` helper
- `artifacts/kinetic-type/src/components/` — Sidebar, EffectCanvas, EffectSelector, PresetBar
- `artifacts/kinetic-type/src/pages/Generator.tsx` — main page, all state management
- `artifacts/kinetic-type/src/types/effects.ts` — `Effect` and `ParamDef` interfaces

## Effects (all Canvas 2D)

**3D via perspective projection:** CYLINDER, COIL, RIBBON, FLAG, LAYERS, CONSTRUCT, VESSEL, BOOST  
**2D:** FIELD, STRIPES, MORISAWA, CASCADE, DANGER, STRING, BADGE, CLUTTER, SNAP, FLASH, POW, CRASH, CRASH CLOCK, SHINE, BoxSquad

## Architecture decisions

- **No WebGL** — The Replit sandbox has no GPU. All "3D" effects use a `project(x,y,z,w,h,fov)` function that performs perspective division: `scale = fov / (z + fov)`, then `screenX = w/2 + x*scale`. This works in every environment.
- **Single registry file** — All 23 effects live in `registry.ts` using a `make()` factory that manages the RAF loop, canvas sizing, and state updates. Each effect is a pure render function `(ctx, w, h, state) => void`.
- **Physics effects persist state** — CRASH, CRASH CLOCK, STRING, CLUTTER, SNAP, CONSTRUCT store physics state in `state.extra` keyed by effect name to avoid re-initialization on every render tick.
- **renderer: '2d' for all** — The `Effect.renderer` field is always `'2d'`; EffectCanvas always passes `canvasRef.current` regardless of effect type.

## Product

A browser-based kinetic typography playground where users type text and watch it come alive through 23 parametric effects. Every effect has real-time slider controls, named presets, and responds instantly to parameter changes. Built for motion designers and typographers.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **Always keep `renderer: '2d'`** — Do not attempt Three.js or WebGL; the sandbox environment has no GPU and `new WebGLRenderer()` throws immediately.
- **Canvas sizing** — The RAF loop handles DPR scaling; never manually set `canvas.width/height` outside the loop.
- **State.extra resets** — Physics effects (CRASH, STRING, etc.) key their state by `s.extra.clutterText`, `s.extra.crashText`, etc. Changing the text string clears and rebuilds the simulation.
- After codegen, do NOT read the generated files — they are large and fill context.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
