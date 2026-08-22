import { Database, ScanLine, ShieldCheck } from "lucide-react";
import { qualities } from "../../constants/companionContent";

const iconMap = {
  database: Database,
  scan: ScanLine,
  shield: ShieldCheck,
};

export default function SystemGrid() {
  return (
    <section className="system-grid" id="system" aria-labelledby="system-grid-title">
      <h2 className="sr-only" id="system-grid-title">Cara ECLPS menjaga percakapan tetap nyambung</h2>
      {qualities.map((quality) => {
        const Icon = iconMap[quality.icon] || ScanLine;
        return (
          <article className="quality-card" key={quality.title} data-scroll-motion>
            <div className="quality-top"><span>{quality.number}</span><Icon size={22} /></div>
            <h3>{quality.title}</h3>
            <p>{quality.text}</p>
          </article>
        );
      })}
    </section>
  );
}
