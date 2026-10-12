// Procedural vector art: floral vines for the doors / side margins and the hexagon crest.
const RED = '#A82034', GREEN = '#0E4D3E', LEAF = '#2F6B58', GOLD = '#C5A059';
const f = n => Math.round(n * 10) / 10;

const leaf = (x, y, a, s = 1) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${a})">` +
  `<path d="M0 0C${6 * s} ${-7 * s} ${19 * s} ${-7 * s} ${27 * s} 0C${19 * s} ${7 * s} ${6 * s} ${7 * s} 0 0Z" fill="${LEAF}" stroke="${GREEN}" stroke-width=".6"/>` +
  `<path d="M1 0L${24 * s} 0" stroke="#dbe9e0" stroke-width=".5" opacity=".7"/></g>`;

const rose = (x, y, r) =>
  `<g transform="translate(${f(x)} ${f(y)})">` +
  `<circle r="${r}" fill="#F8E3E5" stroke="${RED}" stroke-width="1"/>` +
  `<circle r="${f(r * .72)}" fill="none" stroke="${RED}" stroke-width=".8"/>` +
  `<path d="M0 ${f(-r * .5)}C${f(r * .6)} ${f(-r * .5)} ${f(r * .6)} ${f(r * .3)} 0 ${f(r * .3)}C${f(-r * .4)} ${f(r * .3)} ${f(-r * .4)} ${f(-r * .2)} 0 ${f(-r * .2)}" fill="none" stroke="${RED}" stroke-width=".9"/>` +
  `</g>`;

const berry = (x, y, r = 2) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${GOLD}"/>`;

function vineInner({ w, h, amp, period = 70, leafEvery = 34, roseEvery = 170, k = 1 }) {
  const cx = w / 2;
  const stem = y => cx + amp * Math.sin((y / period) * Math.PI);
  let d = '';
  for (let y = -10; y <= h + 10; y += 6) d += `${d ? 'L' : 'M'}${f(stem(y))} ${y}`;
  let out = `<path d="${d}" fill="none" stroke="${GREEN}" stroke-width="1.7" stroke-linecap="round"/>`;
  for (let i = 0, y = 22; y < h; y += leafEvery, i++) {
    const side = i % 2 ? 1 : -1;
    const s = .8 + ((i * 7) % 3) * .15;
    out += leaf(stem(y), y, side > 0 ? -38 : 218, s * k);
    if (i % 3 === 0) out += berry(stem(y) + side * 16, y - 14);
  }
  for (let n = 0, y = 90; y < h - 30; y += roseEvery, n++) {
    const side = n % 2 ? 1 : -1;
    out += leaf(stem(y), y + 12, side > 0 ? 24 : 156, 1.1 * k);
    out += rose(stem(y) + side * amp * .55, y, (12 + (n % 2) * 3) * k);
  }
  return out;
}

const svg = (w, h, inner) =>
  `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${inner}</svg>`;

export const doorArt = () => {
  const w = 200, h = 900;
  const border =
    `<rect x="9" y="9" width="182" height="882" rx="3" fill="none" stroke="${GOLD}" stroke-width="1.2"/>` +
    `<rect x="14" y="14" width="172" height="872" rx="2" fill="none" stroke="${GOLD}" stroke-width=".6" opacity=".7"/>`;
  return svg(w, h, border + vineInner({ w, h, amp: 34 }));
};

export const marginArt = () => {
  const w = 48, h = 1500;
  return svg(w, h, vineInner({ w, h, amp: 6, leafEvery: 30, roseEvery: 210, k: .62 }));
};

export const crestArt = () => {
  const hex = (dx = 0, dy = 0) =>
    [[110, 30], [179.3, 70], [179.3, 150], [110, 190], [40.7, 150], [40.7, 70]]
      .map(([x, y]) => `${f(x + dx)},${f(y + dy)}`).join(' ');
  const sprig = (x, y, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0C14 -6 26 -4 36 4" fill="none" stroke="${GREEN}" stroke-width="1.4"/>` +
    leaf(10, -3, -50, .6) + leaf(18, -2, 45, .6) + leaf(26, 0, -50, .6) + leaf(33, 3, 40, .55) + berry(36, 4, 2) + `</g>`;
  return `<svg viewBox="0 0 220 220" role="img" aria-label="Shahriar weds Riya">` +
    `<polygon points="${hex()}" fill="none" stroke="${RED}" stroke-width="2"/>` +
    `<polyline points="32.7,64 102,24 171.3,64 171.3,144" fill="none" stroke="${RED}" stroke-width="2"/>` +
    sprig(150, 44, -28) + sprig(70, 176, 152) +
    `<text x="110" y="108" text-anchor="middle" font-family="'Great Vibes',cursive" font-size="34" fill="${RED}">Shahriar</text>` +
    `<text x="110" y="128" text-anchor="middle" font-family="'Cormorant Garamond',serif" font-style="italic" font-size="14" fill="${RED}">Weds</text>` +
    `<text x="110" y="158" text-anchor="middle" font-family="'Great Vibes',cursive" font-size="34" fill="${RED}">Riya</text>` +
    `</svg>`;
};
