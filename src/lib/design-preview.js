// Editorial presentation for existing test records, in local development only.
// Renaming a record in Airtable retires its corresponding presentation override.
const referenceContent = {
  Loko2: {
    name: 'Bossa Maria',
    category: 'Bosses',
    color: 'Rosa i violeta',
    description:
      'Quadres de ganxet en rosa i violeta, teixits punt a punt per la iaia Clara. Una bossa amb caràcter per donar color al teu dia a dia.',
    photo: '/images/products/maria.webp',
  },
  Juanito: {
    name: 'Xal de colors',
    category: 'Xals i mocadors',
    color: 'Multicolor',
    description:
      'Un xal de ganxet amb blau, verd i rosa. Una peça de les mans de la iaia Clara que acompanya els petits moments i les tardes fresques.',
    photo: '/images/products/xal.webp',
  },
  Prueba: {
    name: 'Bossa Marina',
    category: 'Bosses',
    color: 'Rosa i pruna',
    description:
      'Flors de colors sobre quadrats de ganxet. La iaia Clara l’ha teixida a mà, amb la calma i la personalitat de les seves peces.',
    photo: '/images/products/marina.webp',
  },
};
export function localPresentation(product) {
  const content = referenceContent[product.name];
  if (!content) return product;
  return {
    ...product,
    name: content.name,
    category: content.category,
    description: content.description,
    color: content.color,
    images: [
      { ...product.images[0], alt: content.name },
      { url: content.photo, alt: `Detall de ${content.name}` },
    ],
  };
}

export const sampleProducts = [
  {
    id: 'mostra-cerdanya',
    name: 'Bossa Cerdanya',
    category: 'Bosses',
    price: 38,
    color: 'Blau cel i cru',
    description:
      'Una proposta de bossa amb quadrats de ganxet en blau cel i cru. Peça de mostra per imaginar la col·lecció; el producte i el preu són provisionals.',
    image: 'bossa-cerdanya',
  },
  {
    id: 'mostra-flor',
    name: 'Necesser Flor',
    category: 'Complements',
    price: 18,
    color: 'Rosa i lila',
    description:
      'Un petit necesser amb una flor de ganxet i tons de rosa i lila. Una proposta visual per a la col·lecció; el producte i el preu són provisionals.',
    image: 'necesser-flor',
  },
  {
    id: 'mostra-nuvol',
    name: 'Mocador Núvol',
    category: 'Xals i mocadors',
    price: 32,
    color: 'Blau cel i cru',
    description:
      'Una proposta de mocador de ganxet amb tons suaus i una vora ondulada. Peça de mostra per a la col·lecció; el producte i el preu són provisionals.',
    image: 'mocador-nuvol',
  },
].map((p) => ({
  ...p,
  images: [
    { url: `/images/placeholders/${p.image}.webp`, alt: `${p.name} — fotografia de mostra` },
  ],
  stock: 0,
  material: '',
  dimensions: '',
  care: 'Les indicacions de cura es confirmaran amb la peça definitiva.',
  featured: false,
  available: false,
  canAdd: false,
  preview: true,
}));

export const outfitIdeas = [
  {
    title: 'Color per al teu dia',
    image: '/images/products/marina.webp',
    category: 'Bosses',
    tone: 'blue',
  },
  {
    title: 'Una abraçada de ganxet',
    image: '/images/products/xal.webp',
    category: 'Xals i mocadors',
    tone: 'yellow',
  },
  {
    title: 'Punt a punt, amb tu',
    image: '/images/products/maria.webp',
    category: 'Bosses',
    tone: 'pink',
  },
  {
    title: 'Els petits detalls',
    image: '/images/placeholders/necesser-flor.webp',
    category: 'Complements',
    tone: 'navy',
  },
  {
    title: 'Dies de blau cel',
    image: '/images/placeholders/mocador-nuvol.webp',
    category: 'Xals i mocadors',
    tone: 'sky',
  },
  {
    title: 'Un toc de Cerdanya',
    image: '/images/placeholders/bossa-cerdanya.webp',
    category: 'Bosses',
    tone: 'mauve',
  },
];
