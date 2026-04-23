# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite dev server with HMR)
- **Build:** `npm run build` (runs `tsc -b && vite build`, output in `dist/`)
- **Lint:** `npm run lint` (ESLint with TypeScript and React rules)
- **Preview production build:** `npm run preview`

No test framework is configured.

## Tech Stack

- React 19 + TypeScript (strict mode) with Vite 7
- Tailwind CSS v4 via `@tailwindcss/postcss` (imported in `src/index.css` with `@import "tailwindcss"`)
- ESLint with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins

## Architecture

Single-page app with tab-based navigation (no router). `App.tsx` manages the active tab via `useState<Calculator>` and conditionally renders one of 8 tool components.

### Tools (components in `src/components/`)

| Tab | Component | Purpose |
|-----|-----------|---------|
| Learn | `LearnPoker` | Poker glossary and learning resources |
| Pot Odds | `PotOddsCalculator` | Calculate pot odds from bet sizes |
| Equity | `EquityCalculator` | Monte Carlo equity simulation (hero vs villain) |
| Outs | `OutsCounter` | Count outs, draws, and Rule of 2 & 4 |
| EV Trainer | `EVDecisionTrainer` | Practice +EV/−EV call/fold decisions |
| Ranges | `RangeVisualizer` | 13×13 hand matrix with position-based presets |
| Board Texture | `BoardTextureAnalyzer` | Analyze flop wetness/dryness with strategic tips |
| Position | `PositionTrainer` | Learn table positions (6-max/9-max) with quizzes |

### Shared components

- `Card` — renders a playing card (3 sizes: sm/md/lg) with suit colors and selection states
- `CardPicker` / `CompactCardPicker` — full and dropdown card selection widgets used by multiple tools

### Utility modules (`src/utils/`)

- **`poker.ts`** — Core poker logic: card types (`Card`, `Rank`, `Suit`), deck creation, 5/7-card hand evaluation, Monte Carlo equity calculation (`calculateEquity`), draw/outs identification (`identifyDraws`), EV calculation (`calculateEV`), and predefined training scenarios
- **`ranges.ts`** — Hand matrix utilities: notation generation, combo counting, hand tier classification, and position-based opening ranges (UTG through BB)
- **`boardTexture.ts`** — Flop texture analysis: wetness scoring (0-100), suit/connectivity/pairing analysis, and strategic implications
- **`position.ts`** — Position definitions for 6-max and 9-max tables, position categories, educational content, and quiz questions

## Custom Tailwind Theme

Defined in `tailwind.config.js` — custom colors: `poker-green`, `poker-felt`, `card-red`. Custom shadows: `card`, `card-glow`. Global utility classes in `index.css`: `.input-field`, `.btn-primary`, `.step-box`.

## Conventions

- Components use default exports; utility modules use named exports
- Card notation: two-character strings like `"As"` (Ace of spades), `"Th"` (Ten of hearts)
- Hand notation: `"AKs"` (suited), `"AKo"` (offsuit), `"AA"` (pair)
- All poker math is client-side (no backend). Equity uses Monte Carlo simulation with configurable iteration count.

## React 19 lint rules (gotcha)

The repo's ESLint config enforces `react-hooks/purity` and `react-hooks/set-state-in-effect`. Practical implications:

- Do not call `Math.random()` (or other impure calls) during render. Put them in event handlers or initializer callbacks.
- Do not call a `setState` setter synchronously inside a `useEffect` body. If state needs to be seeded when something happens, drive it from the event handler that caused the change, not an effect that reacts to it.

## Deployment

Hosted on Vercel, linked to GitHub repo `mfish324/poker-trainer`. **Every push to `master` auto-deploys to production.** Vercel auto-detects the Vite preset (build: `vite build`, output: `dist/`).

- Manual CLI deploy: `vercel --prod` (CLI is already logged in as `mfish324`)
- Project scope: `matthew-okeefes-projects-bdf1bb50/poker-trainer`
- Inspect dashboard: https://vercel.com/matthew-okeefes-projects-bdf1bb50/poker-trainer

Local `.vercel/` and `.env*.local` files are gitignored (created by the CLI on first link).
