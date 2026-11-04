import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileText, RefreshCw, Send, ShieldCheck, Trash2, Upload, UserX } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getNetlifyFunctionUrl } from '../../lib/netlifyFunctions';

type DocStatus = {
  slot: string;
  title: string;
  description: string;
  uploaded: boolean;
  updatedAt: string | null;
  sizeBytes: number | null;
};

type DownloadRow = {
  at: string;
  email: string;
  company: string | null;
  slot: string;
  title: string;
  via: 'link' | 'portal';
};

type RegistrationRow = {
  email: string;
  company: string | null;
  contact: string | null;
  country: string | null;
  business_type: string | null;
  interest_private_label: boolean | null;
  interest_distribution: boolean | null;
  created_at: string;
  approvedAt: string | null;
  approvedBy: string | null;
  lastEmailedAt: string | null;
};

const BUCKET = 'trade-documents';
const MAX_BYTES = 50 * 1024 * 1024;

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const size = (bytes: number | null) => (bytes ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : '');

/**
 * Admin → "Trade documents": the PDFs registered clients can download straight after registering.
 * Uploading a new file replaces the old one immediately for everyone.
 */
export default function AdminTradeDocumentsTab({ accessToken }: { accessToken: string | undefined }) {
  const [docs, setDocs] = useState<DocStatus[]>([]);
  const [downloads, setDownloads] = useState<DownloadRow[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [view, setView] = useState<'pending' | 'approved'>('pending');
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const call = useCallback(
    async (method: 'GET' | 'POST' | 'DELETE', body?: unknown, query = '') => {
      const res = await fetch(`${getNetlifyFunctionUrl('admin-trade-documents')}${query}`, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken ?? ''}` },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || `Request failed (${res.status})`);
      return data;
    },
    [accessToken],
  );

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await call('GET');
      setDocs(data.documents ?? []);
      setDownloads(data.downloads ?? []);
      setRegistrations(data.registrations ?? []);
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Could not load documents.' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, call]);

  useEffect(() => {
    void load();
  }, [load]);

  const upload = async (slot: string, file: File | undefined) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setMessage({ kind: 'error', text: 'Please choose a PDF file.' });
      return;
    }
    if (file.size > MAX_BYTES) {
      setMessage({ kind: 'error', text: 'That file is larger than 50 MB. Please compress it first.' });
      return;
    }
    setBusySlot(slot);
    setMessage(null);
    try {
      const { path, token } = await call('POST', { slot });
      const { error } = await supabase.storage
        .from(BUCKET)
        .uploadToSignedUrl(path, token, file, { contentType: 'application/pdf', upsert: true });
      if (error) throw error;
      setMessage({ kind: 'ok', text: `${file.name} is now live for registered clients.` });
      await load();
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Upload failed.' });
    } finally {
      setBusySlot(null);
      const input = inputs.current[slot];
      if (input) input.value = '';
    }
  };

  const access = async (action: 'approve' | 'resend' | 'revoke', row: RegistrationRow) => {
    if (action === 'revoke' && !window.confirm(`Withdraw document access for ${row.email}? Links already sent will stop working.`)) return;
    setBusyEmail(row.email);
    setMessage(null);
    try {
      const data = await call('POST', { action, email: row.email });
      setMessage({
        kind: data.emailSent === false ? 'error' : 'ok',
        text: data.message || (action === 'revoke' ? `Access withdrawn for ${row.email}.` : 'Done.'),
      });
      await load();
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Action failed.' });
    } finally {
      setBusyEmail(null);
    }
  };

  const pending = registrations.filter((r) => !r.approvedAt);
  const approved = registrations.filter((r) => r.approvedAt);
  const shown = view === 'pending' ? pending : approved;

  const remove = async (doc: DocStatus) => {
    if (!window.confirm(`Remove "${doc.title}"? Registered clients will no longer see it.`)) return;
    setBusySlot(doc.slot);
    setMessage(null);
    try {
      await call('DELETE', undefined, `?slot=${encodeURIComponent(doc.slot)}`);
      setMessage({ kind: 'ok', text: `${doc.title} removed.` });
      await load();
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Could not remove the document.' });
    } finally {
      setBusySlot(null);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Trade Documents</h2>
          <p className="text-gray-400 mt-1 max-w-2xl">
            PDFs that approved clients can download. They are stored privately and never appear on the
            public website. Uploading a file replaces the previous version immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 text-gray-200 border border-cyan-500/20 hover:bg-slate-700"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {message && (
        <div
          className={`mb-5 rounded-lg px-4 py-3 text-sm border ${
            message.kind === 'ok'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-red-500/10 text-red-300 border-red-500/30'
          }`}
          role="status"
        >
          {message.text}
        </div>
      )}

      <div className="mb-10 rounded-xl border border-cyan-500/20 bg-slate-900/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white">Access requests</h3>
            <p className="text-gray-400 text-sm mt-1">
              Approve a registration to email the client their personal link to the documents below.
            </p>
          </div>
          <div className="flex gap-2">
            {(['pending', 'approved'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  view === v ? 'bg-gradient-to-r from-cyan-500 to-blue-700 text-white' : 'bg-slate-800/60 text-gray-300 border border-cyan-500/20'
                }`}
              >
                {v === 'pending' ? `Waiting (${pending.length})` : `Approved (${approved.length})`}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="text-gray-500 text-sm mt-5">
            {view === 'pending' ? 'No registrations waiting for approval.' : 'No clients approved yet.'}
          </p>
        ) : (
          <div className="overflow-x-auto mt-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyan-500/20 text-left text-gray-300">
                  <th className="py-2 pr-4 font-medium">Action</th>
                  <th className="py-2 pr-4 font-medium">Registered</th>
                  <th className="py-2 pr-4 font-medium">Company</th>
                  <th className="py-2 pr-4 font-medium">Contact</th>
                  <th className="py-2 pr-4 font-medium">Country / type</th>
                  {view === 'approved' && <th className="py-2 pr-4 font-medium">Approved</th>}
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.email} className="border-b border-slate-700/50 text-gray-200 align-top">
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {view === 'pending' ? (
                        <button
                          type="button"
                          disabled={busyEmail !== null}
                          onClick={() => void access('approve', r)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-700 text-white font-medium disabled:opacity-50"
                        >
                          <ShieldCheck size={16} />
                          {busyEmail === r.email ? 'Approving…' : 'Approve & send link'}
                        </button>
                      ) : (
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            disabled={busyEmail !== null}
                            onClick={() => void access('resend', r)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-50"
                          >
                            <Send size={14} /> Resend link
                          </button>
                          <button
                            type="button"
                            disabled={busyEmail !== null}
                            onClick={() => void access('revoke', r)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                          >
                            <UserX size={14} /> Withdraw
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">{when(r.created_at)}</td>
                    <td className="py-3 pr-4">
                      {r.company || '—'}
                      {r.interest_private_label && <span className="ml-2 text-xs text-cyan-300">Private label</span>}
                    </td>
                    <td className="py-3 pr-4">
                      <div>{r.contact || '—'}</div>
                      <a href={`mailto:${r.email}`} className="text-cyan-300 hover:underline">
                        {r.email}
                      </a>
                    </td>
                    <td className="py-3 pr-4">
                      <div>{r.country || '—'}</div>
                      <div className="text-gray-400">{r.business_type || ''}</div>
                    </td>
                    {view === 'approved' && (
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <div>{when(r.approvedAt)}</div>
                        <div className="text-gray-400 text-xs">
                          {r.lastEmailedAt ? `Link sent ${when(r.lastEmailedAt)}` : 'Email not sent'}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-4">Documents</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <div key={doc.slot} className="rounded-xl border border-cyan-500/20 bg-slate-900/40 p-5 flex flex-col">
            <div className="flex items-start gap-3">
              <FileText className="text-cyan-400 shrink-0 mt-0.5" size={22} />
              <div className="min-w-0">
                <h3 className="font-semibold text-white">{doc.title}</h3>
                <p className="text-sm text-gray-400 mt-0.5">{doc.description}</p>
              </div>
            </div>

            <div className="mt-4 text-sm">
              {doc.uploaded ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 size={16} /> Live · updated {when(doc.updatedAt)} {size(doc.sizeBytes) && `· ${size(doc.sizeBytes)}`}
                </span>
              ) : (
                <span className="text-amber-300">Not uploaded yet — clients won't see this one</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <input
                ref={(el) => (inputs.current[doc.slot] = el)}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => void upload(doc.slot, e.target.files?.[0])}
              />
              <button
                type="button"
                disabled={busySlot !== null}
                onClick={() => inputs.current[doc.slot]?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-700 text-white font-medium disabled:opacity-50"
              >
                <Upload size={16} />
                {busySlot === doc.slot ? 'Working…' : doc.uploaded ? 'Replace PDF' : 'Upload PDF'}
              </button>
              {doc.uploaded && (
                <button
                  type="button"
                  disabled={busySlot !== null}
                  onClick={() => void remove(doc)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold text-white">Download history</h3>
        <p className="text-gray-400 text-sm mt-1">
          Every download is stamped on each page with the client&apos;s company and email, so a forwarded copy can be traced.
        </p>
        {downloads.length === 0 ? (
          <p className="text-gray-500 text-sm mt-4">No downloads yet.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyan-500/20 text-left text-gray-300">
                  <th className="py-2 pr-4 font-medium">When</th>
                  <th className="py-2 pr-4 font-medium">Company</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Document</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((d, i) => (
                  <tr key={`${d.at}-${i}`} className="border-b border-slate-700/50 text-gray-200">
                    <td className="py-2 pr-4 whitespace-nowrap">{when(d.at)}</td>
                    <td className="py-2 pr-4">{d.company || '—'}</td>
                    <td className="py-2 pr-4">
                      <a href={`mailto:${d.email}`} className="text-cyan-300 hover:underline">
                        {d.email}
                      </a>
                    </td>
                    <td className="py-2 pr-4">{d.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && docs.length === 0 && !message && (
        <p className="text-gray-400 text-sm">Loading documents…</p>
      )}
    </div>
  );
}
