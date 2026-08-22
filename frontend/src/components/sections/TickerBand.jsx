import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { tickerWords } from "../../constants/companionContent";

export default function TickerBand() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className={`ticker-band${isPaused ? " is-paused" : ""}`} aria-label="Kemampuan ECLPS">
      <button
        className="ticker-toggle"
        type="button"
        aria-label={isPaused ? "Jalankan teks bergerak" : "Jeda teks bergerak"}
        aria-pressed={isPaused}
        onClick={() => setIsPaused((current) => !current)}
      >
        {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
      </button>
      <div>
        <span className="ticker-track">
          {tickerWords.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </span>
        <span className="ticker-track" aria-hidden="true">
          {tickerWords.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </span>
      </div>
    </section>
  );
}
