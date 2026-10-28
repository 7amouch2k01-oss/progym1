import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  Package, ShoppingCart, Users, Mail, TrendingUp, Plus, Edit2, Trash2, 
  Search, CheckCircle2, Clock, Truck, ShieldAlert, ArrowUpRight, BarChart3, 
  Settings, LogOut, DollarSign, Database, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getProducts, saveProduct, deleteProduct, 
  getOrders, updateOrderStatus, 
  getMembers, saveMember, deleteMember, 
  getSubscribers, money, 
  type Product, type Order, type Member, type Subscriber, type Category, categories 
} from '@/lib/catalog';
import { isSupabaseConfigured } from '@/lib/supabase';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin')({
  head: () => pageHead('Admin Dashboard | Iron Soul', 'Manage products, orders, memberships and analytics.'),
  component: AdminDashboard,
});

export function AdminDashboard() {
  const [tab, setTab] = useState<'analytics' | 'products' | 'orders' | 'members' | 'subscribers'>('analytics');
  
  // Data states
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [subscribersList, setSubscribersList] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & form state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<Member> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prods, ords, mems, subs] = await Promise.all([
        getProducts(),
        getOrders(),
        getMembers(),
        getSubscribers()
      ]);
      setProductsList(prods);
      setOrdersList(ords);
      setMembersList(mems);
      setSubscribersList(subs);
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Metrics
  const totalRevenue = ordersList.reduce((acc, curr) => acc + (curr.status !== 'Cancelled' ? curr.total_amount : 0), 0);
  const totalOrders = ordersList.length;
  const activeMembers = membersList.filter(m => m.status === 'Active').length;
  const activeProducts = productsList.filter(p => p.is_active !== false).length;

  // Handlers for Products
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;
    const finalProduct: Product = {
      id: editingProduct.id || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: editingProduct.name,
      price: Number(editingProduct.price),
      category: (editingProduct.category as Category) || 'Equipment',
      image: editingProduct.image || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
      subtitle: editingProduct.subtitle || 'Engineered for Performance',
      description: editingProduct.description || 'Uncompromising build quality for serious lifters.',
      options: typeof editingProduct.options === 'string' ? (editingProduct.options as string).split(',').map(s => s.trim()) : (editingProduct.options || ['Standard']),
      details: typeof editingProduct.details === 'string' ? (editingProduct.details as string).split(',').map(s => s.trim()) : (editingProduct.details || ['Commercial grade']),
      stock: Number(editingProduct.stock ?? 50),
      is_active: editingProduct.is_active ?? true,
    };
    await saveProduct(finalProduct);
    setEditingProduct(null);
    loadAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      loadAllData();
    }
  };

  // Handlers for Orders
  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    loadAllData();
  };

  // Handlers for Members
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.email || !editingMember?.full_name) return;
    const member: Member = {
      id: editingMember.id || `mem-${Date.now()}`,
      full_name: editingMember.full_name,
      email: editingMember.email,
      membership_tier: (editingMember.membership_tier as any) || 'Pro',
      status: (editingMember.status as any) || 'Active',
      joined_at: editingMember.joined_at || new Date().toISOString().split('T')[0],
    };
    await saveMember(member);
    setEditingMember(null);
    loadAllData();
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Remove this member?')) {
      await deleteMember(id);
      loadAllData();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center font-black tracking-wider text-white shadow-lg shadow-red-900/40">
              IS
            </span>
            <div>
              <h1 className="font-bold text-lg tracking-tight">IRON SOUL</h1>
              <span className="text-xs text-neutral-400 uppercase tracking-widest">Admin Central</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setTab('analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'analytics' ? 'bg-red-600 text-white shadow-md shadow-red-900/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Analytics Overview
            </button>
            <button
              onClick={() => setTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'products' ? 'bg-red-600 text-white shadow-md shadow-red-900/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Package className="w-4 h-4" /> Products ({productsList.length})
            </button>
            <button
              onClick={() => setTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'orders' ? 'bg-red-600 text-white shadow-md shadow-red-900/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <ShoppingCart className="w-4 h-4" /> Orders ({ordersList.length})
            </button>
            <button
              onClick={() => setTab('members')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'members' ? 'bg-red-600 text-white shadow-md shadow-red-900/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Users className="w-4 h-4" /> Club Members ({membersList.length})
            </button>
            <button
              onClick={() => setTab('subscribers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'subscribers' ? 'bg-red-600 text-white shadow-md shadow-red-900/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Mail className="w-4 h-4" /> Newsletter ({subscribersList.length})
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400 px-2">
            <Database className="w-3.5 h-3.5 text-red-500" />
            <span>Database: {isSupabaseConfigured ? 'Supabase Live' : 'Local + Offline Sync'}</span>
          </div>
          <Link to="/" className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition">
            View Storefront <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-neutral-800 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold capitalize tracking-tight">
              {tab === 'analytics' ? 'Performance & Metrics' : tab}
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Live management and continuous operation for Iron Soul.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadAllData} className="gap-2 border-neutral-700 text-neutral-300">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            {tab === 'products' && (
              <Button onClick={() => setEditingProduct({ options: ['Standard'], details: ['Heavy duty'], is_active: true, category: 'Equipment' })} className="bg-red-600 hover:bg-red-700 gap-2 text-white">
                <Plus className="w-4 h-4" /> New Product
              </Button>
            )}
            {tab === 'members' && (
              <Button onClick={() => setEditingMember({ membership_tier: 'Pro', status: 'Active' })} className="bg-red-600 hover:bg-red-700 gap-2 text-white">
                <Plus className="w-4 h-4" /> Add Member
              </Button>
            )}
          </div>
        </header>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {tab === 'analytics' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-sm font-medium">Total Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black">{money(totalRevenue)}</div>
                <span className="text-xs text-emerald-400 font-medium mt-1 inline-block">↑ 24.8% vs last month</span>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-sm font-medium">Total Orders</span>
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-black">{totalOrders}</div>
                <span className="text-xs text-neutral-400 mt-1 inline-block">3 pending fulfillment</span>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-sm font-medium">Club Members</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black">{activeMembers}</div>
                <span className="text-xs text-purple-400 font-medium mt-1 inline-block">VIP community lifters</span>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-sm font-medium">Live Catalog</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black">{activeProducts}</div>
                <span className="text-xs text-neutral-400 mt-1 inline-block">Active SKUs</span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="font-bold text-base">Recent Store Orders</h3>
                <button onClick={() => setTab('orders')} className="text-xs text-red-400 hover:text-red-300">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-medium">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Items</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {ordersList.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-neutral-800/40">
                        <td className="px-6 py-4 font-mono font-medium">{o.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">{o.customer_name}</div>
                          <div className="text-xs text-neutral-400">{o.customer_email}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-neutral-300">
                          {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="px-6 py-4 font-bold">{money(o.total_amount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            o.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            o.status === 'Shipped' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                            o.status === 'Processing' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-neutral-800 text-neutral-300'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {tab === 'products' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsList.map(prod => (
                <div key={prod.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 bg-neutral-950 overflow-hidden">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 px-2 py-1 bg-neutral-900/80 backdrop-blur text-xs font-semibold rounded border border-neutral-700">
                        {prod.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-base">{prod.name}</h4>
                        <span className="text-red-400 font-black">{money(prod.price)}</span>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-2 mb-4">{prod.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {prod.options?.map((opt, idx) => (
                          <span key={idx} className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-neutral-950/60 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Stock: <strong className="text-white">{prod.stock ?? 50}</strong></span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingProduct(prod)} className="h-8 w-8 p-0">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(prod.id)} className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {tab === 'orders' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Order ID & Date</th>
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4">Items Ordered</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {ordersList.map(ord => (
                    <tr key={ord.id} className="hover:bg-neutral-800/40">
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-white">{ord.id}</div>
                        <div className="text-xs text-neutral-500">{new Date(ord.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{ord.customer_name}</div>
                        <div className="text-xs text-neutral-400">{ord.customer_email}</div>
                        {ord.shipping_address && (
                          <div className="text-[11px] text-neutral-500 mt-1">
                            {ord.shipping_address.city}, {ord.shipping_address.country}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {ord.items.map((item, i) => (
                            <div key={i} className="text-xs text-neutral-300">
                              <span className="font-semibold">{item.quantity}x</span> {item.name} ({item.option})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-white">{money(ord.total_amount)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                          className="bg-neutral-950 border border-neutral-700 rounded-md px-3 py-1.5 text-xs font-semibold text-neutral-200 focus:outline-none focus:border-red-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MEMBERS MANAGEMENT */}
        {tab === 'members' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Member Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Tier</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {membersList.map(mem => (
                    <tr key={mem.id} className="hover:bg-neutral-800/40">
                      <td className="px-6 py-4 font-bold">{mem.full_name}</td>
                      <td className="px-6 py-4 text-neutral-300">{mem.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          mem.membership_tier === 'Elite' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          mem.membership_tier === 'Pro' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {mem.membership_tier}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold ${mem.status === 'Active' ? 'text-emerald-400' : 'text-neutral-500'}`}>
                          ● {mem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-400">{mem.joined_at}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingMember(mem)} className="h-8 w-8 p-0">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMember(mem.id)} className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SUBSCRIBERS */}
        {tab === 'subscribers' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden max-w-3xl">
            <div className="px-6 py-4 border-b border-neutral-800">
              <h3 className="font-bold">Newsletter Email List</h3>
              <p className="text-xs text-neutral-400">All registered newsletter leads from the storefront.</p>
            </div>
            <div className="divide-y divide-neutral-800">
              {subscribersList.map(sub => (
                <div key={sub.id} className="px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <span className="font-medium text-sm">{sub.email}</span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product Edit / Add Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{editingProduct.id ? 'Edit Product' : 'Create Product'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price ?? ''}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'Equipment'}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={editingProduct.image || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Options (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingProduct.options) ? editingProduct.options.join(', ') : editingProduct.options || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, options: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct.stock ?? 50}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Edit / Add Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{editingMember.id ? 'Edit Member' : 'New Member'}</h3>
            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.full_name || ''}
                  onChange={e => setEditingMember({ ...editingMember, full_name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editingMember.email || ''}
                  onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Tier</label>
                  <select
                    value={editingMember.membership_tier || 'Pro'}
                    onChange={e => setEditingMember({ ...editingMember, membership_tier: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Status</label>
                  <select
                    value={editingMember.status || 'Active'}
                    onChange={e => setEditingMember({ ...editingMember, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                  Save Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
