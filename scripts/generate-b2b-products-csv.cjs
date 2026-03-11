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

function normalizeCodeFromFileName(filePath, requireNumber = true) {
  const base = path.basename(filePath, path.extname(filePath)).trim()
  if (!base) return ''
  if (requireNumber && !/[0-9]/.test(base)) return ''
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

  if (normalizedPath.startsWith('polygels/liquid-polygel/') || normalizedPath.startsWith('liquid-polygel/')) {
    return { category: 'Polygel', subcategory: 'Liquid Polygel', size: '15', unit: 'ml', moq: '25' }
  }

  if (normalizedPath.startsWith('polygels/polygel/')) {
    return { category: 'Polygel', subcategory: 'Polygel', size: '30', unit: 'g', moq: '100' }
  }

  if (normalizedPath.startsWith('builder-gels/') || normalizedPath.startsWith('brush-on-builder/')) {
    if (normalizedPath.includes('fiberglass') || normalizedPath.includes('fibreglass') || normalizedPath.includes('fiber-glass') || normalizedPath.includes('fiber glass')) {
      return { category: 'Builder Gel', subcategory: 'Fiberglass', size: '15', unit: 'ml', moq: '25' }
    }

    if (normalizedPath.includes('biab') || normalizedPath.startsWith('brush-on-builder/')) {
      return { category: 'Builder Gel', subcategory: 'BIAB', size: '15', unit: 'ml', moq: '25' }
    }

    if (normalizedPath.includes('acrylic')) {
      return { category: 'Builder Gel', subcategory: 'Acrylics', size: '15', unit: 'ml', moq: '25' }
    }

    if (normalizedPath.includes('colour-builder-gel')) {
      return { category: 'Builder Gel', subcategory: 'Colour Builder Gel', size: '15', unit: 'ml', moq: '25' }
    }

    if (normalizedPath.includes('master-builder-gels') || normalizedPath.includes('master-builder-gel')) {
      return { category: 'Builder Gel', subcategory: 'Master Builder Gels', size: '15', unit: 'ml', moq: '25' }
    }

    if (normalizedPath.includes('no-heat-builder') || normalizedPath.includes('no heat builder')) {
      return { category: 'Builder Gel', subcategory: 'No Heat Builder', size: '15', unit: 'ml', moq: '25' }
    }

    if (normalizedPath.includes('thixotropic')) {
      return { category: 'Builder Gel', subcategory: 'Thixotropic Gel', size: '15', unit: 'ml', moq: '25' }
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

    if (normalizedPath.includes('/tops/') || normalizedPath.includes('top-coat') || normalizedPath.includes('topcoat')) {
      return { category: 'Top & Base', subcategory: 'Top Coat', size: '15', unit: 'ml', moq: '1' }
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

function enforceBuilderGelPackagingRules(row) {
  if ((row.category || '').trim() !== 'Builder Gel') return row

  const normalizedUnit = (row.unit || '').trim().toLowerCase()
  const normalizedSize = String(row.size || '').trim()

  if (normalizedUnit === 'ml' && (normalizedSize === '10' || normalizedSize === '15')) {
    return {
      ...row,
      unit: 'ml',
      size: normalizedSize,
      moq: '25',
    }
  }

  if (normalizedUnit === 'g') {
    return {
      ...row,
      unit: 'g',
      size: '30',
      moq: '25',
    }
  }

  return row
}

function readCsvRows() {
  if (!fs.existsSync(productsCsvPath)) {
    throw new Error('Missing public/products.csv')
  }

  const content = fs.readFileSync(productsCsvPath, 'utf8')
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => {
      const stripped = line.replace(/^"|"$/, '')
      return !stripped.startsWith('<<<<<<<') && stripped !== '=======' && !stripped.startsWith('>>>>>>>')
    })
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

    const relFromB2BPosix = relFromB2B.split(path.sep).join('/').toLowerCase()
    if (relFromB2BPosix.startsWith('categories/')) return

    // All descriptive/letteronly image names are valid — never skip based on filename format
    const isDescriptivePolygel = relFromB2BPosix.startsWith('polygels/polygel/')
    const isDescriptiveTopsBase = relFromB2BPosix.startsWith('tops-bases/') || relFromB2BPosix.startsWith('bases/') || relFromB2BPosix.startsWith('brush-on-builder/')
    const isDescriptiveBuilderGel = relFromB2BPosix.startsWith('builder-gels/')
    const code = normalizeCodeFromFileName(absolutePath, !isDescriptivePolygel && !isDescriptiveTopsBase && !isDescriptiveBuilderGel)
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
      subcategory: '3-in-1',
      product_name: '3-in-1 Builder Gel Seed',
      code: 'AUTO-3IN1-ROUTE-01',
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
      subcategory: 'BIAB',
      product_name: 'Builder In A Bottle Seed',
      code: 'AUTO-BIAB-ROUTE-01',
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
      category: 'Polygel',
      subcategory: 'Polygel',
      product_name: 'Polygel Seed',
      code: 'AUTO-PG-ROUTE-01',
      size: '30',
      unit: 'g',
      moq: '100',
      price: '0',
      image_url: '',
      notes: 'AUTO_B2B_ROUTE_SEED',
      active: 'TRUE',
    },
    {
      category: 'Polygel',
      subcategory: 'Liquid Polygel',
      product_name: 'Liquid Polygel Seed',
      code: 'AUTO-LPG-ROUTE-01',
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
      subcategory: 'Extra Strength Base',
      product_name: 'Extra Strength Base Seed',
      code: 'AUTO-ESB-ROUTE-01',
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
    mergedByKey.set(rowKey(row), row)
  })

  const merged = Array.from(mergedByKey.values()).map(enforceBuilderGelPackagingRules)
  writeCsv(header, merged)

  console.log(`✅ Generated ${generatedRows.length} B2B product rows from public/img/b2b into public/products.csv`) 
}

main()
