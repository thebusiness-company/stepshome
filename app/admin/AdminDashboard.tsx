'use client';

import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Image as ImageIcon, Users, Heart, Mail, RefreshCw, Plus, Trash2, Edit, X, Eye, EyeOff, Lock, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'girls' | 'gallery' | 'contacts' | 'donations' | 'newsletter';

interface Stats { totalContacts: number; totalDonations: number; totalSubscribers: number; totalGalleryImages: number; totalDonationAmount: number; totalGirls: number; }
interface Girl { id: string; name: string; age: number; description: string; img: string; sortOrder: number; createdAt: string; }
interface GalleryImage { id: string; title: string; alt: string; url: string; category: string; sortOrder: number; isActive: boolean; createdAt: string; }
interface Contact { id: string; firstName: string; lastName: string; email: string; phone: string | null; helpType: string; message: string | null; status: string; createdAt: string; }
interface Donation { id: string; amount: number; currency: string; frequency: string; designation: string; reference: string; status: string; createdAt: string; }
interface Subscriber { id: string; email: string; name: string | null; isActive: boolean; subscribedAt: string; }

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [girls, setGirls] = useState<Girl[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ type: 'add' | 'edit'; data?: GalleryImage } | null>(null);
  const [girlModal, setGirlModal] = useState<{ type: 'add' | 'edit'; data?: Girl } | null>(null);

  // Check auth on mount
  useEffect(() => {
    fetch('/api/admin/auth').then(r => r.json()).then(d => setAuthenticated(d.authenticated)).catch(() => setAuthenticated(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.success) { setAuthenticated(true); setPassword(''); }
      else setLoginError(data.error || 'Login failed.');
    } catch { setLoginError('Network error.'); }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setAuthenticated(false);
  };

  const fetchData = useCallback(async (t: Tab) => {
    setLoading(true);
    try {
      if (t === 'overview') {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } else if (t === 'girls') {
        const res = await fetch('/api/girls');
        const data = await res.json();
        if (data.success) setGirls(data.data);
      } else if (t === 'gallery') {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        if (data.success) setGallery(data.data);
      } else if (t === 'contacts') {
        const res = await fetch('/api/contact');
        const data = await res.json();
        if (data.success) setContacts(data.data);
      } else if (t === 'donations') {
        const res = await fetch('/api/donate');
        const data = await res.json();
        if (data.success) setDonations(data.data);
      } else if (t === 'newsletter') {
        const res = await fetch('/api/newsletter');
        const data = await res.json();
        if (data.success) setSubscribers(data.data);
      }
    } catch (e) { console.error('Fetch error:', e); }
    setLoading(false);
  }, []);

  useEffect(() => { if (authenticated) fetchData(tab); }, [tab, fetchData, authenticated]);

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    // { id: 'girls' as Tab, label: 'Girls Profiles', icon: Sparkles },
    { id: 'gallery' as Tab, label: 'Gallery', icon: ImageIcon },
    { id: 'contacts' as Tab, label: 'Contacts', icon: Users },
    { id: 'donations' as Tab, label: 'Donations', icon: Heart },
    { id: 'newsletter' as Tab, label: 'Newsletter', icon: Mail },
  ];

  // Loading auth check
  if (authenticated === null) {
    return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><p className="text-brand-muted">Loading...</p></div>;
  }

  // Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-glass p-10 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-brand-bg rounded-full mb-4 text-brand-primary"><Lock size={32} /></div>
            <h1 className="text-3xl font-serif font-bold text-brand-dark">Admin Login</h1>
            <p className="text-brand-muted mt-2">Enter your password to access the dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary text-center text-lg"
              autoFocus
            />
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button type="submit" disabled={loginLoading || !password}
              className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary/90 shadow-btn disabled:opacity-50">
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-brand-dark text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">STEPS Admin</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchData(tab)} className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all",
                tab === t.id ? "bg-brand-primary text-white shadow-btn" : "bg-white text-brand-muted hover:bg-white/80 shadow-sm"
              )}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && <div className="text-center py-20 text-brand-muted">Loading...</div>}

        {!loading && tab === 'overview' && stats && <OverviewTab stats={stats} />}
        {/* {!loading && tab === 'girls' && <GirlsTab girls={girls} onRefresh={() => fetchData('girls')} modal={girlModal} setModal={setGirlModal} />} */}
        {!loading && tab === 'gallery' && <GalleryTab gallery={gallery} onRefresh={() => fetchData('gallery')} modal={modal} setModal={setModal} />}
        {!loading && tab === 'contacts' && <ContactsTab contacts={contacts} onRefresh={() => fetchData('contacts')} />}
        {!loading && tab === 'donations' && <DonationsTab donations={donations} />}
        {!loading && tab === 'newsletter' && <NewsletterTab subscribers={subscribers} onRefresh={() => fetchData('newsletter')} />}
      </div>
    </div>
  );
}

// ─── Overview ───────────────────────────────────────────────────
function OverviewTab({ stats }: { stats: Stats }) {
  const cards = [
    // { label: 'Girls Profiles', value: stats.totalGirls || 0, icon: Sparkles, color: 'text-brand-primary' },
    { label: 'Contacts', value: stats.totalContacts, icon: Users, color: 'text-brand-primary' },
    { label: 'Donations', value: stats.totalDonations, icon: Heart, color: 'text-brand-teal' },
    { label: 'Revenue', value: `₹${stats.totalDonationAmount.toLocaleString()}`, icon: Heart, color: 'text-green-600' },
    { label: 'Subscribers', value: stats.totalSubscribers, icon: Mail, color: 'text-brand-primary' },
    { label: 'Gallery', value: stats.totalGalleryImages, icon: ImageIcon, color: 'text-brand-teal' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/10">
          <div className={`inline-flex p-2 bg-brand-bg rounded-lg mb-3 ${c.color}`}><c.icon size={20} /></div>
          <p className="text-2xl font-bold text-brand-dark">{c.value}</p>
          <p className="text-sm text-brand-muted">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Gallery ────────────────────────────────────────────────────
function GalleryTab({ gallery, onRefresh, modal, setModal }: { gallery: GalleryImage[]; onRefresh: () => void; modal: { type: 'add' | 'edit'; data?: GalleryImage } | null; setModal: (m: { type: 'add' | 'edit'; data?: GalleryImage } | null) => void }) {
  const [form, setForm] = useState({ title: '', alt: '', url: '', category: 'MEMORIES' });
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (modal?.type === 'edit' && modal.data) {
      setForm({ title: modal.data.title, alt: modal.data.alt, url: modal.data.url, category: modal.data.category });
      setUploadMode('url');
    } else {
      setForm({ title: '', alt: '', url: '', category: 'MEMORIES' });
      setUploadMode('file');
    }
  }, [modal]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, url: data.url }));
        if (!form.title) setForm(prev => ({ ...prev, title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.url) return;
    const isEdit = modal?.type === 'edit' && modal.data;
    const url = isEdit ? `/api/gallery/${modal.data!.id}` : '/api/gallery';
    const method = isEdit ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setModal(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleToggle = async (img: GalleryImage) => {
    await fetch(`/api/gallery/${img.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !img.isActive }) });
    onRefresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-brand-dark">{gallery.length} Images</h2>
        <button onClick={() => setModal({ type: 'add' })} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-primary/90 shadow-btn">
          <Plus size={16} /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map(img => (
          <div key={img.id} className={cn("bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-accent/10 group", !img.isActive && "opacity-50")}>
            <div className="aspect-square relative">
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => setModal({ type: 'edit', data: img })} className="bg-white p-2 rounded-lg"><Edit size={16} /></button>
                <button onClick={() => handleToggle(img)} className="bg-white p-2 rounded-lg">{img.isActive ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                <button onClick={() => handleDelete(img.id)} className="bg-red-500 text-white p-2 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium text-brand-dark text-sm truncate">{img.title}</p>
              <p className="text-xs text-brand-muted">{img.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brand-dark">{modal.type === 'add' ? 'Add Image' : 'Edit Image'}</h3>
              <button onClick={() => setModal(null)} className="text-brand-muted hover:text-brand-dark"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Image title" />
              </div>

              {/* Upload Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">Image Source</label>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setUploadMode('file')}
                    className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                      uploadMode === 'file' ? "bg-brand-primary text-white" : "bg-gray-100 text-brand-muted hover:bg-gray-200"
                    )}>
                    📁 Upload File
                  </button>
                  <button onClick={() => setUploadMode('url')}
                    className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                      uploadMode === 'url' ? "bg-brand-primary text-white" : "bg-gray-100 text-brand-muted hover:bg-gray-200"
                    )}>
                    🔗 Paste URL
                  </button>
                </div>

                {uploadMode === 'file' ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-primary transition-colors">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="gallery-upload" />
                    <label htmlFor="gallery-upload" className="cursor-pointer">
                      {uploading ? (
                        <p className="text-brand-primary font-medium">Uploading...</p>
                      ) : form.url && uploadMode === 'file' ? (
                        <p className="text-green-600 font-medium">✅ Image uploaded! Click to change</p>
                      ) : (
                        <>
                          <p className="text-brand-muted mb-1">Click to choose an image</p>
                          <p className="text-xs text-brand-muted">JPEG, PNG, WebP, GIF — Max 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="https://example.com/image.jpg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Alt Text</label>
                <input value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Describe the image" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary">
                  <option value="MEMORIES">Memories</option>
                  <option value="EVENTS">Events</option>
                  <option value="DAILY_LIFE">Daily Life</option>
                </select>
              </div>
              {form.url && <img src={form.url} alt="Preview" className="w-full h-40 object-cover rounded-xl" />}
              <button onClick={handleSave} disabled={!form.title || !form.url}
                className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary/90 shadow-btn disabled:opacity-50 disabled:cursor-not-allowed">
                {modal.type === 'add' ? 'Add Image' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Contacts ───────────────────────────────────────────────────
function ContactsTab({ contacts, onRefresh }: { contacts: Contact[]; onRefresh: () => void }) {
  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/contact`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    onRefresh();
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    REVIEWED: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-purple-100 text-purple-700',
    COMPLETED: 'bg-green-100 text-green-700',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-accent/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-bg text-brand-dark">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Help Type</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-accent/10">
            {contacts.map(c => (
              <tr key={c.id} className="hover:bg-brand-bg/50">
                <td className="px-4 py-3 font-medium text-brand-dark">{c.firstName} {c.lastName}</td>
                <td className="px-4 py-3 text-brand-muted">{c.email}</td>
                <td className="px-4 py-3 text-brand-muted">{c.helpType}</td>
                <td className="px-4 py-3">
                  <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                    className={cn("px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer", statusColors[c.status] || 'bg-gray-100')}>
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-brand-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {contacts.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-brand-muted">No contacts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Donations ──────────────────────────────────────────────────
function DonationsTab({ donations }: { donations: Donation[] }) {
  const completedDonations = donations.filter(d => d.status === 'COMPLETED');
  const total = completedDonations.reduce((s, d) => s + Number(d.amount), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="bg-brand-primary text-white p-6 rounded-2xl mb-6 flex justify-between items-center">
        <div>
          <p className="text-white/80 text-sm">Total Revenue (Completed)</p>
          <p className="text-3xl font-bold">₹{total.toLocaleString()}</p>
        </div>
        <p className="text-white/80">{completedDonations.length} completed / {donations.length} total</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-brand-accent/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-bg text-brand-dark">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Reference</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Frequency</th>
                <th className="text-left px-4 py-3 font-medium">Designation</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-accent/10">
              {donations.map(d => (
                <tr key={d.id} className="hover:bg-brand-bg/50">
                  <td className="px-4 py-3 font-mono text-xs text-brand-dark">{d.reference}</td>
                  <td className="px-4 py-3 font-bold text-brand-dark">₹{d.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={cn("px-2 py-1 rounded-full text-xs font-bold", d.frequency === 'MONTHLY' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700')}>{d.frequency.replace('_', '-')}</span></td>
                  <td className="px-4 py-3 text-brand-muted capitalize">{d.designation}</td>
                  <td className="px-4 py-3"><span className={cn("px-2 py-1 rounded-full text-xs font-bold", getStatusBadge(d.status))}>{d.status}</span></td>
                  <td className="px-4 py-3 text-brand-muted">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {donations.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-brand-muted">No donations yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Newsletter ─────────────────────────────────────────────────
function NewsletterTab({ subscribers, onRefresh }: { subscribers: Subscriber[]; onRefresh: () => void }) {
  const handleToggle = async (email: string, isActive: boolean) => {
    await fetch('/api/newsletter', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, isActive: !isActive }) });
    onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-accent/10 overflow-hidden">
      <div className="p-4 border-b border-brand-accent/10 flex justify-between items-center">
        <h2 className="font-bold text-brand-dark">{subscribers.length} Active Subscribers</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-bg text-brand-dark">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Subscribed</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-accent/10">
            {subscribers.map(s => (
              <tr key={s.id} className="hover:bg-brand-bg/50">
                <td className="px-4 py-3 text-brand-dark">{s.email}</td>
                <td className="px-4 py-3 text-brand-muted">{s.name || '—'}</td>
                <td className="px-4 py-3 text-brand-muted">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(s.email, s.isActive)} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Unsubscribe
                  </button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-brand-muted">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Girls Tab ──────────────────────────────────────────────────
function GirlsTab({ girls, onRefresh, modal, setModal }: { 
  girls: Girl[]; 
  onRefresh: () => void; 
  modal: { type: 'add' | 'edit'; data?: Girl } | null; 
  setModal: (m: { type: 'add' | 'edit'; data?: Girl } | null) => void 
}) {
  const [form, setForm] = useState({ name: '', age: 18, description: '', img: '' });
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (modal?.type === 'edit' && modal.data) {
      setForm({ name: modal.data.name, age: modal.data.age, description: modal.data.description, img: modal.data.img });
      setUploadMode('url');
    } else {
      setForm({ name: '', age: 18, description: '', img: '' });
      setUploadMode('file');
    }
  }, [modal]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, img: data.url }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.img || !form.description) return;
    const isEdit = modal?.type === 'edit' && modal.data;
    const url = isEdit ? `/api/girls/${modal.data!.id}` : '/api/girls';
    const method = isEdit ? 'PUT' : 'POST';
    
    const res = await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({
        name: form.name,
        age: Number(form.age),
        description: form.description,
        img: form.img
      }) 
    });
    
    if (res.ok) {
      setModal(null);
      onRefresh();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to save profile');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this girl\'s profile?')) return;
    const res = await fetch(`/api/girls/${id}`, { method: 'DELETE' });
    if (res.ok) {
      onRefresh();
    } else {
      alert('Failed to delete profile');
    }
  };

  const handleReorder = async (girl: Girl, direction: 'up' | 'down') => {
    const currentIndex = girls.findIndex(g => g.id === girl.id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === girls.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetGirl = girls[targetIndex];

    // Swap sortOrder
    const currentOrder = girl.sortOrder;
    const targetOrder = targetGirl.sortOrder;

    // Send PUT updates
    await fetch(`/api/girls/${girl.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortOrder: targetOrder })
    });

    await fetch(`/api/girls/${targetGirl.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortOrder: currentOrder })
    });

    onRefresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-brand-dark">{girls.length} Girls Profiles</h2>
        <button onClick={() => setModal({ type: 'add' })} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-primary/90 shadow-btn">
          <Plus size={16} /> Add Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {girls.map((g, idx) => (
          <div key={g.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-accent/15 flex flex-col justify-between group">
            <div>
              <div className="aspect-square relative w-full bg-brand-bg">
                <img src={g.img} alt={g.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setModal({ type: 'edit', data: g })} className="bg-white p-2.5 rounded-lg hover:scale-105 transition-transform"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(g.id)} className="bg-red-500 text-white p-2.5 rounded-lg hover:scale-105 transition-transform"><Trash2 size={16} /></button>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1 bg-black/60 backdrop-blur-sm rounded-lg p-1">
                  <button 
                    disabled={idx === 0}
                    onClick={() => handleReorder(g, 'up')}
                    className="text-white disabled:opacity-30 hover:bg-white/10 p-1 rounded text-xs"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button 
                    disabled={idx === girls.length - 1}
                    onClick={() => handleReorder(g, 'down')}
                    className="text-white disabled:opacity-30 hover:bg-white/10 p-1 rounded text-xs"
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-serif font-bold text-brand-dark">{g.name}</h3>
                  <span className="text-sm font-bold text-brand-primary">{g.age} yrs</span>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">{g.description}</p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 border-t border-brand-bg text-right text-xs text-brand-muted">
              Order index: {g.sortOrder}
            </div>
          </div>
        ))}
        {girls.length === 0 && <div className="col-span-full text-center py-12 text-brand-muted">No profiles added yet.</div>}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brand-dark">{modal.type === 'add' ? 'Add Profile' : 'Edit Profile'}</h3>
              <button onClick={() => setModal(null)} className="text-brand-muted hover:text-brand-dark"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Girl's name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Age</label>
                <input type="number" value={form.age} onChange={e => setForm({ ...form, age: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Age" min={1} max={120} />
              </div>

              {/* Upload Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">Photo Source</label>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setUploadMode('file')}
                    className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                      uploadMode === 'file' ? "bg-brand-primary text-white" : "bg-gray-100 text-brand-muted hover:bg-gray-200"
                    )}>
                    📁 Upload File
                  </button>
                  <button onClick={() => setUploadMode('url')}
                    className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                      uploadMode === 'url' ? "bg-brand-primary text-white" : "bg-gray-100 text-brand-muted hover:bg-gray-200"
                    )}>
                    🔗 Paste URL
                  </button>
                </div>

                {uploadMode === 'file' ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-primary transition-colors">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="girl-upload" />
                    <label htmlFor="girl-upload" className="cursor-pointer">
                      {uploading ? (
                        <p className="text-brand-primary font-medium">Uploading...</p>
                      ) : form.img && uploadMode === 'file' ? (
                        <p className="text-green-600 font-medium">✅ Photo uploaded! Click to change</p>
                      ) : (
                        <>
                          <p className="text-brand-muted mb-1">Click to choose a photo</p>
                          <p className="text-xs text-brand-muted">JPEG, PNG, WebP — Max 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <input value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary" placeholder="/profile/Nisha.png or https://example.com/photo.jpg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Description / Story</label>
                <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary resize-none" placeholder="A 2-3 sentence description..." />
              </div>

              {form.img && <img src={form.img} alt="Preview" className="w-full h-40 object-cover rounded-xl" />}
              <button onClick={handleSave} disabled={!form.name || !form.img || !form.description}
                className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary/90 shadow-btn disabled:opacity-50 disabled:cursor-not-allowed">
                {modal.type === 'add' ? 'Add Profile' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

