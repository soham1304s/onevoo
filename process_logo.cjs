const fs = require('fs');
const path = require('path');

async function processLogo() {
  const sharp = require('sharp');
  const inputPath = 'C:/Users/Utsab Sinha/.gemini/antigravity-ide/brain/4ed0434b-17ae-44d4-b1f2-3d8a46dd8540/.user_uploaded/media_1788337306903.png';
  const outDir = 'c:/Users/Utsab Sinha/Downloads/onevoo-main/onevoo-main/frontend/public';

  // Read raw image buffer
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  console.log('Original image dimensions:', metadata.width, 'x', metadata.height);

  // Get raw RGBA buffer
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });

  // Create transparent version: remove pure white / near-white background (RGB > 245)
  // while preserving smooth anti-aliased edge alpha
  const transparentBuffer = Buffer.from(data);
  for (let i = 0; i < transparentBuffer.length; i += 4) {
    const r = transparentBuffer[i];
    const g = transparentBuffer[i + 1];
    const b = transparentBuffer[i + 2];
    
    // Check if pixel is white or near-white background
    const brightness = (r + g + b) / 3;
    if (r > 240 && g > 240 && b > 240) {
      // Calculate alpha based on difference from pure white (255)
      const diff = 255 - Math.min(r, Math.min(g, b));
      if (diff < 5) {
        transparentBuffer[i + 3] = 0; // Fully transparent
      } else {
        transparentBuffer[i + 3] = Math.min(255, Math.floor((diff / 15) * 255));
      }
    }
  }

  // 1. Save transparent high-res logo
  await sharp(transparentBuffer, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .trim() // Trim transparent whitespace margins
  .png()
  .toFile(path.join(outDir, 'onevoo-logo-transparent.png'));

  console.log('✅ Created onevoo-logo-transparent.png (trimmed & transparent)');

  // 2. Also save standard onevoo-logo.png
  await sharp(inputPath).png().toFile(path.join(outDir, 'onevoo-logo.png'));

  // 3. Create Favicon / Square Icon
  // Crop the right-side 3D Hexagon Emblem
  // In the original image (approx 1024x1024 or similar), the hexagon is on the right
  const trimmed = sharp(path.join(outDir, 'onevoo-logo-transparent.png'));
  const trimmedMeta = await trimmed.metadata();
  console.log('Trimmed dimensions:', trimmedMeta.width, 'x', trimmedMeta.height);

  // Hexagon is roughly the right 25% of the logo width
  const hexWidth = Math.floor(trimmedMeta.height);
  const hexLeft = trimmedMeta.width - hexWidth;

  await sharp(path.join(outDir, 'onevoo-logo-transparent.png'))
    .extract({
      left: Math.max(0, hexLeft),
      top: 0,
      width: Math.min(hexWidth, trimmedMeta.width),
      height: trimmedMeta.height
    })
    .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'onevoo-icon.png'));

  console.log('✅ Created onevoo-icon.png (standalone 3D hexagon prism)');
  console.log('All logo assets generated successfully!');
}

processLogo().catch(console.error);
