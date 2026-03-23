import { IconArticle } from "@tabler/icons-react";
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
import { AUTHOR_IMAGE, AUTHOR_NAME, AUTHOR_URL } from "@/lib/constants";

export default function Home() {
    const blogs = getAllBlogs();

    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-12">
            <header className="mb-12 flex items-center justify-between">
                <Link
                    href={AUTHOR_URL}
                    target="_blank"
                    className="flex items-center gap-4 transition-opacity hover:opacity-80"
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
                            <IconArticle />
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
