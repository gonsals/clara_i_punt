import { useEffect } from 'react';
import { initializeCart, useCart } from '../../lib/cart.js';
import { formatPrice } from '../../lib/product.js';
import ProductImage from './ProductImage.jsx';

export default function Checkout({ products, email }) {
  const lines = useCart();
  useEffect(() => {
    initializeCart();
  }, []);
  const items = lines.map((line) => ({ ...line, product: products.find((p) => p.id === line.id) }));
  const subtotal = items.reduce(
    (total, line) => total + (line.product?.price || 0) * line.quantity,
    0,
  );
  const body = `Hola! M’interessen aquestes peces:\n\n${items.map((line) => `${line.quantity} × ${line.product?.name || line.id}${line.product?.price != null ? ` (${formatPrice(line.product.price)})` : ''}`).join('\n')}\n\nSubtotal de referència: ${formatPrice(subtotal)}\nEm podeu confirmar la disponibilitat i les condicions d’enviament?`;
  if (items.length === 0)
    return (
      <div className="empty-state">
        <h2>La cistella encara és buida.</h2>
        <p>Descobreix la col·lecció i troba la teva peça.</p>
        <a className="button" href="/products">
          Veure les peces ↗
        </a>
      </div>
    );
  return (
    <div className="checkout-layout">
      <div className="checkout-info">
        <p className="eyebrow">ABANS DE CONFIRMAR</p>
        <h2>Parlem de la teva comanda.</h2>
        <p>
          El pagament amb targeta encara no està disponible. Pots consultar aquestes peces per
          correu i et confirmarem la disponibilitat i l’enviament.
        </p>
        <p>
          Preparar el correu no reserva les peces ni confirma una compra. La cistella es mantindrà
          guardada.
        </p>
        <a
          className="button"
          href={`mailto:${email}?subject=${encodeURIComponent('Consulta de peces — Clara i Punt')}&body=${encodeURIComponent(body)}`}
        >
          Consulta les peces per correu ↗
        </a>
        <p>
          <a className="text-link" href="/products">
            Continua mirant la col·lecció
          </a>
        </p>
      </div>
      <div className="checkout-items">
        <h2>Les teves peces</h2>
        {items.map((line) => (
          <div key={line.id} className="cart-line">
            <ProductImage
              key={line.product?.images[0].url || line.id}
              src={line.product?.images[0].url || '/images/product-placeholder.svg'}
              alt={line.product?.name || 'Peça no disponible'}
              width="70"
              height="86"
              style={{ objectFit: 'contain', background: '#f1ebe3', borderRadius: 8 }}
            />
            <div className="cart-line-body">
              <p className="cart-line-name">{line.product?.name || 'Peça no disponible'}</p>
              <p>
                {line.quantity} unitat{line.quantity > 1 ? 's' : ''}
              </p>
              {!line.product?.available || line.quantity > line.product.stock ? (
                <small className="error-text">Cal confirmar-ne la disponibilitat.</small>
              ) : null}
            </div>
            <span>
              {line.product?.price != null ? formatPrice(line.product.price * line.quantity) : '—'}
            </span>
          </div>
        ))}
        <div className="total-row">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <p className="checkout-status">
          Enviament pendent de confirmar. No s’ha fet cap cobrament.
        </p>
      </div>
    </div>
  );
}
