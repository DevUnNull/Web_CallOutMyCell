import { useState } from "react";
import { images, type ImageKey } from "../content";

type Props = {
  name: ImageKey;
  eager?: boolean;
  className?: string;
};

// Full screenshots: object-fit contain, native aspect ratio, never cropped.
export default function GameImage({ name, eager = false, className = "" }: Props) {
  const img = images[name];
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  return (
    <div
      className={`game-img is-${state} ${className}`}
      style={{ aspectRatio: `${img.width} / ${img.height}` }}
    >
      {state === "error" ? (
        <p className="game-img__fallback">Không tải được hình ảnh 🥲</p>
      ) : (
        <img
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          onLoad={() => setState("ok")}
          onError={() => setState("error")}
        />
      )}
    </div>
  );
}
