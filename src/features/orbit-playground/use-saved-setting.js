import { useEffect, useState } from 'react'

const prefix = 'moonvine:orbit-playground:v2:'

export function readSetting(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(prefix + key))
    if (value === null || typeof value !== typeof fallback) return fallback
    if (typeof fallback === 'number') return Number.isFinite(value) ? value : fallback
    if (Array.isArray(fallback)) {
      if (!Array.isArray(value) || value.length !== fallback.length) return fallback
      return fallback.map((item, index) => ({ ...item, ...value[index] }))
    }
    if (typeof fallback === 'object') return { ...fallback, ...value }
    return value
  } catch { return fallback }
}

export function saveSetting(key, value) {
  try { localStorage.setItem(prefix + key, JSON.stringify(value)) } catch { /* Storage may be unavailable in private sessions. */ }
}

export function useSavedSetting(key, fallback) {
  const [value, setValue] = useState(() => readSetting(key, fallback))
  useEffect(() => { saveSetting(key, value) }, [key, value])
  return [value, setValue]
}
