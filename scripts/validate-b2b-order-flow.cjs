const fs = require('fs')
const path = require('path')

const repoRoot = path.join(__dirname, '..')

const files = {
  productsCsv: path.join(repoRoot, 'public', 'products.csv'),
  cartContext: path.join(repoRoot, 'src', 'b2b', 'store', 'B2BCartContext.tsx'),
  checkoutPage: path.join(repoRoot, 'src', 'b2b', 'pages', 'B2BCheckoutPage.tsx'),
  submitOrder: path.join(repoRoot, 'netlify', 'functions', 'submit-order.ts'),
}

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

function isTruthyActive(value) {
  return String(value || '').trim().toUpperCase() === 'TRUE'
}

function isB2BRelevantCategory(row) {
  const category = String(row.category || '').toLowerCase()
  const subcategory = String(row.subcategory || '').toLowerCase()
  const name = String(row.product_name || '').toLowerCase()
  const code = String(row.code || '').toLowerCase()
  const blob = `${category} ${subcategory} ${name} ${code}`

  if (category === 'builder gel') return true
  if (blob.includes('polygel') || blob.includes('acrygel') || blob.includes('liquid polygel')) return true
  if (blob.includes('extra strength') && blob.includes('base')) return true

  return false
}

function toPositiveNumber(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10)
  if (!Number.isFinite(parsed)) return null
  if (parsed <= 0) return null
  return parsed
}

function validateProductsCsv() {
  if (!fs.existsSync(files.productsCsv)) {
    fail('Missing public/products.csv required by B2B pages')
  }

  const content = fs.readFileSync(files.productsCsv, 'utf8')
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    fail('public/products.csv must include a header and at least one row')
  }

  const header = parseCsvLine(lines[0])
  const requiredColumns = ['category', 'subcategory', 'product_name', 'code', 'moq', 'active']
  const missingColumns = requiredColumns.filter((column) => !header.includes(column))

  if (missingColumns.length > 0) {
    fail(`public/products.csv is missing required columns: ${missingColumns.join(', ')}`)
  }

  const indexByColumn = Object.fromEntries(header.map((column, index) => [column, index]))

  const rows = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line)
    return {
      category: cells[indexByColumn.category] || '',
      subcategory: cells[indexByColumn.subcategory] || '',
      product_name: cells[indexByColumn.product_name] || '',
      code: cells[indexByColumn.code] || '',
      moq: cells[indexByColumn.moq] || '',
      active: cells[indexByColumn.active] || '',
    }
  })

  const relevantActiveRows = rows.filter((row) => isTruthyActive(row.active) && isB2BRelevantCategory(row))
  if (relevantActiveRows.length === 0) {
    fail('No active B2B-relevant rows found in public/products.csv')
  }

  const errors = []
  const duplicateKeySet = new Set()

  relevantActiveRows.forEach((row) => {
    const categoryGroup = String(row.category || '').trim().toLowerCase()
    const code = String(row.code || '').trim()
    const name = String(row.product_name || '').trim()
    const moq = toPositiveNumber(row.moq)

    if (!code) {
      errors.push(`Row '${name || '(unnamed)'}' in category '${row.category}' is missing code`)
      return
    }

    if (!name) {
      errors.push(`Row with code '${code}' in category '${row.category}' is missing product_name`)
    }

    if (moq === null) {
      errors.push(`Row '${name || code}' has invalid MOQ '${row.moq}' (must be > 0 integer)`)
    }

    const dedupeKey = `${categoryGroup}::${code.toLowerCase()}`
    if (duplicateKeySet.has(dedupeKey)) {
      errors.push(`Duplicate active code '${code}' detected in category group '${row.category}'`)
    }
    duplicateKeySet.add(dedupeKey)
  })

  if (errors.length > 0) {
    console.error('❌ B2B product CSV validation failed:')
    errors.forEach((error) => console.error(`  - ${error}`))
    process.exit(1)
  }

  return { count: relevantActiveRows.length }
}

function assertContains(source, snippet, errorMessage) {
  if (!source.includes(snippet)) {
    fail(errorMessage)
  }
}

function validateOrderFlowInvariants() {
  const cartContextSource = fs.readFileSync(files.cartContext, 'utf8')
  const checkoutSource = fs.readFileSync(files.checkoutPage, 'utf8')
  const submitSource = fs.readFileSync(files.submitOrder, 'utf8')

  assertContains(
    cartContextSource,
    'function normalizeItemCode',
    'Cart invariant missing: normalizeItemCode is required in B2BCartContext'
  )
  assertContains(
    cartContextSource,
    'const normalizedCode = normalizeItemCode(action.payload);',
    'Cart invariant missing: ADD_OR_UPDATE must normalize product codes'
  )
  assertContains(
    cartContextSource,
    'if (!normalizedCode) {',
    'Cart invariant missing: empty normalized codes must be rejected'
  )

  assertContains(
    checkoutSource,
    'shadeCode: item.internalSku || item.code',
    'Checkout invariant missing: shadeCode must fallback from internalSku to code'
  )
  assertContains(
    checkoutSource,
    'const canProceed = isPackagingSelected && !hasQuantityError && prePrintedMinOk;',
    'Checkout invariant missing: submit/export gate must require valid quantities and packaging'
  )

  assertContains(
    submitSource,
    'const seenLineKeys = new Set<string>();',
    'Submission invariant missing: duplicate line detection set must exist'
  )
  assertContains(
    submitSource,
    'if (seenLineKeys.has(lineKey)) {',
    'Submission invariant missing: duplicate line keys must be rejected'
  )
  assertContains(
    submitSource,
    'if (!item.code || !item.product_name || !item.quantity || item.quantity <= 0)',
    'Submission invariant missing: line item quantity/code/product validation must exist'
  )
}

function main() {
  const csvResult = validateProductsCsv()
  validateOrderFlowInvariants()

  console.log(`✅ B2B order-flow validation passed (${csvResult.count} active B2B-relevant products checked).`)
}

main()