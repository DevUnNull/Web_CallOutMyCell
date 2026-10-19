import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { gallery, images } from "../content";
import GameImage from "./GameImage";

export default function GallerySection() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = (step: number) => setIndex((i) => (i + step + gallery.length) % gallery.length);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal(); // native dialog: focus trap + Escape to close
  };
  const close = () => dialog.current?.close();

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    d.addEventListener("keydown", onKey);
    return () => d.removeEventListener("keydown", onKey);
  }, []);

  const current = images[gallery[index].key];

  return (
    <section id="thu-vien" className="section gallery">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Thư viện</p>
          <h2>Một chút hình ảnh từ thế giới Call Out My Cells!</h2>
        </header>

        <ul className="gallery__grid">
          {gallery.map((g, i) => (
            <li key={g.key} className="gallery__item" data-reveal>
              <button type="button" className="gallery__card polaroid" onClick={() => open(i)}>
                <GameImage name={g.key} />
                <span className="gallery__caption">{g.caption}</span>
                <span className="gallery__zoom" aria-hidden="true">
                  <Maximize2 size={18} />
                </span>
                <span className="sr-only">Mở ảnh toàn màn hình</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Xem ảnh toàn màn hình"
        onClick={(e) => e.target === e.currentTarget && close()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <figure className="lightbox__figure">
          <img src={current.src} alt={current.alt} width={current.width} height={current.height} />
          <figcaption>
            {gallery[index].caption} <span className="lightbox__count">{index + 1} / {gallery.length}</span>
          </figcaption>
        </figure>
        <button type="button" className="lightbox__btn lightbox__close" onClick={close} aria-label="Đóng">
          <X size={26} />
        </button>
        <button type="button" className="lightbox__btn lightbox__prev" onClick={() => go(-1)} aria-label="Ảnh trước">
          <ChevronLeft size={28} />
        </button>
        <button type="button" className="lightbox__btn lightbox__next" onClick={() => go(1)} aria-label="Ảnh tiếp theo">
          <ChevronRight size={28} />
        </button>
      </dialog>
    </section>
  );
}
