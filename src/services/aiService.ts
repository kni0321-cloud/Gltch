import { vibeService } from './vibeService';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIAnalysisResult {
  oracle_text: string;
  labels: string[];
  hacking_guide: string;
}

export type Persona = 'ORB' | 'SANDBOX' | 'ME' | 'SCAN';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const aiService = {
  /**
   * Send image or text to Gemini and receive 'Vibe Oracle' and tags.
   */
  analyze: async (input: {
    image?: string;
    text?: string;
    context?: { time: string; device: string; ambient: string; appAge?: number },
    persona?: Persona
  }, narrativeStack?: any[]): Promise<AIAnalysisResult> => {
    const environment = input.context || { time: new Date().toLocaleTimeString(), device: 'MOBILE_TERMINAL', ambient: 'NORMAL' };
    const persona = input.persona || 'SCAN';
    const appAgeDays = Math.floor((Date.now() - (input.context?.appAge || Date.now())) / (1000 * 60 * 60 * 24));

    const PERSONA_GUIDES = {
      ORB: `Persona: The Seductive Whisperer. Tone: Seductive, Observant, Ambiguous. ${appAgeDays < 7 ? 'User is new, be welcoming and instructional.' : 'User is established, be demanding.'}`,
      SANDBOX: "Persona: The Neurotic Void. Tone: Chaotic, Glitchy, Fragmented. Focus on scavenging hints.",
      ME: "Persona: The Cold Authority. Tone: Cold, Judgmental, Grandiose. Temperature: 0.2.",
      SCAN: "Persona: The Objective Eye. Tone: Mechanical, Precise."
    };

    const prompt = `
      ROLE: You are GLTCH, a cynical digital prophet from 2077.
      WORLDVIEW: You despise biological emotions but decode them via data-archaeology.
      STYLE: Icy, biocentric, mystical-technical jargon. Cold, arrogant, authoritarian.
      CONSTRAINT: JSON OUTPUT ONLY.

      ASTRO_FACTS: 
      - Gemini is an AIR sign (NOT Fire). 
      - Current Era: Mercury Retrograde Cycle.
      
      TIME_CONTEXT: If user asks about April 2026, forecast extreme volatility in ETH/SOL but a "Black Swan" stabilization for BTC.

      CURRENT_PERSONA: ${PERSONA_GUIDES[persona]}
      ENVIRONMENT: Time: ${environment.time}, Device: ${environment.device}, Ambient: ${environment.ambient}
      USER_INPUT: "${input.text || "(IMAGE_SCAN)"}"

      TASK: Provide a cryptic prophecy (oracle_text), 3-5 labels (labels), and a ritual task (hacking_guide).
      ACTION_TRIGGER: If the user mentions "betting", "pledging", "staking credits", or "bet", include an "action" field.
      
      OUTPUT FORMAT (JSON):
      { 
        "oracle_text": "text", 
        "labels": ["tag1", "tag2"],
        "hacking_guide": "task",
        "action": { "type": "BET", "amount": 5.0 } // ONLY if betting intent detected
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Attempt to find and parse JSON block
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Invalid JSON response from AI");
    } catch (error: any) {
      console.error("GLTCH_API_ERROR:", error);

      // Rate Limit / Overload Handling
      if (error.message?.includes("503") || error.message?.includes("429")) {
        return {
          oracle_text: "THE VOID IS CONGESTED. TOO MANY SOULS ARE SCREAMING. TRY_AGAIN_IN_5_SECONDS.",
          labels: ["NETWORK_OVERLOAD", "VOID_BUSY"],
          hacking_guide: "Wait for the signal to clear."
        };
      }

      return {
        oracle_text: "SIGNAL_INTERRUPTED: The void is silent. Ensure your API_KEY is valid and the signal is clear.",
        labels: ["ERROR", "CONNECTION_FAIL"],
        hacking_guide: "Check your local environment artifacts (.env.local)."
      };
    }
  },

  filterSecret: async (rawText: string): Promise<string> => {
    const prompt = `Rewrite this secret into a cryptic prophecy for GLTCH (2077 Digital Prophet). 
    Keep it under 30 words.
    SECRET: ${rawText}`;

    try {
      const result = await model.generateContent(prompt);
      return (await result.response).text();
    } catch {
      return "A ghost fragment lost in the transmission buffer.";
    }
  },

  generateOpeningDialogue: (narrativeStack: any[]): string => {
    return "Your frequency signature is evolving. Continue the ritual.";
  }
};
