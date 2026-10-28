import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowRight, LockKeyhole, Check } from 'lucide-react';
import { PageIntro, useStore } from '@/components/store';
import { money, createOrder, type Order } from '@/lib/catalog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { sanitizeText, sanitizeEmail } from '@/lib/security';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/checkout')({
  head: () => pageHead('Checkout | Iron Soul', 'Review your Iron Soul bag and prepare your order.'),
  component: Checkout,
});

function Checkout() {
  const { items, products, total } = useStore();
  const [review, setReview] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Tunisia');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `IS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customer_name: `${sanitizeText(firstName)} ${sanitizeText(lastName)}`,
      customer_email: sanitizeEmail(email),
      shipping_address: {
        address: sanitizeText(address),
        city: sanitizeText(city),
        postalCode: sanitizeText(postalCode),
        country: sanitizeText(country),
      },
      items: items.map(item => {
        const prod = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          name: prod?.name || item.productId,
          price: prod?.price || 0,
          option: item.option,
          quantity: item.quantity,
        };
      }),
      total_amount: total,
      status: 'Pending',
      payment_status: 'Paid',
      created_at: new Date().toISOString(),
    };

    await createOrder(newOrder);
    setPlacedOrderId(orderId);
    setReview(true);
  };

  return (
    <>
      <PageIntro label="The next step" title="Your Iron Soul Order">
        A considered investment in the work ahead.
      </PageIntro>
      {items.length === 0 ? (
        <div className="empty-bag py-20">
          <h3>Your bag is empty.</h3>
          <Button asChild variant="forge">
            <Link to="/shop" search={{ category: 'All' }}>
              Explore the collection <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : (
        <section className="checkout-layout page-width">
          <div>
            <h2>Contact & delivery</h2>
            <form className="store-form" onSubmit={handleSubmitOrder}>
              <label>
                Email
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </label>
              <div className="form-row">
                <label>
                  First name
                  <input
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </label>
                <label>
                  Last name
                  <input
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </label>
              </div>
              <label>
                Street address
                <input
                  autoComplete="street-address"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </label>
              <div className="form-row">
                <label>
                  City
                  <input
                    autoComplete="address-level2"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </label>
                <label>
                  Postal code
                  <input
                    autoComplete="postal-code"
                    required
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                  />
                </label>
              </div>
              <label>
                Country
                <select
                  autoComplete="country-name"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                >
                  <option>Tunisia</option>
                  <option>France</option>
                  <option>Germany</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Canada</option>
                </select>
              </label>
              <p className="form-note flex items-start gap-2">
                <LockKeyhole className="size-4 shrink-0 text-primary" />
                Live transaction recorded into Iron Soul order pipeline.
              </p>
              <Button type="submit" variant="forge">
                Place Order — {money(total)} <ArrowRight />
              </Button>
            </form>
          </div>
          <aside className="checkout-summary">
            <h2>Order summary</h2>
            {items.map(item => {
              const product = products.find(p => p.id === item.productId);
              return product ? (
                <div className="bag-item" key={`${item.productId}-${item.option}`}>
                  <img src={product.image} alt={product.name} width={100} height={100} />
                  <div>
                    <Link to="/product/$slug" params={{ slug: product.id }}>
                      {product.name}
                    </Link>
                    <p>
                      {item.option} · Qty {item.quantity}
                    </p>
                    <span>{money(product.price * item.quantity)}</span>
                  </div>
                </div>
              ) : null;
            })}
            <div className="checkout-total">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <p className="form-note mt-4">Free domestic delivery across Tunisia.</p>
          </aside>
        </section>
      )}

      <Dialog open={review} onOpenChange={setReview}>
        <DialogContent>
          <Check className="text-primary size-8" />
          <DialogTitle className="font-display text-2xl font-normal">Order Confirmed: {placedOrderId}</DialogTitle>
          <DialogDescription>
            Thank you, {firstName}! Your order of {items.reduce((sum, item) => sum + item.quantity, 0)} items ({money(total)}) has been saved to the live database and sent to fulfillment.
          </DialogDescription>
          <div className="flex gap-2 mt-4">
            <Button variant="forge" asChild onClick={() => setReview(false)}>
              <Link to="/shop" search={{ category: 'All' }}>
                Continue Shopping <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" asChild onClick={() => setReview(false)}>
              <Link to="/admin">
                View in Admin Panel <ArrowRight />
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
