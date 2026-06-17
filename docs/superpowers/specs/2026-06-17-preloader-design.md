# Preloader Design — Anime Energy Charge

**Date:** 2026-06-17
**Status:** Approved

---

## Overview

Full-screen intro loading screen for the Next.js portfolio. Anime-style "energy charge" / ki power-up animation — original silhouetted warrior character, no Dragon Ball likeness. Mounts on first paint, unmounts after load completes (minimum 2.5s). Exit: white beam-flash sweep.

---

## Stack

- Next.js 16, App Router, TypeScript
- Tailwind CSS v4 (CSS-first, `@theme` in globals.css)
- Framer Motion v12 — overlay lifecycle, AnimatePresence, useReducedMotion
- Canvas 2D API — particles + background glow bloom
- SVG inline — warrior silhouette + orb with radialGradient + feGaussianBlur
- No new dependencies

---

## Architecture

```
app/layout.tsx
  └─ <Preloader />               ← inserted above NodeGraph + {children}

components/Preloader.tsx         ← "use client", single file ~250 lines
  ├─ SVG warrior silhouette (inline, original)
  ├─ <canvas> full-screen — particles + radial glow bloom
  ├─ Framer Motion <AnimatePresence> + <motion.div> overlay wrapper
  └─ useReducedMotion() branch → static pose + <progress> bar, fade exit only
```

---

## State Machine

```
charging → charged → firing → done
```

| State      | Trigger                              | Visual                              |
|------------|--------------------------------------|-------------------------------------|
| `charging` | mount                                | Orb grows, particles rise, shake    |
| `charged`  | elapsed ≥ 2500ms AND window loaded   | Orb at max brightness, shake peaks  |
| `firing`   | 200ms hold after `charged`           | White flash overlay opacity 0→1     |
| `done`     | flash complete                       | AnimatePresence unmounts overlay    |

---

## Animation Timeline

```
t=0         Overlay mounts. Canvas RAF loop starts. Orb dim + small.
t=0→2.5s    progress = max(realLoadPercent, elapsed/2500 * 100)
            Orb: scale 0.3→1.0, opacity 0.4→1.0
            Particles: rise upward, spawn rate increases with progress
            Shake: amplitude 0→4px, kicks in at 70% progress
t≥2.5s+load "Charged" — 200ms hold
t=beam      White flash: full-screen div opacity 0→1 (80ms)
            Overlay: opacity 1→0 (300ms)
            AnimatePresence unmounts. Scroll re-enabled.
```

---

## Visual Design

### Warrior Silhouette
- ~300×400px SVG, pure black fill (`#000`)
- Wide stance, knees slightly bent, arms angled down, cupped hands meeting below waist (ki-charge pose)
- Original design — no Dragon Ball / Goku likeness

### Orb
- SVG `<radialGradient>`: white → cyan (`#29b6e8`) → blue (`#1565c0`)
- Centered between cupped hands
- Scale + opacity driven by `progress` React state (inline style)
- `<feGaussianBlur>` SVG filter for soft glow halo

### Canvas (behind SVG, full-screen)
- 40–60 particles: small cyan/white circles, rise upward, fade at top
- Spawn rate scales with progress
- Radial glow bloom: large blurred circle behind figure, `#1565c0` → transparent
- RAF loop, cancelled on unmount

### Screen Shake
- CSS `transform: translate(xOffset, yOffset)` on overlay wrapper
- `xOffset = Math.sin(t * freq) * amplitude`
- Amplitude scales 0→4px from 70%→100% progress

### Color Palette
| Role        | Value      |
|-------------|------------|
| Background  | `#0b1220`  |
| Deep blue   | `#1565c0`  |
| Cyan        | `#29b6e8`  |
| White flash | `#ffffff`  |

Matches site's existing palette exactly.

---

## Reduced Motion

`useReducedMotion()` = true:
- Skip directly to `charged` state
- Static SVG pose visible
- Native `<progress>` bar (0→100% over 2.5s)
- No particles, no shake, no beam flash
- Simple opacity fade exit only

---

## SSR Safety

- `"use client"` directive — never runs on server
- `window` / `document` access only inside `useEffect`
- Canvas ref null-checked before 2D context access
- No hydration mismatch — overlay is `position: fixed`, outside normal flow

---

## Integration

### layout.tsx change
```tsx
import Preloader from "@/components/Preloader";
// inside <body>:
<Preloader />
<NodeGraph />
{children}
```

### Z-index
- Preloader overlay: `z-50` (above NodeGraph fixed canvas)

### Scroll lock
- `document.body.style.overflow = "hidden"` on mount
- Restored to `""` in `useEffect` cleanup (also fires on unmount)

### Cleanup
- `cancelAnimationFrame` in useEffect cleanup — no RAF leaks
- `AnimatePresence` removes DOM node after exit animation

---

## Files Changed

| File | Change |
|------|--------|
| `components/Preloader.tsx` | New file |
| `app/layout.tsx` | Add `<Preloader />` import + mount |
| `app/globals.css` | Add `@keyframes` if needed for any CSS animations |
