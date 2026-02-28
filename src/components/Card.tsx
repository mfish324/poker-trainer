import type { Card as CardType } from '../utils/poker';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../utils/poker';

interface CardProps {
  card: CardType | null;
  selected?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const SIZE_CLASSES = {
  sm: 'w-10 h-14 text-sm',
  md: 'w-14 h-20 text-lg',
  lg: 'w-20 h-28 text-2xl',
};

export default function Card({
  card,
  selected = false,
  highlighted = false,
  onClick,
  size = 'md',
  disabled = false,
}: CardProps) {
  if (!card) {
    // Empty card slot
    return (
      <div
        className={`${SIZE_CLASSES[size]} rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center`}
      >
        <span className="text-gray-400 text-2xl">?</span>
      </div>
    );
  }

  const suitSymbol = SUIT_SYMBOLS[card.suit];
  const colorClass = SUIT_COLORS[card.suit];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${SIZE_CLASSES[size]}
        relative rounded-lg bg-white shadow-md
        flex flex-col items-center justify-center
        font-bold select-none
        transition-all duration-200
        ${onClick && !disabled ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}
        ${selected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
        ${highlighted ? 'ring-4 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${colorClass}
      `}
    >
      {/* Top-left corner */}
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
        <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>{card.rank}</span>
        <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>{suitSymbol}</span>
      </div>

      {/* Center suit */}
      <span className={size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-xl'}>
        {suitSymbol}
      </span>

      {/* Bottom-right corner (rotated) */}
      <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
        <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>{card.rank}</span>
        <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>{suitSymbol}</span>
      </div>
    </button>
  );
}

// Card back (for hidden cards)
export function CardBack({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      className={`
        ${SIZE_CLASSES[size]}
        rounded-lg bg-gradient-to-br from-blue-600 to-blue-800
        flex items-center justify-center
        shadow-md
      `}
    >
      <div className="w-3/4 h-3/4 rounded border-2 border-blue-400 bg-blue-700 flex items-center justify-center">
        <span className="text-blue-300 text-lg font-bold">?</span>
      </div>
    </div>
  );
}
