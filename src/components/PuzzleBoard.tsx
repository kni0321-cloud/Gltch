import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioService } from '../services/audioService';

interface PuzzleBoardProps {
    fragments: any[];
    onClose: () => void;
    onComplete: () => void;
}

export const PuzzleBoard = ({ fragments, onClose, onComplete }: PuzzleBoardProps) => {
    // Map ghost fragments to puzzle pieces
    const [pieces, setPieces] = useState<{
        id: string;
        x: number;
        y: number;
        rotation: number;
        isLocked: boolean;
        content: string;
    }[]>([]);

    const [isComplete, setIsComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize pieces with random positions
        if (fragments.length > 0 && pieces.length === 0) {
            const newPieces = fragments.slice(0, 4).map((f, i) => ({
                id: f.id,
                // Random start pos within a reasonable range relative to center
                x: (Math.random() - 0.5) * 150,
                y: (Math.random() - 0.5) * 150 + 100, // Start lower down
                rotation: (Math.random() - 0.5) * 45,
                isLocked: false,
                content: f.content_stable || "ENCRYPTED_SIGIL"
            }));
            setPieces(newPieces);
        }
    }, [fragments]);

    // Check for completion
    useEffect(() => {
        if (pieces.length > 0 && pieces.every(p => p.isLocked)) {
            if (!isComplete) {
                setIsComplete(true);
                audioService.playSingingBowl(); // Success sound as per previous file usage
                setTimeout(onComplete, 2500); // Wait for visual effect
            }
        }
    }, [pieces, isComplete, onComplete]);

    const handleDragEnd = (id: string, info: any) => {
        const pieceIndex = pieces.findIndex(p => p.id === id);
        if (pieceIndex === -1) return;

        // Target positions (2x2 grid centered)
        // Let's define the grid relative to center (0,0)
        // Top-Left (-50, -50), Top-Right (50, -50), etc.
        // Assuming 100px grid cells.
        const targets = [
            { x: -55, y: -55 },
            { x: 55, y: -55 },
            { x: -55, y: 55 },
            { x: 55, y: 55 }
        ];

        // Safety check if we have more fragments than targets
        const target = targets[pieceIndex % targets.length];

        // Update position based on drag
        // Framer Motion 'drag' modifies the transform, but we need to update React state to 'snap' it.
        // The 'info.point' is screen coordinates, 'info.offset' is total drag distance.
        // We need to calculate the *new* logical position.

        // Simpler approach: Just update x/y with offset and check distance.
        const currentPiece = pieces[pieceIndex];
        const newX = currentPiece.x + info.offset.x;
        const newY = currentPiece.y + info.offset.y;

        const dist = Math.sqrt(Math.pow(newX - target.x, 2) + Math.pow(newY - target.y, 2));

        const newPieces = [...pieces];

        if (dist < 60) { // Snap threshold (generous)
            newPieces[pieceIndex].x = target.x;
            newPieces[pieceIndex].y = target.y;
            newPieces[pieceIndex].rotation = 0;
            newPieces[pieceIndex].isLocked = true;
            audioService.playClick();
            // Haptic
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
        } else {
            // Just drop it where it is
            newPieces[pieceIndex].x = newX;
            newPieces[pieceIndex].y = newY;
        }

        setPieces(newPieces);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 overflow-hidden"
        >
            {/* Header / Instructions */}
            <div className="absolute top-10 left-0 right-0 text-center pointer-events-none z-10">
                <h2 className="text-[#FFD700] text-sm font-black tracking-[0.4em] uppercase mb-2 animate-pulse">
                    ⚠️ CONSTRUCTION_RITUAL ⚠️
                </h2>
                <p className="text-[#FFD700]/60 text-[10px] tracking-widest uppercase">
                    Drag Fragments to Fuse Reality
                </p>
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-12 h-12 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors z-[310] rounded-full"
            >
                <span className="material-symbols-outlined">close</span>
            </button>

            {/* The Board (Drop Zones) */}
            {/* We center everything 0,0 */}
            <div className="relative w-full h-full flex items-center justify-center">

                {/* Visual Grid Background */}
                <div className="absolute w-64 h-64 border-2 border-dashed border-[#FFD700]/20 rounded-xl grid grid-cols-2 gap-2 p-2 pointer-events-none">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="border border-[#FFD700]/5 bg-[#FFD700]/5 rounded flex items-center justify-center">
                            <span className="text-[#FFD700]/10 text-2xl font-black">+</span>
                        </div>
                    ))}
                    {/* Crosshairs */}
                    <div className="absolute top-1/2 left-[-10%] right-[-10%] h-[1px] bg-[#FFD700]/20" />
                    <div className="absolute left-1/2 top-[-10%] bottom-[-10%] w-[1px] bg-[#FFD700]/20" />
                </div>

                {/* The Pieces */}
                {pieces.map((piece) => (
                    <motion.div
                        key={piece.id}
                        drag={!piece.isLocked}
                        dragMomentum={false}
                        dragElastic={0.1}
                        onDragEnd={(_, info) => handleDragEnd(piece.id, info)}
                        initial={{ x: piece.x, y: piece.y, rotate: piece.rotation, scale: 0 }}
                        animate={{
                            x: piece.x,
                            y: piece.y,
                            rotate: piece.rotation,
                            scale: piece.isLocked ? 1 : 1.1,
                            zIndex: piece.isLocked ? 1 : 100,
                            borderWidth: piece.isLocked ? '2px' : '1px'
                        }}
                        whileDrag={{ scale: 1.2, cursor: 'grabbing', zIndex: 120 }}
                        // Crucial: define position absolute so x/y works as offset from center
                        className={`absolute w-24 h-24 bg-black border border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)] flex items-center justify-center p-2 cursor-grab active:cursor-grabbing
                            ${piece.isLocked ? 'shadow-[0_0_30px_rgba(255,215,0,0.5)] border-[#FFD700]' : 'hover:border-white'}
                        `}
                    >
                        <p className="text-[#FFD700] text-[6px] font-mono leading-tight text-center break-words overflow-hidden max-h-full opacity-80 select-none pointer-events-none">
                            {piece.content.slice(0, 60)}...
                        </p>

                        {/* Locked Indicator */}
                        <AnimatePresence>
                            {piece.isLocked && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-[#FFD700]/20 flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-[#FFD700] text-2xl">lock</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Completion Effect Overlay */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-[400] bg-[#FFD700] flex flex-col items-center justify-center text-black mix-blend-normal"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="border-8 border-black p-8 text-center"
                        >
                            <h1 className="text-6xl font-black tracking-tighter uppercase mb-4">
                                SYNTHESIS
                            </h1>
                            <p className="text-xl font-mono tracking-widest uppercase font-bold">
                                REALITY_ANCHORED
                            </p>
                            <p className="text-sm font-black text-black/60 mt-4 tracking-[0.2em]">
                                + 2.0 CREDITS ACQUIRED
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
