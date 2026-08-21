import { ArrowLeft, Check } from 'lucide-react'
import { JourneyHeader } from './JourneyHeader'
import type { CheckoutSelection, ShoppingMemory } from '../types'

interface CheckoutCompletePageProps {
  selection: CheckoutSelection
  memory: ShoppingMemory
  onRestart: () => void
}

export function CheckoutCompletePage({ selection, memory, onRestart }: CheckoutCompletePageProps) {
  return (
    <div className="journey-shell completion-shell">
      <div className="desktop-notice">
        <strong>This concept is designed for a desktop walkthrough.</strong>
        <span>Open it on a wider screen to experience the complete curated shopping journey.</span>
      </div>
      <JourneyHeader activeStep="complete" memoryEnabled={memory.enabled} onBack={onRestart} />
      <main className="completion-page">
        <div className="completion-mark"><Check size={32} /></div>
        <span className="eyebrow">Vertical slice complete</span>
        <h1>The decision reached checkout. Nothing was purchased.</h1>
        <p>Blue carried the remembered CAD requirement from discovery to a final review of the {selection.product.name}, while leaving the actual action with the shopper.</p>
        <div className="completion-proof"><span>Remembered need</span><strong>{memory.additionalNeeds}</strong><span>Selected outcome</span><strong>{selection.product.name} · {selection.product.specs.gpuLabel} · {selection.product.specs.memoryGb} GB</strong></div>
        <button className="secondary-button" onClick={onRestart}><ArrowLeft size={17} /> Return to the landing page</button>
      </main>
    </div>
  )
}
