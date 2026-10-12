import { useEffect, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import Icon from './Icon.jsx';

export default function Catalog({
  products,
  initialCategory = '',
  initialQuery = '',
  initialSort = 'featured',
  error,
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const url = new URL(window.location.href);
    for (const [key, value] of [
      ['categoria', category],
      ['q', query],
      ['ordre', sort === 'featured' ? '' : sort],
    ]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, '', url);
  }, [category, query, sort]);
  const normalize = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const matches = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!available || p.available) &&
      normalize(`${p.name} ${p.description} ${p.category} ${p.color}`).includes(
        normalize(query.trim()),
      ),
  );
  matches.sort((a, b) =>
    sort === 'price-asc'
      ? (a.price ?? Infinity) - (b.price ?? Infinity)
      : sort === 'price-desc'
        ? (b.price ?? -1) - (a.price ?? -1)
        : sort === 'name'
          ? a.name.localeCompare(b.name, 'ca')
          : Number(b.featured) - Number(a.featured),
  );
  const cats = [...new Set(products.map((p) => p.category))];
  return (
    <div className="catalog">
      <div className="catalog-toolbar">
        <div className="search-input">
          <Icon name="search" size={20} />
          <label className="sr-only" htmlFor="cerca">
            Cerca una peça
          </label>
          <input
            id="cerca"
            type="search"
            placeholder="Troba la teva peça…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button aria-label="Esborra la cerca" onClick={() => setQuery('')}>
              <Icon name="close" size={17} />
            </button>
          ) : null}
        </div>
        <label className="sort-control">
          Ordena per{' '}
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Destacades</option>
            <option value="price-asc">Preu: de menys a més</option>
            <option value="price-desc">Preu: de més a menys</option>
            <option value="name">Nom: A–Z</option>
          </select>
        </label>
      </div>
      <div className="catalog-filters">
        <div className="filter-chips" aria-label="Categories">
          <button
            aria-pressed={!category}
            className={!category ? 'active' : ''}
            onClick={() => setCategory('')}
          >
            Totes les peces <span>{products.length}</span>
          </button>
          {cats.map((cat) => (
            <button
              key={cat}
              aria-pressed={category === cat}
              className={category === cat ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <label className="stock-filter">
          <input
            type="checkbox"
            checked={available}
            onChange={(event) => setAvailable(event.target.checked)}
          />{' '}
          Només disponibles
        </label>
      </div>
      <p className="catalog-count" aria-live="polite">
        {matches.length} {matches.length === 1 ? 'peça' : 'peces'} · fetes sense presses
      </p>
      {error ? (
        <div className="empty-state">
          <h2>Fem una petita pausa.</h2>
          <p role="alert">{error}</p>
          <a href="/contacte" className="button">
            Parlem-ne <Icon name="arrow" size={18} />
          </a>
        </div>
      ) : matches.length ? (
        <div className="product-grid">
          {matches.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">✳</span>
          <h2>
            {products.length
              ? 'Encara no hem trobat aquesta peça.'
              : 'Estem preparant la col·lecció.'}
          </h2>
          <p>
            {products.length
              ? 'Prova una altra cerca o descobreix totes les peces.'
              : 'Escriu-nos per saber què està teixint la Clara.'}
          </p>
          {products.length ? (
            <button
              className="button"
              onClick={() => {
                setCategory('');
                setQuery('');
                setAvailable(false);
              }}
            >
              Veure totes les peces
            </button>
          ) : (
            <a className="button" href="/contacte">
              Contacta amb nosaltres
            </a>
          )}
        </div>
      )}
    </div>
  );
}
