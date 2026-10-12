/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly AIRTABLE_API_KEY?: string;
  readonly AIRTABLE_DB_ID?: string;
  readonly AIRTABLE_PRODUCTS_TABLE?: string;
  readonly SITE_URL?: string;
  readonly SHOW_PRODUCT_PLACEHOLDERS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
