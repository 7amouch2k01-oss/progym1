import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Search, UserRound, ShoppingBag, Menu, Minus, Plus, Trash2, Instagram, Youtube, Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { addCartItem, cartTotal, products, money, type CartItem, type Product } from '@/lib/catalog';

type StoreState = { items: CartItem[]; add: (id: string, option: string) => void; update: (id: string, option: string, quantity: number) => void; openBag: () => void; total: number };
const StoreContext = createContext<StoreState | null>(null);
export function useStore() { const store = useContext(StoreContext); if (!store) throw new Error('Store provider is required'); return store; }
export function Wordmark() { return <span className="wordmark">IRON<span>SOUL</span></span>; }

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bag, setBag] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [mobile, setMobile] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartTotal(items);
  const update = (id: string, option: string, quantity: number) => setItems(current => current.map(item => item.productId === id && item.option === option ? { ...item, quantity } : item).filter(item => item.quantity > 0));
  const add = (id: string, option: string) => { setItems(current => addCartItem(current, id, option)); setBag(true); };
  return <StoreContext.Provider value={{ items, add, update, openBag: () => setBag(true), total }}>
    <header className="store-header">
      <div className="header-inner">
        <nav className="desktop-nav" aria-label="Main navigation">
          <Button asChild variant="ghost" className="nav-link"><Link to="/shop" search={{ category: 'All' }}>Shop <ChevronDown /></Link></Button>
          <Button asChild variant="ghost" className="nav-link"><Link to="/shop" search={{ category: 'Equipment' }}>Equipment <ChevronDown /></Link></Button>
          <Button asChild variant="ghost" className="nav-link"><Link to="/shop" search={{ category: 'Apparel' }}>Apparel <ChevronDown /></Link></Button>
        </nav>
        <Button variant="ghost" size="icon" className="mobile-menu" aria-label="Open menu" onClick={() => setMobile(true)}><Menu /></Button>
        <Link to="/" aria-label="Iron Soul home" className="header-brand"><Wordmark /></Link>
        <div className="header-right">
          <nav className="desktop-nav"><Button asChild variant="ghost" className="nav-link"><Link to="/about">About</Link></Button><Button asChild variant="ghost" className="nav-link"><Link to="/journal">Journal</Link></Button></nav>
          <Button variant="ghost" size="icon" aria-label="Search products" title="Search products" onClick={() => setSearch(true)}><Search /></Button>
          <Button asChild variant="ghost" size="icon" className="account-link" title="Forge Club"><Link to="/club" aria-label="Forge Club"><UserRound /></Link></Button>
          <Button variant="ghost" size="icon" className="bag-button" aria-label={`Shopping bag (${count})`} onClick={() => setBag(true)}><ShoppingBag />{count > 0 && <span className="bag-count">{count}</span>}</Button>
        </div>
      </div>
    </header>
    <main>{children}</main>
    <footer className="store-footer">
      <div className="footer-top page-width">
        <Link to="/" aria-label="Iron Soul home"><Wordmark /></Link>
        <nav aria-label="Footer navigation"><Link to="/shop" search={{ category: 'All' }}>Shop</Link><Link to="/about">About</Link><Link to="/journal">Journal</Link><Link to="/contact">Contact</Link><Link to="/admin" className="text-red-400 font-semibold hover:text-red-300">Admin</Link></nav>
        <div className="social-links"><Button asChild variant="ghost" size="icon"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a></Button><Button asChild variant="ghost" size="icon"><a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube /></a></Button></div>
        <form className="newsletter" onSubmit={event => { event.preventDefault(); setNewsletter(true); }}><label htmlFor="newsletter-email">Join our newsletter</label><div><input type="email" id="newsletter-email" placeholder="Your email address" required value={email} onChange={event => setEmail(event.target.value)} /><Button type="submit" variant="ghost" size="icon" aria-label="Join newsletter"><ArrowRight /></Button></div></form>
      </div>
      <div className="footer-bottom page-width"><span>© {new Date().getFullYear()} Iron Soul. All rights reserved.</span><span>Strength / Discipline / Longevity</span></div>
    </footer>
    <Sheet open={bag} onOpenChange={setBag}><SheetContent className="cart-sheet w-full sm:max-w-md"><SheetTitle className="font-display text-2xl font-normal">Your shopping bag <span className="text-primary">({count})</span></SheetTitle><SheetDescription>Equipment for the work ahead.</SheetDescription>
      {items.length === 0 ? <div className="empty-bag"><ShoppingBag size={40} /><h3>Your next chapter starts here.</h3><p>Your bag is currently empty.</p><Button variant="forge" onClick={() => { setBag(false); navigate({ to: '/shop', search: { category: 'All' } }); }}>Explore the collection <ArrowRight /></Button></div> : <><div className="bag-items">{items.map(item => { const product = products.find(p => p.id === item.productId); if (!product) return null; return <div className="bag-item" key={`${item.productId}-${item.option}`}><img src={product.image} alt={product.name} width={100} height={100} /><div><Link to="/product/$slug" params={{ slug: product.id }} onClick={() => setBag(false)}>{product.name}</Link><p>{item.option}</p><span>{money(product.price)}</span><div className="quantity-control"><Button variant="ghost" size="icon" aria-label={`Decrease ${product.name} quantity`} onClick={() => update(item.productId, item.option, item.quantity - 1)}><Minus /></Button><span>{item.quantity}</span><Button variant="ghost" size="icon" aria-label={`Increase ${product.name} quantity`} onClick={() => update(item.productId, item.option, item.quantity + 1)}><Plus /></Button><Button variant="ghost" size="icon" aria-label={`Remove ${product.name}`} onClick={() => update(item.productId, item.option, 0)}><Trash2 /></Button></div></div></div>; })}</div><div className="bag-summary"><div><span>Subtotal</span><strong>{money(total)}</strong></div><p>Shipping and taxes calculated at checkout.</p><Button variant="forge" className="w-full" onClick={() => { setBag(false); navigate({ to: '/checkout' }); }}>Continue to checkout <ArrowRight /></Button><Button variant="ghost" className="w-full mt-2 text-xs" onClick={() => setBag(false)}>Continue shopping</Button></div></>}
    </SheetContent></Sheet>
    <Sheet open={mobile} onOpenChange={setMobile}><SheetContent side="left" className="mobile-sheet"><SheetTitle><Wordmark /></SheetTitle><SheetDescription className="sr-only">Main navigation</SheetDescription><nav>{(['All', 'Equipment', 'Accessories', 'Apparel', 'Racks & storage'] as const).map(category => <Link key={category} to="/shop" search={{ category }} onClick={() => setMobile(false)}>{category === 'All' ? 'Shop all' : category}<ArrowRight /></Link>)}<Link to="/about" onClick={() => setMobile(false)}>Our story</Link><Link to="/journal" onClick={() => setMobile(false)}>Journal</Link><Link to="/club" onClick={() => setMobile(false)}>Forge Club</Link><Link to="/contact" onClick={() => setMobile(false)}>Contact</Link></nav></SheetContent></Sheet>
    <Dialog open={search} onOpenChange={setSearch}><DialogContent className="search-dialog"><DialogTitle className="font-display text-2xl font-normal">Find your next essential.</DialogTitle><DialogDescription>Search the Forge collection.</DialogDescription><div className="search-field"><Search /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Equipment, accessories, apparel…" aria-label="Search collection" />{query && <Button variant="ghost" size="icon" aria-label="Clear search" onClick={() => setQuery('')}><X /></Button>}</div><div className="search-results">{products.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())).map(product => <Link key={product.id} to="/product/$slug" params={{ slug: product.id }} onClick={() => setSearch(false)}><img src={product.image} alt={product.name} width={64} height={64} /><span>{product.name}<small>{product.category}</small></span><span>{money(product.price)}</span><ArrowRight /></Link>)}{products.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())).length === 0 && <p className="py-8 text-center text-muted-foreground">No essentials found. Try another search.</p>}</div></DialogContent></Dialog>
    <Dialog open={newsletter} onOpenChange={setNewsletter}><DialogContent><Check className="text-primary" /><DialogTitle>You're on the list. Almost.</DialogTitle><DialogDescription>This is a storefront preview. Newsletter subscriptions are not connected yet, and your email has not been submitted.</DialogDescription><Button variant="forge" onClick={() => setNewsletter(false)}>Back to Forge <ArrowRight /></Button></DialogContent></Dialog>
  </StoreContext.Provider>;
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useStore();
  return <article className="product-card"><Link to="/product/$slug" params={{ slug: product.id }} className="product-image"><img src={product.image} alt={product.name} loading="lazy" width={512} height={512} /><span className="quick-view">Explore product <ArrowRight /></span></Link><div className="product-card-info"><Link to="/product/$slug" params={{ slug: product.id }}><h3>{product.name}</h3></Link><p>{product.category === 'Apparel' ? 'Premium cotton · Black' : product.options.length > 1 ? 'Available in multiple sizes' : 'Signature collection'}</p><strong>{money(product.price)}</strong><Button variant="forge" className="card-add" onClick={() => add(product.id, product.options[0] ?? 'Standard')}>Add to bag <Plus /></Button></div></article>;
}

export function PageIntro({ label, title, children }: { label: string; title: string; children?: ReactNode }) { return <div className="page-intro"><span className="eyebrow">{label}</span><h1>{title}</h1>{children && <p>{children}</p>}</div>; }