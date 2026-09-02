export const RIVE_BORDER_STROKE = {
  dark: "#3F3F3F",
  light: "#DBDBDB",
};

export const RIVE_POINT_COLOR = {
  dark: "#FFFFFF",
  light: "#000000",
};

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

export function hexToRiveColor(hex) {
  return Number.parseInt(`ff${hex.slice(1)}`, 16);
}
