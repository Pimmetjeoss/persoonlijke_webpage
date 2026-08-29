"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GenAiChat, GoogleGenAI } from "https://esm.sh/@google/genai";
import type { WebMcpTool } from "../webmcp";
import styles from "./fabriek.module.css";

const API_KEY_STORAGE_KEY = "gemini_api_key";
const MODEL = "gemini-3.1-flash-lite";
const GENAI_MODULE = "https://esm.sh/@google/genai";

type Message = { id: number; text: string; kind: "user" | "agent" | "system" };

let messageId = 0;

/** Een kleine modelhost voor browsers zonder ingebouwde agent. De widget
 *  ontdekt exact dezelfde Site tools als ChatGPT en voert ze via
 *  document.modelContext uit. De Gemini-sleutel blijft lokaal opgeslagen. */
export function FactoryAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyDraft, setKeyDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [canAbort, setCanAbort] = useState(false);

  const clientRef = useRef<GoogleGenAI | null>(null);
  const chatRef = useRef<GenAiChat | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const append = useCallback((text: string, kind: Message["kind"]) => {
    setMessages((current) => [...current, { id: messageId++, text, kind }]);
  }, []);

  useEffect(() => {
    try {
      setApiKey(localStorage.getItem(API_KEY_STORAGE_KEY));
    } catch {
      // Opslag mag geblokkeerd zijn; de sleutel werkt dan alleen deze sessie.
    }
  }, []);

  useEffect(() => {
    const element = windowRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!isOpen || document.modelContext) return;
    const timer = setTimeout(() => {
      if (!document.modelContext) {
        append("⚠️ Geen WebMCP-API gevonden. Gebruik een browser waarin het experiment aanstaat.", "system");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isOpen, append]);

  const getTools = async (): Promise<WebMcpTool[]> => document.modelContext?.getTools() ?? [];

  const getConfig = async () => {
    const tools = await getTools();
    return {
      systemInstruction: [
        'Je bent de productiechef van "PrikkelFabriek".',
        "Voer de opdracht van de bezoeker uit met uitsluitend de beschikbare tools.",
        "Antwoord altijd in het Nederlands en meld aan het einde concreet wat je hebt gemaakt.",
        "Bij een opdracht om een elektromotor te bouwen roep je eerst skill_assemble_electric_motor aan en volg je dat protocol. Bij andere productieopdrachten lees je eerst get_state en vraag je daarna het passende recept op; gok nooit een recept.",
        "Een geslaagde machinehandeling leegt zelf de invoerbak en zet de opbrengst in de voorraad. Roep daarna dus geen unload aan.",
        "Als een tool faalt, lees de foutmelding, controleer get_state en herstel de bak met unload indien nodig.",
        "Blijf tool-aanroepen doen totdat de gevraagde productie echt gereed is of je kunt uitleggen waarom dat onmogelijk is.",
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
    const { GoogleGenAI } = await import(
      /* webpackIgnore: true */ /* turbopackIgnore: true */ GENAI_MODULE
    );
    clientRef.current = new GoogleGenAI({ apiKey: key });
    append(
      "Welkom in de controlekamer. Vraag me bijvoorbeeld om een elektromotor te bouwen.",
      "system"
    );
  };

  const saveKey = async () => {
    const key = keyDraft.trim();
    if (!key) return;
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } catch {
      // Zonder opslag kan de sessie wel doorgaan.
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

  const send = async () => {
    const text = input.trim();
    if (!text || isBusy) return;

    setInput("");
    setIsBusy(true);
    append(text, "user");

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
          append(result.text || "De opdracht is afgerond.", "agent");
          break;
        }

        const responses = [];
        let aborted = false;

        for (const { name, args } of calls) {
          try {
            append(`⚙ Tool uitvoeren: ${name}…`, "system");
            const tool = (await getTools()).find((candidate) => candidate.name === name);
            if (!tool) throw new Error(`Tool ${name} niet gevonden`);

            abortRef.current = new AbortController();
            setCanAbort(true);
            const value = await document.modelContext!.executeTool(tool, JSON.stringify(args), {
              signal: abortRef.current.signal,
            });
            responses.push({ functionResponse: { name, response: { result: value } } });
          } catch (error) {
            if (abortRef.current?.signal.aborted) {
              append(`Tool afgebroken: ${name}`, "system");
              aborted = true;
              break;
            }
            const message = error instanceof Error ? error.message : String(error);
            append(`Fout: ${message}`, "system");
            responses.push({ functionResponse: { name, response: { error: message } } });
          } finally {
            abortRef.current = null;
            setCanAbort(false);
          }
        }

        if (aborted) break;
        result = await chat.sendMessage({ message: responses, config: await getConfig() });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      append(`Fout: ${message}`, "system");
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
            <h3>Productiechef</h3>
            {apiKey && (
              <button type="button" className={styles.agentLogout} onClick={logout}>
                Uitloggen
              </button>
            )}
          </div>

          <div className={styles.agentChatWindow} ref={windowRef}>
            {messages.length === 0 && (
              <div className={`${styles.agentMessage} ${styles.agentMessageSystem}`}>
                Deze assistent bedient dezelfde 15 Site tools als ChatGPT.
              </div>
            )}
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
                placeholder="Bouw een elektromotor…"
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
                {canAbort ? "Stop" : isBusy ? "Bezig" : "Start"}
              </button>
            </div>
          ) : (
            <div className={styles.agentSetup}>
              <p>Vul je Gemini API-sleutel in om de fabriek hier te bedienen. Hij blijft in deze browser.</p>
              <input
                type="password"
                className={styles.agentApiKeyInput}
                placeholder="AIzaSy…"
                value={keyDraft}
                onChange={(event) => setKeyDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveKey();
                }}
              />
              <button type="button" className={styles.agentSaveKeyBtn} onClick={saveKey}>
                Sleutel opslaan
              </button>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className={styles.agentToggle}
        title="Open de productiechef"
        aria-label="Open de productiechef"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        ⚙
      </button>
    </div>
  );
}
