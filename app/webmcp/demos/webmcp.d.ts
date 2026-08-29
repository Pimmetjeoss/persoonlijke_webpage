/* Types voor de WebMCP-API zoals de demo's in deze map hem gebruiken.
   Gedeeld door alle demo's, want `document.modelContext` en de
   declaratieve attributen zijn globale declaraties: die kunnen maar één
   keer in het project staan.

   Twee dingen die TypeScript nog niet kent:
   1. `document.modelContext.registerTool`, waarmee een pagina zijn eigen
      functies aanmeldt zonder formulier. Zo werkt de bioscoop-demo.
   2. document.modelContext zelf, waar de polyfill in public/vendor/ op
      landt. */

export interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: string | Record<string, unknown>;
  annotations?: WebMcpToolAnnotations;
}

export interface WebMcpToolAnnotations {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

/** Wat je meegeeft aan registerTool: dezelfde velden als een tool, plus de
    functie die hem uitvoert. Het resultaat gaat terug naar de agent, dus
    houd het klein en zeg wat er gebeurd is. */
export interface WebMcpToolDefinition {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: WebMcpToolAnnotations;
  execute: (args: never) => unknown | Promise<unknown>;
}

export interface WebMcpModelContext {
  /** Meldt een tool aan. `options.signal` haalt hem er weer af zodra het
      signaal afbreekt — precies wat je wilt bij het opruimen van een
      React-effect. Gooit als er al een tool met deze naam bestaat. */
  registerTool(
    tool: WebMcpToolDefinition,
    options?: { signal?: AbortSignal }
  ): void | Promise<void>;
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
}
