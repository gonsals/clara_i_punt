export const categories = ['Bosses', 'Xals i mocadors', 'Complements'];
export const formatPrice = (value) =>
  new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR' }).format(value);

/** @returns {import('./types').Product} */
export function normalizeProduct(record) {
  const f = record.fields || {};
  const rawPrice = typeof f.Precio === 'string' ? Number(f.Precio.replace(',', '.')) : f.Precio;
  const price =
    typeof rawPrice === 'number' && Number.isFinite(rawPrice) && rawPrice > 0
      ? Math.round(rawPrice * 100) / 100
      : null;
  const name = String(f.Nombre || 'Peça de ganxet');
  const images = (Array.isArray(f.Imagenes) ? f.Imagenes : [])
    .filter((i) => typeof i.url === 'string' && /^https:\/\//.test(i.url))
    .map((i) => ({ url: i.url, alt: name }));
  const category = String(
    f.Categoria ||
      (/bols|bossa|bag/i.test(name)
        ? 'Bosses'
        : /xal|mocador|shawl/i.test(name)
          ? 'Xals i mocadors'
          : 'Complements'),
  );
  // Fail closed: a missing stock field must never mean unlimited availability.
  const stock = f.Stock == null ? null : Number.isInteger(f.Stock) && f.Stock >= 0 ? f.Stock : 0;
  const active = !['Esgotat', 'Agotado', 'Esborrany', 'Borrador'].includes(f.Estado);
  const available = active && stock !== null && stock > 0 && price !== null;
  return {
    id: record.id,
    name,
    description: String(
      f.Descripcion || 'Una peça feta a mà per la Clara, punt a punt i sense presses.',
    ),
    price,
    category,
    images: images.length ? images : [{ url: '/images/product-placeholder.svg', alt: name }],
    stock,
    material: String(f.Material || ''),
    dimensions: String(f.Medidas || ''),
    care: String(
      f.Cuidados ||
        'Renta-la suaument a mà amb aigua freda. Deixa-la assecar en pla i evita l’assecadora.',
    ),
    color: Array.isArray(f.Colores) ? f.Colores.join(', ') : String(f.Color || f.Colores || ''),
    featured: f.Destacado === true,
    available,
    canAdd: available || (active && stock === null && price !== null),
    preview: false,
  };
}

export function validateCart(input, products) {
  if (!Array.isArray(input) || input.length === 0 || input.length > 30)
    throw new Error('La cistella no és vàlida.');
  const seen = new Set();
  return input.map((line) => {
    if (
      !line ||
      typeof line.id !== 'string' ||
      seen.has(line.id) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 20
    )
      throw new Error('Revisa les quantitats de la cistella.');
    seen.add(line.id);
    const product = products.find((p) => p.id === line.id);
    if (!product || product.preview || !product.available || product.price === null)
      throw new Error('Una de les peces ja no està disponible.');
    if (line.quantity > product.stock)
      throw new Error(`Només queden ${product.stock} unitats de ${product.name}.`);
    return { product, quantity: line.quantity, unitAmount: Math.round(product.price * 100) };
  });
}
