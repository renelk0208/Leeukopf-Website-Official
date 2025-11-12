import PageTemplate from '../components/PageTemplate';
import Contact from '../components/Contact';

export default function ContactPage() {
  return (
    <PageTemplate
      title="Contact Us"
      subtitle="Get in touch with our team for inquiries, orders, or partnership opportunities."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Contact' }
      ]}
    >
      <Contact />
    </PageTemplate>
  );
}
