import { IconCalendar, IconRefresh } from "@tabler/icons-react";
import Link from "next/link";
import type { BlogMeta } from "@/lib/blog";

interface BlogCardProps {
    blog: BlogMeta;
}

export function BlogCard({ blog }: BlogCardProps) {
    const uploadDate = new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const updateDate = new Date(blog.updated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <Link href={`/${blog.slug}`} className="group block">
            <article className="rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm">
                <h2 className="font-semibold text-foreground text-lg tracking-tight group-hover:underline">
                    {blog.title}
                </h2>

                {blog.description && (
                    <p className="mt-1.5 line-clamp-2 text-muted-foreground text-sm">
                        {blog.description}
                    </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
                    <span className="inline-flex items-center gap-1">
                        <IconCalendar className="size-3.5" />
                        {uploadDate}
                    </span>
                    {uploadDate !== updateDate && (
                        <span className="inline-flex items-center gap-1">
                            <IconRefresh className="size-3.5" />
                            {updateDate}
                        </span>
                    )}
                    <span>{blog.readingTime} min read</span>
                </div>
            </article>
        </Link>
    );
}
