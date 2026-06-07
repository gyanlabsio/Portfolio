require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const assetsDir = path.join(__dirname, '../frontend/src/assets');

async function uploadImages() {
  try {
    const files = fs.readdirSync(assetsDir);
    const images = files.filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    
    if (images.length === 0) {
      console.log('No images found in assets folder.');
      return;
    }

    console.log(`Found ${images.length} images. Starting upload...`);
    
    const results = [];
    for (const image of images) {
      const filePath = path.join(assetsDir, image);
      console.log(`Uploading ${image}...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'portfolio',
        use_filename: true,
        unique_filename: false
      });
      
      console.log(`✅ Uploaded: ${result.secure_url}`);
      results.push({ name: image, url: result.secure_url });
    }
    
    console.log('\n--- UPLOAD SUMMARY ---');
    results.forEach(r => console.log(`${r.name}:\n${r.url}\n`));
    
  } catch (error) {
    console.error('Error uploading images:', error);
  }
}

uploadImages();
