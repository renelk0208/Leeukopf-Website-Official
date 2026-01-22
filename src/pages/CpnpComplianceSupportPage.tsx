import PageTemplate from '../components/PageTemplate';
import { CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';

export default function CpnpComplianceSupportPage() {
  const processSteps = [
    { number: 1, title: 'Initial Consultation', description: 'Discuss your brand vision, target markets, and product requirements' },
    { number: 2, title: 'Quotation & Agreement', description: 'Receive detailed pricing including CPNP support, finalize order' },
    { number: 3, title: 'Color Selection', description: 'Choose from 200+ stock shades or develop custom colors (MOQ applies)' },
    { number: 4, title: 'Safety Assessment (CPSR)', description: 'Our qualified safety assessor prepares your Cosmetic Product Safety Report' },
    { number: 5, title: 'PIF Compilation', description: 'Complete Product Information File assembled per EU Regulation 1223/2009' },
    { number: 6, title: 'Label Design & Approval', description: 'Create compliant labels with your branding—we review for regulatory compliance' },
    { number: 7, title: 'Production', description: 'GMP-certified manufacturing with rigorous quality control' },
    { number: 8, title: 'Documentation Delivery', description: 'Receive CPSR, PIF, and CPNP submission guide digitally' },
    { number: 9, title: 'You Submit to CPNP', description: 'Upload documents to your CPNP account—we provide technical support' }
  ];

  const certifications = [
    '✓ GMP Certified',
    '✓ ISO 22716 Compliant',
    '✓ EU Regulation 1223/2009',
    '✓ REACH Compliant',
    '✓ Cruelty-Free'
  ];

  const markets = [
    { flag: '🇪🇺', name: 'EU (27 countries)' },
    { flag: '🇬🇧', name: 'United Kingdom' },
    { flag: '🇳🇴', name: 'Norway' },
    { flag: '🇨🇭', name: 'Switzerland' },
    { flag: '🇮🇸', name: 'Iceland' },
    { flag: '🇱🇮', name: 'Liechtenstein' },
    { flag: '🇹🇷', name: 'Turkey' },
    { flag: '🇦🇪', name: 'UAE' }
  ];

  const faqs = [
    {
      question: 'What is CPNP registration and why do I need it?',
      answer: 'CPNP (Cosmetic Products Notification Portal) registration is mandatory for all cosmetic products sold in the EU/EEA. It\'s a legal requirement under EU Cosmetic Regulation (EC) No 1223/2009. Without CPNP registration, you cannot legally sell gel polish in EU markets.'
    },
    {
      question: 'Do you handle the entire CPNP process, or do I need to hire someone separately?',
      answer: 'We handle everything technical: formulation, safety assessments (CPSR), PIF compilation, and all documentation. You only need to submit the final notification to CPNP using your own business account—we provide all the materials and guidance needed.'
    },
    {
      question: 'What is a CPSR (Cosmetic Product Safety Report)?',
      answer: 'A CPSR is a mandatory safety assessment conducted by a qualified safety assessor. It evaluates the safety of your cosmetic product based on its formulation, intended use, and manufacturing process. We provide fully compliant CPSRs for all our gel polish formulas.'
    },
    {
      question: 'Can I sell in the UK with EU CPNP registration?',
      answer: 'Post-Brexit, the UK requires separate notification via the UK SCPN (Submit Cosmetic Product Notifications) system. However, our documentation package supports both EU CPNP and UK SCPN registration—you just need to submit to both portals.'
    },
    {
      question: 'What\'s the minimum order quantity (MOQ) for private label?',
      answer: 'MOQ is 500 units per shade for stock colors, and 1,000 units per shade for custom color development. This ensures economical production while maintaining GMP quality standards.'
    },
    {
      question: 'How long does the CPNP documentation process take?',
      answer: 'CPSR and PIF preparation typically takes 3-5 weeks after order confirmation. Production begins in parallel, so your products can ship as soon as documentation is ready and you\'ve completed CPNP submission.'
    },
    {
      question: 'What is included in the Product Information File (PIF)?',
      answer: 'The PIF includes: product description, safety assessment (CPSR), manufacturing method, proof of claimed effects (if applicable), animal testing declaration, and all supporting documentation required by EU Regulation 1223/2009.'
    },
    {
      question: 'Can I use my own brand name and labeling?',
      answer: 'Absolutely! We produce white-label products with your brand name, logo, and custom labeling. We provide label design guidelines to ensure compliance with EU cosmetic labeling requirements, or you can use your own designer.'
    }
  ];

  return (
    <PageTemplate
      title="EU Private Label Gel Polish + Full CPNP Compliance Support"
      subtitle="GMP-certified manufacturer handling formulation, safety assessments, and regulatory compliance. Launch your EU-compliant gel polish brand with confidence."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'CPNP Compliance Support' }
      ]}
      showCTA={true}
      ctaText="Get Free Consultation"
      ctaLink="#consultation-form"
      heroImage="/img/hero/certifications-compliance-hero.jpg"
    >
      {/* How We Make EU Compliance Simple */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          How We Make EU Compliance Simple
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* What We Handle */}
          <div className="card p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              What We Handle
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li><strong>Formulation:</strong> EU-compliant gel polish formulas</li>
              <li><strong>Safety Assessment (CPSR):</strong> Conducted by qualified safety assessors</li>
              <li><strong>Product Information File (PIF):</strong> Complete documentation package</li>
              <li><strong>Manufacturing:</strong> GMP-certified production facility</li>
              <li><strong>Quality Control:</strong> Batch testing and certification</li>
              <li><strong>Label Compliance Review:</strong> Ensure your labels meet EU requirements</li>
              <li><strong>Technical Support:</strong> Guidance through the CPNP submission process</li>
            </ul>
          </div>

          {/* What You Handle */}
          <div className="card p-6 border-l-4 border-primary">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="text-primary" size={24} />
              What You Handle
            </h3>
            <ul className="space-y-3 text-gray-600 mb-4">
              <li><strong>CPNP Account:</strong> Create your free business account on the CPNP portal</li>
              <li><strong>Responsible Person (RP):</strong> Appoint an EU-based RP (we can recommend partners)</li>
              <li><strong>CPNP Submission:</strong> Upload our documentation and submit the notification</li>
              <li><strong>Brand & Marketing:</strong> Your brand identity, website, and marketing strategy</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>💡 Pro Tip:</strong> We provide step-by-step guides and can recommend trusted Responsible Person services in the EU.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 9-Step Process */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          9-Step Process: From Inquiry to Market Launch
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {processSteps.map((step) => (
            <div key={step.number} className="card p-6 text-center hover:shadow-lg transition-shadow border-t-4 border-primary">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg mb-4">
                {step.number}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded mt-8 flex gap-3">
          <Clock className="text-green-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <p className="text-gray-700">
              <strong>⏱️ Timeline:</strong> CPSR + PIF preparation takes 3-5 weeks. Production runs in parallel, so your products can ship as soon as documentation is ready and you've completed CPNP submission.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance & Quality */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Compliance & Quality Certifications
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        
        <div className="flex flex-wrap gap-3 mt-6">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold">
              {cert}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mt-8">
          <h4 className="font-semibold text-gray-900 mb-3">What Makes Our Process Reliable?</h4>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Qualified Safety Assessors:</strong> All CPSRs conducted by toxicologists with EU-recognized qualifications</li>
            <li><strong>Proven Track Record:</strong> Successfully supported hundreds of private label brands across EU markets</li>
            <li><strong>Up-to-Date Compliance:</strong> Formulas regularly reviewed against latest EU restrictions and CosIng database</li>
            <li><strong>Transparent Documentation:</strong> Full ingredient disclosure, INCI lists, and safety data sheets provided</li>
          </ul>
        </div>

        <div className="mt-6">
          <p className="font-semibold text-gray-900 mb-3">Documents You'll Receive:</p>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li>Cosmetic Product Safety Report (CPSR) for each formula</li>
            <li>Complete Product Information File (PIF)</li>
            <li>Certificate of Analysis (CoA) for each production batch</li>
            <li>GMP Certificate</li>
            <li>MSDS (Material Safety Data Sheet)</li>
            <li>CPNP submission guide with screenshots</li>
          </ul>
        </div>
      </div>

      {/* International Markets */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Supported International Markets
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 mb-6">Our CPNP documentation package supports compliance for:</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {markets.map((market, index) => (
            <div key={index} className="card p-4 text-center hover:border-primary transition-colors">
              <div className="text-3xl mb-2">{market.flag}</div>
              <p className="text-sm font-semibold text-gray-700">{market.name}</p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded mt-8 flex gap-3">
          <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <p className="text-gray-700">
              <strong>⚠️ Important:</strong> UK requires separate SCPN registration post-Brexit. Our documentation supports both EU CPNP and UK SCPN—you'll need to submit to both portals if selling in UK + EU.
            </p>
          </div>
        </div>
      </div>

      {/* MOQs, Timelines & Production Capacity */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          MOQs, Timelines & Production Capacity
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Minimum Order Quantities</h3>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li><strong>Stock Colors:</strong> 500 units per shade</li>
              <li><strong>Custom Color Development:</strong> 1,000 units per shade</li>
              <li><strong>Total Order:</strong> Minimum 2,000 units (mix & match allowed)</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Bottle Sizes Available</h3>
            <ul className="space-y-2 text-gray-600">
              <li>7ml, 8ml, 10ml, 11ml, 15ml</li>
              <li>Custom sizes available for orders &gt;10,000 units</li>
            </ul>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Timelines</h3>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li><strong>CPSR/PIF Preparation:</strong> 3-5 weeks</li>
              <li><strong>Production (stock colors):</strong> 4-6 weeks</li>
              <li><strong>Production (custom colors):</strong> 6-8 weeks</li>
              <li><strong>Shipping:</strong> 2-4 weeks (by sea) / 5-7 days (by air)</li>
            </ul>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-6">
              <p className="text-sm text-gray-700">
                <strong>📦 Production Capacity:</strong> We can fulfill orders up to 100,000 units per month across all clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Frequently Asked Questions
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        
        <div className="space-y-4 mt-8">
          {faqs.map((faq, index) => (
            <div key={index} className="card p-6 border-l-4 border-primary">
              <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Form */}
      <div id="consultation-form" className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Request Free CPNP Compliance Consultation
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-center text-gray-600 mb-8">Fill out the form below and our compliance team will contact you within 24 hours.</p>
        
        <div className="max-w-3xl mx-auto card p-8">
          <form action="/thank-you-compliance-consultation" method="POST" className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                Business/Brand Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                Country <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="targetMarket" className="block text-sm font-semibold text-gray-700 mb-2">
                Target Market(s)
              </label>
              <select
                id="targetMarket"
                name="targetMarket"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">Select target market</option>
                <option value="EU">European Union (EU)</option>
                <option value="UK">United Kingdom</option>
                <option value="EU+UK">EU + UK</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="orderQuantity" className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Order Quantity
              </label>
              <select
                id="orderQuantity"
                name="orderQuantity"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">Select quantity range</option>
                <option value="500-1000">500 - 1,000 units</option>
                <option value="1000-5000">1,000 - 5,000 units</option>
                <option value="5000-10000">5,000 - 10,000 units</option>
                <option value="10000+">10,000+ units</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Details / Questions
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell us about your project, timeline, and any specific requirements..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors resize-vertical"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-lg transition-all hover:shadow-lg"
            >
              Submit Consultation Request
            </button>

            <p className="text-sm text-gray-600 text-center">
              By submitting this form, you agree to be contacted by Leeukopf Laboratories regarding your inquiry.
            </p>
          </form>
        </div>
      </div>
    </PageTemplate>
  );
}
