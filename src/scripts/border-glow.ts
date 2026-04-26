// Cursor-tracked border glow.
// Updates --glow-x / --glow-y CSS variables on `.border-glow` and
// `.group-border-glow` elements as the pointer moves over them.
//
// Single document-level mousemove listener (event delegation), throttled
// with requestAnimationFrame so we touch the DOM at most once per frame.

let pending: PointerEvent | MouseEvent | null = null;
let raf: number | null = null;

function setVars(el: HTMLElement, e: { clientX: number; clientY: number }): void {
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
    pending = e;
    if (raf === null) raf = requestAnimationFrame(flush);
  },
  { passive: true },
);
