import { Check, LockKeyhole, MapPin, ShieldCheck } from 'lucide-react'
import { JourneyHeader } from './JourneyHeader'
import { ProductVisual } from './ProductVisual'
import type { CheckoutSelection, ShoppingMemory } from '../types'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface CheckoutPageProps {
  selection: CheckoutSelection
  memory: ShoppingMemory
  onProtectionChange: (enabled: boolean) => void
  onBack: () => void
  onComplete: () => void
}

export function CheckoutPage({ selection, memory, onProtectionChange, onBack, onComplete }: CheckoutPageProps) {
  const protection = selection.protectionPlan ? 129.99 : 0
  const tax = (selection.product.price + protection) * 0.0725
  const total = selection.product.price + protection + tax

  return (
    <div className="journey-shell">
      <div className="desktop-notice">
        <strong>This concept is designed for a desktop walkthrough.</strong>
        <span>Open it on a wider screen to experience the complete curated shopping journey.</span>
      </div>
      <JourneyHeader activeStep="checkout" memoryEnabled={memory.enabled} onBack={onBack} />
      <main className="checkout-page">
        <section className="checkout-main" aria-labelledby="checkout-title">
          <span className="eyebrow">Illustrative checkout</span>
          <h1 id="checkout-title">Review the decision before acting.</h1>
          <p className="checkout-lead">No payment or personal information is collected. This final step demonstrates how Blue carries context into a human-approved action.</p>

          <article className="checkout-product">
            <div><ProductVisual product={selection.product} /></div>
            <div>
              <span className="condition">{selection.product.condition}</span>
              <h2>{selection.product.name}</h2>
              <p>{selection.product.edition}</p>
              <strong>{currency.format(selection.product.price)}</strong>
              <ul><li>{selection.product.specs.memoryGb} GB memory</li><li>{selection.product.specs.gpuLabel}</li><li>{selection.product.batteryHours}-hour rated battery</li></ul>
            </div>
          </article>

          <section className="checkout-option" aria-labelledby="fulfillment-title">
            <MapPin size={20} />
            <div><h2 id="fulfillment-title">Pickup near campus</h2><p>Illustrative campus-area store · Ready in about one hour</p></div>
            <span><Check size={15} /> Selected</span>
          </section>

          <label className="checkout-option checkout-option--control">
            <ShieldCheck size={20} />
            <div><strong>Two-year accidental-damage plan</strong><small>Illustrative coverage for drops, spills, and hardware service.</small></div>
            <span>+$129.99</span>
            <input type="checkbox" checked={selection.protectionPlan} onChange={(event) => onProtectionChange(event.target.checked)} />
          </label>
        </section>

        <aside className="order-summary" aria-labelledby="order-summary-title">
          <span className="eyebrow">Human approval point</span>
          <h2 id="order-summary-title">Order summary</h2>
          <dl><div><dt>Laptop</dt><dd>{currency.format(selection.product.price)}</dd></div><div><dt>Protection</dt><dd>{currency.format(protection)}</dd></div><div><dt>Estimated tax</dt><dd>{currency.format(tax)}</dd></div><div className="order-total"><dt>Illustrative total</dt><dd>{currency.format(total)}</dd></div></dl>
          <div className="checkout-memory-note"><strong>Why this reached checkout</strong><p>{memory.additionalNeeds} Blue kept GPU capability and installed memory visible through the final review.</p></div>
          <button className="primary-button primary-button--large" onClick={onComplete}><LockKeyhole size={17} /> Complete demo checkout</button>
          <small>No purchase, reservation, payment, or customer record will be created.</small>
        </aside>
      </main>
    </div>
  )
}
