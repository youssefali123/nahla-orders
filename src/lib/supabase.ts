import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

if (!url || !anonKey) {
  throw new Error(
    "إعدادات Supabase ناقصة. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY إلى ملف .env.local.",
  );
}

/**
 * Shared Supabase client for the public catalog (anonymous reads only).
 * Single module-level instance — do not create additional clients.
 * Auth flows are out of scope; the secret/service-role key must never
 * be used here or anywhere in frontend code.
 */
export const supabase: SupabaseClient = createClient(url, anonKey);
