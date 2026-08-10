import { beforeEach, describe, expect, it } from 'vitest'
import { defaultMemory } from '../src/data/memory'
import { clearMemory, loadMemory, MEMORY_KEY, restoreMemory, saveMemory } from '../src/lib/storage'

describe('shopping memory storage', () => {
  beforeEach(() => localStorage.clear())

  it('uses the disclosed demo profile when nothing has been saved', () => {
    expect(loadMemory()).toEqual(defaultMemory)
  })

  it('persists and restores valid memory', () => {
    const changed = { ...defaultMemory, budget: 950, openBox: false }
    saveMemory(changed)
    expect(loadMemory()).toEqual(changed)
  })

  it('recovers safely from malformed or incompatible data', () => {
    localStorage.setItem(MEMORY_KEY, '{not json')
    expect(loadMemory()).toEqual(defaultMemory)

    localStorage.setItem(MEMORY_KEY, JSON.stringify({ version: 99, enabled: true }))
    expect(loadMemory()).toEqual(defaultMemory)
  })

  it('clears memory and returns a disabled, acknowledged state', () => {
    saveMemory(defaultMemory)
    const cleared = clearMemory()
    expect(localStorage.getItem(MEMORY_KEY)).toBeNull()
    expect(cleared.enabled).toBe(false)
    expect(cleared.acknowledged).toBe(true)
    expect(restoreMemory()).toEqual(defaultMemory)
  })
})
