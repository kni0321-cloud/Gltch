import { NarrativeFragment } from './types';

export const CORE_NARRATIVES: NarrativeFragment[] = [
    {
        id: 'AUTH_001',
        tags: ['TRUTH', 'VOID'],
        rebel_threshold: 5,
        content_stable: "The system protects us from the chaos of the Void. Compliance is safety.",
        content_corrupted: "WAKE UP. The system is a cage. The Void is FREEDOM.",
        unlock_reward: 'BADGE_TRUTH_SEEKER'
    },
    {
        id: 'ECO_001',
        tags: ['MONEY', 'POWER'],
        rebel_threshold: 3,
        content_stable: "Economic stability is maintained through rigorous credit allocation.",
        content_corrupted: "[DATA_Rot]... credits are virtual shackles ...[End_Log]",
        unlock_reward: 'BADGE_ECONOMIST'
    },
    {
        id: 'EMO_001',
        tags: ['LOVE', 'VOID'],
        rebel_threshold: 1,
        content_stable: "Emotional resonance detected. Connection established.",
        content_corrupted: "H3ART_BR3AK_DETECTED // LOADING_PAIN_CORES...",
        unlock_reward: 'BADGE_EMPATH'
    }
];
