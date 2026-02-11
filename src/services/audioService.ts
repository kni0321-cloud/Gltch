/**
 * Audio Service - Procedural sound generation for rituals.
 * singingBowl: 2s harmonic drone for success.
 * glitchStatic: 0.5s abrasive noise for failure/severance.
 */

class AudioService {
    private ctx: AudioContext | null = null;

    private initCtx() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    playSingingBowl() {
        this.initCtx();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const mainOsc = this.ctx.createOscillator();
        const harmonicOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        mainOsc.type = 'sine';
        mainOsc.frequency.setValueAtTime(432.11, now);

        harmonicOsc.type = 'sine';
        harmonicOsc.frequency.setValueAtTime(864.22, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        mainOsc.connect(gain);
        harmonicOsc.connect(gain);
        gain.connect(this.ctx.destination);

        mainOsc.start();
        harmonicOsc.start();
        mainOsc.stop(now + 2.5);
        harmonicOsc.stop(now + 2.5);
    }

    playGlitchStatic() {
        this.initCtx();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        source.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(5000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.5);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        source.start();
        source.stop(now + 0.5);
    }
    playHeartBeat() {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            // Heart-beat pattern: 100ms on, 100ms off, 300ms on
            navigator.vibrate([100, 100, 300]);
        }
    }
    playClick() {
        this.initCtx();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }
}

export const audioService = new AudioService();
