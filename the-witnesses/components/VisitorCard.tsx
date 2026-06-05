'use client';

import { useState, useEffect, useRef } from 'react';
import type { CharacterData } from '@/lib/characters';
import { EXPLORER_OBJECTS, interpolate } from '@/lib/characters';
import FeltSensePicker from './FeltSensePicker';
import GhostEraser from './GhostEraser';
import PixelButton from './ui/PixelButton';

interface Props {
  character: CharacterData;
  arrivalLineIndex: number;
  playerWord?: string;
  seedPhrase?: string;
  onComplete: (data: {
    playerText: string;
    secondText?: string;
    feltSense: string;
    objectChoice?: 'lamp' | 'blanket' | 'mug';
    erasedElement?: string;
  }) => void;
}

type Phase = 'arriving' | 'prompting' | 'player-input' | 'felt-sense' | 'follow-up' | 'exit';

function useTypewriter(text: string, active: boolean): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    // When this line is not the active phase, keep the full text on screen so
    // earlier prompts/arrival lines stay visible instead of blanking out.
    if (!active) { setDisplayed(text); return; }
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 1000 / 40); // 40 chars/sec
    return () => clearInterval(interval);
  }, [text, active]);

  return displayed;
}

export default function VisitorCard({ character, arrivalLineIndex, playerWord, seedPhrase, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('arriving');
  const [playerText, setPlayerText] = useState('');
  const [secondText, setSecondText] = useState('');
  const [selectedFelt, setSelectedFelt] = useState<{ label: string; followUp: string } | null>(null);
  const [objectChoice, setObjectChoice] = useState<'lamp' | 'blanket' | 'mug' | null>(null);
  const [erasedElement, setErasedElement] = useState<string | null>(null);
  const [arrivalDone, setArrivalDone] = useState(false);
  const [promptDone, setPromptDone] = useState(false);
  const [followUpDone, setFollowUpDone] = useState(false);
  const [exitDone, setExitDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const arrivalLine = character.arrivalLines[arrivalLineIndex];
  const rawPrompt = character.mainPrompt;
  const mainPrompt = interpolate(rawPrompt, {
    PLAYER_WORD: playerWord,
    SEED: seedPhrase,
  });

  const displayedArrival = useTypewriter(arrivalLine, phase === 'arriving');
  const displayedPrompt = useTypewriter(mainPrompt, phase === 'prompting');
  const displayedFollowUp = useTypewriter(selectedFelt?.followUp ?? '', phase === 'follow-up');
  const exitLineRaw = interpolate(character.exitLine, {
    OBJECT: objectChoice ?? undefined,
    ELEMENT: erasedElement ?? undefined,
  });
  const displayedExit = useTypewriter(exitLineRaw, phase === 'exit');

  // Advance phases
  useEffect(() => {
    if (phase === 'arriving' && displayedArrival === arrivalLine && arrivalLine.length > 0) {
      setArrivalDone(true);
      setTimeout(() => setPhase('prompting'), 600);
    }
  }, [displayedArrival, arrivalLine, phase]);

  useEffect(() => {
    if (phase === 'prompting' && displayedPrompt === mainPrompt && mainPrompt.length > 0) {
      setPromptDone(true);
      setTimeout(() => {
        setPhase('player-input');
        setTimeout(() => textareaRef.current?.focus(), 100);
      }, 400);
    }
  }, [displayedPrompt, mainPrompt, phase]);

  useEffect(() => {
    if (phase === 'follow-up' && displayedFollowUp === selectedFelt?.followUp && (selectedFelt?.followUp.length ?? 0) > 0) {
      setFollowUpDone(true);
      setTimeout(() => setPhase('exit'), 800);
    }
  }, [displayedFollowUp, selectedFelt, phase]);

  useEffect(() => {
    if (phase === 'exit' && displayedExit === exitLineRaw && exitLineRaw.length > 0) {
      setExitDone(true);
    }
  }, [displayedExit, exitLineRaw, phase]);

  const handleSubmitPlayerText = () => {
    if (!playerText.trim()) return;
    setPhase('felt-sense');
  };

  const handleFeltSense = (opt: { label: string; followUp: string }) => {
    setSelectedFelt(opt);
    setPhase('follow-up');
  };

  const handleContinue = () => {
    if (!exitDone) return;
    onComplete({
      playerText,
      secondText: character.key === 'ripple' ? secondText : undefined,
      feltSense: selectedFelt?.label ?? '',
      objectChoice: objectChoice ?? undefined,
      erasedElement: erasedElement ?? undefined,
    });
  };

  const accentTextStyle = { color: character.accentColor };

  const isTimeTraveler = character.key === 'timeTraveler';
  const isRipple = character.key === 'ripple';
  const isGhost = character.key === 'ghost';
  const isExplorer = character.key === 'explorer';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="pixel-panel p-6"
        style={{
          background: '#0d0d20',
          borderLeftWidth: 6,
          borderLeftColor: character.accentColor,
        }}
      >
        {/* Character name */}
        <div className="font-display text-[0.6rem] uppercase tracking-wider mb-4" style={accentTextStyle}>
          {character.name}
        </div>

        {/* Arrival line */}
        {(phase === 'arriving' || arrivalDone) && (
          <p className="pixel-prose-sm text-white/55 mb-4 whitespace-pre-wrap min-h-[2rem]">
            {displayedArrival}
          </p>
        )}

        {/* Main prompt */}
        {(phase === 'prompting' || promptDone) && (
          <p className="font-body text-xl text-white mb-4 whitespace-pre-wrap min-h-[2rem] leading-snug">
            {displayedPrompt}
          </p>
        )}

        {/* Player input area */}
        {phase === 'player-input' && (
          <div className="space-y-3">
            {isRipple ? (
              <>
                <div>
                  <label className="block font-display text-[0.5rem] text-white/50 uppercase tracking-wider mb-2">some of us…</label>
                  <textarea
                    ref={textareaRef}
                    value={playerText}
                    onChange={(e) => setPlayerText(e.target.value)}
                    className="pixel-input resize-none"
                    rows={3}
                    placeholder="what some of us needed…"
                  />
                </div>
                <div>
                  <label className="block font-display text-[0.5rem] text-white/50 uppercase tracking-wider mb-2">others…</label>
                  <textarea
                    value={secondText}
                    onChange={(e) => setSecondText(e.target.value)}
                    className="pixel-input resize-none"
                    rows={3}
                    placeholder="what others needed…"
                  />
                </div>
              </>
            ) : isTimeTraveler ? (
              <div className="flex items-start gap-2">
                <span className="font-body text-lg text-white/60 pt-3 whitespace-nowrap">by 2036, it had…</span>
                <textarea
                  ref={textareaRef}
                  value={playerText}
                  onChange={(e) => setPlayerText(e.target.value)}
                  className="pixel-input resize-none flex-1"
                  rows={3}
                  placeholder="…completed the sentence"
                />
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={playerText}
                onChange={(e) => setPlayerText(e.target.value)}
                className="pixel-input resize-none"
                rows={4}
                placeholder={isGhost ? 'what you took away to make space…' : ''}
              />
            )}

            {isExplorer && (
              <div className="flex flex-wrap gap-2 mt-2">
                {EXPLORER_OBJECTS.map((obj) => (
                  <button
                    key={obj}
                    onClick={() => setObjectChoice(obj)}
                    className="pixel-option"
                    data-selected={objectChoice === obj}
                  >
                    a {obj}
                  </button>
                ))}
              </div>
            )}

            {isGhost && (
              <GhostEraser selectedElement={erasedElement} onSelect={setErasedElement} />
            )}

            <PixelButton
              onClick={handleSubmitPlayerText}
              disabled={!playerText.trim() || (isExplorer && !objectChoice) || (isGhost && !erasedElement)}
              className="mt-2"
            >
              continue
            </PixelButton>
          </div>
        )}

        {/* Felt sense picker */}
        {phase === 'felt-sense' && (
          <FeltSensePicker options={character.feltSenseOptions} onSelect={handleFeltSense} />
        )}

        {/* Follow-up */}
        {(phase === 'follow-up' || followUpDone) && phase !== 'player-input' && phase !== 'felt-sense' && (
          <p className="font-body text-xl text-white/80 whitespace-pre-wrap mt-4 min-h-[2rem] leading-snug">
            {displayedFollowUp}
          </p>
        )}

        {/* Exit line */}
        {phase === 'exit' && (
          <p className="pixel-prose-sm text-white/45 mt-4 whitespace-pre-wrap min-h-[2rem]">
            {displayedExit}
          </p>
        )}

        {/* Continue button after exit */}
        {exitDone && (
          <PixelButton onClick={handleContinue} className="mt-6">
            next
          </PixelButton>
        )}
      </div>
    </div>
  );
}
