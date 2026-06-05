'use client';

interface Option {
  label: string;
  followUp: string;
}

interface Props {
  options: Option[];
  onSelect: (option: Option) => void;
}

export default function FeltSensePicker({ options, onSelect }: Props) {
  return (
    <div className="space-y-2 mt-4">
      <p className="font-display text-[0.55rem] text-white/50 uppercase tracking-wider mb-3">
        what do you feel?
      </p>
      {options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onSelect(opt)}
          className="pixel-option block w-full text-left"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
