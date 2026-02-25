import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- VERCEL DEPLOYMENT DEBUGGING ---
console.log("--- VERCEL DEPLOYMENT DEBUGGING ---");
console.log("Supabase URL loaded by application:", supabaseUrl);
if (supabaseKey) {
  console.log("Supabase Key loaded by application. Starts with:", supabaseKey.substring(0, 10));
} else {
  console.error("CRITICAL: Supabase Key is NOT LOADED in the application.");
}
console.log("------------------------------------");
// --- END DEBUGGING ---

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: Missing Supabase URL or Anon Key. Please check your .env file or Vercel project settings.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
