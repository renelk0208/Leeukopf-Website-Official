import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Download, RefreshCw, Search } from 'lucide-react';
import { getNetlifyFunctionUrl } from '../../lib/netlifyFunctions';

type Vies = { status: 'valid' | 'invalid' | 'unavailable' | 'not_eu'; name: string | null; address: string | null };

export type OfferRow = {
  id: string;
  status: 'open' | 'abandoned' | 'ordered';
  reminderSentAt: string | null;
  orderId: string | null;
  contact: {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    country: string;
    vatNumber: string;
    vies: Vies;
  };
  lines: Array<{ code: string; kg: number; category: string; price: number; total: number }>;
  totalKg: number;
  totalEur: number;
  createdAt: string;
  updatedAt: string;
  orderedAt: string | null;
};

const eur = (n: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(n);
const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

const viesBadge: Record<Vies['status'], { label: string; cls: string }> = {
  valid: { label: 'VIES valid', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  invalid: { label: 'VIES invalid', cls: 'bg-red-500/15 text-red-300 border-red-500/30' },
  unavailable: { label: 'VIES not checked', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  not_eu: { label: 'Non-EU', cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
};

type AnonRow = {
  id: string;
  country: string | null;
  lines: OfferRow['lines'];
  totalKg: number;
  totalEur: number;
  createdAt: string;
  updatedAt: string;
};

type Filter = 'all' | 'open' | 'abandoned' | 'ordered' | 'anonymous';

export default function AdminOffersTab({ accessToken }: { accessToken: string | undefined }) {
  const [rows, setRows] = useState<OfferRow[]>([]);
  const [anon, setAnon] = useState<AnonRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getNetlifyFunctionUrl('admin-bf-offers'), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; data?: OfferRow[]; anonymous?: AnonRow[]; message?: string };
      if (!res.ok || !data.success) throw new Error(data.message || 'Could not load offers.');
      setRows(data.data ?? []);
      setAnon(data.anonymous ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load offers.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === 'anonymous') return false;
      if (filter !== 'all' && r.status !== filter) return false;
      if (!term) return true;
      const c = r.contact;
      return [c.firstName, c.lastName, c.companyName, c.email, c.phone, c.country, c.vatNumber, r.orderId ?? '', r.id]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [rows, filter, q]);

  const stats = useMemo(() => {
    const openRows = rows.filter((r) => r.status === 'open' || r.status === 'abandoned');
    const abandoned = rows.filter((r) => r.status === 'abandoned');
    const ordered = rows.filter((r) => r.status === 'ordered');
    return {
      total: rows.length,
      open: openRows.length,
      openKg: openRows.reduce((s, r) => s + r.totalKg, 0),
      openEur: openRows.reduce((s, r) => s + r.totalEur, 0),
      abandoned: abandoned.length,
      abandonedEur: abandoned.reduce((s, r) => s + r.totalEur, 0),
      anon: anon.length,
      ordered: ordered.length,
      orderedEur: ordered.reduce((s, r) => s + r.totalEur, 0),
    };
  }, [rows, anon]);

  function exportCsv() {
    const head = ['Ref', 'Status', 'Order ID', 'Registered', 'Last change', 'Name', 'Surname', 'Company', 'Email', 'Contact number',
      'Address line 1', 'Address line 2', 'City', 'Postal code', 'Country', 'VAT', 'VIES', 'Basket', 'Total kg', 'Total EUR'];
    const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const body = shown.map((r) => {
      const c = r.contact;
      return [r.id, r.status, r.orderId ?? '', r.createdAt, r.updatedAt, c.firstName, c.lastName, c.companyName, c.email, c.phone,
        c.addressLine1, c.addressLine2, c.city, c.postalCode, c.country, c.vatNumber, viesBadge[c.vies.status].label,
        r.lines.map((l) => `${l.code} x${l.kg}kg`).join('; '), r.totalKg, r.totalEur.toFixed(2)].map(cell).join(',');
    });
    const blob = new Blob(['﻿' + [head.map(cell).join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `black-friday-offers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Offers — Black Friday 2026</h2>
          <p className="text-gray-400 text-sm mt-1">
            Everyone who registered on leeukopf.com/blackfriday, with the basket they have built. “Open” means registered but not ordered yet; “Abandoned” means open with no change for 24 hours (they get one reminder email).
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} disabled={!shown.length}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-gray-200 border border-cyan-500/20 disabled:opacity-40">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-700 text-white disabled:opacity-50">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat label="Registrations" value={String(stats.total)} />
        <Stat label="Open baskets" value={String(stats.open)} sub={`${stats.openKg} kg · ${eur(stats.openEur)}`} />
        <Stat label="Ordered" value={String(stats.ordered)} sub={eur(stats.orderedEur)} />
        <Stat label="Abandoned" value={String(stats.abandoned)} sub={`${eur(stats.abandonedEur)} · no change for 24 h`} />
        <Stat label="Anonymous baskets" value={String(stats.anon)} sub="not registered" />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {(['all', 'open', 'abandoned', 'ordered', 'anonymous'] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f ? 'bg-cyan-600 text-white' : 'bg-slate-800/60 text-gray-300 border border-cyan-500/20'}`}>
            {filterLabel[f]}
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, company, email, VAT…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm" />
        </div>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>}

      {filter === 'anonymous' && <AnonymousView rows={anon} />}

      {filter !== 'anonymous' && (
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-sm text-left text-gray-200">
          <thead className="bg-slate-800 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Country / VAT</th>
              <th className="px-4 py-3 text-right">Basket</th>
              <th className="px-4 py-3">Last change</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!loading && !shown.length && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No registrations yet.</td></tr>
            )}
            {shown.map((r) => {
              const c = r.contact;
              const isOpen = open === r.id;
              return (
                <Fragment key={r.id}>
                  <tr className="border-t border-slate-700/70 hover:bg-slate-800/40 cursor-pointer" onClick={() => setOpen(isOpen ? null : r.id)}>
                    <td className="px-4 py-3">
                      {r.status === 'ordered' ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Ordered {r.orderId}</span>
                      ) : r.status === 'abandoned' ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-500/15 text-red-300 border border-red-500/30">Abandoned</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30">Open basket</span>
                      )}
                      {r.reminderSentAt && r.status !== 'ordered' && (
                        <div className="text-gray-500 text-xs mt-1">Reminder sent {when(r.reminderSentAt)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{c.firstName} {c.lastName}</div>
                      <div className="text-gray-400 text-xs">{c.companyName || '—'} · {c.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{c.country}</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded border text-xs ${viesBadge[c.vies.status].cls}`}>{viesBadge[c.vies.status].label}</span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="font-medium text-white">{r.totalKg} kg</div>
                      <div className="text-gray-400 text-xs">{eur(r.totalEur)}{r.totalKg < 10 ? ' · under 10 kg' : ''}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{when(r.updatedAt)}</td>
                    <td className="px-4 py-3 text-gray-500">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-slate-900/60">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
                            <dt className="text-gray-500">Ref</dt><dd>{r.id}</dd>
                            <dt className="text-gray-500">Email</dt><dd><a className="text-cyan-300 underline" href={`mailto:${c.email}`}>{c.email}</a></dd>
                            <dt className="text-gray-500">Contact number</dt><dd><a className="text-cyan-300 underline" href={`tel:${c.phone.replace(/\s+/g, '')}`}>{c.phone}</a></dd>
                            <dt className="text-gray-500">Address</dt>
                            <dd>{c.addressLine1}{c.addressLine2 ? `, ${c.addressLine2}` : ''}<br />{c.postalCode} {c.city}, {c.country}</dd>
                            <dt className="text-gray-500">VAT</dt>
                            <dd>{c.vatNumber || '—'}{c.vies.name ? <span className="text-gray-400"> · VIES name: {c.vies.name}</span> : null}</dd>
                            {c.vies.address && (<><dt className="text-gray-500">VIES address</dt><dd className="text-gray-400">{c.vies.address}</dd></>)}
                            <dt className="text-gray-500">Registered</dt><dd>{when(r.createdAt)}</dd>
                            {r.orderedAt && (<><dt className="text-gray-500">Ordered</dt><dd>{when(r.orderedAt)}</dd></>)}
                            {r.reminderSentAt && (<><dt className="text-gray-500">Reminder email</dt><dd>{when(r.reminderSentAt)}</dd></>)}
                          </dl>
                          <div>
                            {r.lines.length ? (
                              <table className="w-full text-sm">
                                <thead className="text-gray-500 text-xs"><tr><th className="text-left py-1">Colour</th><th className="text-left">Category</th><th className="text-right">Qty</th><th className="text-right">Total</th></tr></thead>
                                <tbody>
                                  {r.lines.map((l) => (
                                    <tr key={l.code} className="border-t border-slate-800">
                                      <td className="py-1 font-medium">{l.code}</td><td className="text-gray-400">{l.category}</td>
                                      <td className="text-right">{l.kg} kg</td><td className="text-right">{eur(l.total)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot><tr className="border-t border-slate-600 font-semibold"><td className="py-1" colSpan={2}>Total</td><td className="text-right">{r.totalKg} kg</td><td className="text-right">{eur(r.totalEur)}</td></tr></tfoot>
                              </table>
                            ) : (
                              <p className="text-gray-500 text-sm">Basket is empty.</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

const filterLabel: Record<Filter, string> = {
  all: 'All registrations',
  open: 'Open baskets',
  abandoned: 'Abandoned',
  ordered: 'Ordered',
  anonymous: 'Anonymous',
};

function AnonymousView({ rows }: { rows: AnonRow[] }) {
  const top = useMemo(() => {
    const kg = new Map<string, number>();
    const visitors = new Map<string, number>();
    for (const r of rows)
      for (const l of r.lines) {
        kg.set(l.code, (kg.get(l.code) ?? 0) + l.kg);
        visitors.set(l.code, (visitors.get(l.code) ?? 0) + 1);
      }
    return [...kg.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([code, total]) => ({ code, total, visitors: visitors.get(code) ?? 0 }));
  }, [rows]);

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">
        Visitors who added colours but have not registered. There are no contact details, so they can't be followed up — this shows what
        people want and how many drop off before registering. Only visitors who accepted analytics cookies are counted.
      </p>
      {top.length > 0 && (
        <div className="rounded-xl bg-slate-800/50 border border-cyan-500/20 p-4">
          <div className="text-gray-400 text-xs uppercase tracking-wide mb-2">Most-picked colours (anonymous)</div>
          <div className="flex flex-wrap gap-2">
            {top.map((t) => (
              <span key={t.code} className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-gray-200">
                <b className="text-white">{t.code}</b> · {t.total} kg · {t.visitors} {t.visitors === 1 ? 'visitor' : 'visitors'}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-sm text-left text-gray-200">
          <thead className="bg-slate-800 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Colours</th>
              <th className="px-4 py-3 text-right">Basket</th>
              <th className="px-4 py-3">Last change</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No anonymous baskets yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-700/70">
                <td className="px-4 py-3 text-gray-400">{r.id}</td>
                <td className="px-4 py-3">{r.country || '—'}</td>
                <td className="px-4 py-3 text-gray-300">{r.lines.map((l) => `${l.code} ×${l.kg}`).join(', ')}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="font-medium text-white">{r.totalKg} kg</div>
                  <div className="text-gray-400 text-xs">{eur(r.totalEur)}</div>
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{when(r.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-slate-800/50 border border-cyan-500/20 p-4">
      <div className="text-gray-400 text-xs uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold text-white mt-1">{value}</div>
      {sub && <div className="text-gray-400 text-xs mt-1">{sub}</div>}
    </div>
  );
}
