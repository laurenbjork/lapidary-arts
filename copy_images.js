import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, 'public', 'images');

const copyMap = {
    'category-necklaces.jpg': 'necklace-5.jpg',
    'earring-2.jpg': 'earring-4.jpg',
    'earring-3.jpg': 'earring-6.jpg',
    'earring-5.jpg': 'earring-4.jpg',
    'necklace-2.jpg': 'necklace-6.jpg',
    'ring-3.jpg': 'category-rings.jpg',
    'ring-4.jpg': 'category-rings.jpg',
    'ring-5.jpg': 'category-rings.jpg'
};

for (const [dest, src] of Object.entries(copyMap)) {
    try {
        fs.copyFileSync(path.join(imagesDir, src), path.join(imagesDir, dest));
        console.log(`Copied ${src} to ${dest}`);
    } catch (err) {
        console.error(`Failed to copy ${src} to ${dest}: ${err.message}`);
    }
}
