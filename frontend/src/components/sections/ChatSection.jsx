import { Database, Radio, RotateCcw, SendHorizontal } from "lucide-react";
import { ASSISTANT_NAME, quickPrompts } from "../../constants/companionContent";

export default function ChatSection({
  errorNotice,
  input,
  inputRef,
  messages,
  messagesRef,
  meta,
  onInputChange,
  onPromptSelect,
  onReset,
  onSubmit,
  status,
}) {
  const isBusy = status === "sending";
  const statusLabel = status === "sending"
    ? "TRANSMITTING"
    : status === "error"
      ? "RETRY READY"
      : "ONLINE";

  function selectPrompt(prompt) {
    onPromptSelect(prompt);
    inputRef.current?.focus();
  }

  function startNewChat() {
    onReset();
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <section className="product-band" id="chat">
      <div className="section-heading" data-scroll-motion>
        <div>
          <p className="eyebrow">LIVE LINE // 02</p>
          <h2>BUKAN MOCKUP.<br />COBA LINE-NYA.</h2>
        </div>
        <p>Ketik apa saja. Nggak perlu prompt sempurna atau bahasa formal.</p>
      </div>

      <div className="chat-layout" data-scroll-motion>
        <aside className="side-panel">
          <div className="assistant-card">
            <span className="assistant-mark">
              <Radio size={19} />
            </span>
            <div>
              <h3>{ASSISTANT_NAME}</h3>
              <p>Personal line / local unit</p>
            </div>
          </div>

          <div className="state-block">
            <div>
              <span>Intent scan</span>
              <strong>{meta?.intent || "waiting"}</strong>
            </div>
            <div>
              <span>Tone read</span>
              <strong>{meta?.mood || "neutral"}</strong>
            </div>
          </div>

          {meta?.savedMemory && (
            <div className="memory-note">
              <Database size={17} />
              <div><span>Saved to memory</span><p>{meta.savedMemory}</p></div>
            </div>
          )}

          <div className="prompt-bank">
            <span>Quick openers</span>
            {quickPrompts.map((prompt) => (
              <button
                type="button"
                onClick={() => selectPrompt(prompt)}
                disabled={isBusy}
                key={prompt}
              >
                {prompt}
              </button>
            ))}
          </div>
        </aside>

        <section className="chat-panel" id="live-console" aria-label="Chat dengan ECLPS">
          <header className="chat-toolbar">
            <span>
              <i className={status === "error" ? "error" : ""} aria-hidden="true" /> {statusLabel}
            </span>
            <button
              type="button"
              onClick={startNewChat}
              aria-label={isBusy ? "Tinggalkan respons dan mulai chat baru; memori tetap ada" : "Mulai chat baru; memori tetap ada"}
              title="Mulai chat baru; memori tersimpan tetap ada"
            >
              <RotateCcw size={14} /> New chat
            </button>
          </header>
          <div
            className="messages"
            ref={messagesRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-busy={isBusy}
            tabIndex={0}
          >
            {messages.map((message, index) => (
              <article className={`message ${message.role}`} key={message.id || index}>
                <span>{message.role === "assistant" ? "ECLPS" : "YOU"}</span>
                <p>{message.content}</p>
              </article>
            ))}
            {errorNotice && (
              <div className="chat-error" role="alert">
                <strong>LINE ERROR</strong>
                <p>{errorNotice}</p>
              </div>
            )}
            {status === "sending" && (
              <article className="message assistant typing">
                <span>ECLPS</span>
                <p>Typing<span className="typing-dots">...</span></p>
              </article>
            )}
          </div>

          <form className="composer" onSubmit={onSubmit}>
            <label>
              <span>MESSAGE_INPUT</span>
              <textarea
                ref={inputRef}
                id="message-input"
                aria-label="Pesan"
                autoComplete="off"
                disabled={isBusy}
                maxLength={600}
                rows={1}
                placeholder="Tulis apa yang lagi ada di kepala..."
                value={input}
                onChange={onInputChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
            </label>
            <button type="submit" aria-label="Kirim pesan" disabled={isBusy || !input.trim()}>
              <SendHorizontal size={20} />
              <span>Send</span>
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}
