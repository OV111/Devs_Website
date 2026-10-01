import { describe, it, expect } from 'vitest'
import { escapeRegex } from '../../utils/regex.js'

describe('escapeRegex', () => {
  it('matches metacharacters literally', () => {
    const re = new RegExp(escapeRegex('c++ (a+)+$'))
    expect(re.test('learn c++ (a+)+$ today')).toBe(true)
    expect(re.test('cc (aa)')).toBe(false)
  })

  it('does not throw on input that is an invalid pattern', () => {
    expect(() => new RegExp(escapeRegex('unclosed ( [ {'))).not.toThrow()
  })

  it('coerces non-strings and defaults undefined to an empty pattern', () => {
    expect(escapeRegex(42)).toBe('42')
    expect(escapeRegex()).toBe('')
  })
})
