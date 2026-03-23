import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllBlogs } from "@/lib/blog";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";

export default function Home() {
    const blogs = getAllBlogs();

    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-12">
            <header className="mb-10 flex items-start justify-between">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        {SITE_TITLE}
                    </h1>
                    <p className="mt-1 text-muted-foreground text-sm">
                        {SITE_DESCRIPTION}
                    </p>
                </div>
                <ThemeToggle />
            </header>

            {blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <IconPencil className="mb-4 size-10 text-muted-foreground" />
                    <p className="font-medium text-lg text-muted-foreground">
                        No posts yet
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm">
                        Add an MDX file to{" "}
                        <code className="text-xs">src/blogs/</code> to get
                        started.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.slug} blog={blog} />
                    ))}
                </div>
            )}

            <footer className="mt-16 border-border border-t pt-6 text-center text-muted-foreground text-xs">
                Built with{" "}
                <Link
                    href="https://nextjs.org"
                    target="_blank"
                    className="underline"
                >
                    Next.js
                </Link>{" "}
                &amp; MDX
            </footer>
        </main>
    );
}
