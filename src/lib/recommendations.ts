import type { Product, ProductArchetype, ShoppingMemory, ShortlistResult } from '../types'

const genericPriorities: ShoppingMemory['priorities'] = {
  portability: 7,
  durability: 7,
  battery: 6,
  performance: 7,
  value: 6,
}

const archetypeOrder: ProductArchetype[] = ['ultralight', 'durable', 'value']

export const hasCadNeed = (memory: ShoppingMemory): boolean =>
  /\b(cad|autocad|solidworks|revit|3d model(?:ing|ling)?|engineering design)\b/i.test(memory.additionalNeeds)

const cadCapabilityScore = (product: Product): number => {
  const gpuScore = product.specs.gpuClass === 'dedicated' ? 95 : product.specs.gpuClass === 'entry-dedicated' ? 55 : -40
  const memoryScore = product.specs.memoryGb >= 32 ? 35 : product.specs.memoryGb >= 16 ? 15 : -15
  return gpuScore + memoryScore + product.attributes.performance * 5
}

const gpuDescription = (product: Product): string =>
  product.specs.gpuLabel.replace(/^./, (first) => first.toLowerCase())

export const scoreProduct = (product: Product, memory: ShoppingMemory): number => {
  const priorities = memory.enabled ? memory.priorities : genericPriorities
  const weighted = Object.entries(priorities).reduce((total, [key, weight]) => {
    return total + product.attributes[key as keyof Product['attributes']] * weight
  }, 0)
  const budgetPenalty = memory.enabled && product.price > memory.budget ? (product.price - memory.budget) / 20 : 0
  const openBoxPenalty = product.condition.startsWith('Open-box') && (!memory.enabled || !memory.openBox) ? 35 : 0
  const cadAdjustment = memory.enabled && hasCadNeed(memory) ? cadCapabilityScore(product) : 0
  return Math.round((weighted + cadAdjustment - budgetPenalty - openBoxPenalty) * 10) / 10
}

export const getProductGuidance = (product: Product, memory: ShoppingMemory): string => {
  if (!memory.enabled) {
    return `I can compare ${product.specs.memoryGb} GB of memory and ${gpuDescription(product)}, but without memory I do not know CAD coursework matters.`
  }

  if (hasCadNeed(memory)) {
    if (product.specs.gpuClass === 'integrated') {
      return `CAD changes this choice. ${product.specs.memoryGb} GB is workable, but integrated graphics may struggle with complex 3D assemblies.`
    }
    return `For CAD, ${gpuDescription(product)} and ${product.specs.memoryGb} GB of memory make this a more credible coursework option.`
  }

  return product.archetype === 'ultralight'
    ? `${product.weight} pounds matters when it crosses campus every day. I’m weighing that against long-term durability.`
    : product.archetype === 'durable'
      ? `This is the sturdier four-year bet. The honest cost is ${product.weight} pounds in the backpack.`
      : `$${(product.originalPrice ?? product.price) - product.price} saved is useful—but only if the condition and warranty check out.`
}

export const getShortlist = (catalogue: Product[], memory: ShoppingMemory): ShortlistResult[] =>
  archetypeOrder.map((archetype) => {
    const ranked = catalogue
      .filter((product) => product.archetype === archetype)
      .map((product) => ({ product, score: scoreProduct(product, memory) }))
      .sort((a, b) => b.score - a.score)

    const selected = ranked[0]
    const cadAware = memory.enabled && hasCadNeed(memory)
    const rationale = cadAware
      ? archetype === 'ultralight'
        ? `${selected.product.specs.gpuLabel} and ${selected.product.specs.memoryGb} GB of memory make the compact option credible for CAD.`
        : archetype === 'durable'
          ? `A ${gpuDescription(selected.product)}, ${selected.product.specs.memoryGb} GB of memory, and reinforced construction balance CAD work with four-year durability.`
          : `${selected.product.specs.memoryGb} GB and a ${gpuDescription(selected.product)} preserve CAD capability at the strongest price.`
      : memory.enabled
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

    const tradeoff = cadAware
      ? archetype === 'ultralight'
        ? `It is $${Math.max(0, selected.product.price - memory.budget)} over budget and gives up battery life for stronger graphics.`
        : archetype === 'durable'
          ? `The CAD-ready hardware is reassuring, but ${selected.product.weight} pounds is noticeable on a daily campus walk.`
          : 'The entry dedicated GPU suits introductory work, but complex assemblies may reach its limits sooner.'
      : selected.product.tradeoff

    const changeFactor = cadAware
      ? archetype === 'ultralight'
        ? 'Choose a lighter integrated-graphics model only if the course confirms that remote lab machines handle rendering.'
        : archetype === 'durable'
          ? 'It moves down the list if the class is mostly 2D drafting and daily carry matters more than GPU headroom.'
          : 'Move to a stronger dedicated GPU if the syllabus includes large 3D assemblies or frequent rendering.'
      : selected.product.changeFactor

    return {
      ...selected,
      rationale,
      tradeoff,
      changeFactor,
    }
  })
