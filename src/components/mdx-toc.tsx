"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeadingMeta } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
    headings: HeadingMeta[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Handle initial hash scroll with smooth animation
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }

        const handleScroll = () => {
            const headingElements = headings
                .map((h) => document.getElementById(h.slug))
                .filter((el): el is HTMLElement => el !== null);

            if (headingElements.length === 0) return;

            const scrollY = window.scrollY;
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
            
            // The scan line dynamically moves from the top 20% to the bottom 100% of the window.
            // This ensures all sections get highlighted sequentially as the user scrolls, 
            // especially the last sections when there is no more scroll space.
            const scanLineY = window.innerHeight * (0.2 + (scrollProgress * 0.8));
            
            let active = headingElements[0]?.id || "";
            for (const el of headingElements) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= scanLineY) {
                    active = el.id;
                }
            }
            
            setActiveId(active);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [headings]);

    if (!headings?.length) return null;

    return (
        <div className="space-y-4">
            <p className="font-semibold text-foreground text-sm tracking-tight">
                On this page
            </p>
            <ul className="space-y-2.5 text-sm md:space-y-2">
                {headings.map((heading) => (
                    <li
                        key={heading.slug}
                        className={cn(
                            "transition-colors hover:text-foreground",
                            heading.level === 3 ? "pl-4" : "",
                            heading.level > 3 ? "pl-8" : "",
                            activeId === heading.slug
                                ? "font-medium text-foreground"
                                : "text-muted-foreground",
                        )}
                    >
                        <Link href={`#${heading.slug}`} className="block">
                            {heading.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
