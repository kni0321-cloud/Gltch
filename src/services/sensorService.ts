/**
 * Sensor Service - Calibrated environmental listeners for ritual triggers.
 * Includes 10-minute stasis window to prevent accidental triggers.
 */

class SensorService {
    private stasisStartTime: number | null = null;
    private stasisThreshold = 10 * 60 * 1000; // 10 minutes
    private lightThreshold = 5; // Lux or normalized value for "Dark"

    private onStasisTrigger: (() => void) | null = null;
    private onVoidTrigger: (() => void) | null = null;

    init() {
        console.log("SENSOR_CORE: INITIALIZING_PRECISION_LISTENERS...");

        // Stasis Listener (Accelerometer)
        window.addEventListener('devicemotion', (event) => {
            const acc = event.acceleration;
            if (!acc) return;

            const isMoving = Math.abs(acc.x || 0) > 0.5 || Math.abs(acc.y || 0) > 0.5 || Math.abs(acc.z || 0) > 0.5;

            if (!isMoving) {
                if (!this.stasisStartTime) this.stasisStartTime = Date.now();
                if (Date.now() - this.stasisStartTime > this.stasisThreshold) {
                    this.triggerStasis();
                }
            } else {
                this.stasisStartTime = null;
            }
        });

        // Light Listener (Ambient Light API / Mock fallback)
        if ('AmbientLightSensor' in window) {
            try {
                // @ts-ignore
                const sensor = new AmbientLightSensor();
                sensor.addEventListener('reading', () => {
                    if (sensor.illuminance < this.lightThreshold) {
                        this.triggerVoid();
                    }
                });
                sensor.start();
            } catch (e) {
                console.warn("LIGHT_SENSOR_INIT_FAILED: FALLING_BACK_TO_MANUAL_CALIBRATION");
            }
        }
    }

    setStasisCallback(cb: () => void) { this.onStasisTrigger = cb; }
    setVoidCallback(cb: () => void) { this.onVoidTrigger = cb; }

    private triggerStasis() {
        if (this.onStasisTrigger) {
            this.onStasisTrigger();
            this.stasisStartTime = Date.now(); // Reset to prevent rapid double triggers
        }
    }

    private triggerVoid() {
        if (this.onVoidTrigger) {
            this.onVoidTrigger();
        }
    }
}

export const sensorService = new SensorService();
