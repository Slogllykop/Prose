"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HeadingMeta } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
    headings: HeadingMeta[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");
    const [translateY, setTranslateY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
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
            const maxScroll = Math.max(
                0,
                document.documentElement.scrollHeight - window.innerHeight,
            );
            const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
            const scanLineY = window.innerHeight * (0.2 + scrollProgress * 0.8);

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
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [headings]);

    // Slide the TOC list to keep the active heading visible within the container
    const updateTranslate = useCallback(() => {
        const container = containerRef.current;
        const list = listRef.current;
        if (!container || !list || !activeId) return;

        const activeElement = list.querySelector(
            `[data-toc-id="${activeId}"]`,
        ) as HTMLElement | null;
        if (!activeElement) return;

        const containerHeight = container.clientHeight;
        const listHeight = list.scrollHeight;

        // If the list fits entirely, no translation needed
        if (listHeight <= containerHeight) {
            setTranslateY(0);
            return;
        }

        // Get the position of the active item relative to the list
        const activeTop = activeElement.offsetTop;
        const activeHeight = activeElement.offsetHeight;
        const activeMid = activeTop + activeHeight / 2;

        // Target: keep the active item roughly centered in the container
        let offset = activeMid - containerHeight / 2;

        // Clamp: don't translate beyond list boundaries
        const maxOffset = listHeight - containerHeight;
        offset = Math.max(0, Math.min(offset, maxOffset));

        setTranslateY(-offset);
    }, [activeId]);

    useEffect(() => {
        updateTranslate();
    }, [updateTranslate]);

    if (!headings?.length) return null;

    const showTopFade = translateY < 0;
    const showBottomFade =
        listRef.current && containerRef.current
            ? listRef.current.scrollHeight + translateY >
              containerRef.current.clientHeight
            : false;

    return (
        <div className="flex max-h-[calc(100vh-8rem)] flex-col gap-4">
            <p className="font-semibold text-foreground text-xl tracking-tight">
                On this page
            </p>
            <div ref={containerRef} className="relative flex-1 overflow-hidden">
                {/* Top fade gradient */}
                <div
                    className={cn(
                        "pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-linear-to-b from-background to-transparent transition-opacity duration-300",
                        showTopFade ? "opacity-100" : "opacity-0",
                    )}
                />

                <ul
                    ref={listRef}
                    className="space-y-2.5 text-sm transition-transform duration-300 ease-out md:space-y-2"
                    style={{ transform: `translateY(${translateY}px)` }}
                >
                    {headings.map((heading) => (
                        <li
                            key={heading.slug}
                            data-toc-id={heading.slug}
                            className={cn(
                                "transition-colors hover:text-foreground",
                                heading.level === 3 ? "pl-4" : "",
                                heading.level > 3 ? "pl-8" : "",
                                activeId === heading.slug
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                            )}
                        >
                            <a
                                href={`#${heading.slug}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById(
                                        heading.slug,
                                    );
                                    if (element) {
                                        window.history.replaceState(
                                            null,
                                            "",
                                            `#${heading.slug}`,
                                        );
                                        element.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                                className="group flex flex-col"
                            >
                                <span
                                    className={cn(
                                        "transition-all",
                                        activeId === heading.slug
                                            ? "font-medium"
                                            : "font-normal",
                                    )}
                                >
                                    {heading.text}
                                </span>
                                {/* Invisible bold placeholder to prevent layout shift */}
                                <span
                                    className="pointer-events-none invisible block h-0 select-none font-medium"
                                    aria-hidden="true"
                                >
                                    {heading.text}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Bottom fade gradient */}
                <div
                    className={cn(
                        "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-linear-to-t from-background to-transparent transition-opacity duration-300",
                        showBottomFade ? "opacity-100" : "opacity-0",
                    )}
                />
            </div>
        </div>
    );
}
