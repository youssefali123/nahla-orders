/**
 * Single place to configure the brand + the WhatsApp destination number.
 * Set VITE_WHATSAPP_NUMBER in the environment to change it without touching UI code.
 * Format: full international number, digits only, no "+".
 */
export const site = {
  name: "نحلة",
  slogan: "هنوصلك بسرعة النحلة",
  currency: "جنيه",
  whatsappNumber:
    (import.meta.env["VITE_WHATSAPP_NUMBER"] as string | undefined) ?? "201025007990",
} as const;

/**
 * Global switch for Supabase database dependency.
 * Currently set to `false` because Supabase free quota was exceeded.
 * In this mode, the website runs exclusively in "Custom Order" mode without database dependency.
 * 
 * To re-enable Supabase once the issue/quota is resolved, simply change this value to `true`.
 */
export const SUPABASE_ENABLED = false;

