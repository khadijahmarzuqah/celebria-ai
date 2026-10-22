import type { PointerEvent as ReactPointerEvent } from 'react';

const reduceMotion = () =>
  typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function applyCardTilt(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || reduceMotion() || !hasFinePointer()) return;

  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;

  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  card.style.setProperty('--tilt-x', `${(0.5 - y) * 4.5}deg`);
  card.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
  card.style.setProperty('--pointer-x', `${x * 100}%`);
  card.style.setProperty('--pointer-y', `${y * 100}%`);
}

export function resetCardTilt(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg');
  event.currentTarget.style.setProperty('--tilt-y', '0deg');
  event.currentTarget.style.setProperty('--pointer-x', '50%');
  event.currentTarget.style.setProperty('--pointer-y', '50%');
}

export function applyHeroParallax(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || reduceMotion() || !hasFinePointer()) return;

  const art = event.currentTarget;
  const bounds = art.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;

  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  art.style.setProperty('--parallax-far-x', `${-x * 7}px`);
  art.style.setProperty('--parallax-far-y', `${-y * 7}px`);
  art.style.setProperty('--parallax-mid-x', `${-x * 13}px`);
  art.style.setProperty('--parallax-mid-y', `${-y * 13}px`);
  art.style.setProperty('--parallax-near-x', `${-x * 20}px`);
  art.style.setProperty('--parallax-near-y', `${-y * 20}px`);
}

export function resetHeroParallax(event: ReactPointerEvent<HTMLElement>) {
  const art = event.currentTarget;
  for (const layer of ['far', 'mid', 'near']) {
    art.style.setProperty(`--parallax-${layer}-x`, '0px');
    art.style.setProperty(`--parallax-${layer}-y`, '0px');
  }
}
