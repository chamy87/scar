# ScarlettOx

Informational + fundraising website about **Tetralogy of Fallot (TOF)**, named for Scarlett plus "ox" for oxygen. The site educates visitors about TOF and directs donations to Cook Children's Health Foundation. Medical and statistical claims cite Johns Hopkins Medicine, the CDC, Children's National Hospital, the American Heart Association, and Mayo Clinic (see `src/site/links.js`).

Implemented from the [Four Hearts — TOF Design System](https://claude.ai/design/p/cd52eced-fb1d-4eb5-ac7f-db405e8c1b33) Claude Design project.

## Stack

- Vite + React 19 (plain JSX, inline styles per the design system)
- react-router-dom — `/` (Home), `/learn` (About TOF, interactive heart map), `/donate`
- Design tokens as CSS custom properties in `src/tokens/`

## Structure

- `src/tokens/` — color, typography, spacing, effects, font tokens (verbatim from the design system)
- `src/components/` — design-system components (forms + content)
- `src/site/` — Shell (Header/Footer/Section/Overline/PhotoPlaceholder) and the interactive `HeartMap`
- `src/pages/` — Home, Learn, Donate screens

## Commands

```sh
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # preview the build
```

## Notes

- The heart diagram is a simplified educational schematic, not a medical illustration.
- All giving CTAs link to the Cook Children's Health Foundation donation form (`src/site/links.js`) — this site collects no amounts or payment details.
