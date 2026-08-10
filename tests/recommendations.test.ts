import { describe, expect, it } from 'vitest'
import { defaultMemory } from '../src/data/memory'
import { products } from '../src/data/products'
import { getShortlist, scoreProduct } from '../src/lib/recommendations'

describe('recommendations', () => {
  it('returns one meaningfully different finalist per archetype', () => {
    const shortlist = getShortlist(products, defaultMemory)

    expect(shortlist).toHaveLength(3)
    expect(new Set(shortlist.map(({ product }) => product.archetype))).toEqual(
      new Set(['ultralight', 'durable', 'value']),
    )
    expect(shortlist.map(({ product }) => product.id)).toEqual(['aer-13', 'forge-14', 'atlas-14-ob'])
  })

  it('changes a finalist when memory is disabled', () => {
    const personalized = getShortlist(products, defaultMemory)
    const generic = getShortlist(products, { ...defaultMemory, enabled: false })

    expect(personalized[0].product.id).toBe('aer-13')
    expect(generic[0].product.id).toBe('halo-14')
    expect(generic.map(({ product }) => product.id)).not.toEqual(personalized.map(({ product }) => product.id))
  })

  it('penalizes products beyond the stated budget', () => {
    const aer = products.find(({ id }) => id === 'aer-13')!
    const strictBudget = { ...defaultMemory, budget: 700 }

    expect(scoreProduct(aer, strictBudget)).toBeLessThan(scoreProduct(aer, defaultMemory))
  })

  it('includes an explanation and decision-changing condition for every finalist', () => {
    for (const result of getShortlist(products, defaultMemory)) {
      expect(result.rationale.length).toBeGreaterThan(20)
      expect(result.tradeoff.length).toBeGreaterThan(20)
      expect(result.changeFactor.length).toBeGreaterThan(20)
    }
  })
})
