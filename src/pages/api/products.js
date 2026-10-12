import { getCatalog } from '../../lib/catalog.js';
export async function GET() {
  const catalog = await getCatalog();
  return Response.json(catalog, {
    status: catalog.error ? 503 : 200,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
