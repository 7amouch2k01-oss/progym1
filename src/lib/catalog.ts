import dumbbells from '@/assets/dumbbells.jpg';
import belt from '@/assets/belt.jpg';
import bench from '@/assets/bench.jpg';
import rack from '@/assets/rack.jpg';
import tee from '@/assets/tee.jpg';
import straps from '@/assets/straps.jpg';

export type Category = 'All' | 'Equipment' | 'Accessories' | 'Apparel' | 'Racks & storage';
export type Product = { id: string; name: string; price: number; category: Category; image: string; subtitle: string; description: string; options: string[]; details: string[] };
export const products: Product[] = [
  { id: 'chrome-dumbbells', name: 'Forge Chrome Dumbbells', price: 1299, category: 'Equipment', image: dumbbells, subtitle: 'Precision in every rep', description: 'A statement of strength. Precision-machined chrome, balanced heads, and a knurled grip that feels as good as it looks. Built for your daily pursuit of better.', options: ['25 kg pair', '30 kg pair', '35 kg pair'], details: ['Solid steel construction', 'Polished chrome finish', 'Contoured, knurled handles', 'Sold as a pair'] },
  { id: 'leather-power-belt', name: 'Leather Power Belt', price: 199, category: 'Accessories', image: belt, subtitle: 'Support without compromise', description: 'Dependable support for your heaviest days. A substantial leather belt with a timeless brass buckle, designed to become part of your training ritual.', options: ['S', 'M', 'L', 'XL'], details: ['Premium full-grain leather', 'Double-prong brass buckle', 'Reinforced stitching', '10 cm supportive profile'] },
  { id: 'adjustable-bench', name: 'Forge Adjustable Bench', price: 899, category: 'Equipment', image: bench, subtitle: 'Your foundation for progress', description: 'From flat presses to incline work, one uncompromising foundation. A stable steel frame and supportive upholstery bring commercial-gym confidence to your own space.', options: ['Matte black'], details: ['Multiple backrest positions', 'Heavy-duty steel frame', 'Supportive high-density padding', 'Integrated transport wheels'] },
  { id: 'power-rack', name: 'Forge Power Rack', price: 1499, category: 'Racks & storage', image: rack, subtitle: 'The heart of your training space', description: 'Your own space. Your own standards. A full-height power rack engineered around the movements that matter, finished in our signature matte black.', options: ['Matte black'], details: ['Heavy-duty steel uprights', 'Integrated pull-up bar', 'Adjustable J-hooks', 'Safety supports included'] },
  { id: 'classic-logo-tee', name: 'Classic Training Tee', price: 59, category: 'Apparel', image: tee, subtitle: 'Quiet confidence. Every day.', description: 'An everyday essential with an athletic fit. Soft, substantial cotton that moves with you, from the first warm-up to everything that follows.', options: ['S', 'M', 'L', 'XL', 'XXL'], details: ['Premium cotton jersey', 'Athletic regular fit', 'Reinforced crew neckline', 'Signature black colorway'] },
  { id: 'lifting-straps', name: 'Essential Lifting Straps', price: 39, category: 'Accessories', image: straps, subtitle: 'Hold on to your potential', description: 'Less distraction. More intention. Durable woven straps give you a secure connection to the bar, so you can focus on the work ahead.', options: ['One size'], details: ['Heavyweight woven cotton', 'Reinforced seams', 'Comfortable wrist loops', 'Sold as a pair'] },
];
export const categories: Category[] = ['All', 'Equipment', 'Accessories', 'Apparel', 'Racks & storage'];
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export type CartItem = { productId: string; option: string; quantity: number };
export function addCartItem(items: CartItem[], productId: string, option: string): CartItem[] {
  const match = items.find(item => item.productId === productId && item.option === option);
  return match ? items.map(item => item === match ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { productId, option, quantity: 1 }];
}
export function cartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (products.find(product => product.id === item.productId)?.price ?? 0) * item.quantity, 0);
}