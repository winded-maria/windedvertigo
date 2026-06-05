'use client';

import type { CharacterData } from '@/lib/characters';
import CharacterSprite from './CharacterSprite';

interface Props {
  character: CharacterData;
}

/**
 * Overlay played each time a visitor arrives: a pixel sprite emerges from the
 * library door and walks toward the viewer, growing as it approaches, with a
 * name tag that fades in. Purely decorative (pointer-events: none) so the
 * scene underneath stays interactive.
 */
export default function CharacterArrival({ character }: Props) {
  return (
    <div className="character-arrival" aria-hidden>
      <div className="door-flash" />
      <div className="character-walker">
        <CharacterSprite characterKey={character.key} className="character-sprite" />
      </div>
      <div className="character-nametag" style={{ color: character.accentColor }}>
        {character.name}
      </div>
    </div>
  );
}
