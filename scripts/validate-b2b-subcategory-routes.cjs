const fs = require('fs')
const path = require('path')

const repoRoot = path.join(__dirname, '..')
const productsCsvPath = path.join(repoRoot, 'public', 'products.csv')

function fail(message) {
  console.error(`❌ ${message}`)
  process.exit(1)
}

function parseCsvLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      cells.push(current)
      current = ''
      continue
    }

    current += char
  }

  cells.push(current)
  return cells.map((cell) => cell.trim())
}

function isActive(value) {
  return String(value || '').trim().toUpperCase() === 'TRUE'
}

function toSearchBlob(row) {
  return `${row.category} ${row.subcategory} ${row.product_name} ${row.code}`.toLowerCase()
}

const routeChecks = [
  {
    routePath: '/b2b/builder-gels/acrylics',
    test: (blob) => blob.includes('acrylic'),
  },
  {
    routePath: '/b2b/builder-gels/3-in-1-builder-gels',
    test: (blob) => blob.includes('3-in-1') || blob.includes('3 in 1'),
  },
  {
    routePath: '/b2b/builder-gels/3-in-1-fibreglass-gel',
    test: (blob) =>
      blob.includes('fiberglass') || blob.includes('fibreglass') || blob.includes('fiber glass') || blob.includes('fibre glass'),
  },
  {
    routePath: '/b2b/builder-gels/biab',
    test: (blob) => blob.includes('biab') || blob.includes('builder in a bottle'),
  },
  {
    routePath: '/b2b/polygels/polygel',
    test: (blob) => blob.includes('polygel') && !blob.includes('liquid polygel'),
  },
  {
    routePath: '/b2b/polygels/liquid-polygel',
    test: (blob) => blob.includes('liquid polygel'),
  },
  {
    routePath: '/b2b/extra-strength-bases/rubber-bases',
    test: (blob) => blob.includes('rubber') && blob.includes('base'),
  },
  {
    routePath: '/b2b/extra-strength-bases/classic-base',
    test: (blob) => blob.includes('classic') && blob.includes('base'),
  },
  {
    routePath: '/b2b/extra-strength-bases/extra-strength-base',
    test: (blob) => blob.includes('extra strength') && blob.includes('base'),
  },
  {
    routePath: '/b2b/extra-strength-bases',
    test: (blob) => blob.includes('extra strength') && blob.includes('base'),
  },
]

function readActiveRows() {
  if (!fs.existsSync(productsCsvPath)) {
    fail('Missing public/products.csv required for B2B subcategory route validation')
  }

  const content = fs.readFileSync(productsCsvPath, 'utf8')
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    fail('public/products.csv must include a header and at least one row')
  }

  const header = parseCsvLine(lines[0])
  const requiredColumns = ['category', 'subcategory', 'product_name', 'code', 'active']
  const missing = requiredColumns.filter((column) => !header.includes(column))
  if (missing.length > 0) {
    fail(`public/products.csv is missing required columns: ${missing.join(', ')}`)
  }

  const idx = Object.fromEntries(header.map((column, index) => [column, index]))

  return lines
    .slice(1)
    .map((line) => {
      const row = parseCsvLine(line)
      return {
        category: row[idx.category] || '',
        subcategory: row[idx.subcategory] || '',
        product_name: row[idx.product_name] || '',
        code: row[idx.code] || '',
        active: row[idx.active] || '',
      }
    })
    .filter((row) => isActive(row.active))
}

function main() {
  const activeRows = readActiveRows()

  const failures = []
  const results = []

  routeChecks.forEach((check) => {
    const matchCount = activeRows.filter((row) => check.test(toSearchBlob(row))).length
    results.push({ routePath: check.routePath, matchCount })
    if (matchCount === 0) {
      failures.push(`No active CSV rows matched required route: ${check.routePath}`)
    }
  })

  if (failures.length > 0) {
    console.error('❌ B2B subcategory route validation failed:')
    failures.forEach((message) => console.error(`  - ${message}`))
    process.exit(1)
  }

  const summary = results.map((item) => `${item.routePath} (${item.matchCount})`).join(', ')
  console.log(`✅ B2B subcategory route validation passed: ${summary}`)
}

main()