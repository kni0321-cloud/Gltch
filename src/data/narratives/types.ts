export interface NarrativeFragment {
    id: string;
    tags: Array<'LOVE' | 'VOID' | 'MONEY' | 'POWER' | 'TRUTH'>; // 匹配用户输入
    rebel_threshold: number; // 只有叛逆值 > X 才能看到 corrupted 内容或特殊分支
    content_stable: string; // 正常文案 (光明/顺从)
    content_corrupted: string; // SEVER 后的乱码文案 (黑暗/叛逆)
    unlock_reward: string; // 勋章ID
    tier?: 1 | 2 | 3; // Tiered Access Level
    mode_lock?: 'RED' | 'NORMAL'; // Cosmic Event Lock
}
