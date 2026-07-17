"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  CHAT_UPDATED_EVENT,
  createChatMessage,
  ensureWelcomeMessage,
  getChatThread,
  getMockReplyDelayMs,
  pickMockAgentReply,
  saveChatThread,
  type ChatMessage,
  type ChatThread,
} from "@/lib/b2b/chat";
import { chatStorageKey } from "@/lib/b2b/storage-keys";

interface ChatContextValue {
  messages: ChatMessage[];
  isHydrated: boolean;
  isOpen: boolean;
  isAgentTyping: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  refresh: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [thread, setThread] = useState<ChatThread>(() =>
    getChatThread(undefined)
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const replyTimerRef = useRef<number | null>(null);

  const refresh = useCallback(() => {
    if (!userId) {
      setThread(getChatThread(undefined));
      return;
    }
    setThread(getChatThread(userId));
  }, [userId]);

  useEffect(() => {
    if (status === "loading") return;
    if (userId) {
      const loaded = ensureWelcomeMessage(getChatThread(userId));
      setThread(loaded);
    } else {
      setThread(getChatThread(undefined));
    }
    setIsHydrated(true);

    const onUpdate = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (!userId) return;
      if (event.key === chatStorageKey(userId)) refresh();
    };

    window.addEventListener(CHAT_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHAT_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
      if (replyTimerRef.current) {
        window.clearTimeout(replyTimerRef.current);
      }
    };
  }, [status, userId, refresh]);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((v) => !v), []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !userId) return;

      const userMsg = createChatMessage("user", trimmed);
      setThread((current) => {
        const base =
          current.userId === userId ? current : getChatThread(userId);
        const next: ChatThread = {
          ...base,
          userId,
          messages: [...base.messages, userMsg],
          updatedAt: new Date().toISOString(),
        };
        saveChatThread(next);
        return next;
      });

      // Auto-odpowiedź handlowca (mock) po 2–3 s
      setIsAgentTyping(true);
      if (replyTimerRef.current) {
        window.clearTimeout(replyTimerRef.current);
      }
      replyTimerRef.current = window.setTimeout(() => {
        const replyText = pickMockAgentReply(trimmed);
        const agentMsg = createChatMessage("agent", replyText);
        setThread((current) => {
          const base =
            current.userId === userId ? current : getChatThread(userId);
          const next: ChatThread = {
            ...base,
            userId,
            messages: [...base.messages, agentMsg],
            updatedAt: new Date().toISOString(),
          };
          saveChatThread(next);
          return next;
        });
        setIsAgentTyping(false);
        replyTimerRef.current = null;
      }, getMockReplyDelayMs());
    },
    [userId]
  );

  const value = useMemo(
    () => ({
      messages: thread.messages,
      isHydrated,
      isOpen,
      isAgentTyping,
      openChat,
      closeChat,
      toggleChat,
      sendMessage,
      refresh,
    }),
    [
      thread.messages,
      isHydrated,
      isOpen,
      isAgentTyping,
      openChat,
      closeChat,
      toggleChat,
      sendMessage,
      refresh,
    ]
  );

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat musi być użyty wewnątrz ChatProvider");
  }
  return context;
}
