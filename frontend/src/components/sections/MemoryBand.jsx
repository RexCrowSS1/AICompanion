import { ArrowUpRight, LockKeyhole } from "lucide-react";

export default function MemoryBand() {
  return (
    <footer className="memory-band" id="memory">
      <div className="memory-callout" data-scroll-motion>
        <div className="memory-icon"><LockKeyhole size={28} /></div>
        <div>
          <p className="eyebrow">LOCAL FIRST // 05</p>
          <h2>YOUR CHAT.<br />YOUR MACHINE.<br />END OF STORY.</h2>
        </div>
        <div className="memory-copy">
          <p>
            Pada setup bawaan, database, memori, dan percakapan berjalan di
            stack lokalmu — tetap ada di bawah kontrolmu.
          </p>
          <a href="#live-console">Back to the line <ArrowUpRight size={17} /></a>
        </div>
      </div>
      <div className="footer-row">
        <span>ECLPS® PERSONAL CHAT SYSTEM</span>
        <span>BUILT FOR LATE THOUGHTS — 2026</span>
        <a href="#top">TOP ↑</a>
      </div>
    </footer>
  );
}
