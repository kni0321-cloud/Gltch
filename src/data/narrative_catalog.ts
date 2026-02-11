/** 
 * GLTCH NARRATIVE CATALOG V2.1
 * REDIRECTOR MODULE
 */

import { GENERATED_NARRATIVES } from './narratives/generated_data';
import { CORE_NARRATIVES } from './narratives/core_data';
import { NarrativeFragment } from './narratives/types';

// Combine all handcrafted soul-fragments
export const NARRATIVE_CATALOG: NarrativeFragment[] = [
    ...CORE_NARRATIVES,
    ...GENERATED_NARRATIVES
];

/** @deprecated Use async getNarrativeByTag from '../data/narratives' */
export const getNarrativeByTagSync = (input: string): NarrativeFragment | undefined => {
    const upperInput = input.toUpperCase();
    return NARRATIVE_CATALOG.find(n => n.tags.some((t: any) => upperInput.includes(t)));
};

// Re-export async versions from the new module to maintain compatibility but shift to async
export { getNarrativeById, getNarrativeByTag, loadAllNarratives } from './narratives/index';
export type { NarrativeFragment } from './narratives/types';
