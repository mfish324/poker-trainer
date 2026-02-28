import { useState, useCallback } from 'react';
import type { Card as CardType, EquityResult } from '../utils/poker';
import {
  calculateEquity,
  cardToString,
  getHandStrength,
} from '../utils/poker';
import CardPicker from './CardPicker';
import Card from './Card';

type VillainMode = 'random' | 'specific';

export default function EquityCalculator() {
  const [heroCards, setHeroCards] = useState<CardType[]>([]);
  const [villainCards, setVillainCards] = useState<CardType[]>([]);
  const [boardCards, setBoardCards] = useState<CardType[]>([]);
  const [villainMode, setVillainMode] = useState<VillainMode>('random');
  const [result, setResult] = useState<EquityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [iterations, setIterations] = useState(10000);

  // All cards currently in use
  const usedCards = [...heroCards, ...villainCards, ...boardCards];

  const handleHeroSelect = (card: CardType) => {
    if (heroCards.length < 2) {
      setHeroCards([...heroCards, card]);
      setResult(null);
    }
  };

  const handleHeroDeselect = (card: CardType) => {
    setHeroCards(heroCards.filter(c => cardToString(c) !== cardToString(card)));
    setResult(null);
  };

  const handleVillainSelect = (card: CardType) => {
    if (villainCards.length < 2) {
      setVillainCards([...villainCards, card]);
      setResult(null);
    }
  };

  const handleVillainDeselect = (card: CardType) => {
    setVillainCards(villainCards.filter(c => cardToString(c) !== cardToString(card)));
    setResult(null);
  };

  const handleBoardSelect = (card: CardType) => {
    if (boardCards.length < 5) {
      setBoardCards([...boardCards, card]);
      setResult(null);
    }
  };

  const handleBoardDeselect = (card: CardType) => {
    setBoardCards(boardCards.filter(c => cardToString(c) !== cardToString(card)));
    setResult(null);
  };

  const canCalculate = heroCards.length === 2 &&
    (villainMode === 'random' || villainCards.length === 2);

  const handleCalculate = useCallback(() => {
    if (!canCalculate) return;

    setIsCalculating(true);
    // Use setTimeout to allow UI to update before heavy calculation
    setTimeout(() => {
      const equityResult = calculateEquity(
        heroCards,
        villainMode === 'specific' ? villainCards : null,
        boardCards,
        iterations
      );
      setResult(equityResult);
      setIsCalculating(false);
    }, 10);
  }, [heroCards, villainCards, boardCards, villainMode, iterations, canCalculate]);

  const handleReset = () => {
    setHeroCards([]);
    setVillainCards([]);
    setBoardCards([]);
    setResult(null);
  };

  const getStreetName = () => {
    if (boardCards.length === 0) return 'Preflop';
    if (boardCards.length === 3) return 'Flop';
    if (boardCards.length === 4) return 'Turn';
    return 'River';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Equity Calculator</h2>
        <p className="text-gray-600 mb-6">
          Select your hole cards and see your winning chances against a random hand or specific cards.
        </p>

        {/* Cards Display Area */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hero Cards */}
            <div className="text-center">
              <h3 className="text-white font-semibold mb-3">Your Hand</h3>
              <div className="flex justify-center gap-2">
                {heroCards.length > 0 ? (
                  heroCards.map((card, i) => (
                    <Card key={i} card={card} size="lg" />
                  ))
                ) : (
                  <>
                    <Card card={null} size="lg" />
                    <Card card={null} size="lg" />
                  </>
                )}
              </div>
              {heroCards.length === 2 && (
                <div className="text-white text-sm mt-2 font-medium">
                  {getHandStrength(heroCards[0], heroCards[1])}
                </div>
              )}
            </div>

            {/* Board Cards */}
            <div className="text-center">
              <h3 className="text-white font-semibold mb-3">
                Board ({getStreetName()})
              </h3>
              <div className="flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Card
                    key={i}
                    card={boardCards[i] || null}
                    size="md"
                  />
                ))}
              </div>
            </div>

            {/* Villain Cards */}
            <div className="text-center">
              <h3 className="text-white font-semibold mb-3">Opponent</h3>
              <div className="flex justify-center gap-2">
                {villainMode === 'specific' ? (
                  villainCards.length > 0 ? (
                    villainCards.map((card, i) => (
                      <Card key={i} card={card} size="lg" />
                    ))
                  ) : (
                    <>
                      <Card card={null} size="lg" />
                      <Card card={null} size="lg" />
                    </>
                  )
                ) : (
                  <div className="flex gap-2">
                    <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
                      <span className="text-blue-300 text-xl">?</span>
                    </div>
                    <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
                      <span className="text-blue-300 text-xl">?</span>
                    </div>
                  </div>
                )}
              </div>
              {villainMode === 'specific' && villainCards.length === 2 && (
                <div className="text-white text-sm mt-2 font-medium">
                  {getHandStrength(villainCards[0], villainCards[1])}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Villain Mode Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opponent Hand Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setVillainMode('random');
                setVillainCards([]);
                setResult(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                villainMode === 'random'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Random Hand
            </button>
            <button
              onClick={() => {
                setVillainMode('specific');
                setResult(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                villainMode === 'specific'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Specific Cards
            </button>
          </div>
        </div>

        {/* Card Pickers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <CardPicker
            selectedCards={heroCards}
            onCardSelect={handleHeroSelect}
            onCardDeselect={handleHeroDeselect}
            maxCards={2}
            disabledCards={usedCards.filter(c => !heroCards.some(h => cardToString(h) === cardToString(c)))}
            title="Your Hole Cards"
          />

          <CardPicker
            selectedCards={boardCards}
            onCardSelect={handleBoardSelect}
            onCardDeselect={handleBoardDeselect}
            maxCards={5}
            disabledCards={usedCards.filter(c => !boardCards.some(b => cardToString(b) === cardToString(c)))}
            title="Board Cards (0-5)"
          />

          {villainMode === 'specific' && (
            <CardPicker
              selectedCards={villainCards}
              onCardSelect={handleVillainSelect}
              onCardDeselect={handleVillainDeselect}
              maxCards={2}
              disabledCards={usedCards.filter(c => !villainCards.some(v => cardToString(v) === cardToString(c)))}
              title="Opponent Cards"
            />
          )}
        </div>

        {/* Simulation Settings */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Simulation Iterations: {iterations.toLocaleString()}
          </label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            More iterations = more accurate results but slower calculation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleCalculate}
            disabled={!canCalculate || isCalculating}
            className="btn-primary flex-1"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Equity'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Equity Bar */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Results</h3>
              <div className="relative h-10 rounded-lg overflow-hidden flex">
                <div
                  className="bg-green-500 flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                  style={{ width: `${result.winPct}%` }}
                >
                  {result.winPct >= 10 && `${result.winPct.toFixed(1)}%`}
                </div>
                <div
                  className="bg-yellow-400 flex items-center justify-center text-gray-800 font-semibold text-sm transition-all duration-500"
                  style={{ width: `${result.tiePct}%` }}
                >
                  {result.tiePct >= 5 && `${result.tiePct.toFixed(1)}%`}
                </div>
                <div
                  className="bg-red-500 flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                  style={{ width: `${result.lossPct}%` }}
                >
                  {result.lossPct >= 10 && `${result.lossPct.toFixed(1)}%`}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-green-600 font-medium">Win: {result.winPct.toFixed(1)}%</span>
                <span className="text-yellow-600 font-medium">Tie: {result.tiePct.toFixed(1)}%</span>
                <span className="text-red-600 font-medium">Lose: {result.lossPct.toFixed(1)}%</span>
              </div>
            </div>

            {/* Equity Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {(result.equity * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Equity</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {result.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">Simulations Run</div>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What This Means</h3>
              <p className="text-gray-700 mb-4">
                Your hand has <strong>{(result.equity * 100).toFixed(1)}% equity</strong> against{' '}
                {villainMode === 'random' ? 'a random hand' : 'this specific opponent hand'}.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">Win:</span>
                  <span>
                    You win outright {result.winPct.toFixed(1)}% of the time ({result.wins.toLocaleString()} hands)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold">Tie:</span>
                  <span>
                    You split the pot {result.tiePct.toFixed(1)}% of the time ({result.ties.toLocaleString()} hands)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">Lose:</span>
                  <span>
                    You lose {result.lossPct.toFixed(1)}% of the time ({result.losses.toLocaleString()} hands)
                  </span>
                </li>
              </ul>

              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Connecting to Pot Odds:</strong> If your pot odds require{' '}
                  {result.equity < 0.5 ? 'less than' : 'more than'} {(result.equity * 100).toFixed(1)}% equity to call profitably,
                  then a call would be {result.equity >= 0.5 ? '+EV (profitable)' : 'dependent on the pot odds'}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Common Equity Reference */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Preflop Equity Matchups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              { matchup: 'Pair vs Lower Pair (AA vs KK)', equity: '~81%' },
              { matchup: 'Pair vs Two Overcards (JJ vs AK)', equity: '~54%' },
              { matchup: 'Pair vs One Overcard (QQ vs AK)', equity: '~57%' },
              { matchup: 'Two Overcards vs Lower Cards (AK vs QJ)', equity: '~63%' },
              { matchup: 'Dominated Hand (AK vs AQ)', equity: '~74%' },
              { matchup: 'Coin Flip (JJ vs AKs)', equity: '~53%' },
            ].map((ref, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-800">{ref.matchup}</div>
                <div className="text-blue-600 font-semibold">{ref.equity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
