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
  const { data: products, error: productsError } = await supabase.from('products').select('id, created_at');
  if (productsError) {
    console.error('Error fetching products:', productsError);
  } else {
    products.forEach(product => {
      if (product.id && product.created_at) {
        routes.push({ 
          url: `/product/${product.id}`,
          lastmod: new Date(product.created_at).toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    }));
  }

  // Fetch blog posts
  const { data: blogPosts, error: blogError } = await supabase.from('blog_posts').select('slug, created_at');
  if (blogError) {
    console.error('Error fetching blog posts:', blogError);
  } else {
    blogPosts.forEach(post => {
      if (post.slug && post.created_at) {
        routes.push({ 
          url: `/blog/${post.slug}`,
          lastmod: new Date(post.created_at).toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    }));
  }
  
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
        staticRoutes: [
          { url: '/', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
          { url: '/about', changefreq: 'monthly', priority: 0.8 },
          { url: '/contact', changefreq: 'yearly', priority: 0.5 },
          { url: '/faq', changefreq: 'monthly', priority: 0.6 },
          { url: '/size-guide', changefreq: 'yearly', priority: 0.4 },
          { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
          { url: '/terms-of-service', changefreq: 'yearly', priority: 0.3 },
          { url: '/blog', changefreq: 'weekly', priority: 0.9 },
          { url: '/shop/all', changefreq: 'daily', priority: 0.9 },
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
