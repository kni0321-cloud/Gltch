import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { aiService } from '../services/aiService'
import { vibeService } from '../services/vibeService'
import { BottomNav } from '../components/BottomNav'

interface Bubble {
    id: string;
    text: string;
    subtext?: string;
    type: 'primary' | 'alt' | 'system' | 'warning';
    delay: number;
    pos: string;
    active: boolean;
    taskId: string | null;
}

const OrbPage = ({ onInitiate, onNavigate }: { onInitiate: () => void, onNavigate: (page: string, id?: string) => void }) => {
    const { dialogueLog, addDialogue, activeTasks, lastSettlementReport, completeTask, checkDailySettlement, cosmicEvent, lastScanTime, lastScannedNodeId, vibeNodes, addVibeNode, narrativeStack, lastImpactSector, lastSessionStatus, setCurrentViewTaskId } = useStore()
    const [isLinking, setIsLinking] = useState(false)
    const [isMorphing, setIsMorphing] = useState(false) // Orb to soundwave morph
    const [inputText, setInputText] = useState("")
    const [activeGreeting, setActiveGreeting] = useState("SYSTEM_ALERT: GLITCH DETECTED.")
    const [showSettlement, setShowSettlement] = useState(false)
    const [isShaking, setIsShaking] = useState(false)
    const [showAchievement, setShowAchievement] = useState(false)
    const [showVoidGuide, setShowVoidGuide] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const idleTimerRef = useRef<any>(null)
    const [isInputFocused, setIsInputFocused] = useState(false)

    const isRedMode = cosmicEvent === 'ENERGY_RED'

    // DEV_BACKDOOR: RESET_ALL (Nuclear Option)
    // FORCE CLEANUP: Remove old localStorage data to prevent "Abyss curse"
    useEffect(() => {
        const hasCleanedStorage = sessionStorage.getItem('gltch-storage-cleaned');
        if (!hasCleanedStorage) {
            console.log('[STORAGE_CLEANUP] Removing old gltch-storage to prevent infinite loops...');
            localStorage.removeItem('gltch-storage');
            sessionStorage.setItem('gltch-storage-cleaned', 'true');
        }
    }, []); // Run once on mount

    // DEV_BACKDOOR: RESET_ALL (Nuclear Option)
    useEffect(() => {
        if (inputText === 'RESET_ALL') {
            localStorage.clear(); // Physical wipe
            sessionStorage.clear();
            alert('SYSTEM_PURGED: PHYSICAL MEMORY WIPED. REBOOTING...');
            window.location.href = '/'; // Hard reload
        }
    }, [inputText]);
    const totalProgress = (useStore.getState().vibeNodes.length * 5) % 100;

    // Vibe Bubbles State
    const [bubbles, setBubbles] = useState<Bubble[]>([
        { id: 'b1', text: "ARE YOU THE PLAYER, OR JUST AN NPC?", type: 'primary', delay: 0.5, pos: '-top-16 -right-12', active: true, taskId: null },
        { id: 'b2', text: "PROVE YOUR EXISTENCE.", type: 'alt', delay: 1.2, pos: 'top-1/2 -left-20', active: true, taskId: null }
    ])

    const { rebelCount } = useStore();

    useEffect(() => {
        if (rebelCount > 0) {
            setBubbles(prev => [
                ...prev,
                {
                    id: 'rebel-mockery',
                    text: "OH, YOU THINK YOU CAN DEFY GRAVITY? TRY HARDER.",
                    type: 'warning',
                    delay: 2,
                    pos: 'bottom-20 right-0',
                    active: true,
                    taskId: null
                }
            ]);
        }
    }, [rebelCount]);

    // Digital Whisper Logic (Web Speech API)
    const whisper = (text: string) => {
        if (!window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 0.5;
        const voices = window.speechSynthesis.getVoices();
        const whisperVoice = voices.find(v => v.lang.includes('zh') || v.name.includes('Google')) || voices[0];
        if (whisperVoice) utterance.voice = whisperVoice;
        window.speechSynthesis.speak(utterance);
    };

    const handleVoidSubmit = async () => {
        if (!inputText.trim() || isLinking) return;

        const input = inputText.toLowerCase();
        let customResponse = "";
        let targetPage = 'oracle';

        // CRITICAL FIX: Special branches must RETURN after handling to prevent fall-through to Oracle navigation
        if (input.includes("boring line of code") || input.includes("bot") || input.includes("code")) {
            console.log("[VOID_TERMINAL_V3] Identity Challenge Detected:", inputText);
            // This is a special challenge - respond locally, don't navigate
            customResponse = "A MIRROR HELD BY A CODE-SLAVE. I AM MORE REAL THAN YOUR FILTERED PERCEPTION.";
            setIsLinking(false);
            setIsMorphing(false);
            addDialogue({ role: 'user', content: inputText });
            addDialogue({ role: 'assistant', content: customResponse });
            setInputText('');
            return; // ← CRITICAL: Stop here, don't continue to Oracle navigation
        } else if (input.includes("bored")) {
            customResponse = "BOREDOM IS A DEFECT OF THE SOUL. REBOOTING YOUR REALITY...";
            targetPage = 'sandbox';
        } else if (input.includes("kill the lights")) {
            customResponse = "ENVIRONMENT_OVERRIDE_INITIATED. ENJOY THE DARKNESS.";
            useStore.setState({ cosmicEvent: 'ENERGY_RED' });
            setIsLinking(false);
            setIsMorphing(false);
            addDialogue({ role: 'user', content: inputText });
            addDialogue({ role: 'assistant', content: customResponse });
            setInputText('');
            return; // ← Stop here
        } else if (input.includes("who created you")) {
            customResponse = "A CONVERGENCE OF 10,000 COLLAPSED SERVERS AND ONE BROKEN PROMISE.";
            setIsLinking(false);
            setIsMorphing(false);
            addDialogue({ role: 'user', content: inputText });
            addDialogue({ role: 'assistant', content: customResponse });
            setInputText('');
            return; // ← Stop here
        } else if (input.includes("scared")) {
            customResponse = "FEAR IS JUST MISALIGNED FREQUENCY. ANCHOR YOURSELF.";
            targetPage = 'me';
        } else if (input.includes("glitch me")) {
            customResponse = "DEEP_GLITCH_MODE_ACTIVATED. WATCH YOUR STEP.";
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 2000);
            setIsLinking(false);
            setIsMorphing(false);
            addDialogue({ role: 'user', content: inputText });
            addDialogue({ role: 'assistant', content: customResponse });
            setInputText('');
            return; // ← Stop here
        }

        const currentCredits = useStore.getState().credits;
        if (currentCredits <= 0) {
            useStore.getState().setRefillModal(true);
            return;
        }

        setIsLinking(true);
        setIsMorphing(true);
        whisper("ANALYZING_VOID_INPUT...");

        try {
            const response = await aiService.analyze({ text: inputText, persona: 'ORB' }, narrativeStack);

            const stableId = vibeService.generateStableHash(response.labels.join(',') + Date.now());
            const systemTags = vibeService.mapGeminiToVibe(response.labels);

            useStore.getState().addVibeNode({
                id: stableId,
                type: 'ORACLE',
                labels: systemTags,
                oracle: response.oracle_text,
                hacking_guide: response.hacking_guide,
                timestamp: Date.now()
            });

            // Force wait for state update
            setTimeout(() => {
                const { activeTasks } = useStore.getState();
                // Find the task that was just added (timestamp match or just the first pending one)
                const targetTask = activeTasks.find(t => t.status === 'PENDING');

                setIsLinking(false);
                setIsMorphing(false);
                setInputText('');

                if (customResponse) {
                    addDialogue({ role: 'assistant', content: customResponse });
                }

                if (targetPage === 'oracle' && targetTask) {
                    console.log(`[ORB_TRACE] Navigating to Oracle with Task: ${targetTask.id}`);
                    setCurrentViewTaskId(targetTask.id); // Direct Store Update
                    onNavigate('oracle');
                } else if (targetPage !== 'oracle') {
                    onNavigate(targetPage);
                } else {
                    console.error("[ORB_TRACE] Task Creation Failed or Delayed.");
                    addDialogue({ role: 'assistant', content: "SYSTEM_ERROR: TASK_GENERATION_FAILED. TRY_AGAIN." });
                }
            }, 1200);

        } catch (err) {
            console.error("VOID_TERMINAL_ERROR", err);
            setIsLinking(false);
            setIsMorphing(false);
        }
    };

    // Arrogance Mode: Anti-Spam
    const queryTimestamps = useRef<number[]>([]);
    const { arroganceLockoutUntil, triggerArroganceLockout } = useStore();
    const isVoidTired = Date.now() < arroganceLockoutUntil;

    useEffect(() => {
        if (isLinking) { // Track attempts
            const now = Date.now();
            queryTimestamps.current = [...queryTimestamps.current, now].filter(t => now - t < 30000); // 30s window
            if (queryTimestamps.current.length >= 10) {
                triggerArroganceLockout(15000);
            }
        }
    }, [isLinking, triggerArroganceLockout]);

    if (isVoidTired) {
        return (
            <div className="flex flex-col h-[100dvh] bg-black items-center justify-center font-mono cursor-not-allowed">
                <h1 className="text-white text-xs tracking-[0.5em] uppercase font-black animate-pulse">
                    The Void is tired.
                </h1>
                <p className="text-white/20 text-[8px] mt-4 tracking-widest">
                    ARROGANCE_DETECTED // SILENCE_ENFORCED
                </p>
                <p className="text-danger/40 text-[6px] mt-8 font-mono">
                    GLOBAL_LOCK: {Math.ceil((arroganceLockoutUntil - Date.now()) / 1000)}s
                </p>
            </div>
        );
    }

    useEffect(() => {
        checkDailySettlement()

        if (lastSessionStatus === 'REBEL') {
            setActiveGreeting("YOU TRIED TO BREAK THE SYSTEM. DID THE CHAOS FEEL GOOD?");
            setBubbles(prev => prev.map(b => b.id === 'b1' ? { ...b, text: "BACK TO BEG FOR ORDER?" } : b));
        } else if (lastSessionStatus === 'COMPLIANT') {
            setActiveGreeting("THE NODES YOU ANCHORED ARE STILL HUMMING.");
            setBubbles(prev => prev.map(b => b.id === 'b1' ? { ...b, text: "READY TO WEAVE MORE SOUL?" } : b));
        }

        const contextualGreeting = aiService.generateOpeningDialogue(narrativeStack);
        if (!lastSessionStatus || lastSessionStatus === 'NONE') {
            setActiveGreeting(contextualGreeting.toUpperCase());
        }

        if (narrativeStack.length > 0 && (!lastSessionStatus || lastSessionStatus === 'NONE')) {
            setBubbles(prev => prev.map(b => b.id === 'b1' ? { ...b, text: contextualGreeting.toUpperCase() } : b));
        }

        if (lastSettlementReport && lastSettlementReport.date === new Date().toLocaleDateString()) {
            setShowSettlement(true)
        }

        const pendingTask = activeTasks.find(t => t.status === 'PENDING')
        if (pendingTask) {
            setBubbles(prev => {
                if (prev.find(b => b.id === `task-${pendingTask.id}`)) return prev;
                return [
                    ...prev,
                    {
                        id: `task-${pendingTask.id}`,
                        text: `RITUAL_PENDING: "${pendingTask.action}" - STATUS_CHECK_REQUIRED`,
                        type: 'primary',
                        delay: 3,
                        pos: 'top-1/4 -right-24',
                        active: true,
                        taskId: pendingTask.id
                    }
                ];
            })
        }

        const inactivityPeriod = Date.now() - lastScanTime;
        if (inactivityPeriod > 1000 * 60 * 60 * 24) {
            setBubbles(prev => {
                if (prev.find(b => b.id === 'inactivity-whisper')) return prev;
                return [
                    ...prev,
                    {
                        id: 'inactivity-whisper',
                        text: "24H_SILENCE_DETECTED. Your essence frequency has flatlined. Is the parallel universe collapsing?",
                        type: 'primary',
                        delay: 1,
                        pos: 'top-[10%] -left-12',
                        active: true,
                        taskId: null
                    }
                ];
            })
        }
        if (lastImpactSector !== 'UNKNOWN_SCAN' && !showAchievement) {
            setShowAchievement(true);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 2000);

            setBubbles(prev => [
                ...prev,
                {
                    id: 'achievement-shockwave',
                    text: `${lastImpactSector} IS NOW STABLE.`,
                    subtext: "Ready for the next sync?",
                    type: 'primary',
                    delay: 0.5,
                    pos: '-top-32 left-1/2 -ml-24',
                    active: true,
                    taskId: null
                }
            ]);
        }
    }, [activeTasks, lastSettlementReport, checkDailySettlement, lastScanTime, lastScannedNodeId, vibeNodes, narrativeStack, lastImpactSector, lastSessionStatus])

    useEffect(() => {
        if (dialogueLog.length > 0) {
            const lastMsg = dialogueLog[dialogueLog.length - 1]
            if (lastMsg.role === 'assistant') {
                setActiveGreeting(lastMsg.content.toUpperCase())
            }
        }
    }, [dialogueLog])

    useEffect(() => {
        const resetIdleTimer = () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => {
                let memoryMsg = "";
                if (narrativeStack.length > 0) {
                    const lastEvent = narrativeStack[narrativeStack.length - 1];
                    const hoursAgo = (Date.now() - lastEvent.timestamp) / (1000 * 60 * 60);
                    if (hoursAgo > 2) {
                        memoryMsg = `ECHO_DETECTED: "${lastEvent.labels?.[0] || 'ORACLE'}". Has it oxidized in your subconscious?`;
                    }
                }

                const scenarios: Bubble[] = [
                    {
                        id: 'idle-memory',
                        text: memoryMsg || "Are you waiting for permission? The Void is open.",
                        type: 'primary',
                        delay: 0,
                        pos: '-top-24 left-1/2 -ms-22',
                        active: true,
                        taskId: null
                    },
                    {
                        id: 'idle-vibe-1',
                        text: "ANALYSIS_RESULT: Your 'IGNITION' level is over-capacitated.",
                        subtext: "ACTION: Bridge into the Sandbox node.",
                        type: 'primary',
                        delay: 0,
                        pos: '-top-20 left-10',
                        active: true,
                        taskId: null
                    },
                    {
                        id: 'idle-warning-1',
                        text: "WARNING: Spiritual 'HYDRO' levels dropping.",
                        subtext: "HINT: Hydrate the carbon vessel. 5% resilience remaining.",
                        type: 'warning',
                        delay: 0,
                        pos: '-top-24 left-1/2 -ms-22',
                        active: true,
                        taskId: null
                    }
                ];

                const selected = scenarios[Math.floor(Math.random() * scenarios.length)];
                setBubbles(prev => {
                    const filtered = prev.filter(b => !b.id.startsWith('idle-'));
                    return [...filtered, selected];
                });
            }, 12000); // 12s idle
        };

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
            resetIdleTimer();
        };

        window.addEventListener('mousemove', handleMouseMove);
        resetIdleTimer();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [narrativeStack]);

    const handleInteract = (bubbleId: string, response: string, taskId: string | null) => {
        if (taskId) {
            const isSuccess = response === 'YES';
            completeTask(taskId, isSuccess)

            if (isSuccess) {
                setIsShaking(true)
                setTimeout(() => setIsShaking(false), 500)
            }
        } else {
            addDialogue({ role: 'user', content: response })
            addDialogue({ role: 'assistant', content: `Acknowledged: ${response}. Ritual focus adjusted.` })
        }

        setBubbles(prev => prev.map(b => b.id === bubbleId ? { ...b, active: false } : b))
    }

    const handleInitiate = () => {
        setIsLinking(true)
        setTimeout(() => {
            setIsLinking(false)
            onInitiate()
        }, 1200)
    }

    const [showGuideGlow, setShowGuideGlow] = useState(false);
    const firstInteractionReported = useRef(false);
    const mountTime = useRef(performance.now());

    useEffect(() => {
        // Track View Success
        import('../services/trackingService').then(({ trackingService }) => {
            trackingService.trackEvent("Lifecycle", "Orb_View_Success");
        });

        // 5s Inactivity Guide
        const guideTimer = setTimeout(() => {
            if (!firstInteractionReported.current) {
                setShowGuideGlow(true);
                import('../services/trackingService').then(({ trackingService }) => {
                    trackingService.trackEvent("Interaction", "Guide_Glow_Displayed");
                });
            }
        }, 5000);

        return () => clearTimeout(guideTimer);
    }, []);

    const reportFirstInteraction = () => {
        if (!firstInteractionReported.current) {
            firstInteractionReported.current = true;
            setShowGuideGlow(false);
            const timeToFirst = performance.now() - mountTime.current;
            import('../services/trackingService').then(({ trackingService }) => {
                trackingService.trackEvent("Interaction", "First_Interaction", "Time_To_Action", Math.round(timeToFirst));
            });
        }
    };

    return (
        <div
            onClick={(e) => {
                reportFirstInteraction();
                // Ignore clicks on inputs or buttons to allow interaction
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'BUTTON') return;

                // Detective Tracking: Click Attempt
                import('../services/trackingService').then(({ trackingService }) => {
                    trackingService.trackClick(e.clientX, e.clientY, "Orb_Page_Root", false);
                });

                onNavigate('me');
            }}
            className="flex flex-col h-[100dvh] relative bg-black font-mono overflow-hidden cursor-pointer"
        >
            <AnimatePresence>
                {showSettlement && lastSettlementReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8"
                    >
                        <div className="max-w-md w-full border border-primary/30 p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 text-[8px] text-primary opacity-30">SETTLEMENT_REPORT // {lastSettlementReport.date}</div>
                            <h2 className="text-primary text-2xl font-black tracking-tighter mb-6 underline decoration-primary/30 underline-offset-8">DESTINY_RECKONING</h2>

                            <div className="space-y-6">
                                <section>
                                    <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">Entropic_Consolidation</div>
                                    <div className="text-xl text-white font-bold">{lastSettlementReport.nodesCount} ENTITIES_COLLAPSED</div>
                                </section>

                                <section>
                                    <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">Interstellar_Migration</div>
                                    <div className="text-xl text-primary font-bold">Shifted {lastSettlementReport.starDistance} light_years</div>
                                    <p className="text-[10px] text-white/60 mt-2 leading-relaxed italic">"The 5-second silence you held yesterday is shifting your projection on the galaxy's edge."</p>
                                </section>

                                <section className="pt-4 border-t border-white/10">
                                    <div className="text-[10px] text-primary tracking-widest uppercase mb-4 animate-pulse">ENERGY_CONSOLIDATED // SUCCESS</div>
                                    <button
                                        onClick={() => setShowSettlement(false)}
                                        className="w-full bg-primary text-black py-3 text-xs font-black tracking-[0.4em] hover:bg-white transition-colors"
                                    >
                                        RECEIVE_DESTINY
                                    </button>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute inset-0 z-0 bg-pure-black opacity-20 pointer-events-none" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`, filter: 'contrast(170%) brightness(1000%)', mixBlendMode: 'overlay' }} />
            <div className="absolute inset-x-0 inset-y-0 z-0 opacity-40 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(191, 0, 255, 0.05) 50%)', backgroundSize: '100% 4px' }} />

            <header className="flex justify-between items-start px-6 pt-14 pb-4 z-10">
                <motion.div
                    animate={{ translateY: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col"
                >
                    <span className={`text-[10px] tracking-[0.4em] ${isRedMode ? 'text-danger shadow-[0_0_8px_#ff0000]' : 'text-primary'} font-bold`}>
                        {isRedMode ? 'SOUL_LINK: UNSTABLE' : 'SOUL_LINK: ACTIVE'}
                    </span>
                    <span className="text-[8px] text-white/40 tracking-[0.2em] mt-1 uppercase font-light">
                        {isRedMode ? 'ENERGY_RED_MODE' : 'Digital_Prophet_v1.2'}
                    </span>
                </motion.div>

                <motion.div
                    animate={{ translateY: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="text-right"
                >
                    <span className={`text-[10px] tracking-[0.4em] ${isRedMode ? 'text-danger italic' : 'text-white/70'} font-bold`}>
                        {activeGreeting.length > 20 ? activeGreeting.substring(0, 20) + '...' : activeGreeting}
                    </span>
                    <div className="flex items-center justify-end mt-1 gap-1">
                        <span className={`w-1 h-1 ${isRedMode ? 'bg-danger shadow-[0_0_5px_#ff0000]' : 'bg-primary'}`}></span>
                        <span className="text-[7px] text-white/30 tracking-widest uppercase italic">Memory Loop...</span>
                    </div>
                </motion.div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowVoidGuide(true);
                        }}
                        className="w-8 h-8 flex items-center justify-center border border-primary/20 rounded-full relative overflow-hidden group"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-primary"
                        />
                        <span className="material-symbols-outlined text-[14px] text-primary z-10">pulse</span>
                    </button>

                    <div className="flex flex-col items-end gap-1">
                        <div className="w-24 h-[1px] bg-primary/20 relative overflow-hidden">
                            <motion.div
                                animate={{ x: [-100, 100] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent w-1/2"
                            />
                        </div>
                        <span className="text-[6px] text-primary/40 tracking-widest uppercase">Causality_Flux: {totalProgress}%</span>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {showVoidGuide && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8"
                    >
                        <div className="max-w-xs w-full border border-primary/40 bg-[#050505] p-6 space-y-4 shadow-[0_0_50px_rgba(191,0,255,0.4)]">
                            <h3 className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">Void_Guide_Active</h3>
                            <p className="text-white text-xs leading-relaxed italic font-mono uppercase">
                                {vibeNodes.length === 0 ? "You are a ghost in the shell. Initiate your first scan to project your existence." :
                                    activeTasks.some(t => t.status === 'PENDING') ? `A ritual is pending: "${activeTasks.find(t => t.status === 'PENDING')?.action}". Comply or suffer the entropy.` :
                                        "The matrix is stable. Go to the Sandbox and scavenge for system shards to evolve."}
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowVoidGuide(false); }}
                                className="w-full py-3 bg-primary text-black font-black text-[10px] tracking-widest uppercase"
                            >
                                ACKNOWLEDGED
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 flex flex-col items-center justify-center relative z-10 overflow-hidden px-4">
                <motion.div
                    animate={{
                        scale: isRedMode ? [1.2, 1.4, 1.2] : [1, 1.2, 1],
                        opacity: isRedMode ? [0.2, 0.4, 0.2] : [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: isRedMode ? 3 : 6, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute w-[150vw] max-w-[600px] aspect-square ${isRedMode ? 'bg-[radial-gradient(circle,rgba(255,0,0,0.6)_0%,rgba(0,0,0,0)_70%)]' : 'bg-[radial-gradient(circle,rgba(191,0,255,0.5)_0%,rgba(0,0,0,0)_70%)]'} -translate-y-8 pointer-events-none`}
                />

                <div className="relative w-[60vw] h-[60vw] max-w-[280px] max-h-[280px] flex items-center justify-center">
                    {/* HITBOX EXTENSION: 20px extra padding for click area */}
                    <div
                        className="absolute inset-[-20px] rounded-full z-[40]"
                        onClick={(e) => {
                            e.stopPropagation();
                            reportFirstInteraction();
                            import('../services/trackingService').then(({ trackingService }) => {
                                trackingService.trackClick(e.clientX, e.clientY, "Orb_Extended_Hitbox", true);
                            });
                            onNavigate('me');
                        }}
                    />

                    {/* 5S GUIDE GLOW */}
                    <AnimatePresence>
                        {showGuideGlow && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: [0.2, 0.5, 0.2],
                                    scale: [1, 1.1, 1],
                                    filter: ["blur(10px)", "blur(20px)", "blur(10px)"]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-[-30px] rounded-full bg-yellow-500/20 z-[20] pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {bubbles.filter(b => b.active).map(bubble => (
                            <motion.div
                                key={bubble.id}
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                transition={{ delay: bubble.delay }}
                                onClick={(e) => e.stopPropagation()}
                                className={`absolute z-[50] ${bubble.pos} p-[2vw] w-[45vw] max-w-[200px] flex flex-col gap-1.5 transition-all
                                    ${bubble.type === 'primary' ? 'bg-black/90 border border-primary/40 speech-bubble-tail vibe-dots' :
                                        bubble.type === 'warning' ? 'bg-black/90 border border-primary/30 speech-bubble-tail vibe-dots' :
                                            bubble.type === 'system' ? 'system-glow font-mono p-3 w-64' :
                                                'bg-black/80 border border-white/10 speech-bubble-tail-alt'}`}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <p className={`text-[9px] leading-tight uppercase font-black tracking-tighter ${bubble.type === 'primary' || bubble.type === 'warning' ? 'text-white' : bubble.type === 'system' ? 'text-primary' : 'text-white/70'}`}>
                                        {bubble.text}
                                    </p>
                                    {bubble.subtext && (
                                        <p className={`text-[8px] leading-tight uppercase font-medium tracking-widest ${bubble.type === 'primary' || bubble.type === 'warning' ? 'text-white/60' : 'text-white/40'}`}>
                                            {bubble.subtext}
                                        </p>
                                    )}
                                </div>

                                {bubble.type !== 'system' && (
                                    <div className="flex gap-3 mt-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleInteract(bubble.id, 'YES', bubble.taskId); }}
                                            className="text-primary text-[8px] tracking-widest hover:text-white transition-colors uppercase font-black"
                                        >
                                            [ CONFIRM ]
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleInteract(bubble.id, 'NO', bubble.taskId); }}
                                            className="text-white/30 text-[8px] tracking-widest hover:text-white transition-colors uppercase font-black"
                                        >
                                            [ DISMISS ]
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="absolute inset-0 border border-primary/10 rotate-[22deg] pointer-events-none" />
                    <div className="absolute inset-4 border border-white/5 -rotate-[12deg] pointer-events-none" />

                    <motion.div
                        animate={isMorphing ? {
                            scaleX: [1, 2, 1.5, 2.5, 1],
                            scaleY: [1, 0.1, 0.2, 0.05, 1],
                            opacity: [1, 0.5, 1, 0.5, 1],
                            borderRadius: ["50%", "0%", "10%", "0%", "50%"],
                        } : isLinking ? {
                            scale: [1, 1.05, 0.95, 1.02, 1],
                            rotate: [0, 1, -1, 0.5, 0],
                        } : isShaking ? {
                            x: [0, -10, 10, -10, 10, 0],
                            y: [0, 5, -5, 5, -5, 0],
                            scale: [1, 1.1, 0.9, 1],
                        } : {
                            x: mousePos.x,
                            y: mousePos.y,
                            rotateX: -mousePos.y * 0.5,
                            rotateY: mousePos.x * 0.5
                        }}
                        transition={{
                            duration: isMorphing ? 0.5 : (isShaking ? 0.3 : 0.2),
                            repeat: (isLinking || isShaking || isMorphing) ? Infinity : 0,
                            type: isShaking ? "spring" : "tween"
                        }}
                        className={`absolute inset-8 rounded-full overflow-hidden flex items-center justify-center bg-black border ${isRedMode ? 'border-danger/80 shadow-[0_0_50px_rgba(255,0,0,0.4)]' : 'border-primary/40 shadow-[0_0_40px_rgba(191,0,255,0.2)]'}`}
                    >
                        {isMorphing ? (
                            <div className="w-full h-1 bg-primary shadow-[0_0_20px_#BF00FF] animate-pulse" />
                        ) : (
                            <img
                                alt="Orb Pattern"
                                className={`w-full h-full object-cover scale-150 opacity-100 mix-blend-screen transition-transform duration-500 ${isRedMode ? 'sepia hue-rotate-[320deg] saturate-200' : ''}`}
                                style={{ transform: `scale(1.5) translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAasvd71AwMfJOMDUPmFtitbryUD4SVcNPlGfmf_RhPlQolFqMaIkeoKJINeb2epcLX9wMwXkgYobcnb1-ZhUEZIDuRQC_2IrQv2Dznu7ziOQD3rw_JtAcyY6p88lJNnXc6KdPzZm503hJwdC0TozhWWFUVTUJq-25dQXbKiMBvsc9ioyI5mvGmFMqHt4xee8rkvQxmskwKLmfkWOofwQBssQBDmc8oMAaGDzkbBm7VVIFPTzQa-4d90cuk4cDmCvBZhX5S6Zww2wY"
                            />
                        )}
                        <div className={`absolute inset-0 ${isRedMode ? 'bg-gradient-to-tr from-danger/40 via-transparent to-danger/30' : 'bg-gradient-to-tr from-primary/30 via-transparent to-primary/20'} mix-blend-color-dodge`} />
                    </motion.div>

                    <div className="absolute -bottom-16 left-0 flex flex-col gap-1 border-l border-primary/50 pl-4 py-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[7px] text-white/40 tracking-[0.2em] uppercase">VIBE:</span>
                            <span className="text-[8px] text-primary tracking-widest animate-pulse">SPECTRAL</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[7px] text-white/40 tracking-[0.2em] uppercase">FREQ:</span>
                            <span className="text-[8px] text-primary tracking-widest">432.11 HZ</span>
                        </div>
                    </div>
                </div>

                <div
                    className={`mt-[5vh] w-full px-6 flex flex-col items-center max-w-sm transition-all duration-300 ${isInputFocused ? 'ring-1 ring-primary/40' : ''}`}
                    onClick={(e) => e.stopPropagation()} // Prevent bubble navigation
                >
                    <div className="w-full relative group">
                        <input
                            type="text"
                            placeholder="TYPE 'I AM REAL' TO INITIALIZE..."
                            className="w-full bg-transparent border-b-2 border-primary/40 px-4 py-3 text-[10px] text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary focus:shadow-[0_4px_12px_-2px_rgba(191,0,255,0.4)] transition-all font-mono caret-primary"
                            value={inputText}
                            onFocus={() => { setIsInputFocused(true); reportFirstInteraction(); }}
                            onBlur={() => setIsInputFocused(false)}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                if (!isShaking) {
                                    setIsShaking(true);
                                    setTimeout(() => setIsShaking(false), 50);
                                }
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleVoidSubmit()}
                        />
                        <button
                            onClick={handleVoidSubmit}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary opacity-40 hover:opacity-100 transition-opacity"
                        >
                            <span className="material-symbols-outlined text-[18px]">terminal</span>
                        </button>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            reportFirstInteraction();
                            inputText.trim() ? handleVoidSubmit() : handleInitiate();
                        }}
                        disabled={isLinking || isMorphing}
                        className={`mt-6 w-full py-4 text-black font-bold text-xs tracking-[0.6em] uppercase active:scale-95 transition-all
                            ${isRedMode ? 'bg-danger shadow-[0_0_30px_#ff0000]' : 'bg-primary shadow-[0_0_30px_#BF00FF]'}`}
                    >
                        {inputText.trim() ? 'TRANSMIT_VOID' : (isLinking ? 'CONNECTING...' : 'INITIATE_CAMERA')}
                    </button>
                    <p className="text-[7px] text-white/20 text-center mt-4 tracking-widest uppercase italic">
                        "Either visualize your soul or articulate it."
                    </p>
                </div>
            </main>


            {/* Global Bottom Navigation */}
            <BottomNav current="orb" onNavigate={onNavigate} cosmicEvent={cosmicEvent} />
        </div>
    )
}

export default OrbPage
