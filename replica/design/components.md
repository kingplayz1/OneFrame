Button
  variants  primary, secondary, ghost, danger
  sizes     sm 32px, md 40px, lg 48px
  states    default, hover, active, focus-visible (2px ring, accent), disabled, loading
  tokens    bg accent, text on-accent, radius md, font md/600
  a11y      real <button>, visible focus, loading keeps the label for screen readers
  used on   S02, S07, S09

Form Input
  variants  default, outlined, filled
  states    default, focus, error, disabled
  tokens    border border-input, focus:ring-accent, error:ring-danger, bg bg-elevated, text text, placeholder text-dim
  a11y      focus-visible indicator, disabled state announced to screen readers
  used on   S01, S03, S05, S12

Card
  variants  default, elevated
  states    default, hover, active
  tokens    bg bg-elevated, border border, radius lg, shadow md
  a11y      keyboard focus outline, aria-label required for interactive cards
  used on   S03, S08, S10

Modal
  states    default, open, closing
  tokens    bg semi-transparent overlay, content bg-elevated, radius xl, shadow-lg, focus ring-accent
  a11y      trapped focus, escape key to close, aria-modal, aria-label on close button
  used on   S06, S11

NavLink
  states    default, active, hover
  tokens    text text-muted, hover:text-accent, bg bg-zinc-900/50 when active, border border-white/10
  a11y      keyboard focus visible, sr-only text for state description
  used on   Navbar, Footer

Avatar
  states    default, hovered, error
  tokens    bg bg-elevated, border border, radius full, size 40px
  a11y      accessible name from alt text or initials
  used on   S02, S07

Badge
  variants  default, secondary, success, warning, danger
  tokens    bg accent-muted, text on-accent for default; surface-hover, text text-muted for secondary; success bg-success, text white for success; warning bg-warning, text white-oracle; danger bg-danger, text white for danger
  a11y      color-conveying-only information gets accessible fallback text
  used on   S04, S05

TimelineEvent
  states    default, playing, paused, completed
  tokens    bg bg-elevated when playing, border border-focus when focused
  a11y      play/pause button has accessible label, timeline marker announced
  used on   S09

Counter
  states    default, animated, error
  tokens    text text, animated counter uses Counter component from HomeClient
  a11y      live region for animated count updates
  used on   HomeClient stats