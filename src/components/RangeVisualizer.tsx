import { useState, useMemo } from 'react';
import {
  getHandNotation,
  getHandCombos,
  getRangeCombos,
  getRangePercentage,
  getHandTier,
  getTierColor,
  POSITION_RANGES,
  isHandInRange,
} from '../utils/ranges';

type ViewMode = 'position' | 'custom' | 'strength';

export default function RangeVisualizer() {
  const [viewMode, setViewMode] = useState<ViewMode>('position');
  const [selectedPosition, setSelectedPosition] = useState('UTG');
  const [customRange, setCustomRange] = useState<Set<string>>(new Set());
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragMode, setDragMode] = useState<'add' | 'remove'>('add');

  // Get the current range based on view mode
  const currentRange = useMemo(() => {
    if (viewMode === 'custom') {
      return Array.from(customRange);
    }
    const posRange = POSITION_RANGES.find(r => r.position === selectedPosition);
    return posRange?.hands || [];
  }, [viewMode, selectedPosition, customRange]);

  const rangeStats = useMemo(() => ({
    combos: getRangeCombos(currentRange),
    percentage: getRangePercentage(currentRange),
    hands: currentRange.length,
  }), [currentRange]);

  const handleCellClick = (hand: string) => {
    if (viewMode !== 'custom') return;

    setCustomRange(prev => {
      const next = new Set(prev);
      if (next.has(hand)) {
        next.delete(hand);
      } else {
        next.add(hand);
      }
      return next;
    });
  };

  const handleMouseDown = (hand: string) => {
    if (viewMode !== 'custom') return;

    setIsMouseDown(true);
    const isSelected = customRange.has(hand);
    setDragMode(isSelected ? 'remove' : 'add');
    handleCellClick(hand);
  };

  const handleMouseEnter = (hand: string) => {
    if (!isMouseDown || viewMode !== 'custom') return;

    setCustomRange(prev => {
      const next = new Set(prev);
      if (dragMode === 'add') {
        next.add(hand);
      } else {
        next.delete(hand);
      }
      return next;
    });
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const loadPresetRange = (position: string) => {
    const posRange = POSITION_RANGES.find(r => r.position === position);
    if (posRange) {
      setCustomRange(new Set(posRange.hands));
      setViewMode('custom');
    }
  };

  const clearRange = () => {
    setCustomRange(new Set());
  };

  const selectAllHands = () => {
    const allHands: string[] = [];
    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        allHands.push(getHandNotation(row, col));
      }
    }
    setCustomRange(new Set(allHands));
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Range Visualizer</h2>
        <p className="text-gray-600 mb-6">
          Explore starting hand ranges by position. Learn which hands to play from each seat.
        </p>

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('position')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              viewMode === 'position'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Position Ranges
          </button>
          <button
            onClick={() => setViewMode('custom')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              viewMode === 'custom'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Custom Range
          </button>
          <button
            onClick={() => setViewMode('strength')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              viewMode === 'strength'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hand Strength
          </button>
        </div>

        {/* Position Selector (for position mode) */}
        {viewMode === 'position' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Position</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {POSITION_RANGES.map((range) => (
                <button
                  key={range.position}
                  onClick={() => setSelectedPosition(range.position)}
                  className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                    selectedPosition === range.position
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.position}
                </button>
              ))}
            </div>
            {selectedPosition && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">
                  {POSITION_RANGES.find(r => r.position === selectedPosition)?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {POSITION_RANGES.find(r => r.position === selectedPosition)?.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Custom Range Controls */}
        {viewMode === 'custom' && (
          <div className="mb-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={clearRange}
                className="py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
              >
                Clear All
              </button>
              <button
                onClick={selectAllHands}
                className="py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
              >
                Select All
              </button>
              <span className="text-gray-400 mx-2">|</span>
              <span className="text-sm text-gray-600 py-2">Load preset:</span>
              {POSITION_RANGES.slice(0, 4).map((range) => (
                <button
                  key={range.position}
                  onClick={() => loadPresetRange(range.position)}
                  className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  {range.position}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Click or drag to select/deselect hands
            </p>
          </div>
        )}

        {/* Strength Legend */}
        {viewMode === 'strength' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Hand Strength Tiers</p>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-red-600 rounded"></span>
                <span className="text-xs text-gray-600">Premium</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-orange-500 rounded"></span>
                <span className="text-xs text-gray-600">Strong</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-yellow-500 rounded"></span>
                <span className="text-xs text-gray-600">Playable</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-green-600 rounded"></span>
                <span className="text-xs text-gray-600">Marginal</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-blue-600 rounded"></span>
                <span className="text-xs text-gray-600">Weak/Speculative</span>
              </span>
            </div>
          </div>
        )}

        {/* Range Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{rangeStats.percentage.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">of Hands</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{rangeStats.combos}</div>
            <div className="text-xs text-gray-500">Combos</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{rangeStats.hands}</div>
            <div className="text-xs text-gray-500">Hand Types</div>
          </div>
        </div>

        {/* 13x13 Hand Matrix */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div
              className="grid gap-[2px] bg-gray-300 p-[2px] rounded-lg select-none"
              style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
            >
              {Array.from({ length: 13 }).map((_, row) =>
                Array.from({ length: 13 }).map((_, col) => {
                  const hand = getHandNotation(row, col);
                  const isSelected = viewMode === 'strength'
                    ? true
                    : isHandInRange(hand, currentRange);
                  const tier = getHandTier(hand);
                  const combos = getHandCombos(hand);

                  // Determine cell styling
                  let cellClass = '';
                  if (viewMode === 'strength') {
                    cellClass = getTierColor(tier, true);
                  } else {
                    cellClass = isSelected
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-400';
                  }

                  // Highlight pair diagonal
                  const isPair = row === col;
                  const isSuited = row < col;

                  return (
                    <div
                      key={`${row}-${col}`}
                      onMouseDown={() => handleMouseDown(hand)}
                      onMouseEnter={() => handleMouseEnter(hand)}
                      className={`
                        aspect-square flex flex-col items-center justify-center
                        text-[10px] sm:text-xs font-medium
                        cursor-pointer transition-colors
                        ${cellClass}
                        ${isPair ? 'ring-1 ring-inset ring-white/30' : ''}
                        hover:brightness-110
                      `}
                      title={`${hand} (${combos} combos)${isPair ? ' - Pair' : isSuited ? ' - Suited' : ' - Offsuit'}`}
                    >
                      <span className="font-semibold">{hand}</span>
                      <span className="text-[8px] opacity-70 hidden sm:block">{combos}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Matrix Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-slate-400 rounded ring-1 ring-white/30"></span>
            Pairs (diagonal)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-slate-300 rounded"></span>
            Suited (above diagonal)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-slate-200 rounded"></span>
            Offsuit (below diagonal)
          </span>
        </div>

        {/* Educational Content */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Understanding Ranges</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2">The 13x13 Matrix</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Diagonal:</strong> Pocket pairs (AA, KK...22) - 6 combos each</li>
                <li><strong>Above diagonal:</strong> Suited hands - 4 combos each</li>
                <li><strong>Below diagonal:</strong> Offsuit hands - 12 combos each</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Position Matters</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Early position:</strong> Play tight, premium hands only</li>
                <li><strong>Middle position:</strong> Add some suited connectors</li>
                <li><strong>Late position:</strong> Widen significantly, steal blinds</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">Combo Math</h4>
            <p className="text-sm text-gray-600">
              There are <strong>1,326</strong> total starting hand combinations in Texas Hold'em.
              A range that includes all pairs and suited Aces (AA-22, AKs-A2s) contains
              {' '}<strong>{6*13 + 4*12}</strong> combos ({((6*13 + 4*12)/1326*100).toFixed(1)}% of hands).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
