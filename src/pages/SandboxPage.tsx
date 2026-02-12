import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, VibeNode, Connection } from '../store/useStore';
import OracleCard from '../components/OracleCard';
import { aiService } from '../services/aiService';
import { TutorialOverlay } from '../components/TutorialOverlay';

const SandboxPage = ({ onNavigate }: { onNavigate: (page: string, id?: string) => void }) => {
    const { vibeNodes, connections, cosmicEvent, generateGhostEchoes, knowledgePoints, missionState, stabilizeNode, lastImpactSector, dataShards, ghostFragments, consumeGhostFragment, addGhostFragment, hasSeenSandboxGuide } = useStore();
    const isRedMode = cosmicEvent === 'ENERGY_RED';
    const containerRef = useRef<HTMLDivElement>(null);

    interface SimNode extends VibeNode {
        x: number;
        y: number;
        vx: number;
        vy: number;
        ritualStatus?: 'STABLE' | 'FADING' | 'RECALIBRATING';
    }

    interface Cluster {
        id: string;
        name: string;
        tag: string;
        nodeIds: string[];
        centerX: number;
        centerY: number;
    }

    const [nodes, setNodes] = useState<SimNode[]>([]);
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [selectedNode, setSelectedNode] = useState<VibeNode | null>(null);
    const [systemNote, setSystemNote] = useState<string | null>(null);
    const [shockwaveMode, setShockwaveMode] = useState(false);
    const [hoveredConn, setHoveredConn] = useState<string | null>(null);
    const [showEcho, setShowEcho] = useState<VibeNode | null>(null);
    const [anchorProgress, setAnchorProgress] = useState(0);
    const [anchoringNodeId, setAnchoringNodeId] = useState<string | null>(null);
    const [showBurialModal, setShowBurialModal] = useState(false);
    const [burialPos, setBurialPos] = useState({ x: 0, y: 0 });
    const [burialText, setBurialText] = useState("");
    const [lastActionTime, setLastActionTime] = useState(Date.now());
    const [showCosmicPulse, setShowCosmicPulse] = useState(false);
    const [showBettingPanel, setShowBettingPanel] = useState(false);

    const nodesRef = useRef<SimNode[]>([]);

    // Initial Ghost Generation (Simulate location-based)
    useEffect(() => {
        // Mock current location for demo (New York)
        generateGhostEchoes(40.7128, -74.0060);
    }, []);

    // Anti-Idling Intervention
    useEffect(() => {
        const interval = setInterval(() => {
            if (Date.now() - lastActionTime > 12000 && missionState.step !== 'WEAVING') {
                const artifacts = nodes.filter(n => n.type === 'SYSTEM_ARTIFACT');
                if (artifacts.length > 0) {
                    const nearest = artifacts[0];
                    setSystemNote("Something is decaying here... Touch it.");
                    setSelectedNode(nearest); // Pan towards it
                    setLastActionTime(Date.now());
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastActionTime, nodes, missionState.step]);

    // 1. Sync React state to Ref for physics loop
    useEffect(() => {
        const isNewEntry = vibeNodes.length > nodesRef.current.length && nodesRef.current.length > 0;

        const initializedNodes = vibeNodes.map(node => {
            const existing = nodesRef.current.find(n => n.id === node.id);
            if (existing) return { ...node, x: existing.x, y: existing.y, vx: existing.vx, vy: existing.vy };

            return {
                ...node,
                x: Math.random() * (window.innerWidth - 100) + 50,
                y: Math.random() * (window.innerHeight - 200) + 100,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5
            } as SimNode;
        });

        if (isNewEntry) {
            setSystemNote("TIMELINE_UPDATED // ENTITY_STABILIZED");
            setShockwaveMode(true);
            const latest = initializedNodes[0];
            setSelectedNode(latest);
            setTimeout(() => {
                setSystemNote(null);
                setShockwaveMode(false);
            }, 3000);
        }

        // Auto-focus logic for mission state
        if (missionState.step === 'WEAVING' && missionState.targetNodeId) {
            const target = initializedNodes.find(n => n.id === missionState.targetNodeId);
            if (target) {
                setSystemNote("SIGNAL_STABILIZING // SECTOR_VEGA");
                setSelectedNode(target);
            }
        }

        nodesRef.current = initializedNodes;
        setNodes(initializedNodes);

        // Clustering Logic (Labels-based)
        const tagGroups: Record<string, string[]> = {};
        vibeNodes.forEach(node => {
            node.labels.forEach(tag => {
                if (!tagGroups[tag]) tagGroups[tag] = [];
                tagGroups[tag].push(node.id);
            });
        });

        const newClusters: Cluster[] = [];
        const clusterNames = ['Alpha', 'Gamma', 'Omega', 'Sigma', 'Prime'];

        Object.entries(tagGroups).forEach(([tag, ids], idx) => {
            if (ids.length >= 2) {
                newClusters.push({
                    id: `cluster-${idx}`,
                    name: `Zone_${clusterNames[idx % clusterNames.length]}: The ${tag.replace('#', '')} Resonator`,
                    tag: tag,
                    nodeIds: ids,
                    centerX: 0,
                    centerY: 0
                });
            }
        });
        setClusters(newClusters);
    }, [vibeNodes]);

    // 2. Physics Engine
    useEffect(() => {
        if (vibeNodes.length === 0) return;

        let animationId: number;
        const gravity = 0.04;
        const friction = 0.97;
        const charge = (shockwaveMode || isRedMode) ? -5000 : -1000;

        const tick = () => {
            const currentNodes = nodesRef.current.map(n => ({ ...n }));
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            for (let i = 0; i < currentNodes.length; i++) {
                const node = currentNodes[i];
                node.vx += (centerX - node.x) * gravity * 0.1;
                node.vy += (centerY - node.y) * gravity * 0.1;
                node.vx += (Math.random() - 0.5) * 0.15;
                node.vy += (Math.random() - 0.5) * 0.15;

                if (currentNodes.length > 1) {
                    for (let j = 0; j < currentNodes.length; j++) {
                        if (i === j) continue;
                        const other = currentNodes[j];
                        const dx = node.x - other.x;
                        const dy = node.y - other.y;
                        const distSq = dx * dx + dy * dy + 1;
                        const force = (charge * (shockwaveMode ? 2 : 1)) / distSq;
                        node.vx += (dx / Math.sqrt(distSq)) * force;
                        node.vy += (dy / Math.sqrt(distSq)) * force;
                    }
                }

                connections.forEach(conn => {
                    const isLinked = conn.source === node.id || conn.target === node.id;
                    if (isLinked) {
                        const otherId = conn.source === node.id ? conn.target : conn.source;
                        const other = currentNodes.find(n => n.id === otherId);
                        if (other) {
                            node.vx += (other.x - node.x) * (conn.entanglement_score / 100) * 0.04;
                            node.vy += (other.y - node.y) * (conn.entanglement_score / 100) * 0.04;
                        }
                    }
                });

                node.vx *= friction;
                node.vy *= friction;
                node.x += node.vx;
                node.y += node.vy;

                node.x = Math.max(40, Math.min(window.innerWidth - 40, node.x));
                node.y = Math.max(140, Math.min(window.innerHeight - 140, node.y));
            }

            nodesRef.current = currentNodes;
            setNodes(currentNodes);

            setClusters(prev => prev.map(c => {
                const cNodes = currentNodes.filter(n => c.nodeIds.includes(n.id));
                if (cNodes.length === 0) return c;
                return {
                    ...c,
                    centerX: cNodes.reduce((acc, n) => acc + n.x, 0) / cNodes.length,
                    centerY: cNodes.reduce((acc, n) => acc + n.y, 0) / cNodes.length
                };
            }));

            animationId = requestAnimationFrame(tick);
        };

        animationId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationId);
    }, [vibeNodes.length, connections.length, shockwaveMode, isRedMode]);

    const handleNodeClick = async (node: VibeNode) => {
        setLastActionTime(Date.now());
        if (node.type === 'GHOST_ECHO') {
            setShowEcho(node);
        } else if (node.type === 'SYSTEM_ARTIFACT') {
            const currentCredits = useStore.getState().credits;
            const secrets = useStore.getState().publicSecrets;
            const fragment = secrets[Math.floor(Math.random() * secrets.length)].text;

            useStore.setState({
                dataShards: useStore.getState().dataShards + 1,
                credits: currentCredits + 0.2,
                vibeNodes: vibeNodes.filter(n => n.id !== node.id)
            });
            setSystemNote(`DECODED_FRAGMENT: '${fragment}'`);
        } else if (node.type === 'BURIAL_FLOWER') {
            setSelectedNode(node);
        } else if (node.status === 'PENDING') {
            const timeLeft = Math.max(0, node.next_unlock_time - Date.now());
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            setSystemNote(isRedMode ? `VOID_LOCKED // ${hours}h ${mins}m` : `NODE_COLLAPSE_IN_PROGRESS // STABILIZING_IN ${hours}h ${mins}m`);
            setTimeout(() => setSystemNote(null), 3000);
        } else {
            setSelectedNode(node);
        }
    };

    const handleLongPressContainer = (e: React.PointerEvent) => {
        if (missionState.step === 'WEAVING') return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setBurialPos({ x, y });
        setShowBurialModal(true);
    };

    const handleBurialSubmit = async () => {
        if (!burialText.trim()) return;

        const response = await aiService.analyze({ text: burialText, persona: 'SANDBOX' });
        const crypticSecret = await aiService.filterSecret(burialText);

        // Save to public secrets for others to scavenge
        const currentSecrets = useStore.getState().publicSecrets;
        useStore.setState({ publicSecrets: [{ text: crypticSecret, timestamp: Date.now() }, ...currentSecrets].slice(0, 50) });

        useStore.getState().addVibeNode({
            id: `burial-${Date.now()}`,
            type: 'BURIAL_FLOWER',
            labels: ['#WITHERED_FLOWER', ...response.labels],
            oracle: response.oracle_text,
            timestamp: Date.now()
        } as any);

        setShowBurialModal(false);
        setBurialText("");
        setSystemNote("SECRET_COMPOSTED // REALITY_FLOWER_BORN");
    };

    return (
        <div className="flex flex-col h-screen bg-pure-black overflow-hidden relative font-mono">
            {/* PHYSICAL EXIT BUTTON */}
            <button
                onClick={() => onNavigate('orb')}
                className="absolute top-8 right-8 z-[350] w-12 h-12 border border-white/20 bg-black/40 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all rounded-full"
            >
                <span className="material-symbols-outlined text-white text-[24px]">close</span>
            </button>
            {/* Burial Modal */}
            <AnimatePresence>
                {showBurialModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[250] bg-black/90 backdrop-blur-md flex items-center justify-center p-8"
                    >
                        <div className="w-full max-w-sm border border-primary/40 bg-[#050505] p-6 space-y-6 shadow-[0_0_50px_rgba(191,0,255,0.3)]">
                            <h3 className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">Burial Site Initiated</h3>
                            <p className="text-white/60 text-[9px] uppercase leading-relaxed">Leave a secret here that you want the universe to compost.</p>
                            <input
                                type="text"
                                autoFocus
                                value={burialText}
                                onChange={(e) => setBurialText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBurialSubmit()}
                                className="w-full bg-transparent border-b border-primary/40 p-2 text-primary text-xs focus:outline-none focus:border-primary font-mono"
                                placeholder="TYPE_YOUR_SHADOW..."
                            />
                            <div className="flex gap-4">
                                <button onClick={handleBurialSubmit} className="flex-1 py-3 bg-primary text-black font-black text-[10px] tracking-widest uppercase">COMPOST</button>
                                <button onClick={() => setShowBurialModal(false)} className="flex-1 py-3 border border-white/10 text-white/40 font-black text-[10px] tracking-widest uppercase">ABANDON</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Holographic Projection Overlay for Ghost Echoes */}
            <AnimatePresence>
                {showEcho && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`absolute inset-0 z-[200] flex items-center justify-center p-8 backdrop-blur-sm ${isRedMode ? 'bg-red-900/30' : 'bg-black/80'
                            }`}
                        onClick={() => setShowEcho(null)}
                    >
                        <div className={`max-w-md w-full border p-8 relative overflow-hidden holographic-scroll shadow-[0_0_50px_rgba(191,0,255,0.2)] ${isRedMode ? 'border-danger/50 bg-[#1a0505]' : 'border-primary/50 bg-[#050505]'
                            }`}>
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-50 ${isRedMode ? 'via-danger' : 'via-primary'
                                }`} />
                            <div className="absolute bottom-0 right-0 p-4 opacity-20">
                                <span className={`material-symbols-outlined text-[100px] ${isRedMode ? 'text-danger' : 'text-primary'
                                    }`}>fingerprint</span>
                            </div>

                            <h3 className={`text-xs font-black tracking-[0.4em] mb-6 uppercase border-b pb-4 ${isRedMode ? 'text-danger border-danger/20' : 'text-primary border-primary/20'
                                }`}>
                                {isRedMode ? 'CORRUPTED_ECHO //' : 'Echo_Resonance //'} {showEcho.id.slice(-4).toUpperCase()}
                            </h3>

                            <p className={`text-sm leading-loose font-mono relative z-10 ${isRedMode ? 'text-red-200/90 [text-shadow:0_0_5px_rgba(255,0,0,0.3)]' : 'text-white/90 [text-shadow:0_0_5px_rgba(191,0,255,0.3)]'
                                }`}>
                                {isRedMode
                                    ? `[RECORD_BURNED] ${showEcho.content?.replace(/\./g, '...').toUpperCase()} [DATA_CORRUPTED]`
                                    : showEcho.content
                                }
                            </p>


                            <button
                                onClick={() => {
                                    setShowEcho(null);
                                    // Award credits for collapsing echo
                                    const { credits, addGhostFragment } = useStore.getState();
                                    useStore.setState({ credits: credits + 0.1 });
                                    addGhostFragment();
                                }}
                                className={`w-full py-3 font-bold text-xs tracking-[0.6em] uppercase hover:bg-white transition-all ${isRedMode
                                    ? 'bg-danger text-white shadow-[0_0_15px_rgba(255,0,0,0.5)]'
                                    : 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.5)]'
                                    }`}
                            >
                                {isRedMode ? 'SALVAGE_FRAGMENT [ +0.1 Credits ]' : 'MISSION_ACCOMPLISHED [ +0.1 Credits ]'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* System Notifications Overlay */}
            <AnimatePresence>
                {systemNote && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                        className={`absolute top-24 left-1/2 -translate-x-1/2 z-[100] backdrop-blur-md border px-4 py-1 
                            ${isRedMode ? 'bg-danger/20 border-danger/40' : 'bg-primary/20 border-primary/40'}`}
                    >
                        <span className={`${isRedMode ? 'text-danger' : 'text-primary'} text-[10px] tracking-[0.4em] font-black uppercase`}>
                            {systemNote}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="px-6 pt-14 pb-4 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowBettingPanel(true)}
                            className={`w-10 h-10 border flex flex-col items-center justify-center transition-all ${isRedMode ? 'border-danger/40 bg-danger/10' : 'border-primary/40 bg-primary/10'} hover:scale-110`}
                        >
                            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                            <span className="text-[5px] font-black uppercase">Staking</span>
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <h1 className={`${isRedMode ? 'text-danger' : 'text-primary'} text-[11px] tracking-[0.6em] font-black uppercase`}>
                            {isRedMode ? 'VOID_FIELD_CRITICAL' : 'Fate_Dominion'}
                        </h1>
                        <p className={`text-[8px] tracking-[0.2em] mt-1 ${isRedMode ? 'text-danger/40' : 'text-white/30'}`}>
                            {isRedMode ? 'STABILITY_COMPROMISED // RED_EVENT' : 'MAP_STABILITY // SECURE'}
                        </p>
                        {/* Phase 3: Stability Index */}
                        <p className="text-[7px] text-primary/40 mt-1 font-mono">
                            STABILITY_INDEX: 0x{Math.max(0, 159 - (useStore.getState().stabilizeCount || 0) * 5).toString(16).toUpperCase().padStart(2, '0')}
                        </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] text-primary/60 font-black uppercase">XP: {knowledgePoints} // Echos: {vibeNodes.filter(n => n.type === 'GHOST_ECHO').length}</span>
                        <div className="w-16 h-[2px] bg-primary/20 mt-1">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }} animate={{ width: `${Math.min(vibeNodes.length * 5, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main
                ref={containerRef}
                className="flex-1 relative"
                onPointerDown={(e) => {
                    if (e.target === containerRef.current) {
                        const timer = setTimeout(() => handleLongPressContainer(e), 800);
                        const clear = () => {
                            clearTimeout(timer);
                            window.removeEventListener('pointerup', clear);
                        };
                        window.addEventListener('pointerup', clear);
                    }
                }}
            >
                {/* Shockwave Radial Flare */}
                <AnimatePresence>
                    {(shockwaveMode || isRedMode) && (
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: isRedMode ? [2, 4, 3, 5] : 4, opacity: [1, 0] }}
                            transition={{ duration: isRedMode ? 2 : 1.5, ease: "easeOut", repeat: isRedMode ? Infinity : 0 }}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 z-0 pointer-events-none
                                ${isRedMode ? 'border-danger/20' : 'border-primary/40'}`}
                        />
                    )}
                </AnimatePresence>

                {/* Cluster Zones */}
                <AnimatePresence>
                    {clusters.map(cluster => (
                        <motion.div
                            key={cluster.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            style={{
                                left: cluster.centerX - 100,
                                top: cluster.centerY - 100,
                                width: 200, height: 200,
                                background: `radial-gradient(circle, ${isRedMode ? '#FF0000' : '#BF00FF'} 0%, transparent 70%)`
                            }}
                            className="absolute pointer-events-none rounded-full blur-3xl z-0"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                                <span className={`text-[6px] ${isRedMode ? 'text-danger' : 'text-primary'} font-black tracking-[0.5em] uppercase opacity-60`}>
                                    {cluster.name}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {connections.map((conn) => {
                        const source = nodes.find(n => n.id === conn.source);
                        const target = nodes.find(n => n.id === conn.target);
                        if (!source || !target) return null;

                        const midX = (source.x + target.x) / 2;
                        const midY = (source.y + target.y) / 2;
                        const connId = `${conn.source}-${conn.target}`;

                        return (
                            <g key={connId} className="group pointer-events-auto cursor-help"
                                onMouseEnter={() => setHoveredConn(connId)}
                                onMouseLeave={() => setHoveredConn(null)}
                            >
                                <motion.line
                                    x1={source.x} y1={source.y}
                                    x2={target.x} y2={target.y}
                                    stroke={isRedMode ? "#FF0000" : "#BF00FF"}
                                    strokeWidth={2 + (conn.entanglement_score / 40)}
                                    animate={{
                                        opacity: hoveredConn === connId ? 0.9 : [0.2, 0.5, 0.3, 0.7, 0.3],
                                    }}
                                    className={`opacity-30 blur-[1px]`}
                                />
                                {/* Flowing Light Particle */}
                                <motion.circle
                                    r="2"
                                    fill={isRedMode ? "#FF0000" : "#BF00FF"}
                                    className="blur-[2px]"
                                    animate={{
                                        cx: [source.x || 0, target.x || 0],
                                        cy: [source.y || 0, target.y || 0],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 3 / (conn.entanglement_score / 20 || 1),
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                                {hoveredConn === connId && (
                                    <foreignObject x={midX - 60} y={midY - 15} width="120" height="50">
                                        <div className={`px-2 py-1 bg-black/95 border ${isRedMode ? 'border-danger text-danger' : 'border-primary text-primary'} text-[7px] font-black tracking-widest uppercase flex flex-col items-center backdrop-blur-md shadow-[0_0_15px_rgba(191,0,255,0.4)]`}>
                                            <span className="mb-0.5">[{source.labels[0]}_RESONANCE]</span>
                                            <div className="h-[1px] w-full bg-current opacity-20 mb-0.5" />
                                            <span>Entanglement: {conn.entanglement_score}%</span>
                                        </div>
                                    </foreignObject>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {nodes.map(node => {
                    const isPending = node.status === 'PENDING';
                    const isGhost = node.type === 'GHOST_ECHO';
                    const isCritical = node.entropyStatus === 'CRITICAL';
                    const timeLeft = Math.max(0, node.next_unlock_time - Date.now());
                    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                    const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

                    return (
                        <motion.div
                            key={node.id}
                            style={{
                                x: node.x - 20,
                                y: node.y - 20,
                                opacity: isGhost ? 0.6 : Math.max(0.2, 1 - (Date.now() - node.timestamp) / (1000 * 60 * 60 * 24 * 7))
                            }}
                            animate={isCritical ? {
                                x: [node.x - 20, node.x - 25, node.x - 15, node.x - 20],
                                skewX: [0, -20, 20, 0],
                                filter: ["hue-rotate(0deg) contrast(100%)", "hue-rotate(270deg) contrast(200%)", "hue-rotate(0deg) contrast(100%)"]
                            } : {}}
                            transition={isCritical ? { duration: 0.1, repeat: Infinity } : {}}
                            onPointerDown={() => {
                                if (missionState.step === 'WEAVING' && node.id === missionState.targetNodeId) {
                                    setAnchoringNodeId(node.id);
                                    let progress = 0;
                                    const interval = setInterval(() => {
                                        progress += 2;
                                        setAnchorProgress(progress);
                                        if (progress >= 100) {
                                            clearInterval(interval);
                                            stabilizeNode(node.id);
                                            setAnchoringNodeId(null);
                                            setAnchorProgress(0);
                                            setSystemNote("SOUL_ANCHORED // SECTOR_VEGA");
                                        }
                                    }, 20);
                                    const cleanup = () => {
                                        clearInterval(interval);
                                        setAnchoringNodeId(null);
                                        setAnchorProgress(0);
                                        window.removeEventListener('pointerup', cleanup);
                                    };
                                    window.addEventListener('pointerup', cleanup);
                                } else {
                                    handleNodeClick(node);
                                }
                            }}
                            className={`absolute w-10 h-10 flex items-center justify-center cursor-pointer group transition-all
                                ${selectedNode?.id === node.id ? 'scale-125 z-50' : (missionState.step === 'WEAVING' ? 'opacity-20 z-0' : 'z-10')}
                                ${isPending ? 'grayscale opacity-40 blur-[1px]' : ''}
                                ${isGhost ? 'ghost-pulse' : ''}
                                ${isCritical ? 'drop-shadow-[0_0_10px_#ff0000]' : ''}`}
                        >
                            <div className="relative">
                                {/* Electric Arcs Filter only on target during Weaving */}
                                {missionState.step === 'WEAVING' && missionState.targetNodeId === node.id && (
                                    <div className="absolute inset-[-20px] pointer-events-none">
                                        <div className="w-full h-full border border-primary/40 rounded-full animate-ping opacity-50" />
                                        <div className="w-full h-full border-2 border-primary/20 rounded-full animate-pulse blur-sm" />
                                    </div>
                                )}
                                <div className={`w-6 h-6 border rotate-45 flex items-center justify-center transition-all
                                    ${node.chainId ? 'border-dashed border-primary shadow-[0_0_10px_#BF00FF]' : ''}
                                    ${node.labels?.includes('DEBRIS') ? 'border-none debris-fragment w-4 h-4 rotate-12' :
                                        isGhost ? 'border-white/40' :
                                            node.type === 'SYSTEM_ARTIFACT' ? 'border-primary/40 animate-pulse' :
                                                node.type === 'BURIAL_FLOWER' ? 'border-primary/80 bg-primary/10' :
                                                    isCritical ? 'border-red-600 bg-red-900/40' :
                                                        node.ritualStatus === 'STABLE' ? 'border-[#FFD700] shadow-[0_0_10px_#FFD700]' :
                                                            node.ritualStatus === 'FADING' ? 'border-red-500/40 opacity-50' :
                                                                (selectedNode?.id === node.id ? (isRedMode ? 'border-danger bg-danger/20' : 'border-primary bg-primary/20') :
                                                                    isPending ? 'border-white/20' : (isRedMode ? 'border-danger/60' : 'border-primary/60'))}`}
                                >
                                    {isPending ? (
                                        <span className={`material-symbols-outlined text-[10px] ${node.ritualStatus === 'FADING' ? 'text-red-500 animate-pulse' : 'text-white/40'} -rotate-45`}>
                                            {node.ritualStatus === 'FADING' ? 'priority_high' : 'lock'}
                                        </span>
                                    ) : (
                                        <div className={`w-2 h-2 ${node.labels?.includes('DEBRIS') ? 'hidden' :
                                            isGhost ? 'bg-white/40' :
                                                node.type === 'SYSTEM_ARTIFACT' ? 'bg-primary' :
                                                    node.type === 'BURIAL_FLOWER' ? 'bg-primary shadow-[0_0_10px_#BF00FF]' :
                                                        isCritical ? 'bg-red-500 animate-ping' :
                                                            node.ritualStatus === 'STABLE' ? 'bg-[#FFD700]' :
                                                                node.ritualStatus === 'FADING' ? 'bg-red-500' :
                                                                    (isRedMode ? 'bg-danger' : 'bg-primary')} ${selectedNode?.id === node.id && !node.labels?.includes('DEBRIS') ? 'animate-ping' : ''}`} />
                                    )}
                                </div>
                                {!isPending && !isGhost && selectedNode?.id === node.id && (
                                    <motion.div
                                        layoutId="highlight-ring"
                                        className={`absolute inset-0 border rotate-45 animate-ping ${isCritical ? 'border-red-500' : (isRedMode ? 'border-danger' : 'border-primary')}`}
                                    />
                                )}
                            </div>

                            <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity pointer-events-none flex flex-col items-center gap-1
                                ${selectedNode?.id === node.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <span className={`text-[7px] ${node.chainId ? 'text-white border-primary shadow-[0_0_5px_#BF00FF]' : isGhost ? 'text-white/40 border-white/10' : (isCritical ? 'text-red-500 border-red-500/40' : (isRedMode ? 'text-danger border-danger/40' : 'text-primary border-primary/20'))} tracking-[0.2em] font-black bg-black/80 px-1.5 border uppercase`}>
                                    {node.chainId ? `OTHER_SOUL // ${node.chainId}` : isCritical ? 'ENTROPY_CRITICAL' : (isGhost ? 'GHOST_ECHO' : (node.labels?.[1] || node.labels?.[0]))}
                                </span>
                                {isPending && (
                                    <span className="text-[6px] text-white/40 tracking-widest font-bold">
                                        COLLAPSING: {hours}H {mins}M
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                <AnimatePresence>
                    {selectedNode && (
                        <div className="relative">
                            <OracleCard node={selectedNode} onClose={() => setSelectedNode(null)} />

                            {/* Ghost Fragment Consumption Overlay */}
                            {ghostFragments.length > 0 && selectedNode.ritualStatus !== 'STABLE' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[250] w-[90%] max-w-sm"
                                >
                                    <button
                                        onClick={() => {
                                            setShowCosmicPulse(true);
                                            consumeGhostFragment(selectedNode.id);
                                            setTimeout(() => {
                                                setShowCosmicPulse(false);
                                                setSelectedNode(null);
                                                setSystemNote(`NODE_STABILIZED // +10 SOVEREIGNTY`);
                                            }, 2000);
                                        }}
                                        className="w-full py-4 bg-gradient-to-r from-primary via-[#8B00FF] to-primary text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_40px_rgba(191,0,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse"
                                    >
                                        [ STABILIZE_WITH_GHOST ] [{ghostFragments.length} AVAILABLE]
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {missionState.step === 'WEAVING' && missionState.targetNodeId && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[5] bg-black/80 backdrop-blur-sm pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Long-press Anchor Whisper */}
                <AnimatePresence>
                    {missionState.step === 'WEAVING' && selectedNode?.id === missionState.targetNodeId && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-20 z-50 text-center pointer-events-none"
                        >
                            <p className="text-primary text-[10px] font-black tracking-[0.4em] uppercase animate-pulse">
                                "Long press to anchor your existence here."
                            </p>
                            {anchoringNodeId && (
                                <div className="mt-4 w-48 h-1 bg-white/10 mx-auto overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary shadow-[0_0_10px_#BF00FF]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${anchorProgress}%` }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    <div className="scanlines" />
                </div>
            </main>

            <nav className="pb-10 pt-4 bg-pure-black border-t border-white/5 relative z-10 w-full">
                <div className="flex justify-around items-center px-4">
                    <button onClick={() => onNavigate('orb')} className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[24px]">lens_blur</span>
                        <span className="text-[8px] tracking-[0.4em] uppercase font-bold">Orb</span>
                    </button>
                    <button onClick={() => onNavigate('scan')} className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[24px]">center_focus_weak</span>
                        <span className="text-[8px] tracking-[0.4em] uppercase font-bold">Scan</span>
                    </button>
                    <button className={`flex flex-col items-center gap-1.5 ${isRedMode ? 'text-danger' : 'text-primary'}`}>
                        <span className={`material-symbols-outlined text-[28px] ${isRedMode ? '[text-shadow:0_0_10px_#ff0000]' : '[text-shadow:0_0_10px_#BF00FF]'}`}>widgets</span>
                        <span className="text-[9px] tracking-[0.4em] uppercase font-black">Sandbox</span>
                    </button>
                    <button onClick={() => onNavigate('me')} className="flex flex-col items-center gap-1.5 group">
                        <span className={`material-symbols-outlined text-[24px] transition-all
                            ${missionState.step === 'IDLE' && lastImpactSector ? 'text-primary animate-pulse [text-shadow:0_0_10px_#BF00FF]' : 'text-white/40 opacity-100'}`}>
                            person_4
                        </span>
                        <span className={`text-[8px] tracking-[0.3em] uppercase font-bold
                            ${missionState.step === 'IDLE' && lastImpactSector ? 'text-primary' : 'text-white/30'}`}>Me</span>
                    </button>
                </div>
            </nav>

            {/* Betting Panel Overlay */}
            <AnimatePresence>
                {showBettingPanel && (
                    <motion.div
                        initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                        className="absolute inset-y-0 left-0 w-64 z-[300] bg-black/95 border-r border-primary/30 p-6 flex flex-col backdrop-blur-xl"
                    >
                        <div className="flex justify-between items-center mb-8 border-b border-primary/20 pb-4">
                            <h3 className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">Fate_Staking</h3>
                            <button onClick={() => setShowBettingPanel(false)} className="material-symbols-outlined text-primary text-sm">close</button>
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto">
                            <section>
                                <p className="text-white/60 text-[8px] uppercase leading-relaxed mb-4">Stake Credits on current Sector resonance. Double return if stabilized in 24H.</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => useStore.getState().placeVaultBet(1, 'CHAIN_ALPHA')} className="py-2 border border-primary/40 text-primary text-[9px] font-black hover:bg-primary/20">[ 1.0¢ ]</button>
                                    <button onClick={() => useStore.getState().placeVaultBet(5, 'CHAIN_ALPHA')} className="py-2 border border-primary/40 text-primary text-[9px] font-black hover:bg-primary/20">[ 5.0¢ ]</button>
                                </div>
                            </section>

                            <div className="h-[1px] bg-primary/10 w-full" />

                            <section>
                                <h4 className="text-[7px] text-white/30 uppercase tracking-widest mb-3">Active_Stakes</h4>
                                {useStore.getState().vaultBets.map((bet, i) => (
                                    <div key={i} className="p-2 border border-white/5 bg-white/5 mb-2 flex justify-between items-center">
                                        <span className="text-[8px] text-white font-mono">{bet.amount}¢</span>
                                        <span className="text-[6px] text-primary animate-pulse tracking-tighter">RESOLVING...</span>
                                    </div>
                                ))}
                                {useStore.getState().vaultBets.length === 0 && <p className="text-[6px] text-white/20 italic">No active stakes detected.</p>}
                            </section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* COSMIC_PULSE Visual Effect */}
            <AnimatePresence>
                {showCosmicPulse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.8, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="fixed inset-0 z-[300] pointer-events-none"
                    >
                        <motion.div
                            animate={{
                                scale: [0, 3, 5],
                                opacity: [1, 0.6, 0]
                            }}
                            transition={{ duration: 2 }}
                            className="absolute inset-0 bg-gradient-radial from-primary/40 via-primary/20 to-transparent"
                        />
                        <motion.div
                            animate={{
                                scale: [0, 2, 4],
                                opacity: [1, 0.8, 0]
                            }}
                            transition={{ duration: 2, delay: 0.3 }}
                            className="absolute inset-0 bg-gradient-radial from-[#8B00FF]/40 via-[#8B00FF]/20 to-transparent"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0, rotate: 0 }}
                                animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 360] }}
                                transition={{ duration: 2 }}
                                className="text-primary text-[120px] opacity-80"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>auto_fix_high</span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!hasSeenSandboxGuide && nodes.some(n => n.type === 'GHOST_ECHO') && (
                <TutorialOverlay
                    step={0}
                    onNext={() => useStore.setState({ hasSeenSandboxGuide: true })}
                    onSkip={() => useStore.setState({ hasSeenSandboxGuide: true })}
                    steps={[
                        {
                            id: 0,
                            text: "TOUCH A GHOST ECHO TO RECLAIM MEMORY.",
                            targetClass: `top-[${Math.round((nodes.find(n => n.type === 'GHOST_ECHO')?.y || 200) / window.innerHeight * 100)}%] left-[${Math.round((nodes.find(n => n.type === 'GHOST_ECHO')?.x || 200) / window.innerWidth * 100)}%]`,
                            arrowRot: 0,
                            triggerId: nodes.find(n => n.type === 'GHOST_ECHO')?.id
                        }
                    ]}
                />
            )}
        </div >
    );
};

export default SandboxPage;
