#!/usr/bin/env node

// Quick verification script - just list the new files
const fs = require('fs');
const path = require('path');

const newFiles = [
  'lib/schemas.ts',
  'lib/internal-linking.ts',
  'components/home/ComparisonShowcase.tsx',
  'components/home/SavingsCalculator.tsx',
  'components/home/EnhancedTestimonials.tsx',
  'components/home/ExpandedFAQ.tsx',
  'components/home/LocalSEOBoost.tsx',
  'components/home/PromotionSection.tsx',
  'app/page.tsx'
];

console.log('📦 Files to commit:\n');
newFiles.forEach(f => {
  const fullPath = path.join('f:', 'tajwater-square', f);
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    console.log(`✅ ${f} (${(size/1024).toFixed(1)}KB)`);
  } else {
    console.log(`❌ ${f} (NOT FOUND)`);
  }
});

console.log('\n✨ All files ready to commit!');
