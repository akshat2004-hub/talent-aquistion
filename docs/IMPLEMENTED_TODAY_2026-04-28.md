# Implemented Today (2026-04-28)

## Frontend updates

- Refactored chat rendering flow to use reusable presentation primitives:
  - `ConversationMessageRenderer`
  - `CandidateDeck`
  - dedicated candidate widget route segments and related components
- Updated card components (`CandidateSwipeCard`, `QuestionCard`, `SummaryCard`) to support alignment variants for improved layout control across full-page and embedded contexts.
- Reworked candidate deck integration in chat to centralize batch extraction and swipe interactions.
- Expanded widget feature surface for candidate workflows:
  - shortlist/candidate views
  - direct candidate messaging and related chat UI paths
- Updated API client/types/store wiring to support the expanded widget interaction model.
- Enhanced embed script behavior (`public/widget.v1.js`) with:
  - viewport-aware fixed panel positioning
  - persistent width/height storage
  - draggable edge/corner resize handles
  - runtime resize clamping and responsive constraints
  - improved z-index/offset positioning support for host-page compatibility
- Added `public/widget-demo.html` and supporting files for local embed validation and manual QA.
