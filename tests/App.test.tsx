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
    expect(screen.getByText(/Added need: The student will be enrolled in a CAD class/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /Inspect memory/i })).toBeEnabled()
  })

  it('replaces generic silence with a concise product observation', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /AER 13 illustrative/i }))

    expect(container.querySelector('.blue-comment')).toHaveTextContent(/CAD changes this choice/i)
    expect(screen.getByRole('button', { name: /AER 13 illustrative/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('reveals three finalists and visible tradeoffs', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Show three finalists/i }))

    expect(screen.getByRole('heading', { name: /CAD changes the finalists/i })).toBeInTheDocument()
    expect(container.querySelectorAll('.finalist')).toHaveLength(3)
    expect(container.querySelector('.finalist')).toHaveTextContent(/HALO 14/i)
    expect(screen.getAllByText('What you give up')).toHaveLength(3)
  })

  it('allows memory to be disabled and explains the generic state', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Memory on/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /Use shopping memory/i }))

    expect(screen.getByRole('checkbox', { name: /Use shopping memory/i })).not.toBeChecked()
    expect(screen.getByText(/Memory off/i)).toBeVisible()
  })

  it('quickly demonstrates the weaker memory-off CAD experience', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Show three finalists/i }))
    expect(container.querySelector('.finalist')).toHaveTextContent(/HALO 14/i)

    fireEvent.click(screen.getByRole('button', { name: /Turn memory off to compare/i }))
    expect(screen.getByRole('heading', { name: /Generic advice loses the coursework context/i })).toBeInTheDocument()
    expect(container.querySelector('.finalist')).toHaveTextContent(/AER 13/i)
    expect(screen.getByText(/CAD context is ignored/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /will not use the saved shopping context/i })).toBeInTheDocument()
  })

  it('lets the shopper add CAD coursework and immediately changes the shortlist', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Memory on/i }))
    fireEvent.change(screen.getByRole('textbox', { name: /Additional needs or coursework/i }), {
      target: { value: 'Needs a quiet keyboard.' },
    })
    fireEvent.click(screen.getAllByLabelText(/Close shopping memory/i).at(-1)!)
    fireEvent.click(screen.getByRole('button', { name: /Show three finalists/i }))
    expect(container.querySelector('.finalist')).toHaveTextContent(/AER 13/i)

    fireEvent.click(screen.getByRole('button', { name: /Memory on/i }))
    fireEvent.change(screen.getByRole('textbox', { name: /Additional needs or coursework/i }), {
      target: { value: 'The student will be enrolled in an AutoCAD class.' },
    })
    expect(screen.getByText(/CAD · Dedicated GPU · 16–32 GB memory/i)).toBeInTheDocument()
    fireEvent.click(screen.getAllByLabelText(/Close shopping memory/i).at(-1)!)
    expect(container.querySelector('.finalist')).toHaveTextContent(/HALO 14/i)
  })
})
