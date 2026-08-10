import { defaultMemory } from '../data/memory'
import type { ShoppingMemory } from '../types'

export const MEMORY_KEY = 'blue-shopping-memory-v1'

const isMemory = (value: unknown): value is ShoppingMemory => {
  if (!value || typeof value !== 'object') return false
  const memory = value as Partial<ShoppingMemory>
  return (
    memory.version === 1 &&
    typeof memory.enabled === 'boolean' &&
    typeof memory.acknowledged === 'boolean' &&
    typeof memory.shopper === 'string' &&
    typeof memory.goal === 'string' &&
    typeof memory.budget === 'number' &&
    Number.isFinite(memory.budget) &&
    typeof memory.openBox === 'boolean' &&
    !!memory.priorities &&
    Object.values(memory.priorities).every((value) => typeof value === 'number' && Number.isFinite(value))
  )
}

export const loadMemory = (): ShoppingMemory => {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    if (!raw) return structuredClone(defaultMemory)
    const parsed: unknown = JSON.parse(raw)
    return isMemory(parsed) ? parsed : structuredClone(defaultMemory)
  } catch {
    return structuredClone(defaultMemory)
  }
}

export const saveMemory = (memory: ShoppingMemory): void => {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory))
}

export const clearMemory = (): ShoppingMemory => {
  localStorage.removeItem(MEMORY_KEY)
  return { ...structuredClone(defaultMemory), enabled: false, acknowledged: true }
}

export const restoreMemory = (): ShoppingMemory => structuredClone(defaultMemory)
