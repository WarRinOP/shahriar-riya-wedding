# Shahriar & Riya — Wedding Invitation

Static, mobile-first digital invitation (vanilla HTML/CSS/JS, no build step).
Wedding: Friday 25 December 2026, 6:30 PM — Meraz Convention Hall, Mirpur-12, Dhaka.

### Run locally

    python3 -m http.server 8123
    # open http://localhost:8123

## Versions

- `/` — original floral version (git tag `v1-floral`, untouched).
- `/v2/` — Bangalee "Terracotta Temple Niche" version (own files in `v2/`, shares the audio, countdown and card-viewer scripts).

## Music

Add a track at `assets/audio/bgm.mp3` (loops, ~2-3 min, under 3 MB). Until it exists the music button stays hidden.

## Deploy

    vercel --prod

Planning notes: `PLAN.md` (current) and `BRIEF.md` (original brief, partly superseded).
