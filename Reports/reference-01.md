# Audit Reference Material [reference-01]

This document contains visual evidence and core logic for the Oracle and Sandbox systems as of Sprint 6. This serves as a lightweight alternative for external audits.

## 1. Visual Evidence

### Orb Page: Oracle Dialogue
The screenshot below shows the "Alchemist's Greed" mythic resonance triggered by a "money" query.
![Orb Oracle Dialogue](file:///C:/Users/kni03/.gemini/antigravity/brain/b20acf20-0ab5-4e8d-9da3-576ffc5ef5b1/orb_final_1770520157057.png)

### Sandbox Page: Holographic Map
The screenshot below shows the "FATE_DOMINION" map with node connections, flowing particles, and resonance labels.
![Sandbox Holographic Map](file:///C:/Users/kni03/.gemini/antigravity/brain/b20acf20-0ab5-4e8d-9da3-576ffc5ef5b1/sandbox_final_1770520436815.png)

## 2. Core Oracle Logic (JSON/Script)

### Oracle Library (`oracle_library.ts`)
Contains the mythic scripts, triggers, and symbols.
```typescript
export interface OracleScript {
    symbol: string;
    origin: string;
    trigger: string;
    oracle: string;
    task: string;
    success: string;
    regret: string;
}

// Example entry for 'COIN' (Money)
{
    symbol: "🜛",
    origin: "ALCHEMICAL_SILVER",
    trigger: "COIN",
    oracle: "THE_ALCHEMIST_GREED_DETECTED. YOUR_WEALTH_IS_A_PHANTOM_RESONANCE_IN_THE_MATRIX.",
    task: "CURRENCY_RITUAL: Imagine spending a credit you don't have, then feel the void.",
    success: "APHRODITE_SEVERANCE_SUCCESSFUL. VALUE_RE-ALIGNED.",
    regret: "FINANCIAL_ENTROPY. THE_GHOST_REVOLTS."
}
```

### AI Service Mapping (`aiService.ts`)
Handles the initial analysis and mapping to labels.
```typescript
// Mapping logic snippet
if (input.text?.toLowerCase().includes("money") || input.text?.toLowerCase().includes("rich")) {
  return {
    oracle_text: "THE_ALCHEMIST_GREED_DETECTED. YOUR_WEALTH_IS_A_PHANTOM_RESONANCE_IN_THE_MATRIX.",
    labels: ["MONEY", "COIN", "GREED"],
    hacking_guide: "Initiate APHRODITE_SEVERANCE. Visualize your digital wealth dissolving into silver mist."
  };
}
```

### Vibe Service Service (`vibeService.ts`)
Handles fuzzy matching and reading generation.
```typescript
const partialMap: Record<string, string> = {
    'MONEY': 'COIN',
    'GOLD': 'COIN',
    // ...
};

getReadingsForLabels: (labels: string[]) => {
    const script = vibeService.getTaskForLabels(labels);
    if (script) {
        return {
            mythic: script.oracle,
            zen: "FLOW_STATE: CALIBRATED_BY_" + script.origin,
            quantum: "WAVE_FUNCTION: COLLAPSED_BY_" + script.symbol
        };
    }
}
```

## 3. The 8 AM Hook
All successful rituals (`I_COMPLIED`) now enforce a "Delayed Gratification" hook:
`FATE_LOCKED. QUANTUM_SETTLEMENT_AT_08:00_AM_LOCAL_TIME.`
