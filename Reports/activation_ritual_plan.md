# Activation Ritual: Gemini API & Credit Enforcement

This plan activates the real-time inquiry logic in the `MePage` by integrating the Gemini API and implementing a credit-based consumption model.

## Security & Environment

> [!IMPORTANT]
> The `.env.local` file contains sensitive API keys. We must ensure it is never committed to Git.

### [NEW] [.gitignore](file:///d:/AI/Gltch/.gitignore)
Create a `.gitignore` file to protect the environment and ignore build artifacts.
- Exclude `.env`, `.env.local`, `.env.*.local`
- Exclude `node_modules/`
- Exclude `dist/`
- Exclude `.DS_Store` and other OS-specific files

---

## Store Logic

### [MODIFY] [useStore.ts](file:///d:/AI/Gltch/src/store/useStore.ts)
Update `consumeCredit` to support fractional deductions.
- Change `consumeCredit: () => boolean` to `consumeCredit: (amount?: number) => boolean`.
- Default `amount` to `1`.
- Update state to deduct the specific amount.

---

## API Service

### [MODIFY] [aiService.ts](file:///d:/AI/Gltch/src/services/aiService.ts)
Integrate the real Gemini API.
- Install `@google/generative-ai`.
- Initialize the client using `import.meta.env.VITE_GEMINI_API_KEY`.
- Refactor `analyze` to send the structured prompt (System Instructions + Context Blender) to `gemini-1.5-flash`.
- Parse the JSON response and return it.

---

## MePage Integration

### [MODIFY] [MePage.tsx](file:///d:/AI/Gltch/src/pages/MePage.tsx)
Connect the UI to the real service.
- Update `handleDailyLog` to call `consumeCredit(0.1)`.
- If `consumeCredit` returns `false` (insufficient funds), show the `RefillModal`.
- Ensure the response from `aiService.analyze` is displayed.
- *Note: Typewriter effect is already partially supported by the dialogue log handling, but I will ensure the response feels interactive.*

---

## Verification Plan

### Automated Tests
- **Credit Check**: Run a script to verify `useStore` correctly deducts 0.1 credits.
- **Safety Check**: Verify `.gitignore` exists and contains `.env.local`.

### Manual Verification
1.  **Inquiry Test**: Open the app, navigate to Me Page.
2.  **Verify Balance**: Note the initial credit balance.
3.  **Perform Inquiry**: Type "Chaos" into the prophet input and send.
4.  **Confirm Feedback**:
    *   Verify balance decreased by exactly 0.1.
    *   Verify the response appears with a typewriter-like delay (simulated or real).
    *   Verify the response is from the AI (not a hardcoded fallback).
