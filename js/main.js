import { doorArt, marginArt, crestArt } from './art.js';
import { initGate } from './opening.js';
import { unlock, showButton } from './audio.js';
import { initCountdown } from './countdown.js';
import { initLightbox } from './lightbox.js';

const $ = s => document.querySelector(s);
const device = $('#device'), scroller = $('#scroller'), gate = $('#gate');

// vector art
document.querySelectorAll('[data-vine="door"]').forEach(el => el.insertAdjacentHTML('afterbegin', doorArt()));
document.querySelectorAll('[data-vine="margin"]').forEach(el => { el.innerHTML = marginArt(); });
document.querySelectorAll('[data-crest]').forEach(el => { el.innerHTML = crestArt(); });

// keep the invitation inert until the gate opens
scroller.inert = true;
scroller.style.overflow = 'hidden';

initGate({
  gate, device, scroller,
  onTap: unlock,
  onDone() {
    scroller.inert = false;
    scroller.style.overflow = '';
    device.classList.add('is-revealed');
    showButton();
    $('#heroTitle').focus({ preventScroll: true });
  },
});

// scroll reveals
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { root: scroller, threshold: 0.2 });
document.querySelectorAll('.sec [data-reveal], .viewer [data-reveal]').forEach(el => io.observe(el));

initCountdown($('#countdown'));
initLightbox();

// calendar link (Google)
const g = new URL('https://calendar.google.com/calendar/render');
g.search = new URLSearchParams({
  action: 'TEMPLATE',
  text: 'Wedding of Shahriar & Riya',
  dates: '20261225T123000Z/20261225T163000Z',
  location: 'Meraz Convention Hall, Safura Trade City (Lift-10), Sujat Nogor, 142 Sena Nibas Road, Mirpur-12, Dhaka-1216',
  details: 'Wedding ceremony of M Shahriar Bin Malek and Sadia Afrin Riya. Contact: 01713663450 / 01760925985',
}).toString();
$('#gcalLink').href = g.toString();

// generic dialog open / close (+ backdrop tap)
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.open).showModal()));
document.querySelectorAll('dialog [data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
document.querySelectorAll('dialog.sheet').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
