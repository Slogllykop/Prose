"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = Math.max(
                0,
                document.documentElement.scrollHeight - window.innerHeight,
            );
            setProgress(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className="fixed inset-x-0 top-0 z-50 h-1.5 print:hidden"
            aria-hidden="true"
        >
            <div
                className="h-full bg-muted-foreground transition-[width] duration-150 ease-out dark:bg-foreground"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
