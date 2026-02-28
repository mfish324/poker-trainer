import { useState, useMemo } from 'react';
import {
  calculateEV,
  calculateDrawOdds,
  getAllScenariosForDifficulty,
} from '../utils/poker';
import Card from './Card';

type Difficulty = 'easy' | 'medium' | 'hard';
type Decision = 'call' | 'fold';

interface SessionStats {
  correct: number;
  total: number;
  streak: number;
  bestStreak: number;
}

export default function EVDecisionTrainer() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userDecision, setUserDecision] = useState<Decision | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState<SessionStats>({
    correct: 0,
    total: 0,
    streak: 0,
    bestStreak: 0,
  });

  // Get scenarios for current difficulty
  const scenarios = useMemo(() => {
    return getAllScenariosForDifficulty(difficulty);
  }, [difficulty]);

  const currentScenario = scenarios[currentScenarioIndex % scenarios.length];

  // Calculate the math for current scenario
  const { odds, evCalc, correctDecision } = useMemo(() => {
    const oddsCalc = calculateDrawOdds(currentScenario.outs, currentScenario.street);
    const ev = calculateEV(
      currentScenario.potSize,
      currentScenario.betToCall,
      oddsCalc.exact
    );
    const correct: Decision = ev.isPositiveEV ? 'call' : 'fold';

    return { odds: oddsCalc, evCalc: ev, correctDecision: correct };
  }, [currentScenario]);

  const handleDecision = (decision: Decision) => {
    setUserDecision(decision);
    setShowResult(true);

    const isCorrect = decision === correctDecision;

    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0,
      bestStreak: isCorrect ? Math.max(prev.bestStreak, prev.streak + 1) : prev.bestStreak,
    }));
  };

  const handleNextScenario = () => {
    setCurrentScenarioIndex(prev => prev + 1);
    setUserDecision(null);
    setShowResult(false);
  };

  const handleChangeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setCurrentScenarioIndex(0);
    setUserDecision(null);
    setShowResult(false);
  };

  const handleResetStats = () => {
    setStats({ correct: 0, total: 0, streak: 0, bestStreak: 0 });
    setCurrentScenarioIndex(0);
    setUserDecision(null);
    setShowResult(false);
  };

  const isCorrect = userDecision === correctDecision;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">EV Decision Trainer</h2>
        <p className="text-gray-600 mb-6">
          Practice making +EV decisions. Given the pot odds and your outs, should you call or fold?
        </p>

        {/* Difficulty Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => handleChangeDifficulty(d)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize transition-colors ${
                  difficulty === d
                    ? d === 'easy' ? 'bg-green-600 text-white'
                      : d === 'medium' ? 'bg-yellow-500 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
            <div className="text-xs text-gray-500">Correct</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.bestStreak}</div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </div>
        </div>

        {/* Scenario Display */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6 mb-6">
          <div className="text-center mb-4">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
              {currentScenario.street === 'flop' ? 'On the Flop' : 'On the Turn'}
            </span>
            <h3 className="text-white text-xl font-semibold mt-2">{currentScenario.name}</h3>
            <p className="text-white/70 text-sm mt-1">{currentScenario.description}</p>
          </div>

          {/* Cards */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-white/70 text-xs mb-2">Your Hand</p>
              <div className="flex gap-1">
                {currentScenario.holeCards.map((card, i) => (
                  <Card key={i} card={card} size="md" />
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-xs mb-2">Board</p>
              <div className="flex gap-1">
                {currentScenario.board.map((card, i) => (
                  <Card key={i} card={card} size="md" />
                ))}
              </div>
            </div>
          </div>

          {/* Scenario Info */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">${currentScenario.potSize}</div>
              <div className="text-xs text-white/70">Pot Size</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-amber-400">${currentScenario.betToCall}</div>
              <div className="text-xs text-white/70">Bet to Call</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-cyan-400">{currentScenario.outs}</div>
              <div className="text-xs text-white/70">Outs</div>
            </div>
          </div>
        </div>

        {/* Decision Buttons or Result */}
        {!showResult ? (
          <div className="space-y-4">
            <p className="text-center text-lg font-medium text-gray-800">
              What's the correct decision?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleDecision('call')}
                className="py-6 px-8 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl transition-colors shadow-lg"
              >
                CALL
              </button>
              <button
                onClick={() => handleDecision('fold')}
                className="py-6 px-8 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-xl transition-colors shadow-lg"
              >
                FOLD
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Result Header */}
            <div className={`p-6 rounded-xl text-center ${
              isCorrect
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="text-5xl mb-2">{isCorrect ? '✓' : '✗'}</div>
              <p className="text-xl font-semibold">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-gray-600">
                You chose to <strong>{userDecision}</strong>.
                The correct decision was to <strong>{correctDecision}</strong>.
              </p>
            </div>

            {/* Math Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">The Math</h3>

              {/* Step 1: Pot Odds */}
              <div className="step-box">
                <h4 className="font-semibold text-gray-800 mb-2">Step 1: Calculate Pot Odds</h4>
                <div className="bg-white rounded p-3 font-mono text-sm">
                  <div className="text-gray-500">Bet to Call ÷ (Pot + Bet) × 100</div>
                  <div className="text-blue-600 font-semibold">
                    ${currentScenario.betToCall} ÷ ${evCalc.potAfterCall} × 100 = {evCalc.potOdds.toFixed(1)}%
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  You need {evCalc.potOdds.toFixed(1)}% equity to break even on this call.
                </p>
              </div>

              {/* Step 2: Your Equity */}
              <div className="step-box">
                <h4 className="font-semibold text-gray-800 mb-2">Step 2: Calculate Your Equity</h4>
                <div className="bg-white rounded p-3 font-mono text-sm">
                  <div className="text-gray-500">
                    {currentScenario.street === 'flop'
                      ? `${currentScenario.outs} outs × 4 ≈ ${currentScenario.outs * 4}% (Rule of 4)`
                      : `${currentScenario.outs} outs × 2 ≈ ${currentScenario.outs * 2}% (Rule of 2)`
                    }
                  </div>
                  <div className="text-green-600 font-semibold">
                    Exact: {odds.exact.toFixed(1)}%
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  With {currentScenario.outs} outs on the {currentScenario.street}, you have {odds.exact.toFixed(1)}% chance to hit.
                </p>
              </div>

              {/* Step 3: Compare */}
              <div className="step-box">
                <h4 className="font-semibold text-gray-800 mb-2">Step 3: Compare Equity to Pot Odds</h4>
                <div className="bg-white rounded p-3">
                  <div className="flex items-center justify-center gap-4 text-lg">
                    <span className="font-bold text-green-600">{odds.exact.toFixed(1)}%</span>
                    <span className="text-gray-400">
                      {evCalc.isPositiveEV ? '>' : '<'}
                    </span>
                    <span className="font-bold text-blue-600">{evCalc.potOdds.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span>Your Equity</span>
                    <span></span>
                    <span>Pot Odds</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {evCalc.isPositiveEV
                    ? `Your equity (${odds.exact.toFixed(1)}%) is greater than the pot odds (${evCalc.potOdds.toFixed(1)}%), so calling is +EV.`
                    : `Your equity (${odds.exact.toFixed(1)}%) is less than the pot odds (${evCalc.potOdds.toFixed(1)}%), so calling is -EV.`
                  }
                </p>
              </div>

              {/* Step 4: EV Calculation */}
              <div className="step-box">
                <h4 className="font-semibold text-gray-800 mb-2">Step 4: Calculate Expected Value</h4>
                <div className="bg-white rounded p-3 font-mono text-sm">
                  <div className="text-gray-500">
                    EV = (Win% × Pot) - (Lose% × Bet)
                  </div>
                  <div className="text-gray-500">
                    = ({(odds.exact).toFixed(1)}% × ${currentScenario.potSize}) - ({(100 - odds.exact).toFixed(1)}% × ${currentScenario.betToCall})
                  </div>
                  <div className={`font-semibold ${evCalc.ev >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    = {evCalc.ev >= 0 ? '+' : ''}{evCalc.ev.toFixed(2)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {evCalc.ev >= 0
                    ? `On average, you gain $${evCalc.ev.toFixed(2)} every time you make this call.`
                    : `On average, you lose $${Math.abs(evCalc.ev).toFixed(2)} every time you make this call.`
                  }
                </p>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextScenario}
              className="btn-primary w-full"
            >
              Next Scenario
            </button>
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={handleResetStats}
          className="mt-4 w-full py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
        >
          Reset Stats
        </button>

        {/* Quick Reference */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">EV Decision Quick Reference</h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">The Rule</h4>
                <p className="text-gray-600">
                  <strong>Call</strong> if your equity {'>'} pot odds<br />
                  <strong>Fold</strong> if your equity {'<'} pot odds
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Quick Math</h4>
                <p className="text-gray-600">
                  Pot odds = Bet ÷ (Pot + Bet)<br />
                  Equity ≈ Outs × {'{4 on flop, 2 on turn}'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
