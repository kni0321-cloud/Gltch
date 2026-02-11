import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { Observer, Body, Equator } from 'astronomy-engine'
import { GALAXY_MAP } from '../data/planet_path'
import { aiService } from '../services/aiService'
import { getNarrativeById, NarrativeFragment, NARRATIVE_CATALOG } from '../data/narrative_catalog'
import { GAME_CONFIG } from '../config/gameConfig'
import { PuzzleBoard } from '../components/PuzzleBoard'

const MemoryFragmentItem = ({ fragment }: { fragment: any }) => {
    const [story, setStory] = useState<NarrativeFragment | null>(null);
    const { rebelCount, credits } = useStore();

    useEffect(() => {
        let isCancelled = false;
        const load = async () => {
            const n = await getNarrativeById(fragment.narrativeId);
            if (!isCancelled) setStory(n || null);
        };
        load();
        return () => { isCancelled = true; };
    }, [fragment.narrativeId]);

    const ageMs = Date.now() - fragment.timestamp;
    const hours = ageMs / (1000 * 60 * 60);
    const isDecayed = hours > 24;
    const isGlitching = hours > 12;

    if (!story) return <div className="p-3 border border-white/10 opacity-50 animate-pulse text-[8px] text-primary">LOADING_MEMORY_SHARD...</div>;

    const content = rebelCount >= story.rebel_threshold ? story.content_corrupted : story.content_stable;
    const isDev = import.meta.env.MODE === 'development';

    return (
        <div className="p-3 border border-white/10 bg-black/40 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className={`text-[8px] tracking-widest font-black uppercase ${isDecayed ? 'text-red-900 line-through' : 'text-primary'}`}>
                    {isDecayed ? 'VOID_CLAIMED' : `FRAG_${fragment.id.slice(-6)}`}
                </span>
                <span className="text-[6px] text-white/30">{isDev ? hours.toFixed(2) + 'H' : ''}</span>
            </div>
            {/* Task 4: Memory Rescue Ritual */}
            {isGlitching && !isDecayed && (
                <button
                    onClick={() => {
                        useStore.getState().reclaimMemory(fragment.id);
                    }}
                    disabled={credits < GAME_CONFIG.MEMORY_RESCUE_COST}
                    className={`text-[7px] tracking-widest uppercase font-black mt-1 transition-colors ${credits < GAME_CONFIG.MEMORY_RESCUE_COST ? 'text-white/20 cursor-not-allowed' : 'text-primary hover:text-white'}`}
                >
                    [ RECLAIM_VOID (-{GAME_CONFIG.MEMORY_RESCUE_COST}¢) ]
                </button>
            )}
            <p className={`text-[8px] leading-relaxed break-words whitespace-pre-wrap ${isDecayed ? 'text-white/10 blur-[1px]' : isGlitching ? 'text-white/60 glitch-text' : 'text-white/80'}`}>
                {isDecayed ? "Memory Decayed into Void." : (isGlitching ? content.split('').map(c => Math.random() > 0.7 ? '█' : c).join('') : content)}
            </p>
        </div>
    );
};

const MePage = ({ onNavigate }: { onNavigate: (page: string, id?: string) => void }) => {
    const { vibeNodes, celestialProgress, updateCelestial, voidMode, toggleVoidMode, ghostFragments, dataShards, unlockedMedals } = useStore()
    const [isJumping, setIsJumping] = useState(false)
    const [viewMode, setViewMode] = useState<'galaxy' | 'planet' | 'codex'>('galaxy')
    const [showImpactDrawer, setShowImpactDrawer] = useState(false)
    const [lockedResourceMsg, setLockedResourceMsg] = useState<string | null>(null);
    const [logText, setLogText] = useState("");
    const [cosmicWeather, setCosmicWeather] = useState({ mercury: 'DIRECT', venus: 'DIRECT', mars: 'DIRECT' });
    const [ephemeris, setEphemeris] = useState<{ body: string, deg: number, min: number, sign: string }[]>([]);
    const [lastActionTime, setLastActionTime] = useState(Date.now());

    // Puzzle State
    const [showPuzzle, setShowPuzzle] = useState(false);
    const [showRitualToast, setShowRitualToast] = useState(false);

    // Trigger Yellow Alert if enough fragments
    useEffect(() => {
        if (ghostFragments.length >= 4 && !showPuzzle) {
            setShowRitualToast(true);
        }
    }, [ghostFragments.length, showPuzzle]);

    // Derived User State
    const stableNodes = vibeNodes.filter(n => n.ritualStatus === 'STABLE').length
    const totalVibe = vibeNodes.reduce((acc, n) => acc + n.vibe_score, 0)
    const starIndex = Math.floor(((totalVibe + stableNodes * 50) * 7) % GALAXY_MAP.length)
    const currentStar = GALAXY_MAP[starIndex] || GALAXY_MAP[0]

    useEffect(() => {
        // Hardcore Astronomy Logic
        const date = new Date();
        const obs = new Observer(0, 0, 0); // Reference observer

        const bodies = [Body.Sun, Body.Moon, Body.Mercury, Body.Venus, Body.Mars];
        const signs = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

        const data = bodies.map(b => {
            const equ = Equator(b, date, obs, true, true);
            const lon = equ.ra * 15; // Rough approximation for ecliptic
            const signIdx = Math.floor(lon / 30) % 12;
            const deg = Math.floor(lon % 30);
            const min = Math.floor((lon % 1) * 60);
            return { body: Body[b], deg, min, sign: signs[signIdx] };
        });
        setEphemeris(data);

        // Mock Cosmic Weather Logic
        const transits = ['DIRECT', 'RETROGRADE', 'STATIONARY'];
        setCosmicWeather({
            mercury: transits[Math.floor(Math.random() * 3)],
            venus: transits[Math.floor(Math.random() * 3)],
            mars: transits[Math.floor(Math.random() * 3)]
        });

        // Auto-update tier based on total vibe
        const newTier = totalVibe > 500 ? 4 : totalVibe > 300 ? 3 : totalVibe > 100 ? 2 : 1
        if (newTier !== celestialProgress.vibeLevel) {
            updateCelestial({ vibeLevel: newTier, currentStarId: currentStar.id })
        }

        // Detect ?trigger=new_insight
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('trigger') === 'new_insight') {
            setShowImpactDrawer(true)
            // Clear the param without refresh
            const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname
            window.history.pushState({ path: newurl }, '', newurl)
        }
    }, [totalVibe])

    const handleStarJump = () => {
        setIsJumping(true)
        setTimeout(() => {
            setViewMode(viewMode === 'galaxy' ? 'planet' : 'galaxy')
            setIsJumping(false)
        }, 1500)
    }

    const handleDailyLog = async () => {
        setLastActionTime(Date.now());
        if (!logText.trim()) return;

        // Anti-Spam Check
        const now = Date.now();
        queryTimestamps.current = [...queryTimestamps.current, now].filter(t => now - t < 30000); // 30s window
        if (queryTimestamps.current.length >= 15) {
            triggerArroganceLockout(15000); // 15s Lockout
            return;
        }

        // Action A: Credit Check & Deduction (0.1 Credits)
        const canAfford = useStore.getState().consumeCredit(0.1);
        if (!canAfford) return;

        // Add user message to log immediately
        useStore.getState().addDialogue({ role: 'user', content: logText });
        const currentInput = logText;
        setLogText("");

        // Action B: Fetch AI Prophet response
        const response = await aiService.analyze({ text: currentInput, persona: 'ME' });
        useStore.getState().addDialogue({ role: 'assistant', content: response.oracle_text });
    };

    // Dialogue Display Component (Typewriter-ish)
    const DialogueLog = () => {
        const { dialogueLog } = useStore();
        return (
            <div className={`mt-4 space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar transition-all ${dialogueLog.length === 0 ? 'opacity-0 h-0' : 'opacity-100'}`}>
                {dialogueLog.slice(-5).map((msg, i) => (
                    <motion.div
                        key={msg.timestamp + i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 border ${msg.role === 'user' ? 'border-white/10 bg-white/5 ml-4' : 'border-primary/20 bg-primary/5 mr-4'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-[6px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-white/40' : 'text-primary'}`}>
                                {msg.role === 'user' ? 'ARCHITECT' : 'PROPHET_V1.2'}
                            </span>
                            <span className="text-[5px] text-white/20 font-mono">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>
                        <p className={`text-[9px] leading-relaxed ${msg.role === 'user' ? 'text-white/60' : 'text-white/90 font-bold'}`}>
                            {msg.content}
                        </p>
                    </motion.div>
                ))}
            </div>
        );
    };

    // Anti-Idling Intervention
    useEffect(() => {
        const interval = setInterval(() => {
            if (Date.now() - lastActionTime > 12000 && viewMode === 'galaxy') {
                setLockedResourceMsg("Are you waiting for permission? The Archive is open.");
                setLastActionTime(Date.now());
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastActionTime, viewMode]);

    // Arrogance Mode: Anti-Spam
    const queryTimestamps = useRef<number[]>([]);
    const { arroganceLockoutUntil, triggerArroganceLockout } = useStore();

    useEffect(() => {
        if (Date.now() < arroganceLockoutUntil) {
            // Force re-render if locked
        }
    }, [arroganceLockoutUntil]);

    const isVoidTired = Date.now() < arroganceLockoutUntil;

    if (isVoidTired) {
        return (
            <div className="flex flex-col h-screen bg-black items-center justify-center font-mono cursor-not-allowed z-[9999] relative">
                <h1 className="text-white text-xs tracking-[0.5em] uppercase font-black animate-pulse">
                    The Void is tired.
                </h1>
                <p className="text-white/20 text-[8px] mt-4 tracking-widest">
                    ARROGANCE_DETECTED // SILENCE_ENFORCED
                </p>
                <p className="text-danger/40 text-[6px] mt-8 font-mono">
                    UNLOCK_IN: {Math.ceil((arroganceLockoutUntil - Date.now()) / 1000)}s
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-black font-mono overflow-hidden relative" onPointerDown={() => setLastActionTime(Date.now())}>
            {/* Star Jump Transition Overlay */}
            <AnimatePresence>
                {isJumping && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 10, filter: 'blur(20px)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "circIn" }}
                        className="absolute inset-0 z-[100] bg-white pointer-events-none mix-blend-screen"
                    />
                )}
            </AnimatePresence>

            <header className="px-6 pt-14 pb-4 z-[110] relative">
                {/* Real-time Ephemeris Clock (Astro-Core Dashboard) */}
                <div className="mb-4 grid grid-cols-3 gap-2 py-2 border-b border-primary/10">
                    {ephemeris.slice(2, 5).map(e => {
                        const bodyName = e.body.toLowerCase();
                        const isRetrograde = (cosmicWeather as any)[bodyName] === 'RETROGRADE';
                        return (
                            <div key={e.body} className={`flex flex-col gap-1 p-2 border ${isRetrograde ? 'border-danger bg-danger/10 animate-pulse' : 'border-primary/20 bg-primary/5'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`${isRetrograde ? 'text-danger' : 'text-primary'} text-[7px] font-black`}>{e.body.toUpperCase()}</span>
                                    {isRetrograde && <span className="material-symbols-outlined text-danger text-[10px]">warning</span>}
                                </div>
                                <span className="text-white text-[10px] font-mono font-bold">{e.sign} {e.deg}°</span>
                                <span className={`text-[6px] font-black ${isRetrograde ? 'text-danger' : 'text-primary/40'}`}>
                                    {isRetrograde ? '!!! RETROGRADE !!!' : 'STABLE_DIRECT'}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-primary text-[11px] tracking-[0.6em] font-black uppercase">The_Ascendant</h1>
                        <p className="text-white/30 text-[8px] tracking-[0.2em] mt-1 uppercase">SOUL_RANK: TIER_{celestialProgress.vibeLevel} // XP: {useStore.getState().knowledgePoints}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setViewMode(viewMode === 'codex' ? 'galaxy' : 'codex')}
                            className={`w-10 h-10 border flex items-center justify-center transition-all ${viewMode === 'codex' ? 'bg-primary text-black border-primary' : 'bg-primary/5 text-primary border-primary/20'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{viewMode === 'codex' ? 'close' : 'menu_book'}</span>
                        </button>
                        <button
                            onClick={toggleVoidMode}
                            className={`w-10 h-10 border flex flex-col items-center justify-center transition-all ${voidMode ? 'bg-danger/20 border-danger text-danger' : 'bg-primary/5 border-primary/20 text-primary/40'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{voidMode ? 'notifications_off' : 'notifications'}</span>
                            <span className="text-[6px] font-black">{voidMode ? 'VOID' : 'LIVE'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col relative overflow-y-auto w-full">
                {/* Codex View (Overlay) */}
                <AnimatePresence>
                    {viewMode === 'codex' && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-xl p-6 flex flex-col overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-8 border-b border-primary/20 pb-4">
                                <h2 className="text-primary text-sm font-black tracking-[0.4em] uppercase">The_Codex</h2>
                                <button
                                    onClick={() => setViewMode('galaxy')}
                                    className="w-8 h-8 flex items-center justify-center border border-primary/20 hover:bg-primary/10 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-primary text-sm">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {vibeNodes.map((node) => {
                                    const isSGrade = node.rarity === 'S-GRADE';
                                    return (
                                        <div key={node.id} className={`aspect-[3/4] border p-3 flex flex-col relative group overflow-hidden ${isSGrade ? 's-grade-glow border-[#FFD700] bg-gradient-to-br from-[#FFD700]/10 to-primary/10' : 'border-primary/20 bg-primary/5'
                                            }`}>
                                            {/* S-Grade Medal Badge */}
                                            {isSGrade && (
                                                <div className="absolute -top-1 -right-1 w-10 h-10 flex items-center justify-center rotate-12 shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                                                    style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #FFD700 100%)' }}>
                                                    <span className="text-[14px] font-black text-black" style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.4)' }}>S</span>
                                                </div>
                                            )}
                                            {/* Vibe Score */}
                                            {!isSGrade && (
                                                <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 flex items-center justify-center">
                                                    <span className="text-[8px] font-black text-primary/60">{node.vibe_score}</span>
                                                </div>
                                            )}
                                            <div className={`text-[9px] font-black tracking-widest uppercase mb-2 truncate ${isSGrade ? 'text-[#FFD700] pr-8' : 'text-primary pr-6'
                                                }`}>{node.labels[0]}</div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[8px] text-white/60 leading-tight italic line-clamp-6">
                                                    {node.oracle}
                                                </p>
                                            </div>
                                            <div className="mt-auto flex flex-wrap gap-1">
                                                {node.labels.slice(1, 3).map(l => (
                                                    <span key={l} className="text-[6px] text-primary/40 uppercase">#{l}</span>
                                                ))}
                                            </div>
                                            {/* Glitch Overlay on Hover */}
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center ${isSGrade ? 'bg-[#FFD700]/20' : 'bg-primary/20'
                                                }`}>
                                                <span className="text-[8px] font-black tracking-[0.5em] text-white uppercase text-center px-2">SYNC_CORE</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {vibeNodes.length === 0 && (
                                    <div className="col-span-2 py-20 text-center">
                                        <p className="text-white/20 text-[10px] tracking-widest uppercase font-black">No_Knowledge_Detected</p>
                                    </div>
                                )}
                            </div>

                            {/* Vault Resources (Visual Guidance) */}
                            <div className="mt-12 space-y-6">
                                <h3 className="text-primary text-[8px] font-black tracking-[0.4em] uppercase">Archive_Vaults</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Data Shards Vault */}
                                    <div
                                        onClick={() => {
                                            if (dataShards < 10) setLockedResourceMsg("Your data coherence is too low. Collect 10 Data Shards in Sandbox to unlock this vault.");
                                        }}
                                        className={`p-4 border border-white/10 relative group cursor-pointer ${dataShards >= 10 ? 'border-primary/40 bg-primary/5' : 'opacity-40'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[7px] text-white/60 uppercase">Data_Shards</span>
                                            <span className="material-symbols-outlined text-[14px] text-white/40">{dataShards >= 10 ? 'lock_open' : 'lock'}</span>
                                        </div>
                                        <div className="text-lg text-white font-black">{dataShards}/10</div>
                                        {lockedResourceMsg && (
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-12 left-0 w-48 bg-black border border-primary p-2 text-[6px] text-primary z-50">
                                                {lockedResourceMsg}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Ghost Fragments Vault */}
                                    <div
                                        onClick={() => {
                                            // Click to toggle view (future)
                                        }}
                                        className={`p-4 border border-white/10 relative group cursor-pointer ${ghostFragments.length >= 0 ? 'border-primary/40 bg-primary/5' : 'opacity-40'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[7px] text-white/60 uppercase">Ghost_Fragments</span>
                                            <span className="material-symbols-outlined text-[14px] text-white/40">{ghostFragments.length >= 5 ? 'lock_open' : 'lock'}</span>
                                        </div>
                                        <div className="text-lg text-white font-black">{ghostFragments.length} / ∞</div>
                                    </div>
                                </div>

                                {/* The Codex (55 Handcrafted Narratives) */}
                                <div className="space-y-4 pt-8 border-t border-primary/10">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">The_Codex_Registry</h3>
                                        <span className="text-[8px] text-white/30 font-mono">{useStore.getState().seenNarratives.length} / 55 UNLOCKED</span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {NARRATIVE_CATALOG.map((story, idx) => {
                                            const isUnlocked = useStore.getState().seenNarratives.includes(story.id);
                                            return (
                                                <div
                                                    key={story.id}
                                                    onClick={() => {
                                                        if (!isUnlocked) setLockedResourceMsg(`Fragment [${story.id}] is still buried in the void. Explore Sandbox to anchor it.`);
                                                    }}
                                                    className={`aspect-square border flex items-center justify-center relative cursor-help
                                                        ${isUnlocked ? 'border-primary bg-primary/20' : 'border-white/5 bg-white/5 opacity-40'}`}
                                                >
                                                    <span className={`text-[10px] font-black ${isUnlocked ? 'text-white' : 'text-white/20'}`}>{idx + 1}</span>
                                                    {isUnlocked && <div className="absolute inset-0 bg-primary/10 animate-pulse" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Active Memories List */}
                                <div className="space-y-3 pt-8">
                                    <h3 className="text-primary text-[8px] font-black tracking-[0.4em] uppercase">Active_Synapse_Fragments</h3>
                                    {ghostFragments.map(frag => (
                                        <MemoryFragmentItem key={frag.id} fragment={frag} />
                                    ))}
                                    {ghostFragments.length === 0 && (
                                        <div className="p-4 border border-white/5 border-dashed text-center">
                                            <span className="text-[6px] text-white/20 uppercase tracking-widest">NO_MEMORY_FRAGMENTS_ANCHORED</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Galaxy View */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                    <motion.div
                        animate={viewMode === 'galaxy' ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 4, rotate: 45, opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="relative w-full aspect-square"
                    >
                        {/* SVG Galaxy Map */}
                        <svg viewBox="0 0 400 400" className="w-full h-full opacity-60">
                            {/* Spiral Arms (Procedural) */}
                            {[0, 120, 240].map(rot => (
                                <g key={rot} transform={`rotate(${rot} 200 200)`}>
                                    <motion.path
                                        animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 5, repeat: Infinity }}
                                        d="M200,200 Q250,150 350,200" fill="none" stroke="#BF00FF" strokeWidth="0.5" strokeDasharray="2,4"
                                    />
                                </g>
                            ))}
                            {/* Stars */}
                            {GALAXY_MAP.filter((_, i) => i % 10 === 0).map((star, i) => (
                                <circle
                                    key={star.id}
                                    cx={star.coords.x} cy={star.coords.y}
                                    r={i === starIndex / 10 ? 2 : 0.5}
                                    fill={i === starIndex / 10 ? '#BF00FF' : 'white'}
                                    className={i === starIndex / 10 ? 'animate-pulse' : ''}
                                />
                            ))}
                        </svg>

                        {/* User Beacon */}
                        <div
                            className="absolute w-4 h-4 border border-primary rotate-45 flex items-center justify-center animate-ping"
                            style={{ left: `${(currentStar.coords.x / 400) * 100}%`, top: `${(currentStar.coords.y / 400) * 100}%` }}
                        />
                    </motion.div>

                    {/* Planet View (Deep Dive) */}
                    <AnimatePresence>
                        {viewMode === 'planet' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.2 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 2 }}
                                className="absolute inset-0 flex flex-col items-center justify-center p-12"
                            >
                                <div className="w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(191,0,255,0.4)_0%,rgba(0,0,0,0.8)_80%)] border border-primary/20 relative flex items-center justify-center overflow-hidden">
                                    <motion.div
                                        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 opacity-40 mix-blend-overlay"
                                        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", backgroundSize: '200%' }}
                                    />
                                    <span className="material-symbols-outlined text-primary text-6xl opacity-20">language</span>

                                    {/* Constellation Dialogue Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-[10px] text-primary text-center leading-relaxed font-black tracking-widest uppercase">
                                            "Your essence resonates with {currentStar.name}. {celestialProgress.vibeLevel > 2 ? 'The core is calling.' : 'The rim is still cold, but your signal is strengthening.'}"
                                        </p>
                                    </div>
                                </div>
                                <h2 className="text-white text-xl tracking-[0.4em] font-black mt-8 uppercase">{currentStar.name}</h2>
                                <p className="text-white/40 text-[10px] text-center mt-4 tracking-widest max-w-xs">{currentStar.description}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Destiny Daily & Sovereignty (Scrollable Section) */}
                    <div className="absolute bottom-32 left-0 right-0 px-6 flex flex-col gap-4 pointer-events-none">
                        {useStore.getState().lastSettlementReport && (
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="p-4 bg-primary/10 border-l-2 border-primary backdrop-blur-md pointer-events-auto"
                            >
                                <div className="text-[8px] text-primary font-black tracking-[0.4em] mb-1 uppercase">DESTINY_DAILY // {useStore.getState().lastSettlementReport?.date}</div>
                                <div className="text-[12px] text-white font-mono uppercase mb-2">Vibe Consolidated: +{useStore.getState().lastSettlementReport?.vibeGained}</div>
                                {useStore.getState().lastSettlementReport?.entropyPenalty && (
                                    <div className="text-[8px] text-red-500 font-black animate-pulse uppercase leading-tight">
                                        {useStore.getState().lastSettlementReport?.entropyPenalty}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Sovereignty Certificates */}
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar pointer-events-auto">
                            {Object.entries(useStore.getState().globalRegistry)
                                .filter(([_, owner]) => owner.includes('USER_001'))
                                .map(([star, owner]) => (
                                    <div key={star} className="flex-shrink-0 w-32 p-2 border border-primary/30 bg-black/80 backdrop-blur-sm flex flex-col items-center">
                                        <span className="text-[6px] text-primary/60 font-black tracking-widest uppercase">SOVEREIGNTY</span>
                                        <span className="text-[9px] text-white font-black truncate w-full text-center mt-1">{star}</span>
                                        <div className="w-full h-[1px] bg-primary/20 my-1" />
                                        <span className="text-[6px] text-primary tracking-tighter">{owner.includes('PARASITE') ? 'PARASITIC_MONITOR' : 'ARCHITECT'}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Energy Interface */}
                <div className="px-8 pb-12 flex flex-col gap-6">
                    {/* Cosmic Weather Section */}
                    <div className="p-4 border border-primary/20 bg-primary/5">
                        <h3 className="text-primary text-[8px] font-black tracking-[0.4em] mb-3 uppercase">Cosmic_Weather_Analysis</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-[6px] text-white/40 uppercase">Mercury</span>
                                <span className={`text-[8px] font-bold ${cosmicWeather.mercury === 'RETROGRADE' ? 'text-danger animate-pulse' : 'text-primary'}`}>
                                    {cosmicWeather.mercury === 'RETROGRADE' ? 'COMM_LAG' : 'STABLE'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[6px] text-white/40 uppercase">Venus</span>
                                <span className={`text-[8px] font-bold ${cosmicWeather.venus === 'RETROGRADE' ? 'text-danger' : 'text-primary'}`}>
                                    {cosmicWeather.venus === 'RETROGRADE' ? 'ATTRACTION_LOW' : 'HIGH_EFF'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[6px] text-white/40 uppercase">Mars</span>
                                <span className={`text-[8px] font-bold ${cosmicWeather.mars === 'RETROGRADE' ? 'text-danger' : 'text-primary'}`}>
                                    {cosmicWeather.mars === 'RETROGRADE' ? 'WILL_DEPLETED' : 'DIRECT_STRIKE'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                        <div className="flex flex-col">
                            <span className="text-[6px] text-white/30 uppercase tracking-widest">Fragments</span>
                            <span className="text-primary text-xs font-black">{ghostFragments.length}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[6px] text-white/30 uppercase tracking-widest">Shards</span>
                            <span className="text-primary text-xs font-black">{dataShards}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[6px] text-white/30 uppercase tracking-widest">Rebels</span>
                            <span className="text-danger text-xs font-black">{useStore.getState().rebelCount}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-white/30 tracking-widest uppercase mb-2">Spirit_Pool_Density</span>
                            <div className="flex gap-1.5 h-8 items-end">
                                {[...Array(10)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(10, Math.random() * 100)}%` }}
                                        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                                        className={`w-1.5 ${i < (totalVibe / 50) ? 'bg-primary shadow-[0_0_8px_#BF00FF]' : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleStarJump}
                            className={`bg-primary/10 border border-primary/40 px-6 py-3 text-primary text-[10px] tracking-[0.4em] font-black uppercase hover:bg-primary/20 transition-all ${viewMode === 'codex' ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            {viewMode === 'galaxy' ? 'Star_Jump' : 'Back_to_Map'}
                        </button>
                    </div>

                    {/* Destiny Inquiry Input (Direct Prophet Access) */}
                    <div className="mt-4 p-4 border border-primary/40 bg-black/60 shadow-[0_0_20px_rgba(191,0,255,0.1)]">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-primary text-sm animate-pulse">contact_support</span>
                            <span className="text-primary text-[8px] font-black tracking-[0.3em] uppercase">Inquire_the_Prophet</span>
                        </div>

                        {/* Task 5: Inquiry Response (Dialogue Log) */}
                        <DialogueLog />

                        <div className="relative mt-4">
                            <input
                                type="text"
                                value={logText}
                                onChange={(e) => setLogText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleDailyLog()}
                                className="w-full bg-transparent border-b border-primary/20 py-2 text-[10px] text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10 font-mono"
                                placeholder="ASK_ABOUT_YOUR_FATE..."
                            />
                            <button
                                onClick={handleDailyLog}
                                className="absolute right-0 bottom-2 text-primary hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 font-mono mt-4">
                        <div>
                            <span className="text-[7px] text-white/30 uppercase tracking-[0.2em] block mb-1">Entropic_Drift</span>
                            <span className="text-[12px] text-primary font-bold">0.042λ</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[7px] text-white/30 uppercase tracking-[0.2em] block mb-1">Nexus_Sync</span>
                            <span className="text-[12px] text-primary font-bold">OPTIMAL</span>
                        </div>
                    </div>
                </div>
            </main>

            <nav className="pb-10 pt-4 bg-pure-black border-t border-white/5 z-10 w-full">
                <div className="flex justify-around items-center px-4">
                    <button onClick={() => onNavigate('orb')} className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[24px]">lens_blur</span>
                        <span className="text-[8px] tracking-[0.4em] uppercase font-bold">Orb</span>
                    </button>
                    <button onClick={() => onNavigate('scan')} className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[24px]">center_focus_weak</span>
                        <span className="text-[8px] tracking-[0.4em] uppercase font-bold">Scan</span>
                    </button>
                    <button onClick={() => onNavigate('sandbox')} className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[24px]">widgets</span>
                        <span className="text-[8px] tracking-[0.4em] uppercase font-bold">Sandbox</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-[28px] [text-shadow:0_0_10px_#BF00FF]">person_4</span>
                        <span className="text-[9px] tracking-[0.4em] uppercase font-black">Me</span>
                    </button>
                </div>
            </nav>

            {/* Impact Drawer (Mythic Transition) */}
            <AnimatePresence>
                {showImpactDrawer && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="fixed inset-0 z-[200] pointer-events-none flex items-end"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setShowImpactDrawer(false)} />
                        <motion.div
                            className="w-full bg-[#0a0a0a] border-t-2 border-primary/50 p-8 pt-10 rounded-t-[32px] pointer-events-auto shadow-[0_-20px_50px_rgba(191,0,255,0.2)]"
                        >
                            <div className="w-12 h-1.5 bg-primary/20 rounded-full mx-auto mb-8" />
                            <div className="space-y-6">
                                <h3 className="text-primary text-xs font-black tracking-[0.4em] uppercase">Causality_Log</h3>
                                <p className="text-white/60 text-[10px] leading-relaxed uppercase">
                                    Did the reality shift today? Tell me the name of the entity who changed your mood.
                                </p>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={logText}
                                        onChange={(e) => setLogText(e.target.value)}
                                        className="w-full bg-transparent border-b border-primary/40 p-2 text-primary text-xs focus:outline-none"
                                        placeholder="NAME_THE_ENTITY..."
                                    />
                                    <button
                                        onClick={handleDailyLog}
                                        className="w-full py-4 bg-primary/20 border border-primary/40 text-primary font-black text-[10px] tracking-widest uppercase"
                                    >
                                        LOG_CAUSALITY
                                    </button>
                                </div>

                                <div className="h-[1px] w-full bg-white/10 my-4" />

                                <button
                                    onClick={() => {
                                        setShowImpactDrawer(false);
                                        onNavigate('sandbox');
                                    }}
                                    className="w-full py-5 bg-primary text-black font-black text-xs tracking-[0.4em] uppercase shadow-[0_0_30px_rgba(191,0,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    LOCATE_THE_GLITCH_IN_THE_VOID
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MANUAL PUZZLE RITUAL LAYERS */}
            {/* 1. Yellow Alert Toast */}
            <AnimatePresence>
                {showRitualToast && !showPuzzle && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[250] w-[90%] max-w-sm"
                    >
                        <button
                            onClick={() => {
                                setShowRitualToast(false);
                                setShowPuzzle(true);
                            }}
                            className="w-full py-4 bg-[#FFD700] text-black border-2 border-black font-black text-[10px] tracking-[0.4em] uppercase shadow-[0_0_30px_rgba(255,215,0,0.5)] animate-bounce"
                        >
                            ⚠️ RITUAL_READY // INITIATE_SYNTHESIS
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Puzzle Board Overlay */}
            <AnimatePresence>
                {showPuzzle && (
                    <PuzzleBoard
                        fragments={ghostFragments}
                        onClose={() => setShowPuzzle(false)}
                        onComplete={() => {
                            // Completion Logic
                            useStore.setState((state) => ({ credits: state.credits + 2 }));
                            setShowPuzzle(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default MePage
