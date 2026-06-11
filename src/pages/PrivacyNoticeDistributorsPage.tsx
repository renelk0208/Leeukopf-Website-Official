import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';

export default function PrivacyNoticeDistributorsPage() {
  return (
    <PageTemplate
      title="Privacy Notice for Distributors"
      subtitle="How we handle personal data in our business relationships with distributors and partners."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Privacy Notice for Distributors' }
      ]}
      showCTA={false}
    >
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-gray max-w-none">
          {/* Last Updated */}
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: November 2024
          </p>

          {/* Introduction */}
          <section className="mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-6">
              <p className="text-gray-700 font-light leading-relaxed">
                This Privacy Notice is specifically for our B2B distributors, partners, and business contacts. It explains how Thermitek Ltd, an EU-based cosmetics manufacturer, collects, uses, and protects personal data in the context of our distributor relationships, in accordance with the General Data Protection Regulation (GDPR).
              </p>
            </div>
          </section>

          {/* 1. What Information We Collect */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">1. What Information We Collect</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              In the course of our distributor relationships, we may collect and process the following categories of personal data:
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Identity Information</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 font-light text-sm">
                  <li>Names of business owners, directors, and key contacts</li>
                  <li>Job titles and roles within your organisation</li>
                  <li>Authorised signatory information for contracts</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 font-light text-sm">
                  <li>Business email addresses</li>
                  <li>Phone numbers (office, mobile)</li>
                  <li>Business postal addresses</li>
                  <li>Website and social media handles</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Business Data</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 font-light text-sm">
                  <li>Company registration details and VAT numbers</li>
                  <li>Business licenses and certifications</li>
                  <li>Banking and payment information</li>
                  <li>Credit and financial references</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Operational Data</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 font-light text-sm">
                  <li>Order history and purchasing patterns</li>
                  <li>Delivery and logistics information</li>
                  <li>Communications and correspondence records</li>
                  <li>Support tickets and query history</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Digital Interactions</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-600 font-light text-sm">
                  <li>Access logs for distributor portals (if applicable)</li>
                  <li>Email opens and engagement (marketing communications)</li>
                  <li>Website activity when logged into distributor areas</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How We Use Distributor Data */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">2. How We Use Distributor Data</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We process distributor personal data for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Onboarding and Account Setup:</strong> To establish and verify your distributor account, conduct due diligence, and set up trading arrangements.</li>
              <li><strong>Verification and Compliance:</strong> To verify business legitimacy, assess creditworthiness, and ensure compliance with applicable regulations.</li>
              <li><strong>Order Processing and Logistics:</strong> To process orders, arrange deliveries, manage inventory allocation, and handle returns or claims.</li>
              <li><strong>Financial Administration:</strong> To issue invoices, process payments, manage credit terms, and maintain accurate financial records.</li>
              <li><strong>Regulatory Compliance:</strong> To meet obligations under EU Cosmetic Regulation (1223/2009), including product traceability, recall procedures, and Responsible Person requirements.</li>
              <li><strong>Communication:</strong> To send order confirmations, shipping updates, product information, and important business notices.</li>
              <li><strong>Relationship Management:</strong> To maintain our business relationship, provide support, and address queries or concerns.</li>
            </ul>
          </section>

          {/* 3. Legal Basis for Processing */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">3. Legal Basis for Processing</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Under GDPR, we process distributor personal data on the following legal bases:
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-800 pl-4">
                <h4 className="font-semibold text-gray-900 mb-1">Contractual Necessity</h4>
                <p className="text-gray-600 font-light text-sm">
                  Most processing is necessary to perform our distributor agreement with you, including order fulfilment, invoicing, and communication about your account.
                </p>
              </div>

              <div className="border-l-4 border-blue-800 pl-4">
                <h4 className="font-semibold text-gray-900 mb-1">Legitimate Interest</h4>
                <p className="text-gray-600 font-light text-sm">
                  We have legitimate business interests in managing distributor relationships, conducting due diligence, preventing fraud, and improving our services.
                </p>
              </div>

              <div className="border-l-4 border-blue-800 pl-4">
                <h4 className="font-semibold text-gray-900 mb-1">Legal Obligation</h4>
                <p className="text-gray-600 font-light text-sm">
                  Certain processing is required by law, including tax records, cosmetic product traceability, and anti-money laundering requirements.
                </p>
              </div>

              <div className="border-l-4 border-blue-800 pl-4">
                <h4 className="font-semibold text-gray-900 mb-1">Consent</h4>
                <p className="text-gray-600 font-light text-sm">
                  For certain activities, such as marketing communications or sharing information beyond our contractual relationship, we will seek your explicit consent.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Retention Periods */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">4. Retention Periods</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We retain distributor personal data according to the following guidelines:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Data Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">Active Distributors</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">Duration of business relationship plus 7 years</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">Inactive Distributors</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">7 years from last transaction (for tax/legal purposes)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">Regulatory Documents</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">10 years after last batch placed on market (per EU Cosmetic Regulation)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">Communications</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">3 years for general correspondence; longer if related to disputes or regulatory matters</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">Marketing Preferences</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-light">Until consent is withdrawn or relationship ends</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Who Has Access */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">5. Who Has Access to Your Data</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Access to distributor personal data is strictly controlled:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li><strong>Thermitek Staff:</strong> Only employees who need access for their job functions (sales, operations, finance, compliance) can access your data. All staff receive data protection training.</li>
              <li><strong>GDPR-Compliant Processors:</strong> We use trusted third-party service providers who process data on our behalf, including:
                <ul className="list-circle pl-6 mt-2 space-y-1 text-sm">
                  <li>Cloud hosting and IT infrastructure providers</li>
                  <li>Accounting and ERP systems</li>
                  <li>Shipping and logistics partners</li>
                  <li>Email and communication platforms</li>
                </ul>
              </li>
              <li><strong>Professional Advisors:</strong> Accountants, lawyers, and auditors may access data when necessary for legal, tax, or compliance purposes.</li>
              <li><strong>Regulatory Authorities:</strong> We may be required to share data with authorities for tax, customs, or product safety investigations.</li>
            </ul>
            <p className="text-gray-600 font-light leading-relaxed mt-4">
              We do not sell distributor data to third parties.
            </p>
          </section>

          {/* 6. International Transfers */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">6. International Transfers and Safeguards</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Your data is primarily processed within the European Economic Area (EEA). Where we use service providers that may transfer data outside the EEA, we ensure appropriate safeguards are in place:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions for countries with equivalent data protection laws</li>
              <li>Binding Corporate Rules where applicable</li>
              <li>Vendor assessments to verify GDPR compliance</li>
            </ul>
          </section>

          {/* 7. Distributor Rights under GDPR */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">7. Your Rights under GDPR</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              As individuals within our distributor organisations, you have the following rights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Right of Access</h4>
                <p className="text-sm text-gray-600 font-light">Request a copy of personal data we hold about you.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Right to Correction</h4>
                <p className="text-sm text-gray-600 font-light">Request correction of inaccurate or incomplete data.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Right to Deletion</h4>
                <p className="text-sm text-gray-600 font-light">Request deletion of data (subject to legal retention requirements).</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Right to Object</h4>
                <p className="text-sm text-gray-600 font-light">Object to processing based on legitimate interests.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Right to Restriction</h4>
                <p className="text-sm text-gray-600 font-light">Request limitation of processing in certain circumstances.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Right to Portability</h4>
                <p className="text-sm text-gray-600 font-light">Receive your data in a structured, machine-readable format.</p>
              </div>
            </div>
            <p className="text-gray-600 font-light leading-relaxed mt-4">
              To exercise these rights, please contact us using the details below. We will respond within one month as required by GDPR.
            </p>
          </section>

          {/* 8. Security Measures */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">8. Security Measures</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We implement appropriate technical and organisational measures to protect distributor data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure access controls and authentication</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Staff training on data protection and security</li>
              <li>Incident response procedures for data breaches</li>
              <li>Physical security of premises and equipment</li>
            </ul>
          </section>

          {/* 9. Updates to This Notice */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">9. Updates to This Notice</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              We may update this Privacy Notice from time to time to reflect changes in our practices or legal requirements. Significant changes will be communicated to our active distributors. The current version will always be available on our website with the "Last Updated" date shown above.
            </p>
          </section>

          {/* 10. Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              For questions about this Privacy Notice or to exercise your data protection rights, please contact:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 font-medium mb-2">Thermitek Ltd</p>
              <p className="text-gray-600 font-light">Data Protection / Distributor Relations</p>
              <p className="text-gray-600 font-light mt-4">
                <strong>Address:</strong> [Company Address Placeholder]
              </p>
              <p className="text-gray-600 font-light">
                <strong>Email:</strong> [distributors@thermitek.com]
              </p>
              <p className="text-gray-600 font-light">
                <strong>Phone:</strong> [+XX XXX XXX XXXX]
              </p>
            </div>
            <p className="text-gray-600 font-light leading-relaxed mt-4">
              You also have the right to lodge a complaint with a Data Protection Authority if you believe we have not handled your data appropriately.
            </p>
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
                to="/distributors-wanted" 
                className="text-blue-800 hover:underline font-light"
              >
                Become a Distributor
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PageTemplate>
  );
}
