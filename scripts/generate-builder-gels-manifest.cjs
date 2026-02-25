const fs = require('fs')
const path = require('path')

const repoRoot = path.join(__dirname, '..')
const builderGelsRoot = path.join(repoRoot, 'public', 'img', 'builder-gels')
const manifestPath = path.join(repoRoot, 'public', 'data', 'builder-gels-manifest.json')

function toTitleCase(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(' ')
}

function toPosixPath(value) {
  return value.split(path.sep).join('/')
}

function getSubcategoryFromRelativePath(relativeDir) {
  const normalized = toPosixPath(relativeDir || '')
  if (!normalized || normalized === '.') return 'Builder Gel'

  const parts = normalized.split('/').filter(Boolean)
  if (parts.length === 1 && parts[0] === '3-in-1-builder') {
    return '3-in-1 Builder Gels'
  }

  const leaf = parts[parts.length - 1]
  return toTitleCase(leaf)
}

function isImageFile(fileName) {
  return /\.(webp|png|jpe?g)$/i.test(fileName)
}

function walkDir(dirPath, relativeDir = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const files = []

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name)
    const relativePath = path.join(relativeDir, entry.name)

    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath, relativePath))
      return
    }

    if (!entry.isFile() || !isImageFile(entry.name)) {
      return
    }

    files.push(relativePath)
  })

  return files
}

function makeManifestEntry(relativeFilePath) {
  const normalized = toPosixPath(relativeFilePath)
  const ext = path.extname(normalized)
  const code = path.basename(normalized, ext).trim()
  const relativeDir = path.dirname(normalized)
  const subcategory = getSubcategoryFromRelativePath(relativeDir)

  return {
    category: 'Builder Gel',
    subcategory,
    product_name: code,
    code,
    size: '',
    unit: '',
    moq: '1',
    image_url: `/img/builder-gels/${normalized}`,
    active: 'TRUE',
  }
}

function main() {
  if (!fs.existsSync(builderGelsRoot)) {
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
    fs.writeFileSync(manifestPath, '[]\n', 'utf8')
    console.log('ℹ️ Builder gels image root missing; wrote empty manifest')
    return
  }

  const files = walkDir(builderGelsRoot)
  const byCode = new Map()

  files.forEach((relativeFilePath) => {
    const entry = makeManifestEntry(relativeFilePath)
    if (!entry.code) return
    if (!byCode.has(entry.code)) {
      byCode.set(entry.code, entry)
    }
  })

  const manifest = Array.from(byCode.values()).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }))

  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  console.log(`✅ Generated builder gels manifest with ${manifest.length} items`) 
}

main()