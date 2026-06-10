// Replace these with real client quotes when available.
// Format: short quote (2–3 sentences max), first name + last initial, role, country.

const testimonials = [
  {
    quote: "We launched our first collection of 80 shades within 3 months. The process was clearer than we expected and the support was always there.",
    name: "Sarah M.",
    role: "Nail brand owner",
    country: "United Kingdom",
  },
  {
    quote: "As a training academy we needed consistent, reliable products. Leeukopf gave us exactly that - and our own label on top.",
    name: "Yiannis P.",
    role: "Nail academy",
    country: "Greece",
  },
  {
    quote: "From first call to first delivery was smoother than any supplier we'd worked with before.",
    name: "Fatima A.",
    role: "Distributor",
    country: "Saudi Arabia",
  },
];

export default function Testimonials() {
  return (
    <section className="py-14 sm:py-20 bg-white" aria-label="Client testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            What brand owners say
          </h2>
          <p className="mt-3 text-gray-500 font-light text-sm sm:text-base max-w-xl mx-auto">
            From first launch to full distribution — brands built with Leeukopf.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"
            >
              {/* Quote mark */}
              <span className="text-5xl leading-none text-primary font-serif select-none mb-4" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className="flex-1">
                <p className="text-gray-700 font-light leading-relaxed text-sm sm:text-base">
                  {t.quote}
                </p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.country}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
