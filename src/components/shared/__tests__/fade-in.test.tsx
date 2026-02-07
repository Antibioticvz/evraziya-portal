import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Мок framer-motion — заменяем motion.div на обычный div с пропсами
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      initial,
      ...rest
    }: {
      children: React.ReactNode
      className?: string
      initial?: Record<string, number>
      [key: string]: unknown
    }) => (
      <div
        data-testid="motion-div"
        className={className}
        data-initial={JSON.stringify(initial)}
        data-viewport={JSON.stringify(rest.viewport)}
        data-transition={JSON.stringify(rest.transition)}
      >
        {children}
      </div>
    ),
  },
}))

import { FadeIn } from '../fade-in'

describe('FadeIn component', () => {
  it('renders children correctly', () => {
    render(
      <FadeIn>
        <p>Test content</p>
      </FadeIn>,
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <FadeIn className="custom-class">
        <span>Styled content</span>
      </FadeIn>,
    )

    const wrapper = screen.getByTestId('motion-div')
    expect(wrapper).toHaveClass('custom-class')
  })

  it('has correct initial styles for default direction (up)', () => {
    render(
      <FadeIn>
        <span>Content</span>
      </FadeIn>,
    )

    const wrapper = screen.getByTestId('motion-div')
    const initial = JSON.parse(wrapper.getAttribute('data-initial') || '{}')

    expect(initial.opacity).toBe(0)
    expect(initial.y).toBe(24)
  })

  it('has correct initial styles for direction "down"', () => {
    render(
      <FadeIn direction="down">
        <span>Content</span>
      </FadeIn>,
    )

    const wrapper = screen.getByTestId('motion-div')
    const initial = JSON.parse(wrapper.getAttribute('data-initial') || '{}')

    expect(initial.opacity).toBe(0)
    expect(initial.y).toBe(-24)
  })

  it('has correct initial styles for direction "left"', () => {
    render(
      <FadeIn direction="left">
        <span>Content</span>
      </FadeIn>,
    )

    const wrapper = screen.getByTestId('motion-div')
    const initial = JSON.parse(wrapper.getAttribute('data-initial') || '{}')

    expect(initial.opacity).toBe(0)
    expect(initial.x).toBe(24)
  })

  it('has correct initial styles for direction "right"', () => {
    render(
      <FadeIn direction="right">
        <span>Content</span>
      </FadeIn>,
    )

    const wrapper = screen.getByTestId('motion-div')
    const initial = JSON.parse(wrapper.getAttribute('data-initial') || '{}')

    expect(initial.opacity).toBe(0)
    expect(initial.x).toBe(-24)
  })

  it('passes custom delay and duration to transition', () => {
    render(
      <FadeIn delay={0.3} duration={1}>
        <span>Delayed</span>
      </FadeIn>,
    )

    const wrapper = screen.getByTestId('motion-div')
    const transition = JSON.parse(wrapper.getAttribute('data-transition') || '{}')

    expect(transition.delay).toBe(0.3)
    expect(transition.duration).toBe(1)
    expect(transition.ease).toBe('easeOut')
  })

  it('sets viewport to trigger once with margin', () => {
    render(
      <FadeIn>
        <span>Content</span>
      </FadeIn>,
    )

    const wrapper = screen.getByTestId('motion-div')
    const viewport = JSON.parse(wrapper.getAttribute('data-viewport') || '{}')

    expect(viewport.once).toBe(true)
    expect(viewport.margin).toBe('-80px')
  })
})
