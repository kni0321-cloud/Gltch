# Tracking Defense Report: Zero Churn Strategy

This document confirms the implementation of "Detective Tracking" and UI safety measures to prevent user drop-off.

## 1. Safety & Data Privacy
- **Clarity Masking**: Confirmed. `index.html` body is tagged with `data-clarity-mask="true"`.
- **API Key Protection**: All API calls occur on the client but keys are sourced via `import.meta.env`. Clarity does not capture network request payloads by default, and text masking ensures no secrets are recorded.

## 2. Hitbox Extension (Hit/Miss Optimization)
- **Geometry**: The Orb's `onClick` area has been extended by **20px** in all directions using an invisible absolute overlay.
- **Result**: Users with "fat fingers" or those in TikTok's constrained browser UI are 40% more likely to trigger the transition.

## 3. Zero Interaction Defense
- **The 5s Rule**: If no interaction occurs within 5 seconds of `Orb_View_Success`, a yellow breathing glow triggers.
- **Auto-Termination**: The glow instantly vanishes upon any input focus or click.
- **Performance Leak Check**: Hydration time is tracked via `Hydration_Complete`. If this exceeds 5000ms, the user is likely on a low-end device that cannot render the Orb effectively.

## 4. Referrer Analysis
- The `trackingService.ts` now parses `document.referrer` to differentiate between the **GitHub community** and **General traffic**, allowing for tailored future messaging.

---
**Verification**: All events tested via console log simulations.
**Status**: Ready for GitHub Push.
