const sharp = require('sharp');
const path = require('path');

async function processIcons() {
  const input = path.join('public', 'rklogofinal.webp');
  await sharp(input).resize(48, 48).toFile(path.join('public', 'favicon-48x48.png'));
  await sharp(input).resize(192, 192).toFile(path.join('public', 'favicon-192x192.png'));
  await sharp(input).resize(180, 180).toFile(path.join('public', 'apple-touch-icon.png'));
  console.log('Icons generated successfully.');
}
processIcons().catch(console.error);
