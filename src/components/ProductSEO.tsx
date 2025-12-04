interface ProductSEOProps {
  category: 
    | 'gel-polish' 
    | 'builder-gels' 
    | 'top-bases' 
    | 'polygel-acrygel' 
    | 'acrylic-systems' 
    | 'liquids-solutions' 
    | 'nail-art' 
    | 'accessories';
}

export default function ProductSEO({ category }: ProductSEOProps) {
  const seoContent = {
    'gel-polish': {
      title: 'Professional Gel Polish Manufacturing',
      content: (
        <>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Our gel polish systems combine high pigmentation, self-levelling consistency and reliable cure times 
            for professional salon results. Every shade is formulated to deliver consistent coverage, long-lasting 
            wear and easy removal when used with compatible base and top coat systems.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            We offer HEMA-free and TPO-free options across our gel polish range, supporting brands who want to 
            meet evolving market expectations while maintaining excellent performance. All formulas are produced 
            under controlled conditions with documented batch consistency.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Available for private label with flexible MOQs, custom colour matching, and full regulatory documentation 
            for the European market. Our gel polish systems are designed for compatibility across our entire product range.
          </p>
        </>
      ),
    },
    'builder-gels': {
      title: 'Builder & Structure Gel Systems',
      content: (
        <>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Our builder gel systems are engineered for professional nail technicians who need reliable strength, 
            flexibility and a smooth, self-levelling finish. Available in multiple viscosities and systems — from 
            classic 3-phase to modern 3-in-1 formulas and premium fibre-reinforced gels.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            All builder gels are formulated without HEMA or TPO, offering cleaner formulations without compromising 
            on strength or adhesion. Each system is designed to work seamlessly with our gel polish, base and top 
            coat ranges for complete compatibility.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Suitable for natural nail overlays, extensions and structured manicures. Available for private label 
            with comprehensive technical support and full regulatory documentation for European compliance.
          </p>
        </>
      ),
    },
    'top-bases': {
      title: 'Foundation & Finishing Systems',
      content: (
        <>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Our base and top coat systems form the essential foundation and seal for every gel service. From 
            adhesion-optimised primers to flexible rubber bases and high-shine finishing coats, each product is 
            formulated to enhance wear time and protect colour.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Every base and top coat in our range is HEMA-free and TPO-free, meeting the latest market trends 
            without sacrificing performance. Our systems are designed for compatibility with gel polish, builder 
            gels and specialty products, creating a complete ecosystem for professional nail services.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Available for private label with flexible options for wipe-off or non-wipe finishes, matte or glossy 
            effects, and reinforced or flexible bases. Full regulatory support for European market placement.
          </p>
        </>
      ),
    },
    'polygel-acrygel': {
      title: 'Polygel & AcryGel Hybrid Systems',
      content: (
        <>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Our Polygel and AcryGel systems combine the strength of traditional acrylic with the flexibility 
            and convenience of gel technology. These lightweight hybrid formulas offer controlled workability, 
            no strong odour, and a smooth, self-levelling finish ideal for both extensions and overlays.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Formulated without HEMA or TPO, our Polygel range supports modern salon expectations for cleaner, 
            safer formulations. Available in clear, natural cover tones and builder shades, each product is 
            designed to cure reliably under LED or UV lamps.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Suitable for dual-form application, sculpting with forms, or brush-on techniques. Available for 
            private label with custom shade development and complete regulatory documentation for European compliance.
          </p>
        </>
      ),
    },
    'acrylic-systems': {
      title: 'Professional Acrylic Systems',
      content: (
        <>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Our acrylic powder and liquid systems deliver the strength, stability and fast-setting performance 
            that professional nail technicians depend on for sculpted enhancements. Developed and manufactured 
            in Europe, our acrylics offer consistent quality, smooth application and reliable results.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Available in standard-set and fast-set formulations, all free from HEMA and TPO. Our powder range 
            includes clear, cover pinks, and specialty shades, with excellent colour stability and minimal 
            yellowing over time. Each system is formulated for optimal ratio mixing and smooth, bubble-free application.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Suitable for full extensions, overlays and nail art applications. Available for private label with 
            custom shade matching, flexible MOQs and comprehensive regulatory support for European market placement.
          </p>
        </>
      ),
    },
    'liquids-solutions': {
      title: 'Professional Liquids & Solutions',
      content: (
        <>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Our range of professional liquids and solutions includes cleansers, removers, prep products and 
            specialty solutions designed to support every stage of the gel service. From nail plate preparation 
            to final cleanse and polish removal, each product is formulated for efficiency and safety.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            All liquids are manufactured under controlled conditions with documented batch consistency. Our 
            formulations prioritize effective performance while minimizing harsh ingredients wherever possible, 
            supporting modern salon health and safety standards.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Available for private label with custom packaging options, flexible fill volumes, and full regulatory 
            documentation for European compliance. Essential for completing any professional gel polish or extension system.
          </p>
        </>
      ),
    },
    'nail-art': {
      title: 'Nail Art Products & Effects',
      content: (
        <>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Our nail art range includes specialty gels, glitters, pigments and effect products designed for 
            creative nail services. From fine art gels to bold glitter finishes, cat-eye magnetics to chrome 
            powders, each product is formulated for easy application and reliable results.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            All gel-based art products are formulated without HEMA or TPO, maintaining clean formulations 
            while delivering professional creative performance. Our art range is designed for compatibility 
            with our gel polish, builder and top coat systems.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Available for private label with custom colour development, effect customization and full regulatory 
            support. Perfect for brands looking to offer creative services alongside core gel systems.
          </p>
        </>
      ),
    },
    'accessories': {
      title: 'Professional Accessories & Tools',
      content: (
        <>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            Our accessories range includes essential tools and supplies for professional gel nail services. 
            From application brushes to prep tools, forms to finishing accessories, we offer curated selections 
            that support efficient, high-quality work.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
            All accessories are selected for durability, ergonomics and professional performance. We work with 
            trusted suppliers to ensure consistent quality and reliable availability for our private label partners.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Available for private label with custom branding options and flexible packaging configurations. 
            Essential for completing your professional nail product range.
          </p>
        </>
      ),
    },
  };

  const data = seoContent[category];

  return (
    <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
        {data.title}
      </h2>
      {data.content}
    </div>
  );
}
