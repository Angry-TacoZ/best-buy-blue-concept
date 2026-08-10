import type { ShoppingMemory } from '../types'

export const defaultMemory: ShoppingMemory = {
  version: 2,
  enabled: true,
  acknowledged: false,
  shopper: 'Parent shopping for a first-year college student',
  goal: 'A portable, durable laptop for daily trips across campus',
  additionalNeeds: 'The student will be enrolled in a CAD class.',
  budget: 1200,
  openBox: true,
  priorities: {
    portability: 10,
    durability: 10,
    battery: 9,
    performance: 7,
    value: 8,
  },
}
