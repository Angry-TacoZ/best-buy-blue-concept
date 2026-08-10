export type ProductArchetype = 'ultralight' | 'durable' | 'value'

export interface Product {
  id: string
  name: string
  edition: string
  archetype: ProductArchetype
  price: number
  originalPrice?: number
  condition: 'New' | 'Open-box excellent'
  weight: number
  batteryHours: number
  attributes: {
    portability: number
    durability: number
    battery: number
    performance: number
    value: number
  }
  highlights: string[]
  tradeoff: string
  changeFactor: string
  palette: [string, string]
}

export interface ShoppingMemory {
  version: 1
  enabled: boolean
  acknowledged: boolean
  shopper: string
  goal: string
  budget: number
  openBox: boolean
  priorities: {
    portability: number
    durability: number
    battery: number
    performance: number
    value: number
  }
}

export interface AgentCue {
  id: number
  text: string
  anchor?: { x: number; y: number }
}

export interface ShortlistResult {
  product: Product
  score: number
  rationale: string
  tradeoff: string
  changeFactor: string
}

export interface DemoState {
  selectedProductIds: string[]
  shortlistVisible: boolean
  memoryPanelOpen: boolean
}
