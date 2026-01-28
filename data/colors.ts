import { ColorKey, ColorOption, ColorSetGroup } from "@/types/colors";
import * as THREE from "three";

export const colorOptions: ColorOption[] = [
  { id: "cyan", name: "Cyan", color: "#00B4D8" },
  { id: "purple", name: "Purple", color: "#9D4EDD" },
  { id: "pink", name: "Pink", color: "#FF006E" },
  { id: "green", name: "Green", color: "#00FF88" },
  { id: "blue", name: "Blue", color: "#4CC9F0" },
  { id: "yellow", name: "Yellow", color: "#FFD166" },
  { id: "red", name: "Red", color: "#EF476F" },
];

export const colorMap: Record<ColorKey, THREE.Color> = {
  cyan: new THREE.Color(0x00b4d8),
  purple: new THREE.Color(0x9d4edd),
  pink: new THREE.Color(0xff006e),
  green: new THREE.Color(0x00ff88),
  blue: new THREE.Color(0x4cc9f0),
  yellow: new THREE.Color(0xffd166),
  red: new THREE.Color(0xef476f),
};

export const colorsSets: ColorSetGroup = {
  purple: {
    primary: 0x9d4edd,
    secondary: 0x7b2cbf,
    glow: 0xc77dff,
  },
  cyan: {
    primary: 0x00b4d8,
    secondary: 0x0077b6,
    glow: 0x90e0ef,
  },
  pink: {
    primary: 0xff006e,
    secondary: 0xff0054,
    glow: 0xff5c8d,
  },
  green: {
    primary: 0x00ff88,
    secondary: 0x00cc66,
    glow: 0x66ffb3,
  },
  blue: {
    primary: 0x4cc9f0,
    secondary: 0x3a86ff,
    glow: 0x90e0ef,
  },
  yellow: {
    primary: 0xffd166,
    secondary: 0xf4a261,
    glow: 0xffe29b,
  },
  red: {
    primary: 0xef476f,
    secondary: 0xd90429,
    glow: 0xff6f91,
  },
};
