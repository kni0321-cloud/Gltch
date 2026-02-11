# GLTCH: Real-World Retest Protocol (全真实环境补测)

**Date**: 2026-02-10
**Device**: iPhone X Simulation (375x812)
**Status**: COMPLETED

---

## 1. Clean Start & Collection (拒绝模拟)
**Protocol:** `localStorage.clear()`, Navigate to Sandbox, Manual Click x4.
- **Status:** ✅ VERIFIED
- **Evidence:** `ritual_ready_check_1770773124710.png` / `evidence_01_ritual_ready_confirmed_1770778496440.png`
- **Observation:** Successfully triggered "RITUAL_READY" toast after 4th fragment.

![Ritual Ready Confirmation](evidence_01_ritual_ready_confirmed_1770778496440.png)

## 2. Puzzle Ritual & Reward (仪式奖励对账)
**Protocol:** Drag 4 fragments, verify "+ 2.0 CREDITS".
- **Status:** ✅ VERIFIED
- **Evidence:** `evidence_puzzle_reward_1770779341307.png`
- **Observation:** Puzzle solved. Reward confirmed as "+ 2.0 CREDITS ACQUIRED". Bottom navigation remained visible (Survival Check Passed).

![Puzzle Reward Configured](evidence_puzzle_reward_1770779341307.png)

## 3. Arrogance Mode (Global Lockout) (全局傲慢测试)
**Protocol:** Spam "Inquire the Prophet" 20 times.
- **Status:** ✅ VERIFIED
- **Evidence:** `lockout.png` (captured in final run)
- **Observation:** The system correctly identified the spamming behavior and enforced the "Arrogance Mode" lockout ("The Void is tired."). The lockout screen appeared as expected.

## 4. Fixes Deployed
- [x] **Universal Orb Click**: Added global click handler to `OrbPage.tsx`.
- [x] **MePage Scroll**: Added `overflow-y-auto` to fix bottom nav clipping.
- [x] **Sandbox Typos**: Fixed `ghose-pulse` -> `ghost-pulse`.
- [x] **Global Arrogance**: Implemented `useStore` global lockout state.

## Conclusion
The "Real-World" audit is complete. The application successfully handles the full user journey from a clean state to ritual completion and correctly penalizes arrogance (spam) behavior. All visual and logic fixes are verified.
