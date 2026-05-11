# PROJECT: Plushie Factory
A premium, cartoon-styled incremental clicker game inspired by Cookie Clicker, where players tap to produce plushies across themes like animals, mythical creatures, pop culture, and comics. Built as a polished web game with a hybrid 2D/3D presentation and AAA-quality UI/UX.

---

## 🎯 CORE VISION
- **Genre:** Incremental / Idle Clicker
- **Tone:** Cozy, cartoonish, modern, slightly whimsical (think Animal Crossing meets Cookie Clicker meets a high-end mobile game)
- **Platform:** Web (desktop-first, responsive for tablet/mobile)
- **Feel:** Premium, juicy, satisfying — every click should feel rewarding with visual + audio feedback

---

## 🛠️ TECH STACK (use these exact libraries)
- **Framework:** React 18 + Vite (TypeScript)
- **3D:** Three.js + @react-three/fiber + @react-three/drei (for the centerpiece 3D plushie)
- **2D/UI Animations:** Framer Motion + GSAP (for juicy click feedback, number popups, transitions)
- **Styling:** Tailwind CSS + custom CSS variables for theming
- **Icons:** lucide-react
- **Audio:** Tone.js (for procedural oscillator-based SFX) + Howler.js (for sample playback if needed)
- **State Management:** Zustand (lightweight, perfect for incremental game state)
- **Persistence:** IndexedDB via `idb-keyval` (more reliable than localStorage for save data)
- **Charts (for stats screen):** Recharts
- **Particles:** tsParticles (for confetti, sparkles, plushie stuffing puffs)
- **Number Formatting:** `numeral.js` or custom formatter for big numbers (1.23K, 4.56M, 7.89B, aa, ab, ac…)

---

## 🎮 CORE GAMEPLAY LOOP

### Primary Mechanic
- A large **3D plushie** sits center-stage. Clicking it produces 1 plushie (+ multipliers).
- The 3D plushie should:
  - Squish/bounce on click (scale animation)
  - Rotate slowly on idle
  - Be swappable as the player unlocks new "featured plushies"
- Floating "+1" / "+1.2K" numbers fly off the plushie on click (2D overlay on the 3D canvas)

### Currency
- **Plushies** (main currency)
- **Stuffing** (prestige currency, earned on "Factory Reset")
- **Threads** (rare currency from achievements/events)

### Buildings / Generators (Cookie Clicker style)
Each generates plushies/sec passively. Scale cost: `baseCost * 1.15^owned`
1. **Hand Stitcher** — manual worker
2. **Sewing Machine**
3. **Plushie Press**
4. **Stuffing Cannon**
5. **Toy Workshop**
6. **Plushie Factory**
7. **Mythical Forge** (unlocks mythical plushie skins)
8. **Comic Printing Press**
9. **Pop Culture Studio**
10. **Quantum Plushie Lab**
11. **Interdimensional Toy Portal**
12. **Cosmic Plushie Engine**

### Upgrades
- Per-building upgrades (2x, 4x, 8x output)
- Global click multipliers
- Cosmetic upgrades (unlock new featured 3D plushie models)
- "Golden Plushie" random spawns (click for huge bonus — Cookie Clicker style golden cookie)

### Plushie Collection (the soul of the game)
Categories to unlock as the player progresses:
- 🐻 **Animals:** Bear, Bunny, Cat, Dog, Fox, Panda, Penguin, Axolotl
- 🐉 **Mythical:** Dragon, Unicorn, Phoenix, Griffin, Kraken, Yeti
- 🎬 **Pop Culture (generic, avoid trademarks):** Astronaut, Ninja, Knight, Wizard, Robot, Alien
- 📚 **Comic Style:** Superhero plushie, Villain plushie, Sidekick plushie
- 🌟 **Special/Event:** Holiday plushies, seasonal exclusives

Each plushie has rarity tiers: Common → Uncommon → Rare → Epic → Legendary → Mythic

### Prestige System ("Factory Reset")
- Reset progress to gain **Stuffing** (permanent multiplier)
- Stuffing unlocks meta-upgrades: passive bonuses, new plushie skins, faster starts

### Achievements
- 100+ achievements (click counts, plushie milestones, collection completion)
- Each gives a small permanent boost + cosmetic badge

---

## 🎨 VISUAL DESIGN

### Style Guide
- **Palette:** Soft pastels with high-contrast accents
  - Background: warm cream `#FFF8F0` / soft lavender `#F0E8FF`
  - Primary: bubblegum pink `#FF6BAA`
  - Secondary: mint `#7DE2C8`, sky blue `#7EC8FF`, butter yellow `#FFD66B`
  - Accents: deep purple `#5B3E96` for text, gold `#FFC93C` for premium elements
- **Typography:** 
  - Headers: "Fredoka" or "Baloo 2" (rounded, friendly)
  - Body: "Nunito" (clean, readable)
  - Numbers: "Russo One" or "Bungee" (chunky, video-game feel)
- **Shapes:** Rounded corners everywhere (border-radius 16-24px), soft drop shadows, no hard edges
- **Effects:** Subtle gradients, soft glows on interactive elements, gentle ambient particles

### Layout (Cookie Clicker inspired, modernized)
```
┌─────────────────────────────────────────────────────────────┐
│  TOP BAR: Logo | Plushies count | Stuffing | Settings ⚙   │
├──────────────┬──────────────────────────┬───────────────────┤
│              │                          │                   │
│  LEFT PANEL  │     CENTER STAGE         │   RIGHT PANEL     │
│              │                          │                   │
│  • Stats     │   [ 3D PLUSHIE HERE ]    │  Buildings list   │
│  • Per sec   │                          │  (scrollable)     │
│  • Bonuses   │   Click counter          │                   │
│  • Achieve-  │   Floating +numbers      │  Each row:        │
│    ments     │                          │  Icon | Name |    │
│  • Collection│   Golden plushie pops    │  Cost | Owned     │
│              │                          │                   │
├──────────────┴──────────────────────────┴───────────────────┤
│  BOTTOM BAR: News ticker | Tips | Active boosts             │
└─────────────────────────────────────────────────────────────┘
```

### 3D Center Stage
- Three.js scene with the plushie as a low-poly cute model (use procedural geometry — spheres + boxes with soft materials, since we can't load external assets easily)
- Soft three-point lighting
- Subtle floor shadow
- Particle puffs of "stuffing" on click
- Camera gently orbits

---

## 🎵 AUDIO DESIGN

### Use Tone.js for ALL SFX (procedural, no external samples needed)
Build a `SoundManager` class with these methods:
- `playClick()` — A pleasant "boop" using a sine oscillator with fast envelope (attack 0.001s, decay 0.1s), pitch C5, slight pitch variation (±2 semitones) per click to avoid fatigue
- `playPurchase()` — A satisfying "ka-ching" — two-note arpeggio (C5 → G5) with triangle wave + reverb
- `playAchievement()` — A four-note fanfare (C5 → E5 → G5 → C6) with FM synth
- `playGoldenPlushie()` — Sparkly shimmer using high-pitched sine + chorus effect
- `playPrestige()` — Deep, powerful swell using sawtooth + filter sweep
- `playHover()` — Very subtle, low-volume click (square wave, super short)

### Ambient Music
- Generate a chill, loopable melody using Tone.js Transport + a simple chord progression (Cmaj7 → Fmaj7 → Am7 → G7) with marimba/kalimba PolySynth voices
- Volume slider in settings, default to 30%

### Audio Settings
- Master volume, SFX volume, music volume sliders
- Mute toggle in top bar

---

## 🖥️ UI SCREENS

1. **Main Menu**
   - Animated logo (plushies bouncing in)
   - "Play" / "Continue" button
   - "Settings" / "Credits" / "Collection" buttons
   - Background: parallax floating plushies
   
2. **Main Game** (layout above)

3. **Settings Modal**
   - Audio sliders
   - Graphics quality (Low/Med/High — toggles 3D detail)
   - Number format (Scientific / Suffix / Engineering)
   - Auto-save frequency
   - Reset progress (with confirmation)
   
4. **Save Manager**
   - 3 save slots
   - Export save to clipboard (base64 encoded)
   - Import save from clipboard
   - Cloud save placeholder (for future)

5. **Collection / Plushie-dex**
   - Grid of all plushies with rarity glow
   - Locked ones are silhouettes
   - Click for 3D preview + lore

6. **Stats Screen**
   - Total clicks, total plushies, time played
   - Recharts line graph of plushies/sec over time
   
7. **Achievements Screen**
   - Grid with progress bars

---

## ⚙️ QUALITY-OF-LIFE FEATURES (non-negotiable)
- **Auto-save** every 30 seconds + on visibility change
- **Offline progress** (calculate earnings while away, capped at 8 hours, show modal on return)
- **Buy x1 / x10 / x100 / Max** toggle for buildings
- **Keyboard shortcuts** (Space = click, 1-9 = buy buildings, M = mute)
- **Tooltips** on EVERYTHING with smooth fade-in
- **Number formatter** with toggle (1.23M / 1,234,567 / 1.23e6)
- **Notifications** (top-right toast for achievements, golden plushies, milestones)
- **Reduced motion** option for accessibility
- **Tab title updates** with current plushie count
- **Confetti** on major milestones (tsParticles)

---

## 📁 PROJECT STRUCTURE
```
src/
├── components/
│   ├── ui/              (Button, Modal, Tooltip, Toast, Slider)
│   ├── game/            (PlushieScene3D, ClickArea, BuildingList, UpgradeShop)
│   ├── screens/         (MainMenu, GameScreen, SettingsModal, Collection)
│   └── layout/          (TopBar, BottomBar, LeftPanel, RightPanel)
├── stores/
│   ├── gameStore.ts     (Zustand: currencies, buildings, upgrades)
│   ├── settingsStore.ts (audio, graphics, UI prefs)
│   └── saveStore.ts     (save/load logic)
├── audio/
│   └── SoundManager.ts  (Tone.js wrapper)
├── data/
│   ├── buildings.ts     (building definitions)
│   ├── plushies.ts      (collection data)
│   ├── upgrades.ts
│   └── achievements.ts
├── utils/
│   ├── formatNumber.ts
│   ├── gameLoop.ts      (requestAnimationFrame tick)
│   └── offlineProgress.ts
├── three/
│   ├── PlushieModel.tsx (procedural plushie geometry)
│   └── Scene.tsx
├── hooks/
│   ├── useGameTick.ts
│   ├── useAutoSave.ts
│   └── useKeyboard.ts
└── App.tsx
```

---

## 🚦 DEVELOPMENT PHASES (build in this order!)

**Phase 1 — Foundation**
- Vite + React + TS + Tailwind setup
- Zustand game store with click → +1 plushie
- Basic top bar showing count
- IndexedDB save/load working

**Phase 2 — Core Loop**
- 5 buildings with auto-generation
- Buy/cost scaling
- Game tick loop (10 ticks/sec)
- Number formatter

**Phase 3 — 3D Plushie**
- Three.js scene with procedural bear plushie
- Click interaction → bounce animation
- Floating +1 numbers (Framer Motion overlay)

**Phase 4 — Audio**
- Tone.js SoundManager
- All SFX methods working
- Ambient music loop
- Settings panel

**Phase 5 — Polish & UI**
- Full layout (left/center/right/bars)
- Animations (Framer Motion for panels, GSAP for juicy clicks)
- Toast notifications
- Tooltips

**Phase 6 — Content**
- All 12 buildings
- 50+ upgrades
- 30+ plushies across categories
- 50+ achievements

**Phase 7 — Meta**
- Prestige system
- Collection screen
- Stats screen
- Main menu

**Phase 8 — QoL & Final Polish**
- Offline progress modal
- Buy x10/x100/Max
- Keyboard shortcuts
- Performance pass (memoization, lazy loading)
- Bug bash

---

## ✅ CODE QUALITY RULES
- Strict TypeScript (no `any`)
- Each component < 200 lines (split if larger)
- All game constants in `data/` files, never magic numbers
- Use Zustand selectors to avoid unnecessary re-renders
- The 3D scene must be wrapped in `<Suspense>` with a fallback
- Throttle save operations (max once per 5 seconds)
- All audio MUST be initialized on first user interaction (browser autoplay policy)
- Use `React.memo` on building list items
- Comment any complex math (cost scaling, offline progress)

---

## 🎬 START HERE
Begin with **Phase 1** only. Generate the full Vite + React + TS + Tailwind setup with:
1. Project scaffolding
2. Zustand `gameStore` with `plushies`, `clickValue`, `incrementPlushies()`
3. A centered "click me" button (placeholder for the 3D plushie)
4. Top bar showing the plushie count, formatted nicely
5. Save/load to IndexedDB working with auto-save every 30s

Confirm Phase 1 works before moving to Phase 2. Ask me to verify before proceeding.