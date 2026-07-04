import { Brain, HeartHandshake, MemoryStick } from "lucide-react";
import { qualities } from "../../constants/companionContent";

const iconMap = {
  brain: Brain,
  heart: HeartHandshake,
  memory: MemoryStick,
};

export default function SystemGrid() {
  return (
    <section className="system-grid" id="system">
      {qualities.map((quality) => {
        const Icon = iconMap[quality.icon] || Brain;
        return (
          <article className="quality-card" key={quality.title} data-scroll-motion>
            <Icon size={22} />
            <h3>{quality.title}</h3>
            <p>{quality.text}</p>
          </article>
        );
      })}
    </section>
  );
}
