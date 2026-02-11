import ReactGA from 'react-ga4';

export const trackingService = {
    init: (measurementId: string) => {
        if (!measurementId) return;
        ReactGA.initialize(measurementId);

        // Set Referrer Dimension
        const referrer = document.referrer;
        let source = "DIRECT";
        if (referrer.includes("github.com")) source = "GITHUB_PROFILE";
        else if (referrer.includes("t.co") || referrer.includes("twitter.com")) source = "X_POST";
        else if (referrer.includes("tiktok.com")) source = "TIKTOK_REF";

        ReactGA.set({ referrer_source: source });
        console.log(`[TRACKING] Initialized with Source: ${source}`);

        // Clarity Initialization (Global script)
        // Clarity Initialization (Global script)
        (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
            c[a] = c[a] || function (...args: any[]) { (c[a].q = c[a].q || []).push(args) };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", "pk066o4mqd"); // AG's Clarity ID for this project
    },

    trackEvent: (category: string, action: string, label?: string, value?: number, nonInteraction?: boolean, params?: any) => {
        // GA4 Style: event(name, params)
        ReactGA.event(action, {
            category,
            label,
            value,
            non_interaction: nonInteraction,
            ...params
        });
    },

    trackClick: (x: number, y: number, target: string, isHit: boolean) => {
        ReactGA.event(isHit ? "Orb_Hit" : "Orb_Miss", {
            category: "Interaction",
            label: `X:${x}_Y:${y}`,
            click_x: x,
            click_y: y,
            target_zone: target,
            is_dead_zone: !isHit
        });
    },

    trackPerformance: (hydrationMs: number) => {
        ReactGA.event({
            category: "Performance",
            action: "Hydration_Complete",
            value: hydrationMs
        });
    }
};
