import PageTemplate from '../components/PageTemplate';

export default function TermsOfUsePage() {
  return (
    <PageTemplate
      title="Terms of Use"
      subtitle="Please read these terms carefully before using our services."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Terms of Use' }
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <p className="text-sm text-gray-600 font-light mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              By accessing and using the Leeukopf Laboratories website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Website</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              Our website is intended for use by businesses and professionals in the beauty industry. You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Intellectual Property</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Leeukopf Laboratories and is protected by international copyright laws. Unauthorized use of any materials may violate copyright, trademark, and other laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Product Information</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              We strive to provide accurate product descriptions and specifications. However, we do not warrant that product descriptions or other content on this website are accurate, complete, reliable, current, or error-free. Product images are for illustration purposes and may differ from actual products.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Business Relationships</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              Information submitted through client registration forms, contact forms, or other inquiry methods is subject to our privacy policy. We use this information solely to respond to your inquiries and establish potential business relationships.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              We are committed to protecting your privacy and complying with GDPR and other applicable data protection regulations. Your personal information is processed in accordance with our Privacy Policy. By using our website, you consent to the collection and use of information as outlined in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Links to Third-Party Websites</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              Our website may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of these websites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              To the fullest extent permitted by law, Leeukopf Laboratories shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your access to or use of or inability to access or use the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following the posting of changes constitutes your acceptance of such changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              These terms shall be governed by and construed in accordance with the laws of Bulgaria. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Bulgaria.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              If you have any questions about these Terms of Use, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-900 font-medium mb-2">Leeukopf Laboratories</p>
              <p className="text-gray-700 font-light">Email: info@leeukopf.com</p>
              <p className="text-gray-700 font-light">Website: www.leeukopf.com</p>
            </div>
          </section>
        </div>
      </div>
    </PageTemplate>
  );
}
