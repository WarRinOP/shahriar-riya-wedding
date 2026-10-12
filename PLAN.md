# Implementation Plan — Shahriar & Riya Digital Invitation

Build plan for the mobile-first wedding invitation landing page described in `BRIEF.md`, recreating the interaction in the reference screen recording with the details from `Wedding Card.jpeg`.

---

## 1. Content scope (decided)

The page shows **only information printed on `Wedding Card.jpeg`**, plus one exception: the **Gifts & Dua** section.

This overrides `BRIEF.md` where they differ. Dropped from `BRIEF.md`:

- Evening Programme / timeline (times are not on the card).

- Dress Code guide and colour palette swatches.

- Any RSVP deadline, venue description, or other copy not on the card.

### Content inventory

Every piece of text on the page, and where it comes from:

| Text | Source |
|---|---|
| بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ | Card (calligraphy, top) |
| "In the name of Almighty Allah, the most Beneficent & the most Merciful" | Card |
| "We cordially request the pleasure of your gracious presence & blessings at the Wedding Ceremony of" | Card |
| **M Shahriar Bin Malek** — *Only Son of Mohammad Abdul Malek & Kohinur Begum* | Card |
| *With* | Card |
| **Sadia Afrin Riya** — *Only Daughter of G M Belal Hossain & Rokeya Sultana* | Card |
| Shahriar *Weds* Riya (monogram) | Card (hexagon crest) |
| Friday · December 25 · 2026 · 6:30 PM | Card (date block) |
| Venue: **Meraz Convention Hall** | Card |
| Safura Trade City (Lift-10), Sujat Nogor, 142 Sena Nibas Road, Mirpur-12, Dhaka-1216 | Card |
| Contact: 01713663450, 01760925985 | Card |
| "A Thoughtful Gesture" — *"Your presence and sincere prayers (Dua) are the most precious gifts we could ask for as we begin our new journey together."* | `BRIEF.md` (kept by request) |

UI labels (button text such as "View on Google Maps", "Add to Calendar", "Tap to Open", "Skip", countdown unit names, form field labels) are interface chrome, not content, and are allowed.

---

## 2. Reference observations

### From the screen recording (*The Digital Yes*, opened from WhatsApp)

- **Closed (0.0s):** two tall doors with embossed floral artwork; a wide satin bow tied across the middle with hanging tails; small "Skip" pill bottom-right.

- **Tap (~1.5s):** the bow vanishes first — tails slide down and fade.

- **2.6s → 4.6s:** the seam cracks open a few pixels, then both doors swing outward until edge-on. The inner page zooms gently from about 1.08× to 1.0× while they open.

- **5.0s / 5.6s / 6.2s:** first name, then "&", then second name plus date fade in, roughly 0.6s apart. "Skip" turns into a speaker icon.

- **Scroll:** "COUNTING THE DAYS" (four large serif numbers, small tracked labels), When & Where with a "View map" pill, Gifts ("A THOUGHTFUL GESTURE"), RSVP inside a floral arch. Airy layout, hairline dividers between sections.

- **The status bar shows "◂ WhatsApp"** — the WhatsApp in-app browser is the primary runtime.

### From the card

- Single-ink **crimson** (≈ `#A82034`) on white — not burgundy + gold.

- Script italic for names and invocation; bold serif for the date block.

- Date block: `Friday │ 25 │ 6:30 PM`, with "December" above and "2026" below, separated by vertical rules.

- Double-stroke **hexagon crest** with floral vines on two corners: "Shahriar / Weds / Riya".

- **Palki** (bridal palanquin with two bearers) illustration on the left.

- Pre-extracted PNGs in `./assets/` are tiny (130–240px) and `Wedding Card.jpeg` is 1379×999 — confirming the code-first approach; the card will look soft when zoomed.

---

## 3. Design system

### Colour tokens

| Token | Value | Use |
|---|---|---|
| `--ivory` | `#FBF7EE` | Page base |
| `--ivory-hi` | `#FFFDF9` | Cards, paper |
| `--ivory-lo` | `#F5EFEB` | Recessed surfaces |
| `--crimson` | `#A82034` | Names, crest, primary ink (matches card) |
| `--burgundy` | `#7A1223` | Deep accents, seal |
| `--gold` | `#C5A059` | Ornament lines only |
| `--gold-hi` | `#D4AF37` | Foil highlights |
| `--espresso` | `#2C2523` | Body text |

Gold is **never used for text** (≈2.2:1 on ivory, fails WCAG). All text ≥ 4.5:1.

### Typography (Google Fonts, `display=swap`)

- **Cormorant Garamond** (400/500/600 + italic) — headings, names, date block.

- **Great Vibes** — ampersand, "With", "Weds", script flourishes.

- **Montserrat** (400/500) — small tracked labels, body, buttons.

- **Amiri** — Bismillah, loaded with `&text=` so only the needed glyphs download.

### Layout

- Mobile-first for 390–430px.

- `.device` (relative, `overflow: hidden`) contains `.scroller` (scrolls), the gate overlay and the music button (both absolute). On phones `.device` is `100dvh` with safe-area insets; on desktop it becomes a 430px rounded phone frame over a blurred crimson/gold backdrop with a slowly drifting, oversized copy of the floral SVG.

- This keeps the floating music button inside the phone frame on desktop (a `position: fixed` button would escape it).

---

## 4. File structure

Vanilla HTML/CSS/ES modules, no build step. Served locally with `python3 -m http.server`, deployed with `vercel --prod`.

```
index.html              markup, inline SVG <symbol> sprite, Open Graph meta
css/tokens.css          colours, type scale, easings, spacing
css/styles.css          layout, gate, sections, dialogs
js/main.js              boot: fonts.ready → arm gate → wire modules
js/opening.js           ribbon + door timeline (Web Animations API)
js/audio.js             unlock, fade, mute, visibility handling
js/countdown.js
js/calendar.js
js/rsvp.js
js/lightbox.js
js/reveal.js            IntersectionObserver scroll reveals
assets/wedding-card.jpg copy of "Wedding Card.jpeg" (no spaces in URLs)
assets/audio/bgm.m4a    background music (to be supplied)
wedding.ics             static calendar file
og-image.jpg            1200×630 link-preview image
```

---

## 5. Step 1 — SVG library (text & code first)

One inline `<svg><symbol>` sprite in `index.html`, reused with `<use>`. Crisp at any DPI, zero extra requests.

- **Hexagon crest** — replicates the card: two offset hexagon outlines in crimson, floral vines on the top-right and bottom-left corners, "Shahriar / Weds / Riya" in Great Vibes. Used as the ribbon seal, in the families section, and as the favicon.

- **Ribbon seal** — the hexagon filled with a burgundy→crimson radial gradient, gold-foil inner rim, "S & R" inside. A static `feTurbulence` + `feDisplacementMap` filter roughens the edge to read as wax (never animated).

- **Door artwork** — a vertical floral vine (rose, bud, leaf, curl symbols) drawn once and mirrored with `scaleX(-1)` for the right door. Paper grain from a low-opacity `feTurbulence` layer; the embossed look from two hairline `drop-shadow`s (light above, dark below). Filters are applied once and the layer only moves by transform, so the browser caches the rendered result.

- **Inner frame** — gold art-nouveau knotwork, crimson florals and a double-line oval cartouche, following the recording's composition.

- **Bismillah** — final decision: set as live Arabic type (Amiri Bold, crimson, flanked by gold rules), *not* the small PNG crop, which is too soft on Retina screens. The font request is subset to the Bismillah glyphs only.

- **Palki** — final decision: not used as an image (the source crop is ~200px and blurry). The dividers are pure-CSS gold hairlines with a diamond ornament; the hexagon crest and the real card image in the lightbox carry the traditional feel.

- **Line icons** — pin, calendar, phone, WhatsApp, speaker, close, zoom. No emoji (they render differently on every phone).

---

## 6. Step 2 — Gate & opening sequence

### Markup

```html
<div class="gate">                         <!-- perspective: 1400px -->
  <div class="door door--l">
    <div class="face front"></div>
    <div class="face back"></div>
    <div class="shade"></div>
  </div>
  <div class="door door--r">…same…</div>
  <svg class="ribbon">band-l, band-r, loop-l, loop-r, knot, tail-l, tail-r</svg>
  <button class="seal" aria-label="Open invitation">…crest…</button>
  <p class="hint">Tap to Open</p>
  <button class="skip">Skip</button>
</div>
```

### Doors

- Each door: `transform-style: preserve-3d`. Left `transform-origin: left center`, right `transform-origin: right center`.

- A back face (rotated 180°, `backface-visibility: hidden`) means that past 90° you see plain ivory paper instead of mirrored artwork.

- `.shade` is a gradient darkening toward the hinge; its opacity animates 0 → 0.55 as the door turns, mimicking paper shading.

- The inner page starts with a dark inset vignette that fades out — light flooding in as the doors open.

- At ±105° under perspective each door ends as a thin sliver at its edge, satisfying both the recording (doors leave) and `BRIEF.md` (doors dock as margins, `pointer-events: none`).

### Ribbon untie

Transform and opacity only (Safari cannot animate SVG path `d`).

1. **Tension (0–150ms):** knot swells to 1.06× and rotates ~3°.

2. **Loops collapse (150–500ms):** each loop pivots on the knot, rotating outward and shrinking to `scaleX(.2)`, ease-in. The two band halves slide apart (±60%) and fade — the ribbon being pulled loose.

3. **Tails fall (250–850ms):** `translateY(0 → 50px) scale(.95)` on `cubic-bezier(.55,0,1,.45)` (accelerating, reads as gravity), with a damped sway (0° → 6° → −3° → 1.5°), fading to 0.

4. **Seal lifts:** rises toward the viewer (`translateZ` / scale 1.15) and fades.

### Timeline (ms from tap)

Driven by the Web Animations API (`el.animate()`): precise timing, `.finished` promises for sequencing, no library, and `finish()` makes Skip instant.

| t (ms) | Event |
|---|---|
| 0 | `audio.unlock()` (must be in the same click call stack); ribbon untie starts |
| 600 | Seam cracks: doors `translateX(∓4px)`, 200ms |
| 750 | Doors swing to `rotateY(∓105deg)` over 1700ms, `cubic-bezier(.65,0,.25,1)`; right door starts 40ms later |
| 750 | Inner page `scale(1.08)` + vignette → `scale(1)` + clear, over 1900ms |
| 2500 | Doors `pointer-events: none`; `.scroller` loses `inert`; focus moves to the hero heading |
| 2800+ | Hero staggered reveal (Step 4) |

### Idle and edge cases

- **Before the tap:** seal breathes (scale 1 ↔ 1.035, 3s, plus a soft gold glow), a slow sheen sweeps across the satin, the hint text pulses gently.

- The gate is only armed after `document.fonts.ready`, so no font swap is visible during the reveal.

- **Skip:** also calls `audio.unlock()`, then `finish()`es every running animation and jumps to the end state.

- **`prefers-reduced-motion`:** the whole sequence becomes a 400ms crossfade.

- **Performance:** only `transform` / `opacity` animate; `will-change` is set only while animating. Test with Chrome's 4× CPU throttle as a stand-in for mid-range Android.

---

## 7. Step 3 — Audio unlock

```js
// audio.js — called synchronously inside the tap / skip handler
export function unlock() {
  if (navigator.audioSession) navigator.audioSession.type = 'playback'; // iOS: play despite silent switch
  ctx ??= new AudioContext();
  ctx.resume();
  src ??= ctx.createMediaElementSource(el);   // el = <audio loop playsinline preload="auto">
  src.connect(gain).connect(ctx.destination);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 2.5); // fade in under the door swing
  el.play().catch(() => ui.setState('blocked')); // music button pulses: "tap for music"
}
```

- `play()` and `resume()` run **before any `await` or timeout** — otherwise iOS and the WhatsApp / Facebook in-app browsers no longer count it as a user gesture and block playback.

- iOS ignores `audio.volume`, so fades go through a Web Audio `GainNode`. If Web Audio is unavailable, fall back to plain `play()`.

- **Mute button:** animated sound bars while playing, speaker-with-slash when muted. Muting ramps the gain to 0 over 400ms, then pauses.

- **`visibilitychange`:** pause when the tab is hidden, resume when visible unless the guest muted. The mute choice is stored in `localStorage` (wrapped in try/catch).

- **Track:** 2–3 minutes, trimmed to loop cleanly, 128 kbps AAC, under 3 MB. Download latency is hidden behind the door swing.

---

## 8. Step 4 — Hero, staggered reveal & countdown

### Hero (inside the ornamental oval frame)

Reveal order, each element with `data-reveal` and a `--i` index, starting at `opacity: 0; translateY(14px); filter: blur(6px)` and settling over 900ms on `cubic-bezier(.2,.7,.2,1)` with `--i × 450ms` delay:

1. **Bismillah** — revealed right-to-left (Arabic reading direction) by an animated `mask-image` gradient; the gold rules beside it grow outward from the centre.

2. *"In the name of Almighty Allah, the most Beneficent & the most Merciful"*

3. *"We cordially request the pleasure of your gracious presence & blessings at the Wedding Ceremony of"*

4. **Shahriar** (large, crimson).

5. **&** — Great Vibes, scales 0.8 → 1.

6. **Riya** (large, crimson).

7. **FRIDAY · DECEMBER 25, 2026 · 6:30 PM**

The invocation and invitation lines sit above the oval; the names and date sit inside it, so the copy fits a 390px oval without crowding.

### Countdown — "COUNTING THE DAYS"

- Target: `new Date('2026-12-25T18:30:00+06:00')` (from the card's date and time).

- Four units: Days · Hours · Minutes · Seconds, large serif numbers with small tracked labels.

- Each tick recomputes from `Date.now()`; the next tick is scheduled at the next whole second (`1000 - Date.now() % 1000`), so it never drifts and is correct immediately after a background tab returns.

- Only changed digits animate (short roll-up); `font-variant-numeric: tabular-nums` prevents sideways jitter.

- On the day: "Today we celebrate". After: "Alhamdulillah — 25.12.2026".

---

## 9. Step 5 — Scrolling sections

Each section reveals once via IntersectionObserver (threshold 0.2, then unobserve). Sections are separated by hairline gold dividers carrying a small crest or palki motif.

### 9.1 The Families

- **M Shahriar Bin Malek** — *Only Son of Mohammad Abdul Malek & Kohinur Begum*

- *With* (Great Vibes)

- **Sadia Afrin Riya** — *Only Daughter of G M Belal Hossain & Rokeya Sultana*

- The full hexagon crest ("Shahriar Weds Riya") with the palki divider below.

### 9.2 When & Where

- The card's date block rebuilt in type: `Friday │ 25 │ 6:30 PM`, "December" above, "2026" below, with vertical crimson rules.

- **Venue — Meraz Convention Hall**, then the full address from the card.

- **View on Google Maps** →
  `https://www.google.com/maps/search/?api=1&query=Meraz+Convention+Hall+Sena+Nibas+Road+Mirpur-12+Dhaka-1216`
  (swap for an exact pin link if one is provided).

- **Add to Calendar** → a small sheet with two options:

  - **Apple / Outlook** → static `wedding.ics`. A static file served as `text/calendar` opens "Add to Calendar" reliably on iOS, including inside WhatsApp's browser, where Blob downloads often fail. Event: `DTSTART:20261225T123000Z` (6:30 PM BST). The card gives no end time, so `DTEND` is set 4 hours later purely as calendar metadata (not displayed). Includes a 1-day reminder.

  - **Google Calendar** → `https://calendar.google.com/calendar/render?action=TEMPLATE&text=…&dates=20261225T123000Z/20261225T163000Z&location=…`

  - One tap cannot both download a file and open a new tab (the second is popup-blocked), hence the two-option sheet.

### 9.3 Gifts & Dua (kept by request)

- Heading: **A Thoughtful Gesture**

- *"Your presence and sincere prayers (Dua) are the most precious gifts we could ask for as we begin our new journey together."*

- Framed in a floral wreath built from the vine and crest symbols.

### 9.4 Contact & RSVP

- **Contact** — the two numbers from the card, each with:

  - Call: `tel:+8801713663450` / `tel:+8801760925985`

  - WhatsApp: `https://wa.me/8801713663450` / `https://wa.me/8801760925985`

- **RSVP card:** Full name (required) · Joyfully Accept / Regretfully Decline · Number of guests (stepper, hidden on decline) · Dua / wishes.

- **Send RSVP:** validates, then opens a styled `<dialog>` — "JazakAllahu Khairan, {name}" — with a preview of the message and a real `<a href="https://wa.me/880…?text=…">Send on WhatsApp</a>` link. A genuine link tap is never popup-blocked in in-app browsers. The message starts with "Assalamu Alaikum" and is built with `encodeURIComponent`. An unsent draft is kept in `localStorage`.

- A `wa.me` link can target only one number — see open question 2.

---

## 10. Step 6 — "View Formal Wedding Card" lightbox

- **Section:** heading *Traditional Invitation*, a slightly tilted paper thumbnail of the card, and an outlined button with the crest: **View Formal Wedding Card**.

- **Dialog:** native `<dialog>` opened with `showModal()` — focus trap, Esc to close and a blurred `::backdrop` for free. The card grows from the thumbnail's position into place (FLIP, 450ms). Page scroll is locked while open. Closes via ✕, backdrop tap, Esc, or the browser back button (`history.pushState` while open).

- **Zoom & pan (Pointer Events, `touch-action: none`):**

  - Two-finger pinch zooms, clamped 1×–4×.

  - One finger pans when zoomed, clamped to the image edges.

  - Double-tap toggles 1× ↔ 2.5× at the tap point; mouse wheel zooms on desktop.

  - Transforms only.

- **Extras:** "Download card" link; hint "Rotate your phone for a larger view" (the card is landscape, ~280px tall on a portrait phone).

---

## 11. Step 7 — Floating music button, metadata, QA & deploy

- **Music button:** circular, bottom-right inside `.device`, replaces the Skip pill after the gate opens; states: playing / muted / blocked.

- **Open Graph** (what guests see in the WhatsApp chat before tapping):

  - `og:title`: "Shahriar & Riya — Wedding Invitation"

  - `og:description`: "Friday, 25 December 2026 · 6:30 PM · Meraz Convention Hall, Mirpur-12, Dhaka"

  - `og:image`: 1200×630 `og-image.jpg`, a screenshot of the closed gate (previews cannot use SVG).

  - SVG crest favicon and `theme-color`.

- **Accessibility:** the seal is a real `<button>`; the scroller is `inert` while the gate is closed; every form field has a label; visible focus states; text contrast ≥ 4.5:1.

- **QA:**

  - Playwright screenshots at 390×844 and 1440×900 at fixed timeline points.

  - Real devices: WhatsApp in-app browser (iOS and Android), Safari, Chrome, Facebook in-app browser.

  - Verify: countdown arithmetic, `.ics` import into Apple and Google Calendar, WhatsApp message encoding with emoji and Bangla text, audio unlock in each browser.

- **Deploy:** `vercel --prod` after approval.

---

## 12. Build order

1. Scaffolding, tokens, fonts, device frame.

2. SVG sprite library.

3. Gate + opening timeline, Skip, reduced motion.

4. Audio module.

5. Hero reveal + countdown.

6. Families, When & Where (maps + calendar), Gifts & Dua.

7. Contact & RSVP.

8. Card lightbox.

9. Open Graph, desktop backdrop, QA, deploy.

---

## 13. Open questions

1. **Music** — is there a preferred track (shehnai / instrumental) with usage rights? Otherwise the audio is wired to a placeholder file to drop in later.

2. **RSVP recipient** — whose numbers are 01713663450 and 01760925985? Should RSVPs go to one number, or should guests choose "Groom's family / Bride's family"?

3. **Card scan** — is a higher-resolution scan or PDF of the card available for the lightbox?

4. **Map pin** — a Google Maps share link for the exact Meraz Convention Hall pin would be more reliable than a text search.

5. **Colour** — card crimson for names and crest (recommended), or strictly the burgundy + gold of `BRIEF.md`?
