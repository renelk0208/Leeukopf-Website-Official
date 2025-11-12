import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Ready to create your private label brand? Contact us today for personalized consulting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 sm:p-10 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">Address</h4>
                    <p className="text-gray-600 leading-relaxed font-light">
                      Zelendolsko shose 30<br />
                      Blagoevgrad 2700<br />
                      Bulgaria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">Phone</h4>
                    <a
                      href="tel:+35973891041"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      (+359) 73 891 041
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">Email</h4>
                    <a
                      href="mailto:info@leeukopf.com"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      info@leeukopf.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-gray-900 font-semibold mb-4">Business Hours</h4>
              <div className="space-y-2 text-gray-600 font-light">
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

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Send Us a Message</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Private Label Inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block p-8 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-2 font-light">
              Need immediate assistance? Call us directly or visit our facility in Blagoevgrad, Bulgaria
            </p>
            <p className="text-gray-900 font-semibold">
              We're here to help bring your private label brand to life
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
