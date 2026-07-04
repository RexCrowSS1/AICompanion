import { MessageCircle } from "lucide-react";
import { ASSISTANT_NAME } from "../../constants/companionContent";

export default function Topbar() {
  return (
    <nav className="topbar" aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="Eclps Assistance home">
        <span className="brand-icon">
          <MessageCircle size={18} />
        </span>
        <span>{ASSISTANT_NAME}</span>
      </a>
      <div className="nav-links">
        <a href="#live-console">Chat</a>
        <a href="#experience">Experience</a>
        <a href="#memory">Memory</a>
      </div>
    </nav>
  );
}
