
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNSPLASH_ACCESS_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_AIRTEL_API_KEY: string
  readonly VITE_AIRTEL_API_SECRET: string
  readonly VITE_AIRTEL_MERCHANT_ID: string
  readonly VITE_AIRTEL_BASE_URL: string
  readonly VITE_MTN_API_KEY: string
  readonly VITE_MTN_API_SECRET: string
  readonly VITE_MTN_MERCHANT_ID: string
  readonly VITE_MTN_BASE_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
