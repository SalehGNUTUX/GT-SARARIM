# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev                  # Vite dev server

# Production build (required before Electron/Android)
npm run build

# Electron desktop
npm run electron:dev         # Run with DevTools open
npm run electron             # Run production build

# Android
npm run android:sync         # build + cap sync
npm run android:open         # Open in Android Studio
npm run android:build        # Produce release APK
npm run android:debug        # Produce debug APK

# Type checking
npx tsc --noEmit
```

There are no test commands — the project has no test suite.

## Architecture

**Single-page app** with tab-based navigation (no React Router). `App.tsx` holds `activeTab` state and renders the active page via a `switch`. No URL routing; deep linking is not needed.

**State**: One Zustand store (`src/store/useStore.ts`) holds all application state. It persists via a **three-layer storage system**: IndexedDB (primary, survives Android lifecycle kills) → `localStorage` (fallback, strips large images if quota exceeded) → Capacitor Filesystem at `Directory.Data` (Android-only tertiary, never cleared). Storage key: `gt-sararim-storage-v6`. The `dbPromise` cache is reset via `db.onclose` / `db.onerror` so Android can silently kill the IndexedDB connection without causing silent write failures.

**Three deployment targets** share the same Vite `dist/` build:
- **Electron** (`main.js`) — desktop Linux/Windows, 420×820px window
- **Capacitor** (`capacitor.config.ts`, `android/`) — Android APK
- **Browser** — plain web

**User roles**: `guest | child | parent`. The parent dashboard (`ParentDashboard.tsx`) is PIN-gated and controls time limits, locked sections, content, and fonts. Children accumulate points → unlock 4 levels (`beginner → intermediate → advanced → expert`), each requiring progressively more points.

**Soft deletes**: `pendingDeletes` array provides a 10-second undo buffer (`scheduledDelete()`). Items are auto-committed after 10s.

**Time limiting**: `playTimeToday` on `UserProfile` increments every 60 seconds. When it exceeds the parent-set limit, the UI shows a lock screen. The timer resets daily (compared via `toDateString()`).

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root layout, tab router, time-limit enforcement, theme, RTL |
| `src/store/useStore.ts` | All state + actions (3-layer IndexedDB persistence) |
| `src/types.ts` | Unified TypeScript types for the entire app |
| `src/pages/ParentDashboard.tsx` | Admin panel: users, content, fonts, sounds, coloring images, share buttons |
| `src/components/ColoringActivity.tsx` | SVG coloring — built-in shapes and uploaded SVGs |
| `src/lib/audioEngine.ts` | Web Audio API synthesis + OGG playback |
| `src/lib/imageCompression.ts` | Compress uploads before storing in IndexedDB |
| `src/lib/security.ts` / `securityUtils.ts` | PIN hashing, parent auth utilities |
| `src/soundAssets.ts` | Vite static imports of all OGG files |

## Pages and Components

**Pages** (`src/pages/`): `LoginPage` → user selection/creation; `HomePage` → level cards + wisdom popup; `StoriesPage` → story browser + in-story quiz; `QuizActivity` → standalone quiz; `PuzzlesPage` → riddles/logic/memory; `ActivitiesPage` → coloring, dot-to-dot, memory game, image quiz; `ProfilePage` → child stats + certificates; `ParentDashboard` → full admin panel.

**Key components** (`src/components/`): `ColoringActivity`, `DotToDotActivity`, `MemoryGameActivity`, `ImageQuizActivity` — the four activity types. `AudioPlayer` + `BackgroundMusic` + `SoundControls` work with `audioEngine.ts`. `CertificateGenerator` produces printable SVG certificates. `WisdomPopup` shows a random wisdom card on home screen.

## Data Model (src/types.ts)

- `UserProfile` — id, name, role, ageGroup (`4-6 | 6-8 | 9-12 | all`), points, achievements, playTimeToday, dailyTimeLimit
- `ParentSettings` — pin, lockedSections, timeLimitEnabled, fontSettings, storyCategories, backgroundSoundId
- `Story` — id, title, content, textWithHarakat, level, category, exercises (`StoryQuestion[]`)
- `Question` — id, text, options (`string[]`), correctAnswer (index), category, ageGroup, level
- `Puzzle` — id, type (`riddle | logic | memory`), content, solution, hint, level
- `CustomColoringImage` — processed SVG with `regions: CustomColoringRegion[]`, each having `data-region-id`
- `LevelProgress` — per-user per-level tracking of completed stories/puzzles/activities
- `PendingDelete` — soft-delete buffer with `expiresAt` timestamp
- `LocalImage` — base64 image blobs stored in `AppState.localImages` (keyed by id)

## SVG Coloring Upload Pipeline

`parseSvgFile()` in `ParentDashboard.tsx` classifies every shape element:

1. **Stroke-only** (`fill="none"` + stroke) — colorable interior, initial fill white
2. **White/light fill** (luminance > 0.7) — colorable region as-is
3. **Potrace / inherited dark fill** (no explicit fill on element, parent `<g fill="#000">`) — converted to `fill="white"` + `stroke="black"` so each body-part path becomes a coloring region
4. **Explicit dark fill** (luminance < 0.3) — decorative outlines, skipped (not clickable)

Each colorable element gets `data-region-id` and `data-original-fill`. The click handler in `ColoringActivity.tsx` uses `el.style.fill = color` (inline style beats CSS class rules). Reset restores from `data-original-fill`.

## Styling Conventions

- **Tailwind CSS v4** (JIT). Alias `@/` resolves to project root.
- **RTL-first**: `dir="rtl"` on `<html>`. Use Tailwind's `rtl:` / `ltr:` variants when direction matters.
- shadcn/ui components live in `/components/ui/` (project root, not `src/`).
- Dark mode via `.dark` class on `<html>` (toggled by the store's `theme` field).

## Content Data

Static content is in `src/data/`: `stories.ts` (49 stories across 4 levels), `questions.ts` (71 questions), `puzzles.ts` (61 puzzles), `wisdom.ts` (31 cards: ayahs/hadiths/dhikr/sayings), `scholars.ts` (8 Islamic scholars). No backend — all content is bundled. Custom content added via the parent dashboard is stored in the Zustand store and merged with static defaults at render time.

`questions.ts` uses `option1/option2/option3/option4` fields (legacy shape) while the `Question` type expects `options: string[]` — this pre-existing mismatch causes TS errors but Vite builds successfully regardless.

## Path Alias

`@/` maps to the project root (not `src/`), so `@/components/ui/button` resolves to `./components/ui/button.tsx`.
