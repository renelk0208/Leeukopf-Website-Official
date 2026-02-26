const fs = require('fs')
const path = require('path')

const repoRoot = path.join(__dirname, '..')
const b2bRoot = path.join(repoRoot, 'public', 'img', 'b2b')
const productsCsvPath = path.join(repoRoot, 'public', 'products.csv')

const requiredColumns = ['category', 'subcategory', 'product_name', 'code', 'size', 'unit', 'moq', 'price', 'image_url', 'notes', 'active']

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
  return cells
}

function csvEscape(value) {
  const normalized = String(value ?? '')
  return `"${normalized.replace(/"/g, '""')}"`
}

function isImageFile(name) {
  return /\.(webp|png|jpe?g)$/i.test(name)
}

function normalizeCodeFromFileName(filePath) {
  const base = path.basename(filePath, path.extname(filePath)).trim()
  if (!base) return ''
  if (!/[0-9]/.test(base)) return ''
  return base
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return []

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath))
      return
    }

    if (entry.isFile() && isImageFile(entry.name)) {
      files.push(fullPath)
    }
  })

  return files
}

function inferCategoryData(relativePath) {
  const normalizedPath = relativePath.split(path.sep).join('/').toLowerCase()

  if (normalizedPath.startsWith('polygels/liquid-polygel/')) {
    return { category: 'Builder Gel', subcategory: 'Liquid Polygel', size: '30', unit: 'g', moq: '100' }
  }

  if (normalizedPath.startsWith('polygels/polygel/')) {
    return { category: 'Polygel', subcategory: 'Polygel', size: '30', unit: 'g', moq: '100' }
  }

  if (normalizedPath.startsWith('builder-gels/') || normalizedPath.startsWith('brush-on-builder/')) {
    if (normalizedPath.includes('fiberglass') || normalizedPath.includes('fibreglass') || normalizedPath.includes('fiber-glass')) {
      return { category: 'Builder Gel', subcategory: 'Fiberglass', size: '15', unit: 'ml', moq: '25' }
    }

    if (normalizedPath.includes('biab') || normalizedPath.startsWith('brush-on-builder/')) {
      return { category: 'Builder Gel', subcategory: 'BIAB', size: '15', unit: 'ml', moq: '25' }
    }

    if (normalizedPath.includes('acrylic')) {
      return { category: 'Builder Gel', subcategory: 'Acrylics', size: '15', unit: 'ml', moq: '25' }
    }

    if (normalizedPath.includes('3-in-1') || normalizedPath.includes('3 in 1')) {
      return { category: 'Builder Gel', subcategory: '3-in-1', size: '15', unit: 'ml', moq: '25' }
    }

    return { category: 'Builder Gel', subcategory: 'Builder Gel', size: '15', unit: 'ml', moq: '25' }
  }

  if (normalizedPath.startsWith('bases/') || normalizedPath.startsWith('tops-bases/')) {
    if (normalizedPath.includes('rubber')) {
      return { category: 'Top & Base', subcategory: 'Rubber Bases', size: '15', unit: 'ml', moq: '1' }
    }

    if (normalizedPath.includes('classic')) {
      return { category: 'Top & Base', subcategory: 'Classic Base', size: '15', unit: 'ml', moq: '1' }
    }

    return { category: 'Top & Base', subcategory: 'Extra Strength Base', size: '15', unit: 'ml', moq: '1' }
  }

  if (normalizedPath.startsWith('solid-colours/')) {
    return { category: 'Gel Polish', subcategory: 'Solid Colours', size: '10', unit: 'ml', moq: '6' }
  }

  return null
}

function rowKey(row) {
  return `${(row.category || '').trim().toUpperCase()}::${(row.code || '').trim().toUpperCase()}`
}

function readCsvRows() {
  if (!fs.existsSync(productsCsvPath)) {
    throw new Error('Missing public/products.csv')
  }

  const content = fs.readFileSync(productsCsvPath, 'utf8')
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length === 0) {
    throw new Error('public/products.csv is empty')
  }

  const header = parseCsvLine(lines[0]).map((cell) => cell.trim())
  const missing = requiredColumns.filter((column) => !header.includes(column))
  if (missing.length > 0) {
    throw new Error(`public/products.csv is missing required columns: ${missing.join(', ')}`)
  }

  const idx = Object.fromEntries(header.map((name, index) => [name, index]))

  const rows = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line)
    return Object.fromEntries(header.map((name) => [name, cells[idx[name]] ?? '']))
  })

  return { header, rows }
}

function buildGeneratedRows() {
  const files = walkFiles(b2bRoot)
  const generatedByKey = new Map()

  files.forEach((absolutePath) => {
    const relFromB2B = path.relative(b2bRoot, absolutePath)
    const categoryData = inferCategoryData(relFromB2B)
    if (!categoryData) return

    if (relFromB2B.toLowerCase().startsWith('categories/')) return

    const code = normalizeCodeFromFileName(absolutePath)
    if (!code) return

    const imageUrl = `/img/b2b/${relFromB2B.split(path.sep).join('/')}`
    const key = `${categoryData.category}::${code.toUpperCase()}`
    if (generatedByKey.has(key)) return

    generatedByKey.set(key, {
      category: categoryData.category,
      subcategory: categoryData.subcategory,
      product_name: code,
      code,
      size: categoryData.size,
      unit: categoryData.unit,
      moq: categoryData.moq,
      price: '0',
      image_url: imageUrl,
      notes: 'AUTO_B2B_FROM_IMAGE',
      active: 'TRUE',
    })
  })

  return Array.from(generatedByKey.values())
}

function writeCsv(header, rows) {
  const outputLines = [header.map(csvEscape).join(',')]
  rows.forEach((row) => {
    outputLines.push(header.map((column) => csvEscape(row[column] ?? '')).join(','))
  })

  fs.writeFileSync(productsCsvPath, `${outputLines.join('\n')}\n`, 'utf8')
}

function main() {
  const { header, rows } = readCsvRows()
  const preservedRows = rows.filter((row) => row.notes !== 'AUTO_B2B_FROM_IMAGE')
  const generatedRows = buildGeneratedRows()

  const routeSeedRows = [
    {
      category: 'Builder Gel',
      subcategory: 'Acrylics',
      product_name: 'Acrylic Builder Seed',
      code: 'AUTO-ACY-ROUTE-01',
      size: '15',
      unit: 'ml',
      moq: '25',
      price: '0',
      image_url: '',
      notes: 'AUTO_B2B_ROUTE_SEED',
      active: 'TRUE',
    },
    {
      category: 'Builder Gel',
      subcategory: 'Fiberglass',
      product_name: 'Fiberglass Builder Seed',
      code: 'AUTO-FG-ROUTE-01',
      size: '15',
      unit: 'ml',
      moq: '25',
      price: '0',
      image_url: '',
      notes: 'AUTO_B2B_ROUTE_SEED',
      active: 'TRUE',
    },
    {
      category: 'Top & Base',
      subcategory: 'Rubber Bases',
      product_name: 'Rubber Base Seed',
      code: 'AUTO-RB-ROUTE-01',
      size: '15',
      unit: 'ml',
      moq: '1',
      price: '0',
      image_url: '',
      notes: 'AUTO_B2B_ROUTE_SEED',
      active: 'TRUE',
    },
    {
      category: 'Top & Base',
      subcategory: 'Classic Base',
      product_name: 'Classic Base Seed',
      code: 'AUTO-CB-ROUTE-01',
      size: '15',
      unit: 'ml',
      moq: '1',
      price: '0',
      image_url: '',
      notes: 'AUTO_B2B_ROUTE_SEED',
      active: 'TRUE',
    },
  ]

  const mergedByKey = new Map()
  preservedRows.forEach((row) => mergedByKey.set(rowKey(row), row))
  generatedRows.forEach((row) => mergedByKey.set(rowKey(row), row))
  routeSeedRows.forEach((row) => {
    if (!mergedByKey.has(rowKey(row))) {
      mergedByKey.set(rowKey(row), row)
    }
  })

  const merged = Array.from(mergedByKey.values())
  writeCsv(header, merged)

  console.log(`✅ Generated ${generatedRows.length} B2B product rows from public/img/b2b into public/products.csv`) 
}

main()
