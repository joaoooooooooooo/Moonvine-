export function getStatusListCardCount(items = []) {
  return String(items.length).padStart(2, "0");
}
