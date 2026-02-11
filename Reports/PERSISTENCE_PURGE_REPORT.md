# 🧹 持久化层脏数据清洗报告 (Dirty Data Purge)

> **审计日期**: 2026-02-09  
> **修复性质**: 持久化状态迁移与开发后门  
> **状态**: **PURGED (已清洗)**

## 1. 版本迁移清洗 (Migration Strategy)
*   **问题根源**: `activeTasks` 中残留了指向错误 `nodeId` 或空数据的旧任务，导致 `OraclePage` 陷入“Abyss”循环。
*   **修复动作**: 
    *   在 `useStore` 的 `persist` 配置中将 `version` 升级为 `2`。
    *   实现了 `migrate` 函数：当检测到旧版本 (version < 2) 时，强制清空 `activeTasks` 和 `missionState`。
*   **预期效果**: 所有旧用户在刷新页面后，其“死循环任务”将被自动移除，系统重置为 `IDLE` 状态。

## 2. 强力重置开关 (Hard Reset Backdoor)
*   **功能实装**: 在 `OrbPage` 监听输入指令。
*   **触发指令**: 输入 `RESET_ALL` 并回车。
*   **执行逻辑**: 调用 `useStore.getState().hardReset()`，清空所有关键状态并强制刷新页面。
*   **安全提示**: 此功能仅供开发测试使用，用于在极端情况下手动核爆本地存储。

## 3. 现场验证建议 (Action Required)
*   **即刻验证**: 请在 Orb 页面输入 `RESET_ALL`。
*   **预期反馈**: 弹出 `SYSTEM_PURGED` 警告框，页面刷新，所有“Abyss”任务消失，系统回归初始引导状态。

---
**首席技术官最后陈述**: 
脏数据已被清理，版本号已升级。GLTCH 2.1.1 现在拥有了自我净化的能力，任何历史遗留的逻辑死结都将在这次更新中被自动解开。
