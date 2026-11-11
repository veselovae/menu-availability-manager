import type { CSSProperties } from "react";

const paths = {
  menu: "M4 5h16M4 12h16M4 19h16M8 3v18",
  plate: "M4 13a8 8 0 0 1 16 0M2 17h20M12 3v2M5 21h14",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  check: "M5 12l4 4L19 6",
  pause: "M9 5v14M15 5v14",
  stock: "M3 7l9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  cup: "M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm12 1h2a3 3 0 0 1 0 6h-2M7 2v2M12 2v2",
  cake: "M3 12h18v8H3v-8Zm2 0V8h14v4M8 8V5m8 3V5M12 8V3M3 15q3 4 6 0 3 4 6 0 3 4 6 0",
  close: "m6 6 12 12M6 18 18 6",
};

export function Icon({
  name,
  size = 20,
  style,
}: {
  name: keyof typeof paths;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
