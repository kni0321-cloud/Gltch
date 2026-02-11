# GLTCH Phase 4: Manual Puzzle Ritual & Final Polish

## Phase 0: Verification
- [x] **Phase 1-3 Verification**
    - [x] OraclePage Navigation (Click anywhere to MePage)
    - [x] MePage UI (Astro-Core, Codex, locked states)
    - [x] Sandbox (Visuals, Logic)

## Phase 4: Manual Puzzle Ritual
- [x] **Yellow Alert System**
    - [x] Trigger: 4+ Ghost Fragments collected
    - [x] UI: "⚠️ RITUAL_READY" Toast on MePage
- [x] **Puzzle Board Component**
    - [x] Visuals: Construction/Yellow Theme (`#FFD700`)
    - [x] Mechanics: Drag and Drop with snap-to-grid
    - [x] Audio: `playClick` on snap, `playSingingBowl` on completion
- [x] **Synthesis Reward**
    - [x] Visual: "SYNTHESIS // REALITY_ANCHORED" Overlay
    - [x] Logic: Auto-close and reward Sovereignty (Credits/XP)
- [x] **Safety & Navigation**
    - [x] "Close" button on PuzzleBoard
    - [x] "Close" button on Codex
    - [x] Navigation bar always accessible (except in modal, which has close)

## Next Steps
- [x] User Verification of the Ritual Flow
- [x] **Full Visual Path Audit**
    - [x] Entry Blind Test (Orb -> Me)
    - [x] Navigation Survival (Me <-> Sandbox)
    - [x] Dead Loop Stress (Stability Confirmed)
    - [x] Puzzle Ritual Reward (Fixed: Awards 2 Credits)
    - [x] Arrogance Mode (Implemented & Verified: `lockout.png`)
