# okA App (React Native / Expo)

Native iOS + Android app for okA, built with Expo. This is the mobile continuation of the design system and screen flows already proven out in `okA-website`'s web app-preview — same colors, fonts, data shapes, and screen graph, rebuilt as real native screens with React Native + react-native-svg + Reanimated instead of the web's Framer Motion/GSAP.

## Getting started

```
npm install
npm run ios      # or: npm run android / npm run web
```

Requires Node 18+, and Xcode (for iOS) or Android Studio (for Android) set up per Expo's standard prerequisites. `npm start` also opens Expo Go for quick device testing.

> If you're opening this folder for the first time and see a stray, near-empty `node_modules/` already present, delete it before running `npm install` — it's a leftover from environment setup and isn't the real dependency tree.

## Structure

- `App.tsx` — font loading (Space Grotesk + Inter, matching the website), splash screen, root providers.
- `src/theme/` — colors and font tokens ported 1:1 from `okA-website/tailwind.config.js`.
- `src/data/appPreview.ts` — same mock data shapes as the web app-preview (`okA-website/src/data/appPreview.ts`).
- `src/components/` — shared design-system primitives (IconButton, WaveCap, TicketDivider, StampMark, TabBar, GhostSilhouette, PointsCard, MissionCard, CouponButton, MockMap, PrimaryButton), each ported from its web counterpart with notes in the file header on what changed and why.
- `src/screens/customer/`, `src/screens/driver/`, `src/screens/shared/` — one file per screen, mirroring the web app-preview's screen set for both personas.
- `src/navigation/RootApp.tsx` — the screen switcher. Currently a state machine (mirrors `AppPreview.tsx` on the web) rather than a `@react-navigation` stack — see the comment at the top of that file for why, and what the upgrade path looks like.

## What's simplified vs. the web version

A few things were intentionally scoped down to ship a complete, working app rather than a partial one — each is called out in a comment at its file:

- **MockMap** — static city illustration with pulsing you-are-here/nearby-vehicle dots; the web version's live path-following bike animation (`getPointAtLength()` per frame) and floating zoom/recenter controls aren't ported yet.
- **GhostSilhouette (VehicleGhost)** — renders the logo at low opacity rather than a true white silhouette, since React Native's `<Image>` has no CSS-filter equivalent to the web's `brightness(0) invert(1)`.
- **CouponButton** — keeps the icon-badge-in-a-card language but drops the web's zigzag torn-edge `clip-path`, which has no direct RN equivalent.
- **Navigation** — state-based screen switching rather than `@react-navigation` stacks (the packages are already installed for when this moves to a real navigator with back-gestures and deep linking).

## Backend

None of these screens talk to a real backend yet — same as the web app-preview, this is a complete frontend built against mock data. See `../okA-website/docs/BACKEND_HANDOVER.md` for the full screen-by-screen map of endpoints, data models, and third-party integrations (MoMo, SMS/WhatsApp OTP, GPS, Ghana Card verification) needed to wire it up for real.
