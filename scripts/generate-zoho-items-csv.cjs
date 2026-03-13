/**
 * generate-zoho-items-csv.cjs
 *
 * Generates a Zoho Items import CSV from all B2B product data sources:
 *   - public/products.csv         (Builder Gel, Polygel, Top & Base, Accessories, etc.)
 *   - public/data/builder-gels-manifest.json  (additional builder gel shades)
 *   - public/data/solid-1200.json (1200 solid gel polish colours)
 *
 * Usage:
 *   node scripts/generate-zoho-items-csv.cjs
 *
 * Output:
 *   zoho-items-<date>.csv  (in the project root)
 */

const fs = require('fs')
const path = require('path')

const repoRoot = path.join(__dirname, '..')

// ── CSV helpers ──────────────────────────────────────────────────────────────

function parseCsvLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  cells.push(current.trim())
  return cells
}

function csvEscape(value) {
  const v = String(value ?? '')
  if (v.includes(',') || v.includes('"') || v.includes('\n')) {
    return `"${v.replace(/"/g, '""')}"`
  }
  return v
}

// ── Packaging type helper ────────────────────────────────────────────────────

function packagingType(category, subcategory) {
  const cat = (category || '').toLowerCase()
  const sub = (subcategory || '').toLowerCase()

  if (cat.includes('builder gel') || cat === 'builder gel') {
    if (sub.includes('biab') || sub.includes('brush-on') || sub.includes('brush on')) return 'Jar'
    return 'Jar'
  }
  if (cat.includes('polygel')) {
    if (sub.includes('liquid')) return 'Tube'
    return 'Tube'
  }
  if (cat.includes('gel polish') || cat === 'gel polish') return 'Bottle'
  if (cat.includes('top') || cat.includes('base') || cat === 'top & base') return 'Bottle'
  return 'N/A'
}

// ── Load products.csv ────────────────────────────────────────────────────────

function loadProductsCsv() {
  const raw = fs.readFileSync(path.join(repoRoot, 'public', 'products.csv'), 'utf8')
  const lines = raw.split(/\r?\n/).filter(l => l.trim())

  const header = parseCsvLine(lines[0])
  const idx = Object.fromEntries(header.map((h, i) => [h.toLowerCase().trim(), i]))

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i])
    const row = {
      category:     cells[idx.category]     ?? '',
      subcategory:  cells[idx.subcategory]  ?? '',
      product_name: cells[idx.product_name] ?? '',
      code:         cells[idx.code]         ?? '',
      size:         cells[idx.size]         ?? '',
      unit:         cells[idx.unit]         ?? '',
      moq:          cells[idx.moq]          ?? '',
      image_url:    cells[idx.image_url]    ?? '',
      notes:        cells[idx.notes]        ?? '',
      active:       cells[idx.active]       ?? '',
    }

    // Skip route seeds and inactive items
    if (row.notes === 'AUTO_B2B_ROUTE_SEED') continue
    if (row.active.toUpperCase() !== 'TRUE') continue
    // Skip sample Gel Polish rows (non-LC codes) — solid-1200.json is authoritative for colours
    if (row.category === 'Gel Polish' && !row.code.toUpperCase().startsWith('LC')) continue

    rows.push(row)
  }

  return rows
}

// ── Load builder-gels-manifest.json ─────────────────────────────────────────

function loadBuilderGelsManifest() {
  const raw = fs.readFileSync(path.join(repoRoot, 'public', 'data', 'builder-gels-manifest.json'), 'utf8')
  const items = JSON.parse(raw)

  return (Array.isArray(items) ? items : []).filter(item => {
    return (item.active || '').toUpperCase() === 'TRUE' || item.active === true
  }).map(item => ({
    category:     item.category     || 'Builder Gel',
    subcategory:  item.subcategory  || '',
    product_name: item.product_name || item.code || '',
    code:         item.code         || '',
    size:         item.size         || '',
    unit:         item.unit         || 'g',
    moq:          String(item.moq   ?? 1),
    image_url:    item.image_url    || '',
    notes:        '',
    active:       'TRUE',
  }))
}

// ── Load solid-1200.json ─────────────────────────────────────────────────────

function loadSolidColours() {
  const raw = fs.readFileSync(path.join(repoRoot, 'public', 'data', 'solid-1200.json'), 'utf8')
    .replace(/^\uFEFF/, '') // strip UTF-8 BOM if present
  const items = JSON.parse(raw)

  return (Array.isArray(items) ? items : []).map(item => ({
    category:     'Gel Polish',
    subcategory:  'Solid Colours',
    product_name: item.Internal_SKU || '',
    code:         item.Internal_SKU || '',
    size:         '10',
    unit:         'ml',
    moq:          '25',
    image_url:    '',
    notes:        item.HEX || '',
    active:       'TRUE',
    hex:          item.HEX || '',
  }))
}

// ── Build Zoho row ───────────────────────────────────────────────────────────

const ZOHO_HEADER = [
  'Item Name',
  'SKU',
  'Unit',
  'Item Type',
  'Category',
  'Subcategory',
  'Description',
  'MOQ',
  'Size',
  'Packaging Type',
  'HEX Color',
  'Image URL',
]

function toZohoRow(item) {
  const pkg = packagingType(item.category, item.subcategory)

  // Description: include HEX for colour items, notes otherwise
  const desc = item.hex
    ? `Colour: ${item.hex}`
    : item.notes && item.notes !== 'AUTO_B2B_FROM_IMAGE'
      ? item.notes
      : ''

  // Unit: normalise
  const unitRaw = (item.unit || '').toLowerCase()
  const unit = unitRaw === 'ml' ? 'ml' : unitRaw === 'g' ? 'g' : 'pcs'

  return [
    item.product_name || item.code,
    item.code,
    unit,
    'Inventory',
    item.category,
    item.subcategory,
    desc,
    item.moq,
    item.size ? `${item.size}${unit}` : '',
    pkg,
    item.hex || '',
    item.image_url || '',
  ]
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('Loading products.csv...')
  const csvRows = loadProductsCsv()
  console.log(`  → ${csvRows.length} active products`)

  console.log('Loading builder-gels-manifest.json...')
  const manifestRows = loadBuilderGelsManifest()
  console.log(`  → ${manifestRows.length} manifest items`)

  console.log('Loading solid-1200.json...')
  const solidRows = loadSolidColours()
  console.log(`  → ${solidRows.length} solid colour items`)

  // Merge builder gels: CSV first, then manifest (skip codes already in CSV)
  const csvCodes = new Set(csvRows.map(r => r.code))
  const uniqueManifest = manifestRows.filter(r => !csvCodes.has(r.code))
  console.log(`  → ${uniqueManifest.length} manifest items not already in CSV (adding)`)

  // Merge solid colours: skip any that already exist in CSV by code
  const uniqueSolid = solidRows.filter(r => !csvCodes.has(r.code))
  console.log(`  → ${uniqueSolid.length} solid colour items not already in CSV (adding)`)

  const allItems = [...csvRows, ...uniqueManifest, ...uniqueSolid]
  console.log(`Total items: ${allItems.length}`)

  // Sort: category → subcategory → product_name
  allItems.sort((a, b) => {
    const catCmp = a.category.localeCompare(b.category)
    if (catCmp !== 0) return catCmp
    const subCmp = a.subcategory.localeCompare(b.subcategory)
    if (subCmp !== 0) return subCmp
    return (a.product_name || a.code).localeCompare(b.product_name || b.code, undefined, { numeric: true })
  })

  // Build CSV
  const csvLines = [
    ZOHO_HEADER.map(csvEscape).join(','),
    ...allItems.map(item => toZohoRow(item).map(csvEscape).join(',')),
  ]

  // UTF-8 BOM so Excel opens correctly
  const output = '\uFEFF' + csvLines.join('\n')

  const stamp = new Date().toISOString().slice(0, 10)
  const outPath = path.join(repoRoot, `zoho-items-${stamp}.csv`)
  fs.writeFileSync(outPath, output, 'utf8')

  console.log(`\n✅  Written to: ${outPath}`)
  console.log(`    ${allItems.length} items across ${new Set(allItems.map(r => r.category)).size} categories`)

  // Summary by category
  const byCat = {}
  allItems.forEach(r => { byCat[r.category] = (byCat[r.category] || 0) + 1 })
  Object.entries(byCat).sort(([a], [b]) => a.localeCompare(b)).forEach(([cat, count]) => {
    console.log(`    ${cat.padEnd(20)} ${count}`)
  })
}

main()
