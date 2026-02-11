
import { useStore } from './store/useStore';

async function runAudit() {
    console.log("=== FINAL AUDIT SIMULATION: START ===");

    // 1. Sovereignty Lock Verification
    console.log("\n[TEST 1] Sovereignty Lock Logic...");
    const store = useStore.getState();
    const starId = "STAR_TEST_001";
    const userA = "USER_ALPHA_001";
    const userB = "USER_BETA_999";

    // User A claims
    console.log(`Action: User A (${userA}) claims ${starId}`);
    const resultA = store.claimSovereignty(starId, userA);
    console.log(`Result A: ${JSON.stringify(resultA)}`);

    if (!resultA.success) console.error("FAIL: User A should have succeeded.");

    // User B attempts to claim same star
    console.log(`Action: User B (${userB}) attempts to claim ${starId}`);
    const resultB = store.claimSovereignty(starId, userB);
    console.log(`Result B: ${JSON.stringify(resultB)}`);

    if (resultB.success) {
        console.error("FAIL: User B should have been blocked!");
    } else if (resultB.message.includes("stabilized by architect")) {
        console.log("PASS: Sovereignty Lock Active. User B was blocked.");
    }

    // 2. Data Consistency Check
    console.log("\n[TEST 2] Data Consistency (Store vs UI Projection)...");

    // Add a test stable node
    store.addVibeNode({
        id: "TEST_NODE_CONSISTENCY",
        labels: ["#AUDIT_TEST"],
        oracle: "Consistency Verification Node",
        type: "STANDARD",
        location: { lat: 0, lng: 0 },
        timestamp: Date.now()
    });

    // Stabilize it manually
    store.stabilizeNode("TEST_NODE_CONSISTENCY");

    const updatedStore = useStore.getState();
    const stableNode = updatedStore.vibeNodes.find(n => n.id === "TEST_NODE_CONSISTENCY");

    if (stableNode?.ritualStatus === 'STABLE') {
        console.log("PASS: Node status correctly updated to STABLE in Store.");
    } else {
        console.error("FAIL: Node status mismatch!");
    }

    // Simulate UI Projection (completedRituals count)
    const uiCount = updatedStore.vibeNodes.filter(n => n.ritualStatus === 'STABLE').length;
    console.log(`UI Projection Count (Stable Nodes): ${uiCount}`);

    // 3. Behavioral Chain Check (Log Dump)
    console.log("\n[TEST 3] Behavioral Chain State...");
    console.log(`Current Mission Step: ${updatedStore.missionState.step}`);
    console.log(`Void Mode: ${updatedStore.voidMode}`);

    console.log("\n=== FINAL AUDIT SIMULATION: END ===");
}

// Mocking dependencies if needed, but this is a rough script run via node or within app context
// To run this, usually we'd need the React context, but useStore is vanilla Zustand (mostly).
// However, `persist` might need window.localStorage. 
// If running in node, we need to mock window.
if (typeof window === 'undefined') {
    // @ts-ignore - Using globalThis for Node.js compatibility
    (globalThis as any).window = {
        localStorage: {
            getItem: () => null,
            setItem: () => { },
        }
    };
}

runAudit();
