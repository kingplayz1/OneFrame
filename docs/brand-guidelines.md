# OneFrame Studios Brand Guidelines v1.0

## Quick Reference
- **Primary Color:** #007FD4 (Cinematic Blue)
- **Primary Font:** Inter, system-ui, sans-serif
- **Voice:** Cinematic, Professional, Creative

---

## 1. Color Palette

### Primary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Brand Accent | `#007FD4` | `0, 127, 212` | Primary brand color, CTAs, headers, focus states |
| Brand Dark | `#050505` | `5, 5, 5` | Page backgrounds, elevated surfaces |
| Brand Midnight | `#030303` | `3, 3, 3` | Hero section, deep backgrounds |

### Secondary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Neutral Slate | `#888888` | `136, 136, 136` | Muted text, captions, borders |
| Neutral Dim | `#555555` | `85, 85, 85` | Placeholder text, secondary text |
| Neutral Border | `#1A1A1A` | `26, 26, 26` | Dividers, input borders |
| Neutral Light | `#111111` | `17, 17, 17` | Surface backgrounds, hover states |

### Accent Variations
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Hover State | `#008CF2` | `0, 140, 242` | Accent on hover, focus-visible |
| Muted State | `#007FD433` | `0, 127, 212, 0.5` | Disabled states, subtle accents |
| Danger | `#E50914` | `229, 9, 20` | Error states, destructive actions |
| Danger Hover | `#FF1A25` | `255, 26, 37` | Error on hover |
| Success | `#057839` | `5, 120, 57` | Success states, confirmations |
| Warning | `#F59E0B` | `245, 158, 11` | Warnings, alerts |

### Accessibility
- Text/Background Contrast: All pairs meet WCAG 2.1 AA (4.5:1 minimum)
- CTA Contrast: 9.50:1 (white on Brand Accent)
- All interactive elements meet WCAG 2.1 AA

---

## 2. Typography

### Font Stack
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
--font-display: 'Inter', system-ui, sans-serif;
```

### Type Scale
| Element | Font | Weight | Size (Desktop/Mobile) | Line Height |
|---------|------|--------|----------------------|-------------|
| H1 | Inter | 700 (Bold) | 9rem / 5rem | 1.0 |
| H2 | Inter | 600 (Semi-Bold) | 6rem / 4rem | 1.1 |
| H3 | Inter | 600 (Semi-Bold) | 4rem / 3rem | 1.25 |
| H4 | Inter | 600 (Semi-Bold) | 3rem / 2.5rem | 1.3 |
| Body | Inter | 400 (Normal) | 1rem / 1rem | 1.5 |
| Small | Inter | 400 (Normal) | 0.875rem / 0.875rem | 1.4 |
| Caption | Inter | 400 (Normal) | 0.75rem / 0.75rem | 1.3 |

### Letter Tracking
- **Tighter:** -0.02em (headings, uppercase)
- **Tight:** -0.01em (nav links, buttons)
- **Normal:** 0 (body text)
- **Wide:** 0.02em (sidebar text)
- **Widest:** 0.1em (large display)

---

## 3. Logo Usage

### Variants
- **Primary:** Full horizontal logo with wordmark (white on Brand Accent, inverted on dark)
- **Stacked:** Vertical arrangement for square spaces (favicon, app icons)
- **Icon:** Symbol only for favicons, PWA icons (40px minimum)
- **Monochrome:** Single Brand Accent color for limited palettes

### Clear Space
Minimum clear space = height of logo mark. Do not place elements closer than this.

### Minimum Size
- Digital: 80px width minimum
- Print: 25mm width minimum

### Don'ts
- Don't rotate or skew the logo
- Don't change colors outside the approved palette
- Don't add effects (shadows, gradients, outlines)
- Don't crop or modify proportions
- Don't place on busy backgrounds without clear space

---

## 4. Voice & Tone

### Brand Personality (Voice)
- **Cinematic:** We craft visual stories that transport audiences — language reflects the art and craft of filmmaking
- **Professional:** We bring expertise and reliability to every project — language is trustworthy and precise
- **Creative:** We push boundaries and innovate — language is inspired yet grounded

### Voice Chart
| Trait | We Are | We Are Not |
|-------|--------|------------|
| **Cinematic** | Language evokes visual storytelling, film language, and emotional impact | Avoid generic marketing speak without visual context |
| **Professional** | We demonstrate expertise, reliability, and craftsmanship | Avoid informal slang or unprofessional shortcuts |
| **Creative** | We innovate and push boundaries while respecting the craft | Avoid gimmicks or trends that compromise quality |

### Tone by Context
| Context | Tone | Example |
|---------|------|---------|
| **Marketing** | Inspired yet grounded | "Cinematic experiences that captivate and inspire." |
| **Support** | Empathetic and solution-focused | "We understand your vision and will work to bring it to life." |
| **Sales** | Confident and collaborative | "Secure a slot in our pipeline — our producers respond within 24 hours." |
| **Error Messages** | Clear and actionable | "Something went wrong. Try again or contact support." |
| **Success** | Celebratory and professional | "Your project has been added to the queue." |

### Prohibited Terms
- "Cheap" (we position as high-end premium)
- "Amateur" (we are expert practitioners)
- Generic "video editing" without context of quality/cinematic focus

### Voice Guide Template
```markdown
## OneFrame Voice Guide

### We Are
- **Cinematic:** We craft visual stories that transport audiences through expert color, VFX, and editing
- **Professional:** We bring reliability and expertise to every project, from concept to delivery
- **Creative:** We innovate and push boundaries while respecting the art and craft of filmmaking

### We Sound Like
- "Every story, down to the last frame."
- "High-end post-production, VFX, and color grading studio."
- "Cinematic realities at the bleeding edge of digital media."

### We Don't Sound Like
- "Cheap video editing services"
- "We make any video look better"
- Generic marketing claims without substance

### Sample Rewrites
Before: "We edit videos good."
After: "We craft cinematic realities at the absolute bleeding edge of digital media."
```

---

## 5. Imagery Guidelines

### Photography Style
- **Lighting:** Cinematic, high-contrast, color-graded to match our showreel aesthetic
- **Subjects:** Behind-the-scenes, artist portraits, project stills, team collaboration
- **Color Treatment:** Desaturated with selective Brand Accent (#007FD4) highlights

### Illustrations
- **Style:** Geometric, line-art inspired with cinematic curvature
- **Colors:** Brand palette only (Accent, Dark, Slate, Midnight)
- **Stroke:** 1.5px weight, rounded corners matching component radius

### Icons
- **Style:** Outlined with fill states
- **Size:** 24px base grid
- **Corner radius:** 4px (matching component md radius)

---

## 6. Asset Organization

### Naming Conventions
- **Components:** `ComponentName--State--Variant.jsx` (e.g., `Button--primary--hover`)
- **Images:** `brandservice-scene001.ext` (service type + scene + sequence)
- **Fonts:** `Inter-Regular`, `Inter-Bold`, `Inter-SemiBold`
- **Colors:** `color-brand-accent`, `color-brand-dark`, `color-neutral-slate`

### File Structure
```
assets/
├── images/
│   ├── logos/
│   │   ├── oneframe-primary.svg
│   │   ├── oneframe-stacked.svg
│   │   └── oneframe-icon.svg
│   ├── heroes/
│   │   ├── homepage-hero-desktop.jpg
│   │   └── homepage-hero-mobile.jpg
│   └── projects/
│       └── project-slug/
│           ├── thumbnail.jpg
│           ├── hero.jpg
│           └── gallery/
│               ├── 1.jpg
│               ├── 2.jpg
│               └── 3.jpg
├── tokens/
│   ├── design-tokens.json
│   └── design-tokens.css
├── fonts/
│   └── Inter/
│       ├── Inter-Regular.ttf
│       ├── Inter-Bold.ttf
│       ├── Inter-SemiBold.ttf
│       └── Inter-Italic.ttf
└── docs/
    └── brand-guidelines.md
```

---

## 7. Logo Usage Rules
- **Clear Space:** Minimum clear space = height of logo mark. No text, UI elements, or other graphics closer.
- **Minimum Size:** 80px digital, 25mm print. Below this, use the Icon variant.
- **Color Restrictions:** Only Brand Accent (#007FD4), Brand Dark (#050505), Neutral Slate (#888888), or Monochrome (grayscale) permitted.
- **No Modifications:** No rotation, skew, color shift, proportion change, or effect addition.
- **Background Constraints:** Must have clear space around logo. Minimum contrast ratio of 3:1 against background for legibility.

---

## 8. Approval Checklist

### Pre-Launch Review
- [ ] Brand colors approved and documented
- [ ] Typography scale verified and tested
- [ ] Logo assets in all required variants
- [ ] Voice guidelines reviewed by stakeholder
- [ ] Accessibility contrast validated (WCAG AA)
- [ ] Asset naming conventions established
- [ ] Design token sync completed (brand-guidelines.md → assets/)

### Ongoing Maintenance
- [ ] Monthly: Website brand audit (logo, colors, typography)
- [ ] Quarterly: Social profile consistency check
- [ ] Annually: Full brand audit and refresh assessment
- [ ] On any new marketing material: Quick brand compliance check