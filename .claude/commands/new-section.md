Scaffold a new home-page section: $ARGUMENTS

The argument is the section's display name (e.g., "Writing", "Talks"). Use it for both the nav label and the section id (lowercased).

Steps:
1. Read `lib/data.ts` and add a new entry to the `nav` array. Match the shape of existing entries (`{ name: "X", hash: "/#x" }`). Make sure `nav` keeps its `as const` annotation — `lib/types.ts` derives `SectionName` from it.
2. Read `components/projects.tsx` as a reference for a section that uses `useSectionInView`, `m.*` framer animations, and the accent palette.
3. Create `components/{name-lowercased}.tsx`:
   - `"use client"` at top
   - Import and call `useSectionInView("{Name}", 0.5)`
   - Wrap content in `<section id="{name-lowercased}" ref={ref}>`
   - Pull all content from new `lib/data.ts` exports — no inline copy
   - Use `m.*` from `framer-motion`, NEVER `motion.*`
4. Add any new content shape to `lib/data.ts` (e.g., a new array). Keep types co-located there or in `lib/types.ts` if shared.
5. Import the new section in `app/page.tsx` and render it in the appropriate spot in the section sequence.
6. Run `npm run build` to verify the new `SectionName` type compiles end-to-end.
