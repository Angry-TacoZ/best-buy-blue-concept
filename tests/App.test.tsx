import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'

afterEach(cleanup)

describe('Blue concept experience', () => {
  beforeEach(() => localStorage.clear())

  it('discloses active shopping memory before the product journey', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Blue remembers the reason/i })).toBeVisible()
    expect(screen.getByText(/Budget: \$1,200/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /Inspect memory/i })).toBeEnabled()
  })

  it('replaces generic silence with a concise product observation', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /AER 13 illustrative/i }))

    expect(container.querySelector('.blue-comment')).toHaveTextContent(/2.2 pounds matters/i)
    expect(screen.getByRole('button', { name: /AER 13 illustrative/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('reveals three finalists and visible tradeoffs', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Show three finalists/i }))

    expect(screen.getByRole('heading', { name: /Different benefits/i })).toBeInTheDocument()
    expect(container.querySelectorAll('.finalist')).toHaveLength(3)
    expect(screen.getAllByText('What you give up')).toHaveLength(3)
  })

  it('allows memory to be disabled and explains the generic state', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Memory on/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /Use shopping memory/i }))

    expect(screen.getByRole('checkbox', { name: /Use shopping memory/i })).not.toBeChecked()
    expect(screen.getByText(/Memory off/i)).toBeVisible()
  })
})
