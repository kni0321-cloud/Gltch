import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { NARRATIVE_CATALOG } from '../data/narrative_catalog'
import { NarrativeFragment } from '../data/narratives/types'
import { vibeService } from '../services/vibeService'
import { GAME_CONFIG } from '../config/gameConfig'
import celestialCatalog from '../data/celestial_catalog.json'

export interface VibeNode {
    id: string;
    type: string;
    labels: string[];
    oracle: string;
    hacking_guide?: string;
    rarity?: 'C-GRADE' | 'B-GRADE' | 'A-GRADE' | 'S-GRADE';
    shareable_token?: string;
    timestamp: number;
    frequency: number;   // Number of times scanned
    vibe_score: number;  // Accumulated energy
    status: 'STABLE' | 'PENDING' | 'GHOST_ECHO' | 'FADING';
    ritualStatus?: 'STABLE' | 'FADING' | 'RECALIBRATING';
    next_unlock_time: number; // Time until node can be opened
    readings?: {
        mythic: string;
        zen: string;
        quantum: string;
    };
    location?: { lat: number; lng: number };
    celestial_coords?: { ra: string; dec: string; starName: string }; // RA/Dec metadata
    entropyStatus?: 'STABLE' | 'CRITICAL';
    entropyMetadata?: { reason: string; time: number };
    content?: string; // For Ghost Echoes
    chainId?: string; // Task 3.2: Linked Puzzle Chain
}

export interface NarrativeEvent {
    day: number;
    object: string;
    vibe: string;
    labels?: string[];
    oracle?: string;
    timestamp: number;
}

export interface Connection {
    source: string;
    target: string;
    entanglement_score: number;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface StarProgress {
    currentStarId: string;
    vibeLevel: number; // Tiers: 1 (Planet), 2 (Solar System), 3 (Inner Galaxy), 4 (Galaxy Core)
}

export interface ActiveTask {
    id: string;
    nodeId: string;
    trigger: string;
    action: string;
    background: string;
    success: string;
    regret: string;
    remedy: string;
    status: 'PENDING' | 'COMPLETED' | 'MISSED' | 'CRITICAL_FAIL';
    timestamp: number;
}

export interface SettlementReport {
    date: string;
    nodesCount: number;
    vibeGained: number;
    starDistance: number; // Light years moved
    energyConsolidated: boolean;
    viralShareUrl?: string; // Destiny Daily share card
    entropyPenalty?: string; // Text for "Dead Hole" punishment
}

export type MissionStep = 'IDLE' | 'WEAVING' | 'ANCHORING';

export interface MissionState {
    step: MissionStep;
    targetNodeId: string | null;
}

interface GltchState {
    credits: number;
    maxCredits: number;
    vaultBets: { amount: number; unlockTime: number; chainId: string }[]; // Task 3.3: Betting Protocol
    vibeNodes: VibeNode[];
    connections: Connection[];
    isRefillModalOpen: boolean;
    referralId: string;
    globalRegistry: Record<string, string>; // starName -> userId (Global Sovereignty Lock)

    // Mission: Digital Soul Patch & Retention
    dialogueLog: Message[];
    celestialProgress: StarProgress;
    activeTasks: ActiveTask[];
    lastSettlementReport: SettlementReport | null;
    lastSettlementTime: number;
    cosmicEvent: 'NORMAL' | 'ENERGY_RED';
    lastSessionStatus: 'REBEL' | 'COMPLIANT' | 'NONE';
    lastScanTime: number;
    subscriptionStatus: 'FREE' | 'PLUS';
    calibrationLocks: Record<string, number>; // nodeId -> unlockTimestamp
    lastScannedNodeId: string | null;
    currentViewTaskId: string | null; // FLATTENED STATE
    missionState: MissionState;
    lastImpactSector: string | null;
    voidMode: boolean;
    isAuthorized: boolean; // Task 3: Auth Middleware

    // Sprint 7: Soul Rewrite
    rebelCount: number;
    // Phase 3: System Hardening
    stabilizeCount: number;
    consecutiveCollapses: number;
    // Task 3: Memory Half-Life (Refactor to Object Array)
    ghostFragments: { id: string; timestamp: number; narrativeId: string }[];
    seenNarratives: string[]; // Narrative Anti-Staleness Record
    dataShards: number;
    publicSecrets: { text: string; timestamp: number }[];
    unlockedMedals: string[];
    appAge: number; // Registration timestamp or days count
    sovereignty: number; // Sovereignty points from Sandbox anchoring
    entitiesCollapsed: number; // Task 2: Entity Collapse Counter
    lastSystemMessage: { text: string; id: number } | null; // Task 2: System Feedback
    unlockedSectors: string[];
    tutorialStatus: 'ACTIVE' | 'COMPLETED';

    // Oracle Progress (Persistence)
    oracleProgress: {
        taskId: string | null;
        step: number;
        rippleCount: number;
        ritualFeedback: 'SUCCESS' | 'FAILURE' | null;
    };

    // Sprint 5: Empire State
    narrativeStack: NarrativeEvent[];
    knowledgePoints: number;

    arroganceLockoutUntil: number; // Task 5: Global Arrogance Lockout
    // Actions
    triggerArroganceLockout: (duration: number) => void;
    consumeCredit: (amount?: number) => boolean;
    addVibeNode: (node: Omit<VibeNode, 'frequency' | 'status' | 'next_unlock_time' | 'readings' | 'vibe_score'> & { vibe_score?: number }) => void;
    setRefillModal: (isOpen: boolean) => void;
    resetCredits: () => void;
    hardReset: () => void;
    addCredits: (amount: number) => void;
    getReferralLink: () => string;
    addDialogue: (msg: Omit<Message, 'timestamp'>) => void;
    updateCelestial: (progress: Partial<StarProgress>) => void;
    completeTask: (taskId: string, success: boolean | 'SEVER') => void;
    claimSovereignty: (starName: string, userId: string, hijack?: boolean) => { success: boolean, message: string };
    checkDailySettlement: () => void;
    setCosmicEvent: (event: 'NORMAL' | 'ENERGY_RED') => void;
    setCalibrationLock: (nodeId: string) => void;
    setCurrentViewTaskId: (taskId: string | null) => void;

    // Sprint 5 Actions
    recordNarrativeEvent: (object: string, vibe: string, labels?: string[], oracle?: string) => void;
    generateGhostEchoes: (lat: number, lng: number) => void;
    setMissionState: (state: Partial<MissionState>) => void;
    stabilizeNode: (nodeId: string) => void;
    toggleVoidMode: () => void;

    // Oracle Progress Actions
    setOracleProgress: (progress: Partial<GltchState['oracleProgress']>) => void;
    clearOracleProgress: () => void;

    // Sovereignty Actions
    addSovereignty: (amount: number) => void;
    consumeGhostFragment: (nodeId: string) => void;
    addGhostFragment: (narrativeId?: string) => void; // Task 3: Helper Action
    reclaimMemory: (fragmentId: string) => void; // Task 4: Memory Rescue Ritual
    placeVaultBet: (amount: number, chainId: string) => void; // Task 3.3: Betting
    initialize: () => void; // Task 3: Auth Middleware
}

const getNextDay8AM = () => {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(8, 0, 0, 0);
    return next.getTime();
}

export const useStore = create<GltchState>()(
    persist(
        (set, get) => ({
            credits: 3,
            maxCredits: 3,
            vibeNodes: [],
            connections: [],
            isRefillModalOpen: false,
            referralId: 'USER_' + Math.random().toString(36).substring(7).toUpperCase(),
            globalRegistry: {},
            dialogueLog: [],
            celestialProgress: { currentStarId: 'star_001', vibeLevel: 1 },
            activeTasks: [],
            lastSettlementReport: null,
            lastSettlementTime: 0,
            cosmicEvent: 'NORMAL',
            lastSessionStatus: 'NONE',
            lastScanTime: Date.now(),
            subscriptionStatus: 'FREE',
            calibrationLocks: {},
            lastScannedNodeId: null,
            currentViewTaskId: null,
            missionState: { step: 'IDLE', targetNodeId: null },
            lastImpactSector: 'INITIALIZING_ETHER...', // NULL_SAFETY: Avoid raw NULL on Day 0
            voidMode: false,
            isAuthorized: false, // Default to unauthorized
            rebelCount: 0,
            // Phase 3: System Hardening Init
            stabilizeCount: 0,
            consecutiveCollapses: 0,
            ghostFragments: [], // Task 3: Init as Array
            seenNarratives: [],
            vaultBets: [],
            dataShards: 0,
            sovereignty: 0,
            // Task 2 & 3 Init
            entitiesCollapsed: 0,
            lastSystemMessage: null,
            unlockedSectors: ['SECTOR_001'],
            tutorialStatus: 'COMPLETED',
            oracleProgress: {
                taskId: null,
                step: 0,
                rippleCount: 0,
                ritualFeedback: null
            },
            publicSecrets: [
                { text: "...he lied about the ring.", timestamp: Date.now() - 100000 },
                { text: "...the silence in this room is heavy.", timestamp: Date.now() - 200000 },
                { text: "...waiting for a signal that never comes.", timestamp: Date.now() - 300000 }
            ],
            unlockedMedals: [],
            appAge: Date.now(),
            narrativeStack: [],
            knowledgePoints: 0,
            getReferralLink: () => `https://gltch.app/link?uid=${get().referralId}`,

            consumeCredit: (amount = 1) => {
                const current = get().credits;
                if (current >= amount) {
                    set({ credits: Number((current - amount).toFixed(2)) }); // Handle JS float precision
                    return true;
                }
                set({ isRefillModalOpen: true });
                return false;
            },

            recordNarrativeEvent: (object, vibe, labels, oracle) => set((state) => {
                const newEvent: NarrativeEvent = {
                    day: state.narrativeStack.length + 1,
                    object,
                    vibe,
                    labels,
                    oracle,
                    timestamp: Date.now()
                };
                const updatedStack = [...state.narrativeStack, newEvent];
                return { narrativeStack: updatedStack };
            }),

            generateGhostEchoes: (lat, lng) => set((state) => {
                // Avoid regenerating if we already have echoes
                if (state.vibeNodes.some(n => n.type === 'GHOST_ECHO')) return state;

                const ghostVibes = [
                    { tag: '#Love_Torn', content: "1998. Someone abandoned a wedding ring here. The magnetic field deviates by 15% due to localized sorrow." },
                    { tag: '#Anxiety_Residue', content: "2012. A developer collapsed here after midnight. The air still resonates with the frustration of undelivered code." },
                    { tag: '#Midnight_Manic', content: "2005. A celebration was abruptly terminated. The amplitude of joy is frozen within the concrete fractures." },
                    { tag: '#Anxiety_Level', content: "SYSTEM_SIGNAL: A nearby entity is experiencing high-frequency neural tremors. Do you wish to stabilize their shadow?" },
                    { tag: '#Fragmented_Soul', content: "UNAUTHORIZED_LINK: A fragment of User_082's memory has drifted into this sector. Scavenge for Chain_ID: ALPHA." }
                ];

                const newEchoes: VibeNode[] = Array.from({ length: 30 }).map((_, i) => {
                    const randomVibe = ghostVibes[Math.floor(Math.random() * ghostVibes.length)];
                    const isOtherSoul = randomVibe.tag.includes('Level') || randomVibe.tag.includes('Soul');

                    return {
                        id: `echo-${Math.random().toString(36).substring(7)}`,
                        type: 'GHOST_ECHO',
                        labels: [randomVibe.tag, isOtherSoul ? 'OTHER_SOUL' : 'ARCHIVE'],
                        oracle: isOtherSoul ? "OTHER_SOUL // Non-asymmetric signal detected." : "GHOST_ECHO // A temporal shadow of archived reality.",
                        content: randomVibe.content,
                        chainId: isOtherSoul ? 'CHAIN_ALPHA' : undefined,
                        timestamp: Date.now() - (Math.random() * 1000 * 60 * 60 * 24 * 365 * 10),
                        frequency: 1,
                        vibe_score: 10,
                        status: 'GHOST_ECHO',
                        next_unlock_time: 0,
                        location: {
                            lat: lat + (Math.random() - 0.5) * 0.01,
                            lng: lng + (Math.random() - 0.5) * 0.01
                        }
                    };
                });

                return { vibeNodes: [...state.vibeNodes, ...newEchoes] };
            }),

            setCosmicEvent: (event) => set({ cosmicEvent: event }),

            setCalibrationLock: (nodeId) => set((state) => ({
                calibrationLocks: {
                    ...state.calibrationLocks,
                    [nodeId]: Date.now() + (1000 * 60 * 60 * 14) // 14 hours lock
                }
            })),

            addDialogue: (msg) => set((state) => ({
                dialogueLog: [...state.dialogueLog, { ...msg, timestamp: Date.now() }]
            })),

            updateCelestial: (progress) => set((state) => ({
                celestialProgress: { ...state.celestialProgress, ...progress }
            })),

            addCredits: (amount) => set((state) => ({
                credits: state.credits + amount
            })),

            completeTask: (taskId, success) => set((state) => {
                const tasks = [...state.activeTasks];
                const idx = tasks.findIndex(t => t.id === taskId);
                if (idx === -1) {
                    console.error("[NULL_SAFETY_GUARD] completeTask called with invalid taskId:", taskId);
                    return state;
                }

                const isSevered = success === 'SEVER';
                const status = isSevered ? 'CRITICAL_FAIL' : (success ? 'COMPLETED' : 'MISSED');
                tasks[idx] = { ...tasks[idx], status };

                const feedback = isSevered ? "SIGNAL_SEVERED. ENTROPY_SPIKE_DETECTED." : (success ? tasks[idx].success : tasks[idx].regret);
                const dialogue = [...state.dialogueLog, { role: 'assistant' as const, content: feedback, timestamp: Date.now() }];

                if (success === true) {
                    state.addCredits(1);
                } else if (!isSevered) {
                    dialogue.push({ role: 'assistant' as const, content: `REMEDY_SUGGESTION: ${tasks[idx].remedy}`, timestamp: Date.now() });
                }

                const updatedNodes = state.vibeNodes.map(n => {
                    if (n.id === tasks[idx].nodeId) {
                        return {
                            ...n,
                            ritualStatus: success === true ? 'STABLE' : 'FADING',
                            entropyStatus: isSevered ? 'CRITICAL' : n.entropyStatus,
                            entropyMetadata: isSevered ? { reason: 'HEASITATION_SEVERANCE', time: Date.now() } : n.entropyMetadata
                        } as VibeNode;
                    }
                    return n;
                });

                return {
                    activeTasks: tasks,
                    dialogueLog: dialogue,
                    vibeNodes: updatedNodes,
                    lastSessionStatus: isSevered ? 'REBEL' : 'COMPLIANT',
                    missionState: isSevered ? state.missionState : { step: 'WEAVING', targetNodeId: tasks[idx].nodeId }
                };
            }),

            setMissionState: (newState) => set((state) => ({
                missionState: { ...state.missionState, ...newState }
            })),

            stabilizeNode: (nodeId) => set((state) => {
                const node = state.vibeNodes.find(n => n.id === nodeId);
                if (!node) {
                    console.error("[NULL_SAFETY_GUARD] stabilizeNode called with invalid nodeId:", nodeId);
                    return state;
                }
                const sectorName = node?.celestial_coords?.starName || 'THE_VOID_CORE';
                console.log(`[NULL_SAFETY_GUARD] Stabilizing Node: ${nodeId}, Sector: ${sectorName}`);
                return {
                    vibeNodes: state.vibeNodes.map(n => n.id === nodeId ? { ...n, ritualStatus: 'STABLE' } : n),
                    lastImpactSector: sectorName,
                    missionState: { step: 'IDLE', targetNodeId: null },
                    knowledgePoints: state.knowledgePoints + 10
                };
            }),

            toggleVoidMode: () => set((state) => ({ voidMode: !state.voidMode })),

            setOracleProgress: (progress) => set((state) => ({
                oracleProgress: { ...state.oracleProgress, ...progress }
            })),

            clearOracleProgress: () => set({
                oracleProgress: { taskId: null, step: 0, rippleCount: 0, ritualFeedback: null }
            }),

            addSovereignty: (amount) => set((state) => ({
                sovereignty: state.sovereignty + amount
            })),

            consumeGhostFragment: (nodeId) => set((state) => {
                if (state.ghostFragments.length <= 0) return state;

                // 防御性检查：防止对已稳定的节点重复消费
                const targetNode = state.vibeNodes.find(n => n.id === nodeId);
                if (!targetNode || targetNode.ritualStatus === 'STABLE') {
                    console.warn(`[STORE_GUARD] Attempted to stabilize valid/stable node: ${nodeId}`);
                    return state;
                }

                // Task 1: Gambler's Fallacy Protection (CMO Ultimatum)
                // Newbie Shield: First 3 attempts are safe.
                // PRD: If 2 consecutive collapses, 3rd is safe.

                const newStabilizeCount = (state.stabilizeCount || 0) + 1;
                const consecCollapses = state.consecutiveCollapses || 0;
                let isCollapse = false;

                // LOGIC: Newbie Shield
                if (newStabilizeCount <= 3) {
                    console.log(`[STORE_GUARD] Newbie Shield Active. Attempt ${newStabilizeCount}.`);
                    isCollapse = false;
                }
                // LOGIC: PRD Safety Valve
                else if (consecCollapses >= 2) {
                    console.log(`[STORE_GUARD] PRD Safety Valve Triggered. 2 Consecutive Collapses detected. Forcing success.`);
                    isCollapse = false;
                }
                // LOGIC: Standard Entropy (20% Chance)
                else {
                    isCollapse = Math.random() < 0.2;
                }

                let newNodes = [...state.vibeNodes];
                let collapseMessage = null;
                let newEntitiesCollapsed = state.entitiesCollapsed;
                let newConsecutiveCollapses = isCollapse ? consecCollapses + 1 : 0; // Reset on success

                if (isCollapse) {
                    newEntitiesCollapsed = state.entitiesCollapsed + 1; // Explicit number addition
                    const debrisId = `DEBRIS_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                    const offsetLat = (Math.random() - 0.5) * 0.01;
                    const offsetLng = (Math.random() - 0.5) * 0.01;

                    // Create Micro Debris
                    const debrisNode: VibeNode = {
                        id: debrisId,
                        type: 'SHADOW',
                        labels: ['DEBRIS', 'ENTROPY'],
                        oracle: 'COLLAPSED_MEMORY_FRAGMENT',
                        timestamp: Date.now(),
                        frequency: 1,
                        vibe_score: 5,
                        status: 'GHOST_ECHO',
                        ritualStatus: 'FADING',
                        next_unlock_time: Date.now(),
                        location: targetNode.location ? { lat: targetNode.location.lat + offsetLat, lng: targetNode.location.lng + offsetLng } : { lat: 0, lng: 0 },
                        x: (targetNode as any).x ? (targetNode as any).x + (Math.random() - 0.5) * 100 : window.innerWidth / 2,
                        y: (targetNode as any).y ? (targetNode as any).y + (Math.random() - 0.5) * 100 : window.innerHeight / 2,
                        vx: 0, vy: 0 // Physics init
                    } as any; // Cast to stay compatible with Sandbox physics extension if disjoint

                    newNodes.push(debrisNode);
                    collapseMessage = {
                        text: `Entity Collapsed. New debris detected in sector [${debrisId.slice(-4)}].`,
                        id: Date.now()
                    };
                }

                // Update Target Node
                newNodes = newNodes.map(n =>
                    n.id === nodeId
                        ? { ...n, ritualStatus: 'STABLE' as const, vibe_score: Math.min(n.vibe_score + 20, 100) }
                        : n
                );

                return {
                    vibeNodes: newNodes,
                    ghostFragments: state.ghostFragments.filter((_, i) => i !== 0), // FIFO
                    entitiesCollapsed: newEntitiesCollapsed,
                    lastSystemMessage: collapseMessage,
                    stabilizeCount: newStabilizeCount,
                    consecutiveCollapses: newConsecutiveCollapses,
                    sovereignty: state.sovereignty + 10
                };
            }),


            claimSovereignty: (starName, userId, hijack) => {
                const state = get();
                const existingOwner = state.globalRegistry[starName];

                if (existingOwner && existingOwner !== userId && !hijack) {
                    return {
                        success: false,
                        message: `Sector ${starName} is stabilized by architect ${existingOwner.slice(0, 6)}... You can only observe its resonance.`
                    };
                }

                if (existingOwner && hijack) {
                    set((state) => ({
                        globalRegistry: { ...state.globalRegistry, [starName]: `${userId}_PARASITE_ON_${existingOwner}` }
                    }));
                    return { success: true, message: `HIJACK_SUCCESSFUL. Parasitic monitor placed on ${starName}.` };
                }

                set((state) => ({
                    globalRegistry: { ...state.globalRegistry, [starName]: userId }
                }));
                return { success: true, message: `SOVEREIGNTY_CLAIMED. Sector ${starName} is now under your dominion.` };
            },

            checkDailySettlement: () => set((state) => {
                const now = new Date();
                const today8AM = new Date();
                today8AM.setHours(8, 0, 0, 0);

                // 1. Must be past 8 AM
                if (now.getTime() < today8AM.getTime()) return state;

                // 2. Must not have run today since 8 AM
                if (state.lastSettlementTime > today8AM.getTime()) return state;

                const pendingNodes = state.vibeNodes.filter(n => n.status === 'PENDING' && now.getTime() > n.next_unlock_time);
                const criticalNodes = state.vibeNodes.filter(n => n.entropyStatus === 'CRITICAL');

                if (pendingNodes.length === 0 && criticalNodes.length === 0) return state;

                let entropyPenalty = "";
                if (criticalNodes.length > 0) {
                    const node = criticalNodes[0];
                    const timeStr = new Date(node.entropyMetadata?.time || Date.now()).toLocaleTimeString();
                    entropyPenalty = `Due to your hesitation at ${timeStr}, the star in Sector ${node.celestial_coords?.starName || 'UNKNOWN'} has collapsed. Your energy pool has leaked 5%.`;
                }

                const updatedNodes = state.vibeNodes.map(n => {
                    if (n.status === 'PENDING' && now.getTime() > n.next_unlock_time) return { ...n, status: 'STABLE' as const };
                    if (n.entropyStatus === 'CRITICAL') return { ...n, entropyStatus: 'STABLE' as const, vibe_score: Math.max(n.vibe_score - 20, 0) };
                    return n;
                });

                const vibeGained = pendingNodes.length * 25 - criticalNodes.length * 15;
                const starDistance = Math.floor(vibeGained * 0.1);

                const report: SettlementReport = {
                    date: new Date().toLocaleDateString(),
                    nodesCount: pendingNodes.length,
                    vibeGained,
                    starDistance,
                    energyConsolidated: true,
                    entropyPenalty,
                    viralShareUrl: `https://gltch.app/settlement/${Date.now()}`
                };

                return {
                    vibeNodes: updatedNodes as any,
                    lastSettlementReport: report,
                    lastSettlementTime: Date.now()
                };
            }),

            addVibeNode: (newNode) => set((state) => {
                const existingNodeIdx = state.vibeNodes.findIndex(n => n.id === newNode.id);
                let updatedNodes = [...state.vibeNodes];
                let targetNode: VibeNode;
                const unlockTime = getNextDay8AM();
                const ternaryReadings = vibeService.getReadingsForLabels(newNode.labels);

                if (existingNodeIdx !== -1) {
                    const existing = updatedNodes[existingNodeIdx];
                    targetNode = {
                        ...existing,
                        frequency: existing.frequency + 1,
                        vibe_score: Math.min(existing.vibe_score + 15, 100),
                        oracle: newNode.oracle,
                        status: 'PENDING',
                        next_unlock_time: unlockTime,
                        readings: ternaryReadings,
                        rarity: (existing.vibe_score + 15) > 90 ? 'S-GRADE' : existing.rarity,
                        shareable_token: existing.shareable_token || btoa(existing.id + Date.now()).slice(0, 12)
                    };
                    updatedNodes[existingNodeIdx] = targetNode;
                } else {
                    const initialVibe = newNode.vibe_score || 20;
                    // Assign random celestial sector
                    const randomEntry = celestialCatalog[Math.floor(Math.random() * celestialCatalog.length)];
                    targetNode = {
                        ...newNode,
                        frequency: 1,
                        vibe_score: initialVibe,
                        status: 'PENDING',
                        next_unlock_time: unlockTime,
                        readings: ternaryReadings,
                        rarity: initialVibe > 90 ? 'S-GRADE' : 'A-GRADE',
                        shareable_token: btoa(newNode.id + Date.now()).slice(0, 12),
                        celestial_coords: {
                            ra: randomEntry.ra,
                            dec: randomEntry.dec,
                            starName: randomEntry.name
                        }
                    };
                    updatedNodes = [targetNode, ...updatedNodes];
                }

                // Record to Narrative Stack
                const primaryLabel = targetNode.labels[0] || 'UNKNOWN_ENTITY';
                get().recordNarrativeEvent(primaryLabel, 'NEUTRAL', targetNode.labels, targetNode.oracle);

                const newConnections: Connection[] = [...state.connections];
                updatedNodes.forEach(other => {
                    if (other.id === targetNode.id) return;
                    const sharedLabels = targetNode.labels.filter(t => other.labels.includes(t));

                    // Link if any labels match, or if both are recent (within 5 minutes)
                    const isThematicallyLinked = sharedLabels.length > 0;
                    const isTemporallyLinked = (Date.now() - other.timestamp) < (1000 * 60 * 5);

                    if (isThematicallyLinked || isTemporallyLinked) {
                        const entanglement = isThematicallyLinked ? (sharedLabels.length * 25) : 10;
                        const existingConnIdx = newConnections.findIndex(c =>
                            (c.source === targetNode.id && c.target === other.id) ||
                            (c.source === other.id && c.target === targetNode.id)
                        );
                        if (existingConnIdx !== -1) {
                            newConnections[existingConnIdx].entanglement_score = Math.min(newConnections[existingConnIdx].entanglement_score + 15, 100);
                        } else {
                            newConnections.push({
                                source: targetNode.id,
                                target: other.id,
                                entanglement_score: Math.min(entanglement, 100)
                            });
                        }
                    }
                });

                const script = vibeService.getTaskForLabels(targetNode.labels);
                let updatedTasks = [...state.activeTasks];
                if (script) {
                    const newTask: ActiveTask = {
                        id: Math.random().toString(36).substring(7),
                        nodeId: targetNode.id,
                        trigger: script.trigger,
                        action: script.task,
                        background: script.origin,
                        success: script.success,
                        regret: script.regret,
                        remedy: "SEVER_SIGNAL_TO_RETRY",
                        status: 'PENDING',
                        timestamp: Date.now()
                    };
                    updatedTasks = [newTask, ...updatedTasks];
                }

                return {
                    vibeNodes: updatedNodes,
                    connections: newConnections,
                    activeTasks: updatedTasks,
                    lastScanTime: Date.now(),
                    lastScannedNodeId: targetNode.id
                };
            }),

            setRefillModal: (isOpen) => set({ isRefillModalOpen: isOpen }),

            resetCredits: () => set({ credits: 3 }),

            setCurrentViewTaskId: (taskId) => set({ currentViewTaskId: taskId }),

            hardReset: () => {
                console.log("[STORE_PURGE] Hard Reset Executed. Cleaning all tasks and mission states.");
                localStorage.removeItem('gltch-v3-final'); // Direct storage wipe
                set({
                    activeTasks: [],
                    missionState: { step: 'IDLE', targetNodeId: null },
                    lastSessionStatus: 'NONE',
                    vibeNodes: [],
                    dialogueLog: [],
                    lastSettlementTime: Date.now(), // Suppress immediate settlement popup
                    lastSettlementReport: null,
                    currentViewTaskId: null
                });
            },

            addGhostFragment: (narrativeId) => set((state) => {
                console.log("[STORE_AUDIT] addGhostFragment triggered. Requested ID:", narrativeId);

                let selectedId = narrativeId;

                if (!selectedId) {
                    const isRedMode = state.cosmicEvent === 'ENERGY_RED';
                    const sovereignty = state.sovereignty;

                    console.log(`[STORE_AUDIT] Filtering Narratives. Sovereignty: ${sovereignty}, RedMode: ${isRedMode}`);

                    const availableIds = NARRATIVE_CATALOG.filter((n: any) => {
                        if (n.tier === 3) return isRedMode;
                        if (n.tier === 2) return sovereignty > 50;
                        return true;
                    }).map(n => n.id);

                    console.log(`[STORE_AUDIT] Available Pool Size: ${availableIds.length}`);

                    const unseenIds = availableIds.filter(id => !state.seenNarratives.includes(id));
                    console.log(`[STORE_AUDIT] Unseen Pool Size: ${unseenIds.length}`);

                    if (unseenIds.length > 0) {
                        selectedId = unseenIds[Math.floor(Math.random() * unseenIds.length)];
                        console.log(`[STORE_AUDIT] Selected from Unseen: ${selectedId}`);
                    } else if (availableIds.length > 0) {
                        selectedId = availableIds[Math.floor(Math.random() * availableIds.length)];
                        console.log(`[STORE_AUDIT] Pool exhausted. Reshuffling. Selected: ${selectedId}`);
                    } else {
                        // [AUDIT CHECKPOINT: NO MEDIOCRITY]
                        // 拒绝随机兜底，强制指向叙事奇点 T1_001
                        selectedId = 'T1_001';
                        console.error(`[STORE_AUDIT] FATAL: Available pool empty! Sovereignty or Mode mismatch. Forcing narrative singularity: ${selectedId}`);
                    }
                }

                if (!selectedId) {
                    console.error("[STORE_AUDIT] CRITICAL: No narrative selected. Action aborted.");
                    return state;
                }

                const fragment = {
                    id: Date.now().toString(),
                    timestamp: Date.now(),
                    narrativeId: selectedId
                };

                // Add to seen list if unique
                const newSeen = state.seenNarratives.includes(selectedId)
                    ? state.seenNarratives
                    : [...state.seenNarratives, selectedId];

                return {
                    ghostFragments: [...state.ghostFragments, fragment],
                    seenNarratives: newSeen,
                    lastSystemMessage: { text: "Ghost Fragment Anchored.", id: Date.now() }
                };
            }),

            reclaimMemory: (fragmentId) => set((state) => {
                const fragmentIndex = state.ghostFragments.findIndex(f => f.id === fragmentId);
                if (fragmentIndex === -1) return {};

                // Check cost
                if (state.credits < GAME_CONFIG.MEMORY_RESCUE_COST) {
                    return { isRefillModalOpen: true };
                }

                const updatedFragments = [...state.ghostFragments];
                updatedFragments[fragmentIndex] = {
                    ...updatedFragments[fragmentIndex],
                    timestamp: Date.now(), // Reset timestamp (Rescue)
                };

                return {
                    ghostFragments: updatedFragments,
                    credits: state.credits - GAME_CONFIG.MEMORY_RESCUE_COST,
                    lastSystemMessage: { text: "Memory Rescued from Void.", id: Date.now() }
                };
            }),

            arroganceLockoutUntil: 0,

            triggerArroganceLockout: (duration) => set({
                arroganceLockoutUntil: Date.now() + duration
            }),

            placeVaultBet: (amount, chainId) => set((state) => {
                if (state.credits < amount) return { isRefillModalOpen: true };

                const newBet = {
                    amount,
                    unlockTime: Date.now() + (1000 * 60 * 60 * 24), // 24H Reveal
                    chainId
                };

                return {
                    credits: state.credits - amount,
                    vaultBets: [...state.vaultBets, newBet],
                    lastSystemMessage: { text: `Bet Locked: ${amount}¢ staked on ${chainId}.`, id: Date.now() }
                };
            }),

            initialize: () => {
                const inviteCode = localStorage.getItem('gltch_invite_code');
                const isAuthorized = !!inviteCode;
                set({ isAuthorized });
                if (!isAuthorized) {
                    console.log('[AUTH_GUARD] unauthorized access detected.');
                    set({
                        vibeNodes: [],
                        narrativeStack: [],
                        ghostFragments: [],
                        publicSecrets: []
                    });
                } else {
                    console.log('[AUTH_GUARD] Access granted.');
                }
            }
        }),
        {
            name: 'gltch-v3-final',
            version: 2, // Bump version to force migrate
            migrate: (persistedState: any, version) => {
                if (version < 2) {
                    console.log("[MIGRATION] Purging legacy tasks to fix Abyss Loop.");
                    return {
                        ...persistedState,
                        activeTasks: [],
                        missionState: { step: 'IDLE', targetNodeId: null }
                    };
                }
                return persistedState;
            },
            partialize: (state) => ({
                vibeNodes: state.vibeNodes,
                connections: state.connections,
                dialogueLog: state.dialogueLog,
                knowledgePoints: state.knowledgePoints,
                credits: state.credits,
                dataShards: state.dataShards,
                missionState: state.missionState,
                tutorialStatus: state.tutorialStatus,
                publicSecrets: state.publicSecrets,
                unlockedSectors: state.unlockedSectors,
                calibrationLocks: state.calibrationLocks,
                // Critical Persistence for Network Audit
                oracleProgress: state.oracleProgress,
                sovereignty: state.sovereignty,
                ghostFragments: state.ghostFragments,
                seenNarratives: state.seenNarratives,
                vaultBets: state.vaultBets,
                rebelCount: state.rebelCount,
                cosmicEvent: state.cosmicEvent,
                lastImpactSector: state.lastImpactSector
            }),
        }
    )
)
