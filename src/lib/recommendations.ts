import type { Product, ProductArchetype, ShoppingMemory, ShortlistResult } from '../types'

const genericPriorities: ShoppingMemory['priorities'] = {
  portability: 6,
  durability: 6,
  battery: 4,
  performance: 14,
  value: 5,
}

const archetypeOrder: ProductArchetype[] = ['ultralight', 'durable', 'value']

export const scoreProduct = (product: Product, memory: ShoppingMemory): number => {
  const priorities = memory.enabled ? memory.priorities : genericPriorities
  const weighted = Object.entries(priorities).reduce((total, [key, weight]) => {
    return total + product.attributes[key as keyof Product['attributes']] * weight
  }, 0)
  const budgetPenalty = memory.enabled && product.price > memory.budget ? (product.price - memory.budget) / 20 : 0
  const openBoxPenalty = product.condition.startsWith('Open-box') && (!memory.enabled || !memory.openBox) ? 35 : 0
  return Math.round((weighted - budgetPenalty - openBoxPenalty) * 10) / 10
}

export const getShortlist = (catalogue: Product[], memory: ShoppingMemory): ShortlistResult[] =>
  archetypeOrder.map((archetype) => {
    const ranked = catalogue
      .filter((product) => product.archetype === archetype)
      .map((product) => ({ product, score: scoreProduct(product, memory) }))
      .sort((a, b) => b.score - a.score)

    const selected = ranked[0]
    const rationale = memory.enabled
      ? archetype === 'ultralight'
        ? `${selected.product.weight} lb and ${selected.product.batteryHours} hours directly answer the campus-carrying goal.`
        : archetype === 'durable'
          ? 'Its reinforced construction best protects the four-year ownership bet.'
          : `Open-box pricing preserves $${memory.budget - selected.product.price} of the stated budget without abandoning core needs.`
      : archetype === 'ultralight'
        ? 'The most portable option in this illustrative catalogue.'
        : archetype === 'durable'
          ? 'The strongest construction with balanced everyday performance.'
          : 'The lowest cost among the candidates with acceptable general specifications.'

    return {
      ...selected,
      rationale,
      tradeoff: selected.product.tradeoff,
      changeFactor: selected.product.changeFactor,
    }
  })
