import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProduct, validateCart } from '../src/lib/product.js';
import { sanitizeLines } from '../src/lib/cart.js';

const record = {
  id: 'rec123',
  fields: {
    Nombre: 'Bossa',
    Precio: 23.5,
    Stock: 2,
    Imagenes: [{ url: 'https://example.com/bossa.jpg' }],
  },
};
test('unknown stock permits an inquiry but never a payment', () => {
  const product = normalizeProduct({ ...record, fields: { ...record.fields, Stock: undefined } });
  assert.equal(product.stock, null);
  assert.equal(product.available, false);
  assert.equal(product.canAdd, true);
  assert.throws(() => validateCart([{ id: product.id, quantity: 1 }], [product]));
});
test('zero stock, invalid prices and unsafe image URLs fail closed', () => {
  for (const price of [null, undefined, 0, -1, Infinity, 'wrong']) {
    assert.equal(
      normalizeProduct({ ...record, fields: { ...record.fields, Precio: price } }).canAdd,
      false,
    );
  }
  const product = normalizeProduct({
    ...record,
    fields: { ...record.fields, Stock: 0, Imagenes: [{ url: 'javascript:alert(1)' }] },
  });
  assert.equal(product.canAdd, false);
  assert.equal(product.images[0].url, '/images/product-placeholder.svg');
  for (const stock of [-1, 1.5, '2'])
    assert.equal(
      normalizeProduct({ ...record, fields: { ...record.fields, Stock: stock } }).canAdd,
      false,
    );
});
test('server totals ignore client supplied prices', () => {
  const product = normalizeProduct(record);
  const items = validateCart([{ id: 'rec123', quantity: 2, price: 0.01 }], [product]);
  assert.equal(items[0].unitAmount * items[0].quantity, 4700);
});
test('duplicate IDs, excessive quantities, missing IDs and references cannot be purchased', () => {
  const product = normalizeProduct(record);
  const invalid = [
    [],
    [{ id: 'rec123', quantity: 0 }],
    [{ id: 'rec123', quantity: 3 }],
    [{ id: 'rec123', quantity: 1.5 }],
    [{ id: 'wrong', quantity: 1 }],
    [
      { id: 'rec123', quantity: 1 },
      { id: 'rec123', quantity: 1 },
    ],
  ];
  for (const input of invalid) assert.throws(() => validateCart(input, [product]));
  assert.throws(() =>
    validateCart([{ id: 'rec123', quantity: 1 }], [{ ...product, preview: true }]),
  );
});
test('cart storage rejects malformed data and removes duplicate records', () => {
  assert.deepEqual(sanitizeLines(null), []);
  assert.deepEqual(
    sanitizeLines([
      { id: 'a', quantity: 1 },
      { id: 'a', quantity: 2 },
      { id: 'b', quantity: 0 },
      { id: 'c', quantity: 50, price: 1 },
      null,
    ]),
    [
      { id: 'a', quantity: 1 },
      { id: 'c', quantity: 20 },
    ],
  );
});
