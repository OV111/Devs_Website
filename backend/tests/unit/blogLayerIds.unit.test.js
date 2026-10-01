import { describe, it, expect } from 'vitest'
import { normalizeLayerIds } from '../../services/blogService.js'

describe('normalizeLayerIds', () => {
  it('keeps valid layer ids from an array', () => {
    expect(normalizeLayerIds(['api-dev-1', 'node-dev-3'])).toEqual(['api-dev-1', 'node-dev-3'])
  })

  it('accepts a JSON string, the way FormData delivers arrays', () => {
    expect(normalizeLayerIds('["api-dev-1"]')).toEqual(['api-dev-1'])
  })

  it('trims, lowercases and removes duplicates', () => {
    expect(normalizeLayerIds([' API-dev-1 ', 'api-dev-1'])).toEqual(['api-dev-1'])
  })

  it('drops anything that is not a short slug (operators, markup, non-strings)', () => {
    const out = normalizeLayerIds(['ok-1', { $ne: 1 }, '<script>', 'a b', '', 42, null, 'x'.repeat(61)])
    expect(out).toEqual(['ok-1'])
  })

  it('caps the list at 10', () => {
    const many = Array.from({ length: 25 }, (_, i) => `layer-${i}`)
    expect(normalizeLayerIds(many)).toHaveLength(10)
  })

  it('returns [] for missing or malformed input instead of throwing', () => {
    expect(normalizeLayerIds(undefined)).toEqual([])
    expect(normalizeLayerIds('not json')).toEqual([])
    expect(normalizeLayerIds('{"a":1}')).toEqual([])
    expect(normalizeLayerIds(7)).toEqual([])
  })
})
