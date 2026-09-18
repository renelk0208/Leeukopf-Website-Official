const fs = require('fs')
const path = require('path')
const { buildRedirectsFileContent, redirectRules } = require('./netlify-redirects.config.cjs')

const redirectsPath = path.join(__dirname, '..', 'public', '_redirects')

function fail(message) {
  console.error(`❌ ${message}`)
  process.exit(1)
}

if (!fs.existsSync(redirectsPath)) {
  fail('Missing public/_redirects. Run node scripts/generate-netlify-redirects.cjs.')
}

const actualContent = fs.readFileSync(redirectsPath, 'utf8')
const expectedContent = buildRedirectsFileContent()

if (actualContent !== expectedContent) {
  fail('public/_redirects is out of sync with scripts/netlify-redirects.config.cjs. Run node scripts/generate-netlify-redirects.cjs.')
}

const catchAllIndex = redirectRules.findIndex((rule) => rule.from === '/*')
if (catchAllIndex === -1) {
  fail('Netlify redirect config must include the SPA catch-all rule.')
}

if (catchAllIndex !== redirectRules.length - 1) {
  fail('Netlify SPA catch-all must remain the last redirect rule.')
}

const apiRulesAfterCatchAll = redirectRules
  .slice(catchAllIndex + 1)
  .filter((rule) => rule.from.startsWith('/api/'))

if (apiRulesAfterCatchAll.length > 0) {
  fail('API redirect rules must appear before the SPA catch-all rule.')
}

console.log(`✅ Netlify redirects validation passed (${redirectRules.length} rules checked).`)
