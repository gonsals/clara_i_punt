import { normalizeProduct } from './product.js';
import { previewProducts } from './preview-products.js';
import { localPresentation, sampleProducts } from './design-preview.js';

export const airtableConfigured = () =>
  Boolean(import.meta.env.AIRTABLE_API_KEY && import.meta.env.AIRTABLE_DB_ID);
let cache;
let pending;
const showSamples = import.meta.env.DEV && import.meta.env.SHOW_PRODUCT_PLACEHOLDERS !== 'false';

export async function airtableRequest(
  path = '',
  options = {},
  table = import.meta.env.AIRTABLE_PRODUCTS_TABLE || 'Productos',
) {
  if (!airtableConfigured()) throw new Error('Airtable is not configured');
  const response = await fetch(
    `https://api.airtable.com/v0/${encodeURIComponent(import.meta.env.AIRTABLE_DB_ID)}/${encodeURIComponent(table)}${path}`,
    {
      ...options,
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${import.meta.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    },
  );
  if (!response.ok) throw new Error(`Airtable request failed (${response.status})`);
  return response.json();
}

async function fetchCatalog() {
  const records = [];
  let offset;
  do {
    const params = new URLSearchParams({ pageSize: '100' });
    if (offset) params.set('offset', offset);
    const data = await airtableRequest(`?${params}`);
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  const products = records
    .filter((r) => !['Esborrany', 'Borrador'].includes(r.fields?.Estado))
    .map(normalizeProduct);
  const result = {
    products: showSamples ? [...products.map(localPresentation), ...sampleProducts] : products,
    preview: showSamples,
    error: null,
  };
  cache = { result, expires: Date.now() + 60000 };
  return result;
}

/** @returns {Promise<import('./types').CatalogData>} */
export async function getCatalog({ fresh = false } = {}) {
  if (!airtableConfigured()) {
    // Only local development shows reference pieces. Production fails closed.
    return import.meta.env.DEV
      ? {
          products: showSamples ? [...previewProducts, ...sampleProducts] : previewProducts,
          preview: true,
          error: null,
        }
      : {
          products: [],
          preview: false,
          error: 'La col·lecció estarà disponible aviat. Escriu-nos si vols saber-ne més.',
        };
  }
  if (!fresh && cache && cache.expires > Date.now()) return cache.result;
  try {
    if (!pending)
      pending = fetchCatalog().finally(() => {
        pending = undefined;
      });
    return await pending;
  } catch (error) {
    console.error('[catalog]', error instanceof Error ? error.message : 'Airtable unavailable');
    return {
      products: [],
      preview: false,
      error: 'Ara mateix no podem carregar les peces. Torna-ho a provar d’aquí a uns moments.',
    };
  }
}
