import { useState } from 'react';
import { addToCart } from '../../lib/cart.js';
import { formatPrice } from '../../lib/product.js';
import Icon from './Icon.jsx';
import ProductImage from './ProductImage.jsx';

export default function ProductView({ product, email }) {
  const [active, setActive] = useState(0);
  const [quantity, setQuantityValue] = useState(1);
  const limit = Math.min(product.stock ?? 1, 20);
  return (
    <div className="product-detail">
      <div className="product-gallery">
        <div className="gallery-main tone-0">
          <ProductImage
            key={product.images[active].url}
            src={product.images[active].url}
            alt={product.images[active].alt}
            width="800"
            height="920"
            fetchPriority="high"
          />
        </div>
        {product.images.length > 1 ? (
          <div className="gallery-thumbnails" aria-label="Fotografies de la peça">
            {product.images.map((image, index) => (
              <button
                key={image.url}
                className={active === index ? 'active' : ''}
                aria-label={`Veure fotografia ${index + 1}`}
                aria-pressed={active === index}
                onClick={() => setActive(index)}
              >
                <ProductImage src={image.url} alt="" width="84" height="100" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="product-detail-info">
        <a className="eyebrow" href={`/products?categoria=${encodeURIComponent(product.category)}`}>
          {product.category}
        </a>
        <h1>{product.name}</h1>
        <p className="detail-price">
          {product.price !== null ? formatPrice(product.price) : 'Una peça del nostre univers'}
          {product.preview && product.price !== null ? (
            <small>Preu orientatiu · peça de mostra</small>
          ) : null}
        </p>
        <p className="detail-description">{product.description}</p>
        <div className="availability">
          <span className={product.available ? 'stock-dot' : 'stock-dot muted'} />
          {product.preview
            ? 'Peça de referència · no està a la venda'
            : product.available
              ? `${product.stock === 1 ? 'Una única peça disponible' : `${product.stock} peces disponibles`}`
              : product.canAdd
                ? 'Disponibilitat per confirmar abans de comprar'
                : 'Actualment no disponible'}
        </div>
        {product.canAdd && !product.preview ? (
          <div className="add-to-cart-row">
            <div className="quantity-control">
              <button
                onClick={() => setQuantityValue((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
                aria-label="Redueix la quantitat"
              >
                <Icon name="minus" size={17} />
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                disabled={quantity >= limit}
                onClick={() => setQuantityValue((value) => value + 1)}
                aria-label="Augmenta la quantitat"
              >
                <Icon name="plus" size={17} />
              </button>
            </div>
            <button className="button" onClick={() => addToCart(product, quantity)}>
              Afegeix a la cistella <Icon name="bag" size={19} />
            </button>
          </div>
        ) : (
          <a
            className="button"
            href={`mailto:${email}?subject=${encodeURIComponent(`Consulta sobre ${product.name}`)}`}
          >
            Consulta aquesta peça <Icon name="arrow" size={18} />
          </a>
        )}
        <div className="detail-promises">
          <p>
            <Icon name="heart" size={19} />{' '}
            {product.preview ? 'Proposta visual de la col·lecció' : 'Feta a mà per la iaia Clara'}
          </p>
          <p>
            <Icon name="leaf" size={19} />{' '}
            {product.preview ? 'Fotografia provisional' : 'Artesania de Puigcerdà'}
          </p>
        </div>
        <div className="product-accordions">
          <details open>
            <summary>
              Els petits detalls <Icon name="plus" size={18} />
            </summary>
            <dl>
              <div>
                <dt>Elaboració</dt>
                <dd>Ganxet artesanal</dd>
              </div>
              {product.material ? (
                <div>
                  <dt>Material</dt>
                  <dd>{product.material}</dd>
                </div>
              ) : null}
              {product.dimensions ? (
                <div>
                  <dt>Mides</dt>
                  <dd>{product.dimensions}</dd>
                </div>
              ) : null}
              {product.color ? (
                <div>
                  <dt>Color</dt>
                  <dd>{product.color}</dd>
                </div>
              ) : null}
            </dl>
            <p>Les petites diferències entre peces són part de fer les coses a mà.</p>
          </details>
          <details>
            <summary>
              Cuida-la i t’acompanyarà <Icon name="plus" size={18} />
            </summary>
            <p>{product.care}</p>
          </details>
          <details>
            <summary>
              Enviaments i devolucions <Icon name="plus" size={18} />
            </summary>
            <p>
              La disponibilitat d’enviament i el seu cost es confirmen abans del pagament. Si tens
              qualsevol dubte abans de comprar, escriu-nos.
            </p>
            <a className="text-link" href="/ajuda">
              Més informació
            </a>
          </details>
        </div>
      </div>
    </div>
  );
}
