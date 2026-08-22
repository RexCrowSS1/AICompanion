export default function CinematicStrip() {
  return (
    <section className="cinematic-strip" aria-labelledby="story-title">
      <div className="story-index" aria-hidden="true">03</div>
      <div className="story-copy" data-scroll-motion>
        <p className="eyebrow">BUILT FOR THE IN-BETWEEN // 03</p>
        <h2 id="story-title">
          IDE SETENGAH JADI. CURHAT JAM 2. HAL KECIL YANG MAU KAMU LANJUTKAN BESOK.
        </h2>
        <p>
          ECLPS menjaga benangnya tetap nyambung. Kamu nggak perlu bikin briefing
          baru setiap kali balik.
        </p>
      </div>
      <div className="memory-disc" data-scroll-motion aria-hidden="true">
        <div className="disc-copy">
          <span>KEEP</span>
          <strong>THE</strong>
          <span>THREAD</span>
        </div>
        <i />
      </div>
      <div className="story-ticket" data-scroll-motion>
        <span>SESSION PASS</span>
        <strong>ECLPS // ALL ACCESS</strong>
        <small>Valid whenever your head gets loud.</small>
      </div>
    </section>
  );
}
