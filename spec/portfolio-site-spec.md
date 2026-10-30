# Portfolio Site — Build Spec

A personal portfolio site covering four sections: **Photography** (priority), **Videography**, **Filmography**, and **Sound & Music**. Built collaboratively in chat, intended to be handed to Cowork as a precise reference so the first build attempt is as close to final as possible.

---

## 1. Design direction

**Style: cinematic & minimal** — inspired by Bravum Media, Jovaughn.ca, and Alexandros Maragos's portfolio (explicitly chosen over a playful/illustrated direction like itsjosie.com).

Core visual language:
- Full-bleed imagery/video does the talking — minimal chrome, minimal copy
- Dark-leaning palette, restrained typography
- Numbered/tagged project presentation over dense text blocks
- Category-driven navigation for browsing varied bodies of work
- Motion is purposeful and smooth (crossfades, scale, reflow) — never abrupt cuts
- Flat, saturated color blocks stood in for real photos/videos throughout this planning process; in the real build these become actual media

## 2. Sitemap

```
Home
├─ Hero (full-bleed rotating photo slideshow)
├─ Quick-entry tiles → Photography / Videography / Sound & Music
└─ Contact section (footer-level safety net for scroll-through visitors)

Photography (priority)
├─ Category tabs: Sports / Landscape / Nature / Close-ups
└─ Fullscreen lightbox (opens on click)

Videography
└─ Video hub (dock-style hover grid → theater mode on click)

Filmography
└─ Poster grid of directed film/documentary projects → theater mode + info panel on click

Sound & Music
└─ Track list + persistent bottom player bar

About
└─ Bio + stats block

Contact
└─ Contact form
```

Top nav items: Photography, Videography, Filmography, Sound & Music, About, Contact.

## 3. Section specs

### Home
- **Hero**: full-bleed, full-viewport-height. A rotating slideshow of top shots, crossfading every ~3–4 seconds (real photo crossfade = two stacked images with an opacity transition, not a hard cut). Name + tagline overlaid in minimal type, centered. Subtle bouncing scroll-down chevron at the bottom.
- **Nav**: sits over the hero, transparent background, white text. **Not sticky** — scrolls away naturally with the page once the user scrolls past the hero. Lives only on Home in this form (it's the entry point); doesn't need to reappear elsewhere since it's not pinned.
- **Quick-entry tiles**: 3 tiles below the hero (Photography / Videography / Sound & Music), each linking into that section. Hover animation: tile scales up slightly (~1.04x), a dark overlay lightens, and an arrow icon slides into view — signals clickability without being flashy.
- **Contact footer section**: sits at the very bottom of the homepage (dark solid background, distinct from the hero). Short CTA line, email address, and social icons. Exists specifically so visitors who scroll straight through without reading the nav still land on a way to get in touch.

### Photography (priority section)
- **Category tabs** at the top: Sports, Landscape, Nature, Close-ups. Filtering, not separate pages — keeps browsing fast.
- **Grid**: masonry/varied-size layout (decided over a strict uniform 3-column grid) — thumbnails are black-and-white by default, transition to full color on hover/focus (smooth filter transition, ~0.35s).
- **Click → fullscreen lightbox** that takes over the whole viewport:
  - Large image centered, close button top-right
  - **Prev/next arrows anchored bottom-middle**
  - **Caption/credit line under each photo**: location, gear used, date
  - Prev/next cycles through the current category's photos; reaching the end triggers an **animated album-change transition** into the next category (fade out → category name splash → fade in first photo of the new category) rather than just stopping

### Videography
- **Video hub grid**: thumbnails start as a row of miniatures, black-and-white by default.
- **Dock-style hover magnification**: thumbnails grow smoothly as the cursor approaches, like macOS Dock icons (proximity-based scale, not just per-item hover).
- Hovering/focusing an individual thumbnail also reveals it in color (separate from the magnification).
- **Click → animated zoom-and-reflow into theater mode**: the clicked video animates (position + size) into a large player; the remaining thumbnails reflow into a sidebar. **Main player sits on the right; other videos become a swappable sidebar list on the left.** Clicking a sidebar item swaps it into the main position with the same animated transition — the whole layout should feel like one continuous, physically-plausible motion rather than a hard cut.

### Filmography
Personal directed/authored film and documentary projects, distinct from the client/reel-oriented Videography hub — a growing body of work, each project credited by role (roles will vary project to project; not always "Director").

- **Presentation: poster grid** — each project shown as a portrait-oriented poster thumbnail with title below. Projects with a Donny award display a visible award badge on the poster (e.g., a small ribbon/tag — "Donny 2026").
- **Click behavior**: reuses the same theater-mode player component from Videography (main player + swappable sidebar of the other projects), extended with an **info panel** shown alongside the player containing:
  - Credits (role(s) held on that project)
  - Award info, where applicable (award name, awarding body, year)
  - No synopsis — the video just plays, with credits/award as the only accompanying info
- **Current projects**:
  | Title | Type | Role(s) | Award |
  |---|---|---|---|
  | FORWARDS | Short film | Director | Donny Award — Centennial College, 2026 |
  | Call me Jerry | Documentary | Director, Sound | Donny Award — Centennial College, 2026 |
  | Camp Coffee Crisis | Short film | Director | — |

### Sound & Music
- **Layout: compact bottom player bar** (chosen over a big "now playing" theater view) — a scrollable/full track list fills the page, with a slim persistent player pinned to the bottom (Spotify-style): art thumbnail, track name, thin progress bar, play/pause.
- **Track list rows** need, per track:
  - Name and duration
  - A short description of the work done on it (e.g., "Written, produced & mixed," "Mix & master only," "Full production")
  - Where the track isn't fully owned (e.g., mixed but not written/produced by them), a visible **"Not owned" pill** plus a short credit/disclaimer line (e.g., "Original track by [Artist] — mixed by me, not owned") — this matters for client transparency about authorship.
- **Scope decision**: music playback is **scoped to the Sound & Music page only**. Navigating to another page stops playback — no persistent/site-wide mini player. (A site-wide persistent mini player was explored and explicitly scratched — keeping pages simple and separate was the priority.) This keeps the site's overall architecture simpler (no need for a persistent cross-page audio shell).

### About
- A mix of both styles: a short narrative bio (a few sentences/paragraphs) **plus** a compact stats block underneath (e.g., based in / experience / primary gear / availability — quick-scan facts, Jovaughn-style).

### Contact
- **A real contact form**: Name, Email, Message fields, Send button — not just a mailto/social links (those already live in the homepage footer).
- Build note: since there's no custom backend, wire the form to a lightweight form service (e.g., Formspree) rather than building custom email infrastructure — simple to set up, no server needed.

## 4. Build approach

- **Custom-coded site** (not a drag-and-drop builder like Squarespace/Wix) — needed for the level of control over gallery layout, hover/motion interactions, and image handling described above.
- Static/multi-page structure is sufficient — the one thing that would have required a heavier single-page app (persistent audio across page navigation) was explicitly ruled out, so a conventional multi-page build works fine.
- The Filmography theater-mode player reuses the Videography theater-mode component, extended with an info panel (synopsis/credits/award) — build it as a shared component with an optional info-panel slot rather than two separate players.
- **Build environment**: Cowork (desktop), which needs at minimum the Pro plan. Cowork can work directly with local files/folders, so it can pull in real photos, video clips, and audio files rather than working from placeholders.
- **Hosting**: once built, deploy to something like Vercel or Netlify; register a domain separately (e.g., via Namecheap).

## 5. Assets needed before/during build

- Photos organized into four folders: Sports, Landscape, Nature, Close-ups (10–15 strong shots per category is a good starting point)
- Per-photo metadata: location, gear used, date (for lightbox captions)
- Video clips or a reel file for the Videography hub
- For Filmography: a poster image and video file/clip for each of FORWARDS, Call me Jerry, and Camp Coffee Crisis, plus confirmation of any additional award details to display
- Audio tracks/files for Sound & Music, plus for each track: a short description of the work done, and ownership status (owned outright vs. mixed/not owned + credit info)
- Bio text and quick-fact stats (based in / experience / gear / availability) for About
- Contact email and any social links for the homepage footer
