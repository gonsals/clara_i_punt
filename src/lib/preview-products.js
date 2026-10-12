// Reference pieces from the user's Figma. These are never purchasable.
export const previewProducts = [
  {
    id: 'mostra-marina',
    name: 'Bossa Marina',
    category: 'Bosses',
    description:
      'Flors de colors i quadrats de ganxet que porten una mica d’alegria al teu dia. Aquesta és una peça de referència del nostre univers.',
    color: 'Rosa i pruna',
    images: [
      {
        url: '/images/products/marina-cutout.webp',
        alt: 'Bossa de ganxet rosa amb flors de colors',
      },
      { url: '/images/products/marina.webp', alt: 'Detall de la bossa Marina' },
    ],
  },
  {
    id: 'mostra-xal',
    name: 'Xal de colors',
    category: 'Xals i mocadors',
    description:
      'Un xal de ganxet amb tons suaus de blau, verd i rosa. Fet per donar color als petits moments i acompanyar-te quan refresca.',
    color: 'Multicolor',
    images: [
      { url: '/images/products/xal-cutout.webp', alt: 'Xal de ganxet multicolor' },
      { url: '/images/products/xal.webp', alt: 'Xal de colors portat sobre les espatlles' },
    ],
  },
  {
    id: 'mostra-maria',
    name: 'Bossa Maria',
    category: 'Bosses',
    description:
      'El ganxet de sempre, amb una combinació de rosa i violeta. Una bossa amb caràcter, teixida un quadrat darrere l’altre.',
    color: 'Rosa i violeta',
    images: [
      {
        url: '/images/products/maria-cutout.webp',
        alt: 'Bossa de ganxet de quadres rosa i violeta',
      },
      { url: '/images/products/maria.webp', alt: 'Detall del teixit de la bossa Maria' },
    ],
  },
].map((p) => ({
  ...p,
  price: null,
  stock: 0,
  material: '',
  dimensions: '',
  care: 'Renta-la suaument a mà amb aigua freda. Deixa-la assecar en pla i evita l’assecadora.',
  featured: true,
  available: false,
  preview: true,
}));
