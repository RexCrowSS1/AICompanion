import { Database, LockKeyhole, Radio, SlidersHorizontal } from "lucide-react";
import { stickyChapters } from "../../constants/companionContent";

const iconMap = {
  database: Database,
  lock: LockKeyhole,
  radio: Radio,
  sliders: SlidersHorizontal,
};

export default function StickyExperience() {
  return (
    <section className="sticky-experience" id="experience">
      <div className="experience-heading" data-scroll-motion>
        <div>
          <p className="eyebrow">SYSTEM BOARD // 04</p>
          <h2>EMPAT SISTEM. SATU OBROLAN YANG NGGAK KEHILANGAN BENANG.</h2>
        </div>
        <p>NO FLUFF.<br />JUST GOOD COMPANY.</p>
      </div>

      <div className="experience-grid">
        {stickyChapters.map((chapter, index) => {
          const Icon = iconMap[chapter.icon] || Radio;
          return (
            <article className={`system-card ${chapter.id}`} key={chapter.id} data-scroll-motion>
              <div className="card-serial">
                <span>{chapter.label}</span>
                <small>SYS.{String(index + 1).padStart(2, "0")}</small>
              </div>
              <div className="system-icon"><Icon size={26} strokeWidth={1.8} /></div>
              <p className="eyebrow">{chapter.eyebrow}</p>
              <h3>{chapter.title}</h3>
              <p className="system-text">{chapter.text}</p>
              <div className="system-meter" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6].map((bar) => <i key={bar} />)}
              </div>
              <div className="chapter-detail-grid" aria-label={`${chapter.eyebrow} details`}>
                {chapter.details.map((detail) => (
                  <small key={detail}>{detail}</small>
                ))}
              </div>
              <div className="chapter-accent">
                <span aria-hidden="true" />
                <strong>{chapter.accent}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
