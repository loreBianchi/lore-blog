"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface CanvasContainerProps {
  children: ReactNode;
  className?: string;
  theme?: "light" | "dark" | "unset";
  isFullscreen?: boolean;
}

export function CanvasContainer({
  children,
  className,
  theme = "dark",
  isFullscreen = false,
}: CanvasContainerProps) {
  const backgroundClass = {
    dark: "bg-linear-to-br from-gray-900 via-black to-purple-900",
    light: "bg-linear-to-br from-white/10 via-gray-100/5 to-purple-100/10",
    unset: "",
  }[theme];

  return (
    <div
      className={clsx(
        "overflow-hidden shadow-2xl transition-all duration-300 ease-in-out",
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "relative h-[600px] w-full rounded-xl",
        className,
      )}
    >
      <div className={clsx("h-full w-full", backgroundClass)}>{children}</div>
    </div>
  );
}
