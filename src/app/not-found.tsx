import { IconArrowLeft, IconFileSearch } from "@tabler/icons-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { AUTHOR_NAME, SITE_TITLE } from "@/lib/constants";

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-12">
            <header className="mb-12 flex shrink-0 items-center justify-between">
                <Link
                    href="/"
                    className="font-bold text-lg tracking-tight transition-opacity hover:opacity-80"
                >
                    {SITE_TITLE}
                </Link>
                <ThemeToggle />
            </header>

            <div className="fade-in slide-in-from-bottom-4 flex flex-1 animate-in flex-col items-center justify-center duration-700">
                <Empty className="border-none p-0">
                    <EmptyHeader>
                        <EmptyMedia
                            variant="icon"
                            className="size-20 rounded-full bg-muted/50 p-4 shadow-sm ring-1 ring-border transition-all hover:scale-110 hover:shadow-md [&_svg]:size-10"
                        >
                            <IconFileSearch className="size-20 text-muted-foreground" />
                        </EmptyMedia>
                        <div className="mt-6 flex flex-col items-center gap-1">
                            <span className="font-medium font-mono text-muted-foreground/60 text-xs uppercase tracking-[0.2em]">
                                Error 404
                            </span>
                            <EmptyTitle className="font-bold text-4xl tracking-tight">
                                Lost in Prose?
                            </EmptyTitle>
                        </div>
                        <EmptyDescription className="mt-4 max-w-[340px] text-balance text-base/relaxed text-muted-foreground">
                            The page you're looking for doesn't exist. It might
                            have been moved or deleted recently.
                        </EmptyDescription>
                        <div className="mt-10">
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="h-10 rounded-full border-border bg-background px-6 shadow-sm transition-all hover:bg-muted active:scale-95"
                            >
                                <Link href="/" className="gap-2">
                                    <IconArrowLeft className="size-4" />
                                    Return to all posts
                                </Link>
                            </Button>
                        </div>
                    </EmptyHeader>
                </Empty>
            </div>

            <footer className="mt-auto pt-8 text-center">
                <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} {AUTHOR_NAME}.
                </p>
            </footer>
        </main>
    );
}
