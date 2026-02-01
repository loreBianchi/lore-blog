export const colors = {
  cyan: "#22d3ee",
  purple: "#a78bfa",
  pink: "#ec4899",
  green: "#34d399",
  yellow: "#facc15",
  red: "#f87171",
  blue: "#3b82f6",
};

export type ColorKey = keyof typeof colors;

export const colorNames: Record<ColorKey, string> = {
  cyan: "cyan",
  purple: "purple",
  pink: "pink",
  green: "green",
  yellow: "yellow",
  red: "red",
  blue: "blue",
};

export type ColorOption = {
  id: ColorKey;
  name: string;
  color: string;
};

export type ColorSet = {
  primary: number;
  secondary: number;
  glow: number;
};

export type ColorSetGroup = Record<ColorKey, ColorSet>;