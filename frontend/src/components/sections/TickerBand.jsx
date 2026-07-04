import { tickerWords } from "../../constants/companionContent";

export default function TickerBand() {
  return (
    <section className="ticker-band" aria-label="AI companion capabilities">
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
