import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import sitemap from 'vite-plugin-sitemap';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getDynamicRoutes() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing. Cannot generate dynamic routes.');
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const routes = [];

  // Fetch products
  const { data: products, error: productsError } = await supabase.from('products').select('id');
  if (productsError) {
    console.error('Error fetching products:', productsError);
  } else {
    products.forEach(product => routes.push(`/product/${product.id}`));
  }

  // Fetch blog posts
  const { data: blogPosts, error: blogError } = await supabase.from('blog_posts').select('slug');
  if (blogError) {
    console.error('Error fetching blog posts:', blogError);
  } else {
    blogPosts.forEach(post => routes.push(`/blog/${post.slug}`));
  }
  
  // Add other dynamic routes as needed (e.g., collections, designers)

  return routes;
}

export default defineConfig(async () => {
  const dynamicRoutes = await getDynamicRoutes();

  return {
    base: '/',
    plugins: [
      react(),
      sitemap({
        hostname: 'https://www.lapidaryartsjewelry.com',
        dynamicRoutes,
        // Add static routes if they are not automatically discovered
        staticRoutes: [
          '/',
          '/about',
          '/contact',
          '/faq',
          '/size-guide',
          '/privacy-policy',
          '/terms-of-service',
          '/blog',
          '/shop/all',
          // Add other static pages
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
            ui: ['lucide-react', 'framer-motion'],
          },
        },
      },
    },
  };
});
