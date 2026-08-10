import { AnimatePresence, motion } from 'framer-motion'
import { Eye, RotateCcw, Trash2, X } from 'lucide-react'
import type { ShoppingMemory } from '../types'

interface MemoryPanelProps {
  open: boolean
  memory: ShoppingMemory
  onClose: () => void
  onChange: (memory: ShoppingMemory) => void
  onClear: () => void
  onRestore: () => void
}

export function MemoryPanel({ open, memory, onClose, onChange, onClear, onRestore }: MemoryPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            className="panel-scrim"
            aria-label="Close shopping memory"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="memory-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            <div className="panel-heading">
              <div>
                <span className="eyebrow"><Eye size={14} /> Visible memory</span>
                <h2 id="memory-title">What Blue remembers</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close shopping memory">
                <X size={20} />
              </button>
            </div>

            <p className="panel-intro">Stored only in this browser. Nothing is sent anywhere.</p>

            <label className="switch-row">
              <span>
                <strong>Use shopping memory</strong>
                <small>Personalize explanations and the final shortlist.</small>
              </span>
              <input
                type="checkbox"
                checked={memory.enabled}
                onChange={(event) => onChange({ ...memory, enabled: event.target.checked })}
              />
            </label>

            <label>
              Shopper context
              <input
                value={memory.shopper}
                onChange={(event) => onChange({ ...memory, shopper: event.target.value })}
              />
            </label>
            <label>
              Shopping goal
              <textarea
                rows={3}
                value={memory.goal}
                onChange={(event) => onChange({ ...memory, goal: event.target.value })}
              />
            </label>
            <label>
              Additional needs or coursework
              <textarea
                rows={3}
                value={memory.additionalNeeds}
                placeholder="Example: The student will be enrolled in a CAD class."
                onChange={(event) => onChange({ ...memory, additionalNeeds: event.target.value })}
              />
              <small className="field-hint">This demo recognizes CAD, AutoCAD, Solidworks, Revit, 3D modeling, and engineering design.</small>
            </label>
            <label>
              Maximum budget
              <span className="budget-input">
                <span>$</span>
                <input
                  type="number"
                  min="400"
                  max="3000"
                  step="50"
                  value={memory.budget}
                  onChange={(event) => onChange({ ...memory, budget: Number(event.target.value) || 400 })}
                />
              </span>
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={memory.openBox}
                onChange={(event) => onChange({ ...memory, openBox: event.target.checked })}
              />
              Include open-box deals
            </label>

            <div className="priority-readout">
              <span>Blue is connecting</span>
              <strong>{!memory.enabled ? 'Nothing · Saved context is not in use' : /\b(cad|autocad|solidworks|revit|3d model|engineering design)\b/i.test(memory.additionalNeeds) ? 'CAD · Dedicated GPU · 16–32 GB memory' : 'Durability · Portability · Battery'}</strong>
            </div>

            <div className="panel-actions">
              <button className="secondary-button" onClick={onRestore}><RotateCcw size={16} /> Restore demo</button>
              <button className="text-button text-button--danger" onClick={onClear}><Trash2 size={16} /> Clear memory</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
