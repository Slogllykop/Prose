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

        // Setup Intersection Observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: "0px 0px -80% 0px" },
        );

        for (const heading of headings) {
            const element = document.getElementById(heading.slug);
            if (element) {
                observer.observe(element);
            }
        }

        return () => observer.disconnect();
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
