import CompanionScene3D from "../three/CompanionScene3D";
import heroImage from "../../assets/eclps-hero.png";
import { interfaceLines, signals } from "../../constants/companionContent";

export default function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-meta" data-scroll-motion>
        <span>Digital Companion</span>
        <span>Private Presence</span>
        <span>2026</span>
      </div>

      <div className="hero-copy" data-scroll-motion>
        <p className="eyebrow">AI companion interface</p>
        <h1>
          ECLPS
          <span>ASSISTANCE</span>
        </h1>
        <div className="hero-lower">
          <p className="hero-text">
            Companion AI yang terasa dekat, memahami konteks, mengingat hal penting,
            dan merespons dengan ritme yang lebih manusiawi.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#live-console">
              Mulai ngobrol
            </a>
            <a className="secondary-action" href="#experience">
              Lihat experience
            </a>
          </div>
        </div>
      </div>

      <div className="hero-stage" data-scroll-motion data-cursor="focus" aria-label="AI companion visual">
        <CompanionScene3D className="hero-canvas" variant="hero" intensity={1.1} />
        <div className="hero-visual">
          <img src={heroImage} alt="" />
        </div>
        <div className="interface-card">
          {interfaceLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div className="signal-strip" aria-label="AI companion status">
          {signals.map((signal) => (
            <div key={signal.label}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
