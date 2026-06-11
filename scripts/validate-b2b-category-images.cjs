const fs = require('fs')
const path = require('path')

const repoRoot = path.join(__dirname, '..')
const categoriesPath = path.join(repoRoot, 'src', 'b2b', 'config', 'categories.ts')

function fail(message) {
  console.error(`❌ ${message}`)
  process.exit(1)
}

function findArraySource(source, variableName) {
  const marker = `export const ${variableName}`
  const markerIndex = source.indexOf(marker)
  if (markerIndex === -1) {
    return ''
  }

  const assignmentIndex = source.indexOf('=', markerIndex)
  if (assignmentIndex === -1) {
    return ''
  }

  const arrayStart = source.indexOf('[', assignmentIndex)
  if (arrayStart === -1) {
    return ''
  }

  let depth = 0
  let inSingleQuote = false
  let inDoubleQuote = false
  let inTemplate = false
  let escaped = false

  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index]

    if (escaped) {
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (!inDoubleQuote && !inTemplate && char === "'") {
      inSingleQuote = !inSingleQuote
      continue
    }

    if (!inSingleQuote && !inTemplate && char === '"') {
      inDoubleQuote = !inDoubleQuote
      continue
    }

    if (!inSingleQuote && !inDoubleQuote && char === '`') {
      inTemplate = !inTemplate
      continue
    }

    if (inSingleQuote || inDoubleQuote || inTemplate) {
      continue
    }

    if (char === '[') {
      depth += 1
      continue
    }

    if (char === ']') {
      depth -= 1
      if (depth === 0) {
        return source.slice(arrayStart, index + 1)
      }
    }
  }

  return ''
}

function extractTopLevelObjects(arraySource) {
  const objects = []
  let depth = 0
  let start = -1
  let inSingleQuote = false
  let inDoubleQuote = false
  let inTemplate = false
  let escaped = false

  for (let index = 0; index < arraySource.length; index += 1) {
    const char = arraySource[index]

    if (escaped) {
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (!inDoubleQuote && !inTemplate && char === "'") {
      inSingleQuote = !inSingleQuote
      continue
    }

    if (!inSingleQuote && !inTemplate && char === '"') {
      inDoubleQuote = !inDoubleQuote
      continue
    }

    if (!inSingleQuote && !inDoubleQuote && char === '`') {
      inTemplate = !inTemplate
      continue
    }

    if (inSingleQuote || inDoubleQuote || inTemplate) {
      continue
    }

    if (char === '{') {
      if (depth === 0) {
        start = index
      }
      depth += 1
      continue
    }

    if (char === '}') {
      depth -= 1
      if (depth === 0 && start >= 0) {
        objects.push(arraySource.slice(start, index + 1))
        start = -1
      }
    }
  }

  return objects
}

function extractStringValue(objectSource, key) {
  const pattern = new RegExp(`${key}\\s*:\\s*(["'])([^"']+)\\1`)
  const match = objectSource.match(pattern)
  return match ? match[2] : ''
}

function hasTrueBoolean(objectSource, key) {
  const pattern = new RegExp(`${key}\\s*:\\s*true\\b`)
  return pattern.test(objectSource)
}

const source = fs.readFileSync(categoriesPath, 'utf8')
const arraySource = findArraySource(source, 'b2bCategories')

if (!arraySource) {
  fail('Could not parse b2bCategories from src/b2b/config/categories.ts')
}

const categoryObjects = extractTopLevelObjects(arraySource)

if (categoryObjects.length === 0) {
  fail('No category objects detected in b2bCategories')
}

const enabledCategories = categoryObjects.filter((objectSource) => hasTrueBoolean(objectSource, 'enabled'))

if (enabledCategories.length === 0) {
  fail('No enabled B2B categories found; validation cannot continue')
}

const errors = []

enabledCategories.forEach((objectSource) => {
  const label = extractStringValue(objectSource, 'label') || '(unknown category)'
  const imageSrc = extractStringValue(objectSource, 'imageSrc')
  const imageAlt = extractStringValue(objectSource, 'imageAlt')

  if (!imageSrc) {
    errors.push(`${label}: missing imageSrc`)
    return
  }

  if (!imageSrc.startsWith('/')) {
    errors.push(`${label}: imageSrc must start with '/'`) 
    return
  }

  if (!imageAlt) {
    errors.push(`${label}: missing imageAlt`) 
  }

  const relativeFilePath = imageSrc.replace(/^\//, '')
  const absoluteFilePath = path.join(repoRoot, 'public', relativeFilePath)

  if (!fs.existsSync(absoluteFilePath)) {
    errors.push(`${label}: missing image file at public/${relativeFilePath}`)
  }
})

if (errors.length > 0) {
  console.error('❌ B2B category image validation failed:')
  errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}

console.log(`✅ B2B category image validation passed for ${enabledCategories.length} enabled categories.`)