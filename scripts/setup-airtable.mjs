// Adds the optional shop fields; never alters existing fields or product values.
const { AIRTABLE_API_KEY, AIRTABLE_DB_ID, AIRTABLE_PRODUCTS_TABLE = 'Productos' } = process.env;
if (!AIRTABLE_API_KEY || !AIRTABLE_DB_ID)
  throw new Error('Configure AIRTABLE_API_KEY and AIRTABLE_DB_ID in .env.local.');
const root = `https://api.airtable.com/v0/meta/bases/${encodeURIComponent(AIRTABLE_DB_ID)}/tables`;
const headers = { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' };
async function request(url, options = {}) {
  const response = await fetch(url, { ...options, headers, signal: AbortSignal.timeout(15000) });
  if (!response.ok)
    throw new Error(
      `Airtable schema request failed (${response.status}). Schema changes require schema.bases:write and the base creator role.`,
    );
  return response.json();
}
const schema = await request(root);
const table = schema.tables.find(
  (t) => t.name === AIRTABLE_PRODUCTS_TABLE || t.id === AIRTABLE_PRODUCTS_TABLE,
);
if (
  !table ||
  !table.fields.some((f) => f.name === 'Nombre') ||
  !table.fields.some((f) => f.name === 'Precio')
)
  throw new Error('Expected existing product table not found. No changes made.');
const fields = [
  {
    name: 'Stock',
    type: 'number',
    options: { precision: 0 },
    description: 'Unitats reals disponibles. Buit: disponibilitat per confirmar. Zero: esgotat.',
  },
  {
    name: 'Categoria',
    type: 'singleSelect',
    options: { choices: ['Bosses', 'Xals i mocadors', 'Complements'].map((name) => ({ name })) },
  },
  {
    name: 'Estado',
    type: 'singleSelect',
    options: { choices: ['Disponible', 'Esgotat', 'Esborrany'].map((name) => ({ name })) },
    description: 'Esborrany oculta la peça de la web. Disponible requereix stock real per comprar.',
  },
  { name: 'Material', type: 'singleLineText' },
  { name: 'Medidas', type: 'singleLineText' },
  { name: 'Cuidados', type: 'multilineText' },
  { name: 'Destacado', type: 'checkbox', options: { color: 'pinkBright', icon: 'star' } },
];
const missing = fields.filter(
  (field) => !table.fields.some((existing) => existing.name === field.name),
);
console.log(
  `Table: ${table.name}. Missing fields: ${missing.map((f) => f.name).join(', ') || 'none'}.`,
);
if (!process.argv.includes('--apply')) {
  console.log(
    'Read-only preview. Run with --apply to add these fields. Product values remain unchanged.',
  );
} else {
  for (const field of missing) {
    const result = await request(`${root}/${table.id}/fields`, {
      method: 'POST',
      body: JSON.stringify(field),
    });
    console.log(`Created ${result.name} (${result.type}).`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  console.log(
    'Product schema ready. Enter the actual stock values in Airtable before enabling purchases.',
  );
}
