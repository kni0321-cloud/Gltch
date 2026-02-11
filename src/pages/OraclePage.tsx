import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { ORACLE_LIBRARY } from '../data/oracle_library'
import { audioService } from '../services/audioService'

interface OraclePageProps {
    taskId: string
    onClose: () => void
}

export function OraclePage({ taskId, onClose }: OraclePageProps) {
    const { activeTasks, completeTask, oracleProgress, setOracleProgress, clearOracleProgress } = useStore()
    const resolvedTaskId = taskId || 'DEFAULT_TASK'
    const task = activeTasks.find(t => t.id === resolvedTaskId)
    const script = ORACLE_LIBRARY.find(s => s.trigger === task?.trigger)

    // Use persisted progress if resuming same task
    const isResumingTask = oracleProgress.taskId === taskId && oracleProgress.step > 0

    const [step, setStep] = useState(isResumingTask ? oracleProgress.step : 0)
    const [ritualFeedback, setRitualFeedback] = useState<'SUCCESS' | 'FAILURE' | null>(
        isResumingTask ? oracleProgress.ritualFeedback : null
    )
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);
    const [rippleCount, setRippleCount] = useState(isResumingTask ? oracleProgress.rippleCount : 0);

    // Save progress to store whenever it changes
    useEffect(() => {
        if (task && step > 0) {
            setOracleProgress({
                taskId: task.id,
                step,
                rippleCount,
                ritualFeedback
            });
        }
    }, [step, rippleCount, ritualFeedback, task?.id]);

    // Clear progress on unmount if completed
    useEffect(() => {
        return () => {
            if (step >= 3.5 || ritualFeedback === 'FAILURE') {
                clearOracleProgress();
            }
        };
    }, [step, ritualFeedback]);

    // TRACE LOG: Component Mount
    useEffect(() => {
        console.log(`[ORACLE_TRACE] Mounted with ResolvedTaskId: ${resolvedTaskId}`);
        console.log(`[ORACLE_TRACE] Task Found: ${!!task} (Status: ${task?.status})`);
        if (isResumingTask) {
            console.log(`[ORACLE_TRACE] Resuming task at step ${oracleProgress.step}, ripples: ${oracleProgress.rippleCount}`);
        }
    }, [resolvedTaskId, task]);

    if (!task || !script) {
        return (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8">
                <div className="border border-red-500/40 bg-red-900/10 p-6 max-w-sm text-center">
                    <p className="text-red-500 font-mono text-xs mb-4 uppercase tracking-widest animate-pulse">
                        SYSTEM_ERROR: TASK_LOST
                    </p>
                    <p className="text-white/60 text-[10px] font-mono mb-6 leading-relaxed">
                        Oracle script not found for trigger: {task?.trigger || 'UNKNOWN'}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-black text-[10px] tracking-[0.5em] uppercase transition-colors"
                    >
                        RETURN_TO_ORB
                    </button>
                </div>
            </div>
        )
    }

    const handleComply = () => {
        console.log(`[ORACLE_TRACE] Action: I_COMPLIED for Task: ${task.id}`);
        completeTask(task.id, true)
        setRitualFeedback('SUCCESS')
        setStep(2)
        audioService.playSingingBowl()
    }

    const handleSever = () => {
        console.log(`[ORACLE_TRACE] Action: SEVER_LINK for Task: ${task.id}`);
        completeTask(task.id, 'SEVER')
        setRitualFeedback('FAILURE')
        setStep(2)
        useStore.setState({
            rebelCount: useStore.getState().rebelCount + 1,
            cosmicEvent: 'ENERGY_RED'
        });
        audioService.playGlitchStatic()
    }

    // Safe Async Handling
    const isMounted = useRef(true);
    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const handleRippleClick = (e: React.MouseEvent) => {
        console.log(`[ORACLE_AUDIT] Universal Tap Detected. Triggering Escape Sequence.`);
        
        // [FORCE_JUMP] Skip all games, just go to ME page
        try {
            useStore.getState().addGhostFragment(); 
        } catch (err) {
            console.error("[ORACLE_FORCE] Store Action Failed:", err);
        }

        // Trigger visual suction and jump
        setStep(3.5);
        audioService.playSingingBowl();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 overflow-hidden"
        >
            {/* Ancient Symbol Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 select-none">
                <span className="text-[40vw] font-serif text-primary leading-none">
                    {script.symbol}
                </span>
            </div>

            {/* PHYSICAL EXIT BUTTON */}
            <button 
                onClick={onClose}
                className="absolute top-8 right-8 z-[200] w-12 h-12 border border-white/20 bg-black/40 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all rounded-full"
            >
                <span className="material-symbols-outlined text-white text-[24px]">close</span>
            </button>

            {/* Universal Interaction Layer - ANY CLICK TRIGGERS PROGRESS */}
            {/* [AUDIT CHECKPOINT: POINTER EVENTS] Ensure this layer is NOT blocked */}
            {/* Universal Interaction Layer - ANY CLICK TRIGGERS PROGRESS */}
            <div 
                className="absolute inset-0 z-[100] cursor-pointer" 
                onClick={handleRippleClick}
                style={{ pointerEvents: 'auto' }} 
            >
                {/* Visual affordance: Pulsing floor to show interactivity */}
                <motion.div
                    animate={{ opacity: [0, 0.1, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-primary pointer-events-none"
                />
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AnimatePresence>
                    {ripples.map(ripple => (
                        <motion.div
                            key={ripple.id}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 4, opacity: 0 }}
                            className="absolute w-20 h-20 border-2 border-primary rounded-full z-[51]"
                            style={{ left: ripple.x - 40, top: ripple.y - 40 }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Feedback Overlays */}
            <AnimatePresence>
                {ritualFeedback === 'SUCCESS' && (
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 12, opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="w-32 h-32 border-[12px] border-[#FFD700] rounded-full"
                        />
                    </div>
                )}
                {ritualFeedback === 'FAILURE' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.5, 1, 0] }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-red-600/30 z-[60] pointer-events-none flex items-center justify-center"
                    >
                        <p className="text-[20px] font-black text-white uppercase tracking-widest">
                            SIGNAL_LOSS
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <motion.div className="relative z-[70] flex flex-col items-center justify-center gap-10 max-w-md pointer-events-auto">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="prophecy"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-8"
                        >
                            {/* Origin Tag */}
                            <div className="inline-block px-4 py-1 border border-primary/30 bg-primary/5">
                                <p className="text-[9px] text-primary font-black tracking-[0.4em] uppercase">
                                    {script.origin}
                                </p>
                            </div>

                            {/* Prophecy */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-white font-mono text-sm leading-relaxed tracking-wide"
                            >
                                {script.oracle}
                            </motion.p>

                            {/* Ritual Task */}
                            <div className="border-t border-b border-primary/20 py-4">
                                <p className="text-[10px] text-primary/70 uppercase tracking-widest mb-2">RITUAL_REQUIRED</p>
                                <p className="text-white/80 text-[11px] font-mono leading-relaxed">
                                    {script.task}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleComply}
                                    className="flex-1 py-4 bg-primary text-black font-black text-[10px] tracking-[0.4em] uppercase shadow-[0_0_20px_rgba(191,0,255,0.3)] hover:shadow-[0_0_30px_rgba(191,0,255,0.5)] transition-shadow"
                                >
                                    I_COMPLIED
                                </button>
                                <button
                                    onClick={handleSever}
                                    className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-black text-[10px] tracking-[0.4em] uppercase transition-colors"
                                >
                                    SEVER_LINK
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Ripple Game (SUCCESS path) */}
                    {step === 2 && ritualFeedback === 'SUCCESS' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8 text-center"
                            key="ripple-game"
                        >
                            <div className="flex flex-col items-center gap-6">
                                {/* PROMINENT INSTRUCTION */}
                                <motion.p
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.8, 1, 0.8]
                                    }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="text-[20px] text-primary font-black tracking-[0.2em] uppercase"
                                >
                                    TAP SCREEN 3 TIMES
                                </motion.p>

                                {/* Visual Progress Counter */}
                                <div className="flex items-center gap-4">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0 }}
                                            animate={{
                                                scale: rippleCount > i ? 1 : 0.5,
                                                backgroundColor: rippleCount > i ? '#BF00FF' : 'transparent',
                                                borderColor: rippleCount > i ? '#BF00FF' : '#BF00FF50'
                                            }}
                                            className="w-8 h-8 rounded-full border-2"
                                        />
                                    ))}
                                </div>

                                <p className="text-[12px] text-primary/60 font-black tracking-[0.3em] uppercase">
                                    {rippleCount < 3 ? `PROGRESS: ${rippleCount}/3` : 'STABILIZING...'}
                                </p>
                            </div>

                            {rippleCount >= 3 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[14px] text-[#FFD700] font-black uppercase tracking-widest text-center"
                                >
                                    ✓ REALITY_STABILIZED<br />
                                    <span className="text-[10px] text-primary/60">INITIATING_TRANSFER...</span>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 2: SEVER path */}
                    {step === 2 && ritualFeedback === 'FAILURE' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                            key="sever-result"
                        >
                            <div className="border border-red-500/40 bg-red-900/10 p-6">
                                <p className="text-[13px] text-red-500 font-black tracking-widest uppercase mb-4">
                                    LINK_SEVERED
                                </p>
                                <div className="h-[1px] bg-red-500/20 w-full" />
                                <p className="text-[11px] text-white font-black tracking-widest uppercase animate-pulse">
                                    Atonement_Ritual: Stabilize the nearest Ghost Echo to restore your frequency.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    console.log("[ORACLE_TRACE] Accepting Atonement -> Navigating to Sandbox");
                                    onClose();
                                    const navigateEvent = new CustomEvent('navigate', { detail: 'sandbox' });
                                    window.dispatchEvent(navigateEvent);
                                }}
                                className="w-full py-4 bg-red-600 text-white font-black text-[10px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                            >
                                ACCEPT_ATONEMENT
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Suction Effect Overlay */}
            <AnimatePresence>
                {step === 3.5 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.2, filter: 'blur(0px)' }}
                        animate={{ opacity: 1, scale: 5, filter: 'blur(40px)' }}
                        onAnimationComplete={() => {
                            console.log("[ORACLE_TRACE] Suction Complete. Dispatching Navigate to Me.");
                            // Dispatch event FIRST to ensure listeners catch it before unmount might affect things
                            const navigateEvent = new CustomEvent('navigate', { detail: 'me?trigger=new_insight' });
                            window.dispatchEvent(navigateEvent);
                            // Then close
                            setTimeout(onClose, 50);
                        }}
                        className="fixed inset-0 z-[200] bg-white mix-blend-screen pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    )
}
