Add a new project card: $ARGUMENTS

The argument is the project name. The project will render in the Projects section via `components/projects.tsx`, which iterates over the `projects` array in `lib/data.ts`.

Steps:
1. Drop the project's preview image into `/public/` (PNG or JPEG). Filename should be lowercase-kebab.
2. Read `lib/data.ts` — find the existing image imports at the top of the file and the `projects` array.
3. Add a new image import at the top alongside the others (e.g., `import myProject from "@/public/my-project.png";`). NEVER use a string path — Next needs the import for fingerprinting and dimensions.
4. Add a new entry to the `projects` array. Match the shape of existing entries: title, slug, description, stack, accent (must be one of the `AccentColor` union from `lib/types.ts`), image, and any link fields used by similar projects.
5. If the project needs a new accent color that isn't already in the `AccentColor` union: extend `lib/types.ts` AND add the matching palette entry to `accentMap` in `lib/cn.ts`. Components that index into `accentMap` will crash on a missing key.
6. Run `npm run dev` and verify the card renders correctly with the right accent color.
