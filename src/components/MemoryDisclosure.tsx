import { Eye, ShieldCheck } from 'lucide-react'
import type { ShoppingMemory } from '../types'

interface MemoryDisclosureProps {
  memory: ShoppingMemory
  onAcknowledge: () => void
  onInspect: () => void
}

export function MemoryDisclosure({ memory, onAcknowledge, onInspect }: MemoryDisclosureProps) {
  if (memory.acknowledged) return null

  return (
    <section className="memory-disclosure" aria-labelledby="memory-disclosure-title">
      <div className="disclosure-icon"><ShieldCheck size={22} /></div>
      <div>
        <span className="eyebrow">Memory is {memory.enabled ? 'on' : 'off'} for this demonstration</span>
        <h2 id="memory-disclosure-title">{memory.enabled ? 'Blue remembers the reason for this trip.' : 'Blue will not use the saved shopping context.'}</h2>
        <p>{memory.goal}. <strong>{memory.enabled ? 'Added need' : 'Saved but ignored'}: {memory.additionalNeeds}</strong> Budget: ${memory.budget.toLocaleString()}. Open-box deals are welcome.</p>
      </div>
      <div className="disclosure-actions">
        <button className="secondary-button" onClick={onInspect}><Eye size={16} /> Inspect memory</button>
        <button className="primary-button" onClick={onAcknowledge}>Continue shopping</button>
      </div>
    </section>
  )
}
