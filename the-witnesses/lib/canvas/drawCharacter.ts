// Procedural 8-bit character sprites for the six witnesses.
// Drawn on a 32x32 logical grid and scaled up with nearest-neighbour rendering.
// `frame` (0|1) drives a simple two-step walk cycle.

import type { CharacterKey } from '../session';

const OUT = '#2e1a14'; // outline / deep brown
const SKIN = '#f0c8a0';
const SKIN_SHADE = '#d4a878';
const WHITE = '#f5f0e0';
const METAL = '#9aa0a6';

const ACCENT: Record<CharacterKey, string> = {
  builder: '#f59e0b',
  explorer: '#14b8a6',
  ripple: '#8b5cf6',
  ghost: '#e5e7eb',
  timeTraveler: '#84cc16',
  trickster: '#ec4899',
};

type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

function darken(hex: string, f = 0.7): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `rgb(${r},${g},${b})`;
}

function px(ctx: Ctx, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

function legs(ctx: Ctx, frame: number, color: string) {
  const a = frame ? 1 : 0;
  const b = frame ? 0 : 1;
  px(ctx, 13, 22, 3, 5 + a, color);
  px(ctx, 17, 22, 3, 5 + b, color);
  px(ctx, 12, 26 + a, 4, 1, OUT); // feet
  px(ctx, 18, 26 + b, 4, 1, OUT);
}

function head(ctx: Ctx) {
  px(ctx, 12, 5, 8, 7, SKIN);
  px(ctx, 12, 5, 8, 1, SKIN_SHADE);
  px(ctx, 19, 6, 1, 6, SKIN_SHADE); // right cheek shade
  px(ctx, 14, 8, 1, 2, OUT); // eyes
  px(ctx, 17, 8, 1, 2, OUT);
}

function body(ctx: Ctx, accent: string, frame: number) {
  px(ctx, 11, 12, 10, 10, accent);
  px(ctx, 19, 12, 2, 10, darken(accent)); // right shade
  px(ctx, 11, 12, 10, 1, darken(accent, 1.15)); // collar highlight
  px(ctx, 9, 13, 2, 7, accent); // arms
  px(ctx, 21, 13, 2, 7, accent);
  px(ctx, 9, 19, 2, 2, SKIN); // hands
  px(ctx, 21, 19, 2, 2, SKIN);
  legs(ctx, frame, OUT);
}

export function drawCharacter(ctx: Ctx, key: CharacterKey, frame: number) {
  const accent = ACCENT[key];

  if (key === 'ghost') {
    // Floating sheet — no legs, semi-transparent, wavy hem.
    ctx.globalAlpha = 0.85;
    px(ctx, 14, 4, 4, 1, WHITE);
    px(ctx, 12, 5, 8, 1, WHITE);
    px(ctx, 11, 6, 10, 14, WHITE);
    // wavy hem (alternates with frame)
    const lift = frame ? 1 : 0;
    px(ctx, 11, 20, 2, 2 - lift, WHITE);
    px(ctx, 13, 20, 2, 1 + lift, WHITE);
    px(ctx, 15, 20, 2, 2 - lift, WHITE);
    px(ctx, 17, 20, 2, 1 + lift, WHITE);
    px(ctx, 19, 20, 2, 2 - lift, WHITE);
    ctx.globalAlpha = 1;
    px(ctx, 13, 10, 2, 3, OUT); // hollow eyes
    px(ctx, 17, 10, 2, 3, OUT);
    return;
  }

  if (key === 'ripple') {
    // A small crowd — "they arrive as many".
    const person = (cx: number, c: string, dy: number) => {
      px(ctx, cx, 8 + dy, 4, 3, SKIN); // head
      px(ctx, cx, 8 + dy, 4, 1, SKIN_SHADE);
      px(ctx, cx + 1, 9 + dy, 1, 1, OUT); // eye
      px(ctx, cx - 1, 11 + dy, 6, 8, c); // body
      px(ctx, cx + 3, 11 + dy, 1, 8, darken(c)); // shade
      px(ctx, cx, 19 + dy, 1, 3, OUT); // legs
      px(ctx, cx + 3, 19 + dy, 1, 3, OUT);
    };
    person(6, darken(accent, 0.7), frame ? 1 : 0);
    person(22, darken(accent, 0.85), frame ? 0 : 1);
    person(14, accent, 0); // front-centre
    return;
  }

  if (key === 'timeTraveler') {
    // Hooded cloak with an hourglass — no separate legs.
    px(ctx, 10, 9, 12, 18, accent);
    px(ctx, 19, 9, 3, 18, darken(accent)); // shade
    px(ctx, 11, 26, 4, 1, OUT); // hem
    px(ctx, 17, 26, 4, 1, OUT);
    px(ctx, 11, 5, 10, 6, darken(accent, 0.75)); // hood
    px(ctx, 10, 6, 1, 4, darken(accent, 0.6));
    px(ctx, 21, 6, 1, 4, darken(accent, 0.6));
    px(ctx, 13, 8, 6, 3, SKIN); // face
    px(ctx, 14, 9, 1, 1, OUT);
    px(ctx, 17, 9, 1, 1, OUT);
    // hourglass
    px(ctx, 14, 15, 4, 1, WHITE);
    px(ctx, 14, 19, 4, 1, WHITE);
    px(ctx, 15, 16, 2, 3, WHITE);
    px(ctx, 15, 17, 2, 1, darken(accent, 0.5));
    return;
  }

  // Humanoid-based characters: builder, explorer, trickster
  body(ctx, accent, frame);
  head(ctx);

  if (key === 'builder') {
    px(ctx, 12, 3, 8, 2, accent); // hard-hat dome
    px(ctx, 13, 2, 6, 1, accent);
    px(ctx, 10, 5, 12, 1, darken(accent)); // brim
    px(ctx, 15, 3, 2, 1, WHITE); // crest
    px(ctx, 23, 14, 1, 8, OUT); // hammer handle
    px(ctx, 22, 13, 4, 2, METAL); // hammer head
  } else if (key === 'explorer') {
    px(ctx, 12, 3, 8, 3, accent); // cap
    px(ctx, 10, 6, 13, 1, darken(accent)); // wide brim
    px(ctx, 7, 13, 2, 7, darken(accent, 0.6)); // backpack strap/pack
    px(ctx, 6, 14, 2, 5, darken(accent, 0.5));
  } else if (key === 'trickster') {
    px(ctx, 11, 4, 3, 3, accent); // jester hat left point
    px(ctx, 18, 4, 3, 3, accent); // right point
    px(ctx, 11, 7, 10, 1, darken(accent)); // hat band
    px(ctx, 12, 2, 1, 1, WHITE); // bells
    px(ctx, 19, 2, 1, 1, WHITE);
    px(ctx, 21, 10, 2, 4, accent); // one arm raised
    px(ctx, 21, 9, 2, 2, SKIN);
  }
}
