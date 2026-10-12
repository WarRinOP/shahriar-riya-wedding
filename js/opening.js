// Gate: ribbon untie -> 3D door swing -> reveal. Built on the Web Animations API so Skip can finish() everything.
export function initGate({ gate, device, scroller, onTap, onDone }) {
  const q = s => gate.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anims = [];
  let started = false;

  const SPEED = 0.72; // < 1 = faster; scales every delay and duration of the opening sequence
  const A = (el, keyframes, opts) => {
    const a = el.animate(keyframes, { fill: 'both', ...opts, delay: (opts.delay || 0) * SPEED, duration: opts.duration * SPEED });
    anims.push(a);
    return a;
  };

  function start() {
    if (started) return;
    started = true;
    gate.classList.add('opening');
    // let the text start appearing while the doors are still clearing, instead of waiting for them to finish
    setTimeout(() => device.classList.add('is-revealed'), reduce ? 300 : 1500 * SPEED);

    if (reduce) {
      A(gate, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 });
    } else {
      const ease = 'cubic-bezier(.65,0,.25,1)';
      const hold = { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 };

      // --- ribbon untie ---
      A(q('.rb-knot'), [
        { transform: 'scale(1) rotate(0)', opacity: 1 },
        { transform: 'scale(1.06) rotate(3deg)', opacity: 1, offset: .25 },
        { transform: 'scale(.6) rotate(-8deg)', opacity: 0 },
      ], { duration: 600, easing: 'ease-in' });
      A(q('.rb-loop-l'), [{ transform: 'none', opacity: 1 }, { transform: 'rotate(-25deg) scaleX(.2)', opacity: 0 }], { delay: 150, duration: 350, easing: 'ease-in' });
      A(q('.rb-loop-r'), [{ transform: 'none', opacity: 1 }, { transform: 'rotate(25deg) scaleX(.2)', opacity: 0 }], { delay: 150, duration: 350, easing: 'ease-in' });
      A(q('.rb-band-l'), [{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(-60%)', opacity: 0 }], { delay: 150, duration: 450, easing: 'ease-in' });
      A(q('.rb-band-r'), [{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(60%)', opacity: 0 }], { delay: 150, duration: 450, easing: 'ease-in' });
      const fall = sway => [
        { transform: 'translateY(0) rotate(0) scale(1)', opacity: 1 },
        { transform: `translateY(18px) rotate(${sway}deg) scale(.99)`, opacity: 1, offset: .35 },
        { transform: `translateY(34px) rotate(${-sway / 2}deg) scale(.97)`, opacity: .8, offset: .7 },
        { transform: `translateY(50px) rotate(${sway / 4}deg) scale(.95)`, opacity: 0 },
      ];
      A(q('.rb-tail-l'), fall(6), { delay: 250, duration: 600, easing: 'cubic-bezier(.55,0,1,.45)' });
      A(q('.rb-tail-r'), fall(-6), { delay: 280, duration: 600, easing: 'cubic-bezier(.55,0,1,.45)' });
      A(q('.seal'), [hold, { transform: 'translate(-50%,-50%) scale(1.15)', opacity: 0 }], { duration: 500, easing: 'ease-in' });
      A(q('.hint'), [{ opacity: 1 }, { opacity: 0 }], { duration: 250 });
      A(q('.skip'), [{ opacity: 1 }, { opacity: 0 }], { duration: 250 });

      // --- doors: seam cracks, then swing outward ---
      const door = (el, sign, delay) => A(el, [
        { transform: 'translateX(0) rotateY(0)', easing: 'ease-out' },
        { transform: `translateX(${4 * sign}px) rotateY(0)`, offset: .105, easing: ease },
        { transform: `translateX(${4 * sign}px) rotateY(${105 * sign}deg)` },
      ], { delay, duration: 1900 });
      door(q('.door--l'), -1, 600);
      door(q('.door--r'), 1, 640);
      gate.querySelectorAll('.shade').forEach(s => A(s, [{ opacity: 0 }, { opacity: .55 }], { delay: 800, duration: 1500, easing: 'ease-in' }));

      // --- inner page settles in ---
      A(scroller, [
        { transform: 'scale(1.08)', filter: 'brightness(.7)' },
        { transform: 'scale(1)', filter: 'brightness(1)' },
      ], { delay: 750, duration: 1900, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }

    Promise.all(anims.map(a => a.finished)).then(() => {
      gate.hidden = true;
      gate.style.display = 'none';
      device.classList.add('is-open');
      anims.forEach(a => a.cancel());
      onDone();
    });
  }

  gate.addEventListener('click', e => {
    if (e.target.closest('.skip')) return;
    onTap();
    start();
  });
  q('.skip').addEventListener('click', e => {
    e.stopPropagation();
    onTap();
    start();
    anims.forEach(a => a.finish());
  });
}
