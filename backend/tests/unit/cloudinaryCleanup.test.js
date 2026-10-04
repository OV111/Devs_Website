import { describe, it, expect, vi } from 'vitest'
import { parseCloudinaryUrl, deleteCloudinaryAssets } from '../../services/cloudinaryCleanup.js'

const base = 'https://res.cloudinary.com/demo'

describe('parseCloudinaryUrl', () => {
  it('extracts the public_id from an image URL, dropping version and extension', () => {
    expect(parseCloudinaryUrl(`${base}/image/upload/v1712345678/devs_website/abc123.jpg`))
      .toEqual({ resourceType: 'image', publicId: 'devs_website/abc123' })
  })

  it('handles transformation segments before the version', () => {
    expect(parseCloudinaryUrl(`${base}/image/upload/w_112,h_112,c_fill/v1/devs_website/abc.png`))
      .toEqual({ resourceType: 'image', publicId: 'devs_website/abc' })
  })

  it('keeps the extension for raw files such as a CV', () => {
    expect(parseCloudinaryUrl(`${base}/raw/upload/v1/devs_website/cv123.pdf`))
      .toEqual({ resourceType: 'raw', publicId: 'devs_website/cv123.pdf' })
  })

  it('ignores anything that is not in our upload folder or not Cloudinary', () => {
    expect(parseCloudinaryUrl(`${base}/image/upload/v1/someone_elses/abc.jpg`)).toBeNull()
    expect(parseCloudinaryUrl('https://evil.example/image/upload/v1/devs_website/a.jpg')).toBeNull()
    expect(parseCloudinaryUrl('')).toBeNull()
    expect(parseCloudinaryUrl(undefined)).toBeNull()
  })
})

describe('deleteCloudinaryAssets', () => {
  it('destroys each recognised asset and keeps going when one fails', async () => {
    const destroy = vi
      .fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ result: 'ok' })
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const out = await deleteCloudinaryAssets(
      [`${base}/image/upload/v1/devs_website/a.jpg`, `${base}/raw/upload/v1/devs_website/b.pdf`, null],
      { destroy },
    )
    expect(destroy).toHaveBeenCalledTimes(2)
    expect(destroy).toHaveBeenCalledWith('devs_website/b.pdf', { resource_type: 'raw', invalidate: true })
    expect(out).toEqual({ attempted: 2, failed: 1 })
    spy.mockRestore()
  })
})
