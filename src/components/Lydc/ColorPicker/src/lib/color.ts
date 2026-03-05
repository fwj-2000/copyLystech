import { hasOwn } from '@vue/shared';
import { Options } from '../type/types';

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const hsv2hsl = (hue: number, sat: number, val: number): [number, number, number] => {
  const l = (2 - sat) * val;
  const denominator = l < 1 ? l : 2 - l;
  const s = denominator ? (sat * val) / denominator : 0;
  return [hue, s, l / 2];
};

const isOnePointZero = (n: unknown): boolean => typeof n === 'string' && n.includes('.') && Number.parseFloat(n) === 1;

const isPercentage = (n: unknown): boolean => typeof n === 'string' && n.includes('%');

const bound01 = (value: number | string, max: number | string): number => {
  let currentValue: number | string = value;

  if (isOnePointZero(currentValue)) {
    currentValue = '100%';
  }

  const isPercent = isPercentage(currentValue);
  let num = Math.max(0, Number.parseFloat(String(currentValue)));
  const maxNum = typeof max === 'string' ? Number.parseFloat(max) : max;

  num = Math.min(maxNum, num);

  if (isPercent) {
    num = Number.parseInt(String(num * maxNum), 10) / 100;
  }

  if (Math.abs(num - maxNum) < Number.EPSILON) {
    return 1;
  }

  return (num % maxNum) / maxNum;
};

const INT_HEX_MAP: Record<number, string> = {
  10: 'A',
  11: 'B',
  12: 'C',
  13: 'D',
  14: 'E',
  15: 'F',
};

const hexOne = (value: number): string => {
  const clampedValue = Math.min(Math.round(value), 255);
  const high = Math.floor(clampedValue / 16);
  const low = clampedValue % 16;
  const highHex = String(INT_HEX_MAP[high] ?? high);
  const lowHex = String(INT_HEX_MAP[low] ?? low);
  return `${highHex}${lowHex}`;
};

const toHex = ({ r, g, b }: { r: number; g: number; b: number }): string => {
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return '';
  }

  return `#${hexOne(r)}${hexOne(g)}${hexOne(b)}`;
};

const HEX_INT_MAP: Record<string, number> = {
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
};

const parseHexDigit = (digit: string): number => {
  const upper = digit.toUpperCase();
  return HEX_INT_MAP[upper] ?? Number(upper);
};

const parseHexChannel = (hex: string): number => {
  const first = hex[0] ?? '';
  const second = hex[1] ?? '';

  if (hex.length === 2) {
    return parseHexDigit(first) * 16 + parseHexDigit(second);
  }

  return parseHexDigit(second);
};

const hsl2hsv = (hue: number, sat: number, light: number): { h: number; s: number; v: number } => {
  let s = sat / 100;
  let l = light / 100;
  let smin = s;
  const lmin = Math.max(l, 0.01);

  l *= 2;
  s *= l <= 1 ? l : 2 - l;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  const v = (l + s) / 2;
  const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

  return {
    h: hue,
    s: sv * 100,
    v: v * 100,
  };
};

const rgb2hsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
  const rBound = bound01(r, 255);
  const gBound = bound01(g, 255);
  const bBound = bound01(b, 255);

  const max = Math.max(rBound, gBound, bBound);
  const min = Math.min(rBound, gBound, bBound);
  let h = 0;
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case rBound: {
        h = (gBound - bBound) / d + (gBound < bBound ? 6 : 0);
        break;
      }
      case gBound: {
        h = (bBound - rBound) / d + 2;
        break;
      }
      case bBound: {
        h = (rBound - gBound) / d + 4;
        break;
      }
      default:
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsv2rgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
  const hBound = bound01(h, 360) * 6;
  const sBound = bound01(s, 100);
  const vBound = bound01(v, 100);

  const i = Math.floor(hBound);
  const f = hBound - i;
  const p = vBound * (1 - sBound);
  const q = vBound * (1 - f * sBound);
  const t = vBound * (1 - (1 - f) * sBound);
  const mod = i % 6;
  const r = [vBound, q, p, p, t, vBound][mod];
  const g = [t, vBound, vBound, q, p, p][mod];
  const b = [p, p, t, vBound, vBound, q][mod];

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

type ColorFormat = 'hex' | 'hsl' | 'hsv' | 'rgb';

export default class Color {
  private _hue = 0;
  private _saturation = 100;
  private _value = 100;
  private _alpha = 100;

  public enableAlpha = false;
  public format: ColorFormat = 'hex';
  public value = '';
  public selected?: boolean;

  // Index signature to safely support dynamic property assignment
  [key: string]: unknown;

  constructor(options?: Options) {
    if (options) {
      Object.keys(options).forEach(key => {
        if (hasOwn(options, key)) {
          this[key] = options[key as keyof Options] as unknown;
        }
      });
    }

    this.doOnChange();
  }

  set(prop: Record<string, number> | string, value?: number): void {
    if (typeof prop === 'object' && prop !== null) {
      Object.keys(prop).forEach(key => {
        if (hasOwn(prop, key)) {
          this.set(key, prop[key]);
        }
      });
      return;
    }

    if (typeof prop === 'string') {
      const internalKey = `_${prop}`;
      if (typeof value === 'number') {
        this[internalKey] = value;
        this.doOnChange();
      }
    }
  }

  get(prop: string): unknown {
    if (prop === 'alpha') {
      return Math.floor(this._alpha);
    }

    const internalKey = `_${prop}`;
    return this[internalKey];
  }

  toRgb(): { r: number; g: number; b: number } {
    return hsv2rgb(this._hue, this._saturation, this._value);
  }

  private parseFunctionalColor(value: string, removeTokens: string[]): { parts: (number | string)[]; alpha: number } | null {
    let normalized = value;
    removeTokens.forEach(token => {
      normalized = normalized.replaceAll(token, '');
    });
    normalized = normalized.replaceAll('(', '').replaceAll(')', '');

    const parts = normalized
      .split(/\s|,/g)
      .filter(val => val !== '')
      .map((val, index) => (index > 2 ? Number.parseFloat(val) : Number.parseInt(val, 10)));

    if (parts.length < 3) {
      return null;
    }

    let alpha: number;

    if (parts.length === 4) {
      alpha = Number.parseFloat(String(parts[3])) * 100;
    } else if (parts.length === 3) {
      alpha = 100;
    } else {
      alpha = this._alpha;
    }

    return { parts, alpha };
  }

  private resetToDefault(): void {
    this._hue = 0;
    this._saturation = 100;
    this._value = 100;
    this.doOnChange();
  }
  private applyFromHSV(h: number, s: number, v: number): void {
    this._hue = clamp(h, 0, 360);
    this._saturation = clamp(s, 0, 100);
    this._value = clamp(v, 0, 100);
    this.doOnChange();
  }

  private handleFunctionalColor(value: string, tokens: string[], converter?: (a: number, b: number, c: number) => { h: number; s: number; v: number }): void {
    const parsed = this.parseFunctionalColor(value, tokens);
    if (!parsed) {
      return;
    }

    const { parts, alpha } = parsed;
    this._alpha = alpha;

    const a = parts[0] as number;
    const b = parts[1] as number;
    const c = parts[2] as number;

    if (converter) {
      const { h, s, v } = converter(a, b, c);
      this.applyFromHSV(h, s, v);
      return;
    }

    this.applyFromHSV(a, b, c);
  }

  private handleHexColor(value: string): void {
    const hex = value.replace('#', '').trim();
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(hex)) {
      return;
    }

    let r = 0;
    let g = 0;
    let b = 0;

    if (hex.length === 3) {
      r = parseHexChannel(hex[0] + hex[0]);
      g = parseHexChannel(hex[1] + hex[1]);
      b = parseHexChannel(hex[2] + hex[2]);
    } else {
      r = parseHexChannel(hex.substring(0, 2));
      g = parseHexChannel(hex.substring(2, 4));
      b = parseHexChannel(hex.substring(4, 6));
    }

    if (hex.length === 8) {
      this._alpha = (parseHexChannel(hex.substring(6)) / 255) * 100;
    } else {
      this._alpha = 100;
    }

    const { h, s, v } = rgb2hsv(r, g, b);
    this.applyFromHSV(h, s, v);
  }

  fromString(value: string): void {
    const trimmed = value.trim();

    if (!trimmed) {
      this.resetToDefault();
      return;
    }

    if (trimmed.includes('#')) {
      this.handleHexColor(trimmed);
      return;
    }

    if (trimmed.includes('hsl')) {
      this.handleFunctionalColor(trimmed, ['hsla', 'hsl'], (h, s, l) => hsl2hsv(h, s, l));
      return;
    }

    if (trimmed.includes('hsv')) {
      this.handleFunctionalColor(trimmed, ['hsva', 'hsv']);
      return;
    }

    if (trimmed.includes('rgb')) {
      this.handleFunctionalColor(trimmed, ['rgba', 'rgb'], (r, g, b) => rgb2hsv(r, g, b));
    }
  }

  compare(color: Color): boolean {
    return (
      Math.abs(color._hue - this._hue) < 2 &&
      Math.abs(color._saturation - this._saturation) < 1 &&
      Math.abs(color._value - this._value) < 1 &&
      Math.abs(color._alpha - this._alpha) < 1
    );
  }

  doOnChange(): void {
    const { _hue, _saturation, _value, _alpha, format } = this;

    if (this.enableAlpha) {
      switch (format) {
        case 'hsl': {
          const [h, s, l] = hsv2hsl(_hue, _saturation / 100, _value / 100);
          this.value = `hsla(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${Number(this.get('alpha')) / 100})`;
          break;
        }
        case 'hsv': {
          this.value = `hsva(${_hue}, ${Math.round(_saturation)}%, ${Math.round(_value)}%, ${Number(this.get('alpha')) / 100})`;
          break;
        }
        case 'hex': {
          this.value = `${toHex(hsv2rgb(_hue, _saturation, _value))}${hexOne((_alpha * 255) / 100)}`;
          break;
        }
        default: {
          const { r, g, b } = hsv2rgb(_hue, _saturation, _value);
          this.value = `rgba(${r}, ${g}, ${b}, ${Number(this.get('alpha')) / 100})`;
        }
      }
      return;
    }

    switch (format) {
      case 'hsl': {
        const [h, s, l] = hsv2hsl(_hue, _saturation / 100, _value / 100);
        this.value = `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
        break;
      }
      case 'hsv': {
        this.value = `hsv(${_hue}, ${Math.round(_saturation)}%, ${Math.round(_value)}%)`;
        break;
      }
      case 'rgb': {
        const { r, g, b } = hsv2rgb(_hue, _saturation, _value);
        this.value = `rgb(${r}, ${g}, ${b})`;
        break;
      }
      default: {
        this.value = toHex(hsv2rgb(_hue, _saturation, _value));
      }
    }
  }
}
