# Shahriar & Riya — Wedding Invitation

A mobile-first digital wedding invitation: a floral gatefold that opens with a ribbon-untie and 3D door swing, a live countdown, venue and calendar buttons, and a zoomable view of the printed card.

**Wedding:** Friday 25 December 2026, 6:30 PM — Meraz Convention Hall, Mirpur-12, Dhaka.
**Live site:** https://shahriar-riya-wedding.vercel.app

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run it

    git clone https://github.com/WarRinOP/shahriar-riya-wedding.git
    cd shahriar-riya-wedding
    python3 -m http.server 8123
    # open http://localhost:8123

## Where to edit

| What | File |
|---|---|
| Text, sections, links, phone numbers | `index.html` |
| Colours, fonts, spacing | `css/styles.css` (colours are variables at the top) |
| Opening animation (speed, timing) | `js/opening.js` (`SPEED` near the top) |
| Floral artwork and crest | `js/art.js` |
| Countdown target date | `js/countdown.js` |
| Calendar event | `wedding.ics`, and the Google Calendar link in `js/main.js` |
| The card image in the viewer | `assets/wedding-card.jpg` |
| Link preview image (WhatsApp etc.) | `og-image.jpg` (1200x630) |

## Music

Put a track at `assets/audio/bgm.mp3` (loops; about 2-3 minutes, under 3 MB). Until it exists the music button stays hidden.

## Deploy

Hosted on Vercel: `vercel --prod` from the project folder.
The original floral version is also saved as the git tag `v1-floral`.
