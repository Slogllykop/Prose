"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({ className }: { className?: string }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const pre = button.parentElement?.querySelector("pre");
        if (!pre) return;

        // textContent extracts the raw text from the code block
        const text = pre.textContent || "";

        await navigator.clipboard.writeText(text.trimEnd());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={cn(
                "absolute top-3 right-3 z-10 hidden rounded-md border border-border bg-muted/50 p-2 text-muted-foreground backdrop-blur-sm transition-all hover:bg-muted hover:text-foreground group-hover:block",
                className,
            )}
            aria-label="Copy code"
        >
            {isCopied ? (
                <IconCheck className="size-4" aria-hidden="true" />
            ) : (
                <IconCopy className="size-4" aria-hidden="true" />
            )}
        </button>
    );
}
