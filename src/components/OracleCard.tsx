import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VibeNode, useStore } from '../store/useStore';

interface OracleCardProps {
    node: VibeNode;
    onClose: () => void;
}

const OracleCard = ({ node, onClose }: OracleCardProps) => {
    const { cosmicEvent, subscriptionStatus, calibrationLocks, setCalibrationLock, ghostFragments, consumeGhostFragment } = useStore();
    const [activeLens, setActiveLens] = useState<'mythic' | 'zen' | 'quantum'>('mythic');
    const [isSharing, setIsSharing] = useState(false);
    const [isAnchoring, setIsAnchoring] = useState(false);
    const isRedMode = cosmicEvent === 'ENERGY_RED';
    const isSGrade = node.rarity === 'S-GRADE';

    // Reverse QR Abstract Pattern Generator
    const generateReverseQR = () => {
        const blocks = [];
        const seed = node.shareable_token || 'GLTCH';
        for (let i = 0; i < 25; i++) {
            const opacity = (seed.charCodeAt(i % seed.length) % 10) / 10;
            blocks.push(<div key={i} className="w-full h-full border border-white/5" style={{ backgroundColor: themeColor, opacity: opacity * 0.4 }} />);
        }
        return blocks;
    };

    // Calibration Lock Logic
    const lockTime = calibrationLocks[node.id];
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!lockTime) return;

        const updateTimer = () => {
            const diff = lockTime - Date.now();
            if (diff <= 0) {
                setTimeLeft(null);
            } else {
                setTimeLeft(diff);
            }
        };

        const timer = setInterval(updateTimer, 1000);
        updateTimer();
        return () => clearInterval(timer);
    }, [lockTime]);

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours}H ${mins}M ${secs}S`;
    };

    const handleCalibrate = () => {
        if (timeLeft) return;
        setCalibrationLock(node.id);
    };

    const fragmentCount = Array.isArray(ghostFragments) ? ghostFragments.length : 0;
    const canAnchor = fragmentCount > 0 && node.ritualStatus !== 'STABLE';

    const handleAnchor = () => {
        if (!canAnchor) return;

        setIsAnchoring(true);
        consumeGhostFragment(node.id);

        setTimeout(() => {
            setIsAnchoring(false);
        }, 1500);
    };

    const getLensContent = () => {
        if (!node.readings) return "The void remains silent.";
        return node.readings[activeLens];
    };

    const isLocked = (lens: string) => {
        return subscriptionStatus === 'FREE' && lens !== 'quantum';
    };

    const themeColor = isRedMode ? '#FF0000' : '#BF00FF';
    const textColor = isRedMode ? 'text-danger' : 'text-primary';
    const borderColor = isRedMode ? 'border-danger/60' : 'border-primary/40';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col justify-end"
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {isRedMode && (
                <>
                    <div className="absolute top-[20%] w-full h-[1px] bg-danger/30 shadow-[0_0_8px_#ff0000] skew-y-[-2deg] pointer-events-none" />
                    <div className="absolute top-[45%] w-full h-[1px] bg-danger/20 shadow-[0_0_8px_#ff0000] skew-y-[-2deg] pointer-events-none" />
                    <div className="absolute inset-0 bg-radial-at-center from-danger/10 to-danger/30 mix-blend-color-burn pointer-events-none" />
                </>
            )}

            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`relative w-full max-w-md mx-auto h-[88vh] bg-[#121212] border-t ${borderColor} flex flex-col overflow-hidden shadow-2xl`}
            >
                {/* S-GRADE Glory Aura */}
                {isSGrade && (
                    <div className={`absolute inset-0 pointer-events-none z-0 ${isRedMode ? 'bg-danger/5' : 'bg-primary/5'} animate-pulse`} />
                )}

                {/* Texture Overlays */}
                <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: `linear-gradient(to bottom, transparent 50%, ${themeColor}10 50%)`, backgroundSize: '100% 2px' }} />

                {/* Header */}
                <div className="w-full h-12 flex flex-col items-center justify-center border-b border-white/10 relative z-10 font-mono">
                    <div className={`w-12 h-[1px] ${isRedMode ? 'bg-danger shadow-[0_0_8px_#ff0000]' : 'bg-primary'} mb-1`}></div>
                    <div className="flex items-center gap-4 w-full px-6 justify-between">
                        <span className={`text-[9px] tracking-[0.3em] ${isRedMode ? 'text-danger/80' : 'text-primary/60'}`}>
                            {isRedMode ? 'ENERGY_RED // RETROGRADE' : (isSGrade ? 'S-GRADE_RARITY // MYTHIC' : 'ANALYSIS_MODE_V3.0')}
                        </span>
                        <span className={`text-[9px] tracking-[0.3em] ${isRedMode ? 'text-danger/80 italic' : 'text-primary/60'}`}>
                            {isRedMode ? 'CRITICAL_STATE' : 'DEEP_DIVE'}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto relative z-10 p-6 pt-4">
                    <AnimatePresence mode="wait">
                        {isSharing ? (
                            <motion.div
                                key="share"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="flex flex-col items-center justify-center h-full gap-8 py-10"
                            >
                                <div className="text-center">
                                    <h2 className={`text-xl font-black tracking-[0.5em] uppercase ${textColor}`}>Quantum_Link</h2>
                                    <p className="text-[10px] text-white/40 mt-2 tracking-widest uppercase">Scan frequency to bridge reality</p>
                                </div>

                                {/* Reverse QR Code */}
                                <div className="w-48 h-48 border border-white/10 p-2 relative bg-black">
                                    <div className="grid grid-cols-5 grid-rows-5 w-full h-full">
                                        {generateReverseQR()}
                                    </div>
                                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-primary" />
                                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-primary" />
                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-primary" />
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-primary" />
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[12px] text-white font-mono tracking-widest">{node.shareable_token}</span>
                                    <div className="px-3 py-1 bg-primary/20 border border-primary/40">
                                        <span className="text-[8px] text-primary font-black uppercase tracking-[0.3em]">Protocol_S_Grade</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsSharing(false)}
                                    className="mt-4 px-8 py-3 border border-white/20 text-white/60 text-[10px] tracking-widest uppercase hover:bg-white/5"
                                >
                                    Back to Archive
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Lens Switcher */}
                                <div className="flex justify-center gap-3 mb-8">
                                    {(['mythic', 'zen', 'quantum'] as const).map((lens) => (
                                        <button
                                            key={lens}
                                            onClick={() => setActiveLens(lens)}
                                            className={`w-10 h-10 border flex items-center justify-center group relative transition-all
                                                ${activeLens === lens
                                                    ? (isRedMode ? 'border-danger bg-danger/10' : 'border-primary bg-primary/10')
                                                    : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <span className={`material-symbols-outlined text-[18px] 
                                                ${activeLens === lens
                                                    ? (isRedMode ? 'text-danger' : 'text-primary')
                                                    : 'text-white/40'}`}>
                                                {lens === 'mythic' ? 'account_balance' : lens === 'zen' ? 'landslide' : 'blur_on'}
                                            </span>
                                            {isLocked(lens) && (
                                                <span className="absolute -top-1 -right-1 material-symbols-outlined text-[8px] text-white/20">lock</span>
                                            )}
                                        </button>
                                    ))}
                                    <div className="ml-auto flex items-center">
                                        <span className="text-[7px] text-white/20 tracking-[0.4em] uppercase [writing-mode:vertical-lr] rotate-180">Ternary_Shift</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h1 className="font-display text-2xl tracking-widest text-white/90 uppercase" style={{ fontFamily: "'Cinzel', serif" }}>{isSGrade ? 'MYTHIC_ARCHIVE' : 'ANIMA_ARCHIVE'}</h1>
                                        <p className={`font-serif italic text-xs mt-1 ${isRedMode ? 'text-danger/60' : 'text-white/40'}`}>
                                            {isRedMode ? '"The essence destabilizes under Mercury\'s gaze."' : (isSGrade ? '"A fragment of the eternal code, rare and shimmering."' : '"The essence captured in silicon bonds."')}
                                        </p>
                                    </div>
                                    <div className="text-right font-mono">
                                        <div className={`text-[10px] ${isRedMode ? 'text-danger' : 'text-primary'} font-bold uppercase`}>LAT: 40.7128° N</div>
                                        <div className={`text-[10px] ${isRedMode ? 'text-danger' : 'text-primary'} font-bold uppercase`}>LON: 74.0060° W</div>
                                        <div className="text-[8px] text-white/20 mt-1 uppercase">Flux Variance: {isRedMode ? 'HIGH' : 'LOW'}</div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-8 font-mono">
                                    <div className={`border ${isRedMode ? 'border-danger/20 bg-danger/5' : 'border-white/5 bg-white/[0.02]'} p-3 relative overflow-hidden`}>
                                        {isRedMode && <div className="absolute top-0 right-0 p-1"><span className="material-symbols-outlined text-[10px] text-danger">warning</span></div>}
                                        <span className="text-[8px] text-white/40 uppercase block mb-1 font-bold">Soul_Node_Frequency</span>
                                        <span className={`text-lg transition-colors ${isRedMode ? 'text-danger' : 'text-primary'} tracking-tighter`}>
                                            {isRedMode ? '999.66' : (node.frequency * 88.24).toFixed(2)}<span className="text-xs ml-1 font-light opacity-60">THz</span>
                                        </span>
                                        <div className="w-full h-[2px] bg-white/5 mt-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: isRedMode ? '92%' : `${node.vibe_score}%` }}
                                                className={`h-full ${isRedMode ? 'bg-danger' : 'bg-primary/40'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className={`border ${isRedMode ? 'border-danger/20' : 'border-white/5'} p-3 bg-white/[0.02]`}>
                                        <span className="text-[8px] text-white/40 uppercase block mb-1 font-bold">Etheric_Density</span>
                                        <span className="text-lg text-white/80 tracking-tighter">
                                            {isRedMode ? 'ERR.V04' : `0.00${(node.vibe_score / 10).toFixed(2)}`}<span className="text-xs ml-1 font-light opacity-60">ρ</span>
                                        </span>
                                        <div className="mt-2 flex gap-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={`w-1 h-1 ${isRedMode ? (i <= 2 ? 'bg-danger shadow-[0_0_4px_#ff0000]' : 'bg-danger') : (i <= (node.vibe_score / 30) ? 'bg-primary' : 'bg-white/10')}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Geometry Visual */}
                                <div className={`relative w-full aspect-square border ${isRedMode ? 'border-danger/20 bg-danger/[0.02]' : 'border-white/10 bg-black/40'} mb-8 flex items-center justify-center overflow-hidden`}>
                                    <div className="absolute inset-0 opacity-20">
                                        <svg height="100%" width="100%">
                                            <pattern id="redGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke={isRedMode ? '#FF0000' : 'white'} strokeWidth="0.2" />
                                            </pattern>
                                            <rect width="100%" height="100%" fill="url(#redGrid)" />
                                        </svg>
                                    </div>
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: isRedMode ? 5 : 20, repeat: Infinity, ease: 'linear' }}
                                            className={`absolute inset-0 border-[0.5px] ${isRedMode ? 'border-danger/40' : 'border-primary/40'} rounded-full ${isRedMode ? '' : 'animate-pulse'}`}
                                        />
                                        <div className="absolute inset-4 border-[0.5px] border-white/20 rotate-45" />
                                        <div className="absolute inset-4 border-[0.5px] border-white/20 -rotate-45" />
                                        <div className={`absolute inset-10 border-[0.5px] ${isRedMode ? 'border-danger/60' : 'border-primary/60'} rounded-full`} />

                                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 ${isRedMode ? 'bg-danger shadow-[0_0_8px_#FF0000]' : 'bg-primary shadow-[0_0_8px_#BF00FF]'}`} />
                                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 ${isRedMode ? 'bg-danger shadow-[0_0_8px_#FF0000]' : 'bg-primary'}`} />
                                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white" />
                                        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white" />

                                        {/* Sovereignty Stamp */}
                                        <div className="z-10 bg-black/90 p-3 border border-primary/40 backdrop-blur-md flex flex-col items-center">
                                            <span className={`text-[10px] ${isRedMode ? 'text-danger' : 'text-primary'} font-bold font-mono tracking-tighter uppercase`}>
                                                {node.celestial_coords?.starName ? node.celestial_coords.starName : (isSGrade ? 'MYTHIC_STABLE' : 'CORE_STABLE')}
                                            </span>
                                            {node.celestial_coords && (
                                                <div className="mt-1 flex flex-col items-center">
                                                    <span className="text-[6px] text-white/40 tracking-[0.2em]">RA: {node.celestial_coords.ra}</span>
                                                    <span className="text-[6px] text-white/40 tracking-[0.2em]">DEC: {node.celestial_coords.dec}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Sovereignty Controller */}
                                {node.celestial_coords && (
                                    <div className={`mb-8 p-4 border ${isRedMode ? 'border-danger/40 bg-danger/5' : 'border-primary/20 bg-primary/5'} backdrop-blur-md`}>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`text-[8px] font-black tracking-[0.3em] uppercase ${isRedMode ? 'text-danger' : 'text-primary'}`}>Sovereignty_Status</span>
                                            <span className="text-[8px] text-white/40">CALIBRATION_HASH: {node.id.slice(-6).toUpperCase()}</span>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                <span className="text-[10px] text-white/80 font-mono">Current Architect:</span>
                                                <span className="text-[10px] text-primary font-black uppercase">
                                                    {useStore.getState().globalRegistry[node.celestial_coords.starName] || 'VOID_NULL'}
                                                </span>
                                            </div>

                                            <div className="flex gap-2 mt-2">
                                                {!useStore.getState().globalRegistry[node.celestial_coords.starName] ? (
                                                    <button
                                                        onClick={() => useStore.getState().claimSovereignty(node.celestial_coords!.starName, 'USER_001')}
                                                        className="flex-1 py-2 bg-primary text-black text-[9px] font-black tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(191,0,255,0.4)]"
                                                    >
                                                        [ CLAIM_SECTOR ]
                                                    </button>
                                                ) : useStore.getState().globalRegistry[node.celestial_coords.starName] !== 'USER_001' ? (
                                                    <button
                                                        onClick={() => useStore.getState().claimSovereignty(node.celestial_coords!.starName, 'USER_001', true)}
                                                        className="flex-1 py-2 bg-white/10 border border-white/20 text-white text-[9px] font-black tracking-widest uppercase hover:bg-red-600/20 hover:border-red-600 transition-all"
                                                    >
                                                        [ HIJACK_RESONANCE ]
                                                    </button>
                                                ) : (
                                                    <div className="flex-1 py-2 border border-primary/40 bg-primary/10 text-primary text-center text-[9px] font-black tracking-widest uppercase">
                                                        SOVEREIGNTY_ACTIVE // ARCHITECT
                                                    </div>
                                                )}
                                                <button className="px-4 py-2 border border-white/10 text-white/40 text-[9px] font-black hover:text-white hover:border-white transition-all">
                                                    CERT
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <motion.div
                                    key={activeLens}
                                    initial={{ x: 10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -10, opacity: 0 }}
                                    className={`mb-8 border-l ${isRedMode ? 'border-danger/50' : 'border-primary/30'} pl-4 py-2 ${isLocked(activeLens) ? 'blur-[3px]' : ''}`}
                                >
                                    <h3 className={`font-display text-xs ${isRedMode ? 'text-danger' : 'text-primary/80'} mb-2 uppercase tracking-[0.15em]`}>
                                        Codex Entry: {activeLens === 'mythic' ? 'Ancient_Oracle' : activeLens === 'zen' ? 'Flow_State' : 'Quantum_Field'}
                                    </h3>
                                    <p className="font-serif text-[13px] leading-relaxed text-white/60 italic">
                                        "{getLensContent()}"
                                    </p>
                                    {isLocked(activeLens) && (
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-[8px] text-primary/60 font-mono uppercase tracking-widest">Upgrade to GLTCH+ to unlock this lens</span>
                                        </div>
                                    )}
                                </motion.div>

                                <div className="border-t border-white/10 pt-4 flex justify-between items-end font-mono">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[7px] text-white/30 uppercase tracking-[0.2em]">Flux Capacitor Link</span>
                                        <div className="flex items-center gap-1">
                                            <div className={`w-1 h-1 ${isRedMode ? 'bg-red-600 animate-pulse' : 'bg-green-500'}`} />
                                            <span className={`text-[9px] font-mono ${isRedMode ? 'text-danger/80' : 'text-white/70'} tracking-tighter uppercase`}>
                                                {isRedMode ? 'INTERRUPTED' : 'ESTABLISHED'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[7px] text-white/30 uppercase tracking-[0.2em]">Encryption_Key</span>
                                        <div className={`text-[9px] font-mono ${isRedMode ? 'text-danger' : 'text-primary'} tracking-tighter`}>
                                            {isRedMode ? 'AES-256:GLTCH_VOID_0' : `SHA-256:${node.id.slice(0, 8).toUpperCase()}`}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className={`p-6 gap-4 border-t border-white/5 bg-black/40 relative z-20 ${canAnchor || fragmentCount === 0 || node.ritualStatus === 'STABLE' ? 'grid grid-cols-1' : 'grid grid-cols-2'
                    }`}>
                    {canAnchor ? (
                        <button
                            onClick={handleAnchor}
                            disabled={isAnchoring}
                            className="w-full py-4 bg-primary text-black font-black text-[10px] tracking-[0.4em] uppercase shadow-[0_0_30px_rgba(191,0,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnchoring ? 'ANCHORING...' : `ANCHOR_WITH_FRAGMENT [${fragmentCount} Available]`}
                        </button>
                    ) : fragmentCount === 0 ? (
                        <button
                            disabled
                            className="w-full py-4 bg-white/10 border border-white/20 text-white/40 font-black text-[10px] tracking-[0.4em] uppercase cursor-not-allowed"
                        >
                            NO_FRAGMENTS (Seek fragments in the Oracle first)
                        </button>
                    ) : node.ritualStatus === 'STABLE' ? (
                        <div className="w-full py-4 border border-[#FFD700]/40 bg-[#FFD700]/10 text-center">
                            <p className="text-[#FFD700] font-black text-[10px] tracking-widest uppercase">
                                ✓ ALREADY_STABLE
                            </p>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={isSharing ? () => setIsSharing(false) : () => setIsSharing(true)}
                                className="border border-white/20 py-4 text-[10px] tracking-[0.3em] uppercase text-white/60 hover:bg-white/5 transition-colors font-mono"
                            >
                                {isSharing ? 'DISMISS' : 'SHARE_QUANTUM'}
                            </button>
                            <button
                                disabled={!!timeLeft || isSharing}
                                onClick={handleCalibrate}
                                className={`py-4 font-bold text-[10px] tracking-[0.3em] uppercase transition-all font-mono border border-white/20
                                    ${(timeLeft || isSharing)
                                        ? 'bg-white/5 text-white/20'
                                        : (isRedMode
                                            ? 'bg-danger text-white shadow-[0_0_25px_#FF0000]'
                                            : 'bg-primary text-black shadow-[0_0_15px_rgba(191,0,255,0.4)] hover:brightness-110')}`}
                            >
                                {timeLeft ? formatTime(timeLeft) : 'RE-CALIBRATE'}
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OracleCard;
