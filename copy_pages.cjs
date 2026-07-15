const fs = require('fs');
const path = require('path');

const srcDirs = [
  'spring-water-delivery-vancouver',
  'alkaline-water-delivery-vancouver',
  'distilled-water-delivery-vancouver'
];

for (const src of srcDirs) {
  const dest = src.replace('vancouver', 'coquitlam');
  fs.mkdirSync(path.join('d:/tajwater-square/app', dest), { recursive: true });
  
  const content = fs.readFileSync(path.join('d:/tajwater-square/app', src, 'page.tsx'), 'utf-8');
  let newContent = content.replace(/Vancouver/g, 'Coquitlam');
  newContent = newContent.replace(/vancouver/g, 'coquitlam');
  // Fix "Metro Coquitlam" back to "Coquitlam" or "Metro Vancouver"
  newContent = newContent.replace(/Metro Coquitlam/g, 'Coquitlam & Metro Vancouver');
  
  fs.writeFileSync(path.join('d:/tajwater-square/app', dest, 'page.tsx'), newContent);
}
