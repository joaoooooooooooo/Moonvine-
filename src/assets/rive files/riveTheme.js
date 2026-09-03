export const RIVE_BORDER_STROKE = {
  dark: "#2D2D2D",
  light: "#E0E0E0",
};

export const RIVE_POINT_COLOR = {
  dark: "#FFFFFF",
  light: "#000000",
};

export const RIVE_STROKE_WIDTH = 1;

export function getRiveBorderStrokeColor() {
  return document.documentElement.classList.contains("dark")
    ? RIVE_BORDER_STROKE.dark
    : RIVE_BORDER_STROKE.light;
}

export function getRivePointColor() {
  return document.documentElement.classList.contains("dark")
    ? RIVE_POINT_COLOR.dark
    : RIVE_POINT_COLOR.light;
}

export function getRiveStrokeWidth() {
  return RIVE_STROKE_WIDTH;
}

export function hexToRiveColor(hex) {
  return Number.parseInt(`ff${hex.slice(1)}`, 16);
}
