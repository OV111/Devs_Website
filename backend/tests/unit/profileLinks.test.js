import { describe, it, expect } from 'vitest'
import { sanitizeProfileLink } from '../../services/profileService.js'

describe('sanitizeProfileLink', () => {
  it('keeps http and https URLs', () => {
    expect(sanitizeProfileLink('https://github.com/vahe')).toBe('https://github.com/vahe')
    expect(sanitizeProfileLink('http://example.com')).toBe('http://example.com/')
  })

  it('treats an empty value as "clear the link"', () => {
    expect(sanitizeProfileLink('   ')).toBe('')
    expect(sanitizeProfileLink(undefined)).toBe('')
  })

  it('rejects script-capable and non-http schemes', () => {
    for (const bad of ['javascript:alert(1)', 'data:text/html,<script>', 'ftp://x.com', 'vbscript:x']) {
      expect(() => sanitizeProfileLink(bad)).toThrow()
    }
  })

  it('rejects text that is not a URL', () => {
    expect(() => sanitizeProfileLink('github.com/vahe')).toThrow()
  })
})
