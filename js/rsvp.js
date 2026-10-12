// RSVP: builds a WhatsApp message, shows it in a dialog, and hands over via a real link tap.
export function initRsvp() {
  const form = document.getElementById('rsvpForm');
  const guestsField = document.getElementById('guestsField');
  const count = document.getElementById('guestCount');
  const err = document.getElementById('formError');
  const dialog = document.getElementById('rsvpDialog');
  let guests = 1;

  const DRAFT = 'rsvp-draft';
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT) || 'null');
    if (d) { form.name.value = d.name || ''; form.wish.value = d.wish || ''; }
  } catch {}
  form.addEventListener('input', () => {
    try { localStorage.setItem(DRAFT, JSON.stringify({ name: form.name.value, wish: form.wish.value })); } catch {}
  });

  form.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    guests = Math.min(10, Math.max(1, guests + Number(b.dataset.step)));
    count.textContent = guests;
  }));

  form.querySelectorAll('input[name=attend]').forEach(r => r.addEventListener('change', () => {
    guestsField.classList.toggle('is-hidden', form.attend.value === 'decline');
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) {
      err.textContent = 'Please enter your name.';
      err.hidden = false;
      form.name.focus();
      return;
    }
    err.hidden = true;
    const accept = form.attend.value === 'accept';
    const wish = form.wish.value.trim();
    const lines = [
      'Assalamu Alaikum,',
      `I am ${name}. ${accept ? 'I will joyfully attend' : 'I regretfully cannot attend'} the wedding of Shahriar & Riya on Friday, 25 December 2026 at Meraz Convention Hall.`,
    ];
    if (accept) lines.push(`Number of guests: ${guests}`);
    if (wish) lines.push(`Dua / Wishes: ${wish}`);
    const text = lines.join('\n');

    document.getElementById('rsvpName').textContent = name;
    document.getElementById('rsvpPreview').textContent = text;
    document.getElementById('rsvpSend').href = `https://wa.me/${form.to.value}?text=${encodeURIComponent(text)}`;
    dialog.showModal();
  });
}
