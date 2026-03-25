import { IconArticle } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { getAllBlogs } from "@/lib/blog";
import {
    AUTHOR_IMAGE,
    AUTHOR_NAME,
    AUTHOR_TITLE,
    AUTHOR_URL,
    SEO_KEYWORDS,
    SITE_DESCRIPTION,
    SITE_TITLE,
    SITE_URL,
} from "@/lib/constants";

export const metadata: Metadata = {
    title: `${AUTHOR_NAME} - Blog`,
    description: SITE_DESCRIPTION,
    keywords: SEO_KEYWORDS,
    alternates: {
        canonical: SITE_URL,
    },
    openGraph: {
        title: `${AUTHOR_NAME} - Blog | ${SITE_TITLE}`,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: `${AUTHOR_NAME} - Blog | ${SITE_TITLE}`,
        description: SITE_DESCRIPTION,
    },
};

export default function Home() {
    const blogs = getAllBlogs();

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                name: SITE_TITLE,
                url: SITE_URL,
                description: SITE_DESCRIPTION,
                publisher: {
                    "@type": "Person",
                    name: AUTHOR_NAME,
                    url: AUTHOR_URL,
                    image: `${SITE_URL}${AUTHOR_IMAGE}`,
                },
            },
            {
                "@type": "Person",
                name: AUTHOR_NAME,
                url: AUTHOR_URL,
                jobTitle: AUTHOR_TITLE,
                image: `${SITE_URL}${AUTHOR_IMAGE}`,
                sameAs: [AUTHOR_URL],
            },
            {
                "@type": "CollectionPage",
                name: `${AUTHOR_NAME} - Blog`,
                description: SITE_DESCRIPTION,
                url: SITE_URL,
                isPartOf: {
                    "@type": "WebSite",
                    name: SITE_TITLE,
                    url: SITE_URL,
                },
                about: {
                    "@type": "Person",
                    name: AUTHOR_NAME,
                },
            },
        ],
    };

    return (
        <main id="main-content" className="mx-auto w-full max-w-2xl px-4 py-12">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for JSON-LD
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />
            <header className="mb-12 flex items-center justify-between">
                <Link
                    href={AUTHOR_URL}
                    target="_blank"
                    className="focus-ring flex items-center gap-4 rounded-lg transition-opacity hover:opacity-80"
                >
                    <div className="relative size-12 overflow-hidden rounded-full border bg-muted">
                        <Image
                            src={AUTHOR_IMAGE}
                            alt={AUTHOR_NAME}
                            fill
                            className="object-cover"
                            sizes="48px"
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg tracking-tight">
                            {AUTHOR_NAME}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Building, designing, and sharing the journey.
                        </p>
                    </div>
                </Link>
                <ThemeToggle />
            </header>

            {blogs.length === 0 ? (
                <Empty className="min-h-[400px] border-2">
                    <EmptyHeader>
                        <EmptyMedia
                            variant="icon"
                            className="size-10 [&_svg]:size-8"
                        >
                            <IconArticle aria-hidden="true" />
                        </EmptyMedia>
                        <EmptyTitle className="text-xl">
                            No posts published
                        </EmptyTitle>
                        <EmptyDescription className="text-sm">
                            {AUTHOR_NAME} hasn't published any posts yet. Check
                            back later for new content.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="flex flex-col gap-4">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.slug} blog={blog} />
                    ))}
                </div>
            )}

            <footer className="mt-10 flex items-center justify-center border-border border-t pt-8 text-muted-foreground text-sm">
                <p>
                    &copy; {new Date().getFullYear()} {AUTHOR_NAME}. All rights
                    reserved.
                </p>
            </footer>
        </main>
    );
}
