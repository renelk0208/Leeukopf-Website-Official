const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const repoRoot = path.join(__dirname, '..')
const categoriesConfigPath = path.join(repoRoot, 'src', 'b2b', 'config', 'categories.ts')

const PRODUCT_IMAGE_DIR_RULES = [
  {
    label: 'Polygel images',
    dir: path.join(repoRoot, 'public', 'img', 'polygel'),
    minWidth: 300,
    minHeight: 300,
    targetAspect: 1,
    aspectTolerance: 0.02,
    enforceUniformDimensions: false,
  },
  {
    label: 'Liquid polygel images',
    dir: path.join(repoRoot, 'public', 'img', 'liquid-polygel'),
    minWidth: 300,
    minHeight: 300,
    targetAspect: 1,
    aspectTolerance: 0.02,
    enforceUniformDimensions: true,
  },
]

const CATEGORY_IMAGE_RULES = {
  minWidth: 900,
  minHeight: 600,
  minAspect: 0.8,
  maxAspect: 1.8,
}

function fail(errors) {
  console.error('❌ B2B image quality validation failed:')
  errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}

function parseEnabledCategoryImageSources() {
  if (!fs.existsSync(categoriesConfigPath)) {
    fail([`Missing categories config: ${categoriesConfigPath}`])
  }

  const source = fs.readFileSync(categoriesConfigPath, 'utf8')
  const entryRegex = /\{[\s\S]*?enabled:\s*true[\s\S]*?\}/g
  const enabledEntries = source.match(entryRegex) || []

  const imageSources = enabledEntries
    .map((entry) => {
      const imageSrcMatch = entry.match(/imageSrc:\s*["']([^"']+)["']/)
      const labelMatch = entry.match(/label:\s*["']([^"']+)["']/)
      if (!imageSrcMatch) return null
      return {
        label: labelMatch?.[1] || 'Unknown category',
        src: imageSrcMatch[1],
      }
    })
    .filter(Boolean)

  return imageSources
}

async function getImageMetadata(absolutePath) {
  try {
    return await sharp(absolutePath).metadata()
  } catch {
    return null
  }
}

function aspectWithinTolerance(ratio, target, tolerance) {
  return Math.abs(ratio - target) <= tolerance
}

async function validateCategoryImages() {
  const errors = []
  const imageSources = parseEnabledCategoryImageSources()

  if (imageSources.length === 0) {
    errors.push('No enabled B2B category image sources found to validate')
    return { errors, checked: 0 }
  }

  for (const image of imageSources) {
    const relativePath = image.src.startsWith('/') ? image.src.slice(1) : image.src
    const absolutePath = path.join(repoRoot, 'public', relativePath)

    if (!fs.existsSync(absolutePath)) {
      errors.push(`Category '${image.label}' image is missing: ${image.src}`)
      continue
    }

    const metadata = await getImageMetadata(absolutePath)
    if (!metadata || !metadata.width || !metadata.height) {
      errors.push(`Category '${image.label}' image has unreadable dimensions: ${image.src}`)
      continue
    }

    const ratio = metadata.width / metadata.height
    if (metadata.width < CATEGORY_IMAGE_RULES.minWidth || metadata.height < CATEGORY_IMAGE_RULES.minHeight) {
      errors.push(
        `Category '${image.label}' image too small (${metadata.width}x${metadata.height}). Minimum is ${CATEGORY_IMAGE_RULES.minWidth}x${CATEGORY_IMAGE_RULES.minHeight}`
      )
    }

    if (ratio < CATEGORY_IMAGE_RULES.minAspect || ratio > CATEGORY_IMAGE_RULES.maxAspect) {
      errors.push(
        `Category '${image.label}' image aspect ratio ${ratio.toFixed(3)} out of allowed range ${CATEGORY_IMAGE_RULES.minAspect}-${CATEGORY_IMAGE_RULES.maxAspect}`
      )
    }
  }

  return { errors, checked: imageSources.length }
}

async function validateProductImageDirectory(rule) {
  const errors = []

  if (!fs.existsSync(rule.dir)) {
    errors.push(`${rule.label}: directory is missing (${path.relative(repoRoot, rule.dir)})`)
    return { errors, checked: 0 }
  }

  const files = fs
    .readdirSync(rule.dir)
    .filter((file) => /\.(webp|png|jpe?g)$/i.test(file))

  if (files.length === 0) {
    errors.push(`${rule.label}: no image files found in ${path.relative(repoRoot, rule.dir)}`)
    return { errors, checked: 0 }
  }

  let baselineDimensions = null

  for (const file of files) {
    const absolutePath = path.join(rule.dir, file)
    const metadata = await getImageMetadata(absolutePath)

    if (!metadata || !metadata.width || !metadata.height) {
      errors.push(`${rule.label}: could not read dimensions for ${file}`)
      continue
    }

    const ratio = metadata.width / metadata.height
    if (metadata.width < rule.minWidth || metadata.height < rule.minHeight) {
      errors.push(
        `${rule.label}: ${file} is too small (${metadata.width}x${metadata.height}), minimum is ${rule.minWidth}x${rule.minHeight}`
      )
    }

    if (!aspectWithinTolerance(ratio, rule.targetAspect, rule.aspectTolerance)) {
      errors.push(
        `${rule.label}: ${file} ratio ${ratio.toFixed(3)} is outside ${rule.targetAspect}±${rule.aspectTolerance} (likely distortion risk)`
      )
    }

    if (rule.enforceUniformDimensions) {
      const current = `${metadata.width}x${metadata.height}`
      if (!baselineDimensions) {
        baselineDimensions = current
      } else if (current !== baselineDimensions) {
        errors.push(
          `${rule.label}: ${file} dimensions ${current} differ from expected uniform size ${baselineDimensions}`
        )
      }
    }
  }

  return { errors, checked: files.length }
}

async function main() {
  const allErrors = []
  let categoryChecked = 0
  let productChecked = 0

  const categoryResult = await validateCategoryImages()
  categoryChecked = categoryResult.checked
  allErrors.push(...categoryResult.errors)

  for (const rule of PRODUCT_IMAGE_DIR_RULES) {
    const result = await validateProductImageDirectory(rule)
    productChecked += result.checked
    allErrors.push(...result.errors)
  }

  if (allErrors.length > 0) {
    fail(allErrors)
  }

  console.log(
    `✅ B2B image quality validation passed (${categoryChecked} category images, ${productChecked} product images checked).`
  )
}

main().catch((error) => {
  fail([error instanceof Error ? error.message : String(error)])
})