// ========================================
// Generate PWA Icons
// Run: node generate_icons.js
// ========================================

const fs = require('fs');
const path = require('path');

// Create icons directory
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// SVG template for EduMeet icon
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>
  
  <!-- Graduation cap icon -->
  <g transform="translate(${size * 0.2}, ${size * 0.25})">
    <!-- Cap top -->
    <path d="M ${size * 0.3} ${size * 0.15} L ${size * 0.6} ${size * 0.25} L ${size * 0.3} ${size * 0.35} L 0 ${size * 0.25} Z" 
          fill="#FFD700" stroke="#FFF" stroke-width="${size * 0.01}"/>
    
    <!-- Cap base -->
    <rect x="${size * 0.25}" y="${size * 0.35}" width="${size * 0.1}" height="${size * 0.2}" 
          fill="#FFF" rx="${size * 0.02}"/>
    
    <!-- Tassel -->
    <circle cx="${size * 0.6}" cy="${size * 0.25}" r="${size * 0.03}" fill="#FFD700"/>
    <line x1="${size * 0.6}" y1="${size * 0.28}" x2="${size * 0.6}" y2="${size * 0.35}" 
          stroke="#FFD700" stroke-width="${size * 0.015}"/>
  </g>
  
  <!-- Text "E" -->
  <text x="${size * 0.5}" y="${size * 0.75}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.25}" 
        font-weight="bold" 
        fill="#FFF" 
        text-anchor="middle">E</text>
</svg>
`;

console.log('🎨 Generating PWA icons...\n');

// Generate icons
sizes.forEach(size => {
    const svg = createSVG(size);
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(iconsDir, filename);
    
    // For now, save as SVG (you can convert to PNG using a tool like sharp or imagemagick)
    const svgFilepath = filepath.replace('.png', '.svg');
    fs.writeFileSync(svgFilepath, svg);
    
    console.log(`✅ Created: ${filename.replace('.png', '.svg')}`);
});

// Create a simple PNG placeholder (base64 encoded 1x1 transparent pixel)
const createPlaceholderPNG = () => {
    const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    return Buffer.from(base64, 'base64');
};

// Create placeholder PNGs
sizes.forEach(size => {
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(iconsDir, filename);
    
    // Write placeholder
    fs.writeFileSync(filepath, createPlaceholderPNG());
});

console.log('\n📝 Note: SVG files created. For production, convert SVGs to PNGs using:');
console.log('   - Online tool: https://svgtopng.com/');
console.log('   - Command line: npm install sharp (then use sharp library)');
console.log('   - Or use any image editor\n');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    console.log('✅ Created screenshots directory');
    console.log('📝 Add screenshots (1280x720 for desktop, 750x1334 for mobile)\n');
}

// Create apple-touch-icon
const appleTouchIcon = path.join(__dirname, 'public', 'apple-touch-icon.png');
fs.copyFileSync(
    path.join(iconsDir, 'icon-192x192.png'),
    appleTouchIcon
);
console.log('✅ Created apple-touch-icon.png');

// Create favicon
const favicon = path.join(__dirname, 'public', 'favicon.ico');
fs.copyFileSync(
    path.join(iconsDir, 'icon-192x192.png'),
    favicon.replace('.ico', '.png')
);
console.log('✅ Created favicon.png');

console.log('\n🎉 Icon generation complete!');
console.log('📁 Icons saved to: public/icons/');
console.log('\n💡 Next steps:');
console.log('   1. Convert SVG icons to PNG (if needed)');
console.log('   2. Add screenshots to public/screenshots/');
console.log('   3. Test PWA with Lighthouse');
