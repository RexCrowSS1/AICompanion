import { useEffect, useRef, useState } from "react";
import ChatSection from "./components/sections/ChatSection";
import CinematicStrip from "./components/sections/CinematicStrip";
import HeroSection from "./components/sections/HeroSection";
import MemoryBand from "./components/sections/MemoryBand";
import StickyExperience from "./components/sections/StickyExperience";
import SystemGrid from "./components/sections/SystemGrid";
import TickerBand from "./components/sections/TickerBand";
import Topbar from "./components/sections/Topbar";
import { API_URL, starterMessages } from "./constants/companionContent";
import useScrollMotion from "./hooks/useScrollMotion";

export default function App() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [meta, setMeta] = useState(null);
  const [errorNotice, setErrorNotice] = useState("");
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const activeRequestRef = useRef(null);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  useScrollMotion();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      activeRequestRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const messagesPanel = messagesRef.current;
    if (!messagesPanel) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    messagesPanel.scrollTo({
      top: messagesPanel.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages]);

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || status === "sending" || activeRequestRef.current) return;

    const shouldRestoreFocus = event.currentTarget.contains(document.activeElement);

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const userMessageId = `user-${requestId}`;
    const controller = new AbortController();
    activeRequestRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 25000);

    setErrorNotice("");
    setInput("");
    setStatus("sending");
    setMessages((current) => [
      ...current,
      { id: userMessageId, role: "user", content: text },
    ]);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const responseError = new Error("Backend tidak merespons dengan benar.");
        responseError.status = response.status;
        throw responseError;
      }

      const data = await response.json();
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
      setConversationId(data.conversation_id);
      setMeta({
        intent: data.intent,
        mood: data.mood,
        savedMemory: data.saved_memory,
      });
      setMessages((current) => [
        ...current,
        { id: `assistant-${requestId}`, role: "assistant", content: data.reply },
      ]);
      setStatus("idle");
    } catch (error) {
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
      setMessages((current) => current.filter((message) => message.id !== userMessageId));
      setInput(text);
      if (error?.status === 404) {
        setConversationId(null);
        setMeta(null);
        setErrorNotice("Session lama sudah tidak ada. Draft aman — kirim lagi untuk membuka chat baru.");
      } else if (error?.name === "AbortError") {
        setErrorNotice("Line terlalu lama merespons. Draft sudah dikembalikan — coba lagi saat siap.");
      } else {
        setErrorNotice("Line ke ECLPS putus. Cek backend dan database; draft kamu tetap aman.");
      }
      setStatus("error");
    } finally {
      window.clearTimeout(timeoutId);
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }
      if (shouldRestoreFocus && mountedRef.current && requestId === requestIdRef.current) {
        window.requestAnimationFrame(() => {
          if (document.activeElement === document.body) inputRef.current?.focus();
        });
      }
    }
  }

  function clearConversation() {
    requestIdRef.current += 1;
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    setConversationId(null);
    setMeta(null);
    setMessages(starterMessages);
    setInput("");
    setErrorNotice("");
    setStatus("idle");
  }

  return (
    <div className="site-shell">
      <Topbar />
      <main>
        <HeroSection />
        <TickerBand />
        <ChatSection
          errorNotice={errorNotice}
          input={input}
          inputRef={inputRef}
          messages={messages}
          messagesRef={messagesRef}
          meta={meta}
          onInputChange={(event) => setInput(event.target.value)}
          onPromptSelect={setInput}
          onReset={clearConversation}
          onSubmit={sendMessage}
          status={status}
        />
        <CinematicStrip />
        <StickyExperience />
        <SystemGrid />
      </main>
      <MemoryBand />
    </div>
  );
}
