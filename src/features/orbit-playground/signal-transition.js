import { cubicBezier, easeInOut } from 'motion'

const settle = cubicBezier(0.2, 0, 0, 1)
const clamp = value => Math.max(0, Math.min(1, value))

export function signalTravel(progress) {
  return easeInOut(clamp(progress))
}

export function signalScale(progress) {
  // Grow out of the sender, hold size in flight, then shrink into the receiver.
  // Keeping the endpoints at zero also hides inactive emission slots.
  const departure = settle(clamp(progress / 0.1))
  const arrival = 1 - settle(clamp((progress - 0.92) / 0.08))
  return Math.min(departure, arrival)
}
