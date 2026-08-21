import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, Check, Info, Laptop, MemoryStick, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AmbientBlue } from './components/AmbientBlue'
import { CheckoutCompletePage } from './components/CheckoutCompletePage'
import { CheckoutPage } from './components/CheckoutPage'
import { CuratedLaptopsPage } from './components/CuratedLaptopsPage'
import { MemoryDisclosure } from './components/MemoryDisclosure'
import { MemoryPanel } from './components/MemoryPanel'
import { ProductVisual } from './components/ProductVisual'
import { products } from './data/products'
import { createCuratedCollection } from './lib/curation'
import { getProductGuidance, getShortlist, hasCadNeed } from './lib/recommendations'
import { clearMemory, loadMemory, restoreMemory, saveMemory } from './lib/storage'
import type { AgentCue, DemoState, Product, ShoppingMemory } from './types'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function App() {
  const [memory, setMemory] = useState<ShoppingMemory>(loadMemory)
  const [cue, setCue] = useState<AgentCue | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [state, setState] = useState<DemoState>({
    selectedProductIds: [],
    shortlistVisible: false,
    memoryPanelOpen: false,
    journeyView: 'home',
    curatedCollection: null,
    checkoutSelection: null,
  })
  const cueTimer = useRef<number | undefined>(undefined)
  const productSection = useRef<HTMLElement>(null)
  const shortlistSection = useRef<HTMLElement>(null)
  const shortlistHeading = useRef<HTMLHeadingElement>(null)
  const shortlist = useMemo(() => getShortlist(products, memory), [memory])
  const cadAware = memory.enabled && hasCadNeed(memory)

  useEffect(() => saveMemory(memory), [memory])
  useEffect(() => () => window.clearTimeout(cueTimer.current), [])

  const showCue = (text: string, target?: HTMLElement, keyboard = false) => {
    window.clearTimeout(cueTimer.current)
    const rect = keyboard && target ? target.getBoundingClientRect() : null
    const nextCue: AgentCue = {
      id: Date.now(),
      text,
      anchor: rect
        ? { x: Math.min(rect.right + 18, window.innerWidth - 340), y: Math.min(rect.top + 12, window.innerHeight - 126) }
        : undefined,
    }
    setCue(nextCue)
    setAnnouncement(text)
    cueTimer.current = window.setTimeout(() => setCue(null), 4000)
  }

  const handleProduct = (product: Product, event: React.MouseEvent<HTMLButtonElement>) => {
    setState((current) => ({
      ...current,
      selectedProductIds: current.selectedProductIds.includes(product.id)
        ? current.selectedProductIds.filter((id) => id !== product.id)
        : [...current.selectedProductIds, product.id],
    }))

    showCue(getProductGuidance(product, memory), event.currentTarget, event.detail === 0)
  }

  const revealShortlist = (event: React.MouseEvent<HTMLElement>) => {
    const keyboard = event.detail === 0
    setState((current) => ({ ...current, shortlistVisible: true }))
    showCue(
      memory.enabled
        ? 'I kept three different answers—not three versions of the same answer—so the decision stays human.'
        : 'This shortlist is generic because shopping memory is off. Turn it on to see the college context change the reasoning.',
      event.currentTarget,
      keyboard,
    )
    window.setTimeout(() => {
      shortlistSection.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (keyboard) shortlistHeading.current?.focus({ preventScroll: true })
    }, 120)
  }

  const updateMemory = (next: ShoppingMemory) => {
    setMemory(next)
    showCue(
      next.enabled && hasCadNeed(next)
        ? 'CAD is now part of the decision. I’ll weigh graphics capability, memory, and performance alongside campus needs.'
        : next.enabled
          ? 'I’ll use only the preferences you can see here.'
          : 'Memory is off. I can still list specifications, but I will not connect them to the student’s CAD class.',
    )
  }

  const toggleMemoryComparison = () => {
    const enabled = !memory.enabled
    setMemory((current) => ({ ...current, enabled }))
    showCue(
      enabled
        ? 'Memory restored: CAD now changes the shortlist and the advice attached to each laptop.'
        : 'Memory off: the CAD need is still saved locally, but I am intentionally not using it.',
    )
  }

  const handleClear = () => {
    setMemory(clearMemory())
    showCue('Shopping memory cleared. The catalogue did not change—only my interpretation did.')
  }

  const handleRestore = () => {
    setMemory({ ...restoreMemory(), acknowledged: true })
    showCue('The fictional college-shopping profile is restored for the demo.')
  }

  const startCuratedJourney = () => {
    const collection = createCuratedCollection(products, memory)
    setState((current) => ({ ...current, journeyView: 'curated', curatedCollection: collection, checkoutSelection: null }))
    setAnnouncement(`Curated laptop page generated from ${collection.signals.length} memory signals.`)
    window.scrollTo({ top: 0 })
  }

  const selectCuratedProduct = (product: Product) => {
    setState((current) => ({
      ...current,
      checkoutSelection: { product, protectionPlan: false, fulfillment: 'pickup' },
    }))
    showCue(`${product.name} is selected. I’ll carry the reason it fits into checkout.`)
  }

  const returnHome = () => {
    setState((current) => ({ ...current, journeyView: 'home' }))
    window.scrollTo({ top: 0 })
  }

  if (state.journeyView === 'curated' && state.curatedCollection) {
    return (
      <>
        <CuratedLaptopsPage
          collection={state.curatedCollection}
          selectedProductId={state.checkoutSelection?.product.id}
          onSelect={selectCuratedProduct}
          onCheckout={() => {
            if (!state.checkoutSelection) return
            setState((current) => ({ ...current, journeyView: 'checkout' }))
            window.scrollTo({ top: 0 })
          }}
          onBack={returnHome}
          onRebuild={startCuratedJourney}
        />
        <AmbientBlue cue={cue} />
        <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
      </>
    )
  }

  if (state.journeyView === 'checkout' && state.checkoutSelection) {
    return (
      <CheckoutPage
        selection={state.checkoutSelection}
        memory={state.curatedCollection?.memorySnapshot ?? memory}
        onProtectionChange={(protectionPlan) => setState((current) => current.checkoutSelection ? ({ ...current, checkoutSelection: { ...current.checkoutSelection, protectionPlan } }) : current)}
        onBack={() => setState((current) => ({ ...current, journeyView: 'curated' }))}
        onComplete={() => {
          setState((current) => ({ ...current, journeyView: 'complete' }))
          window.scrollTo({ top: 0 })
        }}
      />
    )
  }

  if (state.journeyView === 'complete' && state.checkoutSelection) {
    return <CheckoutCompletePage selection={state.checkoutSelection} memory={state.curatedCollection?.memorySnapshot ?? memory} onRestart={returnHome} />
  }

  return (
    <div className="app-shell">
      <div className="desktop-notice">
        <strong>This concept is designed for a desktop pointer.</strong>
        <span>Open it on a laptop or desktop to experience Blue moving with you.</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Blue concept home">
          <span className="brand-word">BEST<br />BUY</span>
          <span className="brand-tag" aria-hidden="true" />
        </a>
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Search illustrative products</span>
          <input placeholder="What can we help you find?" readOnly onFocus={(event) => showCue('For this concept, the shopping trip is already focused on college laptops.', event.currentTarget, true)} />
        </label>
        <nav aria-label="Concept navigation">
          <a href="#laptops">Laptops</a>
          <a
            href="#finalists"
            onClick={(event) => {
              event.preventDefault()
              revealShortlist(event)
            }}
          >
            Finalists
          </a>
          <button className={`memory-status ${memory.enabled ? 'memory-status--on' : ''}`} onClick={() => setState((current) => ({ ...current, memoryPanelOpen: true }))}>
            <MemoryStick size={16} /> Memory {memory.enabled ? 'on' : 'off'}
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="concept-label">Independent product concept · Not affiliated with Best Buy</span>
            <div className="hero-kicker"><Sparkles size={15} /> Meet Blue</div>
            <h1 id="hero-title">A shopping agent that knows when to speak.</h1>
            <p>Blue follows the decision—not the shopper. It quietly connects what you click to the priorities you chose, then gets out of the way.</p>
            <div className="hero-actions">
              <button className="primary-button primary-button--large" onClick={() => productSection.current?.scrollIntoView({ behavior: 'smooth' })}>
                Explore six laptops <ArrowDown size={18} />
              </button>
              <button className="quiet-link" onClick={() => setState((current) => ({ ...current, memoryPanelOpen: true }))}>
                See what Blue knows <ArrowRight size={17} />
              </button>
            </div>
          </motion.div>

          <motion.div className="hero-product" initial={{ opacity: 0, scale: 0.94, x: 35 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.08 }}>
            <div className="hero-halo" />
            <ProductVisual product={products[0]} hero />
            <div className="hero-note hero-note--weight"><span>Daily carry</span><strong>2.2 lb</strong></div>
            <div className="hero-note hero-note--battery"><span>Rated battery</span><strong>18 hr</strong></div>
          </motion.div>
        </section>

        <MemoryDisclosure
          memory={memory}
          onInspect={() => setState((current) => ({ ...current, memoryPanelOpen: true }))}
          onAcknowledge={() => {
            setMemory((current) => ({ ...current, acknowledged: true }))
            showCue('I’ll keep the college context visible and editable. Nothing is sent from this browser.')
          }}
        />

        <section className="curation-entry" aria-labelledby="curation-entry-title">
          <div className="curation-entry-icon"><Laptop size={24} /></div>
          <div>
            <span className="eyebrow">Generated when you ask</span>
            <h2 id="curation-entry-title">Turn memory into a curated laptop page.</h2>
            <p>Blue will take a snapshot of the visible shopping memory, generate three distinct options, and carry the chosen laptop through a simulated checkout.</p>
          </div>
          <button className="primary-button primary-button--large" onClick={startCuratedJourney}>Build my curated laptop page <ArrowRight size={18} /></button>
        </section>

        <section className="catalogue" id="laptops" ref={productSection} aria-labelledby="catalogue-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Illustrative catalogue</span>
              <h2 id="catalogue-title">Six plausible choices. Three useful directions.</h2>
            </div>
            <p>Click a laptop and Blue will connect one fact to this shopper’s priorities. No chat window required.</p>
          </div>

          <div className="product-grid">
            {products.map((product, index) => {
              const selected = state.selectedProductIds.includes(product.id)
              return (
                <motion.button
                  key={product.id}
                  className={`product-card ${selected ? 'product-card--selected' : ''}`}
                  onClick={(event) => handleProduct(product, event)}
                  aria-pressed={selected}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: (index % 3) * 0.06 }}
                >
                  <div className="product-art">
                    <ProductVisual product={product} />
                    {selected && <span className="selected-mark"><Check size={15} /> Considered</span>}
                  </div>
                  <div className="product-meta">
                    <span className="condition">{product.condition}</span>
                    <h3>{product.name}</h3>
                    <span className="edition">{product.edition}</span>
                    <div className="price-line">
                      <strong>{currency.format(product.price)}</strong>
                      {product.originalPrice && <del>{currency.format(product.originalPrice)}</del>}
                    </div>
                    <div className="quick-specs">
                      <span>{product.weight} lb</span>
                      <span>{product.batteryHours} hr battery</span>
                      <span>{product.specs.memoryGb} GB memory</span>
                      <span className={product.specs.gpuClass === 'integrated' ? '' : 'spec-emphasis'}>{product.specs.gpuLabel}</span>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className="decision-cta">
            <div>
              <span className="eyebrow">Stop browsing. Start deciding.</span>
              <h2>Blue can narrow this without hiding the tradeoffs.</h2>
            </div>
            <button className="primary-button primary-button--large" onClick={revealShortlist}>
              Show three finalists <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {state.shortlistVisible && (
          <motion.section
            className="shortlist"
            id="finalists"
            ref={shortlistSection}
            aria-labelledby="shortlist-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="shortlist-heading">
              <span className="eyebrow">Blue’s three finalists</span>
              <h2 id="shortlist-title" ref={shortlistHeading} tabIndex={-1}>{cadAware ? 'CAD changes the finalists.' : memory.enabled ? 'Different benefits. The decision stays yours.' : 'Generic advice loses the coursework context.'}</h2>
              <p>{cadAware ? `Using the remembered need: ${memory.additionalNeeds}` : memory.enabled ? `Based on: ${memory.goal.toLowerCase()}.` : 'Shopping memory is off, so these explanations use general laptop priorities—even though the CAD need remains saved locally.'}</p>
            </div>
            <div className={`memory-impact ${memory.enabled ? 'memory-impact--on' : 'memory-impact--off'}`} aria-live="polite">
              <div className="memory-impact-state">
                <span>{memory.enabled ? 'Memory on' : 'Memory off'}</span>
                <strong>{memory.enabled ? 'CAD informs the decision' : 'CAD context is ignored'}</strong>
              </div>
              <p>
                {memory.enabled
                  ? 'Blue checks GPU class, installed memory, and performance before balancing portability, durability, battery, and price.'
                  : 'Blue can repeat GPU and memory specifications, but it no longer knows why they matter. The lighter integrated-graphics option returns.'}
              </p>
              <button className={memory.enabled ? 'secondary-button' : 'primary-button'} onClick={toggleMemoryComparison}>
                {memory.enabled ? 'Turn memory off to compare' : 'Turn memory on'}
              </button>
            </div>
            <div className="finalist-grid">
              {shortlist.map((result, index) => (
                <article className="finalist" key={result.product.id}>
                  <span className="finalist-number">0{index + 1}</span>
                  <span className="finalist-role">{index === 0 ? 'Carry less' : index === 1 ? 'Protect the investment' : 'Keep more budget'}</span>
                  <ProductVisual product={result.product} />
                  <div className="finalist-title">
                    <div><h3>{result.product.name}</h3><span>{result.product.edition}</span></div>
                    <strong>{currency.format(result.product.price)}</strong>
                  </div>
                  <dl>
                    <div><dt>Why it fits</dt><dd>{result.rationale}</dd></div>
                    <div><dt>What you give up</dt><dd>{result.tradeoff}</dd></div>
                    <div><dt>What could change this</dt><dd>{result.changeFactor}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
            <div className="assumption-note">
              <Info size={18} />
              <p><strong>What Blue still does not know:</strong> the exact CAD application, the course’s minimum GPU requirements, accessibility needs, or whether campus lab machines handle rendering. Those answers should change the decision before checkout.</p>
            </div>
          </motion.section>
        )}
      </main>

      <footer>
        <div><ShieldCheck size={17} /><span>Fictional products · Illustrative prices · Browser-local memory</span></div>
        <span>Concept and implementation by James Lane</span>
      </footer>

      <MemoryPanel
        open={state.memoryPanelOpen}
        memory={memory}
        onClose={() => setState((current) => ({ ...current, memoryPanelOpen: false }))}
        onChange={updateMemory}
        onClear={handleClear}
        onRestore={handleRestore}
      />
      <AmbientBlue cue={cue} />
      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
    </div>
  )
}

export default App
