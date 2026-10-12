# Project: Shahriar & Riya Wedding Digital Invitation (Landing Page)

## Project Overview
Create an ultra-luxury, mobile-first interactive digital wedding invitation landing page for the wedding of **M Shahriar Bin Malek** (Nirob) and **Sadia Afrin Riya** on **December 25, 2026**.

The concept directly replicates the experience shown in `Screen Recording 2026-10-12 at 2.44.15 PM.mov` (inspired by *The Digital Yes* luxury digital invitation), populated exclusively with the authentic event details and artwork from `Wedding Card.jpeg`.

---

## Design Philosophy: Text & Code First (Assets are Not Mandatory)
- **Image assets are optional**: Wherever possible, prioritize creating artistic typographic elements, inline SVGs, and CSS effects rather than relying heavily on bitmap images.
  - The couple's monogram crest can be a stunning SVG/CSS geometric hexagon with gold borders and elegant script typography (*"Shahriar & Riya"*).
  - The Bismillah invocation can be rendered using elegant Arabic typography/font styling with decorative gold rules.
  - Borders, floral flourishes, and ribbons can be pure SVG/CSS vectors for infinite sharpness on Retina displays and silky 60fps animations.
  - Pre-extracted PNGs in `./assets/` remain available as references or secondary fallbacks.
- **Physical Card Reference**:
  - `Wedding Card.jpeg` — The authentic printed invitation card.
  - `Screen Recording 2026-10-12 at 2.44.15 PM.mov` — Reference screen recording of the target interaction.

---

## Core Architecture & Sequence Flow

### 1. Stage 1: The Gatefold Envelope & Ribbon Opening (0.0s – 4.5s)
- **Closed State:**
  - Dual vertical French doors/panels meeting at a center seam.
  - Ornate ivory/cream textured wallpaper background with gold/burgundy floral framing.
  - In the center sits an elegant satin ribbon bow with a couple monogram seal (crafted creatively via CSS/SVG).
  - Subtle breathing/pulse animation on the seal with a "Tap to Open" hint.
  - A discreet **"Skip"** button in the bottom-right corner to instantly open the invite without waiting.
- **The Untie & Swing Sequence (On User Tap):**
  - **Step 1 (Ribbon Untie):** The ribbon bow unties, and ribbon tails slide downward and dissolve (`transform: translateY(50px) scale(0.95); opacity: 0; transition: 0.6s ease-in`).
  - **Step 2 (3D Door Swing):** The two doors split down the center seam and swing outward using CSS 3D transforms:
    - Container: `perspective: 1400px; transform-style: preserve-3d;`
    - Left Door: `transform-origin: left center; transform: rotateY(-105deg);`
    - Right Door: `transform-origin: right center; transform: rotateY(105deg);`
    - Dynamic gradient overlay to mimic 3D paper shading as the doors rotate.
  - **Step 3 (Audio Start):** Background music (ambient instrumental / shehnai / acoustic) begins playing upon this initial user click (complying with mobile browser autoplay policies).
  - **Step 4 (Border Docking):** The doors dock at the side edges as ornamental margins (`pointer-events: none`).

### 2. Stage 2: Staggered Inner Reveal (4.8s – 8.0s)
Inside the ornamental oval frame:
- Arabic Calligraphy / Invocation (*"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"*) fades in at the top.
- "We cordially request the pleasure of your gracious presence & blessings at the Wedding Ceremony of"
- **Groom:** "Shahriar" (M Shahriar Bin Malek) fades and glides upward.
- **Bride:** "Riya" (Sadia Afrin Riya) with ampersand appears with a staggered delay.
- **Date & City:** "FRIDAY, DECEMBER 25, 2026 • DHAKA, BANGLADESH".

### 3. Stage 3: Live Countdown Timer
- Placed directly beneath the hero card:
- Displays **"COUNTING THE DAYS"** with 4 live animated units:
  - `[DAYS] : [HOURS] : [MINUTES] : [SECONDS]`
  - Real-time countdown target: `2026-12-25T18:30:00+06:00` (6:30 PM BST).

### 4. Stage 4: Scrollable Wedding Sections
- **Formal Parentage & Invocation:**
  - Groom: *Only Son of Mohammad Abdul Malek & Kohinur Begum*
  - Bride: *Only Daughter of G M Belal Hossain & Rokeya Sultana*
  - Elegant decorative motif divider (Palki / floral flourish).
- **When & Where (Venue Section):**
  - Venue: **Meraz Convention Hall**
  - Location: Safura Trade City (Lift-10), Sujat Nogor, 142 Sena Nibas Road, Mirpur-12, Dhaka-1216.
  - Interactive Action Buttons:
    - 📍 **"View on Google Maps"** (opens Google Maps search for Meraz Convention Hall, Mirpur 12).
    - 📅 **"Add to Calendar"** (downloads `.ics` event file and opens Google Calendar).
- **Programme (Evening Schedule):**
  - Vertical timeline with minimalist line icons:
    - `06:30 PM` — Guest Reception & Welcome Drinks 🥂
    - `07:30 PM` — Grand Arrival of the Couple ✨
    - `08:00 PM` — Ring Exchange & Dua / Photography 💍
    - `08:45 PM` — Royal Wedding Dinner Feast 🍽️
    - `10:00 PM` — Warm Farewell & Departure (Rukhsati) 🕊️
- **Dress Code Guide:**
  - "Traditional / Festive Formal" (Sherwanis, Panjabis, Sarees, Lehengas).
  - Color palette circles: Royal Burgundy (`#7A1223`), Antique Gold (`#C5A059`), Emerald Green (`#0E4D3E`), Warm Ivory (`#FBF7EE`).
- **Gifts & Dua:**
  - "A Thoughtful Gesture"
  - *"Your presence and sincere prayers (Dua) are the most precious gifts we could ask for as we begin our new journey together."*
- **RSVP & Contact:**
  - Direct 1-tap call/WhatsApp buttons for the family contacts:
    - `01713663450`
    - `01760925985`
  - Interactive RSVP card:
    - Full Name input
    - Attendance selection (*Joyfully Accept* / *Regretfully Decline*)
    - Number of Guests
    - Sincere Dua / Wishes message field
    - "Send RSVP" button: Formats a pre-composed WhatsApp message directly to the wedding contacts and confirms with an elegant dialog.

### 5. Stage 5: Formal Wedding Card Viewer (Lightbox / Direct View)
- At the end of the invitation, provide an elegant, prestigious section:
  - Header: *"Traditional Invitation"*
  - Button/Action: **"View Formal Wedding Card"** (or *"View Original Invitation Card"*).
  - Interaction: Clicking smoothly opens a high-resolution lightbox modal displaying `Wedding Card.jpeg` (with close button and pinch-to-zoom/pan or high-res view), or opens it in a formal dedicated view.

### 6. Floating Persistent UI
- **Ambient Music Player:** Floating circular button in the bottom corner with sound bars/speaker icon. Guests can mute/unmute at any point.

---

## Design System & Styling
- **Color Palette:**
  - Primary Base: Warm Ivory / Cream (`#FBF7EE`, `#FFFDF9`, `#F5EFEB`)
  - Royal Accent: Deep Burgundy / Maroon (`#7A1223`, `#8B152B`)
  - Regal Ornament: Antique Gold (`#C5A059`, `#D4AF37`)
  - Text & Accents: Dark Charcoal / Espresso (`#2C2523`)
- **Typography:**
  - Headers / Titles: *Cormorant Garamond* or *Playfair Display*
  - Couple Script / Flourish: *Great Vibes* or *Alex Brush*
  - Metadata / Body: *Montserrat* or *Inter*
- **Layout:**
  - Mobile-First: Perfect fit for 390px–430px smartphone screens (iPhone/Android).
  - Desktop View: Centered luxury smartphone/card mockup frame with an ambient blurred festive backdrop.
- **Tech Stack:** Clean Vanilla HTML5 + CSS3 (3D Transforms) + JavaScript (no heavy framework overhead needed for maximum speed, crispness, and instant deployment).

