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
            arrowRot: 0
        },
        {
            id: 1,
            text: "TYPE HOW YOU FEEL RIGHT NOW.",
            targetClass: "top-[60%] left-1/2 -translate-x-1/2", // Input Position (Approx)
            arrowRot: 180
        },
        {
            id: 2,
            text: "COLLECT FREE ENERGY HERE.",
            targetClass: "bottom-4 right-8", // Me Tab Position (Approx)
            arrowRot: 45
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
                className="absolute inset-0 z-[999] pointer-events-none"
            >
                {/* Backdrop with "Hole" effect (Simulated via localized minimal opacity or just pure overlay with instructions) */}
                {/* CMO said: "Mask transparency can be slightly lowered". Let's use a dark overlay but keep target visible-ish */}
                <div className="absolute inset-0 bg-black/80" />

                {/* SKIP BUTTON (Always Interactive) */}
                <div className="absolute top-4 right-4 z-[1001] pointer-events-auto">
                    <button
                        onClick={onSkip}
                        className="text-white/40 text-xs font-bold border border-white/20 px-3 py-1 rounded-full hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                    >
                        [ SKIP ]
                    </button>
                </div>

                {/* Content Container */}
                <div className={`absolute ${currentStep.targetClass} z-[1000] flex flex-col items-center gap-4 w-64 pointer-events-none`}>

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
                        className="text-white text-[28px] font-bold leading-tight text-center drop-shadow-md uppercase font-sans"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                    >
                        {currentStep.text}
                    </motion.h2>
                </div>

                {/* CLICK CAPTURE ZONE (The "Hole") */}
                {/* This invisible button sits over the target area and advances the tutorial when clicked */}
                <div
                    className={`absolute ${currentStep.targetClass} z-[1001] w-32 h-32 cursor-pointer pointer-events-auto flex items-center justify-center`}
                    onClick={(e) => {
                        // Propagate click to underlying elements if possible? 
                        // Actually, for "Dummy Guide", we might just want to advance step and let user "simulate" the action.
                        // But CMO said "Don't Think". 
                        // Step 1: Click Sphere -> Triggers Orb Animation? 
                        // Let's just advance the tutorial step. Real interaction happens *after* tutorial or we simulate it?
                        // "Step 1: Tap to see luck." -> User taps -> Tutorial advances.
                        // Let's keep it simple: Click advances.
                        e.stopPropagation();
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
