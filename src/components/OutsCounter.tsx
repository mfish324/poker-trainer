import { useState, useMemo } from 'react';
import type { Card as CardType } from '../utils/poker';
import {
  identifyDraws,
  getTotalOuts,
  calculateDrawOdds,
  cardToString,
  COMMON_DRAW_SCENARIOS,
} from '../utils/poker';
import CardPicker from './CardPicker';
import Card from './Card';

type Mode = 'explore' | 'quiz';
type Street = 'flop' | 'turn';

export default function OutsCounter() {
  const [mode, setMode] = useState<Mode>('explore');
  const [holeCards, setHoleCards] = useState<CardType[]>([]);
  const [boardCards, setBoardCards] = useState<CardType[]>([]);
  const [selectedStreet, setSelectedStreet] = useState<Street>('flop');

  // Quiz state
  const [quizScenarioIndex, setQuizScenarioIndex] = useState(0);
  const [userGuess, setUserGuess] = useState<string>('');
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const usedCards = [...holeCards, ...boardCards];

  // Calculate draws and outs
  const { draws, totalOuts, odds } = useMemo(() => {
    if (holeCards.length < 2 || boardCards.length < 3) {
      return { draws: [], totalOuts: { outs: [], count: 0 }, odds: null };
    }

    const foundDraws = identifyDraws(holeCards, boardCards);
    const total = getTotalOuts(foundDraws);
    const calculatedOdds = calculateDrawOdds(total.count, selectedStreet);

    return { draws: foundDraws, totalOuts: total, odds: calculatedOdds };
  }, [holeCards, boardCards, selectedStreet]);

  const handleHoleCardSelect = (card: CardType) => {
    if (holeCards.length < 2) {
      setHoleCards([...holeCards, card]);
    }
  };

  const handleHoleCardDeselect = (card: CardType) => {
    setHoleCards(holeCards.filter(c => cardToString(c) !== cardToString(card)));
  };

  const handleBoardCardSelect = (card: CardType) => {
    if (boardCards.length < 5) {
      setBoardCards([...boardCards, card]);
    }
  };

  const handleBoardCardDeselect = (card: CardType) => {
    setBoardCards(boardCards.filter(c => cardToString(c) !== cardToString(card)));
  };

  const loadScenario = (index: number) => {
    const scenario = COMMON_DRAW_SCENARIOS[index];
    setHoleCards([...scenario.holeCards]);
    setBoardCards([...scenario.board]);
    setSelectedStreet('flop');
  };

  const handleReset = () => {
    setHoleCards([]);
    setBoardCards([]);
  };

  // Quiz functions
  const currentQuizScenario = COMMON_DRAW_SCENARIOS[quizScenarioIndex];

  const handleQuizSubmit = () => {
    const guess = parseInt(userGuess);
    const correct = Math.abs(guess - currentQuizScenario.expectedOuts) <= 1; // Allow ±1 margin

    setQuizScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowQuizAnswer(true);
  };

  const handleNextQuiz = () => {
    setQuizScenarioIndex((prev) => (prev + 1) % COMMON_DRAW_SCENARIOS.length);
    setUserGuess('');
    setShowQuizAnswer(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Outs Counter & Probability Trainer</h2>
        <p className="text-gray-600 mb-6">
          Learn to count your outs and calculate drawing odds using the Rule of 2 and 4.
        </p>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('explore')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'explore'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Explore Mode
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'quiz'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quiz Mode
          </button>
        </div>

        {mode === 'explore' ? (
          <>
            {/* Scenario Buttons */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Load a common scenario:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_DRAW_SCENARIOS.map((scenario, i) => (
                  <button
                    key={i}
                    onClick={() => loadScenario(i)}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards Display */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hole Cards */}
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-3">Your Hand</h3>
                  <div className="flex justify-center gap-2">
                    {holeCards.length > 0 ? (
                      holeCards.map((card, i) => (
                        <Card key={i} card={card} size="lg" />
                      ))
                    ) : (
                      <>
                        <Card card={null} size="lg" />
                        <Card card={null} size="lg" />
                      </>
                    )}
                  </div>
                </div>

                {/* Board */}
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-3">
                    Board ({boardCards.length === 3 ? 'Flop' : boardCards.length === 4 ? 'Turn' : boardCards.length === 5 ? 'River' : 'Select cards'})
                  </h3>
                  <div className="flex justify-center gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Card key={i} card={boardCards[i] || null} size="md" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Outs Display */}
              {totalOuts.count > 0 && (
                <div className="mt-6">
                  <h3 className="text-white font-semibold mb-3 text-center">
                    Your Outs ({totalOuts.count} cards)
                  </h3>
                  <div className="flex justify-center flex-wrap gap-1">
                    {totalOuts.outs.map((out, i) => (
                      <Card key={i} card={out} size="sm" highlighted />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <CardPicker
                selectedCards={holeCards}
                onCardSelect={handleHoleCardSelect}
                onCardDeselect={handleHoleCardDeselect}
                maxCards={2}
                disabledCards={usedCards.filter(c => !holeCards.some(h => cardToString(h) === cardToString(c)))}
                title="Your Hole Cards"
              />
              <CardPicker
                selectedCards={boardCards}
                onCardSelect={handleBoardCardSelect}
                onCardDeselect={handleBoardCardDeselect}
                maxCards={5}
                disabledCards={usedCards.filter(c => !boardCards.some(b => cardToString(b) === cardToString(c)))}
                title="Board Cards (3-5)"
              />
            </div>

            {/* Street Toggle */}
            {holeCards.length === 2 && boardCards.length >= 3 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calculate odds for:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedStreet('flop')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedStreet === 'flop'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Flop (2 cards to come)
                  </button>
                  <button
                    onClick={() => setSelectedStreet('turn')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedStreet === 'turn'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Turn (1 card to come)
                  </button>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mb-6"
            >
              Reset Cards
            </button>

            {/* Results */}
            {draws.length > 0 && odds && (
              <div className="space-y-6">
                {/* Draws Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Draws</h3>
                  <div className="space-y-3">
                    {draws.map((draw, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">{draw.type}</span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {draw.count} outs
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{draw.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Odds Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {totalOuts.count}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Outs</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {odds.exact.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Chance to Hit</div>
                  </div>
                </div>

                {/* Rule of 2 and 4 Explanation */}
                <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Rule of 2 and 4</h3>

                  <div className="space-y-4">
                    <div className="step-box">
                      <h4 className="font-semibold text-gray-800 mb-2">The Quick Calculation</h4>
                      <div className="bg-white rounded p-3 font-mono text-sm">
                        {selectedStreet === 'flop' ? (
                          <>
                            <div className="text-gray-500">Outs × 4 = Approximate % (flop to river)</div>
                            <div className="text-blue-600 font-semibold">
                              {totalOuts.count} × 4 = {odds.ruleOf2And4}%
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-gray-500">Outs × 2 = Approximate % (turn to river)</div>
                            <div className="text-blue-600 font-semibold">
                              {totalOuts.count} × 2 = {odds.ruleOf2And4}%
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="step-box">
                      <h4 className="font-semibold text-gray-800 mb-2">The Exact Math</h4>
                      <div className="bg-white rounded p-3 font-mono text-sm">
                        {selectedStreet === 'flop' ? (
                          <>
                            <div className="text-gray-500">
                              P(hit) = 1 - P(miss turn) × P(miss river)
                            </div>
                            <div className="text-gray-500">
                              = 1 - ({odds.cardsRemaining - totalOuts.count}/{odds.cardsRemaining}) × ({odds.cardsRemaining - 1 - totalOuts.count}/{odds.cardsRemaining - 1})
                            </div>
                            <div className="text-green-600 font-semibold">
                              = {odds.exact.toFixed(2)}%
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-gray-500">
                              P(hit) = Outs / Cards Remaining
                            </div>
                            <div className="text-gray-500">
                              = {totalOuts.count} / {odds.cardsRemaining}
                            </div>
                            <div className="text-green-600 font-semibold">
                              = {odds.exact.toFixed(2)}%
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Accuracy:</strong> The Rule of {selectedStreet === 'flop' ? '4' : '2'} gives{' '}
                        <strong>{odds.ruleOf2And4}%</strong> while the exact probability is{' '}
                        <strong>{odds.exact.toFixed(1)}%</strong>.
                        {Math.abs(odds.ruleOf2And4 - odds.exact) < 2
                          ? ' This is very accurate!'
                          : ` The difference of ${Math.abs(odds.ruleOf2And4 - odds.exact).toFixed(1)}% is acceptable for quick decisions.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {holeCards.length === 2 && boardCards.length >= 3 && draws.length === 0 && (
              <div className="p-6 bg-gray-50 rounded-xl text-center">
                <p className="text-gray-600">
                  No drawing opportunities detected. You may already have a made hand or be drawing dead.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Quiz Mode */
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6">
              <div className="text-center mb-4">
                <span className="text-white/70 text-sm">Question {quizScore.total + 1}</span>
                <h3 className="text-white text-xl font-semibold mt-1">{currentQuizScenario.name}</h3>
              </div>

              <div className="flex justify-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-white/70 text-xs mb-2">Your Hand</p>
                  <div className="flex gap-1">
                    {currentQuizScenario.holeCards.map((card, i) => (
                      <Card key={i} card={card} size="md" />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white/70 text-xs mb-2">Board</p>
                  <div className="flex gap-1">
                    {currentQuizScenario.board.map((card, i) => (
                      <Card key={i} card={card} size="md" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-white/80 text-center text-sm">
                {currentQuizScenario.description}
              </p>
            </div>

            {!showQuizAnswer ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2 text-center">
                    How many outs do you have?
                  </label>
                  <input
                    type="number"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Enter number of outs"
                    min="0"
                    max="52"
                    className="input-field text-center text-2xl"
                    onKeyDown={(e) => e.key === 'Enter' && userGuess && handleQuizSubmit()}
                  />
                </div>
                <button
                  onClick={handleQuizSubmit}
                  disabled={!userGuess}
                  className="btn-primary w-full"
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-6 rounded-xl text-center ${
                  Math.abs(parseInt(userGuess) - currentQuizScenario.expectedOuts) <= 1
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <div className="text-4xl mb-2">
                    {Math.abs(parseInt(userGuess) - currentQuizScenario.expectedOuts) <= 1 ? '✓' : '✗'}
                  </div>
                  <p className="text-lg font-semibold">
                    {Math.abs(parseInt(userGuess) - currentQuizScenario.expectedOuts) <= 1
                      ? 'Correct!'
                      : `Not quite. You guessed ${userGuess}.`}
                  </p>
                  <p className="text-gray-600">
                    The answer is <strong>{currentQuizScenario.expectedOuts} outs</strong>
                  </p>
                </div>

                {/* Show the probability */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-center text-gray-700">
                    With {currentQuizScenario.expectedOuts} outs on the flop:
                  </p>
                  <div className="flex justify-center gap-8 mt-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentQuizScenario.expectedOuts * 4}%
                      </div>
                      <div className="text-xs text-gray-500">Rule of 4</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {calculateDrawOdds(currentQuizScenario.expectedOuts, 'flop').exact.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Exact Odds</div>
                    </div>
                  </div>
                </div>

                <button onClick={handleNextQuiz} className="btn-primary w-full">
                  Next Question
                </button>
              </div>
            )}

            {/* Score */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <span className="text-gray-600">Score: </span>
              <span className="font-bold text-gray-800">
                {quizScore.correct} / {quizScore.total}
                {quizScore.total > 0 && (
                  <span className="text-gray-500 ml-2">
                    ({Math.round((quizScore.correct / quizScore.total) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Reference Table */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Outs Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              { draw: 'Flush Draw', outs: 9, pct: '35%' },
              { draw: 'Open-Ended Straight', outs: 8, pct: '31%' },
              { draw: 'Gutshot Straight', outs: 4, pct: '17%' },
              { draw: 'Two Overcards', outs: 6, pct: '24%' },
              { draw: 'Set (pocket pair)', outs: 2, pct: '8%' },
              { draw: 'Flush + Straight', outs: 15, pct: '54%' },
            ].map((ref, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-800">{ref.draw}</div>
                <div className="text-blue-600 font-semibold">{ref.outs} outs ≈ {ref.pct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
