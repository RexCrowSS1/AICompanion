import heroImage from "../../assets/eclps-hero.png";
import { ASSISTANT_NAME, orbitMedia } from "../../constants/companionContent";

export default function CinematicStrip() {
  return (
    <section className="cinematic-strip" aria-label="AI companion cinematic scroll">
      <div className="cinematic-word left">DIGITAL</div>
      <div className="cinematic-word right">COMPANION</div>
      <div className="cinematic-core" data-cursor="focus">
        <img src={heroImage} alt="" />
        <span>{ASSISTANT_NAME}</span>
      </div>
      <div className="cinematic-orbit" aria-hidden="true">
        {orbitMedia.map((item, index) => (
          <div className="cinematic-card" style={{ "--i": index }} key={item}>
            <img src={heroImage} alt="" />
            <strong>{item}</strong>
          </div>
        ))}
      </div>
      <div className="cinematic-caption">
        <span>Scroll reactive presence</span>
        <strong>Visual companion space</strong>
      </div>
      <div className="cinematic-sheet">
        <strong>All your companion signals</strong>
        <span>Private, emotional, and contextual flow</span>
      </div>
    </section>
  );
}
