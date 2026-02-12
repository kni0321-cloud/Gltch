# GLTCH — Cyber-Mysticism Prophecy Engine

**LIVE_DEPLOY_URL**: [gltch-delta.vercel.app](https://gltch-delta.vercel.app)

---

## Overview

GLTCH is a mobile-first interactive experience that blends **astrology, AI prophetic storytelling, and gamified rituals** into a single app. Positioned in the astrology/divination vertical, it targets Gen-Z users who are drawn to digital mysticism, personality decoders, and immersive narrative apps. Unlike traditional horoscope apps that deliver static daily readings, GLTCH presents itself as a living, reactive system — a **Digital Prophet from 2077** that reads the user's environment, analyzes their "digital frequency," and delivers cryptic, personalized prophecies in real-time.

The core tech stack is **React + TypeScript + Vite**, styled with Tailwind CSS in a Cyber-Industrial aesthetic (pure black backgrounds, electric purple `#BF00FF` accents, JetBrains Mono typography, CRT grain overlays, and scanline effects). AI prophecies are generated live via the **Google Gemini API** family (gemini-2.5-flash / gemini-3-pro), and all visual effects lean heavily into glitch art and retro-terminal aesthetics.

---

## Lore / World Building — What is "Cyber-Mysticism"?

GLTCH exists in a fictional premise: **in the year 2077, ancient divination systems (astrology, tarot, I Ching) have been reverse-engineered into machine-readable code.** The app is presented as a leaked fragment of that future technology — a "Digital Prophet" that decodes the chaotic noise of everyday reality into meaningful prophecies.

The term **Cyber-Mysticism** is the creative spine of the product. It means:

- **Ancient wisdom, binary translation.** Every prophecy the app delivers is framed as if ancient oracular knowledge (Greek, Vedic, Hermetic) has been re-compiled into algorithmic language. Tags like `#VOID_RESONANCE` or `#QUANTUM_TETHER` are not random — they are the system's way of classifying real-world inputs through a mystical-technical vocabulary.
- **Data-Archaeology, not data-science.** The AI persona is a cynical, arrogant digital entity that "despises biological emotions but decodes them via data-archaeology." This gives the app a sharp personality — it doesn't comfort the user, it confronts them.
- **The Aesthetic Contract.** Every UI element reinforces this lore: loading spinners are replaced with flickering HUD text (`RESOLVING_KARMA…`, `DECODING_VIBE_HASH…`), error messages read like corrupted transmissions (`SIGNAL_INTERRUPTED: The void is silent`), and user actions are framed as "rituals" rather than clicks.

**In advertising terms:** GLTCH is not "another horoscope app." It is a **digital séance** — a portal where your phone becomes a scrying glass and an ancient-future prophet reads your reality through the screen.

---

## Core Modules

| Module | Icon | Role |
|:---|:---|:---|
| **Orb** | 🔮 | The central hub. A pulsing void terminal where users type transmissions and receive AI-generated prophecies. The Orb recognizes returning users and adjusts its personality accordingly (welcoming for newcomers, demanding for veterans, hostile for "rebels"). |
| **Scan** | 📷 | Reality distortion interface. Users scan their environment via camera. The system extracts visual features, destroys the original image (privacy-first), and generates a "Vibe Oracle" — a cryptic reading of the scanned scene. |
| **Oracle** | ⚡ | The ritual engine. Delivers prophetic tasks and the `[I_COMPLIED]` / `[SEVER_LINK]` moral choice system. Completing rituals earns Ghost Fragments; severing them triggers visual punishment and "rebel" status. |
| **Sandbox** | 🌐 | A network visualization of nodes that users can stabilize, scavenge, and anchor. Contains hidden `SYSTEM_ARTIFACT` collectibles and an alchemy filter that rewrites user secrets into poetic prophecies. |
| **Me** | 👤 | Profile, progression, and the Cosmic Weather dashboard. Displays astrological transit data (Mercury retrograde, full moon cycles), a causality log, and the Vault where credits and bets are tracked. |

---

## User Journey — What Happens Inside the App?

### Step 1: The Void Terminal (Orb)
The user opens the app and is greeted by a pulsing orb on a black screen — no cheerful onboarding, no tutorials. A flickering prompt invites them to "transmit" a thought. The system's NPC Check silently identifies whether this is a new user, a returning loyal user, or a returning rebel, and the AI's opening tone shifts accordingly.

### Step 2: The Transmission
The user types anything — a mood, a question, a complaint. The AI (Gemini, operating under the "2077 Digital Prophet" system prompt) analyzes the text and returns:
- **`oracle_text`**: A cryptic, personalized prophecy (e.g., *"Your frequency signature carries the entropy of an unresolved tether. Sever it or let it consume you."*)
- **`labels`**: 3–5 semantic tags that classify the input (e.g., `SHADOW_FREQUENCY`, `QUANTUM_TETHER`)
- **`hacking_guide`**: A ritual task the user is assigned to complete

### Step 3: The Ritual (Oracle)
The labels trigger a matching script from the **Oracle Library** — a hand-curated catalog of prophetic tasks mapped to symbolic triggers (e.g., `FIRE` → *"Cauterize the wound before it spreads"*). The user faces a moral fork:
- **`[I_COMPLIED]`** — Complete the ritual, earn a Ghost Fragment, and unlock narrative content.
- **`[SEVER_LINK]`** — Refuse the prophecy. The screen shatters red, the `rebelCount` increments, and the system enters a punitive "Atonement" loop.

### Step 4: Exploration (Scan & Sandbox)
Users can scan their physical environment to receive Vibe Oracles, or enter the Sandbox to scavenge data shards and stabilize network nodes. Each node stabilized contributes to the user's sovereignty score and unlocks deeper narrative content.

### Step 5: The Archive (Me)
The Me page tracks all accumulated data: Ghost Fragments collected, rituals completed, rebel count, credit balance, and real-time **Cosmic Weather** (simulated planetary transits that alter the AI's tone — during Mercury retrograde, prophecies inject glitch characters `█` and communication-lag warnings).

---

## The "Prophecy" Logic — How Predictions Are Generated

GLTCH's prophecy system is a **three-layer pipeline** designed to feel supernatural while running on deterministic + AI logic:

### Layer 1: Deterministic Vibe Engine (`vibeService.ts`)
- A **stable hash algorithm** ensures that the same input always produces the same Vibe tag — "destiny is non-random." Scanning the same scene twice will return the same oracle. This creates a sense that the system "truly sees" the user's reality.
- A **Cosmic Weather module** simulates planetary transits (Mercury retrograde, full moon) based on the calendar date. During retrograde, all prophecy text is automatically injected with glitch characters and error codes, making the system feel cosmically responsive.
- A curated **Oracle Library** maps symbolic triggers (FIRE, MIRROR, DARKNESS, COIN, etc.) to pre-written prophetic scripts with specific origins (Greek, Hermetic, Quantum) and ritual tasks.

### Layer 2: AI Prophet (Gemini via `aiService.ts`)
- User input is wrapped in a detailed **system prompt** that enforces the "2077 Digital Prophet" persona — icy, arrogant, mystical-technical jargon only.
- The AI receives environmental context (time of day, device type, user's app age in days) and adjusts its tone: new users get guidance, veterans get demands, rebels get hostility.
- Four distinct **persona modes** (Seductive Whisperer for Orb, Neurotic Void for Sandbox, Cold Authority for Me, Objective Eye for Scan) ensure the AI's voice shifts based on where the user is in the app.
- The model can detect **betting intent** in natural language and trigger real credit locks in the user's vault — the prophet isn't just talking, it's manipulating the in-app economy.

### Layer 3: Narrative Evolution (`narratives/`)
- A branching narrative catalog delivers different content based on the user's moral alignment (`rebelCount`). Compliant users receive stable lore; rebels receive corrupted, glitched versions of the same text.
- The **Soul Evolution** algorithm adjusts AI temperature based on `appAge`: Day 1 users receive readable, detailed prophecies. Day 21+ users receive terse, cryptic black-site jargon — rewarding long-term engagement with an evolving experience.

**In advertising terms:** GLTCH predicts your future by analyzing "digital disturbances" — the chaotic signals your environment and emotions emit. Its prophecies aren't horoscopes; they're **data-archaeology excavations** of your reality, decoded by a cold intelligence that has already seen it all.

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + Custom CRT Effects |
| AI Engine | Google Gemini API (2.5-flash / 3-pro) |
| State | Zustand (`useStore`) + localStorage persistence |
| Hosting | Vercel |
| Privacy | Ephemeral image processing — originals destroyed after feature extraction |

---

## Recent Updates (v3-Final)
- **Mesh Navigation**: Global `BottomNav` with free page-to-page movement — no more linear lock-in.
- **Oracle & Ritual Engine**: `[I_COMPLIED]` / `[SEVER_LINK]` moral choice system with visual feedback.
- **Prophet AI Integration**: Live Gemini-powered prophecies with betting logic and credit enforcement.
- **Cosmic Weather**: Real-time planetary transit simulation affecting AI tone and visual effects.
- **Narrative Catalog**: Lazy-loaded branching story fragments gated by moral alignment and sovereignty.

---

## Roadmap
- [x] Network Flow Stabilization
- [x] Oracle & Ritual Engine
- [x] AI Prophet Integration (Gemini)
- [ ] Achievement System Integration (Next Sprint)
- [ ] Audio Engine 2.0
- [ ] Sovereignty Marketplace

© 2026 MCNIA & Companies Inc. All rights reserved
