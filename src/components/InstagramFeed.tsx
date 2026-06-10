// Props kept for backwards-compatibility (Gelitup pages still pass brand="gelitup").
// The Leeukopf Elfsight widget is rendered here; Gelitup can be swapped separately.
interface InstagramFeedProps {
  brand?: string;
  limit?: number;
}

export default function InstagramFeed(_props: InstagramFeedProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            See Leeukopf in Action
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light px-2">
            See the latest colour trends and behind the scenes colour mixing.
          </p>
        </div>
        <div className="elfsight-app-c42c30b1-472e-4cd4-8638-8de584be4b63" data-elfsight-app-lazy></div>
      </div>
    </section>
  );
}
