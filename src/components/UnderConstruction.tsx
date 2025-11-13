import { Construction, Mail } from 'lucide-react';

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-2xl border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Construction className="w-24 h-24 text-yellow-400 animate-pulse" strokeWidth={1.5} />
              <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Under Construction
          </h1>

          <p className="text-xl text-slate-300 mb-8">
            We're currently updating our website to serve you better.
          </p>

          <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
            <p className="text-slate-300 leading-relaxed">
              Our team is working hard to bring you an improved experience.
              <br />
              We'll be back online shortly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:info@leeukopf.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </a>
          </div>

          <p className="text-slate-400 text-sm mt-8">
            Thank you for your patience
          </p>
        </div>

        <div className="mt-8">
          <img
            src="/leeukopf_black.png"
            alt="Leeukopf Laboratories"
            className="h-12 mx-auto opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
