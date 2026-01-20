const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// SVG content for RK logo
const svgContent = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="dropShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
      <feOffset dx="0" dy="4" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Outer black circle border with thick stroke -->
  <circle cx="250" cy="250" r="240" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="25" />

  <!-- Main circle background -->
  <circle cx="250" cy="250" r="220" fill="#1a1a1a" />

  <!-- Golden circle border -->
  <circle cx="250" cy="250" r="220" fill="none" stroke="#FDB913" stroke-width="12" />

  <!-- Decorative curved lines on the left side -->
  <path
    d="M 100 150 Q 90 200 100 250 Q 90 300 100 350"
    stroke="#FDB913"
    stroke-width="18"
    fill="none"
    stroke-linecap="round"
  />

  <!-- Decorative curved lines on the right side (top) -->
  <path
    d="M 380 80 Q 420 120 440 160"
    stroke="#FDB913"
    stroke-width="16"
    fill="none"
    stroke-linecap="round"
  />

  <!-- Decorative curved lines on the right side (middle) -->
  <path
    d="M 450 140 Q 480 180 470 220"
    stroke="#FDB913"
    stroke-width="14"
    fill="none"
    stroke-linecap="round"
  />

  <!-- Letter R - Large, bold, positioned left -->
  <text
    x="130"
    y="290"
    font-size="180"
    font-weight="900"
    fill="#FDB913"
    font-family="Arial, Helvetica, sans-serif"
    text-anchor="middle"
    dominant-baseline="central"
  >
    R
  </text>

  <!-- Letter K - Large, bold, angular, positioned right -->
  <text
    x="320"
    y="290"
    font-size="180"
    font-weight="900"
    fill="#FDB913"
    font-family="Arial, Helvetica, sans-serif"
    text-anchor="middle"
    dominant-baseline="central"
  >
    K
  </text>

  <!-- Inner highlight on the left side -->
  <path
    d="M 110 160 Q 105 200 110 240"
    stroke="#FDB913"
    stroke-width="6"
    fill="none"
    opacity="0.4"
    stroke-linecap="round"
  />

  <!-- Small accent curve at top left corner -->
  <path
    d="M 140 110 Q 170 90 200 100"
    stroke="#FDB913"
    stroke-width="8"
    fill="none"
    opacity="0.5"
    stroke-linecap="round"
  />
</svg>`;

// Create PNG files in different sizes
const sizes = [
  { size: 256, name: 'ralogofinal-256.png' },
  { size: 512, name: 'ralogofinal-512.png' },
  { size: 1024, name: 'ralogofinal-1024.png' },
];

async function generateLogos() {
  try {
    console.log('🎨 Generating RK Logo PNG files...\n');

    for (const { size, name } of sizes) {
      const filePath = path.join(publicDir, name);
      
      await sharp(Buffer.from(svgContent))
        .resize(size, size, {
          fit: 'contain',
          background: { r: 26, g: 26, b: 26, alpha: 1 }
        })
        .png()
        .toFile(filePath);

      console.log(`✅ Created: ${name} (${size}x${size})`);
    }

    console.log('\n✨ All logo files generated successfully!');
    console.log('\n📁 Files saved to: public/');
    console.log('   - ralogofinal-256.png');
    console.log('   - ralogofinal-512.png');
    console.log('   - ralogofinal-1024.png');
    
  } catch (error) {
    console.error('❌ Error generating logos:', error);
    process.exit(1);
  }
}

generateLogos();
