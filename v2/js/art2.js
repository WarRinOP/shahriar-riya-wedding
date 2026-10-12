// v2 art: "Terracotta Temple Niche" cover (as two halves), second-page backdrop, and the docked edge slivers.
// Coordinates: the cover is drawn on a 390 x 844 canvas; the second page on 390 x HERO_H.
const C = {
  brick: '#A9401F', mortar: '#7A2A12', band: '#822818', gold: '#E59D3A', marigold: '#F2B83B', beam: '#F2BC53',
  peach: '#F2C48B', peachDk: '#E5A67B', cream: '#FFF3DC', creamDk: '#FDE8BF',
  crimson: '#A82034', maroon: '#5C0F1F', deep: '#3A0712', green: '#2F7D3A', green2: '#3E9A4B',
  red: '#E8472B', skin: '#8B4A2B',
};
export const HERO_H = 944;          // second-page canvas height (names etc. sit 100px lower than the Stitch mock-up to fit the invocation text)
const SHIFT = HERO_H - 844;

const f = n => Math.round(n * 10) / 10;
const ANIM = !matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- shared pieces ----------
function rays(cx, cy, step, width, fill, r = 1400) {
  let out = '';
  for (let a = -90 - 180; a < 270; a += step) {
    const a0 = (a - width / 2) * Math.PI / 180, a1 = (a + width / 2) * Math.PI / 180;
    out += `M${cx} ${cy}L${f(cx + r * Math.cos(a0))} ${f(cy + r * Math.sin(a0))}L${f(cx + r * Math.cos(a1))} ${f(cy + r * Math.sin(a1))}Z`;
  }
  return `<path d="${out}" fill="${fill}"/>`;
}

const sway = (anim, cx, cy, deg, dur) => anim
  ? `<animateTransform attributeName="transform" type="rotate" values="${-deg} ${cx} ${cy};${deg} ${cx} ${cy};${-deg} ${cx} ${cy}" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>`
  : '';
const bob = (anim, dy, dur) => anim
  ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 ${-dy};0 0" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>`
  : '';

function bearer(tunic) {
  return `<g>
    <path d="M-6 104L-26 133M5 104L16 130" stroke="${C.skin}" stroke-width="8" stroke-linecap="round" fill="none"/>
    <ellipse cx="-27" cy="136" rx="9" ry="4" fill="${C.deep}"/><ellipse cx="17" cy="132" rx="9" ry="4" fill="${C.deep}"/>
    <path d="M-19.5 64H14L15.5 106H-22.5Z" fill="${C.cream}"/>
    <path d="M-21 96H15" stroke="${C.red}" stroke-width="2.5"/>
    <rect x="-14.5" y="15" width="24" height="50" rx="7" fill="${tunic}"/>
    <path d="M-12 18L6 56" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>
    <path d="M-4 24L14 19" stroke="${C.skin}" stroke-width="7" stroke-linecap="round"/>
    <circle r="11" fill="${C.skin}"/>
    <path d="M-11.5 -1A11.5 11.5 0 0 1 11.5 -1Z" fill="${C.red}"/>
    <path d="M-8 -9L-15 -17" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round"/>
  </g>`;
}

// palki + two bearers in cover coordinates (finial at 195,473)
function palkiScene({ canopy, tunic }) {
  let fringe = '', bells = '', pleats = '';
  for (let x = -60; x < 60; x += 12) fringe += `M${x} 157L${x + 6} 168L${x + 12} 157Z`;
  for (const x of [-70, -46.5, -23.5, 0, 23, 46, 69.5]) bells += `<path d="M${x} 84V98" stroke="${C.marigold}" stroke-width="1.5"/><circle cx="${x}" cy="98" r="4.5" fill="${C.marigold}"/>`;
  for (let x = -39; x <= 39; x += 7) if (Math.abs(x) > 5) pleats += `M${x} 91V140`;
  return `<g>
    <path d="M30 546L120 535M270 535L360 546" stroke="${C.deep}" stroke-width="6" fill="none"/>
    <g transform="translate(63.5 515)">${bearer(tunic)}</g>
    <g transform="translate(326.5 515) scale(-1 1)">${bearer(tunic)}</g>
    <g transform="translate(195 473)">
      <path d="M0 0V17" stroke="${C.marigold}" stroke-width="2.5"/><circle r="6.5" fill="${C.marigold}"/>
      <rect x="-61.5" y="79" width="123" height="78" rx="6" fill="${C.maroon}" stroke="${C.marigold}" stroke-width="3"/>
      <rect x="-43" y="89" width="40" height="52" fill="${C.red}"/><rect x="3" y="89" width="40" height="52" fill="${C.red}"/>
      <path d="${pleats}" stroke="#B8341C" stroke-width="1.2"/>
      <rect x="-43" y="139" width="86" height="4" fill="${C.marigold}"/><rect x="-2.5" y="87" width="5" height="57" fill="${C.marigold}"/>
      <path d="${fringe}" fill="${C.marigold}"/>
      ${bells}
      <path d="M-79 79C-70 32 -35 17 0 17C35 17 70 32 79 79Z" fill="${canopy}" stroke="${C.marigold}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-43 73Q-35 35 0 31Q35 35 43 73" fill="none" stroke="${C.cream}" stroke-width="2" stroke-dasharray="0.1 4.5" stroke-linecap="round"/>
    </g>
  </g>`;
}

function pot(cx, ballY, ball) {
  const t = ballY;
  return `<g>
    <circle cx="${cx}" cy="${t}" r="7.5" fill="${ball}"/>
    <rect x="${cx - 10}" y="${t + 7}" width="20" height="10" fill="${C.marigold}" stroke="${C.maroon}" stroke-width="2"/>
    <path d="M${cx - 14} ${t + 17}C${cx - 27} ${t + 30} ${cx - 25} ${t + 50} ${cx - 20} ${t + 62}H${cx + 20}C${cx + 25} ${t + 50} ${cx + 27} ${t + 30} ${cx + 14} ${t + 17}Z" fill="${C.marigold}" stroke="${C.maroon}" stroke-width="2"/>
    <path d="M${cx - 24} ${t + 35}H${cx + 24}M${cx - 22} ${t + 49}H${cx + 22}" stroke="${C.maroon}" stroke-width="2"/>
  </g>`;
}

function diamondChain(y, color, dot) {
  let d = '', dots = '';
  for (let x = 10; x < 400; x += 20) {
    d += `M${x} ${y - 13}L${x + 10} ${y}L${x} ${y + 13}L${x - 10} ${y}Z`;
    dots += `<circle cx="${x}" cy="${y}" r="3.4" fill="${dot}"/>`;
  }
  return `<path d="${d}" fill="${color}"/>${dots}`;
}

// ---------- COVER ----------
function coverArt(id, { anim }) {
  const archOuter = 'M30 900V295C30 255 70 225 105 185C145 140 175 105 195 59C215 105 245 140 285 185C320 225 360 255 360 295V900Z';
  const archInner = 'M50 900V298C50 268 88 242 120 206C152 168 180 132 195 94C210 132 238 168 270 206C302 242 340 268 340 298V900Z';
  let band = '';
  for (let x = 20; x < 400; x += 40) band += `M${x} 780L${x + 9} 794L${x} 808L${x - 9} 794Z`;
  return `
  <defs>
    <pattern id="${id}b" width="36" height="44" patternUnits="userSpaceOnUse">
      <rect width="36" height="44" fill="${C.brick}"/>
      <path d="M0 .6H36M0 22.6H36M.6 0V22M18.6 22V44" stroke="${C.mortar}" stroke-width="1.6" fill="none"/>
    </pattern>
    <clipPath id="${id}a"><path d="${archInner}"/></clipPath>
  </defs>
  <rect x="-500" y="-300" width="1400" height="1500" fill="url(#${id}b)"/>
  <path d="${archOuter}" fill="${C.band}" stroke="${C.gold}" stroke-width="3" stroke-linejoin="round"/>
  <path d="${archInner}" fill="${C.peachDk}" stroke="${C.maroon}" stroke-width="1.6"/>
  <g clip-path="url(#${id}a)">
    <g>${anim ? sway(true, 195, 330, 3, 9) : ''}${rays(195, 330, 24, 12, C.peach)}</g>
    <rect x="0" y="615" width="400" height="300" fill="${C.peach}"/>
    <ellipse cx="195" cy="672" rx="316" ry="8" fill="#B58E6A" opacity=".55"/>
    ${pot(77.5, 682, C.green)}${pot(312.5, 682, C.green)}
  </g>
  <g>${bob(anim, 2.2, 1.5)}${palkiScene({ canopy: C.green, tunic: C.crimson })}</g>
  <rect x="-500" y="770" width="1400" height="400" fill="${C.maroon}"/>
  <path d="${band}" fill="${C.marigold}"/>
  <path d="M195 0V844" stroke="${C.beam}" stroke-width="2"/>
`;
}

export function coverHalf(side) {
  const L = side === 'L';
  return `<svg viewBox="${L ? '0' : '195'} 0 195 844" preserveAspectRatio="${L ? 'xMaxYMid' : 'xMinYMid'} meet" aria-hidden="true">${coverArt(L ? 'cL' : 'cR', { anim: ANIM })}</svg>`;
}

// ---------- SECOND PAGE BACKDROP ----------
export function heroArt() {
  const s = SHIFT;
  const y = v => v + s;
  const cy = 274.6; // arch circle centre (top of the arch is not shifted: the invocation text sits inside it)
  const wave = (top, h, fill, amp = 7) =>
    `<path d="M0 ${top}Q49 ${top - amp} 97.5 ${top}T195 ${top}T292.5 ${top}T390 ${top}V${top + h}H0Z" fill="${fill}"/>`;
  const ground = y(690);
  return `<svg viewBox="0 0 390 ${HERO_H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="390" height="${HERO_H}" fill="${C.cream}"/>
    <g>${rays(195, y(320), 20, 11, C.creamDk)}</g>
    <path d="M27 281A170.6 170.6 0 0 1 363 281" fill="none" stroke="${C.crimson}" stroke-width="3"/>
    <path d="M41 286A156 156 0 0 1 349 286M40 286V${y(700)}M350 286V${y(700)}" fill="none" stroke="${C.marigold}" stroke-width="2.4" stroke-dasharray="0.1 5.4" stroke-linecap="round"/>
    <path d="M120 112H270" stroke="${C.crimson}" stroke-width="2"/><path d="M195 104L203 112L195 120L187 112Z" fill="${C.crimson}"/>
    <path d="M110 ${y(424)}H280" stroke="${C.crimson}" stroke-width="2.4" stroke-dasharray="0.1 5.4" stroke-linecap="round"/>
    ${diamondChain(24, C.crimson, C.marigold)}
    ${wave(ground, 110, C.green2, 8)}
    ${wave(ground + 20, 8, C.green, 7)}${wave(ground + 42, 9, C.green, 6)}${wave(ground + 66, 9, C.green, 6)}${wave(ground + 14 - 14, 7, C.green, 8)}
    <rect y="${y(790)}" width="390" height="3" fill="${C.crimson}"/>
    <rect y="${y(790) + 3}" width="390" height="${HERO_H - y(790) - 3}" fill="${C.cream}"/>
    ${pot(66, y(682) - 12, C.green)}${pot(324, y(682) - 12, C.green)}
    <g transform="translate(195 ${y(589)}) scale(.59) translate(-195 -473)"><g>${bob(ANIM, 3, 1.5)}${palkiScene({ canopy: C.crimson, tunic: C.green })}</g></g>
    ${diamondChain(y(820), C.crimson, C.marigold)}
  </svg>`;
}

// ---------- SEAL + CREST (same hexagon language as the cover) ----------
const hex = (cx, cy, r) => [0, 1, 2, 3, 4, 5].map(i => {
  const a = (-90 + i * 60) * Math.PI / 180;
  return `${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))}`;
}).join(' ');

function hexLayers(cx, cy, R) {
  return `<polygon points="${hex(cx, cy, R)}" fill="${C.maroon}"/>
    <polygon points="${hex(cx, cy, R * .94)}" fill="${C.marigold}"/>
    <polygon points="${hex(cx, cy, R * .82)}" fill="${C.cream}"/>
    <polygon points="${hex(cx, cy, R * .78)}" fill="${C.crimson}"/>
    <polygon points="${hex(cx, cy, R * .64)}" fill="none" stroke="${C.marigold}" stroke-width="1"/>`;
}

// tap-to-open seal: "S & R" in a bold high-contrast serif (Playfair Display), as in the Stitch cover
export const sealArt = () => `<svg viewBox="0 0 100 100" aria-hidden="true">${hexLayers(50, 50, 50)}
  <text x="50" y="58.5" text-anchor="middle" font-family="'Playfair Display',Georgia,serif" font-weight="700" font-size="22" letter-spacing=".5" fill="${C.cream}">S &amp; R</text></svg>`;

// families crest: "Shahriar Weds Riya" (from the printed card) in the seal style
export const crestArt2 = () => `<svg viewBox="0 0 200 200" role="img" aria-label="Shahriar weds Riya">${hexLayers(100, 100, 94)}
  <text x="100" y="97" text-anchor="middle" font-family="'Great Vibes',cursive" font-size="31" fill="${C.cream}">Shahriar</text>
  <text x="100" y="116" text-anchor="middle" font-family="'Cormorant Garamond',serif" font-style="italic" font-weight="600" font-size="14" fill="${C.marigold}">Weds</text>
  <text x="100" y="144" text-anchor="middle" font-family="'Great Vibes',cursive" font-size="31" fill="${C.cream}">Riya</text></svg>`;
