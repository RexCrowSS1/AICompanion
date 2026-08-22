import { MessageSquareText } from "lucide-react";
import { ASSISTANT_NAME } from "../../constants/companionContent";

export default function Topbar() {
  return (
    <nav className="topbar" aria-label="Navigasi utama">
      <div className="topbar-frame">
        <a className="brand" href="#top" aria-label="Beranda ECLPS">
          <span className="brand-icon" aria-hidden="true">
            <MessageSquareText size={17} strokeWidth={2.4} />
          </span>
          <span className="brand-copy">
            <strong>{ASSISTANT_NAME}</strong>
            <small>personal chat system</small>
          </span>
        </a>
        <div className="nav-links">
          <a href="#experience">System</a>
          <a href="#live-console">Live line</a>
          <a href="#memory">Privacy</a>
        </div>
        <a className="online-pill" href="#message-input">
          <i aria-hidden="true" />
          Open chat
        </a>
      </div>
    </nav>
  );
}
