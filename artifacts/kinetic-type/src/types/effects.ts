export interface ParamDef {
  type: 'number' | 'color' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  default: number | string;
  label: string;
}

export interface Effect {
  name: string;
  renderer: '3d' | '2d';
  params: Record<string, ParamDef>;
  presets: Record<string, Record<string, number | string>>;
  init(canvas: HTMLCanvasElement | null, container: HTMLElement): void;
  update(params: Record<string, any>, text: string, typeColor: string, bgColor: string): void;
  dispose(): void;
}
