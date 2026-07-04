import { MemoryStick, Send, Sparkles } from "lucide-react";
import { ASSISTANT_NAME } from "../../constants/companionContent";

export default function ChatSection({
  input,
  messages,
  messagesRef,
  meta,
  onInputChange,
  onSubmit,
  status,
}) {
  const isBusy = status !== "idle";

  return (
    <section className="product-band" id="chat">
      <div className="section-heading" data-scroll-motion>
        <p className="eyebrow">Live console</p>
        <h2>Chat langsung dengan Eclps.</h2>
      </div>

      <div className="chat-layout" id="live-console" data-scroll-motion>
        <aside className="side-panel">
          <div className="assistant-card">
            <span className="assistant-mark">
              <Sparkles size={20} />
            </span>
            <div>
              <h3>{ASSISTANT_NAME}</h3>
              <p>Hangat, playful, dan context-aware.</p>
            </div>
          </div>

          <div className="state-block">
            <div>
              <span>Intent</span>
              <strong>{meta?.intent || "belum ada"}</strong>
            </div>
            <div>
              <span>Mood</span>
              <strong>{meta?.mood || "netral"}</strong>
            </div>
          </div>

          {meta?.savedMemory && (
            <div className="memory-note">
              <MemoryStick size={18} />
              <p>{meta.savedMemory}</p>
            </div>
          )}
        </aside>

        <section className="chat-panel" aria-label="Chat dengan Eclps Assistance">
          <div className="messages" ref={messagesRef}>
            {messages.map((message, index) => (
              <article className={`message ${message.role}`} key={index}>
                {message.content}
              </article>
            ))}
            {status === "sending" && (
              <article className="message assistant typing">
                Eclps sedang merangkai jawaban...
              </article>
            )}
          </div>

          <form className="composer" onSubmit={onSubmit}>
            <input
              aria-label="Pesan"
              disabled={isBusy}
              placeholder="Tulis pesanmu..."
              value={input}
              onChange={onInputChange}
            />
            <button type="submit" aria-label="Kirim pesan" disabled={isBusy}>
              <Send size={20} />
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}
