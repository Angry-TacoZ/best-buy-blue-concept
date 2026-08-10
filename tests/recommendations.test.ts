import { describe, expect, it } from 'vitest'
import { defaultMemory } from '../src/data/memory'
import { products } from '../src/data/products'
import { getProductGuidance, getShortlist, hasCadNeed, scoreProduct } from '../src/lib/recommendations'

describe('recommendations', () => {
  it('uses remembered CAD coursework to select one capable finalist per archetype', () => {
    const shortlist = getShortlist(products, defaultMemory)

    expect(shortlist).toHaveLength(3)
    expect(new Set(shortlist.map(({ product }) => product.archetype))).toEqual(
      new Set(['ultralight', 'durable', 'value']),
    )
    expect(shortlist.map(({ product }) => product.id)).toEqual(['halo-14', 'forge-14', 'atlas-14-ob'])
    expect(shortlist.every(({ rationale }) => /GPU|graphics/i.test(rationale))).toBe(true)
  })

  it('produces a worse generic result for the same CAD scenario when memory is disabled', () => {
    const personalized = getShortlist(products, defaultMemory)
    const generic = getShortlist(products, { ...defaultMemory, enabled: false })

    expect(personalized[0].product.id).toBe('halo-14')
    expect(generic[0].product.id).toBe('aer-13')
    expect(generic[0].product.specs.gpuClass).toBe('integrated')
    expect(generic.map(({ product }) => product.id)).not.toEqual(personalized.map(({ product }) => product.id))
  })

  it('recognizes supported CAD language and removes the capability adjustment when the need is deleted', () => {
    expect(hasCadNeed(defaultMemory)).toBe(true)
    const withoutCad = { ...defaultMemory, additionalNeeds: 'Prefers a quiet keyboard.' }
    expect(hasCadNeed(withoutCad)).toBe(false)
    expect(getShortlist(products, withoutCad)[0].product.id).toBe('aer-13')
  })

  it('changes product guidance when CAD memory is unavailable', () => {
    const aer = products.find(({ id }) => id === 'aer-13')!
    expect(getProductGuidance(aer, defaultMemory)).toMatch(/CAD changes this choice/i)
    expect(getProductGuidance(aer, { ...defaultMemory, enabled: false })).toMatch(/do not know CAD coursework matters/i)
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
