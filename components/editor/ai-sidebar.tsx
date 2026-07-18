"use client";

import { useState, type KeyboardEvent } from "react";
import { Bot, Download, FileText, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
] as const;

const DEMO_SPEC = {
  title: "System Architecture Spec",
  snippet:
    "Overview of services, data stores, and request flows derived from the current canvas graph.",
};

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${prev.length}`,
        role: "user",
        content: trimmed,
      },
    ]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(draft);
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed bottom-3 right-3 top-15 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-surface-border bg-base/95 shadow-lg backdrop-blur-sm transition-[transform,opacity,visibility] duration-300 ease-in-out",
          isOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-[calc(100%+0.75rem)] opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-start justify-between border-b border-surface-border px-4 py-3">
          <div className="flex items-start gap-2">
            <Bot
              className="mt-0.5 h-4 w-4 shrink-0 text-accent-ai-text"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-medium text-copy-primary">
                AI Workspace
              </h2>
              <p className="text-xs text-copy-muted">
                Collaborate with Ghost AI
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close AI sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="ai-architect"
          className="flex min-h-0 flex-1 flex-col gap-0"
        >
          <TabsList className="mx-4 mt-3 w-auto bg-subtle">
            <TabsTrigger
              value="ai-architect"
              className="text-copy-muted data-active:bg-accent-ai data-active:text-white dark:data-active:bg-accent-ai dark:data-active:text-white"
            >
              AI Architect
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="text-copy-muted data-active:bg-accent-ai data-active:text-white dark:data-active:bg-accent-ai dark:data-active:text-white"
            >
              Specs
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="ai-architect"
            className="mt-0 flex min-h-0 flex-1 flex-col"
          >
            <ScrollArea className="min-h-0 flex-1">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center gap-4 px-4 py-10 text-center">
                  <Bot
                    className="h-8 w-8 text-accent-ai-text"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-copy-primary">
                      Start designing with AI
                    </p>
                    <p className="text-xs text-copy-muted">
                      Describe the system you want to build, or pick a starter
                      prompt below.
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="rounded-full bg-subtle px-3 py-2 text-left text-xs text-accent-ai-text transition-colors hover:bg-elevated"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-4 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[90%] rounded-2xl px-3 py-2 text-sm",
                        message.role === "user"
                          ? "ml-auto border-2 border-brand/50 bg-brand-dim text-copy-primary"
                          : "mr-auto border border-surface-border bg-elevated text-accent-ai-text"
                      )}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="border-t border-surface-border p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your system..."
                  rows={2}
                  className="min-h-[72px] max-h-[160px] resize-none overflow-y-auto"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => sendMessage(draft)}
                  disabled={!draft.trim()}
                  aria-label="Send message"
                  className="shrink-0 bg-accent-ai text-white hover:bg-accent-ai/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="specs"
            className="mt-0 flex min-h-0 flex-1 flex-col gap-4 px-4 py-4"
          >
            <Button className="w-full bg-accent-ai text-white hover:bg-accent-ai/90">
              Generate Spec
            </Button>

            <div className="rounded-2xl border border-surface-border bg-elevated p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-accent-ai-text">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-copy-primary">
                    {DEMO_SPEC.title}
                  </p>
                  <p className="mt-1 text-xs text-copy-muted">
                    {DEMO_SPEC.snippet}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="mt-2 -ml-2 text-copy-muted"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </aside>
    </>
  );
}
