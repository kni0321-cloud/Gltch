import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface TutorialOverlayProps {
    step: number;
    onNext: () => void;
    onSkip: () => void;
}

export const TutorialOverlay = ({ step, onNext, onSkip }: TutorialOverlayProps) => {
    // Step Definitions
    const steps = [
        {
            id: 0,
            text: "TAP THE EYE TO SEE YOUR LUCK.",
            targetClass: "top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2", // Orb Position (Approx)
            arrowRot: 0,
            triggerId: "orb-trigger"
        },
        {
            id: 1,
            text: "TYPE YOUR SOUL FREQUENCY.",
            targetClass: "top-[20%] left-1/2 -translate-x-1/2", // MATCHES TELEPORTED INPUT POSITION
            arrowRot: 180,
            triggerId: "input-trigger"
        },
        {
            id: 2,
            text: "COLLECT FREE ENERGY HERE.",
            targetClass: "bottom-4 right-8", // Me Tab Position (Approx)
            arrowRot: 45,
            triggerId: "nav-me-trigger" // Needs to be added to BottomNav if we want true sim, or we just rely on onNext logic for this one.
        }
    ];

    const currentStep = steps[step] || steps[0];

    // Auto-focus logic for Step 1 (Input)
    useEffect(() => {
        if (step === 1) {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input) input.focus();
        }
    }, [step]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[1100] pointer-events-none"
            >
                {/* Backdrop with "Hole" effect (Simulated via localized minimal opacity or just pure overlay with instructions) */}
                {/* CMO said: "Mask transparency can be slightly lowered". Let's use a dark overlay but keep target visible-ish */}
                <div className="absolute inset-0 bg-black/80" />

                {/* SKIP BUTTON (Always Interactive) */}
                <div className="absolute top-4 right-4 z-[1101] pointer-events-auto">
                    <button
                        onClick={onSkip}
                        className="text-white/40 text-xs font-bold border border-white/20 px-3 py-1 rounded-full hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                    >
                        [ SKIP ]
                    </button>
                </div>

                {/* Content Container */}
                <div className={`absolute ${currentStep.targetClass} z-[1100] flex flex-col items-center gap-4 w-64 pointer-events-none`}>

                    {/* Giant Finger / Indicator */}
                    <motion.div
                        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-primary drop-shadow-[0_0_15px_rgba(191,0,255,0.8)]"
                    >
                        <span className="material-symbols-outlined text-[80px]" style={{ transform: `rotate(${currentStep.arrowRot}deg)` }}>
                            touch_app
                        </span>
                    </motion.div>

                    {/* Bold Text */}
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-primary text-[24px] font-black leading-tight text-center drop-shadow-[0_2px_10px_rgba(0,0,0,1)] uppercase font-mono tracking-tighter"
                        style={{ textShadow: '0 0 20px rgba(191,0,255,0.5)' }}
                    >
                        {currentStep.text}
                    </motion.h2>
                </div>

                {/* CLICK CAPTURE ZONE (The "Hole") */}
                {/* This invisible button sits over the target area and advances the tutorial when clicked */}
                <div
                    className={`absolute ${currentStep.targetClass} z-[1101] w-32 h-32 cursor-pointer pointer-events-auto flex items-center justify-center`}
                    onClick={(e) => {
                        e.stopPropagation();

                        // SCHEME A: SIMULATE CLICK (CMO REQUIREMENT)
                        if (currentStep.triggerId) {
                            const target = document.getElementById(currentStep.triggerId);
                            if (target) {
                                console.log(`[TUTORIAL] Simulating click on #${currentStep.triggerId}`);
                                target.click();
                                // For inputs, click might not focus if it's a div wrapper.
                                if (currentStep.id === 1) {
                                    const input = target.querySelector('input');
                                    input?.focus();
                                }
                            }
                        }

                        onNext();
                    }}
                >
                    {/* Pulsing Target Ring */}
                    <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-50" />
                    <div className="absolute inset-0 border-2 border-white rounded-full opacity-80" />
                </div>

            </motion.div>
        </AnimatePresence>
    );
};
