import { AnimatePresence, motion, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { AgentCue } from '../types'

interface AmbientBlueProps {
  cue: AgentCue | null
}

export function AmbientBlue({ cue }: AmbientBlueProps) {
  const reducedMotion = useReducedMotion()
  const pointerX = useSpring(80, { stiffness: 420, damping: 38, mass: 0.55 })
  const pointerY = useSpring(80, { stiffness: 420, damping: 38, mass: 0.55 })
  const [position, setPosition] = useState({ x: 80, y: 80 })

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const x = Math.min(event.clientX + 22, window.innerWidth - 340)
      const y = Math.min(event.clientY + 20, window.innerHeight - 126)
      if (reducedMotion) setPosition({ x, y })
      else {
        pointerX.set(x)
        pointerY.set(y)
      }
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [pointerX, pointerY, reducedMotion])

  const x = cue?.anchor?.x ?? (reducedMotion ? position.x : pointerX)
  const y = cue?.anchor?.y ?? (reducedMotion ? position.y : pointerY)

  return (
    <motion.div className="ambient-blue" style={{ x, y }} aria-hidden="true">
      <motion.div className="blue-orb" animate={{ scale: cue ? 1 : 0.82, opacity: cue ? 1 : 0.7 }}>
        <span />
      </motion.div>
      <AnimatePresence mode="wait">
        {cue && (
          <motion.div
            key={cue.id}
            className="blue-comment"
            initial={{ opacity: 0, y: 7, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.22 }}
          >
            <strong>Blue noticed</strong>
            <span>{cue.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
