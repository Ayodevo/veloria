const sharp = require('sharp');

async function removeBlackBackground(inputPath, outputPath) {
  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const newBuffer = Buffer.alloc(width * height * 4);

    for (let i = 0; i < width * height; i++) {
      const idx = i * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      const maxVal = Math.max(r, g, b);
      const outIdx = i * 4;
      
      if (maxVal < 10) {
        newBuffer[outIdx] = 0;
        newBuffer[outIdx + 1] = 0;
        newBuffer[outIdx + 2] = 0;
        newBuffer[outIdx + 3] = 0;
      } else {
        const alpha = maxVal;
        
        // Un-premultiply
        const newR = Math.min(255, Math.floor((r / alpha) * 255));
        const newG = Math.min(255, Math.floor((g / alpha) * 255));
        const newB = Math.min(255, Math.floor((b / alpha) * 255));
        
        newBuffer[outIdx] = newR;
        newBuffer[outIdx + 1] = newG;
        newBuffer[outIdx + 2] = newB;
        newBuffer[outIdx + 3] = alpha;
      }
    }

    await sharp(newBuffer, {
      raw: {
        width,
        height,
        channels: 4,
      }
    })
    .png()
    .toFile(outputPath);
    
    console.log("SUCCESS");
  } catch (error) {
    console.error("ERROR", error);
  }
}

removeBlackBackground('public/logo.png', 'public/logo_transparent.png');
