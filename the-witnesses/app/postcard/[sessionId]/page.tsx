'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { GameSession } from '@/lib/session';
import { dbSessionToGameSession } from '@/lib/session';
import { loadLocalSession } from '@/lib/local-session';
import PostcardScreen from '@/components/screens/PostcardScreen';

type State = 'loading' | 'ready' | 'missing';

export default function PostcardPage() {
  const params = useParams();
  const sessionId = params?.sessionId as string;

  const [session, setSession] = useState<GameSession | null>(null);
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    if (!sessionId) return;

    // Prefer the locally-persisted session (demo mode), then fall back to the
    // server read (Supabase mode / shared links opened on the same device).
    const local = loadLocalSession(sessionId);
    if (local && local.seedPhrase) {
      setSession(local);
      setState('ready');
      return;
    }

    fetch(`/api/session/${sessionId}/read`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((data) => {
        setSession(dbSessionToGameSession(data));
        setState('ready');
      })
      .catch(() => setState('missing'));
  }, [sessionId]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="font-display text-[0.7rem] text-white/40 animate-pulse">loading…</div>
      </div>
    );
  }

  if (state === 'missing' || !session) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center gap-6 p-6 text-center">
        <p className="font-display text-[0.8rem] text-white/70 leading-relaxed">
          this postcard isn&apos;t<br />on this device.
        </p>
        <p className="pixel-prose-sm text-white/40 max-w-xs">
          Postcards live in the browser that played them.
        </p>
        <button className="pixel-btn" onClick={() => (window.location.href = '/')}>
          <span>start a new one</span>
          <span aria-hidden>▶</span>
        </button>
      </div>
    );
  }

  return <PostcardScreen session={session} />;
}
