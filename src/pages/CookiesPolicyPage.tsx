import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';

export default function CookiesPolicyPage() {
  return (
    <PageTemplate
      title="Cookies Policy"
      subtitle="Learn how we use cookies to improve your browsing experience on our websites."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Cookies Policy' }
      ]}
      showCTA={false}
    >
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-gray max-w-none">
          {/* Last Updated */}
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: November 2024
          </p>

          {/* A) Introduction */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              This Cookies Policy explains how Thermitek Ltd uses cookies and similar technologies on our websites, including leeukopf.com and other brand platforms. We are committed to transparency about the technologies we use and providing you with control over your preferences in accordance with EU GDPR and ePrivacy requirements.
            </p>
          </section>

          {/* B) What Cookies Are */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">2. What Are Cookies?</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their site is being used.
            </p>
            <p className="text-gray-600 font-light leading-relaxed">
              Cookies do not typically contain personal information that identifies you directly, but they can be linked to personal data we hold about you. Some cookies are essential for the website to function, while others help us understand how visitors use our site or enable certain features.
            </p>
          </section>

          {/* C) Types of Cookies We Use */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We categorize our cookies as follows, aligned with our cookie consent system:
            </p>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Necessary Cookies</h3>
                <p className="text-sm text-green-700 mb-2 font-medium">Always Enabled</p>
                <p className="text-gray-600 font-light">
                  These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies as the website cannot function properly without them.
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-600 font-light text-sm">
                  <li>Session management</li>
                  <li>Cookie consent preferences</li>
                  <li>Security features</li>
                  <li>Load balancing</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-sm text-blue-700 mb-2 font-medium">Optional — Requires Consent</p>
                <p className="text-gray-600 font-light">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve our website's performance and user experience.
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-600 font-light text-sm">
                  <li>Page view statistics</li>
                  <li>Traffic sources and user journeys</li>
                  <li>Popular content and features</li>
                  <li>Error and performance tracking</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                <p className="text-sm text-blue-700 mb-2 font-medium">Optional — Requires Consent</p>
                <p className="text-gray-600 font-light">
                  These cookies are used to track visitors across websites to display relevant advertisements. They are set by advertising partners and may be used to build a profile of your interests.
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-600 font-light text-sm">
                  <li>Advertising and retargeting</li>
                  <li>Campaign measurement</li>
                  <li>Cross-site tracking</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-sm text-blue-700 mb-2 font-medium">Optional — Requires Consent</p>
                <p className="text-gray-600 font-light">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences or settings. They may be set by us or by third-party providers whose services we have added to our pages.
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-600 font-light text-sm">
                  <li>Language preferences</li>
                  <li>Regional settings</li>
                  <li>Video playback preferences</li>
                  <li>Chat and support widgets</li>
                </ul>
              </div>
            </div>
          </section>

          {/* D) How We Use Cookies */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">4. How We Use Cookies</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Security:</strong> To protect our website and users from security threats and fraudulent activity.</li>
              <li><strong>Remembering Preferences:</strong> To store your settings and preferences for a better browsing experience.</li>
              <li><strong>Analytics:</strong> To understand how visitors use our website (only when you have consented).</li>
              <li><strong>Improving Performance:</strong> To optimize website speed, reliability, and functionality.</li>
              <li><strong>Marketing Tracking:</strong> To measure the effectiveness of our advertising campaigns (only with your explicit consent).</li>
            </ul>
          </section>

          {/* E) What Data Cookies Store */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">5. What Data Cookies Store</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Cookies on our website may store the following types of data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li>Unique identifiers (randomly generated codes to recognize returning visitors)</li>
              <li>Session tokens for secure browsing</li>
              <li>Your cookie consent preferences</li>
              <li>Anonymised analytics data (page views, time on site, etc.)</li>
              <li>General geographic region (country or city level, not precise location)</li>
              <li>Device and browser type information</li>
            </ul>
            <p className="text-gray-600 font-light leading-relaxed mt-4">
              Analytics data is anonymised and aggregated wherever possible to protect your privacy.
            </p>
          </section>

          {/* F) Third-Party Cookies */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Cookies</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We may use services from third parties that set their own cookies. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Google Analytics:</strong> Website traffic analysis and user behavior insights. Only activated if you consent to Analytics cookies.</li>
              <li><strong>Meta Pixel (Facebook):</strong> Advertising and conversion tracking. Only activated if you consent to Marketing cookies.</li>
              <li><strong>TikTok Pixel:</strong> Campaign measurement and retargeting. Only activated if you consent to Marketing cookies.</li>
            </ul>
            <p className="text-gray-600 font-light leading-relaxed mt-4">
              These third-party cookies are only loaded after you provide consent through our cookie banner. You can manage your preferences at any time.
            </p>
          </section>

          {/* G) Cookie Duration */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">7. Cookie Duration</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Cookies can be categorized by how long they remain on your device:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Session Cookies</h4>
                <p className="text-sm text-gray-600 font-light">
                  Temporary cookies that are deleted when you close your browser. Used for session management and security.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Persistent Cookies</h4>
                <p className="text-sm text-gray-600 font-light">
                  Cookies that remain on your device for a set period (e.g., 1 month to 2 years). Used for preferences and analytics.
                </p>
              </div>
            </div>
          </section>

          {/* H) Managing Cookies */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">8. Managing Cookies</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              You have control over how cookies are used on our website:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Cookie Banner:</strong> When you first visit our website, you can accept, reject, or customize your cookie preferences through our cookie consent banner.</li>
              <li><strong>Manage Cookies Link:</strong> You can change your preferences at any time by clicking the "Manage Cookies" link in the website footer.</li>
              <li><strong>Withdraw Consent:</strong> You can withdraw your consent for non-essential cookies at any time through the cookie settings.</li>
            </ul>
            <p className="text-gray-600 font-light leading-relaxed mt-4">
              Note that rejecting certain cookies may affect the functionality of our website.
            </p>
          </section>

          {/* I) Disabling Cookies in Browser */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">9. Disabling Cookies in Your Browser</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings. You can usually:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li>View and delete existing cookies</li>
              <li>Block all cookies or specific types of cookies</li>
              <li>Set preferences for certain websites</li>
              <li>Enable private or incognito browsing mode</li>
            </ul>
            <p className="text-gray-600 font-light leading-relaxed mt-4">
              To manage cookies in your browser, please refer to your browser's help documentation or visit the browser's settings menu. Please note that blocking all cookies may prevent some parts of our website from functioning correctly.
            </p>
          </section>

          {/* J) Updates to This Policy */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">10. Updates to This Policy</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              We may update this Cookies Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Any updates will be posted on this page with a revised "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* K) Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              If you have any questions about this Cookies Policy or how we use cookies, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Thermitek Ltd</p>
              <p className="text-gray-600 font-light">Cookie and Privacy Enquiries</p>
              <p className="text-gray-600 font-light mt-4">
                <strong>Address:</strong> [Company Address Placeholder]
              </p>
              <p className="text-gray-600 font-light">
                <strong>Email:</strong> [privacy@thermitek.com]
              </p>
              <p className="text-gray-600 font-light">
                <strong>Phone:</strong> [+XX XXX XXX XXXX]
              </p>
            </div>
          </section>

          {/* Related Links */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/privacy-policy" 
                className="text-blue-800 hover:underline font-light"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms-of-use" 
                className="text-blue-800 hover:underline font-light"
              >
                Terms of Use
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PageTemplate>
  );
}
