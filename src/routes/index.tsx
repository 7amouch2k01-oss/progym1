import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Crown, BookOpen, PackageOpen, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store';
import { products } from '@/lib/catalog';
import hero from '@/assets/forge-hero.jpg';
import community from '@/assets/forge-community.jpg';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/')({ head: () => pageHead('Iron Soul | Premium Gym Equipment & Apparel', 'Performance-driven equipment, premium training apparel, and lifting essentials. Built for those who train with intention.'), component: Index });
function Index() {
  const tiles = [{ title: 'Strength equipment', category: 'Equipment' as const, image: products[0]?.image }, { title: 'Lifting accessories', category: 'Accessories' as const, image: products[1]?.image }, { title: 'Apparel', category: 'Apparel' as const, image: products[4]?.image }, { title: 'Racks & storage', category: 'Racks & storage' as const, image: products[3]?.image }];
  const perks = [{ icon: Crown, title: 'Exclusive pricing', text: 'Member-only deals and early access.' }, { icon: BookOpen, title: 'Training resources', text: 'Programs, guides, and expert content.' }, { icon: PackageOpen, title: 'Early product drops', text: 'Be the first to know.' }, { icon: UsersRound, title: 'The Forge community', text: 'Stronger together.' }];
  return <><section className="hero"><img className="hero-photo" src={hero} alt="Chrome dumbbells and a leather lifting belt in the Forge training space" width={1920} height={800} fetchPriority="high" /><div className="hero-content page-width"><span className="eyebrow">Built for better humans</span><h1>Premium gym<br />equipment & apparel</h1><p>Performance driven. Aesthetically refined.<br />For those who take training seriously.</p><Button asChild variant="forge" className="hero-cta"><Link to="/shop" search={{ category: 'All' }}>Shop the collection <ArrowRight /></Link></Button></div><div className="hero-bottom"><span />The pursuit of better. Every day.</div></section>
  <section className="category-grid page-width" aria-label="Shop by category">{tiles.map(tile => <Link className="category-tile" key={tile.title} to="/shop" search={{ category: tile.category }}><img src={tile.image} alt={tile.title} loading="lazy" width={512} height={512} /><div className="category-tile-content"><h2>{tile.title}</h2><span>Shop now <ArrowRight /></span></div></Link>)}</section>
  <section className="featured page-width"><h2 className="section-label">Featured products</h2><div className="product-grid">{products.slice(0, 5).map(product => <ProductCard key={product.id} product={product} />)}</div></section>
  <section className="community-band"><img src={community} className="community-photo" alt="An athlete preparing for training at Forge" width={1024} height={1024} loading="lazy" /><div className="community-copy"><span className="eyebrow">Forge membership</span><h2>More than a store.<br />A lifetime of progress.</h2><p>Get exclusive access to member pricing, early drops, training resources, and a community that lifts together.</p><Button asChild variant="forge"><Link to="/club">Join the Forge Club <ArrowRight /></Link></Button></div><div className="community-perks">{perks.map(perk => <div key={perk.title}><perk.icon /><div><h3>{perk.title}</h3><p>{perk.text}</p></div></div>)}</div></section></>;
}
