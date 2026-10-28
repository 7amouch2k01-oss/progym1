import { describe, expect, it } from 'vitest';
import { addCartItem, cartTotal } from './catalog';
describe('storefront cart', () => {
 it('adds the same product and option to the existing line', () => { const first = addCartItem([], 'chrome-dumbbells', '25 kg pair'); expect(addCartItem(first, 'chrome-dumbbells', '25 kg pair')).toEqual([{ productId: 'chrome-dumbbells', option: '25 kg pair', quantity: 2 }]); });
 it('keeps different apparel sizes separate', () => { const first = addCartItem([], 'classic-logo-tee', 'S'); expect(addCartItem(first, 'classic-logo-tee', 'M')).toHaveLength(2); });
 it('calculates concrete product totals', () => { expect(cartTotal([{ productId: 'chrome-dumbbells', option: '25 kg pair', quantity: 2 }, { productId: 'classic-logo-tee', option: 'M', quantity: 1 }])).toBe(2657); });
 it('returns zero for an empty bag', () => { expect(cartTotal([])).toBe(0); });
});