import { ArrowLeft, MemoryStick } from 'lucide-react'

interface JourneyHeaderProps {
  activeStep: 'curated' | 'checkout' | 'complete'
  memoryEnabled: boolean
  onBack: () => void
}

export function JourneyHeader({ activeStep, memoryEnabled, onBack }: JourneyHeaderProps) {
  return (
    <header className="journey-header">
      <button className="journey-back" onClick={onBack}><ArrowLeft size={17} /> Back</button>
      <div className="journey-brand" aria-label="Blue concept">
        <span className="brand-word">BEST<br />BUY</span><span className="brand-tag" aria-hidden="true" />
        <span>with Blue</span>
      </div>
      <ol className="journey-progress" aria-label="Shopping progress">
        <li className={activeStep === 'curated' ? 'is-active' : 'is-complete'}>Curated</li>
        <li className={activeStep === 'checkout' ? 'is-active' : activeStep === 'complete' ? 'is-complete' : ''}>Checkout</li>
        <li className={activeStep === 'complete' ? 'is-active' : ''}>Done</li>
      </ol>
      <span className={`journey-memory ${memoryEnabled ? 'is-on' : ''}`}><MemoryStick size={15} /> Memory {memoryEnabled ? 'used' : 'off'}</span>
    </header>
  )
}
