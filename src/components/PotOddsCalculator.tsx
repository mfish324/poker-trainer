import { useState, useMemo } from 'react';

interface CalculationStep {
  title: string;
  formula: string;
  result: string;
  explanation: string;
}

const EXAMPLE_SCENARIOS = [
  {
    name: 'Half-Pot Bet',
    pot: 100,
    bet: 50,
    description: 'Opponent bets half the pot - a common sizing.',
  },
  {
    name: 'Pot-Size Bet',
    pot: 100,
    bet: 100,
    description: 'Opponent bets the full pot - a strong bet.',
  },
  {
    name: 'Small Bet',
    pot: 100,
    bet: 25,
    description: 'Opponent makes a 1/4 pot bet - often a blocker bet.',
  },
  {
    name: 'Overbet',
    pot: 100,
    bet: 150,
    description: 'Opponent overbets the pot - polarized range.',
  },
];

export default function PotOddsCalculator() {
  const [potSize, setPotSize] = useState<string>('');
  const [betToCall, setBetToCall] = useState<string>('');
  const [showCalculation, setShowCalculation] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const pot = parseFloat(potSize) || 0;
  const bet = parseFloat(betToCall) || 0;
  const isValid = pot > 0 && bet > 0;

  const calculations = useMemo(() => {
    if (!isValid) return null;

    const totalPot = pot + bet;
    const potOddsPercent = (bet / totalPot) * 100;
    const potOddsRatio = totalPot / bet;
    const ratioAgainst = (totalPot - bet) / bet;

    const steps: CalculationStep[] = [
      {
        title: 'Step 1: Calculate Total Pot',
        formula: `Current Pot + Bet to Call = Total Pot`,
        result: `$${pot.toFixed(2)} + $${bet.toFixed(2)} = $${totalPot.toFixed(2)}`,
        explanation: 'The total pot is what you could win including the bet you need to call. This is the reward side of your risk/reward calculation.',
      },
      {
        title: 'Step 2: Calculate Pot Odds Percentage',
        formula: `(Bet to Call ÷ Total Pot) × 100 = Pot Odds %`,
        result: `($${bet.toFixed(2)} ÷ $${totalPot.toFixed(2)}) × 100 = ${potOddsPercent.toFixed(1)}%`,
        explanation: `You need to risk $${bet.toFixed(2)} to win a pot of $${totalPot.toFixed(2)}. This means you're investing ${potOddsPercent.toFixed(1)}% of the final pot.`,
      },
      {
        title: 'Step 3: Express as Ratio',
        formula: `Total Pot : Bet to Call`,
        result: `$${totalPot.toFixed(2)} : $${bet.toFixed(2)} = ${potOddsRatio.toFixed(1)} : 1`,
        explanation: `For every $1 you risk, you could win $${potOddsRatio.toFixed(2)}. Another way to express this is "${ratioAgainst.toFixed(1)} to 1 against" - the pot is offering you ${ratioAgainst.toFixed(1)} to 1 on a call.`,
      },
    ];

    return {
      totalPot,
      potOddsPercent,
      potOddsRatio,
      ratioAgainst,
      steps,
    };
  }, [pot, bet, isValid]);

  const handleCalculate = () => {
    if (isValid) {
      setShowCalculation(true);
    }
  };

  const handleReset = () => {
    setPotSize('');
    setBetToCall('');
    setShowCalculation(false);
    setActiveScenario(null);
  };

  const handleScenarioClick = (scenario: typeof EXAMPLE_SCENARIOS[0]) => {
    setPotSize(scenario.pot.toString());
    setBetToCall(scenario.bet.toString());
    setActiveScenario(scenario.name);
    setShowCalculation(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pot Odds Calculator</h2>
        <p className="text-gray-600 mb-6">
          Enter the current pot size and the bet you need to call to see your pot odds.
        </p>

        {/* Example Scenarios */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Try an example:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {EXAMPLE_SCENARIOS.map((scenario) => (
              <button
                key={scenario.name}
                onClick={() => handleScenarioClick(scenario)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  activeScenario === scenario.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-800 text-sm">{scenario.name}</div>
                <div className="text-xs text-gray-500 mt-1">${scenario.pot} pot, ${scenario.bet} bet</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="potSize" className="block text-sm font-medium text-gray-700 mb-2">
              Current Pot Size ($)
            </label>
            <input
              type="number"
              id="potSize"
              value={potSize}
              onChange={(e) => {
                setPotSize(e.target.value);
                setShowCalculation(false);
              }}
              placeholder="e.g., 100"
              min="0"
              step="0.01"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="betToCall" className="block text-sm font-medium text-gray-700 mb-2">
              Bet to Call ($)
            </label>
            <input
              type="number"
              id="betToCall"
              value={betToCall}
              onChange={(e) => {
                setBetToCall(e.target.value);
                setShowCalculation(false);
              }}
              placeholder="e.g., 25"
              min="0"
              step="0.01"
              className="input-field"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleCalculate}
            disabled={!isValid}
            className="btn-primary flex-1"
          >
            Calculate Pot Odds
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Visual Pot Representation */}
        {isValid && showCalculation && calculations && (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Visual Breakdown</h3>
              <div className="relative h-12 bg-gray-200 rounded-lg overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                  style={{ width: `${(pot / calculations.totalPot) * 100}%` }}
                >
                  {pot >= calculations.totalPot * 0.15 && `Pot: $${pot}`}
                </div>
                <div
                  className="absolute right-0 top-0 h-full bg-amber-500 flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                  style={{ width: `${(bet / calculations.totalPot) * 100}%` }}
                >
                  {bet >= calculations.totalPot * 0.15 && `Call: $${bet}`}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Current Pot: ${pot.toFixed(2)}</span>
                <span>Your Call: ${bet.toFixed(2)}</span>
              </div>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {calculations.potOddsPercent.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Pot Odds (Percentage)</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {calculations.ratioAgainst.toFixed(1)} : 1
                </div>
                <div className="text-sm text-gray-600 mt-1">Pot Odds (Ratio)</div>
              </div>
            </div>

            {/* Step-by-Step Explanation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Step-by-Step Math</h3>
              {calculations.steps.map((step, index) => (
                <div key={index} className="step-box">
                  <h4 className="font-semibold text-gray-800 mb-2">{step.title}</h4>
                  <div className="bg-white rounded p-3 mb-2 font-mono text-sm">
                    <div className="text-gray-500">{step.formula}</div>
                    <div className="text-blue-600 font-semibold">{step.result}</div>
                  </div>
                  <p className="text-gray-600 text-sm">{step.explanation}</p>
                </div>
              ))}
            </div>

            {/* Decision Guide */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What This Means for Your Decision</h3>
              <p className="text-gray-700 mb-4">
                Your pot odds are <strong>{calculations.potOddsPercent.toFixed(1)}%</strong>. To make a profitable call:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>
                    <strong>Call</strong> if your equity (chance of winning) is <strong>greater than {calculations.potOddsPercent.toFixed(1)}%</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>
                    <strong>Fold</strong> if your equity is <strong>less than {calculations.potOddsPercent.toFixed(1)}%</strong>
                  </span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Example:</strong> If you have a flush draw (9 outs), you have roughly 36% equity on the flop.
                  Since 36% {'>'} {calculations.potOddsPercent.toFixed(1)}%, calling would be profitable in the long run.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Quick Reference */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Reference: Common Pot Odds</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              { bet: 'Pot-size bet', odds: '2:1', pct: '33%' },
              { bet: '3/4 pot', odds: '2.3:1', pct: '30%' },
              { bet: '1/2 pot', odds: '3:1', pct: '25%' },
              { bet: '1/3 pot', odds: '4:1', pct: '20%' },
            ].map((ref, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="font-medium text-gray-800">{ref.bet}</div>
                <div className="text-gray-500">{ref.odds} ({ref.pct})</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
