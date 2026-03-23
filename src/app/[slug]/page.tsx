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
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllBlogSlugs, getBlogBySlug } from "@/lib/blog";
import {
    AUTHOR_IMAGE,
    AUTHOR_NAME,
    AUTHOR_URL,
    EXAMPLE_SLUG,
    SITE_TITLE,
} from "@/lib/constants";

const BLOGS_DIR = path.join(process.cwd(), "src", "blogs");

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

    const isExample = slug === EXAMPLE_SLUG;

    return {
        title: blog.title,
        description: blog.description || `${blog.title} - ${SITE_TITLE}`,
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

    const { default: MdxContent } = await import(`@/blogs/${slug}/blog.mdx`);

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
        ? path.join(BLOGS_DIR, slug, blog.heroImage)
        : null;
    const hasHero = heroPath && fs.existsSync(heroPath);

    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-12">
            <header className="mb-8 flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                    <IconArrowLeft className="size-4" />
                    All posts
                </Link>
                <ThemeToggle />
            </header>

            <article>
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
                                    <IconCalendar className="size-3" />
                                    {uploadDate}
                                </span>
                                {uploadDate !== updateDate && (
                                    <span className="inline-flex items-center gap-1">
                                        <IconRefresh className="size-3" />
                                        {updateDate}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1">
                                    <IconClock className="size-3" />
                                    {blog.readingTime} min read
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {hasHero && (
                    <div className="mb-8 overflow-hidden rounded-lg border border-border">
                        <Image
                            src={`/blog-assets/${slug}/${blog.heroImage}`}
                            alt={`Hero image for ${blog.title}`}
                            width={1200}
                            height={630}
                            className="aspect-16/7 w-full object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="prose prose-zinc dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-headings:font-semibold prose-headings:tracking-tight prose-a:underline prose-a:underline-offset-4">
                    <MdxContent />
                </div>
            </article>

            <div className="mt-12 border-border border-t pt-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                    <IconArrowLeft className="size-4" />
                    View all posts
                </Link>
            </div>
        </main>
    );
}
