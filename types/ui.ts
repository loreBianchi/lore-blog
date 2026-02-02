export type NavItem = {
  path: string;
  name: string;
  isExternal: boolean;
  badge?: string;
};

export type Size = "sm" | "md" | "lg";

export type ControlsPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type ControlsPositionClass = {
  [key in ControlsPosition]: string;
};

export type ControlsDisplay = "vertical" | "horizontal";