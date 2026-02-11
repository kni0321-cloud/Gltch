import { NarrativeFragment } from './types';

// Cache for loaded fragments
let narrativeCache: NarrativeFragment[] = [];

export const loadAllNarratives = async (): Promise<NarrativeFragment[]> => {
    if (narrativeCache.length > 0) return narrativeCache;

    // Simulate network delay or chunk loading verify
    console.log('[LAZY_LOAD] Fetching narrative chunks...');

    // Dynamic Imports (Chunk Splitting)
    const [coreModule, generatedModule] = await Promise.all([
        import('./core_data'),
        import('./generated_data')
    ]);

    narrativeCache = [
        ...coreModule.CORE_NARRATIVES,
        ...generatedModule.GENERATED_NARRATIVES
    ];

    console.log(`[LAZY_LOAD] Loaded ${narrativeCache.length} narratives.`);
    return narrativeCache;
};

export const getNarrativeById = async (id: string): Promise<NarrativeFragment | undefined> => {
    const narratives = await loadAllNarratives();
    return narratives.find(n => n.id === id);
};

export const getNarrativeByTag = async (input: string): Promise<NarrativeFragment | undefined> => {
    const narratives = await loadAllNarratives();
    const upperInput = input.toUpperCase();
    return narratives.find(n => n.tags.some(t => upperInput.includes(t)));
};

// Re-export type for convenience
export type { NarrativeFragment } from './types';
