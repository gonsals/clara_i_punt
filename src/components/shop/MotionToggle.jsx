import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
export default function MotionToggle() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let saved = null;
    try {
      saved = sessionStorage.getItem('clara-motion-paused');
    } catch {
      /* Session preference is optional. */
    }
    const initial =
      saved === null
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : saved === 'true';
    setPaused(initial);
    document.documentElement.dataset.motionPaused = String(initial);
    window.dispatchEvent(new Event('clara:motion'));
  }, []);
  function toggle() {
    const next = !paused;
    setPaused(next);
    document.documentElement.dataset.motionPaused = String(next);
    try {
      sessionStorage.setItem('clara-motion-paused', String(next));
    } catch {
      /* Keep the current-page preference. */
    }
    window.dispatchEvent(new Event('clara:motion'));
  }
  return (
    <button
      className="motion-toggle"
      onClick={toggle}
      aria-pressed={paused}
      aria-label={paused ? 'Reprèn el moviment' : 'Pausa el moviment'}
    >
      <Icon name={paused ? 'play' : 'pause'} size={15} />
      <span>{paused ? 'Reprèn' : 'Pausa'} el moviment</span>
    </button>
  );
}
