import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const images = {
    "hero-bg.jpg": "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=2070&auto=format&fit=crop",
    "category-earrings.jpg": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070&auto=format&fit=crop",
    "category-necklaces.jpg": "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070&auto=format&fit=crop",
    "category-rings.jpg": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
    "custom-design-feature.jpg": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop",
    "earring-2.jpg": "https://images.unsplash.com/photo-1630019852942-f89202989a51?q=80&w=2062&auto=format&fit=crop",
    "earring-3.jpg": "https://images.unsplash.com/photo-1535632787350-4e6cff0f2948?q=80&w=2070&auto=format&fit=crop",
    "earring-4.jpg": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1887&auto=format&fit=crop",
    "earring-5.jpg": "https://images.unsplash.com/photo-1635767798638-3e2523c96d27?q=80&w=1780&auto=format&fit=crop",
    "earring-6.jpg": "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=2070&auto=format&fit=crop",
    "necklace-2.jpg": "https://images.unsplash.com/photo-1599643477877-530eb83abc5e?q=80&w=2070&auto=format&fit=crop",
    "necklace-3.jpg": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
    "necklace-4.jpg": "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1951&auto=format&fit=crop",
    "necklace-5.jpg": "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2787&auto=format&fit=crop",
    "necklace-6.jpg": "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=2070&auto=format&fit=crop",
    "ring-3.jpg": "https://images.unsplash.com/photo-1598560977533-add4b9871e71?q=80&w=2070&auto=format&fit=crop",
    "ring-4.jpg": "https://images.unsplash.com/photo-1603561596112-0a132b7223de?q=80&w=1780&auto=format&fit=crop",
    "ring-5.jpg": "https://images.unsplash.com/photo-1591176219389-9ea25d88665f?q=80&w=2070&auto=format&fit=crop"
};

const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(imagesDir, filename));
        const request = https.get(url, (response) => {
             if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirects if necessary, though Unsplash usually doesn't redirect like this for images
                const newUrl = response.headers.location;
                 file.close();
                 downloadImage(newUrl, filename).then(resolve).catch(reject);
                 return;
            }
            if (response.statusCode !== 200) {
                 // Try stripping query params if 404 and params exist
                 if (response.statusCode === 404 && url.includes('?')) {
                     const cleanUrl = url.split('?')[0];
                     console.log(`Retrying ${filename} with ${cleanUrl}`);
                     file.close();
                     downloadImage(cleanUrl, filename).then(resolve).catch(reject);
                     return;
                 }
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(path.join(imagesDir, filename), () => {});
            reject(err);
        });
    });
};

const downloadAll = async () => {
    for (const [filename, url] of Object.entries(images)) {
        try {
            await downloadImage(url, filename);
        } catch (error) {
            console.error(error.message);
        }
    }
};

downloadAll();
