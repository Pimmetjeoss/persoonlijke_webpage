"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./bistro.module.css";
import type { GenAiChat, GoogleGenAI } from "https://esm.sh/@google/genai";
import type { WebMcpTool } from "./webmcp";

/** De sleutel blijft in de browser van de bezoeker; hij gaat alleen naar
    Google, nooit naar deze site. Zelfde opzet als de demo van Chrome Labs. */
const API_KEY_STORAGE_KEY = "gemini_api_key";
const MODEL = "gemini-3.1-flash-lite";
const GENAI_MODULE = "https://esm.sh/@google/genai";

type Message = { id: number; sender: string; text: string; kind: "user" | "agent" | "system" };

let messageId = 0;

/** De chat-assistent rechtsonder.
 *
 *  Hij praat met Gemini en voert de tools uit die hij op deze pagina vindt —
 *  hier dus het reserveringsformulier, dat via de WebMCP-attributen een tool
 *  is geworden. Zo is de demo ook te proberen in een browser zonder WebMCP:
 *  de polyfill levert document.modelContext, deze widget levert het model.
 */
export function BistroAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyDraft, setKeyDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  /** Spiegelt abortRef in state: alleen terwijl een tool draait mag de
      bezoeker afbreken, en daar moet de knop op kunnen hertekenen. */
  const [canAbort, setCanAbort] = useState(false);

  const clientRef = useRef<GoogleGenAI | null>(null);
  const chatRef = useRef<GenAiChat | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const append = useCallback((sender: string, text: string, kind: Message["kind"]) => {
    setMessages((current) => [...current, { id: messageId++, sender, text, kind }]);
  }, []);

  useEffect(() => {
    try {
      setApiKey(localStorage.getItem(API_KEY_STORAGE_KEY));
    } catch {
      // localStorage kan geblokkeerd zijn; dan vraagt de widget gewoon opnieuw.
    }
  }, []);

  // Nieuwe berichten altijd in beeld.
  useEffect(() => {
    const el = windowRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Waarschuw zodra duidelijk is dat er geen WebMCP beschikbaar is.
  useEffect(() => {
    if (!isOpen || document.modelContext) return;
    const timer = setTimeout(() => {
      append(
        "Systeem",
        "⚠️ Geen WebMCP-API gevonden. Gebruik een browser waarin het experiment aanstaat.",
        "system"
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, [isOpen, append]);

  const getTools = async (): Promise<WebMcpTool[]> => {
    if (!document.modelContext) return [];
    return document.modelContext.getTools();
  };

  /** Systeemprompt plus de tools van deze pagina, in Gemini-formaat. */
  const getConfig = async () => {
    const tools = await getTools();
    return {
      systemInstruction: [
        'Je bent de assistent van restaurant "Le Prikkel Bistro".',
        "Help de gast met het maken van een reservering via de beschikbare tools.",
        "BELANGRIJKE REGEL: gebruik geen andere tools dan de beschikbare.",
        "Antwoord altijd in het Nederlands.",
        `EXTRA CONTEXT: vandaag is het ${new Date().toLocaleDateString("nl-NL", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}.`,
      ],
      tools: [
        {
          functionDeclarations: tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parametersJsonSchema:
              typeof tool.inputSchema === "string"
                ? JSON.parse(tool.inputSchema)
                : tool.inputSchema ?? { type: "object", properties: {} },
          })),
        },
      ],
    };
  };

  const connect = async (key: string) => {
    // Naar de browser doorgeven zoals hij is: esm.sh serveert het pakket, de
    // bundler moet er vanaf blijven.
    const { GoogleGenAI } = await import(
      /* webpackIgnore: true */ /* turbopackIgnore: true */ GENAI_MODULE
    );
    clientRef.current = new GoogleGenAI({ apiKey: key });
    append("Systeem", "Welkom bij Le Prikkel Bistro! Waarmee kan ik je helpen?", "system");
  };

  const saveKey = async () => {
    const key = keyDraft.trim();
    if (!key) return;
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } catch {
      // Zonder opslag werkt de sleutel alleen deze sessie — prima.
    }
    setApiKey(key);
    setKeyDraft("");
    await connect(key);
  };

  const logout = () => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch {
      // Niets opgeslagen, niets te wissen.
    }
    clientRef.current = null;
    chatRef.current = null;
    setApiKey(null);
    setMessages([]);
  };

  /** Eén beurt: stuur de vraag, voer de tool-aanroepen uit die terugkomen,
      en herhaal tot het model met tekst antwoordt. */
  const send = async () => {
    const text = input.trim();
    if (!text || isBusy) return;

    setInput("");
    setIsBusy(true);
    append("Jij", text, "user");

    try {
      if (!clientRef.current && apiKey) await connect(apiKey);
      const client = clientRef.current;
      if (!client) return;

      chatRef.current ??= client.chats.create({ model: MODEL });
      const chat = chatRef.current;

      let result = await chat.sendMessage({ message: text, config: await getConfig() });

      for (;;) {
        const calls = result.functionCalls ?? [];
        if (calls.length === 0) {
          append("Assistent", result.text ?? "", "agent");
          break;
        }

        const toolResponses = [];
        let aborted = false;

        for (const { name, args } of calls) {
          try {
            append("Systeem", `⚙️ Tool uitvoeren: ${name}...`, "system");
            const tool = (await getTools()).find((candidate) => candidate.name === name);
            if (!tool) throw new Error(`Tool ${name} niet gevonden`);

            abortRef.current = new AbortController();
            setCanAbort(true);
            const value = await document.modelContext!.executeTool(tool, JSON.stringify(args), {
              signal: abortRef.current.signal,
            });
            toolResponses.push({ functionResponse: { name, response: { result: value } } });
          } catch (error) {
            if (abortRef.current?.signal.aborted) {
              append("Systeem", `⚙️ Tool afgebroken: ${name}`, "system");
              aborted = true;
              break;
            }
            const message = error instanceof Error ? error.message : String(error);
            append("Systeem", `Fout: ${message}`, "system");
            toolResponses.push({ functionResponse: { name, response: { error: message } } });
          } finally {
            abortRef.current = null;
            setCanAbort(false);
          }
        }

        if (aborted) break;
        result = await chat.sendMessage({ message: toolResponses, config: await getConfig() });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      append("Systeem", `Fout: ${message}`, "system");
    } finally {
      setIsBusy(false);
    }
  };

  const messageClass = (kind: Message["kind"]) =>
    `${styles.agentMessage} ${
      kind === "user"
        ? styles.agentMessageUser
        : kind === "agent"
          ? styles.agentMessageAgent
          : styles.agentMessageSystem
    }`;

  return (
    <div className={styles.agentContainer}>
      {isOpen && (
        <div className={styles.agentChat}>
          <div className={styles.agentHeader}>
            <h3>Bistro-assistent</h3>
            {apiKey && (
              <button type="button" className={styles.agentLogout} onClick={logout}>
                Uitloggen
              </button>
            )}
          </div>

          <div className={styles.agentChatWindow} ref={windowRef}>
            {messages.map((message) => (
              <div key={message.id} className={messageClass(message.kind)}>
                {message.text}
              </div>
            ))}
          </div>

          {apiKey ? (
            <div className={styles.agentInputArea}>
              <input
                type="text"
                className={styles.agentUserInput}
                placeholder="Typ een bericht..."
                value={input}
                disabled={isBusy}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") send();
                }}
              />
              <button
                type="button"
                className={styles.agentSendBtn}
                onClick={() => (canAbort ? abortRef.current?.abort() : send())}
                disabled={isBusy && !canAbort}
              >
                {canAbort ? "Afbreken" : "Stuur"}
              </button>
            </div>
          ) : (
            <div className={styles.agentSetup}>
              <p>Vul je Gemini API-sleutel in om te chatten. Hij blijft in deze browser.</p>
              <input
                type="password"
                className={styles.agentApiKeyInput}
                placeholder="AIzaSy..."
                value={keyDraft}
                onChange={(event) => setKeyDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveKey();
                }}
              />
              <button type="button" className={styles.agentSaveKeyBtn} onClick={saveKey}>
                Opslaan en starten
              </button>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className={styles.agentToggle}
        title="Chat met onze AI-assistent"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {"\u{1F4AC}"}
      </button>
    </div>
  );
}
