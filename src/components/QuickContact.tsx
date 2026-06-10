import { type FormEvent, useState } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function QuickContact() {
  const [status, setStatus] = useState<FormStatus>('idle');

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
    <section className="py-14 sm:py-20 bg-gradient-to-b from-gray-50 to-white" aria-label="Quick contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Not ready to book a call? No problem.
            </h2>
            <p className="text-gray-500 font-light text-sm sm:text-base leading-relaxed mb-6">
              Drop us a quick note — your brand idea, your question, or even just "I'm interested."
              We respond within one business day.
            </p>
            <ul className="space-y-3 text-sm text-gray-600 font-light">
              {[
                'No commitment required',
                'Real person replies — not a bot',
                'EU business hours (GMT+3)',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
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
                name="quick-contact"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4"
              >
                <input type="hidden" name="form-name" value="quick-contact" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="qc-name" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Your name
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
                      Email address
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
                </div>

                <div>
                  <label htmlFor="qc-message" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Your brand idea or question
                  </label>
                  <textarea
                    id="qc-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="E.g. I want to launch a 20-shade collection for my salon. What do I need to get started?"
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
