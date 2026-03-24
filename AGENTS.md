# Prose Blogging Platform

**Tech Stack:**
- Frontend: Next.js 16 (App Router), React 19, TypeScript
- Styling: Tailwind v4, `@tailwindcss/typography`
- Components: Shadcn UI (radix-mira style), Tabler Icons
- Content: MDX (`@next/mdx`), `gray-matter`, `rehype-slug`, `@shikijs/rehype`, `remark-gfm`, `remark-frontmatter`
- DX: Biomejs for linting/formatting

**Architecture & Conventions:**
- Blog content is driven entirely by the `src/blogs/` directory.
- Each blog is a folder inside `src/blogs/` named as the slug.
- Every blog folder must contain an `.mdx` file (e.g. `blog.mdx`).
- A `hero.png` (or `.jpg`, etc.) can be placed in the blog folder to be used as the hero image (rendered at 16:7 aspect ratio, recommended dimensions: 700x306 pixels).
- Blog parsing and metadata logic is located in `src/lib/blog.ts`.
- MDX components (headings, pre/code with copy button) are customized in `src/mdx-components.tsx`.
- The `src/blogs/example` post is excluded from search engine indexing and the main blog listing. It is built for formatting reference (`/example`).
- Images in `src/blogs/` are served dynamically at runtime via the `src/app/api/v1/blog-assets/[...path]/route.ts` API route.
- A global blog data feed is available via the `src/app/api/v1/get-blogs/route.ts` API route (supports CORS and caching).
- Use `pnpm run format` (via biome) to sort Tailwind classes before committing.

**Adding a New Post:**
1. Create `src/blogs/your-slug-name/blog.mdx`
2. Define YAML frontmatter (`title`, `description`, `date`, `updated`)
3. (Optional) Provide `src/blogs/your-slug-name/hero.png`
