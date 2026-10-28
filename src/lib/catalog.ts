import { supabase, isSupabaseConfigured } from './supabase';
import dumbbells from '@/assets/dumbbells.jpg';
import belt from '@/assets/belt.jpg';
import bench from '@/assets/bench.jpg';
import rack from '@/assets/rack.jpg';
import tee from '@/assets/tee.jpg';
import straps from '@/assets/straps.jpg';

export type Category = 'All' | 'Equipment' | 'Accessories' | 'Apparel' | 'Racks & storage';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  subtitle: string;
  description: string;
  options: string[];
  details: string[];
  stock?: number;
  is_active?: boolean;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    option: string;
    quantity: number;
  }[];
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status: 'Paid' | 'Pending' | 'Refunded';
  created_at: string;
};

export type Member = {
  id: string;
  full_name: string;
  email: string;
  membership_tier: 'Free' | 'Pro' | 'Elite';
  status: 'Active' | 'Paused' | 'Expired';
  joined_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  created_at: string;
};

export const defaultProducts: Product[] = [
  { id: 'chrome-dumbbells', name: 'Iron Soul Chrome Dumbbells', price: 1299, category: 'Equipment', image: dumbbells, subtitle: 'Precision in every rep', description: 'A statement of strength. Precision-machined chrome, balanced heads, and a knurled grip that feels as good as it looks. Built for your daily pursuit of better.', options: ['25 kg pair', '30 kg pair', '35 kg pair'], details: ['Solid steel construction', 'Polished chrome finish', 'Contoured, knurled handles', 'Sold as a pair'], stock: 24, is_active: true },
  { id: 'leather-power-belt', name: 'Iron Soul Leather Power Belt', price: 199, category: 'Accessories', image: belt, subtitle: 'Support without compromise', description: 'Dependable support for your heaviest days. A substantial leather belt with a timeless brass buckle, designed to become part of your training ritual.', options: ['S', 'M', 'L', 'XL'], details: ['Premium full-grain leather', 'Double-prong brass buckle', 'Reinforced stitching', '10 cm supportive profile'], stock: 45, is_active: true },
  { id: 'adjustable-bench', name: 'Iron Soul Adjustable Bench', price: 899, category: 'Equipment', image: bench, subtitle: 'Your foundation for progress', description: 'From flat presses to incline work, one uncompromising foundation. A stable steel frame and supportive upholstery bring commercial-gym confidence to your own space.', options: ['Matte black'], details: ['Multiple backrest positions', 'Heavy-duty steel frame', 'Supportive high-density padding', 'Integrated transport wheels'], stock: 12, is_active: true },
  { id: 'power-rack', name: 'Iron Soul Power Rack', price: 1499, category: 'Racks & storage', image: rack, subtitle: 'The heart of your training space', description: 'Your own space. Your own standards. A full-height power rack engineered around the movements that matter, finished in our signature matte black.', options: ['Matte black'], details: ['Heavy-duty steel uprights', 'Integrated pull-up bar', 'Adjustable J-hooks', 'Safety supports included'], stock: 8, is_active: true },
  { id: 'classic-logo-tee', name: 'Iron Soul Training Tee', price: 59, category: 'Apparel', image: tee, subtitle: 'Quiet confidence. Every day.', description: 'An everyday essential with an athletic fit. Soft, substantial cotton that moves with you, from the first warm-up to everything that follows.', options: ['S', 'M', 'L', 'XL', 'XXL'], details: ['Premium cotton jersey', 'Athletic regular fit', 'Reinforced crew neckline', 'Signature black colorway'], stock: 80, is_active: true },
  { id: 'lifting-straps', name: 'Iron Soul Lifting Straps', price: 39, category: 'Accessories', image: straps, subtitle: 'Hold on to your potential', description: 'Less distraction. More intention. Durable woven straps give you a secure connection to the bar, so you can focus on the work ahead.', options: ['One size'], details: ['Heavyweight woven cotton', 'Reinforced seams', 'Comfortable wrist loops', 'Sold as a pair'], stock: 110, is_active: true },
];

export const defaultOrders: Order[] = [
  {
    id: 'ORD-7291',
    customer_name: 'Alexandre Laurent',
    customer_email: 'alexandre.laurent@example.com',
    shipping_address: { address: '14 Rue de la Paix', city: 'Paris', postalCode: '75002', country: 'France' },
    items: [
      { productId: 'chrome-dumbbells', name: 'Iron Soul Chrome Dumbbells', price: 1299, option: '30 kg pair', quantity: 1 },
      { productId: 'leather-power-belt', name: 'Iron Soul Leather Power Belt', price: 199, option: 'L', quantity: 1 }
    ],
    total_amount: 1498,
    status: 'Shipped',
    payment_status: 'Paid',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ORD-7292',
    customer_name: 'Sarah Connor',
    customer_email: 'sarah.c@gymclub.io',
    shipping_address: { address: '221B Baker St', city: 'London', postalCode: 'NW1 6XE', country: 'UK' },
    items: [
      { productId: 'power-rack', name: 'Iron Soul Power Rack', price: 1499, option: 'Matte black', quantity: 1 }
    ],
    total_amount: 1499,
    status: 'Processing',
    payment_status: 'Paid',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'ORD-7293',
    customer_name: 'Marcus Vance',
    customer_email: 'mvance@ironathlete.com',
    shipping_address: { address: '742 Evergreen Terrace', city: 'Springfield', postalCode: '97477', country: 'USA' },
    items: [
      { productId: 'classic-logo-tee', name: 'Iron Soul Training Tee', price: 59, option: 'L', quantity: 2 },
      { productId: 'lifting-straps', name: 'Iron Soul Lifting Straps', price: 39, option: 'One size', quantity: 1 }
    ],
    total_amount: 157,
    status: 'Pending',
    payment_status: 'Paid',
    created_at: new Date().toISOString(),
  }
];

export const defaultMembers: Member[] = [
  { id: 'mem-1', full_name: 'David Goggins', email: 'david@stayhard.com', membership_tier: 'Elite', status: 'Active', joined_at: '2026-01-15' },
  { id: 'mem-2', full_name: 'Elena Rostova', email: 'elena.rost@athlete.pro', membership_tier: 'Pro', status: 'Active', joined_at: '2026-03-02' },
  { id: 'mem-3', full_name: 'James Harrison', email: 'james.h@fitlife.co', membership_tier: 'Free', status: 'Active', joined_at: '2026-04-10' },
  { id: 'mem-4', full_name: 'Nadia Thorne', email: 'nadia.thorne@outlook.com', membership_tier: 'Pro', status: 'Paused', joined_at: '2026-05-18' }
];

export const defaultSubscribers: Subscriber[] = [
  { id: 'sub-1', email: 'contact@fitnessworld.com', created_at: '2026-02-10' },
  { id: 'sub-2', email: 'alex.lifts@gmail.com', created_at: '2026-03-12' },
  { id: 'sub-3', email: 'gympro.community@gmail.com', created_at: '2026-04-05' }
];

// In-browser / Persistent store helper
function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`ironsoul_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`ironsoul_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

// Data Access API
export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Falling back to local data', e);
    }
  }
  return loadLocal<Product[]>('products', defaultProducts);
}

export async function saveProduct(product: Product): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').upsert(product);
      return;
    } catch (e) {
      console.warn('Supabase upsert failed, saving locally', e);
    }
  }
  const current = loadLocal<Product[]>('products', defaultProducts);
  const exists = current.findIndex(p => p.id === product.id);
  const updated = exists >= 0 
    ? current.map(p => p.id === product.id ? product : p)
    : [product, ...current];
  saveLocal('products', updated);
}

export async function deleteProduct(productId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', productId);
      return;
    } catch (e) {
      console.warn('Supabase delete failed', e);
    }
  }
  const current = loadLocal<Product[]>('products', defaultProducts);
  saveLocal('products', current.filter(p => p.id !== productId));
}

export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Falling back to local orders', e);
    }
  }
  return loadLocal<Order[]>('orders', defaultOrders);
}

export async function createOrder(order: Order): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert(order);
      return;
    } catch (e) {
      console.warn('Supabase order insert failed', e);
    }
  }
  const current = loadLocal<Order[]>('orders', defaultOrders);
  saveLocal('orders', [order, ...current]);
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
      return;
    } catch (e) {
      console.warn('Supabase order update failed', e);
    }
  }
  const current = loadLocal<Order[]>('orders', defaultOrders);
  saveLocal('orders', current.map(o => o.id === orderId ? { ...o, status } : o));
}

export async function getMembers(): Promise<Member[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('members').select('*');
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Falling back to local members', e);
    }
  }
  return loadLocal<Member[]>('members', defaultMembers);
}

export async function saveMember(member: Member): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('members').upsert(member);
      return;
    } catch (e) {
      console.warn('Supabase member upsert failed', e);
    }
  }
  const current = loadLocal<Member[]>('members', defaultMembers);
  const exists = current.findIndex(m => m.id === member.id);
  const updated = exists >= 0 
    ? current.map(m => m.id === member.id ? member : m)
    : [member, ...current];
  saveLocal('members', updated);
}

export async function deleteMember(memberId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('members').delete().eq('id', memberId);
      return;
    } catch (e) {
      console.warn('Supabase member delete failed', e);
    }
  }
  const current = loadLocal<Member[]>('members', defaultMembers);
  saveLocal('members', current.filter(m => m.id !== memberId));
}

export async function getSubscribers(): Promise<Subscriber[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('newsletter_subscribers').select('*');
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Falling back to local subscribers', e);
    }
  }
  return loadLocal<Subscriber[]>('subscribers', defaultSubscribers);
}

export async function addSubscriber(email: string): Promise<void> {
  const newSub: Subscriber = { id: `sub-${Date.now()}`, email, created_at: new Date().toISOString() };
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('newsletter_subscribers').insert({ email });
      return;
    } catch (e) {
      console.warn('Supabase subscriber insert failed', e);
    }
  }
  const current = loadLocal<Subscriber[]>('subscribers', defaultSubscribers);
  if (!current.some(s => s.email.toLowerCase() === email.toLowerCase())) {
    saveLocal('subscribers', [newSub, ...current]);
  }
}

export const products = defaultProducts;
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
