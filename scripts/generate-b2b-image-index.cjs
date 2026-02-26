const fs = require('fs')
const path = require('path')

const repoRoot = path.join(__dirname, '..')
const publicRoot = path.join(repoRoot, 'public')
const outputPath = path.join(publicRoot, 'data', 'b2b-image-index.json')

const B2B_IMAGE_ROOT = path.join(publicRoot, 'img')

const EXCLUDED_TOP_LEVEL_DIRS = new Set([
  'brands',
  'certifications',
  'Certifications-And-Compliance',
  'factory',
  'Header',
  'hero',
  'instagram',
  'instagram-fallback',
  'Logos',
  'mixing',
  'placeholders',
  'private-label',
  'season',
  'source',
  'videos',
])

function toPosix(value) {
  return value.split(path.sep).join('/')
}

function isImageFile(fileName) {
  return /\.(webp|png|jpe?g)$/i.test(fileName)
}

function normalizeCodeKey(value) {
  return (value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function shouldSkipDirectory(absoluteDirPath) {
  const relPath = path.relative(B2B_IMAGE_ROOT, absoluteDirPath)
  if (!relPath || relPath.startsWith('..')) return false

  const [topLevelSegment] = relPath.split(path.sep)
  return EXCLUDED_TOP_LEVEL_DIRS.has(topLevelSegment)
}

function walkFiles(rootDir, currentDir = rootDir) {
  if (!fs.existsSync(currentDir)) return []

  const entries = fs.readdirSync(currentDir, { withFileTypes: true })
  const files = []

  entries.forEach((entry) => {
    const fullPath = path.join(currentDir, entry.name)
    if (entry.isDirectory()) {
      if (shouldSkipDirectory(fullPath)) return
      files.push(...walkFiles(rootDir, fullPath))
      return
    }

    if (!entry.isFile() || !isImageFile(entry.name)) return
    files.push(fullPath)
  })

  return files
}

function main() {
  const byCode = {}
  let totalImages = 0

  const imageFiles = walkFiles(B2B_IMAGE_ROOT)
  imageFiles.forEach((absoluteFilePath) => {
    const relFromPublic = toPosix(path.relative(publicRoot, absoluteFilePath))
    const urlPath = `/${relFromPublic}`
    const baseName = path.basename(absoluteFilePath, path.extname(absoluteFilePath))
    const codeKey = normalizeCodeKey(baseName)
    if (!codeKey) return

    if (!byCode[codeKey]) {
      byCode[codeKey] = []
    }

    if (!byCode[codeKey].includes(urlPath)) {
      byCode[codeKey].push(urlPath)
    }

    totalImages += 1
  })

  Object.keys(byCode).forEach((key) => {
    byCode[key].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  })

  const payload = {
    generatedAt: new Date().toISOString(),
    keys: Object.keys(byCode).length,
    totalImages,
    byCode,
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

  console.log(`✅ Generated B2B image index with ${payload.keys} code keys from ${totalImages} images`)
}

main()
