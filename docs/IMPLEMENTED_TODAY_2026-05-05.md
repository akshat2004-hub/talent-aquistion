# Implemented Today (2026-05-05)

## Frontend updates

- Added sender-switch support in direct candidate chat so admins can send as either:
  - `client`
  - `candidate` (proxy reply mode)
- Updated direct message and attachment calls to pass sender context through the API client.
- Added clearer compose-state UI in candidate chat footer to show active sender mode.
- Added tenant-governed category-management lock behavior in Company Admin:
  - fetches management access flag from backend
  - blocks create/edit/save actions when locked
  - shows read-only warning banner and disables mutation controls
- Expanded Superadmin skill-management UI flows:
  - richer list/detail editing experience
  - tighter handling for controlled/locked skill templates
  - additional form and API wiring for template management actions
- Updated Superadmin defaults and tenant pages to align with new governance controls and defaults presentation.
- Updated widget/admin/chat integration points and shared API typing:
  - `lib/adminApi.ts`
  - `lib/adminTypes.ts`
  - `lib/api.ts`
- Improved third-party widget embed behavior for tenant context:
  - `public/widget.v1.js` now accepts `data-tenant-slug` and forwards it as `tenant_slug` in widget URL params
  - install snippets now include a `data-tenant-slug="REPLACE_WITH_TENANT_SLUG"` placeholder
  - local embed tester (`public/widget-demo.html`) includes a tenant slug input and snippet wiring
- Added shared widget session error mapping utility (`lib/widgetSessionErrors.ts`) and reused it across:
  - `app/components/WidgetChatInterface.tsx`
  - `app/components/WidgetHowToUsePanel.tsx`
  - `app/components/WidgetAdminSettingsPanel.tsx`
  - Result: startup/test failures now show actionable guidance for bot/token/domain/origin/API-base issues
- Added editable tenant slug controls in shared snippet UIs:
  - `WidgetHowToUsePanel`: tenant slug input included in Step 1 and used directly in generated snippet
  - `WidgetAdminSettingsPanel`: tenant slug input added above snippet preview
  - both panels auto-prefill from `tenant_slug` or `tenant` query params for shareable admin links
- Minor shell/page updates (`app/layout.tsx`, `app/page.tsx`) to keep root app behavior aligned with the admin and widget changes.
