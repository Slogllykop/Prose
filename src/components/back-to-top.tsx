"use client";

import { IconArrowUp } from "@tabler/icons-react";
export function BackToTop() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-muted-foreground text-sm transition-all hover:text-foreground"
            aria-label="Back to top"
        >
            <IconArrowUp className="size-4" />
            <span>Back to top</span>
        </button>
    );
}
