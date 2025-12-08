import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // spam protection
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          honeypot: '',
        });
        
        // Reset success message after 5 seconds with cleanup
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
      console.error('Error sending contact form:', error);
    }
  };
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Get In Touch
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light px-2">
            Ready to create your private label brand? Contact us today for personalized consulting
          </p>
        </div>

        {/* Responsive grid - stacks on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Contact Information Card */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">Contact Information</h3>
              <div className="space-y-4 sm:space-y-6">
                {/* Contact items with responsive tap targets */}
                <div className="flex items-start space-x-3 sm:space-x-4 group">
                  <div className="p-2 sm:p-3 bg-white rounded-lg border border-gray-200 group-hover:border-primary transition-colors flex-shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-gray-900 font-semibold mb-1 text-sm sm:text-base">Head Office</h4>
                    <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
                      8 Racho Dimchev<br />
                      Sofia, Bulgaria<br />
                      1000
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 group">
                  <div className="p-2 sm:p-3 bg-white rounded-lg border border-gray-200 group-hover:border-primary transition-colors flex-shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-gray-900 font-semibold mb-1 text-sm sm:text-base">Factory Address</h4>
                    <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
                      Zelendolsko shose 30<br />
                      Blagoevgrad 2700<br />
                      Bulgaria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 group">
                  <div className="p-2 sm:p-3 bg-white rounded-lg border border-gray-200 group-hover:border-primary transition-colors flex-shrink-0">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-gray-900 font-semibold mb-1 text-sm sm:text-base">Phone</h4>
                    <a
                      href="tel:+35973891041"
                      className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base min-h-[44px] inline-flex items-center"
                    >
                      (+359) 73 891 041
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 group">
                  <div className="p-2 sm:p-3 bg-white rounded-lg border border-gray-200 group-hover:border-primary transition-colors flex-shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-gray-900 font-semibold mb-1 text-sm sm:text-base">Email</h4>
                    <a
                      href="mailto:info@leeukopf.com"
                      className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base break-all min-h-[44px] inline-flex items-center"
                    >
                      info@leeukopf.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <h4 className="text-gray-900 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Business Hours</h4>
              <div className="space-y-2 text-gray-600 font-light text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-gray-900 font-medium">8:30 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span className="text-gray-400">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-10">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">Send Us a Message</h3>
            
            {/* Success Message */}
            {status === 'success' && (
              <div className="mb-4 sm:mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm sm:text-base">
                  ✓ Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="mb-4 sm:mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm sm:text-base">
                  ✗ {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending'}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending'}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending'}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Private Label Inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  disabled={status === 'sending'}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              {/* Full width submit button with proper tap target */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom CTA - responsive */}
        <div className="mt-10 sm:mt-12 md:mt-16 text-center">
          <div className="inline-block p-6 sm:p-8 bg-gray-50 rounded-xl border border-gray-200 max-w-xl mx-auto">
            <p className="text-gray-600 mb-2 font-light text-sm sm:text-base">
              Need immediate assistance? Call us directly or visit our facility in Blagoevgrad, Bulgaria
            </p>
            <p className="text-gray-900 font-semibold text-sm sm:text-base">
              We're here to help bring your private label brand to life
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
