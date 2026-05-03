---
paths:
  - "lib/data.ts"
  - "lib/types.ts"
  - "lib/cn.ts"
---

# Data + types rules

- `lib/data.ts` is the single source of truth for portfolio content (`nav`, `profile`, `experience`, `projects`, `vfInternal`, `stack`, `education`). Add new content here, not in component files.
- The `nav` array is `as const` — `SectionName` in `lib/types.ts` is derived from it via `(typeof nav)[number]["name"]`. Adding a nav entry automatically extends the type. Don't break the `as const` annotation.
- When adding a new `AccentColor`, update **both** `lib/types.ts` (the union) AND `accentMap` in `lib/cn.ts` (the palette entry). Components that take an `AccentColor` index into `accentMap` and will crash on a missing key.
- Static images MUST be imported by name from `@/public/...` so Next gets the fingerprinted URL and dimensions. Don't use string paths like `"/foo.png"`.
- Types live in `lib/types.ts`. Don't scatter shared types into individual component files.
