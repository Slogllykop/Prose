import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { EXAMPLE_SLUG, WORDS_PER_MINUTE } from "./constants";

const BLOGS_DIR = path.join(process.cwd(), "src", "blogs");

export interface HeadingMeta {
    text: string;
    level: number;
    slug: string;
}

export interface BlogError {
    error: string;
}

export interface BlogMeta {
    slug: string;
    title: string;
    description: string;
    date: string;
    updated: string;
    readingTime: number;
    heroImage: string;
    headings: HeadingMeta[];
}

/**
 * Formats a folder name into a human-readable title.
 * Converts hyphens/underscores to spaces and title-cases each word.
 */
function formatTitle(folderName: string): string {
    return folderName
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Calculates reading time in minutes from raw MDX content.
 */
export function calculateReadingTime(content: string): number {
    const text = content.replace(
        /(<[^>]+>|import\s.*|export\s.*|```[\s\S]*?```)/g,
        "",
    );
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/**
 * Gets blog metadata for a single slug.
 */
export function getBlogBySlug(slug: string): BlogMeta | BlogError | null {
    const folderPath = path.join(BLOGS_DIR, slug);

    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
        return null;
    }

    const files = fs.readdirSync(folderPath);
    const hasBlogMdx = files.includes("blog.mdx");
    const anyMdx = files.find((f) => f.endsWith(".mdx"));

    if (!hasBlogMdx) {
        if (anyMdx) {
            return {
                error: `You have a file named "${anyMdx}" in the blog folder, but it must be named "blog.mdx". Please rename it.`,
            };
        }
        return {
            error: `No "blog.mdx" file found in the directory "src/blogs/${slug}". Please create one.`,
        };
    }

    const mdxPath = path.join(folderPath, "blog.mdx");

    const fileContent = fs.readFileSync(mdxPath, "utf-8");
    const { data: frontmatter, content: mainContent } = matter(fileContent);
    const stats = fs.statSync(mdxPath);

    // Resolve imported MDX files to include their content for TOC and reading time
    const importRegex = /import\s+(\w+)\s+from\s+['"]\.\/([^'"]+\.mdx)['"]/g;
    const imports: Record<string, string> = {};
    let importMatch: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: necessary for regex parsing
    while ((importMatch = importRegex.exec(fileContent)) !== null) {
        imports[importMatch[1]] = importMatch[2];
    }

    let expandedContent = mainContent;
    for (const [componentName, fileName] of Object.entries(imports)) {
        const filePath = path.join(folderPath, fileName);
        if (fs.existsSync(filePath)) {
            const childRaw = fs.readFileSync(filePath, "utf-8");
            const { content: childContent } = matter(childRaw);
            const tagRegex = new RegExp(`<${componentName}\\s*\\/>`, "g");
            expandedContent = expandedContent.replace(tagRegex, childContent);
        }
    }

    const slugger = new GithubSlugger();
    const headings: HeadingMeta[] = [];
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    let match: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: necessary for regex parsing
    while ((match = headingRegex.exec(expandedContent)) !== null) {
        const level = match[1].length;
        const text = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim(); // Remove markdown links
        headings.push({
            text,
            level,
            slug: slugger.slug(text),
        });
    }

    const date = frontmatter.date
        ? new Date(frontmatter.date).toISOString()
        : stats.birthtime.toISOString();

    const updated = frontmatter.updated
        ? new Date(frontmatter.updated).toISOString()
        : stats.mtime.toISOString();

    const heroFiles = fs
        .readdirSync(folderPath)
        .filter((f) => /^hero\.(png|jpg|jpeg|webp|avif)$/i.test(f));

    return {
        slug,
        title: (frontmatter.title as string) || formatTitle(slug),
        description: (frontmatter.description as string) || "",
        date,
        updated,
        readingTime: calculateReadingTime(expandedContent),
        heroImage: heroFiles.length > 0 ? heroFiles[0] : "",
        headings,
    };
}

/**
 * Gets all blog slugs (excluding the example blog).
 */
export function getAllBlogSlugs(): string[] {
    if (!fs.existsSync(BLOGS_DIR)) return [];

    return fs.readdirSync(BLOGS_DIR).filter((name) => {
        const fullPath = path.join(BLOGS_DIR, name);
        return fs.statSync(fullPath).isDirectory();
    });
}

/**
 * Gets all blog metadata, sorted by date (newest first).
 * Excludes the example blog from the listing.
 */
export function getAllBlogs(): BlogMeta[] {
    const slugs = getAllBlogSlugs();

    return slugs
        .filter((slug) => slug !== EXAMPLE_SLUG)
        .map((slug) => getBlogBySlug(slug))
        .filter((blog): blog is BlogMeta => blog !== null && !("error" in blog))
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
}
