"use client";

interface QtySelectorProps {
  value: number;
  onChange: (value: number) => void;
  /** Upper bound (e.g. available stock). Defaults to 20. */
  max?: number;
  /** Called when the user tries to go above `max`. */
  onExceedMax?: (max: number) => void;
}

export default function QtySelector({
  value,
  onChange,
  max = 20,
  onExceedMax,
}: QtySelectorProps) {
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
        onClick={() =>
          value >= max ? onExceedMax?.(max) : onChange(Math.min(max, value + 1))
        }
        className="flex h-12 w-[42px] items-center justify-center border-none bg-transparent text-xl text-brown transition-colors hover:bg-linen"
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  );
}
