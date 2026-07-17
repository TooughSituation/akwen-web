/**
 * Czat B2B z przedstawicielem handlowym (mock).
 *
 * Analogia Excel/Access:
 *  - Arkusz „Czat” z kolumnami: Kto, Treść, Data
 *  - Każda firma = osobny arkusz (localStorage per userId)
 *  - Auto-odpowiedź = makro timer (jak Application.OnTime) po 2–3 s
 */

import { chatStorageKey, STORAGE_BASE } from "./storage-keys";

export const CHAT_STORAGE_KEY = STORAGE_BASE.chat;
export const CHAT_UPDATED_EVENT = "akwen-chat-updated";

export type ChatSender = "user" | "agent";

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  createdAt: string;
}

export interface ChatThread {
  userId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export const AGENT_DISPLAY_NAME = "Przedstawiciel handlowy Akwen";

const MOCK_REPLIES = [
  "Dziękuję za wiadomość. Sprawdzę dostępność i wrócę z informacją w ciągu chwili.",
  "Otrzymałem Państwa zapytanie. Proszę o chwilę — weryfikuję stany magazynowe.",
  "Rozumiem. Mogę przygotować ofertę pod to zamówienie. Czy mam dodać produkty do koszyka za Państwa?",
  "Dziękuję! Przy większym wolumenie możemy też omówić dodatkowy rabat handlowy.",
  "Jasne. Najbliższa dostawa chłodnicza w regionie jest w harmonogramie — potwierdzę dokładny termin.",
  "Zapisuję prośbę. Po stronie Akwen zajmie się tym opiekun handlowy. Czy jest coś pilnego?",
];

export function emptyChatThread(userId: string): ChatThread {
  return {
    userId,
    messages: [],
    updatedAt: new Date().toISOString(),
  };
}

function normalizeThread(
  raw: Partial<ChatThread> | null,
  userId: string
): ChatThread {
  const base = emptyChatThread(userId);
  if (!raw) return base;
  const messages = Array.isArray(raw.messages)
    ? raw.messages.filter(
        (m): m is ChatMessage =>
          Boolean(m?.id && m?.text && (m.sender === "user" || m.sender === "agent"))
      )
    : [];
  return {
    userId,
    messages,
    updatedAt: raw.updatedAt ?? base.updatedAt,
  };
}

export function getChatThread(userId?: string | null): ChatThread {
  if (typeof window === "undefined" || !userId) {
    return emptyChatThread(userId ?? "anonymous");
  }
  const key = chatStorageKey(userId);
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return emptyChatThread(userId);
    return normalizeThread(JSON.parse(saved) as ChatThread, userId);
  } catch {
    localStorage.removeItem(key);
    return emptyChatThread(userId);
  }
}

export function saveChatThread(thread: ChatThread): void {
  if (typeof window === "undefined" || !thread.userId) return;
  const next = { ...thread, updatedAt: new Date().toISOString() };
  localStorage.setItem(chatStorageKey(thread.userId), JSON.stringify(next));
  window.dispatchEvent(new Event(CHAT_UPDATED_EVENT));
}

export function createChatMessage(
  sender: ChatSender,
  text: string
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    sender,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
}

/** Losowa odpowiedź handlowca (mock). */
export function pickMockAgentReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("cena") || lower.includes("rabat")) {
    return "W sprawie cen i rabatu mogę przygotować indywidualną propozycję na podstawie historii zamówień. Napiszę szczegóły wkrótce.";
  }
  if (lower.includes("dostaw") || lower.includes("termin")) {
    return "Terminy dostaw chłodniczych ustalamy indywidualnie. Podam propozycję daty po sprawdzeniu trasy.";
  }
  if (lower.includes("stan") || lower.includes("dostęp")) {
    return "Sprawdzam stany w magazynie Akwen. Dam znać, które pozycje są od razu dostępne.";
  }
  if (lower.includes("promoc") || lower.includes("gratis")) {
    return "Aktualne progi promocji widać w koszyku (500 zł / 800 zł). Chętnie pomogę dobrać asortyment do progu.";
  }
  const index = Math.floor(Math.random() * MOCK_REPLIES.length);
  return MOCK_REPLIES[index] ?? MOCK_REPLIES[0];
}

/**
 * Opóźnienie auto-odpowiedzi 2–3 s (jak Application.OnTime w VBA).
 */
export function getMockReplyDelayMs(): number {
  return 2000 + Math.floor(Math.random() * 1000);
}

/** Pierwsza wiadomość powitalna, jeśli wątek pusty. */
export function ensureWelcomeMessage(thread: ChatThread): ChatThread {
  if (thread.messages.length > 0) return thread;
  const welcome = createChatMessage(
    "agent",
    `Dzień dobry! Jestem ${AGENT_DISPLAY_NAME}. W czym mogę pomóc? Mogę doradzić asortyment, terminy dostaw lub promocje.`
  );
  const next: ChatThread = {
    ...thread,
    messages: [welcome],
    updatedAt: new Date().toISOString(),
  };
  saveChatThread(next);
  return next;
}
