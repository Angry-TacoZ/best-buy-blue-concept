import '@testing-library/jest-dom/vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
})

window.HTMLElement.prototype.scrollIntoView = () => undefined

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]

  disconnect() {}
  observe(target: Element) {
    const entry = {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: target.getBoundingClientRect(),
      isIntersecting: true,
      rootBounds: null,
      target,
      time: 0,
    } as IntersectionObserverEntry
    this.callback([entry], this)
  }
  takeRecords() { return [] }
  unobserve() {}

  constructor(private callback: IntersectionObserverCallback) {}
}

Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: IntersectionObserverMock })
Object.defineProperty(globalThis, 'IntersectionObserver', { writable: true, value: IntersectionObserverMock })
