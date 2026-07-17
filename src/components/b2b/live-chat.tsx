"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { MessageCircle, Send, UserRound } from "lucide-react";
import { useChat } from "@/contexts/chat-context";
import { AGENT_DISPLAY_NAME } from "@/lib/b2b/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Okno czatu z handlowcem (Sheet).
 * Analogia Access: formularz „Czat” otwierany z paska narzędzi.
 */
export function LiveChatSheet() {
  const {
    messages,
    isOpen,
    isAgentTyping,
    closeChat,
    sendMessage,
    isHydrated,
  } = useChat();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // Focus pola po otwarciu
    const t = window.setTimeout(() => inputRef.current?.focus(), 150);
    return () => window.clearTimeout(t);
  }, [isOpen, messages, isAgentTyping]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeChat();
      }}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        showCloseButton
      >
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <div className="flex items-center gap-3 pr-8">
            <div className="flex size-10 items-center justify-center rounded-full bg-turquoise-500 text-white">
              <UserRound className="size-5" />
            </div>
            <div>
              <SheetTitle className="text-base">
                {AGENT_DISPLAY_NAME}
              </SheetTitle>
              <SheetDescription className="text-xs">
                Czat na żywo (mock) · odpowiedzi automatyczne po 2–3 s
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col bg-muted/20">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {!isHydrated ? (
              <p className="text-center text-sm text-muted-foreground">
                Ładowanie historii…
              </p>
            ) : (
              messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                        isUser
                          ? "rounded-br-md bg-turquoise-500 text-white"
                          : "rounded-bl-md border border-border bg-card text-foreground"
                      )}
                    >
                      {!isUser && (
                        <p className="mb-0.5 text-[10px] font-medium text-turquoise-700 dark:text-turquoise-400">
                          Handlowiec
                        </p>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-[10px]",
                          isUser
                            ? "text-white/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {format(new Date(msg.createdAt), "HH:mm", {
                          locale: pl,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            {isAgentTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce [animation-delay:120ms]">
                      •
                    </span>
                    <span className="animate-bounce [animation-delay:240ms]">
                      •
                    </span>
                  </span>
                  <span className="ml-2 text-xs">Handlowiec pisze…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-border bg-card p-3"
          >
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Napisz do handlowca…"
              className="flex-1"
              maxLength={1000}
              aria-label="Treść wiadomości"
            />
            <Button
              type="submit"
              size="icon"
              className="shrink-0 bg-turquoise-500 hover:bg-turquoise-600"
              disabled={!draft.trim() || isAgentTyping}
              aria-label="Wyślij wiadomość"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Przycisk w headerze — otwiera czat. */
export function LiveChatHeaderButton() {
  const { openChat, messages, isHydrated } = useChat();
  const userCount = messages.filter((m) => m.sender === "user").length;

  return (
    <button
      type="button"
      onClick={openChat}
      className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Czat z handlowcem"
      title="Czat na żywo (mock)"
    >
      <MessageCircle className="size-5" />
      {isHydrated && userCount > 0 && (
        <span className="absolute top-1 right-1 size-2 rounded-full bg-turquoise-500" />
      )}
    </button>
  );
}
