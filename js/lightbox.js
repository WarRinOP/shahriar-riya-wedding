// Card lightbox: native <dialog> with pinch / pan / double-tap / wheel zoom (Pointer Events).
export function initLightbox() {
  const dialog = document.getElementById('cardDialog');
  const stage = document.getElementById('lbStage');
  const img = document.getElementById('lbImg');
  const pts = new Map();
  let scale = 1, tx = 0, ty = 0, pinch = null, lastTap = 0, tapStart = null;

  const apply = () => { img.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`; };
  const reset = () => { scale = 1; tx = ty = 0; pinch = null; pts.clear(); apply(); };
  function clamp() {
    const r = stage.getBoundingClientRect();
    const mx = Math.max(0, (img.offsetWidth * scale - r.width) / 2);
    const my = Math.max(0, (img.offsetHeight * scale - r.height) / 2);
    tx = Math.min(mx, Math.max(-mx, tx));
    ty = Math.min(my, Math.max(-my, ty));
  }
  function zoomTo(k, px, py) {
    const r = stage.getBoundingClientRect();
    const ox = px - (r.left + r.width / 2), oy = py - (r.top + r.height / 2);
    const ratio = k / scale;
    tx = ox - (ox - tx) * ratio;
    ty = oy - (oy - ty) * ratio;
    scale = k;
    clamp(); apply();
  }

  stage.addEventListener('pointerdown', e => {
    tapStart = { onStage: e.target === stage && pts.size === 0, x: e.clientX, y: e.clientY }; // decided before capture retargets events
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: scale };
    }
    const now = Date.now();
    if (pts.size === 1 && now - lastTap < 300) {
      zoomTo(scale > 1.2 ? 1 : 2.5, e.clientX, e.clientY);
      lastTap = 0;
    } else lastTap = now;
  });
  stage.addEventListener('pointermove', e => {
    const p = pts.get(e.pointerId);
    if (!p) return;
    if (pts.size === 2 && pinch) {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = [...pts.values()];
      const k = Math.min(4, Math.max(1, pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d));
      zoomTo(k, (a.x + b.x) / 2, (a.y + b.y) / 2);
    } else if (pts.size === 1 && scale > 1) {
      tx += e.clientX - p.x; ty += e.clientY - p.y;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      clamp(); apply();
    }
  });
  const up = e => {
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (e.type === 'pointerup' && tapStart && tapStart.onStage && scale === 1 && Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y) < 6) dialog.close(); // tap on empty backdrop
    tapStart = null;
  };
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
  stage.addEventListener('wheel', e => {
    e.preventDefault();
    zoomTo(Math.min(4, Math.max(1, scale * Math.exp(-e.deltaY * .002))), e.clientX, e.clientY);
  }, { passive: false });

  function open() {
    reset();
    history.pushState({ card: 1 }, '');
    dialog.showModal();
  }
  document.querySelectorAll('[data-open-card]').forEach(b => b.addEventListener('click', open));
  dialog.addEventListener('close', () => {
    reset();
    if (history.state && history.state.card) history.back();
  });
  window.addEventListener('popstate', () => { if (dialog.open) dialog.close(); });
}
