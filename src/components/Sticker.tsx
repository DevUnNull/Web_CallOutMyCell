import type { CSSProperties, ReactElement } from "react";

export type StickerKind = "star" | "heart" | "flower" | "virus" | "cell" | "bubble" | "sparkle" | "bacteria";

const O = "#57362F";

const shapes: Record<StickerKind, ReactElement> = {
  star: (
    <path
      d="M32 5l7.6 15.8 17.4 2.3-12.7 12 3.2 17.2L32 44l-15.5 8.3 3.2-17.2L7 23.1l17.4-2.3z"
      fill="#F7D67A"
      stroke={O}
      strokeWidth="4"
      strokeLinejoin="round"
    />
  ),
  heart: (
    <path
      d="M32 56S7 41 7 23.5C7 15 13.5 9 21 9c5 0 9 3 11 7 2-4 6-7 11-7 7.5 0 14 6 14 14.5C57 41 32 56 32 56z"
      fill="#E98191"
      stroke={O}
      strokeWidth="4"
      strokeLinejoin="round"
    />
  ),
  flower: (
    <g stroke={O} strokeWidth="3.5">
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="32" cy="17" rx="9" ry="12" fill="#FBD3DC" transform={`rotate(${r} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="8" fill="#F7D67A" />
    </g>
  ),
  virus: (
    <g stroke={O} strokeWidth="3.5" strokeLinecap="round">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <g key={r} transform={`rotate(${r} 32 32)`}>
          <line x1="32" y1="14" x2="32" y2="6" />
          <circle cx="32" cy="5" r="3.5" fill="#A8C78B" />
        </g>
      ))}
      <circle cx="32" cy="32" r="18" fill="#A8C78B" />
      <circle cx="26" cy="29" r="2.5" fill={O} stroke="none" />
      <circle cx="38" cy="29" r="2.5" fill={O} stroke="none" />
      <path d="M26 38q6-4 12 0" fill="none" />
    </g>
  ),
  bacteria: (
    <g stroke={O} strokeWidth="3.5" strokeLinecap="round">
      <path d="M14 32c-6 0-8-4-10-6M50 32c6 0 8 4 10 6" fill="none" />
      <rect x="12" y="20" width="40" height="24" rx="12" fill="#C9B6E4" />
      <circle cx="26" cy="31" r="2.5" fill={O} stroke="none" />
      <circle cx="38" cy="31" r="2.5" fill={O} stroke="none" />
      <path d="M28 38h8" fill="none" />
    </g>
  ),
  cell: (
    <g stroke={O} strokeWidth="3.5">
      <path
        d="M32 6c10 0 14 6 19 9s8 9 6 17-1 14-9 19-14 7-21 5-15-6-17-15 0-15 4-21S22 6 32 6z"
        fill="#FFF0D9"
      />
      <circle cx="32" cy="30" r="9" fill="#F6A5B5" />
      <circle cx="21" cy="40" r="2" fill={O} stroke="none" />
      <circle cx="43" cy="40" r="2" fill={O} stroke="none" />
      <path d="M28 45q4 3 8 0" fill="none" strokeLinecap="round" />
    </g>
  ),
  bubble: (
    <g stroke={O} strokeWidth="3">
      <circle cx="32" cy="32" r="24" fill="#A8D9E8" fillOpacity="0.55" />
      <path d="M20 24q4-8 12-9" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  sparkle: (
    <path
      d="M32 4c2 16 6 22 26 28-20 6-24 12-26 28-2-16-6-22-26-28 20-6 24-12 26-28z"
      fill="#FFF7EA"
      stroke={O}
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
  ),
};

type Props = {
  kind: StickerKind;
  size?: number;
  className?: string;
  style?: CSSProperties;
  float?: boolean;
};

export default function Sticker({ kind, size = 48, className = "", style, float = true }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`sticker ${float ? "js-float" : ""} ${className}`}
      style={style}
    >
      {shapes[kind]}
    </svg>
  );
}
