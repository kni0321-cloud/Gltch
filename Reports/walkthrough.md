# Causal Loop: Weaver's Protocol Implementation

We have successfully closed the loop. The application now functions as a cohesive mythic ritual, guiding the user from the Orb to the Void and back again.

## 1. Mission State Machine & Weaver's Protocol
The core logic has been implemented in `useStore.ts`. The application now tracks the user's progress through a defined state machine:
- **`IDLE`**: User roaming the galaxy.
- **`WEAVING`**: Sparked by the Oracle ritual. Triggers auto-focus in Sandbox.
- **`ANCHORING`**: The act of stabilizing a node via high-intensity interaction.

## 2. The Ritual Flow
The flow is now seamless and guided as requested by the CMO:

### Phase 1: The Weaving Ritual (Oracle -> Me)
In `OraclePage.tsx`, clicking `[ I_COMPLIED ]` no longer just records a task. It initiates the **Suction Sync**.
- **Visual**: A scaling blur overlay "sucks" the user into the data stream.
- **Routing**: Instant redirection to `/me?trigger=new_insight`.

### Phase 2: The Anchor Ritual (Me -> Sandbox)
In `MePage.tsx`, the `?trigger=new_insight` parameter triggers the **Impact Drawer**.
- **Mythic Copy**: "Your resonance has been woven into the archive."
- **CTA**: `LOCATE_THE_GLITCH_IN_THE_VOID` leads directly to the target node in Sandbox.

In `SandboxPage.tsx`, the target node is automatically focused with:
- **Environment Dimming**: Background nodes fade out.
- **Target Spotlight**: Electric arcs and pulses on the target.
- **Long-press Anchor**: Users must hold for 2s to stabilize, accompanied by haptic "heart-beats."

### Phase 3: The Achievement Loop (Sandbox -> Orb)
Upon stabilization, the user is returned to the Orb with **Shockwave Achievement** feedback.
- **Visual**: A massive radial expansion flare.
- **Dialogue**: "SECTOR_VEGA IS NOW STABLE. Ready for the next sync?"

## 4. Final Audit: User Extradition (Reference-03)
We have formalized the "User Extradition Flow" in [reference-03.md](file:///C:/Users/kni03/.gemini/antigravity/brain/b20acf20-0ab5-4e8d-9da3-576ffc5ef5b1/reference-03.md).
- **Silence Protocol**: A new `voidMode` (accessible in MePage header) replaces camera scanning with **GYRO_ALIGNMENT** when silence is required.
- **Breathing Navigation**: The "Me" icon now pulses with a breathing effect upon node stabilization, guiding users back to their rewards.
- **Narrative Continuity**: Every transition (Oracle -> Me -> Sandbox -> Orb) is now logic-locked to ensure 0% user leakage.

---
**Verification Complete. Big Bang Compliance Signed.**

## 5. 第四阶段：GLTCH 手动拼图仪式 (Phase 4: Manual Puzzle Ritual)

### 核心功能实现 (Core Implementation)
我们已完成所有“手动仪式感”的开发，重点在于触觉反馈与视觉引导的结合。

#### 1. 黄色预警引导 (Yellow Alert Protocol)
- **触发机制**: 当用户收集满 4 个 Ghost Fragments 时触发。
- **视觉表现**: MePage 底部弹出 `#FFD700` (施工黄) 警告条："⚠️ RITUAL_READY // INITIATE_SYNTHESIS"。
- **动态效果**: 采用 `animate-bounce` 物理弹跳动画，确保用户无法忽视。

#### 2. 拼图祭坛组件 (`PuzzleBoard.tsx`)
- **美学风格**: 
    - **Construction Site**: 采用虚线边框、工程黄配色、蓝图风格。
    - **Drag & Drop**: 实现了完全自由的拖拽逻辑，配合“磁吸”效果 (Snap-to-Grid)。
    - **触觉/听觉**: 
        - 吸附时触发 `audioService.playClick()` (机械咬合声)。
        - 完成时触发 `audioService.playSingingBowl()` (颂钵共鸣)。

#### 3. 现实合成奖励 (Synthesis Reward)
- **完成反馈**: 集齐 2x2 拼图后，触发全屏 "SYNTHESIS // REALITY_ANCHORED" 覆盖层。
- **数值奖励**: 自动对接 `useStore`，发放 Sovereignty 积分。

#### 4. 安全逃生机制 (Escape Routes)
- **全局可逆**: 拼图界面右上角设有明确的 [CLOSE] 按钮。
- **导航常驻**: 底部导航栏在非模态页面永远可见，确保用户不会被困在任何仪式中。

---
**本次更新主要文件 (Key Files):**
- `src/components/PuzzleBoard.tsx`: [NEW] 拼图核心组件
- `src/pages/MePage.tsx`: [MODIFIED] 接入黄色预警与拼图入口
- `src/services/audioService.ts`: [MODIFIED] 增加 UI 交互音效
