import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, ProductCategory, Product, BrochureRequest } from '../lib/supabase';
import { Upload, LogOut, Image as ImageIcon, Palette, Plus, Trash2, Save, FileText, UserPlus, RefreshCw } from 'lucide-react';

interface ClientRegistrationLead {
  id: string;
  company: string;
  contact: string;
  email: string;
  country: string;
  business_type: string;
  created_at: string;
}

interface CompletedB2BOrder {
  order_id: string;
  status: string;
  order_date: string | null;
  company_name: string;
  contact_name: string | null;
  contact_email: string;
  country: string | null;
  line_count: number;
  total_qty: number;
  email_sent: boolean;
  email_error: string | null;
  created_at: string;
}

interface SiteSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

const APPROVED_EMAILS_STORAGE_KEY = 'adminApprovedClientEmails';

const getStoredApprovedEmails = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();

  try {
    const raw = window.localStorage.getItem(APPROVED_EMAILS_STORAGE_KEY);
    if (!raw) return new Set();

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();

    return new Set(
      parsed
        .map((value) => String(value).toLowerCase().trim())
        .filter(Boolean)
    );
  } catch {
    return new Set();
  }
};

const persistApprovedEmails = (emails: Set<string>) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(APPROVED_EMAILS_STORAGE_KEY, JSON.stringify(Array.from(emails)));
  } catch {
    // Ignore localStorage write failures
  }
};

const DEFAULT_COLORS: SiteSettings = {
  primary_color: '#06b6d4',
  secondary_color: '#3b82f6',
  accent_color: '#22d3ee',
};

function getLatestDecemberStart(referenceDate = new Date()): Date {
  const year = referenceDate.getMonth() >= 11 ? referenceDate.getFullYear() : referenceDate.getFullYear() - 1;
  return new Date(year, 11, 1, 0, 0, 0, 0);
}

export default function AdminDashboard() {
  const { signOut, user, session } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'colors' | 'brochures' | 'clients'>('products');
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [brochureRequests, setBrochureRequests] = useState<BrochureRequest[]>([]);
  const [clientRegistrations, setClientRegistrations] = useState<ClientRegistrationLead[]>([]);
  const [completedOrders, setCompletedOrders] = useState<CompletedB2BOrder[]>([]);
  const [approvedEmails, setApprovedEmails] = useState<Set<string>>(() => getStoredApprovedEmails());
  const [invitingEmail, setInvitingEmail] = useState<string | null>(null);
  const [manualInviteLink, setManualInviteLink] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [refreshingClients, setRefreshingClients] = useState(false);
  const [backfillingClients, setBackfillingClients] = useState(false);
  const [colors, setColors] = useState<SiteSettings>(DEFAULT_COLORS);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const clientRegistrationsStartDate = getLatestDecemberStart();
  const clientRegistrationsStartIso = clientRegistrationsStartDate.toISOString();
  const clientRegistrationsWindowLabel = clientRegistrationsStartDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const loadCategories = useCallback(async () => {
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .order('display_order');
    if (data) {
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0].id);
    }
  }, []);

  const loadProducts = useCallback(async (categoryId: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('display_order');
    if (data) setProducts(data);
  }, []);

  const loadColors = useCallback(async () => {
    const { data } = await supabase.from('site_settings').select('*');
    if (data) {
      const settings: Partial<SiteSettings> = {};
      data.forEach((setting) => {
        if (setting.key in DEFAULT_COLORS) {
          settings[setting.key as keyof SiteSettings] = setting.value;
        }
      });
      setColors(prev => ({ ...prev, ...settings } as SiteSettings));
    }
  }, []);

  const loadBrochureRequests = useCallback(async () => {
    const { data } = await supabase
      .from('brochure_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setBrochureRequests(data);
  }, []);

  const loadClientRegistrations = useCallback(async () => {
    if (!session?.access_token) {
      console.error('Failed to load client registrations: missing admin session token');
      return;
    }

    try {
      const response = await fetch(`/api/admin-client-registrations?startDate=${encodeURIComponent(clientRegistrationsStartIso)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: ClientRegistrationLead[];
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to load client registrations.');
      }

      setClientRegistrations(payload.data ?? []);
    } catch (error) {
      console.error('Failed to load client registrations:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to load client registrations.');
    }
  }, [clientRegistrationsStartIso, session?.access_token]);

  const handleBackfillClientRegistrations = useCallback(async () => {
    if (!session?.access_token) {
      setMessage('Missing admin session. Please sign in again.');
      return;
    }

    setBackfillingClients(true);
    try {
      const response = await fetch(`/api/admin-client-registrations-backfill?startDate=${encodeURIComponent(clientRegistrationsStartIso)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Backfill failed.');
      }

      setMessage(payload.message || 'Backfill completed successfully.');
      await loadClientRegistrations();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Backfill failed.');
    } finally {
      setBackfillingClients(false);
    }
  }, [clientRegistrationsStartIso, loadClientRegistrations, session?.access_token]);

  const loadApprovedClients = useCallback(async () => {
    const { data, error } = await supabase
      .from('approved_clients')
      .select('email');

    const stored = getStoredApprovedEmails();

    if (error) {
      console.error('Failed to load approved clients:', error);
      setApprovedEmails(stored);
      return;
    }

    const next = new Set([
      ...Array.from(stored),
      ...(data ?? []).map((row) => String(row.email).toLowerCase()),
    ]);
    setApprovedEmails(next);
    persistApprovedEmails(next);
  }, []);

  const loadCompletedOrders = useCallback(async () => {
    if (!session?.access_token) {
      console.error('Failed to load completed orders: missing admin session token');
      return;
    }

    try {
      const response = await fetch('/api/admin-b2b-orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: CompletedB2BOrder[];
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to load completed orders.');
      }

      setCompletedOrders(payload.data ?? []);
    } catch (error) {
      console.error('Failed to load completed orders:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to load completed orders.');
    }
  }, [session?.access_token]);

  useEffect(() => {
    loadCategories();
    loadColors();
    loadBrochureRequests();
    loadClientRegistrations();
    loadApprovedClients();
  }, [loadCategories, loadColors, loadBrochureRequests, loadClientRegistrations, loadApprovedClients]);

  const refreshClientAccess = useCallback(async () => {
    setRefreshingClients(true);
    try {
      await Promise.all([loadClientRegistrations(), loadApprovedClients(), loadCompletedOrders()]);
    } finally {
      setRefreshingClients(false);
    }
  }, [loadClientRegistrations, loadApprovedClients, loadCompletedOrders]);

  useEffect(() => {
    if (activeTab !== 'clients') return;

    refreshClientAccess();

    const intervalId = window.setInterval(() => {
      refreshClientAccess();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [activeTab, refreshClientAccess]);

  useEffect(() => {
    if (selectedCategory) {
      loadProducts(selectedCategory);
    }
  }, [selectedCategory, loadProducts]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      let imageUrl = '';
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const { error } = await supabase.from('products').insert({
        category_id: selectedCategory,
        name: newProduct.name,
        description: newProduct.description,
        image_url: imageUrl,
        display_order: products.length,
      });

      if (error) throw error;

      setMessage('Product added successfully!');
      setNewProduct({ name: '', description: '' });
      setSelectedFile(null);
      loadProducts(selectedCategory);
    } catch {
      setMessage('Error adding product');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      if (imageUrl) {
        const path = imageUrl.split('/').pop();
        if (path) {
          await supabase.storage.from('product-images').remove([path]);
        }
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setMessage('Product deleted successfully!');
      loadProducts(selectedCategory);
    } catch {
      setMessage('Error deleting product');
    }
  };

  const handleSaveColors = async () => {
    try {
      for (const [key, value] of Object.entries(colors)) {
        await supabase
          .from('site_settings')
          .upsert({ key, value, updated_at: new Date().toISOString() });
      }
      setMessage('Colors updated successfully! Refresh the main site to see changes.');
    } catch {
      setMessage('Error updating colors');
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFiles || bulkFiles.length === 0) {
      setMessage('Please select files to upload');
      return;
    }

    setBulkUploading(true);
    setMessage('');

    try {
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < bulkFiles.length; i++) {
        const file = bulkFiles[i];
        const productName = file.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');

        try {
          const imageUrl = await uploadImage(file);

          await supabase.from('products').insert({
            category_id: selectedCategory,
            name: productName,
            description: `${productName} product`,
            image_url: imageUrl,
            display_order: products.length + successCount,
          });

          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Error uploading ${file.name}:`, error);
        }
      }

      setMessage(
        `Bulk upload complete! ${successCount} products added${
          errorCount > 0 ? `, ${errorCount} failed` : ''
        }`
      );
      setBulkFiles(null);
      loadProducts(selectedCategory);
    } catch {
      setMessage('Error during bulk upload');
    } finally {
      setBulkUploading(false);
    }
  };

  const handleApproveAndInvite = async (registration: ClientRegistrationLead) => {
    if (!session?.access_token) {
      setMessage('Missing admin session. Please sign in again.');
      return;
    }

    setInvitingEmail(registration.email);
    setManualInviteLink('');
    try {
      const response = await fetch('/api/admin-client-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: registration.email,
          company: registration.company,
          contact: registration.contact,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        inviteLink?: string;
      };
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to approve and invite client.');
      }

      if (payload.inviteLink) {
        setManualInviteLink(payload.inviteLink);
      }

      setApprovedEmails((prev) => {
        const next = new Set(prev);
        next.add(registration.email.toLowerCase());
        persistApprovedEmails(next);
        return next;
      });
      setMessage(payload.message || `Client approved and invite sent to ${registration.email}.`);
    } catch (error) {
      console.error('Approve+invite error:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to approve and invite client.');
    } finally {
      setInvitingEmail(null);
    }
  };

  const handleCreateAdminAccount = async () => {
    if (!session?.access_token) {
      setMessage('Missing admin session. Please sign in again.');
      return;
    }

    const normalizedEmail = newAdminEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setMessage('Enter an email address for the new admin.');
      return;
    }

    setCreatingAdmin(true);
    try {
      const response = await fetch('/api/admin-create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: newAdminPassword.trim() || undefined,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: { temporaryPassword?: string };
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to create admin account.');
      }

      const returnedPassword = payload.data?.temporaryPassword || newAdminPassword.trim();
      setMessage(
        returnedPassword
          ? `${payload.message} Temporary password: ${returnedPassword}`
          : (payload.message || 'Admin account created.')
      );
      setNewAdminEmail('');
      setNewAdminPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to create admin account.');
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-cyan-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 text-gray-300 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
            {message}
          </div>
        )}

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-700 text-white'
                : 'bg-slate-800/50 text-gray-300 border border-cyan-500/20'
            }`}
          >
            <ImageIcon size={20} />
            <span>Manage Products</span>
          </button>
          <button
            onClick={() => setActiveTab('brochures')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'brochures'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-700 text-white'
                : 'bg-slate-800/50 text-gray-300 border border-cyan-500/20'
            }`}
          >
            <FileText size={20} />
            <span>Brochure Requests</span>
            {brochureRequests.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-cyan-500 text-white rounded-full text-xs">
                {brochureRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'colors'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-700 text-white'
                : 'bg-slate-800/50 text-gray-300 border border-cyan-500/20'
            }`}
          >
            <Palette size={20} />
            <span>Customize Colors</span>
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'clients'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-700 text-white'
                : 'bg-slate-800/50 text-gray-300 border border-cyan-500/20'
            }`}
          >
            <UserPlus size={20} />
            <span>Client Access</span>
            {clientRegistrations.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-cyan-500 text-white rounded-full text-xs">
                {clientRegistrations.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Bulk Upload Products</h2>
              <p className="text-gray-400 mb-6">Upload multiple images at once - product names will be automatically generated from filenames</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleBulkUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Multiple Images
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setBulkFiles(e.target.files)}
                      className="hidden"
                      id="bulk-file-upload"
                    />
                    <label
                      htmlFor="bulk-file-upload"
                      className="flex items-center space-x-2 px-6 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-gray-300 hover:border-cyan-400 cursor-pointer transition-colors"
                    >
                      <Upload size={20} />
                      <span>{bulkFiles ? `${bulkFiles.length} files selected` : 'Choose Multiple Images'}</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bulkUploading}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-800 transition-all disabled:opacity-50"
                >
                  <Upload size={20} />
                  <span>{bulkUploading ? 'Uploading...' : 'Upload All'}</span>
                </button>
              </form>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Add Single Product</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center space-x-2 px-6 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-gray-300 hover:border-cyan-400 cursor-pointer transition-colors"
                    >
                      <Upload size={20} />
                      <span>{selectedFile ? selectedFile.name : 'Choose Image'}</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-800 transition-all disabled:opacity-50"
                >
                  <Plus size={20} />
                  <span>{uploading ? 'Adding...' : 'Add Product'}</span>
                </button>
              </form>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Existing Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-900/50 rounded-xl border border-cyan-500/20 overflow-hidden"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
                        <ImageIcon className="text-gray-600" size={48} />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.image_url)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors w-full justify-center"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brochures' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Brochure Requests</h2>
            <p className="text-gray-400 mb-6">
              Customer requests for product brochures and catalogues
            </p>

            {brochureRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No brochure requests yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-500/20">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Company</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Country</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brochureRequests.map((request) => (
                      <tr key={request.id} className="border-b border-cyan-500/10 hover:bg-slate-900/30">
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-white">{request.name}</td>
                        <td className="py-4 px-4 text-cyan-400">
                          <a href={`mailto:${request.email}`} className="hover:underline">
                            {request.email}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {request.company || <span className="text-gray-600">-</span>}
                        </td>
                        <td className="py-4 px-4 text-gray-300">{request.country}</td>
                        <td className="py-4 px-4 text-gray-300">{request.contact_number}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                            {request.category_name}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Customize Website Colors</h2>
            <p className="text-gray-400 mb-8">
              Change the accent colors used throughout your website
            </p>

            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Primary Color (Main Accents)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={colors.primary_color}
                    onChange={(e) => setColors({ ...colors, primary_color: e.target.value })}
                    className="h-12 w-20 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colors.primary_color}
                    onChange={(e) => setColors({ ...colors, primary_color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Secondary Color (Gradients)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={colors.secondary_color}
                    onChange={(e) => setColors({ ...colors, secondary_color: e.target.value })}
                    className="h-12 w-20 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colors.secondary_color}
                    onChange={(e) => setColors({ ...colors, secondary_color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Accent Color (Highlights)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={colors.accent_color}
                    onChange={(e) => setColors({ ...colors, accent_color: e.target.value })}
                    className="h-12 w-20 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colors.accent_color}
                    onChange={(e) => setColors({ ...colors, accent_color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-white font-semibold mb-4">Preview</h3>
                <div
                  className="p-6 rounded-xl"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary_color}, ${colors.secondary_color})`,
                  }}
                >
                  <p className="text-white font-bold text-lg">Sample Gradient Background</p>
                  <p className="text-white/80">This shows how your colors will look</p>
                </div>
              </div>

              <button
                onClick={handleSaveColors}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-800 transition-all"
              >
                <Save size={20} />
                <span>Save Colors</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
            <div className="mb-6 rounded-xl border border-cyan-500/20 bg-slate-900/40 p-4">
              <h3 className="text-lg font-semibold text-white">Create Admin Access (No Email Required)</h3>
              <p className="mt-1 text-sm text-gray-400">
                Use this when invite/reset emails are rate-limited. Share the generated password securely.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(event) => setNewAdminEmail(event.target.value)}
                  placeholder="newadmin@leeukopf.com"
                  className="rounded-lg border border-cyan-500/20 bg-slate-900/50 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={newAdminPassword}
                  onChange={(event) => setNewAdminPassword(event.target.value)}
                  placeholder="Optional password (auto-generated if empty)"
                  className="rounded-lg border border-cyan-500/20 bg-slate-900/50 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateAdminAccount}
                  disabled={creatingAdmin}
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-700 px-4 py-2 font-medium text-white hover:from-cyan-400 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingAdmin ? 'Creating...' : 'Create Admin Now'}
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Client Access Approvals</h2>
                <p className="text-gray-400">
                  Approve a registration and send the portal invitation email in one click.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Showing registrations from {clientRegistrationsWindowLabel} to today.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackfillClientRegistrations}
                  disabled={backfillingClients || refreshingClients}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-gray-200 hover:border-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{backfillingClients ? 'Backfilling...' : 'Backfill from Google Sheets'}</span>
                </button>
                <button
                  type="button"
                  onClick={refreshClientAccess}
                  disabled={refreshingClients || backfillingClients}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-gray-200 hover:border-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={16} className={refreshingClients ? 'animate-spin' : ''} />
                  <span>{refreshingClients ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {clientRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No client registrations yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-500/20">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Company</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Country</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Business Type</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientRegistrations.map((registration) => {
                      const isApproved = approvedEmails.has(registration.email.toLowerCase());
                      return (
                        <tr key={registration.id} className="border-b border-cyan-500/10 hover:bg-slate-900/30">
                          <td className="py-4 px-4 text-gray-400 text-sm">
                            {new Date(registration.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-white">{registration.company}</td>
                          <td className="py-4 px-4 text-gray-300">{registration.contact}</td>
                          <td className="py-4 px-4 text-cyan-400">
                            <a href={`mailto:${registration.email}`} className="hover:underline">
                              {registration.email}
                            </a>
                          </td>
                          <td className="py-4 px-4 text-gray-300">{registration.country}</td>
                          <td className="py-4 px-4 text-gray-300">{registration.business_type ?? '-'}</td>
                          <td className="py-4 px-4">
                            {isApproved ? (
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">Approved</span>
                            ) : (
                              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm">Pending</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleApproveAndInvite(registration)}
                              disabled={invitingEmail === registration.email}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-cyan-400 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {invitingEmail === registration.email
                                ? 'Processing...'
                                : isApproved
                                  ? 'Resend Invite / Get Manual Link'
                                  : 'Approve / Activate Access'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {manualInviteLink ? (
              <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-500/10 p-4">
                <p className="text-amber-200 text-sm font-medium">Manual invite link generated:</p>
                <a
                  href={manualInviteLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-cyan-300 hover:text-cyan-200 text-sm"
                >
                  {manualInviteLink}
                </a>
              </div>
            ) : null}

            <div className="mt-10 border-t border-cyan-500/20 pt-8">
              <h3 className="text-xl font-bold text-white mb-2">Completed B2B Orders</h3>
              <p className="text-gray-400 mb-4">
                Stored orders are visible here even if email delivery fails.
              </p>

              {completedOrders.length === 0 ? (
                <div className="text-center py-10 border border-cyan-500/10 rounded-xl bg-slate-900/30">
                  <p className="text-gray-400">No completed B2B orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyan-500/20">
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Submitted</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Company</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Contact Email</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Qty</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Lines</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Email Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedOrders.map((order) => (
                        <tr key={order.order_id} className="border-b border-cyan-500/10 hover:bg-slate-900/30">
                          <td className="py-4 px-4 text-gray-400 text-sm">
                            {new Date(order.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-white font-mono text-xs">{order.order_id}</td>
                          <td className="py-4 px-4 text-gray-300">{order.company_name}</td>
                          <td className="py-4 px-4 text-cyan-400">
                            <a href={`mailto:${order.contact_email}`} className="hover:underline">
                              {order.contact_email}
                            </a>
                          </td>
                          <td className="py-4 px-4 text-gray-300">{order.total_qty}</td>
                          <td className="py-4 px-4 text-gray-300">{order.line_count}</td>
                          <td className="py-4 px-4">
                            {order.email_sent ? (
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">Sent</span>
                            ) : (
                              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm" title={order.email_error || undefined}>
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
