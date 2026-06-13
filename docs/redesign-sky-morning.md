# LittleKey Redesign — "בוקר בשמיים" (Sky Morning)

> Session summary: what we explored, decided, and shipped to make the game more
> playful and clear for a 5-year-old, and to look good on a Pixel 10 Pro.
> Date: 2026-06-13. Branch: `main`. Status: implemented locally, **not yet committed/deployed**.

---

## 1. The goal

Make LittleKey (in production at [littlekey.live](https://www.littlekey.live)) feel
more playful and age-appropriate for May (5), with colors that are fun **but still
clear**, and a layout that works well on a phone (Pixel 10 Pro, ~412×915 CSS px).

## 2. How we chose the direction (taste process)

Instead of jumping to code, we generated **three distinct visual prototypes** and
compared them side by side:

| Variant | Name | Idea |
|---|---|---|
| A | סוכריות / Candy Pop | Saturated chunky candy buttons on cream — max energy |
| B | **בוקר בשמיים / Sky Morning** ✅ | Storybook sky: sun, clouds, hills, letter on a cloud |
| C | ספר מדבקות / Sticker Book | Kraft paper, rotated die-cut stickers, star stamps |

**Chosen: Variant B — Sky Morning.** It was the gentlest evolution of the current
brand (kept the Suez One display font and warm undertones) while adding a clear,
calm, story-like world. Approved design artifacts live in
`~/.gstack/projects/glanzt-LittleKey/designs/playful-restyle-20260610/`.

## 3. The design system

A single shared module, [`src/styles/sky-theme.jsx`](../src/styles/sky-theme.jsx),
defines the whole look so every screen stays consistent.

**Palette** (`SKY`):

| Token | Hex | Use |
|---|---|---|
| ink | `#2E3A59` | All primary text / titles (replaced near-black `#111319`) |
| skyblue | `#4FA8E8` | Primary actions, current state (replaced purple `#7C5CFC`) |
| mint | `#3FBF8C` | Success / completed |
| butter | `#FFB938` | Highlights, "current" rings |
| peach | `#FF9B83` | Warm accents |
| lilac | `#9B7DE8` | Secondary accent (hint card, stats) |
| rose | `#F2709C` | Gentle "try again" (replaced harsh red `#E74C3C`) |

**Background** (every screen): a fixed sky gradient
`linear-gradient(180deg, #8ECDF6 → #BDE4FB → #FFF3CF → #FFE9B8)` — blue daylight at
top fading to warm butter near the ground.

**Scenery** (`SkyScenery`): a breathing sun, three drifting clouds, and soft green
hills. `mode="home"` shows the sun; `mode="game"` drops the sun and dims clouds so
it never competes with controls.

**Typography:** unchanged — Suez One for display titles, Secular One for UI labels,
Rubik for body. Continuity with the existing brand was deliberate.

**Feedback tone (taste call):** success is celebratory (mint letter, spinning
ray-burst, pastel confetti, "מעולה! ⭐"); mistakes are encouraging, never punishing
(rose letter, "כמעט! נסי שוב 💪") — appropriate for a 5-year-old.

## 4. What shipped (first slice, already QA'd)

The two screens May uses most:

- **[`src/app/play/page.jsx`](../src/app/play/page.jsx)** — the game picker. Now a
  sky world; all 6 games are white "pill" cards that fit **one phone screen without
  scrolling** (previously ~2 cards were visible at a time). Each game kept its old
  color family so existing associations carry over.
- **[`src/app/play/game/page.jsx`](../src/app/play/game/page.jsx)** — the keyboard
  letter game. The letter sits on a cloud; success/mistake states as described above.
  All game logic untouched.

## 5. Rollout to every other screen

The same look was then applied across the whole app. The high-leverage move was
updating the **shared foundation** so most screens inherited the theme at once:

- **[`src/lib/game-constants.js`](../src/lib/game-constants.js)** — `PAGE_BG` →
  sky gradient + ink text; `BACK_BUTTON_STYLE` → sky-glass.
- **[`src/styles/shared.js`](../src/styles/shared.js)** — `FloatingLettersBackground`
  now renders `SkyScenery` (clouds + hills) instead of the old grey grid + faded
  letters, so every screen importing it inherits the backdrop. Auth `page`/`title`/
  `submitBtn`/`footerLink` moved onto the palette.
- **[`src/components/game-top-menu.jsx`](../src/components/game-top-menu.jsx)** — top
  bar from peach-glass to sky-glass.
- **[`src/components/game-ui.jsx`](../src/components/game-ui.jsx)** — confetti colors,
  progress beads (butter ring = current, mint ✓ = done), lilac hint card.

Then per-screen accent fixes (purple→sky-blue, near-black→ink, harsh red→rose,
dark CTAs→sky gradient):

- `levels` — current tile sky-blue, completed mint, dark CTA → sky gradient.
- `summary` — dark level pill + CTAs → sky; stat colors kept (meaningful on white).
- `profiles` — purple selection/borders → sky-blue; delete → rose.
- `dashboard` — purple tabs/chart/title → sky-blue (data greens/oranges/reds kept).
- `settings` — purple toggles → sky-blue; dark save button → sky gradient.
- `match` — title → ink; time/pairs/moves stats onto palette; board cooled off cream.
- `wheel` — title → ink; spin button → sky-blue→butter; answers → mint/rose.
- `coloring-gallery` — sky background, white header, ink title, sky-blue back link.
- `landing` ([`src/app/page.jsx`](../src/app/page.jsx)) — sky gradient, ink text,
  sky-glass nav/badge; playful hero collage kept.

The two self-contained full-screen games were re-skinned through their CSS variables:

- **[`gan-sheli.css`](../src/components/gan-sheli/gan-sheli.css)** — `--gs-*` palette
  → butter/mint/rose/ink; app, title, map, and finale backgrounds → sky gradient.
- **[`alefbet.css`](../src/components/alefbet/alefbet.css)** — `--ab-*` palette →
  sky-blue/mint/rose/ink; app, title, and letter-done backgrounds → sky gradient.

### Files changed (17 modified, 1 new)

```
NEW  src/styles/sky-theme.jsx          (palette + SkyScenery)
     src/lib/game-constants.js          src/styles/shared.js
     src/components/game-top-menu.jsx   src/components/game-ui.jsx
     src/components/coloring-gallery.jsx
     src/components/gan-sheli/gan-sheli.css
     src/components/alefbet/alefbet.css
     src/app/page.jsx
     src/app/play/page.jsx              src/app/play/game/page.jsx
     src/app/play/levels/page.jsx       src/app/play/summary/page.jsx
     src/app/play/match/page.jsx        src/app/play/wheel/page.jsx
     src/app/play/profiles/page.jsx     src/app/play/dashboard/page.jsx
     src/app/play/settings/page.jsx
```

## 6. Verification

- **Tests:** `npx jest` → **112/112 pass**, 10 suites.
- **Compile:** every route returns HTTP 200; no Next.js runtime-error overlay.
- **Visual QA** at Pixel viewport (412×915): home, keyboard game (idle / success /
  mistake), levels, profiles, summary, match, wheel, coloring, sign-in, landing,
  gan-sheli, alefbet — all confirmed on-theme.

## 7. Mobile QA pass (Pixel 10 Pro, 412×915) + fixes

A device-width review found and fixed three real issues:

1. **Top menu overflowed/overlapped content on phones.** The logo + nav + auth
   buttons wrapped to a second row that overlapped the page (and hid back buttons on
   dashboard/settings/wheel). Fixed in
   [`game-top-menu.jsx`](../src/components/game-top-menu.jsx): the bar is now a single
   non-wrapping row that scrolls horizontally if needed, with a `@media (max-width:640px)`
   rule that shrinks the logo/buttons and hides the long profile name (avatar stays).

2. **Wheel game was broken on mobile** — the wheel rendered as a 28px sliver. Root
   cause: `useState(window.innerWidth)` created a hydration mismatch, and React 18 does
   not patch mismatched inline styles, so the server's **desktop 2-column grid stayed
   frozen at phone width** (first column collapsed to 0px). Fixed by initializing the
   viewport state to a constant on both server and client
   (`useState(1200)`) in [game](../src/app/play/game/page.jsx),
   [match](../src/app/play/match/page.jsx), and [wheel](../src/app/play/wheel/page.jsx);
   the resize effect then switches to the real width after mount. The wheel is now a
   correct 320×320 single-column layout, and the hydration warnings for those screens
   are gone.

3. **Full-screen games hid their own back button.** gan-sheli and alefbet are
   `position:fixed` overlays; the global menu (z-index 250) covered their own
   "חזרה לתפריט" button at top-right. Fixed in
   [`play/layout.jsx`](../src/app/play/layout.jsx): the global menu is now hidden on
   `/play/gan-sheli` and `/play/alefbet` (they have their own full navigation), giving a
   clean, truly full-screen experience.

Re-verified at 412×915: home, keyboard game, levels, match, wheel, dashboard,
settings, landing, gan-sheli, alefbet — all single-row menus, no overlap, correct
layouts. **112/112 tests still pass; all 16 routes return 200.**

> Known, pre-existing, out of scope: the wheel/match feeling images are picked at
> random, so SSR and client pick different images → one dev-only hydration warning per
> page. Harmless (client uses its own pick); fixing needs a client-only random, a
> game-logic change unrelated to this redesign.

## 8. Not done yet / next steps

- **Commit + deploy.** All changes are local and uncommitted on `main`. Recommended:
  branch, commit, push, and deploy to littlekey.live after feeling it on the phone.
- Optional polish: minor dark-on-white labels inside the wheel/match modals remain
  intentionally dark for contrast; revisit only if desired.
- Untracked, unrelated to this redesign: `844x390-*.png`, `docs/app-architecture.html`,
  `env copy` (a stray copy of env — consider deleting; it may contain secrets).
