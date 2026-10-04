import { describe, it, expect, vi } from 'vitest'
import { cancelBillingSubscription } from '../../services/accountService.js'

const dbWith = (sub) => ({ collection: () => ({ findOne: vi.fn().mockResolvedValue(sub) }) })
const clientWith = (revoke) => () => ({ subscriptions: { revoke } })

describe('cancelBillingSubscription', () => {
  it('does nothing when the user never subscribed', async () => {
    const revoke = vi.fn()
    await cancelBillingSubscription(dbWith(null), 'u1', clientWith(revoke))
    expect(revoke).not.toHaveBeenCalled()
  })

  it('does nothing for a subscription that is already cancelled', async () => {
    const revoke = vi.fn()
    await cancelBillingSubscription(dbWith({ polarSubscriptionId: 's1', status: 'canceled' }), 'u1', clientWith(revoke))
    expect(revoke).not.toHaveBeenCalled()
  })

  it('revokes an active subscription at Polar', async () => {
    const revoke = vi.fn().mockResolvedValue({})
    await cancelBillingSubscription(dbWith({ polarSubscriptionId: 's1', status: 'active' }), 'u1', clientWith(revoke))
    expect(revoke).toHaveBeenCalledWith('s1')
  })

  it('treats "already gone" on Polar as success', async () => {
    const revoke = vi.fn().mockRejectedValue({ statusCode: 404 })
    await expect(
      cancelBillingSubscription(dbWith({ polarSubscriptionId: 's1', status: 'active' }), 'u1', clientWith(revoke)),
    ).resolves.toBeUndefined()
  })

  it('aborts the deletion (502) when Polar cannot cancel, so nobody is billed after deleting', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const revoke = vi.fn().mockRejectedValue(new Error('network down'))
    await expect(
      cancelBillingSubscription(dbWith({ polarSubscriptionId: 's1', status: 'active' }), 'u1', clientWith(revoke)),
    ).rejects.toMatchObject({ status: 502 })
    spy.mockRestore()
  })
})
