'use client';

import PixelNav from '@/components/ui/PixelNav';

interface Props {
  onNext: () => void;
}

export default function ArrivalScreen({ onNext }: Props) {
  return (
    <div className="relative min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center overflow-hidden px-6 pb-32">
      {/* Drifting clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="cloud-drift absolute top-[15%] text-white/10 text-6xl pixelated" style={{ left: '-10%', animationDuration: '40s' }}>
          ☁
        </div>
        <div className="cloud-drift absolute top-[30%] text-white/5 text-4xl pixelated" style={{ left: '-20%', animationDuration: '55s', animationDelay: '10s' }}>
          ☁
        </div>
        <div className="cloud-drift absolute top-[10%] text-white/8 text-5xl pixelated" style={{ left: '-30%', animationDuration: '70s', animationDelay: '20s' }}>
          ☁
        </div>
      </div>

      {/* Title */}
      <div className="text-center animate-fade-in z-10 max-w-2xl">
        <h1 className="font-display text-white/90 leading-[1.4] tracking-tight text-2xl sm:text-4xl md:text-5xl mb-8">
          the<br />witnesses
        </h1>
        <p className="font-body text-white/45 text-xl sm:text-2xl tracking-wide">
          a small game from winded.vertigo
        </p>
        <p className="font-body text-white/30 text-lg mt-6 pixel-caret">
          press ▶ to begin
        </p>
      </div>

      <PixelNav onNext={onNext} nextLabel="open the letter" hideBack />
    </div>
  );
}
