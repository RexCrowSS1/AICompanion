import { ArrowDownRight, Check, Volume2 } from "lucide-react";
import { signals } from "../../constants/companionContent";

export default function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-utility" data-scroll-motion>
        <span>PERSONAL CHAT SYSTEM // 01</span>
        <span>JAKARTA — LOCAL MODE</span>
        <span>EST. 2026</span>
      </div>

      <div className="hero-grid">
        <article className="hero-copy" data-scroll-motion>
          <div className="hero-chip">
            <Volume2 size={14} />
            Line is open
          </div>
          <h1>
            <span className="hero-title-top">YOUR DIGITAL</span>
            <span>WINGMAN.</span>
          </h1>
          <p className="hero-text">
            Bukan bot kerja kantoran. ECLPS dibuat buat obrolan larut, ide
            setengah matang, dan hal kecil yang ingin kamu lanjutkan besok.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#message-input">
              Buka chat <ArrowDownRight size={18} />
            </a>
            <a className="secondary-action" href="#experience">
              Lihat cara kerja
            </a>
          </div>
          <div className="hero-proof" aria-label="Status sistem">
            <span><Check size={14} /> Free to run</span>
            <span><Check size={14} /> Built for local</span>
            <span><Check size={14} /> No corporate talk</span>
          </div>
        </article>

        <aside
          className="buddy-window"
          data-scroll-motion
          data-cursor="focus"
          aria-label="Profil ECLPS"
        >
          <div className="window-bar">
            <span>ECLPS_BUDDY.EXE</span>
            <div aria-hidden="true"><i /><i /><i /></div>
          </div>
          <div className="buddy-stage">
            <span className="player-sticker">PLAYER<br />01</span>
            <span className="status-sticker">NO NPC<br />ENERGY</span>
            <div className="buddy-avatar" aria-hidden="true">
              <div className="avatar-cap"><i /></div>
              <div className="avatar-ear left" />
              <div className="avatar-ear right" />
              <div className="avatar-head">
                <span className="avatar-eye left" />
                <span className="avatar-eye right" />
                <span className="avatar-mouth" />
              </div>
              <div className="avatar-neck" />
              <div className="avatar-hoodie"><i /></div>
            </div>
            <div className="profile-caption">
              <span>DIGITAL BUDDY</span>
              <strong>ECLPS</strong>
              <small>READY WHEN YOU ARE.</small>
            </div>
          </div>
          <div className="signal-strip" ariaflabel="Status ECLPS">
            {signals.map((signal) => (
              <div key={signal.label}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
