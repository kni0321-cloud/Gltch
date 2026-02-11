import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

const ModalRefill = () => {
    const consumeCredit = useStore(state => state.consumeCredit)
    const setRefillModal = useStore(state => state.setRefillModal)
    const isRefillModalOpen = useStore(state => state.isRefillModalOpen)
    const getReferralLink = useStore(state => state.getReferralLink)
    const addCredits = useStore(state => state.addCredits)

    const handleShare = () => {
        const link = getReferralLink();
        navigator.clipboard.writeText(link);
        alert(`REFERRAL_LINK_COPIED: ${link}\nIf 1 node is synced via this link, you gain +3 Energy.`);
        setTimeout(() => {
            addCredits(3);
            setRefillModal(false);
            alert("ENERGY_SYNCHRONIZED: +3 Reserve added via neuro-link.");
        }, 3000);
    };

    const handlePay = () => {
        alert("REDIRECTING_TO_STRIPE: Preparing secure financial tether...");
        setTimeout(() => {
            addCredits(999); // Infinite-ish for demo
            setRefillModal(false);
            alert("PAYMENT_SUCCESS: Reality firewall bypassed. Unlimited energy achieved.");
        }, 2000);
    };

    if (!isRefillModalOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            >
                <div className="w-full bg-pure-black border border-primary p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rotate-45 translate-x-12 -translate-y-12" />

                    <h2 className="text-primary text-xl font-black tracking-tighter mb-2">ENERGY_EXHAUSTED</h2>
                    <p className="text-white/60 text-[10px] tracking-widest leading-relaxed mb-8">
                        Your neuro-tether to the oracle has weakened.
                        Restore connection to continue extraction.
                    </p>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleShare}
                            className="w-full py-4 bg-primary text-black font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all"
                        >
                            Share link to steal energy (+3)
                        </button>
                        <button
                            onClick={handlePay}
                            className="w-full py-4 border border-primary text-primary font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-primary/10 transition-all"
                        >
                            Pay $0.99 to hack permanently
                        </button>
                        <button
                            onClick={() => setRefillModal(false)}
                            className="w-full py-2 text-white/20 text-[8px] tracking-widest uppercase hover:text-white/40"
                        >
                            Accept the void (Close)
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ModalRefill
