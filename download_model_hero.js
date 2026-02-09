import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
};

// High-quality image of a blonde model with jewelry/gold aesthetic
// This is a placeholder since we cannot access the user's uploaded file directly.
const imageUrl = "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2070&auto=format&fit=crop"; 

const outputPath = path.join(__dirname, 'public', 'images', 'home-hero-model.jpg');

console.log(`Downloading new hero model image to ${outputPath}...`);

downloadImage(imageUrl, outputPath)
    .then(() => console.log('Successfully downloaded new hero model image!'))
    .catch((err) => console.error('Error downloading image:', err));
