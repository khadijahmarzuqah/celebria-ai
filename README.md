# Celebria

An elegant, personal event-planning companion for weddings, birthdays, engagements, anniversaries, college events, family gatherings, and community celebrations.

## Run locally

From this directory:

```sh
npm install
npm run dev
```

Production build and static checks:

```sh
npm run build
npm run typecheck
```

## Features

- Landing page with product introduction and sample plan.
- Event creation and editing with input validation.
- Event overview dashboard with date countdowns, budgets, expenses, and task progress.
- Event workspace with event-specific recommendations, editable budget allocations, tracked expenses, suggested milestones, and a vendor/task checklist.
- Date-aware starter checklist tasks shaped by event type, guest count, setting, city, theme, food needs, budget, and organizer notes. Editing an event refreshes suggested tasks while preserving custom work, completion state, and dismissed suggestions.
- Illustrated inspiration cards with a working “Add to my plan” action. The artwork is original CSS illustration, not venue or vendor photography.
- Subtle progress, value, and tab transitions, with reduced-motion preferences respected.
- Confirmation before deleting events or records; completion toggles and filters.
- Responsive layout, keyboard-visible focus, semantic form labels, and meaningful test IDs.

## Architecture

- `src/domain.ts`: typed event data, currency formatting, allocation logic, date helpers, and local rule-based plan, milestone, and checklist generation.
- `src/App.tsx`: Wouter routes, localStorage-backed event state, forms, dashboard, and workspace interactions.
- `src/inspiration.ts` and `src/components/InspirationGallery.tsx`: event-aware inspiration copy and the save-to-plan gallery.
- `src/index.css`: existing theme, responsive interface styles, CSS illustrations, and motion/accessibility preferences.

All estimates are illustrative planning aids, never vendor quotes. Vendor information is user-entered; no availability, contacts, ratings, or prices are fetched. The app makes no bookings or payments.

## Storage and recommendation limitations

Event details, saved inspiration, generated checklist suggestions, and user-created budget allocations, expenses, milestones, and checklist records are stored in this browser's `localStorage`. This is device/browser-specific storage, not an account, backup, or synchronization service. Clearing browser data may permanently remove saved plans.

Despite the product name, this version does not call a language model or any external API. Suggestions are generated locally with transparent event-type and user-input rules. They are practical starting points and should be reviewed by the event organizer.

## Verification notes

The frontend is self-contained; there is no backend or API integration.

- `pnpm --filter @workspace/celebria-ai run typecheck` passed.
- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/celebria-ai run build` passed.
- Domain smoke checks passed across all seven event types for personalized dated tasks, plan and milestone context, and preservation of custom, completed, and dismissed tasks.
- The unchanged landing page was visually checked at desktop size and the create-event form at mobile size; no application browser errors appeared.
- There is no interactive end-to-end suite in this workspace, so event-workspace clicks were not automated.
