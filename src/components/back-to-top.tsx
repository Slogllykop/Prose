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
            className="focus-ring -mr-2 flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground text-sm transition-all hover:text-foreground"
            aria-label="Back to top"
        >
            <IconArrowUp className="size-4" aria-hidden="true" />
            <span>Back to top</span>
        </button>
    );
}
