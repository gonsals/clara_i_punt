import { addToCart } from '../../lib/cart.js';
import { formatPrice } from '../../lib/product.js';
import Icon from './Icon.jsx';
import ProductImage from './ProductImage.jsx';

export default function ProductCard({ product, index = 0 }) {
  return (
    <article className={`product-card tone-${index % 6}`}>
      <a
        className="product-card-image"
        href={`/product/${product.id}`}
        aria-label={`Descobreix ${product.name}`}
      >
        <ProductImage
          key={product.images[0].url}
          src={product.images[0].url}
          alt={product.images[0].alt}
          width="480"
          height="560"
          loading="lazy"
          decoding="async"
        />
        {product.images[1] ? (
          <img
            className="product-card-alternate"
            src={product.images[1].url}
            alt=""
            width="480"
            height="560"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        <span className="product-badge">
          {product.preview
            ? 'Mostra'
            : product.available
              ? 'Disponible'
              : product.canAdd
                ? 'Per confirmar'
                : 'No disponible'}
        </span>
        <span className="card-arrow">
          <Icon name="arrow" size={21} />
        </span>
      </a>
      <div className="product-card-info">
        <div>
          <span className="eyebrow">{product.category}</span>
          <a href={`/product/${product.id}`}>
            <h3>{product.name}</h3>
          </a>
        </div>
        <span className="product-price">
          {product.price !== null ? formatPrice(product.price) : 'Peça de referència'}
          {product.preview && product.price !== null ? <small>Preu orientatiu</small> : null}
        </span>
      </div>
      {product.canAdd && !product.preview ? (
        <button className="quick-add" onClick={() => addToCart(product)}>
          <Icon name="plus" size={17} /> Afegeix a la cistella
        </button>
      ) : null}
    </article>
  );
}
