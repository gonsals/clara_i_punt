import { useEffect, useRef, useState } from 'react';
import { initializeCart, removeFromCart, setQuantity, useCart } from '../../lib/cart.js';
import { formatPrice } from '../../lib/product.js';
import Icon from './Icon.jsx';
import ProductImage from './ProductImage.jsx';
import { categories } from '../../lib/product.js';

export default function StoreShell({ products, currentPath, email, preview }) {
  const lines = useCart();
  const [menu, setMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(0);
  const announcements = [
    'Peces de ganxet fetes per la iaia Clara',
    'Produït artesanalment a Puigcerdà',
    'Una peça feta a mà, punt a punt',
  ];
  const dialog = useRef(null);
  const menuDialog = useRef(null);
  useEffect(() => {
    initializeCart();
    const dismissCategories = (event) => {
      document.querySelectorAll('.category-menu[open]').forEach((node) => {
        if (!node.contains(event.target)) node.removeAttribute('open');
      });
    };
    const open = () => {
      setMenu(false);
      setCartOpen(true);
    };
    window.addEventListener('clara:open-cart', open);
    document.addEventListener('pointerdown', dismissCategories);
    return () => {
      window.removeEventListener('clara:open-cart', open);
      document.removeEventListener('pointerdown', dismissCategories);
    };
  }, []);
  useEffect(() => {
    const node = dialog.current;
    if (cartOpen && !node.open) node.showModal();
    if (!cartOpen && node.open) node.close();
  }, [cartOpen]);
  useEffect(() => {
    const node = menuDialog.current;
    if (menu && !node.open) node.showModal();
    if (!menu && node.open) node.close();
  }, [menu]);
  useEffect(() => {
    if (!cartOpen && !menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [cartOpen, menu]);
  const items = lines.map((line) => ({ ...line, product: products.find((p) => p.id === line.id) }));
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = items.reduce((sum, line) => sum + (line.product?.price || 0) * line.quantity, 0);
  const invalid = items.some(
    (line) =>
      !line.product?.canAdd || line.product.preview || line.quantity > (line.product.stock ?? 1),
  );
  const nav = (
    <>
      <div className="collection-nav">
        <a href="/products" aria-current={currentPath === '/products' ? 'page' : undefined}>
          La col·lecció
        </a>
        <details
          className="category-menu"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.currentTarget.removeAttribute('open');
              event.currentTarget.querySelector('summary').focus();
              event.stopPropagation();
            }
          }}
        >
          <summary aria-label="Categories de la col·lecció">
            <img src="/images/figma/imgDropdown.svg" alt="" width="12" height="12" />
          </summary>
          <div className="category-menu-links">
            {categories.map((category) => (
              <a key={category} href={`/products?categoria=${encodeURIComponent(category)}`}>
                {category}
              </a>
            ))}
          </div>
        </details>
      </div>
      <a href="/la-clara" aria-current={currentPath === '/la-clara' ? 'page' : undefined}>
        La iaia Clara
      </a>
      <a href="/ajuda" aria-current={currentPath === '/ajuda' ? 'page' : undefined}>
        T’ajudem?
      </a>
    </>
  );
  const backdrop = (event, close) => {
    if (event.target === event.currentTarget) close(false);
  };
  return (
    <>
      <header className="site-header">
        <div className="header-inner page-width">
          <a className="brand" href="/" aria-label="Clara i Punt — Inici">
            <img src="/images/figma/imgLogo.svg" alt="Clara i Punt" width="138.237" height="48" />
          </a>
          <nav className="desktop-nav" aria-label="Navegació principal">
            {nav}
          </nav>
          <div className="header-actions">
            <a
              className="icon-button search-link"
              href="/products#cerca"
              aria-label="Cerca una peça"
            >
              <Icon name="search" />
            </a>
            <button
              className="cart-trigger"
              onClick={() => setCartOpen(true)}
              aria-label={`Obre la cistella, ${count} ${count === 1 ? 'peça' : 'peces'}`}
            >
              <Icon name="bag" />
              <span className="cart-label">Cistella</span>
              <span className="cart-count" aria-live="polite">
                {count}
              </span>
            </button>
            <button
              className="icon-button mobile-menu-trigger"
              onClick={() => setMenu(true)}
              aria-label="Obre el menú"
              aria-expanded={menu}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      <div className="announcement">
        <button
          aria-label="Missatge anterior"
          onClick={() =>
            setAnnouncement((announcement + announcements.length - 1) % announcements.length)
          }
        >
          <img src="/images/figma/imgSvg.svg" alt="" />
        </button>
        <span aria-live="polite">{announcements[announcement]}</span>
        <button
          aria-label="Missatge següent"
          onClick={() => setAnnouncement((announcement + 1) % announcements.length)}
        >
          <img src="/images/figma/imgSvg1.svg" alt="" />
        </button>
      </div>
      {preview ? (
        <div className="preview-notice">
          Vista de disseny · Inclou peces i fotografies de mostra.
        </div>
      ) : null}
      <dialog
        ref={menuDialog}
        className="menu-dialog"
        onCancel={() => setMenu(false)}
        onClose={() => setMenu(false)}
        onClick={(event) => backdrop(event, setMenu)}
        aria-labelledby="menu-title"
      >
        <div className="drawer-head">
          <h2 id="menu-title">Clara i Punt</h2>
          <button className="icon-button" onClick={() => setMenu(false)} aria-label="Tanca el menú">
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Menú mòbil">
          {nav}
          <a href="/contacte">Parlem-ne</a>
        </nav>
        <p>Peces petites. Històries grans.</p>
      </dialog>
      <dialog
        ref={dialog}
        className="cart-dialog"
        onCancel={() => setCartOpen(false)}
        onClose={() => setCartOpen(false)}
        onClick={(event) => backdrop(event, setCartOpen)}
        aria-labelledby="cart-title"
      >
        <div className="drawer-head">
          <h2 id="cart-title">
            La teva cistella <span>({count})</span>
          </h2>
          <button
            className="icon-button"
            onClick={() => setCartOpen(false)}
            aria-label="Tanca la cistella"
          >
            <Icon name="close" />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <Icon name="bag" size={52} />
            </div>
            <h3>Hi falta una mica de color.</h3>
            <p>Troba aquella peça que sembla feta per a tu.</p>
            <a className="button" href="/products">
              Descobreix la col·lecció <Icon name="arrow" size={18} />
            </a>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((line) => (
                <article className="cart-line" key={line.id}>
                  <a href={`/product/${line.id}`}>
                    <ProductImage
                      key={line.product?.images[0].url || line.id}
                      src={line.product?.images[0].url || '/images/product-placeholder.svg'}
                      alt={line.product?.name || 'Peça no disponible'}
                      width="88"
                      height="108"
                    />
                  </a>
                  <div className="cart-line-body">
                    <a href={`/product/${line.id}`} className="cart-line-name">
                      {line.product?.name || 'Peça no disponible'}
                    </a>
                    <p>
                      {line.product?.price != null
                        ? formatPrice(line.product.price)
                        : 'No disponible'}
                    </p>
                    {!line.product?.canAdd ? (
                      <small className="error-text">Aquesta peça ja no està disponible.</small>
                    ) : line.product.stock === null ? (
                      <small className="stock-note">Disponibilitat per confirmar.</small>
                    ) : null}
                    <div className="quantity-control">
                      <button
                        aria-label={`Treu una unitat de ${line.product?.name || 'la peça'}`}
                        onClick={() =>
                          setQuantity(line.id, line.quantity - 1, line.product?.stock ?? 1)
                        }
                      >
                        <Icon name="minus" size={16} />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        aria-label={`Afegeix una unitat de ${line.product?.name || 'la peça'}`}
                        disabled={line.quantity >= Math.min(line.product?.stock ?? 1, 20)}
                        onClick={() =>
                          setQuantity(line.id, line.quantity + 1, line.product?.stock ?? 1)
                        }
                      >
                        <Icon name="plus" size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="icon-button remove-line"
                    onClick={() => removeFromCart(line.id)}
                    aria-label={`Elimina ${line.product?.name || 'la peça'}`}
                  >
                    <Icon name="close" size={16} />
                  </button>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div className="total-row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p>L’enviament es confirma abans de pagar.</p>
              {invalid ? (
                <p className="error-text" role="status">
                  Revisa les peces no disponibles o les quantitats abans de continuar.
                </p>
              ) : (
                <a className="button full-width" href="/checkout">
                  Revisa les teves peces <Icon name="arrow" size={18} />
                </a>
              )}
              <button className="text-link" onClick={() => setCartOpen(false)}>
                Continua mirant
              </button>
            </div>
          </>
        )}
        <a className="drawer-help" href={`mailto:${email}`}>
          Tens algun dubte? Escriu-nos.
        </a>
      </dialog>
    </>
  );
}
