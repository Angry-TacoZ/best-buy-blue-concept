import { getShortlist, hasCadNeed } from './recommendations'
import type { CuratedCollection, Product, ShoppingMemory } from '../types'

const cloneMemory = (memory: ShoppingMemory): ShoppingMemory => JSON.parse(JSON.stringify(memory)) as ShoppingMemory

export const getCurationSignals = (memory: ShoppingMemory): string[] => {
  if (!memory.enabled) return ['General laptop guidance', 'Balanced everyday use', 'No saved context applied']

  return [
    hasCadNeed(memory) ? 'CAD coursework' : memory.additionalNeeds || 'No additional coursework',
    `Budget up to $${memory.budget.toLocaleString()}`,
    `Portability ${memory.priorities.portability}/10`,
    `Durability ${memory.priorities.durability}/10`,
    `Battery ${memory.priorities.battery}/10`,
    memory.openBox ? 'Open-box welcome' : 'New condition only',
  ]
}

export const createCuratedCollection = (
  catalogue: Product[],
  memory: ShoppingMemory,
  generatedAt = Date.now(),
): CuratedCollection => {
  const memorySnapshot = cloneMemory(memory)

  return {
    generatedAt,
    memorySnapshot,
    results: getShortlist(catalogue, memorySnapshot),
    signals: getCurationSignals(memorySnapshot),
  }
}
