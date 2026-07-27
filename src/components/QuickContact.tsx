import { type FormEvent, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function QuickContact() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const location = useLocation();
  const requestedShade = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('shade')?.trim() ?? '';
  }, [location.search]);

  const prefilledMessage = requestedShade
    ? `Hi, I am interested in shade ${requestedShade}. Please share sample options and MOQs.`
    : '';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const data = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="quick-contact" className="py-14 sm:py-20 bg-primary" aria-label="Quick contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-3">Start your brand</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Book a free consultation — or simply send us a message.
            </h2>
            <p className="text-white/80 font-light text-sm sm:text-base leading-relaxed mb-6">
              Tell us about your brand idea and we&rsquo;ll reply within one business day. No obligation, no pressure.
            </p>
            <a
              href="/client-registration"
              className="inline-flex items-center gap-2 rounded-md bg-white text-primary font-semibold px-6 py-3 min-h-[44px] border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300"
            >
              Book a Free Consultation
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          {/* Right — form */}
          <div>
            {status === 'success' ? (
              <div className="rounded-2xl bg-green-50 border border-green-100 p-8 text-center">
                <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-gray-900 mb-1">Message received!</p>
                <p className="text-sm text-gray-500 font-light">We will be in touch within one business day.</p>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                netlify
                data-netlify="true"
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4"
              >
                <input type="hidden" name="form-name" value="contact" />
                {requestedShade ? <input type="hidden" name="requestedShade" value={requestedShade} /> : null}

                <div>
                  <label htmlFor="qc-name" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    id="qc-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Jane Smith"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="qc-email" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="qc-email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@yourbrand.com"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="qc-message" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Tell us about your brand idea
                  </label>
                  <textarea
                    id="qc-message"
                    name="message"
                    required
                    rows={3}
                    defaultValue={prefilledMessage}
                    placeholder="Share your idea, timeline, and what you need help with."
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-600">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full btn-primary py-3 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
