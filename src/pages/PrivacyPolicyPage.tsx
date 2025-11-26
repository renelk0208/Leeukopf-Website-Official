import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';

export default function PrivacyPolicyPage() {
  return (
    <PageTemplate
      title="Privacy Policy"
      subtitle="Your privacy matters to us. This policy explains how Thermitek Ltd handles your personal data."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Privacy Policy' }
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
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Thermitek Ltd ("we", "us", "our") is an EU-based cosmetics manufacturer operating websites including leeukopf.com and other brand platforms. We are committed to protecting and respecting your privacy in accordance with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
            </p>
            <p className="text-gray-600 font-light leading-relaxed">
              This Privacy Policy explains how we collect, use, store, and protect your personal data when you interact with our websites, products, and services. By using our websites or services, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>

          {/* B) Data We Collect */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">2. Data We Collect</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We may collect the following categories of personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Contact Form Submissions:</strong> Name, email address, phone number, company name, and any message content you provide.</li>
              <li><strong>Private Label Inquiries:</strong> Business details, product requirements, branding preferences, and contact information.</li>
              <li><strong>Basic Analytics and Cookies:</strong> IP address, browser type, device information, pages visited, and interaction data (as per our cookie consent system).</li>
              <li><strong>Social Media Interactions:</strong> Information from embedded content or when you interact with our social media presence.</li>
              <li><strong>Technical Logs:</strong> Server logs for security, error tracking, and system maintenance purposes.</li>
              <li><strong>Newsletter Sign-ups:</strong> Email address and preferences if you subscribe to our communications.</li>
            </ul>
          </section>

          {/* C) How We Use Your Data */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Data</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We process your personal data for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Responding to Inquiries:</strong> To answer your questions and provide customer support.</li>
              <li><strong>Product and Regulatory Information:</strong> To provide information about our products, including safety data and compliance documentation.</li>
              <li><strong>Distributor and Partner Relationships:</strong> To manage business relationships, process orders, and maintain communication.</li>
              <li><strong>Website Performance:</strong> To improve our website functionality, user experience, and content.</li>
              <li><strong>Security and Fraud Prevention:</strong> To protect our systems, detect suspicious activity, and prevent unauthorized access.</li>
              <li><strong>Legal and Regulatory Compliance:</strong> To meet obligations under EU Cosmetic Regulation (1223/2009) including documentation retention and product traceability.</li>
            </ul>
          </section>

          {/* D) Legal Basis (GDPR) */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Under GDPR, we process personal data based on the following legal grounds:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Consent:</strong> Where you have given explicit consent for specific purposes, such as receiving marketing communications or enabling non-essential cookies.</li>
              <li><strong>Contractual Necessity:</strong> Where processing is necessary to fulfil a contract with you or to take steps at your request before entering into a contract.</li>
              <li><strong>Legitimate Interest:</strong> Where we have a legitimate business interest that does not override your rights, such as improving our services or preventing fraud.</li>
              <li><strong>Legal Obligation:</strong> Where we are required by law to process data, such as for tax records, cosmetic regulation compliance, or responding to legal requests.</li>
            </ul>
          </section>

          {/* E) Data Sharing */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We are committed to protecting your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>We do NOT sell your data.</strong> Your personal information is never sold to third parties for marketing or any other purposes.</li>
              <li><strong>GDPR-Compliant Processors:</strong> We may share data with trusted service providers who process data on our behalf (e.g., hosting providers, email services, analytics tools). All processors are contractually bound to GDPR standards.</li>
              <li><strong>Internal Access:</strong> Access to personal data within Thermitek Ltd is restricted to staff members who need it for operational purposes and who are trained in data protection.</li>
            </ul>
          </section>

          {/* F) International Transfers */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">6. International Transfers</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Where we use tools or services that may transfer data outside the European Economic Area (EEA), we ensure appropriate safeguards are in place. This includes Standard Contractual Clauses (SCCs) approved by the European Commission and working only with vendors who demonstrate GDPR compliance and adequate data protection standards.
            </p>
          </section>

          {/* G) Data Retention */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We retain personal data only as long as necessary for the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Inquiry Data:</strong> Contact form submissions and general inquiries are retained for 12–24 months unless longer retention is required for ongoing business relationships.</li>
              <li><strong>Regulatory and Production Data:</strong> Product safety documentation and compliance records are retained as required by EU Cosmetic Regulation and other applicable laws (typically 10 years after the last batch is placed on the market).</li>
              <li><strong>Analytics Data:</strong> Website analytics data is anonymised and aggregated where possible.</li>
              <li><strong>Cookies:</strong> Cookie data retention periods vary by type and are managed according to your preferences.</li>
            </ul>
          </section>

          {/* H) Your Rights under GDPR */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">8. Your Rights under GDPR</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              As a data subject, you have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Right of Access:</strong> You can request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Correction:</strong> You can ask us to correct inaccurate or incomplete data.</li>
              <li><strong>Right to Deletion:</strong> You can request that we delete your personal data (subject to legal obligations).</li>
              <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you can withdraw it at any time.</li>
              <li><strong>Right to Restriction:</strong> You can request that we limit how we use your data in certain circumstances.</li>
              <li><strong>Right to Portability:</strong> You can request your data in a structured, commonly used format to transfer to another service.</li>
              <li><strong>Right to Lodge a Complaint:</strong> You have the right to file a complaint with a Data Protection Authority in your country.</li>
            </ul>
            <p className="text-gray-600 font-light leading-relaxed mt-4">
              To exercise any of these rights, please contact us using the details provided below.
            </p>
          </section>

          {/* I) Cookies */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">9. Cookies</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Our website uses cookies to enhance your browsing experience. For detailed information about the cookies we use and how to manage them, please refer to our{' '}
              <Link to="/cookies-policy" className="text-blue-800 hover:underline">Cookies Policy</Link>.
            </p>
            <p className="text-gray-600 font-light leading-relaxed">
              Non-essential cookies (such as analytics and marketing cookies) are only activated with your explicit consent through our cookie banner.
            </p>
          </section>

          {/* J) Children's Data */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">10. Children's Data</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Our websites and services are not directed at children under the age of 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us immediately so we can delete it.
            </p>
          </section>

          {/* K) Updates to this Policy */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">11. Updates to This Policy</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* L) Contact Details */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">12. Contact Details</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Thermitek Ltd</p>
              <p className="text-gray-600 font-light">Data Protection Enquiries</p>
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
                to="/cookies-policy" 
                className="text-blue-800 hover:underline font-light"
              >
                Cookies Policy
              </Link>
              <Link 
                to="/terms-of-use" 
                className="text-blue-800 hover:underline font-light"
              >
                Terms of Use
              </Link>
              <Link 
                to="/privacy-notice-distributors" 
                className="text-blue-800 hover:underline font-light"
              >
                Privacy Notice for Distributors
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PageTemplate>
  );
}
