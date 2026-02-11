# Marketing Tracking Specification

> **Project**: GLTCH 2077
> **Stack**: GA4 + Microsoft Clarity
> **Focus**: Zero Churn / TikTok Conversion Optimization

## 1. Core GA4 Events

| Event Name | Parameter | Description |
| :--- | :--- | :--- |
| `Orb_View_Success` | `source` | Triggered when the Orb page renders. |
| `Hydration_Complete` | `value (ms)` | performance-now measurement of app initialization. |
| `First_Interaction` | `Time_To_Action` | Time spent on page before first click/input. |
| `Orb_Hit` | `click_x`, `click_y` | Successful click on the Orb or its extended hitbox (+20px). |
| `Orb_Miss` | `click_x`, `click_y` | Click on the "Dead Zone" background. |
| `Guide_Glow_Displayed` | - | Triggered if the user is idle for 5s and the guide appears. |

## 2. Global Dimensions

- **`referrer_source`**: 
    - `GITHUB_PROFILE`: Direct link from GitHub.
    - `TIKTOK_REF`: Traffic from TikTok internal browser.
    - `DIRECT`: Unknown/Direct entry.

## 3. Microsoft Clarity Protocol

- **Privacy**: `data-clarity-mask` active.
- **Recording**: Captures 100% of "Zero Interaction" sessions to identify bottleneck devices.
