// =============================================================================
// chat-trigger.ts — tiny event bus to ask the chat widget a question from
// anywhere in the app. The widget itself listens for the "keshav-chat:ask"
// custom event on `window`. We avoid context/Zustand here so any component
// can fire without needing to wrap in a provider.
// =============================================================================

export type AskChatDetail = {
  /** The question text to send into the chat. Visible to the user. */
  question: string;
  /**
   * If true, the chat backend uses higher max_tokens and adds a
   * "deep dive" system prompt instruction to produce a comprehensive
   * multi-paragraph answer. Use for "Ask me about this project" buttons.
   */
  deep?: boolean;
};

const EVENT_NAME = "keshav-chat:ask";

/**
 * Open the chat widget (if closed) and send a question. Safe to call from
 * any client component — it's a no-op on the server.
 */
export function askKeshav(detail: AskChatDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AskChatDetail>(EVENT_NAME, { detail }));
}

/**
 * Subscribe to ask-the-chat events. Returns an unsubscribe function.
 * The chat widget calls this on mount.
 */
export function onAskKeshav(handler: (detail: AskChatDetail) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => {
    const ce = e as CustomEvent<AskChatDetail>;
    if (ce.detail?.question) handler(ce.detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
