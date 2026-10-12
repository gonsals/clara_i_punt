import { getCatalog } from '../../../lib/catalog.js';
import { validateCart } from '../../../lib/product.js';
export async function POST({ request, url }) {
  if (request.headers.get('origin') !== url.origin)
    return Response.json({ error: 'La petició no és vàlida.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json'))
    return Response.json({ error: 'Format no vàlid.' }, { status: 415 });
  if (Number(request.headers.get('content-length')) > 12000)
    return Response.json({ error: 'La cistella és massa gran.' }, { status: 413 });
  try {
    const text = await request.text();
    if (text.length > 12000)
      return Response.json({ error: 'La cistella és massa gran.' }, { status: 413 });
    const input = JSON.parse(text);
    if (!input || typeof input !== 'object')
      return Response.json({ error: 'La cistella no és vàlida.' }, { status: 400 });
    const catalog = await getCatalog({ fresh: true });
    if (catalog.error)
      return Response.json(
        { error: 'Ara mateix no podem confirmar la disponibilitat.' },
        { status: 503 },
      );
    const items = validateCart(input.items, catalog.products);
    return Response.json(
      {
        items: items.map(({ product, quantity }) => ({
          id: product.id,
          quantity,
          price: product.price,
          stock: product.stock,
        })),
        subtotal: items.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0) / 100,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof SyntaxError ? 'La cistella no és vàlida.' : error.message },
      { status: 400 },
    );
  }
}
