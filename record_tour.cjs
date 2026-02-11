const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        recordVideo: {
            dir: 'd:/AI/Gltch/Reports/videos',
            size: { width: 450, height: 800 }
        },
        viewport: { width: 450, height: 800 }
    });

    const page = await context.newPage();

    try {
        console.log('1. Navigating to app...');
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(3000); // Boot sequence

        console.log('2. Interacting with Orb...');

        // Handle Settlement Report if it appears
        const receiveDestiny = page.locator('button:has-text("RECEIVE_DESTINY")');
        if (await receiveDestiny.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log('   - Clearing Settlement Report...');
            await receiveDestiny.click();
            await page.waitForTimeout(1000);
        }

        // Handle Task Check-in or other bubbles
        const bubbleYes = page.locator('button:has-text("YES")').first();
        if (await bubbleYes.isVisible()) {
            console.log('   - Interacting with Vibe Bubble...');
            await bubbleYes.click();
            await page.waitForTimeout(2000);
        }

        console.log('3. Navigating to Scan...');
        // Use the specific icon or text for navigation
        await page.locator('button:has-text("Scan")').click();
        await page.waitForTimeout(2000);

        console.log('4. Performing Scan Ritual...');
        const extractButton = page.locator('button:has-text("EXTRACT VIBE")');
        await extractButton.waitFor({ state: 'visible', timeout: 5000 });
        await extractButton.click();
        await page.waitForTimeout(12000); // Ritual + Reveal delay

        console.log('5. Integrating Reality...');
        await page.locator('button:has-text("Integrate Reality")').click();
        await page.waitForTimeout(4000); // Transition to Sandbox

        console.log('6. Interacting with Sandbox...');
        // Click first node
        const node = page.locator('.group').first();
        if (await node.isVisible()) {
            await node.click({ force: true });
            await page.waitForTimeout(3000);
            console.log('7. Dismissing Archive...');
            await page.locator('button:has-text("DISMISS")').click({ force: true }).catch(() => { });
        }
        await page.waitForTimeout(2000);

        console.log('8. Navigating to Me page...');
        await page.locator('button:has-text("Me")').click();
        await page.waitForTimeout(3000);

        console.log('9. Performing Star Jump...');
        await page.locator('button:has-text("Star_Jump")').click({ force: true }).catch(() => { });
        await page.waitForTimeout(6000); // Wait for zoom and stay on planet view

        console.log('10. Showcase Complete.');
    } catch (err) {
        console.error('Recording Error:', err);
    } finally {
        const video = await page.video();
        if (video) {
            const videoPath = await video.path();
            console.log('Video saved to:', videoPath);
            // Rename at the end
        }
        await context.close();
        await browser.close();
    }
})();
