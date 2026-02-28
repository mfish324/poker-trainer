import { useState } from 'react';
import {
  POSITIONS_6MAX,
  POSITIONS_9MAX,
  POSITION_CATEGORIES,
  POSITION_CONCEPTS,
  POSITION_QUIZZES,
  getPositionColor,
} from '../utils/position';
import type { Position } from '../utils/position';

type Mode = 'learn' | 'table' | 'quiz';
type TableSize = '6max' | '9max';

export default function PositionTrainer() {
  const [mode, setMode] = useState<Mode>('learn');
  const [tableSize, setTableSize] = useState<TableSize>('6max');
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const positions = tableSize === '6max' ? POSITIONS_6MAX : POSITIONS_9MAX;

  const handlePositionClick = (position: Position) => {
    setSelectedPosition(position);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === POSITION_QUIZZES[quizIndex].correctIndex;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    setQuizIndex((prev) => (prev + 1) % POSITION_QUIZZES.length);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Position Trainer</h2>
        <p className="text-gray-600 mb-6">
          Learn table positions and why position is one of the most important concepts in poker.
        </p>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('learn')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'learn'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Learn Positions
          </button>
          <button
            onClick={() => setMode('table')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'quiz'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quiz
          </button>
        </div>

        {/* Table Size Toggle (for table view) */}
        {mode === 'table' && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setTableSize('6max'); setSelectedPosition(null); }}
              className={`px-4 py-2 rounded-lg font-medium ${
                tableSize === '6max'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              6-Max
            </button>
            <button
              onClick={() => { setTableSize('9max'); setSelectedPosition(null); }}
              className={`px-4 py-2 rounded-lg font-medium ${
                tableSize === '9max'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              9-Max (Full Ring)
            </button>
          </div>
        )}

        {/* Learn Mode */}
        {mode === 'learn' && (
          <div className="space-y-8">
            {/* Why Position Matters */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Why Position Matters</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {POSITION_CONCEPTS.slice(0, 4).map((concept, i) => (
                  <div key={i} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">{concept.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{concept.description}</p>
                    <p className="text-xs text-indigo-600 italic">Example: {concept.example}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Position Categories */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Position Categories</h3>
              <div className="space-y-4">
                {POSITION_CATEGORIES.map((cat) => (
                  <div key={cat.id} className={`p-4 rounded-xl ${cat.bgColor}`}>
                    <h4 className={`font-bold text-lg ${cat.color}`}>{cat.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{cat.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.keyPoints.map((point, i) => (
                        <span key={i} className="text-xs bg-white/50 px-2 py-1 rounded">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-semibold text-gray-800 mb-2">Golden Rule of Position</h3>
              <p className="text-gray-600">
                <strong>Earlier position = Tighter range.</strong> The more players left to act after you,
                the stronger your hand needs to be to enter the pot.
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-red-600">UTG: ~12%</span>
                <span className="text-gray-400">→</span>
                <span className="text-yellow-600">HJ: ~18%</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600">CO: ~27%</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-700 font-bold">BTN: ~45%</span>
              </div>
            </div>
          </div>
        )}

        {/* Table View Mode */}
        {mode === 'table' && (
          <div>
            {/* Poker Table Visualization */}
            <div className="relative w-full aspect-[4/3] max-w-lg mx-auto mb-6">
              {/* Table felt */}
              <div className="absolute inset-4 bg-gradient-to-br from-green-700 to-green-800 rounded-[50%] shadow-xl border-8 border-amber-900">
                {/* Table center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/30 text-center">
                    <div className="text-2xl font-bold">{tableSize.toUpperCase()}</div>
                    <div className="text-sm">Click a position</div>
                  </div>
                </div>
              </div>

              {/* Position seats */}
              {positions.map((pos) => {
                const angle = pos.angle || 0;
                const radians = (angle * Math.PI) / 180;
                const radiusX = 42;
                const radiusY = 38;
                const x = 50 + radiusX * Math.cos(radians);
                const y = 50 - radiusY * Math.sin(radians);
                const colors = getPositionColor(pos);
                const isSelected = selectedPosition?.id === pos.id;

                return (
                  <button
                    key={pos.id}
                    onClick={() => handlePositionClick(pos)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2
                      w-14 h-14 rounded-full flex flex-col items-center justify-center
                      font-bold text-sm shadow-lg transition-all
                      ${isSelected ? 'ring-4 ring-blue-400 scale-110' : 'hover:scale-105'}
                      ${colors.bg} ${colors.text}
                    `}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span>{pos.shortName}</span>
                    <span className="text-[10px] opacity-70">{pos.rangeWidth}</span>
                  </button>
                );
              })}
            </div>

            {/* Position Legend */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {POSITION_CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${cat.bgColor} border border-gray-300`}></span>
                  <span className={`text-sm ${cat.color}`}>{cat.name}</span>
                </div>
              ))}
            </div>

            {/* Selected Position Details */}
            {selectedPosition ? (
              <div className={`p-6 rounded-xl ${getPositionColor(selectedPosition).bg}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-2xl font-bold ${getPositionColor(selectedPosition).text}`}>
                    {selectedPosition.shortName}
                  </span>
                  <span className="text-xl text-gray-700">{selectedPosition.name}</span>
                  <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                    getPositionColor(selectedPosition).bg
                  } ${getPositionColor(selectedPosition).text}`}>
                    {selectedPosition.category.charAt(0).toUpperCase() + selectedPosition.category.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{selectedPosition.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-800 mb-1">Strategy</h4>
                    <p className="text-sm text-gray-600">{selectedPosition.strategy}</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-800 mb-1">Opening Range</h4>
                    <p className="text-sm text-gray-600">
                      Approximately <strong>{selectedPosition.rangeWidth}</strong> of hands
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Action order: {selectedPosition.order} of {positions.length}
                  {selectedPosition.order === 1 && ' (first to act preflop)'}
                  {selectedPosition.id === 'btn' && ' (last to act postflop)'}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-500">
                Click a position on the table to see details
              </div>
            )}
          </div>
        )}

        {/* Quiz Mode */}
        {mode === 'quiz' && (
          <div>
            {/* Score */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">
                Score: <span className="font-bold text-green-600">{score.correct}</span> / {score.total}
                <span className="text-gray-400 ml-2">
                  (Question {quizIndex + 1} of {POSITION_QUIZZES.length})
                </span>
              </span>
              <button
                onClick={resetQuiz}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Reset Quiz
              </button>
            </div>

            {/* Question */}
            {(() => {
              const quiz = POSITION_QUIZZES[quizIndex];
              return (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      quiz.category === 'basics' ? 'bg-blue-100 text-blue-700' :
                      quiz.category === 'strategy' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800 mt-3">
                      {quiz.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="grid gap-3">
                    {quiz.options.map((option, i) => {
                      let buttonClass = 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200';

                      if (showResult) {
                        if (i === quiz.correctIndex) {
                          buttonClass = 'bg-green-100 text-green-800 border-green-300';
                        } else if (i === selectedAnswer && i !== quiz.correctIndex) {
                          buttonClass = 'bg-red-100 text-red-800 border-red-300';
                        } else {
                          buttonClass = 'bg-gray-50 text-gray-400 border-gray-200';
                        }
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => !showResult && handleAnswerSelect(i)}
                          disabled={showResult}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-colors ${buttonClass}`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {option}
                          {showResult && i === quiz.correctIndex && (
                            <span className="ml-2 text-green-600">✓</span>
                          )}
                          {showResult && i === selectedAnswer && i !== quiz.correctIndex && (
                            <span className="ml-2 text-red-600">✗</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showResult && (
                    <div className={`p-4 rounded-xl ${
                      selectedAnswer === quiz.correctIndex
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-amber-50 border border-amber-200'
                    }`}>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {selectedAnswer === quiz.correctIndex ? '✓ Correct!' : 'Not quite...'}
                      </h4>
                      <p className="text-gray-600">{quiz.explanation}</p>
                    </div>
                  )}

                  {/* Next Button */}
                  {showResult && (
                    <button
                      onClick={nextQuestion}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                    >
                      {quizIndex < POSITION_QUIZZES.length - 1 ? 'Next Question' : 'Start Over'}
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Footer Education */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Position Quick Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 font-semibold">Position</th>
                  <th className="text-center p-2 font-semibold">Category</th>
                  <th className="text-center p-2 font-semibold">Open Range</th>
                  <th className="text-left p-2 font-semibold">Key Point</th>
                </tr>
              </thead>
              <tbody>
                {POSITIONS_6MAX.map((pos) => {
                  const colors = getPositionColor(pos);
                  return (
                    <tr key={pos.id} className="border-b border-gray-100">
                      <td className="p-2 font-medium">{pos.shortName}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs ${colors.bg} ${colors.text}`}>
                          {pos.category}
                        </span>
                      </td>
                      <td className="p-2 text-center font-mono">{pos.rangeWidth}</td>
                      <td className="p-2 text-gray-600 text-xs">{pos.strategy.split('.')[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
