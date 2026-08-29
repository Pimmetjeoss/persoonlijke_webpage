/* Minimale typing voor @google/genai.

   Het pakket staat bewust niet in package.json: het wordt pas in de browser
   van esm.sh geladen op het moment dat de bezoeker zijn eigen API-sleutel
   invoert. Alleen de stukjes die bistro-assistant.tsx gebruikt staan hier.

   Dit bestand heeft expres geen imports of exports op het hoogste niveau —
   een ambient module-declaratie kan alleen in een script-bestand staan. */

declare module "https://esm.sh/@google/genai" {
  export interface GenAiFunctionCall {
    name: string;
    args: Record<string, unknown>;
  }

  export interface GenAiResponse {
    text?: string;
    functionCalls?: GenAiFunctionCall[];
  }

  export interface GenAiChat {
    sendMessage(params: Record<string, unknown>): Promise<GenAiResponse>;
  }

  export class GoogleGenAI {
    constructor(options: { apiKey: string });
    chats: { create(params: { model: string }): GenAiChat };
  }
}
