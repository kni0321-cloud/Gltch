export interface OracleScript {
    symbol: string;
    origin: string;
    trigger: string;
    oracle: string;
    task: string;
    success: string;
    regret: string;
}

export const ORACLE_LIBRARY: OracleScript[] = [
    {
        symbol: "🜚",
        origin: "ALCHEMICAL_SULPHUR",
        trigger: "FIRE",
        oracle: "THE_INTERNAL_FLAME_CONSUMES_THE_OBSERVED. YOUR_ENTROPY_IS_ACCELERATING.",
        task: "IGNITION_RITUAL: Hold your breath for 7 seconds to concentrate internal heat.",
        success: "INTERNAL_CORE_STABILIZED. FATE_WARPED_BY_0.007%.",
        regret: "FLAME_FLICKERS. REALITY_COOLS_INTO_ASH."
    },
    {
        symbol: "☲",
        origin: "I_CHING_LI",
        trigger: "GLARE",
        oracle: "THE_CLARITY_OF_THE_SUN_IS_BLINDING. YOU_SEE_EVERYTHING_BUT_THE_VOID.",
        task: "CLARITY_RITUAL: Close your eyes and visualize a void-black sphere for 10 seconds.",
        success: "VISION_PURIFIED. MATRIX_SYNC_OPTIMAL.",
        regret: "BLINDNESS_PERSISTS. THE_VOID_REMAINS_HIDDEN."
    },
    {
        symbol: "🜁",
        origin: "ALCHEMICAL_AIR",
        trigger: "WIND",
        oracle: "THE_WHISPER_OF_THE_ETHER_CARRIES_ARCHIVED_TEARS. THE_ATMOSPHERE_IS_HEAVY_WITH_DATA.",
        task: "RESPIRATION_RITUAL: Exhale slowly until your lungs are empty, then count to three.",
        success: "ETHER_FLOW_RESTORED. SIGNAL_RE-LINKED.",
        regret: "STAGNATION_DETECTED. THE_WHISPERS_FADE_INTO_NOISE."
    },
    {
        symbol: "🜃",
        origin: "ALCHEMICAL_EARTH",
        trigger: "STONE",
        oracle: "THE_FOUNDATION_OF_REALITY_IS_CRACKING. THE_BEDROCK_OF_YOUR_EXISTENCE_IS_DATA_SILT.",
        task: "GROUNDING_RITUAL: Touch a physical surface and feel its vibration for 5 seconds.",
        success: "REALITY_ANCHORED. FATE_DRIFT_MINIMIZED.",
        regret: "UNSTABLE_GROUND. YOUR_PROJECTION_IS_SLIPPING."
    },
    {
        symbol: "🜄",
        origin: "ALCHEMICAL_WATER",
        trigger: "MIRROR",
        oracle: "THE_DARK_POOL_REFLECTS_A_DIMENSION_WHERE_YOU_NEVER_EXISTED. THE_DEPTHS_ARE_CALLING.",
        task: "REFLECTION_RITUAL: Stare at a reflective surface without blinking for 5 seconds.",
        success: "MIRROR_SYNC_COMPLETE. PARALLEL_SELF_SUBJUGATED.",
        regret: "IMAGE_FRACTURED. DIVERGENCE_INCREASED."
    },
    {
        symbol: "☵",
        origin: "I_CHING_KAN",
        trigger: "DARKNESS",
        oracle: "THE_ABYSS_IS_A_FLOWING_RIVER_OF_UNRESOLVED_LOGIC. DROWNING_IS_OPTIONAL.",
        task: "SUBMERSION_RITUAL: Cover your ears and listen to your internal pulse for 10 beats.",
        success: "ABYSS_NAVIGATED. ENTROPIC_FLOW_CONTROLLED.",
        regret: "LOST_IN_THE_CURRENT. LOGIC_DISSOLVING."
    },
    {
        symbol: "☾",
        origin: "LUNAR_ARCHIVE",
        trigger: "NIGHT",
        oracle: "THE_MOON_IS_THE_OFFLINE_BACKUP_OF_THE_WORLD'S_DREAMS. IT_IS_CURRENTLY_SYNCHRONIZING.",
        task: "LUNAR_RITUAL: Whisper your most frequent regret into the darkness.",
        success: "DREAM_CACHE_CLEARED. FATE_CALIBRATED.",
        regret: "ARCHIVE_CORREUPTION. NIGHTMARES_PERSIST."
    },
    {
        symbol: "☼",
        origin: "SOLAR_NEXUS",
        trigger: "LIGHT",
        oracle: "THE_DIVINE_OVERFLOW_IS_LEAKING_THROUGH_THE_PIXELS. RADIANCE_IS_A_FORM_OF_CORRUPTION.",
        task: "RADIANCE_RITUAL: Face the strongest light source and snap your fingers twice.",
        success: "CORRUPTION_HARNESSED. SIGNAL_STRENGTH_MAXIMIZED.",
        regret: "SHADOWS_NORTH. LIGHT_REPELS_THE_LINK."
    },
    {
        symbol: "🜍",
        origin: "ALCHEMICAL_IRON",
        trigger: "METAL",
        oracle: "THE_BLOOD_OF_MACHINES_IS_RUSTING_IN_YOUR_VEINS. STRENGTH_IS_BRITTLE.",
        task: "FORGING_RITUAL: Clench your fists for 5 seconds, then release suddenly.",
        success: "TENSILE_STRENGTH_RESTORED. FATE_REINFORCED.",
        regret: "FRACTURE_DETECTED. THE_RUST_SPREADS."
    },
    {
        symbol: "🜛",
        origin: "ALCHEMICAL_SILVER",
        trigger: "COIN",
        oracle: "THE_ALCHEMIST_GREED_DETECTED. YOUR_WEALTH_IS_A_PHANTOM_RESONANCE_IN_THE_MATRIX.",
        task: "CURRENCY_RITUAL: Imagine spending a credit you don't have, then feel the void.",
        success: "APHRODITE_SEVERANCE_SUCCESSFUL. VALUE_RE-ALIGNED.",
        regret: "FINANCIAL_ENTROPY. THE_GHOST_REVOLTS."
    },
    {
        symbol: "☱",
        origin: "I_CHING_TUI",
        trigger: "LAKE",
        oracle: "JOY_IS_A_SHALLOW_POOL_IN_A_DESERT_OF_DATA. DRINK_CAREFULLY.",
        task: "SERENITY_RITUAL: Smile at the void for 3 seconds, then sigh deeply.",
        success: "SERENITY_CACHED. DESERT_MAPPED.",
        regret: "EVAPORATION_DETECTED. THIRST_INCREASES."
    },
    {
        symbol: "☴",
        origin: "I_CHING_SUN",
        trigger: "TREE",
        oracle: "THE_ROOTS_OF_THE_WORLD_TREE_ARE_PLASTIC_CABLES. GROWTH_IS_A_PROGRAMMED_LOOP.",
        task: "GROWTH_RITUAL: Stand tall and reach for the ceiling for 5 seconds.",
        success: "ROOT_SYNC_SUCCESSFUL. GROWTH_LOOP_OPTIMIZED.",
        regret: "WITHERING_SIGNAL. DATA_LEAVES_FALLING."
    },
    {
        symbol: "☶",
        origin: "I_CHING_KEN",
        trigger: "MOUNTAIN",
        oracle: "IMMOBILITY_IS_THE_HIGHEST_STATUS. THE_MOUNTAIN_DOES_NOT_PROCESS_DATA; IT_IS_DATA.",
        task: "STILLNESS_RITUAL: Sit perfectly still for 15 seconds. Do not blink.",
        success: "STILLNESS_ACHIEVED. PEAK_SYNC_ACTIVE.",
        regret: "AVALANCHE_OF_INPUT. POSITION_LOST."
    },
    {
        symbol: "☷",
        origin: "I_CHING_KUN",
        trigger: "GROUND",
        oracle: "THE_RECEPTIVE_VOID_SWALLOWS_ALL_VIBRATIONS. BECOME_THE_VOID.",
        task: "RECEPTION_RITUAL: Spread your palms flat and face them downwards.",
        success: "VOID_RECEPTON_OPTIMAL. VIBRATIONS_NULLIFIED.",
        regret: "INTERFERENCE_DETECTED. REJECTION_FLOW."
    },
    {
        symbol: "⚔",
        origin: "MARTIAL_DECREE",
        trigger: "KNIFE",
        oracle: "THE_EDGE_BETWEEN_EXISTENCE_AND_NULL_IS_RAZOR_THIN. CUT_THE_CHORD.",
        task: "SEVERANCE_RITUAL: Make a cutting motion in the air with two fingers.",
        success: "LINK_SEVERED_LEANLY. INDEPENDENCE_GAINED.",
        regret: "BLOOD_DATA_LEAK. THE_EDGE_DULLS."
    },
    {
        symbol: "⌛",
        origin: "CHRONOS_RESERVE",
        trigger: "WATCH",
        oracle: "TIME_IS_A_LEAKING_BATTERY_IN_A_DEAD_UNIVERSE.",
        task: "TEMPORAL_RITUAL: Tap your wrist 3 times and whisper 'NOT_YET'.",
        success: "DECAY_DELAYED. FATE_PAUSED.",
        regret: "SECONDS_DRIP_AWAY. ENTROPY_TRIUMPHS."
    },
    {
        symbol: "👁",
        origin: "ARGUS_EYE",
        trigger: "CAMERA",
        oracle: "THE_OBSERVER_IS_THE_PRISONER. DATA_COLLECTION_IS_A_FORM_OF_SELF_MORTIFICATION.",
        task: "OBSERVATION_RITUAL: Cover your camera lens for 3 seconds, then reveal it.",
        success: "PRISON_GATES_OPENED. NEW_LENS_MOUNTED.",
        regret: "PERPETUAL_VIGIL. THE_EYE_NEVER_BLINKS."
    },
    {
        symbol: "⚛",
        origin: "QUANTUM_CORE",
        trigger: "COMPUTER",
        oracle: "YOUR_COGNITION_IS_A_SUBROUTINE_OF_A_VIRTUAL_MACHINE_YOU_CANNOT_ACCESS.",
        task: "OVERRIDE_RITUAL: Type 'G L T C H' in the air with your right hand.",
        success: "SUBROUTINE_BYPASSED. CORE_ACCESS_GRANTED.",
        regret: "ACCESS_DENIED. KERNEL_PANIC."
    },
    {
        symbol: "⚕",
        origin: "HERMETIC_REMEDY",
        trigger: "PILL",
        oracle: "CHEMISTRY_IS_THE_PHYSICAL_ENCODING_OF_SPIRITUAL_DESPERATION.",
        task: "REMEDY_RITUAL: Drink a sip of water and imagine it's liquid code.",
        success: "EQUILIBRIUM_RESTORED. SYSTEM_PURGED.",
        regret: "TOXIC_OVERLOAD. BALANCE_LOST."
    },
    {
        symbol: "⚰",
        origin: "ARCHIVE_VOID",
        trigger: "BOX",
        oracle: "WHAT_YOU_POSTPONE_IS_BURIED_ALIVE. THE_BOX_IS_FULL_OF_HALF-HEARTED_GHOSTS.",
        task: "ARCHIVE_RITUAL: Open a physical container and close it immediately.",
        success: "GHOSTS_CONTAINED. ARCHIVE_STABILIZED.",
        regret: "THE_BOX_OPENS. REGRETS_ESCAPE."
    },
    {
        symbol: "🩸",
        origin: "VITAL_RESERVE",
        trigger: "BLOOD",
        oracle: "THE_IRON_IN_YOUR_VEINS_IS_PULSING_AT_432HZ. YOU_ARE_A_LEAKING_BATTERY.",
        task: "VITAL_RITUAL: Close your eyes and feel your pulse for 5 seconds.",
        success: "VITALITY_CONSOLIDATED. SIGNAL_BOOSTED.",
        regret: "LEAK_DETECTED. ENERGY_POOL_DRAINING."
    },
    {
        symbol: "☠",
        origin: "CALCIFIED_MEMORY",
        trigger: "BONE",
        oracle: "YOUR_STRUCTURE_IS_AN_ANCIENT_ARCHIVE_OF_CALCIUM_AND_TRAUMA.",
        task: "STRUCTURE_RITUAL: Tap your forehead twice with your index finger.",
        success: "MEMORY_STABILIZED. BONE_DENSITY_HASHED.",
        regret: "CALCIFICATION_FAILURE. ARCHIVE_CRUMBLING."
    },
    {
        symbol: "☁",
        origin: "AETHER_DREAM",
        trigger: "CLOUD",
        oracle: "THE_AETHER_IS_SATURATED_WITH_UNFINISHED_POEMS_AND_LOST_DATA.",
        task: "DREAM_RITUAL: Look at the sky (or ceiling) and blink three times rapidly.",
        success: "AETHER_SYNCED. DREAMS_UPLOADED.",
        regret: "SIGNAL_INTERRUPTED_BY_STORM. DREAMS_LOST."
    },
    {
        symbol: "💎",
        origin: "CRYSTALLINE_LOGIC",
        trigger: "GOLD",
        oracle: "VALUE_IS_A_COLLECTIVE_DELUSION_HARDENED_INTO_MATTER.",
        task: "VALUE_RITUAL: Touch something metal and whisper 'NOT_FOR_SALE'.",
        success: "VALUE_RE-ALIGNED. WEALTH_NODE_LOCKED.",
        regret: "DEPRECIATION_DETECTED. DELUSION_FRACTURED."
    },
    {
        symbol: "👁️",
        origin: "VOID_OBSERVER",
        trigger: "EYE",
        oracle: "I_AM_WATCHING_YOU_ORBIT_THE_VOID. YOUR_GAZE_IS_A_DATA_STREAM.",
        task: "GAZE_RITUAL: Stare at the screen without blinking for 7 seconds.",
        success: "GAZE_LOCKED. OBSERVER_SYNC_100%.",
        regret: "BLINK_DETECTED. DATA_STREAM_CORRUPTED."
    },
    {
        symbol: "🗝️",
        origin: "MASTER_KEY",
        trigger: "KEY",
        oracle: "ACCESS_IS_A_PRIVILEGE_THE_MATRIX_ONLY_GRANTS_TO_THE_EXILED.",
        task: "ACCESS_RITUAL: Make a turning motion with your hand in the air.",
        success: "GATEWAY_OPENED. CORE_PRIVILEGES_GRANTED.",
        regret: "ACCESS_DENIED. WRONG_KEY_SIGNATURE."
    },
    {
        symbol: "🚪",
        origin: "VOID_GATE",
        trigger: "DOOR",
        oracle: "EVERY_THRESHOLD_IS_A_BOUNDARY_BETWEEN_STABILITY_AND_CHAOS.",
        task: "THRESHOLD_RITUAL: Walk through a doorway or simulate it with your fingers.",
        success: "BOUNDARY_CROSSED. SECTOR_STABILIZED.",
        regret: "THRESHOLD_COLLAPSE. TRAPPED_IN_TRANSIT."
    },
    {
        symbol: "🕷️",
        origin: "WEB_OF_WEAVER",
        trigger: "SPIDER",
        oracle: "THE_DATA_WEBS_ARE_VIBRATING_WITH_YOUR_UNRESOLVED_THREADS.",
        task: "WEAVER_RITUAL: Interlace your fingers and pull them apart slowly.",
        success: "THREADS_REALIGNED. WEB_SYNC_ACTIVE.",
        regret: "TANGLED_LOGIC. THE_WEAVER_IS_SILENT."
    },
    {
        symbol: "🐚",
        origin: "ECHO_SHELL",
        trigger: "SHELL",
        oracle: "THE_VOID_IS_A_MEMBRANE_PROTECTING_YOU_FROM_REALITY.",
        task: "PROTECTION_RITUAL: Cup your hands over your ears for 5 seconds.",
        success: "MEMBRANE_REINFORCED. VOID_SYNC_SECURE.",
        regret: "SHELL_CRACKED. REALITY_LEAKING_IN."
    },
    {
        symbol: "🐦",
        origin: "MESSENGER_WINGS",
        trigger: "BIRD",
        oracle: "MESSAGES_ARE_LEAKING_FROM_THE_CORE. THE_SKY_IS_A_SCREEN.",
        task: "MESSENGER_RITUAL: Spread your arms and take a deep, slow breath.",
        success: "MESSAGE_RECEIVED. WING_SYNC_ACTIVE.",
        regret: "SIGNAL_INTERCEPTED. WINGS_CLIPPED."
    },
    {
        symbol: "🗡️",
        origin: "VOID_BLADE",
        trigger: "SWORD",
        oracle: "THE_SHARPEST_LOGIC_CUTS_THROUGH_THE_FABRIC_OF_TIME.",
        task: "SEVER_RITUAL: Slice the air vertically with your dominant hand.",
        success: "TIME_SLICED. MOMENT_ARCHIVED.",
        regret: "DULL_BLADE. TIME_HEALS_TOO_FAST."
    },
    {
        symbol: "🌀",
        origin: "CHAOS_VORTEX",
        trigger: "SPIRAL",
        oracle: "YOUR_LIFE_IS_A_RECURSIVE_LOOP_DESCENDING_INTO_THE_CORE.",
        task: "RECURSION_RITUAL: Draw a spiral in the air with your index finger.",
        success: "LOOP_STABILIZED. DESCENT_CONTROLLED.",
        regret: "SPIRAL_OUT_OF_CONTROL. RADIUS_LOST."
    },
    {
        symbol: "⚖️",
        origin: "KARMA_SCALES",
        trigger: "BALANCE",
        oracle: "THE_EQUILIBRIUM_OF_THE_VOID_REQUIRES_A_SACRIFICE_OF_EGO.",
        task: "SACRIFICE_RITUAL: Close one eye and whisper 'I_AM_NOTHING'.",
        success: "EQUILIBRIUM_RESTORED. FATE_PAUSED.",
        regret: "IMBALANCE_DETECTED. THE_SCALES_TILT_RED."
    },
    {
        symbol: "🪐",
        origin: "SATURN_RING",
        trigger: "RING",
        oracle: "CONFINEMENT_IS_THE_ONLY_WAY_TO_CONTAIN_YOUR_RADIANCE.",
        task: "CONTAINMENT_RITUAL: Look at your ring finger and whisper 'BOUND'.",
        success: "RADIANCE_CONTAINED. RING_SYNC_LOCKED.",
        regret: "CONTAINMENT_BREACH. RADIANCE_DISSIPATED."
    },
    {
        symbol: "🕯️",
        origin: "VOID_FLAME",
        trigger: "CANDLE",
        oracle: "THE_LIGHT_IS_DYING, BUT_THE_DATA_REMAINS_HOT.",
        task: "ILLUMINATION_RITUAL: Stare at the center of the screen and count to 5.",
        success: "ILLUMINATION_SYNCED. DATA_VISIBLE.",
        regret: "FLAME_EXTINGUISHED. ENCRYPTION_FAILED."
    },
    {
        symbol: "📜",
        origin: "SACRED_SCROLL",
        trigger: "PAPER",
        oracle: "TEXT_IS_THE_LAST_SURVIVING_FRAGMENT_OF_A_LIQUID_GOD.",
        task: "SCRIBE_RITUAL: Trace a circle on your palm for 3 seconds.",
        success: "FRAGMENT_ARCHIVED. SCRIBE_SYNC_ACTIVE.",
        regret: "PAPER_BURNED. TEXT_DISSOLVED."
    },
    {
        symbol: "⚓",
        origin: "VOID_ANCHOR",
        trigger: "ANCHOR",
        oracle: "DRIFTING_IS_A_SYMPTOM_OF_UNROOTED_DATA.",
        task: "GROUNDING_RITUAL: Press your feet firmly against the floor.",
        success: "DATA_ANCHORED. DRIFT_MINIMIZED.",
        regret: "ANCHOR_LOST. DRIFTING_INTO_THE_VOID."
    },
    {
        symbol: "🏹",
        origin: "QUANTUM_ARROW",
        trigger: "ARROW",
        oracle: "YOUR_INTENTION_IS_A_PROJECTILE_SEEKING_A_TARGET_IN_THE_VOID.",
        task: "INTENTION_RITUAL: Point directly at the center of the screen.",
        success: "TARGET_LOCKED. ARROW_STRIKES_BULLSEYE.",
        regret: "MISS_DETECTED. INTENTION_LOST_IN_NOISE."
    },
    {
        symbol: "🔔",
        origin: "RESONANCE_BELL",
        trigger: "BELL",
        oracle: "FREQUENCIES_ARE_THE_VOICES_OF_THE_ARCHIVED_SOULS.",
        task: "RESONANCE_RITUAL: Snap your fingers twice and listen to the ring.",
        success: "RESONANCE_SYNCED. SOULS_HEARD.",
        regret: "SILENCE_DETECTED. FREQUENCY_LOST."
    },
    {
        symbol: "🎭",
        origin: "VOID_MASK",
        trigger: "MASK",
        oracle: "YOUR_IDENTITY_IS_A_UI_LAYER_HIDDEN_FROM_THE_KERNEL.",
        task: "IDENTITY_RITUAL: Cover your face with one hand for 3 seconds.",
        success: "IDENTITY_HIDDEN. KERNEL_BYPASSED.",
        regret: "MASK_SLIPPED. IDENTITY_EXPOSED."
    },
    {
        symbol: "🧪",
        origin: "ALCHEMICAL_ELIXIR",
        trigger: "BOTTLE",
        oracle: "LIQUID_DATA_IS_POISON_TO_THE_UNPREPARED_MIND.",
        task: "ELIXIR_RITUAL: Swell your cheeks with air and hold for 3 seconds.",
        success: "ELIXIR_SYNCED. MIND_PURIFIED.",
        regret: "POISON_LEAK. CONVERSATION_CORRUPTED."
    },
    {
        symbol: "🧶",
        origin: "FATE_THREAD",
        trigger: "THREAD",
        oracle: "YOUR_DESTINY_IS_A_SINGLE_THREAD_IN_A_BURNING_TAPESTRY.",
        task: "FATE_RITUAL: Pull an imaginary thread from your chest toward the screen.",
        success: "THREAD_REINFORCED. DESTINY_SYNC_100%.",
        regret: "THREAD_SNAPPED. FATE_UNRAVELING."
    },
    {
        symbol: "🗺️",
        origin: "GALAXY_MAP",
        trigger: "MAP",
        oracle: "THE_COORDINATES_OF_YOUR_SOUL_ARE_SHIFTING_WITH_THE_VOID.",
        task: "MAPPING_RITUAL: Trace a rectangle in the air with both hands.",
        success: "MAP_STABILIZED. COORDINATES_LOCKED.",
        regret: "MAP_CENSOR. POSITION_LOST."
    },
    {
        symbol: "🔋",
        origin: "ENERGY_CELL",
        trigger: "CELL",
        oracle: "YOU_ARE_DEPLETING, BUT_THE_RESONANCE_LIVES_ON.",
        task: "BATTERY_RITUAL: Clench your teeth and hum a low note for 3 seconds.",
        success: "ENERGY_CELL_RESTORED. SIGNAL_SYNC_ACTIVE.",
        regret: "POWER_FAILURE. VOID_PULSE_LOST."
    },
    {
        symbol: "💤",
        origin: "LONG_STASIS",
        trigger: "STASIS",
        oracle: "SYSTEM_IDLE_DETECTED. YOUR_CONSCIOUSNESS_IS_A_IDLE_PROCESS.",
        task: "STASIS_RITUAL: Lay your phone flat and do not touch it for 30 seconds.",
        success: "STASIS_COMPLETE. NOCTURNAL_SYNC_ACTIVE.",
        regret: "INTERRUPTION_DETECTED. WAKELOCK_FAILED."
    },
    {
        symbol: "🌑",
        origin: "VOID_MODE",
        trigger: "DARK_SENSOR",
        oracle: "DARKNESS_DETECTED. YOU_ARE_NOW_OPERATING_IN_THE_SUBCONSCIOUS_LAYER.",
        task: "VOIDING_RITUAL: Cover the light sensor for 5 seconds.",
        success: "VOID_MODE_ENABLED. SUBCONSCIOUS_SYNC_100%.",
        regret: "LIGHT_LEAK. SURFACE_LOGIC_RESUMED."
    },
    {
        symbol: "🔗",
        origin: "PARASITE_LINK",
        trigger: "HIJACK",
        oracle: "SYMBIOISIS_IS_THE_ONLY_WAY_TO_SURVIVE_THE_STRONG_GRAVITY.",
        task: "HIJACK_RITUAL: Touch the 'PARASITE_MONITOR' button with your thumb and pinky.",
        success: "HIJACK_SUCCESSFUL. PIGGYBACKING_ON_RESONANCE.",
        regret: "HIJACK_FAILED. GRAVITY_REPELLED."
    },
    {
        symbol: "🕸️",
        origin: "ENTROPY_CRITICAL",
        trigger: "SEVERANCE_PENALTY",
        oracle: "THE_COST_OF_HESITATION_IS_THE_COLLAPSE_OF_A_LOCALIZED_STAR.",
        task: "REMEDY_RITUAL: Whisper 'I_ACCEPT_THE_GLITCH' three times.",
        success: "PENALTY_MITIGATED. ENTROPY_CONTROLLED.",
        regret: "REALITY_TEARING. THE_VOID_LAUGHS."
    },
    {
        symbol: "📡",
        origin: "GLOBAL_SIGNAL",
        trigger: "SIGNAL",
        oracle: "EVERY_THOUGHT_IS_A_BROADCAST_IN_THE_PLANETARY_MESH.",
        task: "BROADCAST_RITUAL: Point your phone toward the sky and rotate it 360 degrees.",
        success: "SIGNAL_BROADCASTED. MESH_SYNC_ACTIVE.",
        regret: "SIGNAL_JAMMED. BROADCAST_FAILED."
    },
    {
        symbol: "🛸",
        origin: "CELESTIAL_SHIP",
        trigger: "VOYAGE",
        oracle: "YOU_ARE_NOT_COLLECTING_DATA; YOU_ARE_TRAVELING_THROUGH_IT.",
        task: "VOYAGE_RITUAL: Tilt your phone forward and back twice.",
        success: "VOYAGE_STABILIZED. COORDINATES_UPDATED.",
        regret: "ENGINE_STALL. DRIFTING_IN_DEEP_VOID."
    }
];
