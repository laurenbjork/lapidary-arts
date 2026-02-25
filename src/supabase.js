import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- VERCEL DEPLOYMENT DEBUGGING (AGGRESSIVE) ---
console.log("--- VERCEL DEPLOYMENT DEBUGGING (AGGRESSIVE) ---");
console.log("Supabase URL loaded:", supabaseUrl);
console.log("FULL Supabase Key loaded:", supabaseKey);
console.log("-------------------------------------------------");
// --- END DEBUGGING ---

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key. Please check your .env file or Vercel project settings.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
