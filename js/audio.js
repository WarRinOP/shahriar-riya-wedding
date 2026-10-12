// Background music. unlock() must be called synchronously from the user's tap (iOS / in-app browsers).
const el = document.getElementById('bgm');
const btn = document.getElementById('music');
const TARGET = 0.6;
let ctx, gain, started = false, available = true, muted = false, playing = false;

try { muted = localStorage.getItem('muted') === '1'; } catch {}

el.addEventListener('error', () => { available = false; btn.hidden = true; });

function ramp(to, seconds) {
  if (gain) {
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(to, ctx.currentTime + seconds);
  } else {
    el.volume = to;
  }
}

function setUI(state) {
  btn.classList.toggle('is-muted', state === 'muted');
  btn.classList.toggle('is-blocked', state === 'blocked');
  btn.setAttribute('aria-pressed', String(state === 'muted'));
  btn.setAttribute('aria-label', state === 'muted' ? 'Unmute music' : 'Mute music');
}

async function play() {
  try {
    if (ctx) ctx.resume();
    ramp(0, 0);
    await el.play();
    playing = true;
    ramp(TARGET, 2.5);
    setUI('playing');
  } catch (e) {
    playing = false;
    if (el.error || e.name === 'NotSupportedError') { available = false; btn.hidden = true; return; } // no / unplayable file
    if (available) setUI('blocked');
  }
}

export function unlock() {
  if (started) return;
  started = true;
  if (navigator.audioSession) navigator.audioSession.type = 'playback';
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC) {
    try {
      ctx = new AC();
      ctx.resume();
      gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(el).connect(gain).connect(ctx.destination);
    } catch { ctx = gain = undefined; }
  }
  if (muted) { setUI('muted'); return; }
  play(); // no await before this: keeps the user-gesture
}

export function showButton() { if (available && !el.error && el.networkState !== 3) btn.hidden = false; }

btn.addEventListener('click', () => {
  if (btn.classList.contains('is-blocked')) { muted = false; play(); return; }
  if (playing) {
    muted = true; playing = false;
    ramp(0, .4);
    setTimeout(() => { if (muted) el.pause(); }, 420);
    setUI('muted');
  } else {
    muted = false;
    play();
  }
  try { localStorage.setItem('muted', muted ? '1' : '0'); } catch {}
});

document.addEventListener('visibilitychange', () => {
  if (!started || muted) return;
  if (document.hidden) { el.pause(); playing = false; }
  else play();
});
