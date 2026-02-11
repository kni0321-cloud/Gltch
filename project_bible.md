# GLTCH Project Bible (宪法文档)

> **Fundamental Principle**: This document defines the "Soul" of GLTCH. Any AI model working on this codebase must adhere to these parameters to prevent architectural drift.

## 1. Visual Identity (核心参数)
- **Brand Color (Primary)**: `#BF00FF` (Electric Purple)
- **Background**: `#000000` (Pure Black)
- **Accent**: `rgba(191, 0, 255, 0.4)` (Low-opacity glowing purple)
- **Typography**: `JetBrains Mono` (Always)
- **Visual Effects**: 
    - Grain Overlay: `opacity: 15%`, mix-blend-mode: overlay.
    - Scanlines: 4px vertical steps, light-opacity purple.

## 2. Privacy & Data (隐私逻辑)
- **Ephemeral Storage**: All images captured via `Scan` page are processed via Canvas for feature extraction and then immediately destroyed.
- **No Persistence**: Original image data must NEVER be stored in any database. Only extracted text/tags are persistent.

## 3. Identity and Soul (身份与灵魂)
- **Gemini Role**: 2077 Digital Prophet (高冷、毒舌、玄学黑话).
- **Vibe Dictionary**:
    - Messy Room -> `#ENTROPIC_CHAOS`
    - Couples/Partners -> `#QUANTUM_TETHER`
    - High Tech/New objects -> `#NEON_STATIONARY`
    - Dark/Quiet areas -> `#VOID_RESONANCE`

## 4. Core Algorithms (核心算法)
### Destiny Consistency Algorithm (命运一致性算法)
- **Hash Rule**: Same image content = Exactly same Vibe tag. No randomness in recurrence.
```javascript
function generateHash(imageBuffer) {
    // Simple stable hash to ensure consistency
}
```

## 5. Ritual Experience (仪式感规范)
- **Ritual Latency**: Never show a boring loading spinner. Instead, use "Ritual Mode" (flickering HUD text like `RESOLVING_KARMA`).
- **Hash Stability**: Destiny is non-random. Same scene = Same Oracle.
- **Conversion Hook**: Zero credits = "Glitch Notice" Modal (Share for +3, Pay $0.99 for Permanent).

## 6. Architecture Pattern (架构模式)
- **Transition**: Zoom-in entry (Orb expands to fill screen).
- **Service Security**: `aiService` must purge image memory immediately after encoding.
- **Performance Fallback**: If Canvas FPS < 20, fallback to CSS filters for chromatic aberration.
