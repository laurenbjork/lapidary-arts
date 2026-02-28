import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Temporary diagnostics to check Vercel environment variables
console.log("Vercel VITE_SUPABASE_URL:", supabaseUrl);
console.log("Vercel VITE_SUPABASE_ANON_KEY:", supabaseKey ? "Key is present" : "Key is MISSING or UNDEFINED");

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key. Please check your .env file or Vercel project settings.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
