# Recurring Events — Client Clarification (Frontend Pointer)

**Status:** Pre-development — awaiting client sign-off  
**Full workbook:** [Recurring Events — Gap Analysis & Client Clarification Workbook](../../../Docs/Issues%20Doc/30-06-2026/Recurring%20Events%20%E2%80%94%20Gap%20Analysis%20%26%20Client%20Clarification%20Workbook.md)

---

## Do not implement yet

Frontend recurring UI is a checkbox only (`CreateEventPremium.vue`). Full recurrence flow depends on client workbook sign-off.

---

## Current state (frontend)

| Item | Status |
|------|--------|
| `CreateEventFree.vue` | Single events only |
| `CreateEventPremium.vue` | `is_recurring` checkbox only — no weekdays/timezone |
| `Event` type / adapter | No `series_id`, `is_recurring` on discovery model |
| Map (`Home.vue`) | One pin per event row; clustering enabled |
| Public event SEO routes | **None** |
| Calendar view | **Not implemented** |

---

## Phase 1 UI scope (proposed — pending approval)

**In scope:** Weekly day picker, timezone, series end date, series vs instance edit, “Apply to future?” modal, recurring label on detail panel.

**Out of scope (Phase 1b):** Calendar sidebar, SEO `/events/:slug`, grouped list cards by series.

---

## Related code

- `src/pages/packages/CreateEventPremium.vue`
- `src/pages/Home.vue`
- `src/utils/eventSchedule.ts`
- `src/adapters/eventAdapter.ts`
