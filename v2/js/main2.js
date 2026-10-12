import { coverHalf, coverDock, heroArt, sealArt, crestArt2 } from './art2.js';
import { initGate2 } from './gate2.js';
import { unlock, showButton } from '/js/audio.js';
import { initCountdown } from '/js/countdown.js';
import { initLightbox } from '/js/lightbox.js';

const $ = s => document.querySelector(s);
const device = $('#device'), scroller = $('#scroller'), gate = $('#gate');

// vector art
document.querySelectorAll('[data-cover]').forEach(el => el.insertAdjacentHTML('afterbegin', coverHalf(el.dataset.cover)));
document.querySelectorAll('[data-dock]').forEach(el => { el.innerHTML = coverDock(el.dataset.dock); });
$('[data-hero-art]').innerHTML = heroArt();
$('[data-seal]').innerHTML = sealArt();
document.querySelectorAll('[data-crest]').forEach(el => { el.innerHTML = crestArt2(); });

// keep the invitation inert until the cover opens
scroller.inert = true;
scroller.style.overflow = 'hidden';

initGate2({
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

// Google Calendar link
const g = new URL('https://calendar.google.com/calendar/render');
g.search = new URLSearchParams({
  action: 'TEMPLATE',
  text: 'Wedding of Shahriar & Riya',
  dates: '20261225T123000Z/20261225T163000Z',
  location: 'Meraz Convention Hall, Safura Trade City (Lift-10), Sujat Nogor, 142 Sena Nibas Road, Mirpur-12, Dhaka-1216',
  details: 'Wedding ceremony of M Shahriar Bin Malek and Sadia Afrin Riya. Contact: 01713663450 / 01760925985',
}).toString();
$('#gcalLink').href = g.toString();

// dialogs
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.open).showModal()));
document.querySelectorAll('dialog [data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
document.querySelectorAll('dialog.sheet').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
