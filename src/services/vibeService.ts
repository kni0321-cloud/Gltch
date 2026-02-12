import { ORACLE_LIBRARY, OracleScript } from '../data/oracle_library';
import { getNarrativeByTag } from '../data/narratives/index';

export interface GltchNode {
    id: string;
    type: 'VESSEL' | 'SHADOW' | 'ORACLE';
    labels: string[];
    entanglement: number;
    status: 'STABLE' | 'PENDING' | 'GHOST_ECHO' | 'FADING';
    next_unlock_time: number;
    vibe_score: number;
    frequency: number;
    oracle?: string;
    hacking_guide?: string;
    timestamp: number;
    ritualStatus?: 'STABLE' | 'FADING' | 'RECALIBRATING';
    readings?: {
        mythic: string;
        zen: string;
        quantum: string;
    };
}

export const vibeService = {
    getTaskForLabels: (labels: string[]): OracleScript | null => {
        // Fuzzy matching logic
        const normalizedLabels = labels.map(l => l.toUpperCase());

        // Priority 1: Exact trigger match
        const exactMatch = ORACLE_LIBRARY.find(s =>
            normalizedLabels.some(l => l === s.trigger)
        );
        if (exactMatch) return exactMatch;

        // Priority 2: Partial match (e.g. "SMOKE" matches "FIRE")
        const partialMap: Record<string, string> = {
            'SMOKE': 'FIRE',
            'FLAME': 'FIRE',
            'EYE': 'CAMERA',
            'PHONE': 'COMPUTER',
            'SCREEN': 'COMPUTER',
            'VOID': 'DARKNESS',
            'SHADOW': 'DARKNESS',
            'MONEY': 'COIN',
            'GOLD': 'COIN',
            'GLASS': 'MIRROR',
            'WATER': 'MIRROR',
            'TREE': 'TREE',
            'PLANT': 'TREE',
            'WOOD': 'TREE',
            'TIME': 'WATCH'
        };

        for (const l of normalizedLabels) {
            if (partialMap[l]) {
                const match = ORACLE_LIBRARY.find(s => s.trigger === partialMap[l]);
                if (match) return match;
            }
        }

        // Priority 3: Keyword search in origin or oracle
        const keywordMatch = ORACLE_LIBRARY.find(s =>
            normalizedLabels.some(l =>
                s.oracle.includes(l) || s.origin.includes(l) || s.trigger.includes(l)
            )
        );

        return keywordMatch || ORACLE_LIBRARY[Math.floor(Math.random() * ORACLE_LIBRARY.length)];
    },

    getCosmicWeather: () => {
        const today = new Date();

        // Check for manual override in session storage (for audit purposes)
        const override = sessionStorage.getItem('GLTCH_WEATHER_OVERRIDE');
        if (override === 'FULL_MOON') return { isMercuryRetrograde: false, isFullMoon: true };

        const day = today.getDate();
        const month = today.getMonth() + 1;

        // Mock Mercury Retrograde (simplified cycle)
        const isMercuryRetrograde = (day + month) % 7 === 0;
        const isFullMoon = day === 15 || day === 31;

        return { isMercuryRetrograde, isFullMoon };
    },

    getReadingsForLabels: (labels: string[]) => {
        const script = vibeService.getTaskForLabels(labels);
        const { isMercuryRetrograde } = vibeService.getCosmicWeather();

        let mythic = script?.oracle || "THE_GODS_ARE_SILENT.";
        if (isMercuryRetrograde) {
            mythic = `[ERROR_404_COMM_LAG] ${mythic.split('').map(c => Math.random() > 0.8 ? '█' : c).join('')}`;
        }

        if (script) {
            return {
                mythic: mythic,
                zen: "FLOW_STATE: CALIBRATED_BY_" + script.origin,
                quantum: "WAVE_FUNCTION: COLLAPSED_BY_" + script.symbol
            };
        }
        return {
            mythic: "THE_GODS_ARE_SILENT.",
            zen: "FLOW_STATIC.",
            quantum: "WAVE_NULL."
        };
    },

    generateStableHash: (features: string): string => {
        let hash = 0;
        for (let i = 0; i < features.length; i++) {
            const char = features.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    },

    ritualPhrases: [
        "RESOLVING_KARMA...",
        "DECODING_VIBE_HASH...",
        "SCANNING_EGO_VOID...",
        "SYNCHRONIZING_MATRIX...",
        "EXTRACTING_ESSENCE...",
        "CALIBRATING_PROPHET..."
    ],

    getEvolutionaryOracle: (frequency: number, currentOracle: string): string => {
        if (frequency < 3) return currentOracle;
        if (frequency >= 21) return `ALERT: ENTITY_ANCHORED_IN_PRIMARY_REALITY // ${currentOracle}`;
        if (frequency >= 7) return `ENTANGLEMENT_DEPTH: SOUL_DIMENSION // ${currentOracle}`;
        return `SYSTEM_CONFIRMED: MATERIAL_FORM_STABILIZED // ${currentOracle}`;
    },

    mapGeminiToVibe: (geminiTags: string[]): string[] => {
        return geminiTags.map(tag => tag.toUpperCase());
    },

    getNarrativeContext: async (input: string, rebelCount: number): Promise<{ content: string, badge?: string, isCorrupted: boolean }> => {
        const fragment = await getNarrativeByTag(input);

        if (!fragment) {
            return {
                content: "NO_NARRATIVE_FOUND // SYSTEM_DEFAULT_RESPONSE",
                isCorrupted: false
            };
        }

        // [ANTI-STALENESS] Tiered Unlocks
        // TODO: Pass sovereignty from caller or store access
        // For now, implementing basic gating logic structure
        /*
        if (fragment.sovereignty_threshold && currentSovereignty < fragment.sovereignty_threshold) {
             return {
                content: "DATA_SEALED // INSUFFICIENT_SOVEREIGNTY",
                isCorrupted: false
            };
        }
        */

        const isRebel = rebelCount >= fragment.rebel_threshold;

        return {
            content: isRebel ? fragment.content_corrupted : fragment.content_stable,
            badge: isRebel ? fragment.unlock_reward : undefined,
            isCorrupted: isRebel
        };
    },

    // Task: Smart Command Interceptor
    handleSmartCommands: (input: string): boolean => {
        const cmd = input.toLowerCase().trim();
        if (cmd === 'help') {
            console.log("[vibeService] help command detected. Triggering RESET_GUIDE.");
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
            return true;
        }
        return false;
    }
};
