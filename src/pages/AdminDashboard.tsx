import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdminStaff } from '../contexts/AdminStaffContext';
import { supabase, ProductCategory, Product, BrochureRequest } from '../lib/supabase';
import { Upload, LogOut, Image as ImageIcon, Palette, Plus, Trash2, Save, FileText, UserPlus, RefreshCw, ChevronDown, ChevronUp, Users, Shield, KeyRound, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';

interface ClientRegistrationLead {
  id: string;
  company: string;
  contact: string;
  role?: string;
  email: string;
  phone?: string;
  country: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  business_type: string;
  client_type?: string;
  interest_distribution?: boolean;
  interest_private_label?: boolean;
  interest_influencer?: boolean;
  interests?: string[] | string;
  monthly_volume?: string;
  vat_eori?: string;
  billing_address?: string;
  shipping_address?: string;
  language?: string;
  notes?: string;
  // Distributor fields
  countries_covered?: string;
  distribution_channels?: string;
  estimated_monthly_volume?: string;
  years_in_business?: string;
  // Private Label fields
  brand_name?: string;
  product_interest?: string;
  target_moq?: string;
  target_launch_date?: string;
  // Influencer fields
  country_audience?: string;
  avg_views?: string;
  // Portal tier (gated by view_prices permission)
  buyer_type?: string;
  price_tier?: string;
  // CRM fields
  pipeline_stage?: string;
  samples_sent_at?: string;
  last_contact_date?: string;
  admin_notes?: string;
  created_at: string;
}

interface OrderLineItem {
  code: string;
  product_name?: string;
  name?: string;
  size?: string;
  unit?: string;
  quantity?: number;
  qty?: number;
  moq?: string;
}

interface CompletedB2BOrder {
  order_id: string;
  status: string;
  order_date: string | null;
  company_name: string;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  country: string | null;
  vat_number: string | null;
  shipping_address: string | null;
  line_count: number;
  total_qty: number;
  items: OrderLineItem[] | null;
  email_sent: boolean;
  email_error: string | null;
  created_at: string;
}

interface SiteSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

interface AdminStaffMember {
  id: string;
  email: string;
  full_name?: string;
  role: 'owner' | 'staff';
  permissions: {
    view_clients: boolean;
    approve_registrations: boolean;
    view_orders: boolean;
    view_prices: boolean;
    manage_products: boolean;
    manage_colors: boolean;
    manage_brochures: boolean;
  };
  is_active: boolean;
  created_at: string;
  created_by?: string;
}

const ALL_PERMISSIONS: AdminStaffMember['permissions'] = {
  view_clients: true,
  approve_registrations: true,
  view_orders: true,
  view_prices: true,
  manage_products: true,
  manage_colors: true,
  manage_brochures: true,
};

const DEFAULT_STAFF_PERMISSIONS: AdminStaffMember['permissions'] = {
  view_clients: true,
  approve_registrations: true,
  view_orders: true,
  view_prices: false,
  manage_products: false,
  manage_colors: false,
  manage_brochures: false,
};

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

const PIPELINE_STAGES = [
  { value: 'new',          label: 'New Lead',         cls: 'bg-slate-600 text-white ring-slate-300' },
  { value: 'contacted',    label: 'Contacted',        cls: 'bg-blue-600 text-white ring-blue-300' },
  { value: 'samples_sent', label: 'Samples Sent',     cls: 'bg-amber-500 text-slate-950 ring-amber-200' },
  { value: 'feedback',     label: 'Feedback',         cls: 'bg-orange-500 text-slate-950 ring-orange-200' },
  { value: 'negotiating',  label: 'Negotiating',      cls: 'bg-purple-600 text-white ring-purple-300' },
  { value: 'approved',     label: 'Approved',         cls: 'bg-emerald-600 text-white ring-emerald-300' },
  { value: 'rejected',     label: 'Rejected',         cls: 'bg-red-600 text-white ring-red-300' },
  { value: 'on_hold',      label: 'On Hold',          cls: 'bg-slate-500 text-white ring-slate-300' },
];

function getPipelineStage(value: string | undefined) {
  return PIPELINE_STAGES.find((s) => s.value === (value || 'new')) ?? PIPELINE_STAGES[0];
}

export default function AdminDashboard() {
  const { signOut, user, session } = useAuth();
  const adminStaff = useAdminStaff();
  const [activeTab, setActiveTab] = useState<'products' | 'colors' | 'brochures' | 'clients' | 'staff'>('products');
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [brochureRequests, setBrochureRequests] = useState<BrochureRequest[]>([]);
  const [clientRegistrations, setClientRegistrations] = useState<ClientRegistrationLead[]>([]);
  const [completedOrders, setCompletedOrders] = useState<CompletedB2BOrder[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedRegistrationId, setExpandedRegistrationId] = useState<string | null>(null);
  const [crmEdits, setCrmEdits] = useState<Record<string, { pipeline_stage: string; admin_notes: string; samples_sent_at: string; last_contact_date: string; }>>({});
  const [savingCrm, setSavingCrm] = useState<string | null>(null);
  const [resendingOrders, setResendingOrders] = useState(false);

  const handleResendAllOrders = async () => {
    if (!session?.access_token) return;
    if (!window.confirm('Resend all stored orders to info@leeukopf.com?')) return;
    setResendingOrders(true);
    try {
      const response = await fetch('/api/admin-resend-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ to: 'info@leeukopf.com' }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string; sent?: number; total?: number; errors?: string[] };
      const msg = payload.message || (payload.success ? 'Done.' : 'Failed.');
      const detail = payload.errors?.length ? `\n\nErrors:\n${payload.errors.slice(0, 5).join('\n')}` : '';
      window.alert(msg + detail);
      setMessage(msg);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to resend orders.';
      window.alert(msg);
      setMessage(msg);
    } finally {
      setResendingOrders(false);
    }
  };

  const handleToggleRegistration = (registration: ClientRegistrationLead) => {
    const id = registration.id;
    setExpandedRegistrationId((prev) => (prev === id ? null : id));
    setCrmEdits((prev) => ({
      ...prev,
      [id]: prev[id] ?? {
        pipeline_stage: registration.pipeline_stage || 'new',
        admin_notes: registration.admin_notes || '',
        samples_sent_at: registration.samples_sent_at || '',
        last_contact_date: registration.last_contact_date || '',
      },
    }));
  };

  const handleSaveCRM = async (id: string) => {
    if (!session?.access_token) return;
    setSavingCrm(id);
    try {
      const edits = crmEdits[id];
      const response = await fetch('/api/admin-update-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ id, ...edits }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message || 'Save failed.');
      setClientRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, ...edits } : r));
      setMessage(payload.message || 'CRM record saved.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSavingCrm(null);
    }
  };

  const handleExportCSV = () => {
    const csvHeaders = ['Date','Company','Contact','Role','Email','Phone','Country','Business Type','Client Type','Pipeline Stage','Interests','Monthly Volume','VAT/EORI','Website','Instagram','Facebook','TikTok','Billing Address','Shipping Address','Countries Covered','Distrib. Channels','Est. Monthly Vol','Years in Business','Brand Name','Product Interest','Target MOQ','Launch Date','Country/Audience','Avg Views','Samples Sent','Last Contact','Admin Notes'];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = clientRegistrations.map((r) => [
      new Date(r.created_at).toLocaleDateString(),
      r.company, r.contact, r.role || '', r.email, r.phone || '', r.country,
      r.business_type, r.client_type || '',
      getPipelineStage(r.pipeline_stage).label,
      Array.isArray(r.interests) ? r.interests.join('; ') : r.interests || '',
      r.monthly_volume || '', r.vat_eori || '', r.website || '',
      r.instagram || '', r.facebook || '', r.tiktok || '',
      r.billing_address || '', r.shipping_address || '',
      r.countries_covered || '', r.distribution_channels || '',
      r.estimated_monthly_volume || '', r.years_in_business || '',
      r.brand_name || '', r.product_interest || '', r.target_moq || '', r.target_launch_date || '',
      r.country_audience || '', r.avg_views || '',
      r.samples_sent_at || '', r.last_contact_date || '', r.admin_notes || '',
    ].map(esc));
    const csv = [csvHeaders.map(esc).join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `client-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRegistrationPDF = (registration: ClientRegistrationLead) => {
    const interestsDisplay = Array.isArray(registration.interests)
      ? registration.interests.join(', ')
      : typeof registration.interests === 'string'
      ? registration.interests
      : '';
    const clientTypeBadges: string[] = [];
    if (registration.interest_distribution) clientTypeBadges.push('Distributor');
    if (registration.interest_private_label) clientTypeBadges.push('Private Label');
    if (registration.interest_influencer) clientTypeBadges.push('Influencer');
    if (clientTypeBadges.length === 0 && registration.client_type) {
      const ct = registration.client_type;
      if (ct === 'Distributors') clientTypeBadges.push('Distributor');
      else if (ct === 'PrivateLabel') clientTypeBadges.push('Private Label');
      else if (ct === 'Influencers') clientTypeBadges.push('Influencer');
      else clientTypeBadges.push(ct);
    }
    const field = (label: string, value: string | undefined | null) =>
      value ? `<tr><td class="lbl">${label}</td><td class="val">${value.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td></tr>` : '';
    const section = (title: string, rows: string) =>
      rows.trim() ? `<section><h2>${title}</h2><table>${rows}</table></section>` : '';
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Registration – ${registration.company}</title>
<style>
  body{font-family:Arial,sans-serif;font-size:12px;color:#111;margin:36px}
  h1{font-size:22px;margin:0 0 4px}
  .sub{color:#666;font-size:12px;margin-bottom:18px}
  .badge{display:inline-block;padding:2px 10px;border-radius:4px;font-size:11px;font-weight:700;margin-right:4px;background:#e8f0fe;color:#1a56db;border:1px solid #c3d4f7}
  section{margin-bottom:18px}
  h2{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#555;border-bottom:1px solid #ddd;padding-bottom:3px;margin:0 0 8px}
  table{width:100%;border-collapse:collapse}
  td{padding:4px 8px;vertical-align:top}
  td.lbl{width:38%;color:#666;font-weight:700;font-size:11px}
  td.val{color:#111}
  .notes{white-space:pre-wrap;background:#f9f9f9;border:1px solid #eee;padding:8px;border-radius:4px}
  @media print{body{margin:20px}}
</style></head><body>
<h1>${registration.company}</h1>
<div class="sub">Client Registration &nbsp;·&nbsp; Submitted ${new Date(registration.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
${clientTypeBadges.map(b => `<span class="badge">${b}</span>`).join('')}
${section('Contact Information', [
  field('Contact Name', registration.contact),
  field('Role / Title', registration.role),
  field('Email', registration.email),
  field('Phone', registration.phone),
  field('Country', registration.country),
  field('Language', registration.language),
].join(''))}
${section('Business Details', [
  field('Business Type', registration.business_type),
  field('VAT / EORI', registration.vat_eori),
  field('Monthly Volume', registration.monthly_volume),
  field('Product Interests', interestsDisplay),
  field('Website', registration.website),
].join(''))}
${section('Social Media', [
  field('Instagram', registration.instagram),
  field('Facebook', registration.facebook),
  field('TikTok', registration.tiktok),
].join(''))}
${section('Addresses', [
  field('Billing Address', registration.billing_address),
  field('Shipping Address', registration.shipping_address),
].join(''))}
${section('Distributor Details', [
  field('Countries Covered', registration.countries_covered),
  field('Distribution Channels', registration.distribution_channels),
  field('Est. Monthly Volume', registration.estimated_monthly_volume),
  field('Years in Business', registration.years_in_business),
].join(''))}
${section('Private Label Details', [
  field('Brand Name', registration.brand_name),
  field('Product Interest', registration.product_interest),
  field('Target MOQ', registration.target_moq),
  field('Target Launch Date', registration.target_launch_date),
].join(''))}
${section('Influencer Details', [
  field('Country / Audience', registration.country_audience),
  field('Avg Views / Engagement', registration.avg_views),
].join(''))}
${registration.notes ? `<section><h2>Notes / Requirements</h2><p class="notes">${registration.notes.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p></section>` : ''}
<script>window.onload=function(){window.print();}</script>
</body></html>`;
    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); }
  };
  const [approvedEmails, setApprovedEmails] = useState<Set<string>>(() => getStoredApprovedEmails());
  const [invitingEmail, setInvitingEmail] = useState<string | null>(null);
  const [manualInviteLink, setManualInviteLink] = useState('');
  const [clientAccessEmail, setClientAccessEmail] = useState('');
  const [clientAccessPassword, setClientAccessPassword] = useState('');
  const [updatingClientAccess, setUpdatingClientAccess] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // ── Staff management state (owner only) ──────────────────────────────────
  const [staffList, setStaffList] = useState<AdminStaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffPermissions, setNewStaffPermissions] = useState<AdminStaffMember['permissions']>({ ...DEFAULT_STAFF_PERMISSIONS });
  const [addingStaff, setAddingStaff] = useState(false);
  const [resetPwdStaffId, setResetPwdStaffId] = useState<string | null>(null);
  const [resetPwdValue, setResetPwdValue] = useState('');
  const [resettingPwd, setResettingPwd] = useState(false);
  const [editingPermsId, setEditingPermsId] = useState<string | null>(null);
  const [editingPerms, setEditingPerms] = useState<AdminStaffMember['permissions']>({ ...DEFAULT_STAFF_PERMISSIONS });
  const [savingPerms, setSavingPerms] = useState(false);
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
      const response = await fetch('/api/admin-client-registrations', {
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
  }, [session?.access_token]);

  const handleBackfillClientRegistrations = useCallback(async () => {
    if (!session?.access_token) {
      setMessage('Missing admin session. Please sign in again.');
      return;
    }

    setBackfillingClients(true);
    try {
      const response = await fetch('/api/admin-client-registrations-backfill', {
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
  }, [loadClientRegistrations, session?.access_token]);

  const loadApprovedClients = useCallback(async () => {
    const { data, error } = await supabase
      .from('approved_clients')
      .select('email');

    const stored = getStoredApprovedEmails();

    const approvedTableMissing = Boolean(
      error?.message?.toLowerCase().includes("could not find the table 'public.approved_clients'")
    );

    if (error && !approvedTableMissing) {
      console.error('Failed to load approved clients:', error);
      setApprovedEmails(stored);
      return;
    }

    if (approvedTableMissing) {
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

  // Auto-switch to the first permitted tab when permissions are loaded
  useEffect(() => {
    const tabAccessMap: Record<string, boolean> = {
      products: adminStaff.canDo('manage_products'),
      brochures: adminStaff.canDo('manage_brochures'),
      colors: adminStaff.canDo('manage_colors'),
      clients: adminStaff.canDo('view_clients'),
      staff: adminStaff.isOwner,
    };
    if (!tabAccessMap[activeTab]) {
      const first = Object.entries(tabAccessMap).find(([, ok]) => ok)?.[0];
      if (first) setActiveTab(first as typeof activeTab);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminStaff.role]);

  // ── Staff management (owner only) ────────────────────────────────────────
  const loadStaff = useCallback(async () => {
    if (!session?.access_token) return;
    setLoadingStaff(true);
    try {
      const response = await fetch('/api/admin-list-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      });
      const payload = (await response.json()) as { success?: boolean; data?: AdminStaffMember[]; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message || 'Failed to load staff.');
      setStaffList(payload.data ?? []);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load staff.');
    } finally {
      setLoadingStaff(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (activeTab === 'staff' && adminStaff.isOwner) {
      void loadStaff();
    }
  }, [activeTab, adminStaff.isOwner, loadStaff]);

  const handleAddStaff = async () => {
    if (!session?.access_token) return;
    const email = newStaffEmail.trim().toLowerCase();
    if (!email) { setMessage('Enter a staff email address.'); return; }
    const password = newStaffPassword.trim();
    if (!password || password.length < 8) { setMessage('Password must be at least 8 characters.'); return; }

    setAddingStaff(true);
    try {
      const response = await fetch('/api/admin-create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          email,
          password,
          fullName: newStaffName.trim() || undefined,
          permissions: newStaffPermissions,
          addToStaff: true,
        }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string; data?: { temporaryPassword?: string } };
      if (!response.ok || !payload.success) throw new Error(payload.message || 'Failed to add staff.');
      const returnedPwd = payload.data?.temporaryPassword || password;
      setMessage(`Staff added. Login: ${email} / ${returnedPwd}`);
      setNewStaffEmail('');
      setNewStaffName('');
      setNewStaffPassword('');
      setNewStaffPermissions({ ...DEFAULT_STAFF_PERMISSIONS });
      await loadStaff();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to add staff.');
    } finally {
      setAddingStaff(false);
    }
  };

  const handleResetStaffPassword = async (staffId: string) => {
    if (!session?.access_token) return;
    const newPwd = resetPwdValue.trim();
    if (!newPwd || newPwd.length < 8) { setMessage('New password must be at least 8 characters.'); return; }
    setResettingPwd(true);
    try {
      const response = await fetch('/api/admin-update-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'reset_password', staffId, newPassword: newPwd }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message || 'Failed to reset password.');
      setMessage(payload.message || 'Password reset.');
      setResetPwdStaffId(null);
      setResetPwdValue('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to reset password.');
    } finally {
      setResettingPwd(false);
    }
  };

  const handleSaveStaffPermissions = async (staffId: string) => {
    if (!session?.access_token) return;
    setSavingPerms(true);
    try {
      const response = await fetch('/api/admin-update-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'update_permissions', staffId, permissions: editingPerms }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message || 'Failed to save permissions.');
      setMessage('Permissions saved.');
      setEditingPermsId(null);
      setStaffList((prev) => prev.map((s) => s.id === staffId ? { ...s, permissions: { ...editingPerms } } : s));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to save permissions.');
    } finally {
      setSavingPerms(false);
    }
  };

  const handleToggleStaffActive = async (staffId: string, currentActive: boolean) => {
    if (!session?.access_token) return;
    try {
      const response = await fetch('/api/admin-update-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'toggle_active', staffId }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string; is_active?: boolean };
      if (!response.ok || !payload.success) throw new Error(payload.message || 'Failed.');
      setMessage(payload.message || 'Done.');
      setStaffList((prev) => prev.map((s) => s.id === staffId ? { ...s, is_active: !currentActive } : s));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Action failed.');
    }
  };

  const handleDeleteStaff = async (staffId: string, email: string) => {
    if (!window.confirm(`Remove ${email} from staff? This only removes portal access, not their login account.`)) return;
    if (!session?.access_token) return;
    try {
      const response = await fetch('/api/admin-update-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'delete', staffId }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message || 'Failed.');
      setMessage(payload.message || 'Staff removed.');
      setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to remove staff.');
    }
  };

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

  const handleCreateOrResetClientAccess = async () => {
    if (!session?.access_token) {
      setMessage('Missing admin session. Please sign in again.');
      return;
    }

    const normalizedEmail = clientAccessEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setMessage('Enter a client email for access reset.');
      return;
    }

    setUpdatingClientAccess(true);
    try {
      const response = await fetch('/api/admin-client-access-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: clientAccessPassword.trim() || undefined,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: { temporaryPassword?: string };
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to reset client access.');
      }

      const returnedPassword = payload.data?.temporaryPassword || clientAccessPassword.trim();
      setMessage(
        returnedPassword
          ? `${payload.message} Temporary password: ${returnedPassword}`
          : (payload.message || 'Client access updated.')
      );
      setClientAccessEmail('');
      setClientAccessPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to reset client access.');
    } finally {
      setUpdatingClientAccess(false);
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
            <a
              href="/b2b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 text-cyan-300 rounded-lg hover:bg-slate-700/50 transition-colors border border-cyan-500/20"
            >
              <ExternalLink size={16} />
              <span>View Portal</span>
            </a>
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

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
            {message}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          {adminStaff.canDo('manage_products') && (
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
          )}
          {adminStaff.canDo('manage_brochures') && (
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
          )}
          {adminStaff.canDo('manage_colors') && (
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
          )}
          {adminStaff.canDo('view_clients') && (
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
          )}
          {adminStaff.isOwner && (
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'staff'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-700 text-white'
                  : 'bg-slate-800/50 text-gray-300 border border-purple-500/20'
              }`}
            >
              <Users size={20} />
              <span>Staff</span>
              {staffList.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-purple-500 text-white rounded-full text-xs">
                  {staffList.length}
                </span>
              )}
            </button>
          )}
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
            {adminStaff.canDo('approve_registrations') && (
            <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <h3 className="text-lg font-semibold text-white">Client Portal Access Recovery (No Email Required)</h3>
              <p className="mt-1 text-sm text-gray-300">
                Use this when client login reset emails are rate-limited. It creates or resets the client password immediately.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <input
                  type="email"
                  value={clientAccessEmail}
                  onChange={(event) => setClientAccessEmail(event.target.value)}
                  placeholder="client@company.com"
                  className="rounded-lg border border-cyan-500/20 bg-slate-900/50 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={clientAccessPassword}
                  onChange={(event) => setClientAccessPassword(event.target.value)}
                  placeholder="Optional password (auto-generated if empty)"
                  className="rounded-lg border border-cyan-500/20 bg-slate-900/50 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateOrResetClientAccess}
                  disabled={updatingClientAccess}
                  className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 font-medium text-white hover:from-amber-400 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updatingClientAccess ? 'Updating...' : 'Reset Client Access Now'}
                </button>
              </div>
            </div>
            )}

            {adminStaff.isOwner && (
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
              <p className="mt-2 text-xs text-amber-400">Note: Use the Staff tab to add team members with controlled permissions instead.</p>
            </div>
            )}

            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Client Access Approvals</h2>
                <p className="text-gray-400">
                  Approve registrations and direct portal signups from one place.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Showing all registrations and portal signups.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={clientRegistrations.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-emerald-300 hover:border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ↓ Export CSV
                </button>
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
                <table className="w-full min-w-[1200px]">
                  <thead>
                    <tr className="border-b border-cyan-500/20">
                      <th className="py-3 px-2 w-8"></th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Company</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Country</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Client Type</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Pipeline</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Portal Access</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientRegistrations.flatMap((registration) => {
                      const isApproved = approvedEmails.has(registration.email.toLowerCase());
                      const isExpanded = expandedRegistrationId === registration.id;
                      const interestsDisplay = Array.isArray(registration.interests)
                        ? registration.interests.join(', ')
                        : typeof registration.interests === 'string'
                        ? registration.interests
                        : '';

                      // Build client type badges from interest flags or client_type field
                      const clientTypeBadges: string[] = [];
                      if (registration.interest_distribution) clientTypeBadges.push('Distributor');
                      if (registration.interest_private_label) clientTypeBadges.push('Private Label');
                      if (registration.interest_influencer) clientTypeBadges.push('Influencer');
                      // Fallback: derive from client_type string if booleans not set
                      if (clientTypeBadges.length === 0 && registration.client_type) {
                        const ct = registration.client_type;
                        if (ct === 'Distributors') clientTypeBadges.push('Distributor');
                        else if (ct === 'PrivateLabel') clientTypeBadges.push('Private Label');
                        else if (ct === 'Influencers') clientTypeBadges.push('Influencer');
                        else clientTypeBadges.push(ct);
                      }
                      const rows = [
                        <tr
                          key={registration.id}
                          className={`border-b border-cyan-500/10 hover:bg-slate-900/30 cursor-pointer transition-colors ${
                            isExpanded ? 'bg-slate-900/40' : ''
                          }`}
                          onClick={() => handleToggleRegistration(registration)}
                        >
                          <td className="py-4 px-2 text-center text-gray-500">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </td>
                          <td className="py-4 px-4 text-gray-400 text-sm">
                            {new Date(registration.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-white">{registration.company}</td>
                          <td className="py-4 px-4 text-gray-300">{registration.contact}</td>
                          <td className="py-4 px-4 text-cyan-400">
                            <a
                              href={`mailto:${registration.email}`}
                              className="hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {registration.email}
                            </a>
                          </td>
                          <td className="py-4 px-4 text-gray-300">{registration.country}</td>
                          <td className="py-4 px-4">
                            {clientTypeBadges.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {clientTypeBadges.map((badge) => (
                                  <span
                                    key={badge}
                                    className={
                                      badge === 'Distributor'
                                        ? 'px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs font-medium'
                                        : badge === 'Private Label'
                                        ? 'px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs font-medium'
                                        : 'px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded text-xs font-medium'
                                    }
                                  >
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-sm">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {(() => { const ps = getPipelineStage(registration.pipeline_stage); return <span className={`inline-flex px-3 py-1.5 rounded-lg text-base font-bold ring-2 ring-inset ${ps.cls}`}>{ps.label}</span>; })()}
                          </td>
                          <td className="py-4 px-4">
                            {isApproved ? (
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">Approved</span>
                            ) : (
                              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm">Pending</span>
                            )}
                          </td>
                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            {adminStaff.canDo('approve_registrations') ? (
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
                            ) : (
                              <span className="text-xs text-gray-600 italic">No permission</span>
                            )}
                          </td>
                        </tr>,
                      ];
                      if (isExpanded) {
                        rows.push(
                          <tr key={`${registration.id}-detail`} className="bg-slate-900/40 border-b border-cyan-500/10">
                            <td colSpan={10} className="px-6 pb-6 pt-2">
                              {/* CRM SECTION */}
                              <div className="rounded-xl border-2 border-cyan-300 bg-gradient-to-br from-cyan-950/90 via-slate-900 to-blue-950/90 p-6 mb-4 shadow-lg shadow-cyan-950/30">
                                <p className="text-lg text-cyan-200 uppercase tracking-wide font-bold mb-5">CRM — Pipeline & Tracking</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                                  <div>
                                    <label className="block text-base text-cyan-100 font-bold mb-2">Pipeline Stage</label>
                                    <select
                                      value={crmEdits[registration.id]?.pipeline_stage ?? registration.pipeline_stage ?? 'new'}
                                      onChange={(e) => setCrmEdits((prev) => ({ ...prev, [registration.id]: { ...prev[registration.id], pipeline_stage: e.target.value } }))}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-full px-4 py-3 bg-white border-2 border-cyan-300 rounded-lg text-slate-950 text-base font-semibold focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300"
                                    >
                                      {PIPELINE_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-base text-cyan-100 font-bold mb-2">Samples Sent</label>
                                    <input
                                      type="date"
                                      value={crmEdits[registration.id]?.samples_sent_at ?? registration.samples_sent_at ?? ''}
                                      onChange={(e) => setCrmEdits((prev) => ({ ...prev, [registration.id]: { ...prev[registration.id], samples_sent_at: e.target.value } }))}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-full px-4 py-3 bg-white border-2 border-cyan-300 rounded-lg text-slate-950 text-base font-semibold focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-base text-cyan-100 font-bold mb-2">Last Contact</label>
                                    <input
                                      type="date"
                                      value={crmEdits[registration.id]?.last_contact_date ?? registration.last_contact_date ?? ''}
                                      onChange={(e) => setCrmEdits((prev) => ({ ...prev, [registration.id]: { ...prev[registration.id], last_contact_date: e.target.value } }))}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-full px-4 py-3 bg-white border-2 border-cyan-300 rounded-lg text-slate-950 text-base font-semibold focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300"
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleSaveCRM(registration.id); }}
                                      disabled={savingCrm === registration.id}
                                      className="w-full px-5 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-lg text-base font-bold hover:from-cyan-300 hover:to-blue-500 disabled:opacity-50 shadow-md"
                                    >
                                      {savingCrm === registration.id ? 'Saving...' : 'Save Changes'}
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-base text-cyan-100 font-bold mb-2">Admin Notes (internal, not visible to client)</label>
                                  <textarea
                                    rows={5}
                                    value={crmEdits[registration.id]?.admin_notes ?? registration.admin_notes ?? ''}
                                    onChange={(e) => setCrmEdits((prev) => ({ ...prev, [registration.id]: { ...prev[registration.id], admin_notes: e.target.value } }))}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Add internal notes, feedback, follow-up reminders..."
                                    className="w-full px-4 py-3 bg-white border-2 border-cyan-300 rounded-lg text-slate-950 text-base leading-relaxed focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 resize-y"
                                  />
                                  <p className="mt-2 text-sm font-semibold text-cyan-100">
                                    Updated comments are emailed to acc1.leeukopf@gmail.com and leeukopf@gmail.com when saved.
                                  </p>
                                </div>
                              </div>

                              {/* LINKED ORDERS — gated by view_orders permission */}
                              {adminStaff.canDo('view_orders') && (() => {
                                const clientOrders = completedOrders.filter(
                                  (o) => o.contact_email.toLowerCase() === registration.email.toLowerCase()
                                );
                                if (clientOrders.length === 0) return null;
                                return (
                                  <div className="rounded-lg border border-cyan-500/20 bg-slate-900/40 p-4 mb-4">
                                    <p className="text-xs text-amber-400 uppercase tracking-wide font-semibold mb-3">Orders ({clientOrders.length})</p>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b border-cyan-500/10">
                                            <th className="text-left py-2 px-3 text-gray-400 font-medium text-xs">Order ID</th>
                                            <th className="text-left py-2 px-3 text-gray-400 font-medium text-xs">Date</th>
                                            <th className="text-left py-2 px-3 text-gray-400 font-medium text-xs">Status</th>
                                            <th className="text-right py-2 px-3 text-gray-400 font-medium text-xs">Units</th>
                                            <th className="text-right py-2 px-3 text-gray-400 font-medium text-xs">Lines</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {clientOrders.map((o) => (
                                            <tr key={o.order_id} className="border-b border-cyan-500/5">
                                              <td className="py-2 px-3 text-cyan-300 font-mono text-xs">{o.order_id}</td>
                                              <td className="py-2 px-3 text-gray-400">{o.order_date ? new Date(o.order_date).toLocaleDateString() : '—'}</td>
                                              <td className="py-2 px-3 text-gray-300">{o.status}</td>
                                              <td className="py-2 px-3 text-white text-right">{o.total_qty}</td>
                                              <td className="py-2 px-3 text-gray-300 text-right">{o.line_count}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* PORTAL TIERS — gated by view_prices permission */}
                              {adminStaff.canDo('view_prices') && (registration.buyer_type || registration.price_tier) && (
                                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 mb-4">
                                  <p className="text-xs text-emerald-400 uppercase tracking-wide font-semibold mb-3">Portal Access Tier</p>
                                  <div className="flex flex-wrap gap-4 text-sm">
                                    {registration.buyer_type && (
                                      <div>
                                        <span className="text-gray-500 text-xs uppercase tracking-wide">Buyer Type</span>
                                        <p className="text-gray-200 mt-0.5 capitalize">{registration.buyer_type.replace('_', ' ')}</p>
                                      </div>
                                    )}
                                    {registration.price_tier && (
                                      <div>
                                        <span className="text-gray-500 text-xs uppercase tracking-wide">Price Tier</span>
                                        <p className="text-emerald-300 mt-0.5 font-medium capitalize">{registration.price_tier.replace('_', ' ')}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* FULL REGISTRATION DETAILS */}
                              <div className="rounded-lg border border-cyan-500/20 bg-slate-800/60 p-5">
                                <div className="flex items-center justify-between mb-4">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Registration Details</p>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDownloadRegistrationPDF(registration); }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-medium hover:bg-cyan-500/20 transition-colors"
                                  >
                                    ↓ Download PDF
                                  </button>
                                </div>

                                {/* PRIMARY BUSINESS INFO */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 text-sm mb-4">
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Role / Title</span>
                                    <p className="text-gray-200 mt-0.5">{registration.role || '—'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Phone</span>
                                    <p className="text-gray-200 mt-0.5">{registration.phone || '—'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Monthly Volume</span>
                                    <p className="text-gray-200 mt-0.5">{registration.monthly_volume || '—'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">VAT / EORI</span>
                                    <p className="text-gray-200 mt-0.5">{registration.vat_eori || '—'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Website</span>
                                    <p className="text-gray-200 mt-0.5">
                                      {registration.website ? (
                                        <a href={registration.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline" onClick={(e) => e.stopPropagation()}>{registration.website}</a>
                                      ) : '—'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Language</span>
                                    <p className="text-gray-200 mt-0.5">{registration.language || '—'}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Product Interests</span>
                                    <p className="text-gray-200 mt-0.5">{interestsDisplay || '—'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Billing Address</span>
                                    <p className="text-gray-200 mt-0.5 whitespace-pre-line">{registration.billing_address || '—'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Shipping Address</span>
                                    <p className="text-gray-200 mt-0.5 whitespace-pre-line">{registration.shipping_address || '—'}</p>
                                  </div>
                                  {registration.notes ? (
                                    <div className="col-span-2 lg:col-span-4">
                                      <span className="text-gray-500 text-xs uppercase tracking-wide">Notes / Requirements</span>
                                      <p className="text-gray-200 mt-0.5 whitespace-pre-line">{registration.notes}</p>
                                    </div>
                                  ) : null}
                                </div>

                                {/* DISTRIBUTOR DETAILS — primary focus */}
                                {(registration.countries_covered || registration.distribution_channels || registration.estimated_monthly_volume || registration.years_in_business) ? (
                                  <div className="border-t border-blue-500/20 pt-4 mt-2">
                                    <p className="text-sm text-blue-300 font-semibold mb-3">🔵 Distributor Details</p>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
                                      {registration.countries_covered && <div><span className="text-gray-500 text-xs uppercase tracking-wide">Countries Covered</span><p className="text-gray-200 mt-0.5">{registration.countries_covered}</p></div>}
                                      {registration.distribution_channels && <div><span className="text-gray-500 text-xs uppercase tracking-wide">Distribution Channels</span><p className="text-gray-200 mt-0.5">{registration.distribution_channels}</p></div>}
                                      {registration.estimated_monthly_volume && <div><span className="text-gray-500 text-xs uppercase tracking-wide">Est. Monthly Volume</span><p className="text-gray-200 mt-0.5">{registration.estimated_monthly_volume}</p></div>}
                                      {registration.years_in_business && <div><span className="text-gray-500 text-xs uppercase tracking-wide">Years in Business</span><p className="text-gray-200 mt-0.5">{registration.years_in_business}</p></div>}
                                    </div>
                                  </div>
                                ) : null}

                                {/* PRIVATE LABEL DETAILS — primary focus */}
                                {(registration.brand_name || registration.product_interest || registration.target_moq || registration.target_launch_date) ? (
                                  <div className="border-t border-purple-500/20 pt-4 mt-2">
                                    <p className="text-sm text-purple-300 font-semibold mb-3">🟣 Private Label Details</p>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
                                      {registration.brand_name && <div><span className="text-gray-500 text-xs uppercase tracking-wide">Brand Name</span><p className="text-gray-200 mt-0.5">{registration.brand_name}</p></div>}
                                      {registration.product_interest && <div><span className="text-gray-500 text-xs uppercase tracking-wide">Product Interest</span><p className="text-gray-200 mt-0.5">{registration.product_interest}</p></div>}
                                      {registration.target_moq && <div><span className="text-gray-500 text-xs uppercase tracking-wide">Target MOQ</span><p className="text-gray-200 mt-0.5">{registration.target_moq}</p></div>}
                                      {registration.target_launch_date && <div><span className="text-gray-500 text-xs uppercase tracking-wide">Target Launch Date</span><p className="text-gray-200 mt-0.5">{registration.target_launch_date}</p></div>}
                                    </div>
                                  </div>
                                ) : null}

                                {/* SOCIAL MEDIA + INFLUENCER — collapsed at the bottom, low emphasis */}
                                {(registration.instagram || registration.facebook || registration.tiktok || registration.country_audience || registration.avg_views) ? (
                                  <div className="border-t border-gray-700/50 pt-3 mt-3">
                                    <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-2">Social / Influencer</p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
                                      {registration.instagram && <span><span className="text-gray-600">Instagram:</span> {registration.instagram}</span>}
                                      {registration.facebook && <span><span className="text-gray-600">Facebook:</span> {registration.facebook}</span>}
                                      {registration.tiktok && <span><span className="text-gray-600">TikTok:</span> {registration.tiktok}</span>}
                                      {registration.country_audience && <span><span className="text-gray-600">Audience:</span> {registration.country_audience}</span>}
                                      {registration.avg_views && <span><span className="text-gray-600">Avg Views:</span> {registration.avg_views}</span>}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return rows;
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Completed B2B Orders</h3>
                <button
                  type="button"
                  onClick={handleResendAllOrders}
                  disabled={resendingOrders || completedOrders.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-amber-500/30 rounded-lg text-amber-300 hover:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {resendingOrders ? 'Sending...' : '↻ Resend all to info@leeukopf.com'}
                </button>
              </div>
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
                      {completedOrders.map((order) => {
                        const isExpanded = expandedOrderId === order.order_id;
                        return (
                          <>
                            <tr
                              key={order.order_id}
                              className="border-b border-cyan-500/10 hover:bg-slate-900/30 cursor-pointer"
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.order_id)}
                            >
                              <td className="py-4 px-4 text-gray-400 text-sm">
                                {new Date(order.created_at).toLocaleString()}
                              </td>
                              <td className="py-4 px-4 text-white font-mono text-xs">{order.order_id}</td>
                              <td className="py-4 px-4 text-gray-300">{order.company_name}</td>
                              <td className="py-4 px-4 text-cyan-400">
                                <a href={`mailto:${order.contact_email}`} className="hover:underline" onClick={e => e.stopPropagation()}>
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
                            {isExpanded && (
                              <tr key={`${order.order_id}-detail`} className="bg-slate-900/50">
                                <td colSpan={7} className="px-6 py-5">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                                    <div className="space-y-1 text-sm">
                                      <p className="text-gray-400 font-semibold uppercase text-xs tracking-wider mb-2">Client Details</p>
                                      <p className="text-gray-300"><span className="text-gray-500">Contact:</span> {order.contact_name || '—'}</p>
                                      <p className="text-gray-300"><span className="text-gray-500">Phone:</span> {order.contact_phone || '—'}</p>
                                      <p className="text-gray-300"><span className="text-gray-500">Country:</span> {order.country || '—'}</p>
                                      <p className="text-gray-300"><span className="text-gray-500">VAT:</span> {order.vat_number || '—'}</p>
                                      <p className="text-gray-300"><span className="text-gray-500">Shipping:</span> {order.shipping_address || '—'}</p>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <p className="text-gray-400 font-semibold uppercase text-xs tracking-wider mb-2">Order Info</p>
                                      <p className="text-gray-300"><span className="text-gray-500">Order Date:</span> {order.order_date ? new Date(order.order_date).toLocaleDateString() : '—'}</p>
                                      <p className="text-gray-300"><span className="text-gray-500">Status:</span> {order.status}</p>
                                      <p className="text-gray-300"><span className="text-gray-500">Total Units:</span> {order.total_qty}</p>
                                    </div>
                                  </div>
                                  {order.items && order.items.length > 0 && (
                                    <div>
                                      <p className="text-gray-400 font-semibold uppercase text-xs tracking-wider mb-2">Items ({order.items.length})</p>
                                      <div className="overflow-x-auto rounded-lg border border-cyan-500/10">
                                        <table className="w-full text-sm">
                                          <thead>
                                            <tr className="border-b border-cyan-500/10 bg-slate-800/60">
                                              <th className="text-left py-2 px-3 text-gray-400 font-medium">SKU / Code</th>
                                              <th className="text-left py-2 px-3 text-gray-400 font-medium">Product Name</th>
                                              <th className="text-left py-2 px-3 text-gray-400 font-medium">Size</th>
                                              <th className="text-right py-2 px-3 text-gray-400 font-medium">Qty</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {order.items.map((item, idx) => (
                                              <tr key={idx} className="border-b border-cyan-500/5 hover:bg-slate-800/40">
                                                <td className="py-2 px-3 text-cyan-300 font-mono text-xs">{item.code}</td>
                                                <td className="py-2 px-3 text-gray-300">{item.product_name || item.name || '—'}</td>
                                                <td className="py-2 px-3 text-gray-400">{item.size || '—'}</td>
                                                <td className="py-2 px-3 text-white text-right font-semibold">{item.quantity ?? item.qty ?? '—'}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STAFF TAB (owner only) ──────────────────────────────────────── */}
        {activeTab === 'staff' && adminStaff.isOwner && (
          <div className="space-y-8">
            {/* Add Staff */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Shield size={20} className="text-purple-400" />
                Add Staff Member
              </h2>
              <p className="text-gray-400 text-sm mb-5">Create a login for a team member. You set their password and can reset it any time.</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Email *</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="staff@leeukopf.com"
                    className="w-full rounded-lg border border-purple-500/20 bg-slate-900/50 px-3 py-2 text-white placeholder-gray-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full rounded-lg border border-purple-500/20 bg-slate-900/50 px-3 py-2 text-white placeholder-gray-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Password * (min 8 chars)</label>
                  <input
                    type="text"
                    value={newStaffPassword}
                    onChange={(e) => setNewStaffPassword(e.target.value)}
                    placeholder="Set their login password"
                    className="w-full rounded-lg border border-purple-500/20 bg-slate-900/50 px-3 py-2 text-white placeholder-gray-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Permissions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(Object.keys(DEFAULT_STAFF_PERMISSIONS) as (keyof typeof DEFAULT_STAFF_PERMISSIONS)[]).map((perm) => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions[perm]}
                        onChange={(e) => setNewStaffPermissions((p) => ({ ...p, [perm]: e.target.checked }))}
                        className="w-4 h-4 rounded accent-purple-500"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors capitalize">
                        {perm.replace(/_/g, ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddStaff}
                  disabled={addingStaff}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-700 text-white rounded-lg font-medium hover:from-purple-400 hover:to-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {addingStaff ? 'Adding...' : 'Add Staff Member'}
                </button>
                <button
                  type="button"
                  onClick={() => setNewStaffPermissions({ ...ALL_PERMISSIONS })}
                  className="px-4 py-2.5 bg-slate-700/50 text-gray-300 rounded-lg text-sm hover:bg-slate-700"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setNewStaffPermissions({ ...DEFAULT_STAFF_PERMISSIONS })}
                  className="px-4 py-2.5 bg-slate-700/50 text-gray-300 rounded-lg text-sm hover:bg-slate-700"
                >
                  Reset to Default
                </button>
              </div>
            </div>

            {/* Staff List */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users size={20} className="text-purple-400" />
                  Team Members
                </h2>
                <button
                  type="button"
                  onClick={() => { void loadStaff(); }}
                  disabled={loadingStaff}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-purple-500/20 rounded-lg text-gray-300 hover:border-purple-400 text-sm disabled:opacity-60"
                >
                  <RefreshCw size={14} className={loadingStaff ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              {loadingStaff ? (
                <p className="text-gray-400 py-8 text-center">Loading staff...</p>
              ) : staffList.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">No staff members yet. Add one above.</p>
              ) : (
                <div className="space-y-4">
                  {staffList.map((member) => (
                    <div key={member.id} className={`rounded-xl border p-4 ${member.is_active ? 'border-purple-500/20 bg-slate-900/40' : 'border-gray-700/30 bg-slate-900/20 opacity-60'}`}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="font-medium text-white">{member.full_name || '(no name)'}</p>
                          <p className="text-sm text-cyan-400">{member.email}</p>
                          <p className="text-xs text-gray-500 mt-1">Added {new Date(member.created_at).toLocaleDateString()}{member.created_by ? ` by ${member.created_by}` : ''}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Reset Password */}
                          {resetPwdStaffId === member.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={resetPwdValue}
                                onChange={(e) => setResetPwdValue(e.target.value)}
                                placeholder="New password (min 8)"
                                className="w-44 rounded-lg border border-purple-500/20 bg-slate-800 px-3 py-1.5 text-white text-sm focus:border-purple-400 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => { void handleResetStaffPassword(member.id); }}
                                disabled={resettingPwd}
                                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-500 disabled:opacity-60"
                              >
                                {resettingPwd ? '...' : 'Save'}
                              </button>
                              <button
                                type="button"
                                onClick={() => { setResetPwdStaffId(null); setResetPwdValue(''); }}
                                className="px-3 py-1.5 bg-slate-700 text-gray-300 rounded-lg text-sm hover:bg-slate-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setResetPwdStaffId(member.id); setResetPwdValue(''); }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 border border-slate-600 text-gray-300 rounded-lg text-sm hover:border-purple-400 hover:text-white transition-colors"
                            >
                              <KeyRound size={14} />
                              Reset Password
                            </button>
                          )}

                          {/* Toggle Active */}
                          <button
                            type="button"
                            onClick={() => { void handleToggleStaffActive(member.id, member.is_active); }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                              member.is_active
                                ? 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-amber-400 hover:text-amber-300'
                                : 'bg-slate-700/50 border-emerald-600/40 text-emerald-400 hover:border-emerald-400'
                            }`}
                          >
                            {member.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                            {member.is_active ? 'Deactivate' : 'Reactivate'}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => { void handleDeleteStaff(member.id, member.email); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 border border-red-500/20 text-red-400 rounded-lg text-sm hover:border-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="mt-3">
                        {editingPermsId === member.id ? (
                          <div className="rounded-lg border border-purple-500/20 bg-slate-800/60 p-3">
                            <p className="text-xs text-purple-400 uppercase tracking-wide mb-2">Edit Permissions</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
                              {(Object.keys(editingPerms) as (keyof typeof editingPerms)[]).map((perm) => (
                                <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editingPerms[perm]}
                                    onChange={(e) => setEditingPerms((p) => ({ ...p, [perm]: e.target.checked }))}
                                    className="w-4 h-4 rounded accent-purple-500"
                                  />
                                  <span className="text-sm text-gray-300 capitalize">{perm.replace(/_/g, ' ')}</span>
                                </label>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => { void handleSaveStaffPermissions(member.id); }}
                                disabled={savingPerms}
                                className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-500 disabled:opacity-60"
                              >
                                {savingPerms ? 'Saving...' : 'Save Permissions'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPermsId(null)}
                                className="px-4 py-1.5 bg-slate-700 text-gray-300 rounded-lg text-sm hover:bg-slate-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => { setEditingPermsId(member.id); setEditingPerms({ ...member.permissions }); }}
                              className="text-xs text-purple-400 hover:text-purple-300 underline"
                            >
                              Edit permissions
                            </button>
                            <span className="text-gray-700">·</span>
                            {(Object.entries(member.permissions) as [string, boolean][])
                              .filter(([, v]) => v)
                              .map(([k]) => (
                                <span key={k} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded text-xs capitalize">
                                  {k.replace(/_/g, ' ')}
                                </span>
                              ))
                            }
                            {(Object.values(member.permissions) as boolean[]).every((v) => !v) && (
                              <span className="text-xs text-gray-600 italic">No permissions set</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
