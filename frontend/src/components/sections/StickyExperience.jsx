import { Fingerprint, MemoryStick, Moon, Waves } from "lucide-react";
import heroImage from "../../assets/eclps-hero.png";
import { ASSISTANT_NAME, stickyChapters } from "../../constants/companionContent";
import CompanionScene3D from "../three/CompanionScene3D";

const iconMap = {
  fingerprint: Fingerprint,
  memory: MemoryStick,
  moon: Moon,
  waves: Waves,
};

export default function StickyExperience() {
  return (
    <section className="sticky-experience" id="experience">
      <div className="experience-heading" data-scroll-motion>
        <p className="eyebrow">Sticky experience</p>
        <h2>Empat lapisan yang membuat Eclps terasa hidup.</h2>
      </div>

      {stickyChapters.map((chapter) => {
        const Icon = iconMap[chapter.icon] || Waves;
        return (
          <section className={`sticky-chapter ${chapter.id} layout-${chapter.layout}`} key={chapter.id}>
            <div className="chapter-shell">
              <article className="chapter-copy" data-scroll-motion>
                <span>{chapter.label}</span>
                <p className="eyebrow">{chapter.eyebrow}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
                <div className="chapter-detail-grid" aria-label={`${chapter.eyebrow} details`}>
                  {chapter.details.map((detail) => (
                    <small key={detail}>{detail}</small>
                  ))}
                </div>
                <div className="chapter-accent">
                  <Icon size={18} />
                  <strong>{chapter.accent}</strong>
                </div>
              </article>

              <div className="chapter-visual" data-cursor="focus">
                <div className="chapter-navline">
                  <span>{ASSISTANT_NAME}</span>
                  <small>{chapter.label}</small>
                </div>
                <CompanionScene3D variant={chapter.variant} intensity={0.92} />
                <div className="chapter-media-stack" aria-hidden="true">
                  <figure>
                    <img src={heroImage} alt="" />
                  </figure>
                  <figure>
                    <img src={heroImage} alt="" />
                  </figure>
                  <figure>
                    <img src={heroImage} alt="" />
                  </figure>
                </div>
                <div className="chapter-depth" aria-hidden="true">
                  {chapter.visualWords.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </div>
                <div className="chapter-slice" aria-hidden="true" />
                <div className="chapter-orbit" aria-hidden="true" />
                <div className="chapter-readout">
                  <span>{chapter.eyebrow}</span>
                  <strong>{chapter.accent}</strong>
                </div>
                <div className="chapter-sheet">
                  <strong>{chapter.sheetTitle}</strong>
                  <span>{chapter.sheetMeta}</span>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </section>
  );
}
