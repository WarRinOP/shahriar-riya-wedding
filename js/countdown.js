// Target: 25 Dec 2026, 6:30 PM Bangladesh time.
const TARGET = new Date('2026-12-25T18:30:00+06:00').getTime();

export function initCountdown(root) {
  const nums = {};
  root.querySelectorAll('[data-u]').forEach(n => { nums[n.dataset.u] = n; });
  const done = root.querySelector('.count-done');
  const last = {};

  const set = (key, value) => {
    if (last[key] === value) return;
    last[key] = value;
    const n = nums[key];
    n.textContent = value;
    n.classList.remove('tick');
    void n.offsetWidth; // restart the roll animation
    n.classList.add('tick');
  };

  function render() {
    const ms = TARGET - Date.now();
    if (ms <= 0) {
      root.querySelector('.units').hidden = true;
      done.hidden = false;
      return;
    }
    const s = Math.floor(ms / 1000);
    set('days', Math.floor(s / 86400));
    set('hours', String(Math.floor((s % 86400) / 3600)).padStart(2, '0'));
    set('minutes', String(Math.floor((s % 3600) / 60)).padStart(2, '0'));
    set('seconds', String(s % 60).padStart(2, '0'));
    setTimeout(render, 1000 - (Date.now() % 1000) + 5); // re-sync to the next whole second
  }
  render();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
}
