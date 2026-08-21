import { describe, expect, it } from 'vitest'
import { defaultMemory } from '../src/data/memory'
import { products } from '../src/data/products'
import { createCuratedCollection } from '../src/lib/curation'

describe('curated laptop collection', () => {
  it('captures the enabled shopping memory at the moment the page is generated', () => {
    const memory = structuredClone(defaultMemory)
    const collection = createCuratedCollection(products, memory, 1_787_200_000_000)

    memory.additionalNeeds = 'Needs a quiet keyboard.'
    memory.budget = 600

    expect(collection.generatedAt).toBe(1_787_200_000_000)
    expect(collection.memorySnapshot.additionalNeeds).toMatch(/CAD class/i)
    expect(collection.memorySnapshot.budget).toBe(1200)
    expect(collection.results.map(({ product }) => product.id)).toEqual(['halo-14', 'forge-14', 'atlas-14-ob'])
    expect(collection.signals).toContain('CAD coursework')
  })

  it('generates generic curation without applying saved signals when memory is off', () => {
    const collection = createCuratedCollection(products, { ...defaultMemory, enabled: false }, 1)

    expect(collection.results[0].product.id).toBe('aer-13')
    expect(collection.signals).toEqual(['General laptop guidance', 'Balanced everyday use', 'No saved context applied'])
  })
})
