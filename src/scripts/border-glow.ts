// Cursor-tracked border glow.
// Updates --glow-x / --glow-y CSS variables on `.border-glow` and
// `.group-border-glow` elements as the pointer moves over them.
//
// Single document-level pointermove listener (event delegation), throttled
// with requestAnimationFrame so we touch the DOM at most once per frame.
// The listener is only installed on devices that actually have hover and
// when the user has not requested reduced motion — on touch / a11y setups
// the visual is disabled in CSS, so the JS work would be wasted.

const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canHover && !reducedMotion) {
  let pending: PointerEvent | null = null;
  let raf: number | null = null;

  function setVars(el: HTMLElement, e: PointerEvent): void {
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  }

  function flush(): void {
    raf = null;
    const e = pending;
    pending = null;
    if (!e) return;
    const target = e.target;
    if (!(target instanceof Element)) return;

    const direct = target.closest<HTMLElement>('.border-glow');
    if (direct) setVars(direct, e);

    const group = target.closest<HTMLElement>('.group');
    if (group) {
      const inner = group.querySelector<HTMLElement>('.group-border-glow');
      if (inner) setVars(inner, e);
    }
  }

  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      // Skip touch / pen — they don't drive a real hover state, so the
      // CSS spotlight isn't visible anyway.
      if (e.pointerType !== 'mouse') return;
      pending = e;
      if (raf === null) raf = requestAnimationFrame(flush);
    },
    { passive: true },
  );
}
