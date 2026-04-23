import { useState, useMemo } from 'react';
import type { Card as CardType } from '../utils/poker';
import {
  analyzeBoard,
  getStrategicImplications,
  EXAMPLE_BOARDS,
} from '../utils/boardTexture';
import Card from './Card';
import { CompactCardPicker } from './CardPicker';

type Mode = 'analyze' | 'examples' | 'quiz';

export default function BoardTextureAnalyzer() {
  const [mode, setMode] = useState<Mode>('analyze');
  const [boardCards, setBoardCards] = useState<CardType[]>([]);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);

  // Quiz state
  const [quizBoard, setQuizBoard] = useState<CardType[]>([]);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const handleCardsChange = (cards: CardType[]) => {
    // Append new cards to existing board
    if (cards.length > 0 && boardCards.length < 5) {
      const newCard = cards[cards.length - 1];
      setBoardCards([...boardCards, newCard]);
    }
  };

  const handleCardRemove = (index: number) => {
    setBoardCards(boardCards.filter((_, i) => i !== index));
  };

  const clearBoard = () => {
    setBoardCards([]);
  };

  // Analyze current board
  const analysis = useMemo(() => {
    if (boardCards.length >= 3) {
      return analyzeBoard(boardCards);
    }
    return null;
  }, [boardCards]);

  const implications = useMemo(() => {
    if (analysis) {
      return getStrategicImplications(analysis);
    }
    return [];
  }, [analysis]);

  // Quiz functions
  const randomBoard = (): CardType[] => {
    const suits: CardType['suit'][] = ['s', 'h', 'd', 'c'];
    const ranks: CardType['rank'][] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

    const cards: CardType[] = [];
    const used = new Set<string>();

    while (cards.length < 3) {
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const key = `${rank}${suit}`;
      if (!used.has(key)) {
        used.add(key);
        cards.push({ rank, suit });
      }
    }

    return cards;
  };

  const generateQuizBoard = () => {
    setQuizBoard(randomBoard());
    setQuizAnswer(null);
    setShowQuizResult(false);
  };

  const submitQuizAnswer = (answer: string) => {
    setQuizAnswer(answer);
    setShowQuizResult(true);

    const correctTexture = analyzeBoard(quizBoard);
    const isCorrect = answer === correctTexture.wetness;

    setQuizScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };


  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Board Texture Analyzer</h2>
        <p className="text-gray-600 mb-6">
          Learn to read flop textures. Understanding if a board is "wet" or "dry" helps you make better decisions.
        </p>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('analyze')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'analyze'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Analyze Board
          </button>
          <button
            onClick={() => setMode('examples')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'examples'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Examples
          </button>
          <button
            onClick={() => { setMode('quiz'); generateQuizBoard(); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'quiz'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quiz
          </button>
        </div>

        {/* Analyze Mode */}
        {mode === 'analyze' && (
          <div>
            {/* Board Display */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Board (select 3-5 cards)
                </label>
                {boardCards.length > 0 && (
                  <button
                    onClick={clearBoard}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex gap-2 mb-4 min-h-[80px] items-center">
                {boardCards.length === 0 ? (
                  <p className="text-gray-400 text-sm">Select cards below to build a board</p>
                ) : (
                  boardCards.map((card, i) => (
                    <div key={i} className="relative">
                      <Card card={card} size="lg" />
                      <button
                        onClick={() => handleCardRemove(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
                {boardCards.length > 0 && boardCards.length < 5 && (
                  <div className="w-14 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-2xl">
                    +
                  </div>
                )}
              </div>

              <CompactCardPicker
                selectedCards={[]}
                onCardsChange={handleCardsChange}
                maxCards={5}
                disabledCards={boardCards}
              />
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {analysis.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Wetness Meter */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">Board Wetness</span>
                    <span className={`font-bold text-lg ${
                      analysis.wetness === 'wet' ? 'text-blue-600' :
                      analysis.wetness === 'semi-wet' ? 'text-cyan-600' :
                      analysis.wetness === 'semi-dry' ? 'text-orange-500' :
                      'text-amber-600'
                    }`}>
                      {analysis.wetness.charAt(0).toUpperCase() + analysis.wetness.slice(1)}
                    </span>
                  </div>

                  {/* Meter bar */}
                  <div className="relative h-4 bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-600 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 h-full w-1 bg-black"
                      style={{ left: `${analysis.wetnessScore}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Dry</span>
                    <span>Wet</span>
                  </div>
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <PropertyCard
                    label="Suits"
                    value={analysis.isMonotone ? 'Monotone' : analysis.isTwoTone ? 'Two-tone' : 'Rainbow'}
                    icon={analysis.isMonotone ? '🎨' : analysis.isTwoTone ? '🔵🔴' : '🌈'}
                  />
                  <PropertyCard
                    label="Pairing"
                    value={analysis.isTrips ? 'Trips' : analysis.isPaired ? 'Paired' : 'Unpaired'}
                    icon={analysis.isTrips ? '3️⃣' : analysis.isPaired ? '2️⃣' : '1️⃣'}
                  />
                  <PropertyCard
                    label="Connectivity"
                    value={analysis.connectivity.replace('-', ' ')}
                    icon={analysis.connectivity === 'highly-connected' ? '🔗' : analysis.connectivity === 'connected' ? '⛓️' : '📍'}
                  />
                  <PropertyCard
                    label="High Card"
                    value={analysis.highCard}
                    icon="👑"
                  />
                </div>

                {/* Flush/Straight Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${
                    analysis.isMonotone ? 'bg-red-50 border border-red-200' :
                    analysis.isTwoTone ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <h4 className="font-semibold text-gray-800 mb-1">Flush Potential</h4>
                    <p className="text-sm text-gray-600">
                      {analysis.isMonotone
                        ? 'Made flush possible! Any two cards of this suit = flush.'
                        : analysis.isTwoTone
                        ? 'Flush draw available. 9 outs to hit by river.'
                        : 'No flush draws possible. Safe from flushes.'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    analysis.straightPossible ? 'bg-red-50 border border-red-200' :
                    analysis.straightDrawPossible ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <h4 className="font-semibold text-gray-800 mb-1">Straight Potential</h4>
                    <p className="text-sm text-gray-600">
                      {analysis.straightPossible
                        ? 'Made straights possible on this board.'
                        : analysis.straightDrawPossible
                        ? 'Straight draws available.'
                        : 'Board is disconnected. Few straight draws.'}
                    </p>
                  </div>
                </div>

                {/* Strategic Implications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Strategic Implications</h3>
                  <div className="space-y-3">
                    {implications.map((imp, i) => (
                      <div key={i} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                            {imp.category}
                          </span>
                          <h4 className="font-semibold text-gray-800">{imp.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{imp.description}</p>
                        <p className="text-sm text-indigo-700 font-medium">💡 {imp.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Examples Mode */}
        {mode === 'examples' && (
          <div>
            {/* Example Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {EXAMPLE_BOARDS.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedExampleIndex(i)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedExampleIndex === i
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {example.name}
                </button>
              ))}
            </div>

            {/* Selected Example */}
            {(() => {
              const example = EXAMPLE_BOARDS[selectedExampleIndex];
              const exampleAnalysis = analyzeBoard(example.cards);

              return (
                <div className="space-y-6">
                  {/* Board Display */}
                  <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">{example.name}</h3>
                    <div className="flex gap-2 justify-center mb-4">
                      {example.cards.map((card, i) => (
                        <Card key={i} card={card} size="lg" />
                      ))}
                    </div>
                    <p className="text-white/80 text-center">{example.description}</p>
                  </div>

                  {/* Wetness Badge */}
                  <div className="flex justify-center">
                    <span className={`px-6 py-2 rounded-full font-bold text-lg ${
                      exampleAnalysis.wetness === 'wet' ? 'bg-blue-100 text-blue-700' :
                      exampleAnalysis.wetness === 'semi-wet' ? 'bg-cyan-100 text-cyan-700' :
                      exampleAnalysis.wetness === 'semi-dry' ? 'bg-orange-100 text-orange-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {exampleAnalysis.wetness.toUpperCase()} BOARD
                    </span>
                  </div>

                  {/* Key Points */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Key Points</h4>
                    <ul className="space-y-2">
                      {example.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-gray-600">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {exampleAnalysis.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Quiz Mode */}
        {mode === 'quiz' && quizBoard.length > 0 && (
          <div>
            {/* Score */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">
                Score: <span className="font-bold text-green-600">{quizScore.correct}</span> / {quizScore.total}
              </span>
              <button
                onClick={generateQuizBoard}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                New Board
              </button>
            </div>

            {/* Quiz Board */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6 mb-6">
              <p className="text-white/70 text-center mb-4">Is this board...</p>
              <div className="flex gap-2 justify-center mb-4">
                {quizBoard.map((card, i) => (
                  <Card key={i} card={card} size="lg" />
                ))}
              </div>
            </div>

            {/* Answer Options */}
            {!showQuizResult ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['dry', 'semi-dry', 'semi-wet', 'wet'] as const).map((answer) => (
                  <button
                    key={answer}
                    onClick={() => submitQuizAnswer(answer)}
                    className={`py-4 px-6 rounded-xl font-bold text-lg transition-colors ${
                      answer === 'wet' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                      answer === 'semi-wet' ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' :
                      answer === 'semi-dry' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                      'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {answer.charAt(0).toUpperCase() + answer.slice(1)}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {(() => {
                  const correctAnswer = analyzeBoard(quizBoard);
                  const isCorrect = quizAnswer === correctAnswer.wetness;

                  return (
                    <div className="space-y-4">
                      <div className={`p-6 rounded-xl text-center ${
                        isCorrect
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-red-50 border-2 border-red-200'
                      }`}>
                        <div className="text-4xl mb-2">{isCorrect ? '✓' : '✗'}</div>
                        <p className="text-xl font-semibold">
                          {isCorrect ? 'Correct!' : 'Not quite'}
                        </p>
                        <p className="text-gray-600">
                          This board is <strong>{correctAnswer.wetness}</strong>
                          {!isCorrect && ` (you said ${quizAnswer})`}
                        </p>
                      </div>

                      {/* Explanation */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold mb-2">Why?</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {correctAnswer.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          Wetness score: {correctAnswer.wetnessScore}/100
                          {correctAnswer.isMonotone && ' • Monotone adds significant wetness'}
                          {correctAnswer.isTwoTone && ' • Two-tone adds some wetness'}
                          {correctAnswer.connectivity === 'highly-connected' && ' • High connectivity = wet'}
                          {correctAnswer.connectivity === 'disconnected' && ' • Disconnected = dry'}
                        </p>
                      </div>

                      <button
                        onClick={generateQuizBoard}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                      >
                        Next Board
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Educational Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Understanding Board Texture</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🏜️ Dry Boards</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Rainbow (no flush draws)</li>
                <li>• Disconnected (no straight draws)</li>
                <li>• Often paired</li>
                <li>• Example: K♠ 7♦ 2♣</li>
                <li>• <strong>Strategy:</strong> Smaller bets, more bluffs work</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🌊 Wet Boards</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Monotone or two-tone (flush draws)</li>
                <li>• Connected (straight draws)</li>
                <li>• Usually unpaired</li>
                <li>• Example: J♥ 9♥ 7♠</li>
                <li>• <strong>Strategy:</strong> Larger bets, protect your hands</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-semibold text-gray-800 capitalize">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
