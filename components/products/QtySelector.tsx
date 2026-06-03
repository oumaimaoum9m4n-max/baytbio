"use client";

interface QtySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export default function QtySelector({ value, onChange }: QtySelectorProps) {
  return (
    <div className="flex items-center overflow-hidden rounded-[2px] border-[1.5px] border-linen">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-12 w-[42px] items-center justify-center border-none bg-transparent text-xl text-brown transition-colors hover:bg-linen"
        aria-label="Diminuer la quantité"
      >
        −
      </button>
      <input
        readOnly
        value={value}
        className="h-12 w-[52px] border-none bg-transparent text-center font-cormorant text-[1.3rem] font-light text-brown outline-none"
        aria-label="Quantité"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        className="flex h-12 w-[42px] items-center justify-center border-none bg-transparent text-xl text-brown transition-colors hover:bg-linen"
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  );
}
