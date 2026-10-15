import { useSyncExternalStore } from 'react'
import './asset-fade.css'

export const fadeDefaults = { mode: 'mask', direction: 'edges', right: 24, bottom: 42, start: 25, angle: 135, grain: 0.8 }
const key = 'moonvine:website:shell-fade:v3'
let snapshot
const listeners = new Set()
function getSnapshot() {
  if (!snapshot) {
    try { snapshot = { ...fadeDefaults, ...JSON.parse(localStorage.getItem(key) || '{}') } } catch { snapshot = fadeDefaults }
  }
  return snapshot
}
function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) }
function setFade(value) {
  snapshot = typeof value === 'function' ? value(getSnapshot()) : value
  try { localStorage.setItem(key, JSON.stringify(snapshot)) } catch {}
  listeners.forEach(listener => listener())
}
export function useAssetFade() { return [useSyncExternalStore(subscribe, getSnapshot, () => fadeDefaults), setFade] }
export function assetFadeStyle(fade) {
  const mask = fade.direction === 'diagonal'
    ? `linear-gradient(${fade.angle}deg,#000 ${fade.start}%,transparent 100%)`
    : `linear-gradient(to right,#000 ${100 - fade.right}%,transparent 100%),linear-gradient(to bottom,#000 ${100 - fade.bottom}%,transparent 100%)`
  const clear = 'rgb(from var(--mv-page-background) r g b / 0)'
  const overlay = fade.direction === 'diagonal'
    ? `linear-gradient(${fade.angle}deg,${clear} ${fade.start}%,var(--mv-page-background) 100%)`
    : `linear-gradient(to right,${clear} ${100 - fade.right}%,var(--mv-page-background) 100%),linear-gradient(to bottom,${clear} ${100 - fade.bottom}%,var(--mv-page-background) 100%)`
  return { maskImage: fade.mode === 'mask' ? mask : 'none', WebkitMaskImage: fade.mode === 'mask' ? mask : 'none', '--shell-overlay': fade.mode === 'overlay' ? overlay : 'none', '--shell-grain': fade.grain / 100 }
}
