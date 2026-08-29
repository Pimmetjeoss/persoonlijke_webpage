/* Types voor de WebMCP-API zoals de demo hem gebruikt.

   Twee dingen die TypeScript nog niet kent:
   1. De declaratieve attributen (toolname/tooldescription/...) die een
      <form> tot agent-tool maken. Ze hangen aan HTMLAttributes, zodat ze
      op form, input, select en textarea tegelijk geldig zijn.
   2. document.modelContext, waar de polyfill in public/vendor/ op landt. */

import "react";

declare module "react" {
  // De generic moet exact die van React zijn om te kunnen mergen; T zelf
  // hebben we hier niet nodig.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    /** Maakt van dit formulier een agent-tool met deze naam. */
    toolname?: string;
    /** Wat de tool doet — dit leest de agent om te beslissen of hij hem inzet. */
    tooldescription?: string;
    /** Wat dit veld verwacht, per invoerveld. */
    toolparamdescription?: string;
    /** Laat de agent zonder bevestiging van de gebruiker verzenden. */
    toolautosubmit?: string;
  }
}

export interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: string | Record<string, unknown>;
}

export interface WebMcpModelContext {
  getTools(): Promise<WebMcpTool[]>;
  executeTool(
    tool: WebMcpTool,
    args: string,
    options?: { signal?: AbortSignal }
  ): Promise<unknown>;
}

declare global {
  interface Document {
    modelContext?: WebMcpModelContext;
  }

  /** De polyfill hangt deze twee velden aan het submit-event van een
      formulier dat door een agent is ingevuld. */
  interface SubmitEvent {
    agentInvoked?: boolean;
    respondWith?: (value: unknown) => void;
  }
}
