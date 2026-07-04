import { useEffect, useRef, useState } from "react";
import BackgroundField3D from "./components/three/BackgroundField3D";
import ChatSection from "./components/sections/ChatSection";
import CinematicStrip from "./components/sections/CinematicStrip";
import CustomCursor from "./components/CustomCursor";
import HeroSection from "./components/sections/HeroSection";
import MemoryBand from "./components/sections/MemoryBand";
import StickyExperience from "./components/sections/StickyExperience";
import SystemGrid from "./components/sections/SystemGrid";
import TickerBand from "./components/sections/TickerBand";
import Topbar from "./components/sections/Topbar";
import { API_URL, starterMessages } from "./constants/companionContent";
import useCinematicScroll from "./hooks/useCinematicScroll";
import useScrollMotion from "./hooks/useScrollMotion";

let resetSessionPromise = null;

function resetSessionOnPageLoad() {
  if (!resetSessionPromise) {
    resetSessionPromise = fetch(`${API_URL}/session/reset`, {
      method: "POST",
    }).catch(() => null);
  }
  return resetSessionPromise;
}

export default function App() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [status, setStatus] = useState("resetting");
  const [meta, setMeta] = useState(null);
  const messagesRef = useRef(null);

  useScrollMotion();
  useCinematicScroll();

  useEffect(() => {
    let active = true;

    resetSessionOnPageLoad().then(() => {
      if (!active) return;
      setConversationId(null);
      setMeta(null);
      setMessages(starterMessages);
      setStatus("idle");
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const messagesPanel = messagesRef.current;
    if (!messagesPanel) return;
    messagesPanel.scrollTo({
      top: messagesPanel.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || status !== "idle") return;

    setInput("");
    setStatus("sending");
    setMessages((current) => [...current, { role: "user", content: text }]);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend tidak merespons dengan benar.");
      }

      const data = await response.json();
      setConversationId(data.conversation_id);
      setMeta({
        intent: data.intent,
        mood: data.mood,
        savedMemory: data.saved_memory,
      });
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Aku belum bisa tersambung ke ruang chat. Pastikan backend dan database sudah berjalan.",
        },
      ]);
    }
  }

  return (
    <main className="site-shell">
      <BackgroundField3D />
      <CustomCursor />
      <Topbar />
      <HeroSection />
      <TickerBand />
      <CinematicStrip />
      <StickyExperience />
      <ChatSection
        input={input}
        messages={messages}
        messagesRef={messagesRef}
        meta={meta}
        onInputChange={(event) => setInput(event.target.value)}
        onSubmit={sendMessage}
        status={status}
      />
      <SystemGrid />
      <MemoryBand />
    </main>
  );
}
