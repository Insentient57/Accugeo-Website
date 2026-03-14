# UI/UX Implementation Plan — Accugeo Website

This document lists the concrete implementation steps for the UI/UX improvements discussed earlier. It contains prioritized tasks, code snippets and notes so you or another engineer can apply the changes quickly and safely.

---

## Priorities (short)
1. Critical — Remove global text-shadow, add prefers-reduced-motion, make contact info actionable, fix scroll behavior for fixed navbar.
2. High — Add a mobile hamburger navigation (accessible drawer) and ensure keyboard focus management.
3. Medium — Split/refactor Services layout (cards vs. carousel), reduce extreme typography, make carousel accessible.
4. Medium — Migrate images to Next.js Image optimization where appropriate.
5. Low — Polishing: color tokens, contrast checks, remove unnecessary animations.

---

## 1) Remove global text-shadow and apply selectively
Problem: Global `text-shadow` (in `app/globals.css`) reduces readability and breaks contrast.

Plan:
- Remove `text-shadow` from the global `*` selector.
- Apply `text-shadow` only to large display headings and the hero tagline.
- Ensure body and paragraph text do not have shadows.

Suggested CSS change (replace the global rules at top of `app/globals.css`):

    /* Before: global text-shadow applied to everything */
    * {
      font-family: 'Sansation', sans-serif;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    }

    /* After: remove global shadow; apply only to display headings and hero */
    * {
      font-family: 'Sansation', sans-serif;
    }

    /* Selective shadows for large display elements only */
    .hero-heading,
    h1.display,
    .display-shadow {
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
    }

Notes:
- Replace instances where large headings should use `hero-heading` or `display-shadow`.
- Run contrast checks after removing shadows; they typically improve readability.

---

## 2) Respect prefers-reduced-motion
Problem: Animations are applied globally without respect for user motion preferences.

Plan:
- Add a `prefers-reduced-motion` block that disables animations and transitions.

Suggested CSS snippet to add near the animation definitions in `app/globals.css`:

    /* Reduce motion support */
    @media (prefers-reduced-motion: reduce) {
      .fade-up,
      .fade-up-delay-1,
      .fade-up-delay-2,
      .fade-up-delay-3,
      .fade-up-delay-4,
      * {
        animation: none !important;
        transition: none !important;
      }
    }

Notes:
- This is a small change with large accessibility impact.
- Keep animated decorations but make them optional or subtle.

---

## 3) Fix navbar-to-section scrolling (account for fixed navbar)
Problem: Current `scrollToSection` uses manual animation + `offsetTop`. Because the navbar is fixed, the scrolled-to section can be hidden behind the navbar. There's also redundant smooth behavior (CSS and JS).

Plan:
- Replace custom animation with `window.scrollTo` using `getBoundingClientRect()` and subtract navbar height.
- Use simple `behavior: 'smooth'` and avoid custom easing to reduce code complexity.

Suggested JS replacement for `components/Navbar.tsx`:

    // Replace existing scrollToSection implementation with this:
    function scrollToSection(sectionId: string) {
      const element = document.getElementById(sectionId);
      if (!element) return;
      const nav = document.querySelector('nav');
      const navHeight = nav ? (nav as HTMLElement).offsetHeight : 0;
      const y = element.getBoundingClientRect().top + window.scrollY - navHeight - 8; // 8px gap
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

Notes:
- This is robust across different device sizes and accounts for the fixed header height.
- If the header height can change (open drawer, mobile), ensure the drawer is closed before scrolling or recompute height dynamically.

---

## 4) Add a mobile navigation (hamburger + accessible drawer)
Problem: Desktop nav is hidden on small screens; no mobile menu exists.

Plan:
- Add a hamburger button visible on small screens.
- Toggle a full-screen or off-canvas nav that contains the same links.
- Implement focus trapping while drawer is open and allow Esc to close.
- Ensure `aria-expanded`, `aria-controls`, and meaningful labels.

Implementation notes (high-level):
- Add state `isOpen` in `Navbar.tsx` for mobile menu open/close.
- Render a `<button aria-expanded={isOpen} aria-controls="mobile-nav" aria-label="Open menu">` visible on small screens.
- Render a `<div id="mobile-nav" role="dialog" aria-modal="true">` for the drawer that contains the links; when open, add `document.body.style.overflow = 'hidden'` to prevent background scroll.
- Use `focus-trap` or implement simple focus cycling between first/last focusable elements.

Example skeleton (pseudo-React, integrate into `components/Navbar.tsx`):

    // Mobile hamburger button (visible on small screens)
    <button
      className="md:hidden"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-nav"
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* SVG hamburger / close icon */}
    </button>

    {/* Off-canvas mobile nav */}
    {isOpen && (
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-6"
      >
        {/* links (same as desktop) */}
      </div>
    )}

Accessibility checklist:
- Focus moves into drawer when opened; focus returns to the hamburger when closed.
- Escape closes the drawer.
- All links are keyboard-navigable and have visible `:focus-visible` styles.

---

## 5) Make contact info actionable (mailto: / tel:)
Problem: Contact emails and phones are plain text.

Plan:
- Replace plain text with `mailto:` and `tel:` links.
- Add `rel="noopener noreferrer"` and explicit `target` only for external links (map/social).

Suggested change for `components/Contact.tsx`:

    <!-- Replace plain email lines -->
    <p className="text-gray-300 text-lg">
      <a href="mailto:example@gmail.com" className="underline hover:text-white">example@gmail.com</a>
    </p>

    <!-- Replace phone lines -->
    <p className="text-gray-300 text-lg">
      <a href="tel:+1234567890" className="underline hover:text-white">+1 (234) 567-890</a>
    </p>

Notes:
- Use canonical international phone formatting (E.164) for reliable tel: behavior.
- Consider adding a small contact form for messages (CSRF and spam considerations if you add server endpoints).

---

## 6) Services section — split structure and reduce heading scale
Problem: The section mixes a 3-card grid and a big “What We Offer” hero with 8xl typography — it is visually noisy and breaks on mobile.

Plan:
- Split into two sections:
  - `ServicesOverview` — the 3-card grid (quick summary).
  - `ServicesShowcase` — the carousel/detail area (feature spotlight).
- Reduce the largest heading sizes. Avoid `text-8xl` for regular content; use `text-3xl`–`text-6xl` with responsive scaling.

Suggested CSS/markup changes:
- Replace `text-8xl` with `text-3xl md:text-5xl lg:text-6xl`.
- Create two components:
  - `components/ServicesOverview.tsx` — map over `services` and render cards.
  - `components/ServicesShowcase.tsx` — controlled carousel with ARIA.

Carousel accessibility notes:
- Add `role="region" aria-roledescription="carousel" aria-label="Services carousel"`.
- Prev/next buttons have `aria-label="Previous slide"` / `aria-label="Next slide"`.
- Announce slide changes using `aria-live="polite"` on the caption container (optional).
- Keyboard: left/right arrows navigate slides.

---

## 7) Make images optimized and add missing alts
Problem: Standard `<img>` usage doesn't leverage Next.js optimization and can cause layout shifts.

Plan:
- Replace `<img src="...">` with Next.js `Image` component where beneficial (hero, service images, about). For static decorative images, keep `<img>` but ensure `alt=""` if decorative.
- Add explicit width / height or use `fill` layout to prevent CLS.

Example usage (Next/Image, adapt to your Next.js 14 setup):

    import Image from 'next/image'

    <Image
      src="/hero-bg.png"
      alt="Construction materials and testing center background"
      width={2000}
      height={1200}
      className="object-cover"
      priority
    />

Notes:
- Test integration with the new app directory; configuration might vary slightly for Next 14.
- If you need responsive `sizes`, add the `sizes` prop.

---

## 8) Animation application — be selective
Problem: `fade-up` is applied too broadly.

Plan:
- Limit `fade-up` to the hero heading, section headings, and the first visual elements in each section.
- Avoid animating small text blocks or elements that impact layout (like images that shift content).
- Use small delays and shorter durations.

---

## 9) Color tokens & contrast checks
Problem: Some color combinations (red on black) may not meet WCAG for body text.

Plan:
- Use the `tailwind.config.ts` tokens and `:root` variables already in `app/globals.css` to ensure consistent color usage.
- Run a contrast audit (axe, Lighthouse) and update tokens to ensure at least 4.5:1 for normal text; 3:1 for large text.

---

## 10) Quick checklist for each edited file
- `app/globals.css`
  - Remove global text-shadow.
  - Add selective `.hero-heading` rule.
  - Add `prefers-reduced-motion` block.
- `components/Navbar.tsx`
  - Replace `scrollToSection` with navbar-aware `window.scrollTo`.
  - Add mobile hamburger + accessible drawer (state, focus management).
- `components/Contact.tsx`
  - Convert emails and phones to `mailto:` / `tel:` links.
  - Optionally add a link to Google Maps (open in new tab).
- `components/Services.tsx`
  - Split into two components: `ServicesOverview` and `ServicesShowcase`.
  - Reduce typography scale and make carousel accessible.
- Images
  - Replace important images with Next.js `Image` (ensure `alt`, width/height or `fill`).
- General
  - Run automated a11y checks and manual keyboard testing.

---

## Example patches (copy-paste ready)
Below are concise, ready-to-adapt snippets for the most critical pieces. Integrate them into the appropriate files.

- globals.css: remove global shadow + selective shadow + reduced motion

    /* app/globals.css — top section (apply these changes) */
    * {
      font-family: 'Sansation', sans-serif;
    }

    /* Large display-only shadow */
    .hero-heading,
    h1.display,
    .display-shadow {
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .fade-up,
      .fade-up-delay-1,
      .fade-up-delay-2,
      .fade-up-delay-3,
      .fade-up-delay-4,
      * {
        animation: none !important;
        transition: none !important;
      }
    }

- components/Navbar.tsx: improved scrollToSection

    // components/Navbar.tsx — replace existing scrollToSection
    function scrollToSection(sectionId: string) {
      const element = document.getElementById(sectionId);
      if (!element) return;
      const nav = document.querySelector('nav');
      const navHeight = nav ? (nav as HTMLElement).offsetHeight : 0;
      const y = element.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

- components/Contact.tsx: actionable contact links

    <!-- components/Contact.tsx -->
    <p className="text-gray-300 text-lg">
      <a href="mailto:example@gmail.com" className="underline hover:text-white">example@gmail.com</a>
    </p>

    <p className="text-gray-300 text-lg">
      <a href="tel:+1234567890" className="underline hover:text-white">+1 (234) 567-890</a>
    </p>

---

## Testing & Validation
- Run Lighthouse (Chrome DevTools) for accessibility and performance.
- Run axe or an automated a11y scanner.
- Manual checks:
  - Keyboard navigation across header, mobile drawer, carousel.
  - Screen reader: ensure headings and region labels are logical.
  - Mobile: test on small devices (tap targets, drawer closes on link click).
- Visual regression: compare before/after screenshots of hero, services, contact.

---

## Rollout plan
1. Create a feature branch: `feature/uiux-fixes`.
2. Implement critical changes (globals, scroll behavior, contact links).
3. Open a PR and request review — include before/after screenshots and Lighthouse report.
4. Implement mobile nav and services refactor next, with accessibility tests.
5. Merge to main after acceptance testing.

---

## Notes & follow-ups
- I can make these changes for you if you want. I intentionally kept snippets minimal; integrate them with your project's TypeScript types and your preferred focus-trap solution.
- If you want, I can:
  - Create the `ServicesOverview` / `ServicesShowcase` components and wire them up.
  - Implement the mobile drawer with focus trap and unit tests.
  - Replace images with Next `Image` and update sizes.

---

End of implementation plan.