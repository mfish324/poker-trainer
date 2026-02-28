import { useState } from 'react';
import PotOddsCalculator from './components/PotOddsCalculator';
import EquityCalculator from './components/EquityCalculator';
import OutsCounter from './components/OutsCounter';
import EVDecisionTrainer from './components/EVDecisionTrainer';
import RangeVisualizer from './components/RangeVisualizer';
import BoardTextureAnalyzer from './components/BoardTextureAnalyzer';
import PositionTrainer from './components/PositionTrainer';
import LearnPoker from './components/LearnPoker';

type Calculator = 'learn' | 'pot-odds' | 'equity' | 'outs' | 'ev-trainer' | 'ranges' | 'texture' | 'position';

const CALCULATORS: { id: Calculator; name: string; description: string }[] = [
  { id: 'learn', name: 'Learn', description: 'Poker terms glossary and learning resources' },
  { id: 'pot-odds', name: 'Pot Odds', description: 'Calculate pot odds from bet sizes' },
  { id: 'equity', name: 'Equity', description: 'Calculate your winning chances' },
  { id: 'outs', name: 'Outs', description: 'Count outs and learn Rule of 2 & 4' },
  { id: 'ev-trainer', name: 'EV Trainer', description: 'Practice +EV decisions' },
  { id: 'ranges', name: 'Ranges', description: 'Explore starting hand ranges by position' },
  { id: 'texture', name: 'Board Texture', description: 'Analyze flop textures (wet/dry)' },
  { id: 'position', name: 'Position', description: 'Learn table positions and their importance' },
];

function App() {
  const [activeCalculator, setActiveCalculator] = useState<Calculator>('learn');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Poker Odds Trainer
          </h1>
          <p className="text-slate-400">
            Master the math behind winning poker decisions
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center gap-2 mb-8 flex-wrap">
          {CALCULATORS.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={activeCalculator === calc.id
                ? calc.id === 'learn'
                  ? 'px-4 py-3 rounded-lg font-semibold transition-all bg-green-600 text-white shadow-lg text-sm'
                  : 'px-4 py-3 rounded-lg font-semibold transition-all bg-blue-600 text-white shadow-lg text-sm'
                : 'px-4 py-3 rounded-lg font-semibold transition-all bg-slate-700 text-slate-300 hover:bg-slate-600 text-sm'
              }
            >
              {calc.name}
            </button>
          ))}
        </nav>

        {/* Active Calculator */}
        {activeCalculator === 'learn' && <LearnPoker />}
        {activeCalculator === 'pot-odds' && <PotOddsCalculator />}
        {activeCalculator === 'equity' && <EquityCalculator />}
        {activeCalculator === 'outs' && <OutsCounter />}
        {activeCalculator === 'ev-trainer' && <EVDecisionTrainer />}
        {activeCalculator === 'ranges' && <RangeVisualizer />}
        {activeCalculator === 'texture' && <BoardTextureAnalyzer />}
        {activeCalculator === 'position' && <PositionTrainer />}

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>Phase 2: Hand Reading Basics - Complete</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
