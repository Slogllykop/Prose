import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { EXAMPLE_SLUG, WORDS_PER_MINUTE } from "./constants";

const BLOGS_DIR = path.join(process.cwd(), "src", "blogs");

export interface BlogMeta {
    slug: string;
    title: string;
    description: string;
    date: string;
    updated: string;
    readingTime: number;
    heroImage: string;
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
 * Finds the MDX file inside a blog folder.
 * Looks for any .mdx file (e.g., blog.mdx, index.mdx, etc.)
 */
function findMdxFile(folderPath: string): string | null {
    const files = fs.readdirSync(folderPath);
    const mdxFile = files.find((f) => f.endsWith(".mdx"));
    return mdxFile ? path.join(folderPath, mdxFile) : null;
}

/**
 * Gets blog metadata for a single slug.
 */
export function getBlogBySlug(slug: string): BlogMeta | null {
    const folderPath = path.join(BLOGS_DIR, slug);

    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
        return null;
    }

    const mdxPath = findMdxFile(folderPath);
    if (!mdxPath) return null;

    const fileContent = fs.readFileSync(mdxPath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);
    const stats = fs.statSync(mdxPath);

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
        readingTime: calculateReadingTime(content),
        heroImage: heroFiles.length > 0 ? heroFiles[0] : "",
    };
}

/**
 * Gets all blog slugs (excluding the example blog).
 */
export function getAllBlogSlugs(): string[] {
    if (!fs.existsSync(BLOGS_DIR)) return [];

    return fs.readdirSync(BLOGS_DIR).filter((name) => {
        const fullPath = path.join(BLOGS_DIR, name);
        return (
            fs.statSync(fullPath).isDirectory() &&
            findMdxFile(fullPath) !== null
        );
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
        .filter((blog): blog is BlogMeta => blog !== null)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
}
