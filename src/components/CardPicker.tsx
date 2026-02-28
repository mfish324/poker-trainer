import { useState } from 'react';
import type { Card as CardType } from '../utils/poker';
import { SUITS, RANKS, SUIT_SYMBOLS, SUIT_COLORS, cardToString } from '../utils/poker';
import Card from './Card';

interface CardPickerProps {
  selectedCards: CardType[];
  onCardSelect: (card: CardType) => void;
  onCardDeselect: (card: CardType) => void;
  maxCards?: number;
  disabledCards?: CardType[];
  title?: string;
}

export default function CardPicker({
  selectedCards,
  onCardSelect,
  onCardDeselect,
  maxCards = 2,
  disabledCards = [],
  title = 'Select Cards',
}: CardPickerProps) {
  const selectedSet = new Set(selectedCards.map(cardToString));
  const disabledSet = new Set(disabledCards.map(cardToString));

  const handleCardClick = (card: CardType) => {
    const cardStr = cardToString(card);
    if (selectedSet.has(cardStr)) {
      onCardDeselect(card);
    } else if (selectedCards.length < maxCards && !disabledSet.has(cardStr)) {
      onCardSelect(card);
    }
  };

  const isDisabled = (card: CardType) => {
    const cardStr = cardToString(card);
    return disabledSet.has(cardStr) ||
           (selectedCards.length >= maxCards && !selectedSet.has(cardStr));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      {/* Selected cards display */}
      <div className="flex gap-2 mb-4 justify-center">
        {Array.from({ length: maxCards }).map((_, i) => (
          <div key={i} className="relative">
            {selectedCards[i] ? (
              <div className="relative">
                <Card card={selectedCards[i]} size="lg" />
                <button
                  onClick={() => onCardDeselect(selectedCards[i])}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <Card card={null} size="lg" />
            )}
          </div>
        ))}
      </div>

      {/* Card grid by suit */}
      <div className="space-y-2">
        {SUITS.map((suit) => (
          <div key={suit} className="flex items-center gap-1">
            <span className={`w-6 text-xl ${SUIT_COLORS[suit]}`}>
              {SUIT_SYMBOLS[suit]}
            </span>
            <div className="flex gap-1 flex-wrap">
              {RANKS.map((rank) => {
                const card: CardType = { rank, suit };
                const cardStr = cardToString(card);
                const isSelected = selectedSet.has(cardStr);
                const isCardDisabled = isDisabled(card);

                return (
                  <button
                    key={cardStr}
                    onClick={() => handleCardClick(card)}
                    disabled={isCardDisabled && !isSelected}
                    className={`
                      w-8 h-10 rounded text-sm font-bold
                      flex items-center justify-center
                      transition-all
                      ${SUIT_COLORS[suit]}
                      ${isSelected
                        ? 'bg-blue-100 ring-2 ring-blue-500'
                        : isCardDisabled
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }
                    `}
                  >
                    {rank}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedCards.length > 0 && (
        <button
          onClick={() => selectedCards.forEach(onCardDeselect)}
          className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          Clear Selection
        </button>
      )}
    </div>
  );
}

// Compact version for inline use
interface CompactCardPickerProps {
  selectedCards: CardType[];
  onCardsChange: (cards: CardType[]) => void;
  maxCards?: number;
  disabledCards?: CardType[];
  label?: string;
}

export function CompactCardPicker({
  selectedCards,
  onCardsChange,
  maxCards = 2,
  disabledCards = [],
  label,
}: CompactCardPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (card: CardType) => {
    if (selectedCards.length < maxCards) {
      onCardsChange([...selectedCards, card]);
    }
  };

  const handleDeselect = (card: CardType) => {
    onCardsChange(selectedCards.filter(c => cardToString(c) !== cardToString(card)));
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
      >
        {selectedCards.length > 0 ? (
          <div className="flex gap-1">
            {selectedCards.map((card, i) => (
              <span key={i} className={`font-bold ${SUIT_COLORS[card.suit]}`}>
                {card.rank}{SUIT_SYMBOLS[card.suit]}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">Click to select cards</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-xl border border-gray-200">
          <CardPicker
            selectedCards={selectedCards}
            onCardSelect={handleSelect}
            onCardDeselect={handleDeselect}
            maxCards={maxCards}
            disabledCards={disabledCards}
            title={label || 'Select Cards'}
          />
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-b-xl transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
