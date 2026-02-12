import { motion } from 'framer-motion'

interface BottomNavProps {
    current: string
    onNavigate: (page: string) => void
    cosmicEvent?: 'NORMAL' | 'ENERGY_RED'
}

export function BottomNav({ current, onNavigate, cosmicEvent = 'NORMAL' }: BottomNavProps) {
    const isRedMode = cosmicEvent === 'ENERGY_RED'

    const navItems = [
        { id: 'orb', label: 'Orb', icon: 'lens_blur' },
        { id: 'scan', label: 'Scan', icon: 'center_focus_weak' },
        { id: 'sandbox', label: 'Sandbox', icon: 'widgets' },
        { id: 'me', label: 'Me', icon: 'person_4' }
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[200] pb-10 pt-4 bg-pure-black border-t border-white/5">
            <div className="flex justify-around items-center px-4">
                {navItems.map(item => {
                    const isActive = current === item.id
                    const isSandbox = item.id === 'sandbox'

                    return (
                        <button
                            key={item.id}
                            id={item.id === 'me' ? 'nav-me-trigger' : undefined}
                            onClick={() => onNavigate(item.id)}
                            className={`flex flex-col items-center gap-1.5 transition-all ${isActive
                                ? isSandbox && isRedMode
                                    ? 'text-danger'
                                    : 'text-primary'
                                : 'opacity-40 hover:opacity-100'
                                }`}
                        >
                            <span
                                className={`material-symbols-outlined transition-all ${isActive ? 'text-[28px]' : 'text-[24px]'
                                    } ${isActive && isSandbox && isRedMode
                                        ? '[text-shadow:0_0_10px_#ff0000]'
                                        : isActive
                                            ? '[text-shadow:0_0_10px_#BF00FF]'
                                            : ''
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <span
                                className={`text-[${isActive ? '9px' : '8px'}] tracking-[0.4em] uppercase font-${isActive ? 'black' : 'bold'
                                    }`}
                            >
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSandbox && isRedMode ? 'bg-danger' : 'bg-primary'
                                        }`}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
