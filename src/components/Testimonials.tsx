// TODO: Replace placeholder quotes below with real client testimonials.
// Keep format: quote, first name + last initial, role, country.

const testimonials = [
  {
    quote: "We launched our first collection of 24 shades under our own brand. Leeukopf made the EU compliance side straightforward — we didn't need a separate consultant. The guidance from start to launch was exceptional.",
    name: "Sarah K.",
    role: "Salon Owner & Brand Founder",
    country: "United Kingdom",
  },
  {
    quote: "I was worried small batches would not be taken seriously. We started with 12 shades and nobody made us feel like a small order. Three ranges later, we are stocked in four countries.",
    name: "Marie T.",
    role: "Training Academy Owner",
    country: "Belgium",
  },
  {
    quote: "HEMA-free formulas were non-negotiable for us — our clients have sensitive skin. Leeukopf had the range, the documentation, and turnaround was faster than we expected.",
    name: "Aisha M.",
    role: "Brand Distributor",
    country: "South Africa",
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
