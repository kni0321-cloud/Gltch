import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import OrbPage from './pages/OrbPage'
import ScanPage from './pages/ScanPage'
import SandboxPage from './pages/SandboxPage'
import MePage from './pages/MePage'
import { OraclePage } from './pages/OraclePage'
import ModalRefill from './components/ModalRefill'
import { sensorService } from './services/sensorService'
import { useStore } from './store/useStore'

function App() {
    const [currentPage, setCurrentPage] = useState('orb')
    const [isBooting, setIsBooting] = useState(true)
    const [bootProgress, setBootProgress] = useState(0)
    const { currentViewTaskId, setCurrentViewTaskId } = useStore(); // Using Flattened State
    const [isNavigating, setIsNavigating] = useState(false)

    useEffect(() => {
        const startTime = performance.now();
        useStore.getState().initialize(); // Auth Check
        sensorService.init();

        // Initialize Tracking
        import('./services/trackingService').then(({ trackingService }) => {
            trackingService.init(import.meta.env.VITE_GA_MEASUREMENT_ID || "");
            const hydrationTime = performance.now() - startTime;
            trackingService.trackPerformance(Math.round(hydrationTime));
        });

        const duration = 1200;
        const interval = 20;
        const increment = 100 / (duration / interval);
        const progressTimer = setInterval(() => {
            setBootProgress(prev => prev >= 100 ? 100 : prev + increment);
        }, interval);
        const bootTimer = setTimeout(() => setIsBooting(false), duration)
        return () => {
            clearTimeout(bootTimer);
            clearInterval(progressTimer);
        }
    }, [])

    const handleNavigate = (page: string, id?: string) => {
        if (isNavigating) return;
        setIsNavigating(true);
        console.log(`[ROUTING_TRACE] Navigating: ${currentPage} -> ${page} ${id ? `(Id: ${id})` : ''}`);

        setCurrentPage(page);
        if (id) setCurrentViewTaskId(id);

        // Anti-bounce guard
        setTimeout(() => setIsNavigating(false), 800);
    };

    // CRITICAL FIX: Global Navigate Listener (Dependency-free to prevent race conditions)
    useEffect(() => {
        const handleCustomNavigate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const destination = customEvent.detail;
            console.log('[APP_AUDIT] Navigation Event Intercepted:', destination);

            const page = destination.split('?')[0];

            // Bypass handleNavigate lock for system-critical events
            setCurrentPage(page);
            setIsNavigating(false); // Force unlock
        };

        window.addEventListener('navigate', handleCustomNavigate);
        return () => window.removeEventListener('navigate', handleCustomNavigate);
    }, []); // RUN ONCE, LISTEN ALWAYS

    return (
        <div className="relative min-h-screen w-full bg-pure-black max-w-md mx-auto overflow-hidden">
            <AnimatePresence>
                {isBooting && (
                    <motion.div
                        key="boot"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
                    >
                        <div className="flex flex-col items-center gap-6">
                            <motion.div
                                animate={{
                                    skewX: [0, -20, 20, -10, 0],
                                    x: [0, -2, 2, -1, 0],
                                    filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(0deg)"]
                                }}
                                transition={{ repeat: Infinity, duration: 0.15 }}
                                className="text-primary text-5xl font-black tracking-[0.6em] ml-[0.6em]"
                            >
                                GLTCH
                            </motion.div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-48 h-[1px] bg-primary/10 relative overflow-hidden">
                                    <motion.div
                                        style={{ width: `${bootProgress}%` }}
                                        className="h-full bg-primary shadow-[0_0_10px_#BF00FF]"
                                    />
                                </div>
                                <div className="flex justify-between w-48 text-[7px] font-mono text-primary/40 uppercase tracking-widest">
                                    <span>BRIDGE_INIT</span>
                                    <span>{Math.round(bootProgress)}%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grain-overlay" />
            <div className="scanlines" />

            <main className="relative z-[150] h-screen w-full flex flex-col">
                <AnimatePresence mode="wait">
                    {currentPage === 'orb' && (
                        <motion.div key="orb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                            <OrbPage
                                onInitiate={() => handleNavigate('scan')}
                                onNavigate={handleNavigate}
                            />
                        </motion.div>
                    )}
                    {currentPage === 'scan' && (
                        <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                            <ScanPage onNavigate={handleNavigate} />
                        </motion.div>
                    )}
                    {currentPage === 'sandbox' && (
                        <motion.div key="sandbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                            <SandboxPage onNavigate={handleNavigate} />
                        </motion.div>
                    )}
                    {currentPage === 'me' && (
                        <motion.div key="me" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                            <MePage onNavigate={handleNavigate} />
                        </motion.div>
                    )}
                    {currentPage === 'oracle' && currentViewTaskId && (
                        <OraclePage
                            taskId={currentViewTaskId}
                            onClose={() => handleNavigate('orb')}
                        />
                    )}
                </AnimatePresence>
            </main>
            <ModalRefill />
        </div>
    )
}

export default App
