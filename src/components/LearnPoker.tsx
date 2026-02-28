export default function LearnPoker() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Learn Poker Math</h2>
        <p className="text-gray-600 mb-6">
          New to poker? Start here to understand the key concepts used in this trainer.
        </p>

        {/* Quick Start */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Recommended Learning Order</h3>
          <ol className="list-decimal list-inside text-gray-600 space-y-1">
            <li><strong>Basic Rules</strong> - Learn Texas Hold'em rules first</li>
            <li><strong>Hand Rankings</strong> - Know which hands beat which</li>
            <li><strong>Pot Odds</strong> - The foundation of poker math</li>
            <li><strong>Outs & Equity</strong> - Calculate your chances</li>
            <li><strong>Ranges</strong> - Think in terms of hand ranges</li>
            <li><strong>Expected Value</strong> - Make profitable decisions</li>
          </ol>
        </div>

        {/* Glossary */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Key Terms Glossary</h3>

          <div className="space-y-4">
            <GlossaryItem
              term="Pot Odds"
              definition="The ratio between the current pot size and the cost of a call. If the pot is $100 and you need to call $20, your pot odds are 5:1 (or 20%). This tells you the minimum win rate you need to break even."
              example="Pot is $100, bet is $50. Pot odds = $50 / ($100 + $50) = 33%. You need to win at least 33% to break even."
            />

            <GlossaryItem
              term="Outs"
              definition="Cards remaining in the deck that will improve your hand to (likely) the best hand. Knowing your outs lets you calculate your equity."
              example="You have 4 hearts. There are 9 hearts left in the deck. You have 9 outs to make a flush."
            />

            <GlossaryItem
              term="Equity"
              definition="Your percentage chance of winning the hand at showdown. If you have 30% equity, you'll win the pot roughly 30% of the time."
              example="Pocket Aces vs a random hand has about 85% equity preflop."
            />

            <GlossaryItem
              term="Expected Value (EV)"
              definition="The average amount you'll win or lose over many repetitions of the same decision. Positive EV (+EV) plays make money long-term."
              example="If you bet $10 with 60% chance to win $20, your EV = (0.6 × $20) - (0.4 × $10) = $12 - $4 = +$8"
            />

            <GlossaryItem
              term="Range"
              definition="The complete set of hands a player might have in a given situation. Instead of putting someone on one hand, you consider all possible hands they could hold."
              example="An 'Under the Gun' open range might be: AA-77, AKs-ATs, AKo-AQo (~11% of hands)"
            />

            <GlossaryItem
              term="Position"
              definition="Where you sit relative to the dealer button. Later positions act last post-flop, giving you more information. The Button (BTN) is the best position."
              example="UTG (Under the Gun) = first to act, worst position. BTN (Button) = last to act, best position."
            />

            <GlossaryItem
              term="The Rule of 2 and 4"
              definition="A quick shortcut to estimate your equity. Multiply your outs by 4 on the flop (two cards to come) or by 2 on the turn (one card to come)."
              example="9 outs on the flop ≈ 9 × 4 = 36% equity. 9 outs on the turn ≈ 9 × 2 = 18% equity."
            />

            <GlossaryItem
              term="Drawing Hand"
              definition="A hand that isn't currently the best but could improve to a strong hand. Common draws include flush draws and straight draws."
              example="Holding 7♥8♥ on a board of 5♥6♦K♥ - you have a flush draw and a straight draw."
            />

            <GlossaryItem
              term="Combos"
              definition="The number of ways a specific hand can be dealt. This helps calculate how likely someone has a particular hand."
              example="Pocket pairs: 6 combos. Suited hands: 4 combos. Offsuit hands: 12 combos."
            />
          </div>
        </div>

        {/* Video Resources */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Video Tutorials</h3>
          <p className="text-gray-600 mb-4">These free YouTube videos explain poker concepts in depth:</p>

          <div className="grid md:grid-cols-2 gap-4">
            <VideoResource
              title="Texas Hold'em Rules"
              channel="PokerStars"
              description="Complete beginner's guide to how the game is played"
              url="https://www.youtube.com/results?search_query=texas+holdem+rules+for+beginners"
              duration="10-15 min"
            />

            <VideoResource
              title="Poker Hand Rankings"
              channel="Various"
              description="Learn which hands beat which (Royal Flush to High Card)"
              url="https://www.youtube.com/results?search_query=poker+hand+rankings+explained"
              duration="5-10 min"
            />

            <VideoResource
              title="Pot Odds Explained"
              channel="Poker Strategy"
              description="Understanding the math behind calling decisions"
              url="https://www.youtube.com/results?search_query=pot+odds+poker+explained+beginner"
              duration="10-20 min"
            />

            <VideoResource
              title="Counting Outs"
              channel="Poker Math"
              description="How to count your outs and use the Rule of 2 and 4"
              url="https://www.youtube.com/results?search_query=counting+outs+poker+rule+of+4+and+2"
              duration="10-15 min"
            />

            <VideoResource
              title="Poker Equity"
              channel="Strategy"
              description="Understanding your winning chances in different spots"
              url="https://www.youtube.com/results?search_query=poker+equity+explained+beginner"
              duration="15-20 min"
            />

            <VideoResource
              title="Expected Value (EV)"
              channel="Advanced"
              description="Making decisions that profit long-term"
              url="https://www.youtube.com/results?search_query=expected+value+poker+explained"
              duration="15-25 min"
            />

            <VideoResource
              title="Position in Poker"
              channel="Strategy"
              description="Why position matters and how to use it"
              url="https://www.youtube.com/results?search_query=position+in+poker+explained+beginner"
              duration="10-15 min"
            />

            <VideoResource
              title="Hand Ranges"
              channel="Advanced"
              description="Thinking about hands as ranges, not single holdings"
              url="https://www.youtube.com/results?search_query=poker+ranges+explained+beginner"
              duration="20-30 min"
            />
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Resources</h3>

          <div className="space-y-3">
            <ResourceLink
              title="Upswing Poker - Free Articles"
              description="High-quality strategy articles for all skill levels"
              url="https://upswingpoker.com/blog/"
            />
            <ResourceLink
              title="PokerStars School"
              description="Free courses from beginner to advanced"
              url="https://www.pokerstarsschool.com/"
            />
            <ResourceLink
              title="Red Chip Poker - The Core"
              description="Free fundamentals course"
              url="https://redchippoker.com/"
            />
            <ResourceLink
              title="r/poker Wiki"
              description="Community-curated learning resources"
              url="https://www.reddit.com/r/poker/wiki/index"
            />
          </div>
        </div>

        {/* Common Outs Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Common Draws & Outs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold">Draw Type</th>
                  <th className="text-center p-3 font-semibold">Outs</th>
                  <th className="text-center p-3 font-semibold">Flop → River</th>
                  <th className="text-center p-3 font-semibold">Turn → River</th>
                </tr>
              </thead>
              <tbody>
                <OutsRow draw="Gutshot Straight" outs={4} flopEquity="17%" turnEquity="9%" />
                <OutsRow draw="Two Overcards" outs={6} flopEquity="24%" turnEquity="13%" />
                <OutsRow draw="Open-Ended Straight" outs={8} flopEquity="32%" turnEquity="17%" />
                <OutsRow draw="Flush Draw" outs={9} flopEquity="35%" turnEquity="20%" />
                <OutsRow draw="Flush + Gutshot" outs={12} flopEquity="45%" turnEquity="26%" />
                <OutsRow draw="Flush + Open-Ended" outs={15} flopEquity="54%" turnEquity="33%" />
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Decision Framework</h3>
          <div className="text-gray-600 space-y-2">
            <p><strong>1. Count your outs</strong> (cards that improve your hand)</p>
            <p><strong>2. Estimate your equity</strong> (outs × 4 on flop, × 2 on turn)</p>
            <p><strong>3. Calculate pot odds</strong> (bet ÷ (pot + bet) × 100)</p>
            <p><strong>4. Compare:</strong> If equity {'>'} pot odds → Call. If equity {'<'} pot odds → Fold.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlossaryItem({ term, definition, example }: { term: string; definition: string; example: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
      <h4 className="font-bold text-gray-800 text-lg">{term}</h4>
      <p className="text-gray-600 mt-1">{definition}</p>
      <p className="text-sm text-gray-500 mt-2 italic">Example: {example}</p>
    </div>
  );
}

function VideoResource({ title, channel, description, url, duration }: {
  title: string;
  channel: string;
  description: string;
  url: string;
  duration: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-xs text-gray-400 mt-1">{channel} • {duration}</p>
        </div>
      </div>
    </a>
  );
}

function ResourceLink({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>
      <div>
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </a>
  );
}

function OutsRow({ draw, outs, flopEquity, turnEquity }: {
  draw: string;
  outs: number;
  flopEquity: string;
  turnEquity: string;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="p-3 font-medium">{draw}</td>
      <td className="p-3 text-center font-bold text-blue-600">{outs}</td>
      <td className="p-3 text-center text-green-600">{flopEquity}</td>
      <td className="p-3 text-center text-amber-600">{turnEquity}</td>
    </tr>
  );
}
