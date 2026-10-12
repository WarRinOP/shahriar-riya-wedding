// v2 gate: seal lifts away, the cover splits at the seam and swings open like book covers (hinged on the outer edges).
export function initGate2({ gate, device, scroller, onTap, onDone }) {
  const q = s => gate.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anims = [];
  let started = false;

  // scale factor between the 390x844 artwork and the actual screen (keeps seal / pill aligned with the art)
  const fit = () => { const r = gate.getBoundingClientRect(); gate.style.setProperty('--k', Math.min(r.width / 390, r.height / 844)); };
  fit();
  new ResizeObserver(fit).observe(gate);

  const A = (el, keyframes, opts) => {
    const a = el.animate(keyframes, { fill: 'both', ...opts });
    anims.push(a);
    return a;
  };

  function start() {
    if (started) return;
    started = true;
    gate.classList.add('opening');

    if (reduce) {
      A(gate, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 });
    } else {
      const ease = 'cubic-bezier(.65,0,.25,1)';
      A(q('.seal2'), [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%,-50%) scale(1.3) rotate(8deg)', opacity: 0 },
      ], { duration: 450, easing: 'ease-in' });
      A(q('.tap2'), [{ opacity: 1 }, { opacity: 0 }], { duration: 250 });
      A(q('.skip2'), [{ opacity: 1 }, { opacity: 0 }], { duration: 250 });

      // light spills through the seam as it cracks
      A(q('.seam-glow'), [
        { opacity: 0, transform: 'translateX(-50%) scaleX(.2)' },
        { opacity: .7, transform: 'translateX(-50%) scaleX(.6)', offset: .3 },
        { opacity: 0, transform: 'translateX(-50%) scaleX(7)' },
      ], { delay: 350, duration: 1500 });

      const door = (el, sign, delay) => A(el, [
        { transform: 'translateX(0) rotateY(0)', easing: 'ease-out' },
        { transform: `translateX(${4 * sign}px) rotateY(0)`, offset: .105, easing: ease },
        { transform: `translateX(${4 * sign}px) rotateY(${105 * sign}deg)` },
      ], { delay, duration: 1900 });
      door(q('.door2--l'), -1, 450);
      door(q('.door2--r'), 1, 490);
      gate.querySelectorAll('.shade2').forEach(s => A(s, [{ opacity: 0 }, { opacity: .6 }], { delay: 650, duration: 1500, easing: 'ease-in' }));

      A(scroller, [
        { transform: 'scale(1.08)', filter: 'brightness(.7)' },
        { transform: 'scale(1)', filter: 'brightness(1)' },
      ], { delay: 650, duration: 1900, easing: 'cubic-bezier(.2,.7,.2,1)' });

      // the swung-open cover settles at the edges as slim borders
      device.querySelectorAll('.dock').forEach(d => A(d, [{ opacity: 0 }, { opacity: 1 }], { delay: 1700, duration: 700 }));
    }

    Promise.all(anims.map(a => a.finished)).then(() => {
      gate.style.display = 'none';
      device.classList.add('is-open');
      anims.forEach(a => a.cancel());
      onDone();
    });
  }

  gate.addEventListener('click', e => {
    if (e.target.closest('.skip2')) return;
    onTap();
    start();
  });
  q('.skip2').addEventListener('click', e => {
    e.stopPropagation();
    onTap();
    start();
    anims.forEach(a => a.finish());
  });
}
