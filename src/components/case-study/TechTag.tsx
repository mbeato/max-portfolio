'use client';

interface TechTagProps {
  label: string;
  category?: string;
}

export default function TechTag({ label }: TechTagProps) {
  return (
    <span className="font-mono text-mono-label tracking-[0.3px] uppercase bg-stone-100 text-stone-700 px-3 py-1.5 rounded-subtle">
      {label}
    </span>
  );
}
