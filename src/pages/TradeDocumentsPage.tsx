import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Download, FileText, Lock, Mail, MessageCircle, RefreshCw } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { getNetlifyFunctionUrl } from '../lib/netlifyFunctions';
import { clearTradeDocsAccess, readTradeDocsAccess, saveTradeDocsAccess } from '../lib/tradeDocsAccess';

/**
 * Private trade documents for registered clients.
 * Not linked anywhere on the public site and marked noindex. Access comes from the personal
 * link issued at registration (also emailed), or from a signed-in approved portal account.
 */

type TradeDoc = {
  slot: string;
  title: string;
  description: string;
  url: string;
  updatedAt: string | null;
  sizeBytes: number | null;
};

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; docs: TradeDoc[] }
  | { kind: 'no-access'; expired: boolean }
  | { kind: 'error'; message: string };

const WHATSAPP_URL = `https://wa.me/359876777984?text=${encodeURIComponent(
  "Hi, I've downloaded the Leeukopf private label pricelists and would like a quote.",
)}`;

const updated = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
const size = (bytes: number | null) => (bytes ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : null);

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const previousTitle = document.title;
    document.title = 'Trade Documents | Leeukopf Laboratories';
    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);
}

export default function TradeDocumentsPage() {
  useNoIndex();
  const location = useLocation();
  const { session, loading: authLoading } = useAuth();
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [welcome] = useState(() => new URLSearchParams(location.search).get('welcome') === '1');

  // Take the access token from the link, remember it, and tidy it out of the address bar.
  const [accessToken] = useState<string | null>(() => {
    const fromUrl = new URLSearchParams(location.search).get('access');
    if (fromUrl) {
      saveTradeDocsAccess(fromUrl);
      return fromUrl;
    }
    return readTradeDocsAccess();
  });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('access')) {
      window.history.replaceState(null, '', '/trade-documents');
    }
  }, []);

  const load = useCallback(async () => {
    setState({ kind: 'loading' });
    const portalToken = session?.access_token;
    if (!accessToken && !portalToken) {
      setState({ kind: 'no-access', expired: false });
      return;
    }
    try {
      const query = accessToken ? `?access=${encodeURIComponent(accessToken)}` : '';
      const res = await fetch(`${getNetlifyFunctionUrl('trade-documents')}${query}`, {
        headers: portalToken && !accessToken ? { Authorization: `Bearer ${portalToken}` } : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        if (accessToken) clearTradeDocsAccess();
        setState({ kind: 'no-access', expired: Boolean(accessToken) });
        return;
      }
      if (!res.ok || !data.success) throw new Error(data.message || 'Documents are temporarily unavailable.');
      setState({ kind: 'ready', docs: data.documents ?? [] });
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Documents are temporarily unavailable.' });
    }
  }, [accessToken, session?.access_token]);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  // Signed download links expire after 10 minutes — refresh them if the page has been open a while.
  useEffect(() => {
    if (state.kind !== 'ready') return;
    const timer = window.setTimeout(() => void load(), 8 * 60 * 1000);
    return () => window.clearTimeout(timer);
  }, [state.kind, load]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-1 px-4 pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Lock size={14} /> Registered clients only
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Trade Documents</h1>
          <p className="mt-3 max-w-2xl text-gray-600 font-light">
            Our current private label pricelists, bottle guide and catalogue. All prices are subject to our terms and
            conditions.
          </p>

          {welcome && state.kind === 'ready' && (
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-5" role="status">
              <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={22} />
              <div>
                <p className="font-semibold text-green-900">Thank you for registering!</p>
                <p className="mt-1 text-sm text-green-800 font-light">
                  Your documents are ready below. We've also emailed you a personal link so you can come back to them any
                  time.
                </p>
              </div>
            </div>
          )}

          {state.kind === 'loading' && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-white" />
              ))}
            </div>
          )}

          {state.kind === 'ready' && (
            <>
              {state.docs.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center">
                  <FileText className="mx-auto text-gray-300" size={40} />
                  <p className="mt-3 text-gray-700">Our updated documents are being prepared and will appear here shortly.</p>
                </div>
              ) : (
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {state.docs.map((doc) => (
                    <div key={doc.slot} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                          <FileText size={22} />
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-semibold text-gray-900">{doc.title}</h2>
                          <p className="mt-1 text-sm text-gray-600 font-light">{doc.description}</p>
                        </div>
                      </div>
                      <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                        <span className="text-xs text-gray-500">
                          {[updated(doc.updatedAt) && `Updated ${updated(doc.updatedAt)}`, size(doc.sizeBytes)]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                        <a
                          href={doc.url}
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                        >
                          <Download size={16} /> Download PDF
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="font-semibold text-gray-900">Ready to talk about your brand?</h2>
                  <p className="mt-1 text-sm text-gray-600 font-light">
                    Send us your shades, quantities and bottle choice and we'll prepare a quote.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 sm:mt-0 sm:shrink-0">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                  <a
                    href="mailto:info@leeukopf.com?subject=Private%20label%20quote"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    <Mail size={16} /> info@leeukopf.com
                  </a>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                These documents are for your business use only. Please do not share them outside your company.
              </p>
            </>
          )}

          {state.kind === 'no-access' && <NoAccess expired={state.expired} />}

          {state.kind === 'error' && (
            <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-amber-900">{state.message}</p>
              <button
                type="button"
                onClick={() => void load()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function NoAccess({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await fetch(getNetlifyFunctionUrl('trade-documents'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      setResult({ ok: res.ok && data.success, text: data.message || 'Something went wrong. Please try again.' });
    } catch {
      setResult({ ok: false, text: 'Something went wrong. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">{expired ? 'Your link has expired' : 'Register for access'}</h2>
        <p className="mt-2 text-sm text-gray-600 font-light">
          {expired
            ? 'Access links stay active for a limited time. Enter your registered email and we’ll send you a fresh one.'
            : 'Our pricelists and guides are available to registered business clients. Registration takes a couple of minutes and your documents open straight away.'}
        </p>
        {!expired && (
          <Link
            to="/client-registration"
            className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Register now
          </Link>
        )}
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Already registered?</h2>
        <p className="mt-2 text-sm text-gray-600 font-light">We’ll email your personal download link to you.</p>
        <label htmlFor="trade-docs-email" className="sr-only">
          Registered email
        </label>
        <input
          id="trade-docs-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={sending}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
        >
          <Mail size={16} /> {sending ? 'Sending…' : 'Email me my link'}
        </button>
        {result && (
          <p className={`mt-3 text-sm ${result.ok ? 'text-green-700' : 'text-red-600'}`} role="status">
            {result.text}
          </p>
        )}
      </form>
    </div>
  );
}
