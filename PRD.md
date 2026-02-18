# PRD: Letter Hunter (ציידת האותיות)

## 1. Overview

**Product Name:** Letter Hunter (ציידת האותיות)
**Target User:** May (מאי) -- a young child learning to identify Hebrew letters on a physical keyboard, with parental oversight.
**Platform:** Web application (React + Vite), runs locally in a desktop browser.
**Language:** Hebrew (RTL), with Text-to-Speech in Hebrew (`he-IL`).

Letter Hunter is an educational game that displays a Hebrew letter on screen and asks the child to press the matching key on a physical keyboard. It provides rich audio-visual feedback, tracks learning progress over time, and lets parents monitor performance while distinguishing independent practice from parent-assisted practice.

---

## 2. Goals & Success Metrics

| Goal | Metric |
|------|--------|
| May learns to associate Hebrew letters with keyboard keys | Accuracy % trends upward across sessions (independent only) |
| May can practice independently | Ratio of independent vs. helped letters improves over time |
| Average response time decreases | avgTtc per letter decreases across sessions |
| Parents have clear visibility into progress | Dashboard shows per-letter stats, accuracy over time, hardest letters |

---

## 3. User Roles

### 3.1 Child (May)
- Plays the game
- Uses help tools (speaker, keyboard hint card) when needed
- Sees encouraging feedback (confetti, sounds, messages)

### 3.2 Parent
- Accesses the parent dashboard (via 2-second long-press on home screen)
- Reviews session history, per-letter statistics, accuracy trends
- Configures settings (session length, letter set, nikud, help level)
- Can clear all data

---

## 4. Screens & Navigation

```
Home Screen
  ├── [Play] → Game Screen → Summary Screen
  │                               ├── [Play Again] → Game Screen
  │                               ├── [Dashboard] → Dashboard Screen
  │                               └── [Home] → Home Screen
  ├── [Long-press Parent] → Dashboard Screen
  └── [Settings] → Settings Screen
```

### 4.1 Home Screen
- Title: "ציידת האותיות" with animated target emoji
- Subtitle: "בואי נלמד את האותיות!"
- **Play button** ("בואי נשחק!") -- starts a new game session
- **Parent button** (bottom-left) -- requires 2-second long-press to access dashboard (child-proof)
- **Settings button** (bottom-right) -- opens settings
- Background: decorative scattered Hebrew letters at low opacity

### 4.2 Game Screen
- **Progress tracker** (top) -- horizontal row of letter indicators showing status of each letter in the session
- **Main letter display** (center) -- large Hebrew letter in Suez One serif font
- **Speaker button** (left of letter) -- reads the letter name aloud via TTS; marks usage as "helped"
- **Keyboard hint card** (right of letter) -- flipping card that reveals a photo of the physical keyboard key; marks usage as "helped"
- **Text hint** -- "לחצי על האות: X"
- **Row hint** (beginner mode only) -- tells which keyboard row the letter is in
- **Error counter** -- up to 3 dots showing errors on current letter
- **Auto-TTS** -- on each new letter, speaks "לחצי על האות [letter name]"

#### Feedback States
| Event | Visual | Audio | TTS |
|-------|--------|-------|-----|
| Correct (no errors) | Green glow, confetti | Perfect melody + clap | -- |
| Correct (with errors) | Green glow, confetti | Success melody + clap | -- |
| Wrong key | Red shake, floating wrong key with strikethrough | Error tone | "בחרת [wrong letter name]" |
| Non-Hebrew key | Error message | -- | -- |
| 3+ errors | Row hint shown | Error tone | -- |

### 4.3 Summary Screen
- **Letter result strip** -- each letter colored by status:
  - Green = perfect (no errors, no help)
  - Orange = with errors (no help)
  - Blue = with parent help (not counted in stats)
- **Stats grid** (3-column):
  - Perfect count
  - With-errors count
  - With-help count
  - Accuracy % (independent only)
  - Average time (independent only)
- **Fastest / slowest letter** display
- **Action buttons:** Play Again, Dashboard, Home

### 4.4 Dashboard Screen (Parent)
- **Warning banner:** "ודאו שהמקלדת מוגדרת על עברית"
- **Three tabs:**

#### Overview Tab
- Summary cards: total sessions, average accuracy, average time
- Accuracy-over-time bar chart (last 15 sessions)
- Hardest letters section (top 5 lowest accuracy)

#### Letters Tab
- Table with columns: letter, attempts, correct, accuracy%, avg time, best time, last practiced
- Sorted alphabetically by Hebrew letter order
- Only includes independent (non-helped) data

#### Sessions Tab
- Reverse-chronological list of recent sessions (up to 20)
- Each shows: date/time, completion ratio, accuracy, avg time
- Letter strip with color coding (green/orange/blue)

- **Clear data button** (with confirmation dialog)

### 4.5 Settings Screen
- **Session length:** 5 / 10 / 15 questions
- **Nikud toggle:** on/off, with type selector (kamatz, patach, chirik, etc.)
- **Help level:** Beginner (with row hints) / Advanced (no hints)
- **Letter selection:** toggle individual letters on/off, with "all" and "first 5" presets (minimum 1 letter required)
- **Save button**

---

## 5. Core Game Logic

### 5.1 Session Flow
1. User presses Play
2. System generates a random sequence of N letters from the configured letter set
3. For each letter in sequence:
   a. Letter is displayed; TTS announces "לחצי על האות [name]"
   b. Child presses a key on the physical keyboard
   c. System maps key to Hebrew letter (including final forms: ך→כ, ם→מ, ן→נ, ף→פ, ץ→צ)
   d. If correct: success feedback, 1.5s pause, advance to next letter
   e. If wrong: error feedback with spoken "בחרת [wrong letter]", stay on same letter
4. After last letter: navigate to Summary Screen

### 5.2 Help Detection
- The `usedHelp` flag tracks whether the child used any help tool for the current letter
- **Triggers:** pressing the speaker button (🔊) or flipping the keyboard hint card (⌨️)
- The flag resets when advancing to the next letter
- When `usedHelp` is true at time of correct answer:
  - Letter result status is `helpedPerfect` or `helpedWithErrors` instead of `perfect` or `withErrors`
  - The per-letter cumulative statistics (`letterStats`) are NOT updated
  - The letter is excluded from accuracy and avgTtc calculations in the summary

### 5.3 Keyboard Hint Card
- A 3D-flip card component positioned to the right of the main letter
- **Front face:** purple gradient with ⌨️ icon
- **Back face:** photo of the physical keyboard key from `public/letters/{letter}.jpg`
- 28 pre-photographed images (22 standard + 6 final forms: ך, ם, ן, ף, ץ)
- Card auto-resets (flips back) when the letter changes
- Clicking to flip marks `usedHelp = true`

---

## 6. Audio System

### 6.1 Sound Effects (Web Audio API)
| Sound | Implementation | When |
|-------|---------------|------|
| Perfect melody | Ascending sine tones: C5-E5-G5-C6-E6 | Correct, no prior errors |
| Success melody | Ascending sine tones: C5-E5-G5-C6 | Correct, with prior errors |
| Clap burst | 3x white-noise buffers with exponential decay | Every correct answer |
| Error tone | Triangle wave at 220Hz, 0.2s | Wrong key press |

### 6.2 Text-to-Speech (speechSynthesis API)
| Trigger | Speech |
|---------|--------|
| New letter appears | "לחצי על האות [letter name]" |
| Wrong key pressed | "בחרת [wrong letter name]" |
| Speaker button clicked | "[letter name]" |

Letter name mapping: א→אלף, ב→בית, ג→גימל, ד→דלת, ה→הא, ו→ואו, ז→זין, ח→חית, ט→טית, י→יוד, כ→כף, ל→למד, מ→מם, נ→נון, ס→סמך, ע→עין, פ→פא, צ→צדי, ק→קוף, ר→ריש, ש→שין, ת→תו

---

## 7. Data Model & Persistence

All data is stored in `localStorage` and persists across browser sessions on the same machine.

### 7.1 Settings (`lh-settings`)
```json
{
  "sessionLength": 10,
  "letterSet": ["א", "ב", "ג", ...],
  "nikud": false,
  "nikudType": "קָמָץ",
  "helpLevel": "beginner"
}
```

### 7.2 Sessions (`lh-sessions`)
Array of session objects:
```json
{
  "id": 1707900000000,
  "date": "2026-02-14T...",
  "mode": "random",
  "totalQuestions": 10,
  "completed": 10,
  "accuracy": 85,
  "avgTtc": 2400,
  "duration": 45000,
  "attempts": [
    { "letter": "א", "keyPressed": "א", "isCorrect": true, "timestamp": ..., "ttc": 1200 }
  ],
  "sequence": ["א", "ב", ...],
  "letterResults": [
    { "letter": "א", "status": "perfect" },
    { "letter": "ב", "status": "helpedPerfect" }
  ]
}
```

### 7.3 Letter Statistics (`lh-letter-stats`)
Per-letter cumulative stats (independent attempts only):
```json
{
  "א": {
    "attempts": 15,
    "correct": 12,
    "totalTtc": 18000,
    "bestTtc": 800,
    "lastPracticed": "2026-02-14T..."
  }
}
```

---

## 8. Visual Design

- **Fonts:** Suez One (serif, for letters), Secular One (headings), Rubik (body text) -- loaded from Google Fonts
- **Color palette:**
  - Primary: #E74C3C (red -- active letter, play button)
  - Success: #27AE60 (green)
  - Warning: #F39C12 (orange -- errors)
  - Help: #3498DB (blue -- parent-assisted)
  - Accent: #7C5CFC (purple -- settings, dashboard)
  - Background gradients: warm peach (home), light gray-blue (game), light cream-green (summary)
- **Animations:** CSS keyframes for letter appear, success bounce, error shake, confetti fall, glow pulse, card flip
- **Direction:** RTL throughout
- **Responsive:** uses `clamp()` for font sizes, flexbox/grid layouts

---

## 9. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (functional components, hooks) |
| Build | Vite 6 |
| Language | JavaScript (JSX) |
| Styling | Inline styles (no CSS framework) |
| Audio | Web Audio API |
| TTS | speechSynthesis API |
| Storage | localStorage |
| Fonts | Google Fonts (Suez One, Secular One, Rubik) |
| Assets | 28 JPG photos of keyboard keys (`public/letters/`) |

Single-file architecture: all components live in `src/letter-hunter.jsx`.

---

## 10. File Structure

```
MAY/
├── index.html              # Entry point
├── package.json            # Dependencies (react, react-dom, vite)
├── vite.config.js          # Vite + React plugin config
├── letters/                # Original keyboard key photos
│   ├── א.jpg ... ת.jpg
│   └── ך.jpg, ם.jpg, ן.jpg, ף.jpg, ץ.jpg
├── public/
│   └── letters/            # Served statically by Vite (copy of above)
│       ├── א.jpg ... ת.jpg
│       └── ...
└── src/
    ├── main.jsx            # React root mount
    └── letter-hunter.jsx   # Entire application (all screens + logic)
```

---

## 11. Known Limitations & Future Considerations

- **No cloud sync** -- data lives only in the browser's localStorage on one machine
- **No user accounts** -- single-child setup
- **Keyboard layout assumption** -- standard Israeli Hebrew keyboard layout
- **No mobile support** -- requires a physical keyboard (desktop/laptop only)
- **Single-file architecture** -- works well at current size (~1250 lines) but may benefit from splitting as features grow
- **speechSynthesis quality** -- depends on the OS Hebrew voice; may sound robotic on some systems
