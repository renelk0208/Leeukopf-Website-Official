const fs = require('fs')
const path = require('path')
const { buildRedirectsFileContent } = require('./netlify-redirects.config.cjs')

const redirectsPath = path.join(__dirname, '..', 'public', '_redirects')
const nextContent = buildRedirectsFileContent()
const currentContent = fs.existsSync(redirectsPath)
  ? fs.readFileSync(redirectsPath, 'utf8')
  : ''

if (currentContent === nextContent) {
  console.log('✅ Netlify redirects already up to date.')
  process.exit(0)
}

fs.writeFileSync(redirectsPath, nextContent, 'utf8')
console.log(`✅ Netlify redirects generated at: ${redirectsPath}`)
