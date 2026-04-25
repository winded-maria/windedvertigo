# feel cards — codebase instructions for claude code

**project:** winded.vertigo · feel cards  
**file:** `index.html` (single-file app — everything lives here)  
**last updated:** april 2026

---

## what this is

feel cards is a trio-based facilitation game for use in the PPCS (PRME Pedagogy Certificate Series) sessions and w.v. workshops. three players share one device per person, read a common scenario, each secretly pick a card, then reveal simultaneously and discuss. three rounds per session, ~12 minutes total.

the game is built as a single self-contained HTML file with inline CSS and JS. no build step. no dependencies except two google fonts loaded from cdn. open in any browser and it runs.

---

## architecture

```
index.html
├── <style>          CSS variables, layout, card styles, animation
├── <div id="app">   Mount point — all UI is injected here by render()
└── <script>
    ├── visual layer    PAL, COMP, PALETTE_ORDER, PALETTE_MAP → buildDeck() → DECK
    ├── content layer   LABELS, SCENARIO_LABELS, PROMPTS, PROMPT_DIFFICULTY,
    │                   REFLECTIONS, SOLVE_PROMPTS
    ├── state           const state = { screen, position, difficulty, round, hand, ... }
    ├── utils           shuffle(), dealHand(), pickPrompt(), holderForRound(), isHolder()
    └── screens         screens.welcome / setup / difficulty / prompt / wait /
                        reveal / reflect / solve / between / end
```

---

## key data structures

### `PAL` — color palettes
Nine named palettes (`dawn`, `dusk`, `fog`, `rose`, `sea`, `meadow`, `ember`, `night`, `sand`). Each has four fields: `bg` (background), `p` (primary), `s` (secondary), `a` (accent). Used to color card art SVGs.

### `COMP` — card compositions (archetypes)
Twelve SVG-drawing functions, one per archetype:
```
horizon · wave · doorway · mountain · spiral · broken_circle ·
threads · pool · fracture · column · branching · echo
```
Each function accepts a palette object and returns SVG markup. These are the visual identities of the cards. **do not rename archetypes** — names are keys across COMP, PALETTE_ORDER, LABELS, SCENARIO_LABELS, and DECK.

### `PALETTE_ORDER`
12-element array. Index matches archetype order in `Object.keys(COMP)`. Each entry is an array of 3 palette names for that archetype's three card variants.

### `DECK`
Built by `buildDeck()` at startup. 36 cards total: 12 archetypes × 3 palette variants each. Each card object:
```js
{ id: number, name: "archetype-palette", label: string, svg: string }
```
Labels in DECK come from `LABELS` (universal labels). At deal time, scenario-specific labels from `SCENARIO_LABELS` override them — see dealHand().

### `LABELS`
Universal fallback labels. 12 archetypes, 3 label variants each (one per palette variant). Used as fallback if no scenario-specific label exists. All lowercase. No em dashes. No Oxford commas.

### `SCENARIO_LABELS` ← new as of april 2026
The primary card content. Object keyed by scenario index (0–49), each value is an object keyed by archetype name, each value is a scenario-specific label string.

```js
SCENARIO_LABELS = {
  0: {
    branching: "i sketch two alternative framings quickly...",
    spiral:    "i keep reworking the same section...",
    wave:      "i'm flooded by the deadline...",
    pool:      "i step away from the model...",
    column:    "i finish the current version...",
    mountain:  "i accept this version...",
  },
  // ... 49 more entries
}
```

**structure per scenario:** exactly 6 archetypes — always 2 CI + 2 EI + 2 Collab:
- CI archetypes: `branching`, `horizon`, `spiral`, `doorway`
- EI archetypes: `wave`, `pool`, `fracture`, `echo`
- Collab archetypes: `threads`, `broken_circle`, `column`, `mountain`

each scenario uses exactly 2 from each group. some archetypes appear in non-primary-group scenarios (e.g. `doorway` in a collab scenario) — that's intentional when the label carries the right intelligence flavor.

### `PROMPTS`
Array of 50 scenario strings (0-indexed). All second person. All lowercase. No em dashes.

Organization:
- indexes 0–14: creative intelligence scenarios
- indexes 15–32: emotional intelligence scenarios  
- indexes 33–49: collaborative intelligence scenarios

### `PROMPT_DIFFICULTY`
Parallel array to PROMPTS (same indexes). Three tiers: `'light'` | `'real'` | `'tender'`.

### `REFLECTIONS`
Array of 3 strings. Used in order across the 3 rounds. Post-reveal reflection questions for the trio.

### `SOLVE_PROMPTS`
Array of 3 strings. Per-round collaborative writing prompts. Round 0: name a move. Round 1: draw on each player's different strengths. Round 2: design a team practice.

---

## card dealing mechanic — critical, do not break

**this mechanic is core to why the game works.**

`dealHand(size = 4)` checks `state.currentPromptIdx`. If a scenario is active and `SCENARIO_LABELS[idx]` exists:

1. reads the 6 archetypes from `SCENARIO_LABELS[idx]`
2. for each archetype, picks a random palette variant from `DECK` (visual variety across plays)
3. overrides `card.label` with the scenario-specific label string
4. shuffles the 6-card pool and returns 4

this means each player gets a different random 4 from the 6-card scenario pool. the divergence is structural — players cannot compare hands before choosing, so they cannot converge on a socially desirable answer.

**never make all players see the same fixed hand.** the divergence is the mechanic.

`pickPrompt()` sets `state.currentPromptIdx` before `dealHand()` is called. the call order in `screens.prompt` is:
```js
pickPrompt();
state.hand = dealHand(4);
```
this ordering must be preserved.

---

## game flow

```
welcome → setup → difficulty → [per round: prompt → wait → reveal → reflect → solve] → between → end
```

- **welcome:** intro screen
- **setup:** player picks position (1, 2, or 3)
- **difficulty:** trio picks light / real / tender — filters which scenarios appear
- **prompt:** scenario shown, player dealt 4 cards, picks one
- **wait:** card hidden, waiting for others to choose
- **reveal:** selected card shown full-screen, player turns phone to show trio
- **reflect:** trio discussion question
- **solve:** collaborative writing prompt, player types their trio's shared response
- **between:** transition between rounds, resets hand/prompt state
- **end:** summary of all three solve responses

---

## state object

```js
{
  screen: string,           // current screen name
  position: 1|2|3|null,    // which player
  difficulty: string|null,  // 'light' | 'real' | 'tender'
  round: 0|1|2,             // current round index
  hand: Card[],             // 4 cards dealt this round
  selectedCardId: number|null,
  usedPrompts: number[],    // scenario indexes already drawn
  currentPromptIdx: number|null,
  solutions: string[],      // typed solve text per round [r0, r1, r2]
}
```

---

## voice and brand rules (w.v.)

all card labels and scenario text must follow these rules without exception:

- **all lowercase** — including sentence starts. no title case anywhere.
- **no em dashes** — use colons to introduce speech/lists, periods for new independent clauses, commas for lighter connections
- **no Oxford commas** — "x, y and z" not "x, y, and z"
- **no "not X but Y" constructions**
- **second person** for scenario prompts ("you're in a meeting...")
- **first person** for card labels ("i feel...", "i name...", "i ask...")
- labels should pair an internal state with a behavior: what the person feels + what they do

---

## what is safe to change

- **add scenarios:** add to `PROMPTS`, add corresponding entry to `PROMPT_DIFFICULTY`, add corresponding entry to `SCENARIO_LABELS` with exactly 6 archetypes (2 CI + 2 EI + 2 Collab)
- **edit card labels:** edit strings in `SCENARIO_LABELS` or `LABELS`. follow voice rules.
- **edit scenario text:** edit strings in `PROMPTS`. keep second person, lowercase, no em dashes.
- **edit reflection/solve prompts:** edit `REFLECTIONS` and `SOLVE_PROMPTS` arrays.
- **CSS/visual:** palettes in `PAL`, SVG compositions in `COMP`, palette assignments in `PALETTE_ORDER`
- **copy on screens:** strings inside `screens.*` template literals

## what must not change

- **archetype key names** in `COMP`, `LABELS`, `SCENARIO_LABELS`, `DECK` must stay in sync. renaming one requires renaming all four.
- **`dealHand()` mechanic** — the random 4-from-6 scenario-specific deal must be preserved
- **call order:** `pickPrompt()` must run before `dealHand()` each round
- **36-card DECK structure** — `buildDeck()` produces the base deck; scenario-specific dealing spreads on top of this at deal time, it does not modify DECK
- **single-file constraint** — do not split into multiple files or add a build step

---

## adding a new scenario — checklist

1. append the scenario string to `PROMPTS` (lowercase, second person, no em dashes)
2. append the difficulty to `PROMPT_DIFFICULTY` (`'light'`, `'real'`, or `'tender'`)
3. add an entry to `SCENARIO_LABELS` at the new index with exactly 6 keys:
   - 2 archetypes from: `branching`, `horizon`, `spiral`, `doorway` (CI)
   - 2 archetypes from: `wave`, `pool`, `fracture`, `echo` (EI)
   - 2 archetypes from: `threads`, `broken_circle`, `column`, `mountain` (Collab)
4. write labels in first person, lowercase, no em dashes, pairing internal state with behavior

---

## file reference

| file | purpose |
|------|---------|
| `index.html` | the entire application |
| `CLAUDE.md` | this file |
| `scenario-response-options-draft.md` | human-readable source of truth for all 50 scenario labels, with intelligence tagging and notes |
