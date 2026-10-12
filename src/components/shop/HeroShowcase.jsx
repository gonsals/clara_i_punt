import { useEffect, useRef, useState } from 'react';
const pieces = [
  {
    name: 'Bossa Marina',
    category: 'Bosses',
    image: '/images/products/marina-cutout.webp',
    className: 'hero-marina',
  },
  {
    name: 'Xal de colors',
    category: 'Xals i mocadors',
    image: '/images/products/xal-cutout.webp',
    className: 'hero-xal',
  },
  {
    name: 'Bossa Maria',
    category: 'Bosses',
    image: '/images/products/maria-cutout.webp',
    className: 'hero-maria',
  },
];
export default function HeroShowcase() {
  const viewport = useRef(null);
  const hovering = useRef(false);
  const [active, setActive] = useState(1);
  const closest = () => {
    const node = viewport.current;
    const center = node.scrollLeft + node.clientWidth / 2;
    return [...node.children].reduce(
      (nearest, child, index, children) =>
        Math.abs(child.offsetLeft + child.clientWidth / 2 - center) <
        Math.abs(children[nearest].offsetLeft + children[nearest].clientWidth / 2 - center)
          ? index
          : nearest,
      0,
    );
  };
  function move(index, immediate = false) {
    const node = viewport.current;
    const child = node?.children[index];
    if (!child) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollTo({
      left: child.offsetLeft - (node.clientWidth - child.clientWidth) / 2,
      behavior: immediate || reduced ? 'instant' : 'smooth',
    });
    setActive(index);
  }
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const align = () => {
      if (media.matches) move(1, true);
    };
    align();
    media.addEventListener('change', align);
    const timer = window.setInterval(() => {
      if (
        !media.matches ||
        hovering.current ||
        document.hidden ||
        document.documentElement.dataset.motionPaused === 'true' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return;
      move((closest() + 1) % pieces.length);
    }, 2500);
    return () => {
      clearInterval(timer);
      media.removeEventListener('change', align);
    };
  }, []);
  return (
    <div
      className="hero-showcase"
      aria-label="Peces de ganxet de la Clara"
      onPointerEnter={() => {
        hovering.current = true;
      }}
      onPointerLeave={() => {
        hovering.current = false;
      }}
      onFocus={() => {
        hovering.current = true;
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hovering.current = false;
      }}
    >
      <div className="hero-pieces" ref={viewport} onScroll={() => setActive(closest())}>
        {pieces.map((piece, index) => (
          <a
            href={`/products?categoria=${encodeURIComponent(piece.category)}`}
            className={`hero-piece ${piece.className}`}
            key={piece.name}
            aria-label={piece.name}
          >
            {index === 0 ? (
              <>
                <img
                  className="hero-corner hero-corner-start"
                  src="/images/figma/imgVector1.svg"
                  alt=""
                />
                <img
                  className="hero-corner hero-corner-end"
                  src="/images/figma/imgVector.svg"
                  alt=""
                />
              </>
            ) : null}
            <img
              className="hero-product"
              src={piece.image}
              alt={piece.name}
              width={index === 1 ? 433 : 281}
              height={index === 1 ? 547 : 514}
              fetchPriority="high"
            />
            {index === 1 ? (
              <div className="hero-white-flower">
                <img src="/images/figma/imgVector2.svg" alt="" />
              </div>
            ) : null}
          </a>
        ))}
      </div>
      <div className="hero-blue-flower">
        <img src="/images/figma/imgVector3.svg" alt="" />
      </div>
      <div className="hero-slider-dots" aria-label="Tria una peça">
        {pieces.map((piece, index) => (
          <button
            key={piece.name}
            aria-label={`Veure ${piece.name}`}
            aria-pressed={active === index}
            onClick={() => move(index)}
          />
        ))}
      </div>
    </div>
  );
}
