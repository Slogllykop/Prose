import fs from "node:fs";
import path from "node:path";
import {
    IconArrowLeft,
    IconCalendar,
    IconClock,
    IconRefresh,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/back-to-top";
import { TableOfContents } from "@/components/mdx-toc";
import { ScrollProgress } from "@/components/scroll-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    getAllBlogSlugs,
    getBlogBySlug,
    resolveSlugToFolder,
} from "@/lib/blog";
import {
    AUTHOR_IMAGE,
    AUTHOR_NAME,
    AUTHOR_URL,
    EXAMPLE_SLUG,
    SEO_KEYWORDS,
    SITE_TITLE,
    SITE_URL,
} from "@/lib/constants";

const BLOGS_DIR = path.join(process.cwd(), "src", "blogs");

// createBlogComponents has been moved to src/mdx-components.tsx
// to support nested MDX components across modular blog chunks.

export const dynamicParams = false;

export function generateStaticParams() {
    return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;
    const blog = getBlogBySlug(slug);

    if (!blog) return { title: "Not Found" };
    if ("error" in blog) return { title: "Configuration Error" };

    const isExample = slug === EXAMPLE_SLUG;
    const blogUrl = `${SITE_URL}/${slug}`;

    return {
        title: blog.title,
        description: blog.description || `${blog.title} by ${AUTHOR_NAME}`,
        keywords: [
            ...SEO_KEYWORDS,
            blog.title,
            ...blog.title.split(/\s+/).filter((w) => w.length > 3),
        ],
        authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
        alternates: {
            canonical: blogUrl,
        },
        openGraph: {
            title: `${blog.title} | ${SITE_TITLE}`,
            description: blog.description || `${blog.title} by ${AUTHOR_NAME}`,
            url: blogUrl,
            type: "article",
            publishedTime: blog.date,
            modifiedTime: blog.updated,
            authors: [AUTHOR_NAME],
            siteName: SITE_TITLE,
        },
        twitter: {
            card: "summary_large_image",
            title: `${blog.title} | ${SITE_TITLE}`,
            description: blog.description || `${blog.title} by ${AUTHOR_NAME}`,
        },
        ...(isExample && {
            robots: { index: false, follow: false },
        }),
    };
}

export default async function BlogPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;
    const blog = getBlogBySlug(slug);

    if (!blog) notFound();
    if ("error" in blog) {
        return (
            <main className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
                <div className="w-full max-w-2xl rounded-lg border border-destructive/20 bg-destructive/10 p-8 text-destructive">
                    <h1 className="mb-4 flex items-center justify-center gap-2 font-bold text-2xl">
                        Blog Configuration Error
                    </h1>
                    <p className="font-medium">{blog.error}</p>
                </div>
            </main>
        );
    }

    const folderName = resolveSlugToFolder(slug);
    if (!folderName) notFound();

    const { default: MdxContent } = await import(
        `@/blogs/${folderName}/blog.mdx`
    );

    const uploadDate = new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const updateDate = new Date(blog.updated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const heroPath = blog.heroImage
        ? path.join(BLOGS_DIR, folderName, blog.heroImage)
        : null;
    const hasCustomHero = heroPath && fs.existsSync(heroPath);
    const heroToDisplay = hasCustomHero
        ? `/api/v1/blog-assets/${folderName}/${blog.heroImage}`
        : "/hero.png";

    const blogUrl = `${SITE_URL}/${slug}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.description || `${blog.title} by ${AUTHOR_NAME}`,
        url: blogUrl,
        datePublished: blog.date,
        dateModified: blog.updated,
        author: {
            "@type": "Person",
            name: AUTHOR_NAME,
            url: AUTHOR_URL,
            image: `${SITE_URL}${AUTHOR_IMAGE}`,
        },
        publisher: {
            "@type": "Person",
            name: AUTHOR_NAME,
            url: AUTHOR_URL,
            image: `${SITE_URL}${AUTHOR_IMAGE}`,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": blogUrl,
        },
        image: `${SITE_URL}${heroToDisplay}`,
        wordCount: blog.readingTime * 200,
        isPartOf: {
            "@type": "WebSite",
            name: SITE_TITLE,
            url: SITE_URL,
        },
    };

    return (
        <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-12">
            <ScrollProgress />
            <script
                type="application/ld+json"
                suppressHydrationWarning
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for JSON-LD
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />
            <header className="print-hidden mx-auto mb-12 flex max-w-2xl items-center justify-between">
                <Link
                    href="/"
                    className="focus-ring -ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                    <IconArrowLeft className="size-4" aria-hidden="true" />
                    All posts
                </Link>
                <ThemeToggle />
            </header>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(0,672px)_1fr]">
                <div className="hidden lg:block" />{" "}
                {/* Left Spacer to center the article */}
                <article className="w-full">
                    <div className="mb-6">
                        <h1 className="font-bold text-3xl tracking-tight">
                            {blog.title}
                        </h1>

                        <div className="mt-4 flex items-center gap-3">
                            <Image
                                src={AUTHOR_IMAGE}
                                alt={AUTHOR_NAME}
                                width={36}
                                height={36}
                                className="rounded-full"
                            />
                            <div className="flex flex-col">
                                <Link
                                    href={AUTHOR_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-foreground text-sm hover:underline"
                                >
                                    {AUTHOR_NAME}
                                </Link>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-muted-foreground text-xs">
                                    <span className="inline-flex items-center gap-1">
                                        <IconCalendar
                                            className="size-3"
                                            aria-hidden="true"
                                        />
                                        {uploadDate}
                                    </span>
                                    {uploadDate !== updateDate && (
                                        <span className="inline-flex items-center gap-1">
                                            <IconRefresh
                                                className="size-3"
                                                aria-hidden="true"
                                            />
                                            {updateDate}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1">
                                        <IconClock
                                            className="size-3"
                                            aria-hidden="true"
                                        />
                                        {blog.readingTime} min read
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 overflow-hidden rounded-lg border border-border bg-muted">
                        <Image
                            src={heroToDisplay}
                            alt={`Hero image for ${blog.title}`}
                            width={1200}
                            height={630}
                            className="aspect-16/7 w-full object-cover"
                            priority
                        />
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:p-0 prose-li:text-justify prose-p:text-justify prose-headings:font-semibold prose-headings:tracking-tight prose-a:underline prose-a:underline-offset-4">
                        <MdxContent />
                    </div>
                </article>
                <aside className="sticky top-24 hidden h-fit lg:block">
                    <nav aria-label="Table of contents" className="w-[250px]">
                        <TableOfContents headings={blog.headings} />
                    </nav>
                </aside>
            </div>

            <footer className="print-hidden mx-auto mt-16 max-w-2xl">
                <div className="flex items-center justify-between border-border border-t py-8 text-muted-foreground text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} {AUTHOR_NAME}
                    </p>
                    <BackToTop />
                </div>
            </footer>
        </main>
    );
}
