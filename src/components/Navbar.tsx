import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, PLAY_URL } from "../content";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <nav className="nav__bar" aria-label="Điều hướng chính">
        <a href="#trang-chu" className="nav__logo" onClick={close}>
          <img src="favicon.svg" alt="" width="34" height="34" />
          <span>
            Call Out <b>My Cells</b>
          </span>
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul id="nav-menu" className="nav__menu">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={close}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            {PLAY_URL ? (
              <a href={PLAY_URL} className="btn btn--pink btn--sm" target="_blank" rel="noopener noreferrer" onClick={close}>
                Chơi ngay
              </a>
            ) : (
              <a href="#choi-ngay" className="btn btn--pink btn--sm" onClick={close}>
                Chơi ngay
              </a>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
