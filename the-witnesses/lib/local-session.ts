// Client-side session persistence for demo mode.
//
// The demo server store (lib/demo-store.ts) is an in-memory Map, which does not
// survive between requests on stateless platforms like Cloudflare Workers (each
// request may hit a fresh isolate). To keep the game fully playable end-to-end
// without a database, we mirror the session into localStorage on the device that
// is playing and read it back on the /play and /postcard routes.

import type { GameSession } from './session';

const keyFor = (id: string) => `witnesses:session:${id}`;

export function saveLocalSession(session: GameSession): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(keyFor(session.id), JSON.stringify(session));
  } catch {
    /* storage unavailable / full — non-fatal, play continues in memory */
  }
}

export function loadLocalSession(id: string): GameSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(keyFor(id));
    return raw ? (JSON.parse(raw) as GameSession) : null;
  } catch {
    return null;
  }
}
