import { describe, expect, it } from 'vitest'

import { cn } from '../utils'

describe('cn() utility', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false

    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active')
  })

  it('resolves Tailwind conflicts (last wins)', () => {
    // tailwind-merge should keep the last conflicting class
    expect(cn('px-4', 'px-6')).toBe('px-6')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    expect(cn('bg-white', 'bg-black')).toBe('bg-black')
  })

  it('handles empty and falsy inputs', () => {
    expect(cn('')).toBe('')
    expect(cn(undefined, null, false, '')).toBe('')
  })

  it('merges arrays of class names', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('handles complex Tailwind merge scenarios', () => {
    // padding override
    expect(cn('p-4', 'p-2')).toBe('p-2')
    // margin override
    expect(cn('mt-4', 'mt-8')).toBe('mt-8')
    // non-conflicting classes are kept
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })
})
