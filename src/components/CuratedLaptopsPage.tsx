import { ArrowRight, Check, Clock3, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { JourneyHeader } from './JourneyHeader'
import { ProductVisual } from './ProductVisual'
import type { CuratedCollection, Product } from '../types'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

interface CuratedLaptopsPageProps {
  collection: CuratedCollection
  selectedProductId?: string
  onSelect: (product: Product) => void
  onCheckout: () => void
  onBack: () => void
  onRebuild: () => void
}

export function CuratedLaptopsPage({ collection, selectedProductId, onSelect, onCheckout, onBack, onRebuild }: CuratedLaptopsPageProps) {
  const generatedTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(collection.generatedAt)

  return (
    <div className="journey-shell">
      <div className="desktop-notice">
        <strong>This concept is designed for a desktop walkthrough.</strong>
        <span>Open it on a wider screen to experience the cursor-following agent and full shopping journey.</span>
      </div>
      <JourneyHeader activeStep="curated" memoryEnabled={collection.memorySnapshot.enabled} onBack={onBack} />
      <main>
        <section className="curated-intro" aria-labelledby="curated-title">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow"><Clock3 size={14} /> Generated at {generatedTime}</span>
            <h1 id="curated-title">Your laptop page, shaped by what Blue remembers.</h1>
            <p>This collection was created when you clicked the button. It uses a snapshot of memory, so later edits do not silently rewrite this page.</p>
          </motion.div>
          <aside className="curation-receipt" aria-label="Memory used for this collection">
            <span className="eyebrow"><SlidersHorizontal size={14} /> Memory used</span>
            <ul>{collection.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
            <button className="quiet-link" onClick={onRebuild}>Rebuild from current memory <ArrowRight size={16} /></button>
          </aside>
        </section>

        <section className="curated-results" aria-labelledby="curated-results-title">
          <div className="curated-results-heading">
            <div><span className="eyebrow">Three deliberate directions</span><h2 id="curated-results-title">Not a search result. A decision set.</h2></div>
            <p>Each option earns its place for a different reason. Choose the tradeoff that feels right.</p>
          </div>
          <div className="curated-product-list">
            {collection.results.map((result, index) => {
              const selected = selectedProductId === result.product.id
              return (
                <article className={`curated-product ${selected ? 'is-selected' : ''}`} key={result.product.id}>
                  <div className="curated-rank">0{index + 1}<span>{index === 0 ? 'Performance fit' : index === 1 ? 'Durable balance' : 'Open-box value'}</span></div>
                  <div className="curated-visual"><ProductVisual product={result.product} /></div>
                  <div className="curated-detail">
                    <span className="condition">{result.product.condition}</span>
                    <div className="curated-name"><div><h3>{result.product.name}</h3><span>{result.product.edition}</span></div><strong>{currency.format(result.product.price)}</strong></div>
                    <div className="curated-specs"><span>{result.product.specs.memoryGb} GB memory</span><span>{result.product.specs.gpuLabel}</span><span>{result.product.weight} lb</span><span>{result.product.batteryHours} hr battery</span></div>
                    <p><strong>Why Blue included it:</strong> {result.rationale}</p>
                    <p className="curated-tradeoff"><strong>Tradeoff:</strong> {result.tradeoff}</p>
                    <button className={selected ? 'selected-choice' : 'secondary-button'} onClick={() => onSelect(result.product)} aria-pressed={selected}>
                      {selected ? <><Check size={17} /> Selected for checkout</> : 'Choose this laptop'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <div className="curated-checkout-bar">
          <div><span>Selected laptop</span><strong>{selectedProductId ? collection.results.find(({ product }) => product.id === selectedProductId)?.product.name : 'Choose one option to continue'}</strong></div>
          <button className="primary-button primary-button--large" disabled={!selectedProductId} onClick={onCheckout}>Continue to checkout <ArrowRight size={18} /></button>
        </div>
      </main>
    </div>
  )
}
