const redirectRules = [
  { from: '/api/contact-email', to: '/.netlify/functions/send-contact-email', status: 200 },
  { from: '/api/client-registration-email', to: '/.netlify/functions/client-registration-email', status: 200, force: true },
  { from: '/api/client-registration-email/*', to: '/.netlify/functions/client-registration-email/:splat', status: 200, force: true },
  { from: '/api/instagram', to: '/.netlify/functions/instagram-feed', status: 200 },
  { from: '/api/test-email', to: '/.netlify/functions/test-email', status: 200 },
  { from: '/api/submit-order', to: '/.netlify/functions/submit-order', status: 200 },
  { from: '/api/admin-client-invite', to: '/.netlify/functions/admin-client-invite', status: 200, force: true },
  { from: '/api/admin-client-registrations', to: '/.netlify/functions/admin-client-registrations', status: 200, force: true },
  { from: '/api/admin-client-registrations-backfill', to: '/.netlify/functions/admin-client-registrations-backfill', status: 200, force: true },
  { from: '/api/admin-b2b-orders', to: '/.netlify/functions/admin-b2b-orders', status: 200, force: true },
  { from: '/api/admin-create-admin', to: '/.netlify/functions/admin-create-admin', status: 200, force: true },
  { from: '/api/admin-client-access-reset', to: '/.netlify/functions/admin-client-access-reset', status: 200, force: true },
  { from: '/api/admin-update-registration', to: '/.netlify/functions/admin-update-registration', status: 200, force: true },
  { from: '/api/admin-resend-orders', to: '/.netlify/functions/admin-resend-orders', status: 200, force: true },
  { from: '/api/admin-verify-admin', to: '/.netlify/functions/admin-verify-admin', status: 200, force: true },
  { from: '/api/admin-list-staff', to: '/.netlify/functions/admin-list-staff', status: 200, force: true },
  { from: '/api/admin-update-staff', to: '/.netlify/functions/admin-update-staff', status: 200, force: true },
  { from: '/thank-you-compliance-consultation', to: '/thank-you-compliance-consultation.html', status: 200 },
  { from: '/seasonal/valentines', to: '/seasonal/valentines/index.html', status: 200 },
  { from: '/seasonal/valentines/', to: '/seasonal/valentines/index.html', status: 200 },
  { from: '/faq', to: '/faq-starting-a-gel-polish-brand', status: 301 },
  { from: '/our-products', to: '/products', status: 301 },
  { from: '/gelitup-distribution', to: '/our-brands', status: 301 },
  { from: '/certificates-compliance', to: '/certificates-and-compliance', status: 301 },
  {
    from: '/images/gmp_certified.png',
    to: '/img/Certifications-And-Compliance/GMP%20CERTIFICATE%202025-2026_page1.jpg',
    status: 301,
  },
  { from: '/*', to: '/index.html', status: 200 },
]

function formatRedirectRule(rule) {
  const forceSuffix = rule.force ? '!' : ''
  return `${rule.from} ${rule.to} ${rule.status}${forceSuffix}`
}

function buildRedirectsFileContent() {
  return `${redirectRules.map(formatRedirectRule).join('\n')}\n`
}

module.exports = {
  redirectRules,
  formatRedirectRule,
  buildRedirectsFileContent,
}
