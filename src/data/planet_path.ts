export interface StarData {
    id: string;
    name: string;
    region: string;
    coords: { x: number; y: number };
    tier: number; // 1: Rim, 2: Mid, 3: Core
    description: string;
}

const REAL_STARS: StarData[] = [
    { id: 'PLANET_KEPLER_186F', name: 'Kepler-186f', region: 'VOID_SECTOR_RIM', coords: { x: 80, y: 120 }, tier: 1, description: 'A rocky world at the cold edge of reality.' },
    { id: 'STAR_VEGA', name: 'Vega', region: 'MID_SECTOR_ALPHA', coords: { x: 220, y: 140 }, tier: 2, description: 'The zero-point beacon of the Lyra constellation.' },
    { id: 'STAR_SIRIUS', name: 'Sirius', region: 'MID_SECTOR_GAMMA', coords: { x: 290, y: 80 }, tier: 2, description: 'The brightest soul-spark in the winter sky.' },
    { id: 'CORE_SAGITTARIUS_A', name: 'Sagittarius A*', region: 'GALACTIC_CORE', coords: { x: 254, y: 168 }, tier: 3, description: 'The absolute singularity of the matrix.' },
];

export const generateGalaxy = (count: number = 1000): StarData[] => {
    const stars = [...REAL_STARS];
    const regions = ['VOID_SECTOR_9', 'NEBULA_DELTA', 'PULSAR_RIM', 'CORE_CLUSTER_7'];

    const greekPrefixes = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'OMEGA', 'SIGMA', 'ZETA', 'THETA', 'KAOS', 'NYX', 'EREBUS', 'VOID'];
    const techSuffixes = ['0x', 'v.', '::', '_'];

    for (let i = stars.length; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 300;
        const tier = radius < 150 ? 3 : radius < 250 ? 2 : 1;

        const prefix = greekPrefixes[Math.floor(Math.random() * greekPrefixes.length)];
        const hex = Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
        const suffix = techSuffixes[Math.floor(Math.random() * techSuffixes.length)];

        // Result: KAOS_0x7F, OMEGA::4A, VOID_v.99
        const demonicName = `${prefix}${suffix === '::' ? '::' : '_'}${suffix === '0x' ? '0x' : ''}${hex}`;

        stars.push({
            id: `STAR_PROC_${i}`,
            name: demonicName,
            region: regions[Math.floor(Math.random() * regions.length)],
            coords: {
                x: Math.floor(200 + Math.cos(angle) * (radius / 2)),
                y: Math.floor(200 + Math.sin(angle) * (radius / 2))
            },
            tier,
            description: 'A procedurally generated stability point in the mesh.'
        });
    }
    return stars;
};

export const GALAXY_MAP = generateGalaxy(1000);
