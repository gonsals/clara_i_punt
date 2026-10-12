import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard.jsx';
/** @param {{products?: import('../../lib/types').Product[], outfits?: {title: string, image: string, category: string, tone: string}[], title: string, id: string, kind?: string}} props */
export default function ProductRail({ products = [], outfits = [], title, id, kind = 'products' }) {
  const track = useRef(null);
  const [previous, setPrevious] = useState(false);
  const [next, setNext] = useState(false);
  function update() {
    const node = track.current;
    if (!node) return;
    setPrevious(node.scrollLeft > 2);
    setNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 2);
  }
  useEffect(() => {
    const observer = new ResizeObserver(update);
    observer.observe(track.current);
    update();
    return () => observer.disconnect();
  }, []);
  function move(direction) {
    const node = track.current;
    const first = node.firstElementChild;
    if (!first) return;
    const gap = Number.parseFloat(getComputedStyle(node).gap) || 20;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollBy({
      left: direction * (first.clientWidth + gap),
      behavior: reduced ? 'instant' : 'smooth',
    });
  }
  return (
    <section
      className={`figma-rail ${kind === 'products' ? 'collection-section' : 'outfit-section'}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="rail-heading">
        <h2 id={`${id}-title`}>{title}</h2>
        <div className="rail-controls">
          <button
            className="rail-arrow"
            disabled={!previous}
            onClick={() => move(-1)}
            aria-label={kind === 'products' ? 'Peces anteriors' : 'Idees anteriors'}
            aria-controls={id}
          >
            <img src="/images/figma/imgSvg2.svg" alt="" />
          </button>
          <button
            className="rail-arrow"
            disabled={!next}
            onClick={() => move(1)}
            aria-label={kind === 'products' ? 'Peces següents' : 'Idees següents'}
            aria-controls={id}
          >
            <img src="/images/figma/imgSvg3.svg" alt="" />
          </button>
        </div>
      </div>
      <div
        id={id}
        className="rail-track"
        ref={track}
        onScroll={update}
        tabIndex={0}
        aria-label={title}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        {kind === 'products'
          ? products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          : outfits.map((outfit) => (
              <a
                key={outfit.title}
                className={`outfit-tile outfit-${outfit.tone}`}
                href={`/products?categoria=${encodeURIComponent(outfit.category)}`}
              >
                <img
                  src={outfit.image}
                  alt={outfit.title}
                  width="234"
                  height="346"
                  loading="lazy"
                />
                <span>{outfit.title}</span>
              </a>
            ))}
      </div>
    </section>
  );
}
