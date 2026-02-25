const fs = require('fs');
const path = require('path');

const navigationPath = path.join(__dirname, '..', 'src', 'components', 'Navigation.tsx');
const source = fs.readFileSync(navigationPath, 'utf8');

const requiredPatterns = [
  /className="hidden\s+xl:flex\s+flex-1\s+items-center\s+justify-center\s+min-w-0"/,
  /className="flex\s+items-center\s+justify-center\s+flex-nowrap\s+gap-x-0\s+min-w-0"/,
  /className="nav-item\s+shrink-0"/,
  /whitespace-nowrap/,
];

const missingPatterns = requiredPatterns.filter((pattern) => !pattern.test(source));

if (missingPatterns.length > 0) {
  console.error('❌ Navigation layout validation failed. Non-wrapping desktop nav classes are missing.');
  console.error('Please restore the desktop navigation no-wrap guard classes in src/components/Navigation.tsx.');
  process.exit(1);
}

console.log('✅ Navigation layout validation passed.');
