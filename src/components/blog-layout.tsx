"use client";

import {
    IconArrowLeft,
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
    IconLayoutSidebarRightCollapse,
    IconLayoutSidebarRightExpand,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogLayoutProps {
    children: React.ReactNode;
    leftSidebar: React.ReactNode;
    rightSidebar: React.ReactNode;
}

export function BlogLayout({
    children,
    leftSidebar,
    rightSidebar,
}: BlogLayoutProps) {
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useLayoutEffect(() => {
        const savedLeft = localStorage.getItem("prose-left-sidebar");
        if (savedLeft !== null) {
            setLeftOpen(savedLeft === "true");
        }

        const savedRight = localStorage.getItem("prose-right-sidebar");
        if (savedRight !== null) {
            setRightOpen(savedRight === "true");
        }

        setMounted(true);

        // Small delay to ensure hydration has finished before enabling animations
        const timer = setTimeout(() => setIsLoaded(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const toggleLeft = () => {
        const newValue = !leftOpen;
        setLeftOpen(newValue);
        localStorage.setItem("prose-left-sidebar", String(newValue));
    };

    const toggleRight = () => {
        const newValue = !rightOpen;
        setRightOpen(newValue);
        localStorage.setItem("prose-right-sidebar", String(newValue));
    };

    return (
        <>
            <header className="print-hidden mx-auto mb-12 flex max-w-2xl items-center justify-between">
                <Link
                    href="/"
                    className="focus-ring -ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                    <IconArrowLeft className="size-4" aria-hidden="true" />
                    All posts
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLeft}
                        className="hidden text-muted-foreground lg:flex"
                        aria-label="Toggle left sidebar"
                    >
                        {leftOpen ? (
                            <IconLayoutSidebarLeftCollapse className="size-5" />
                        ) : (
                            <IconLayoutSidebarLeftExpand className="size-5" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleRight}
                        className="hidden text-muted-foreground lg:flex"
                        aria-label="Toggle right sidebar"
                    >
                        {rightOpen ? (
                            <IconLayoutSidebarRightCollapse className="size-5" />
                        ) : (
                            <IconLayoutSidebarRightExpand className="size-5" />
                        )}
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(0,672px)_1fr]">
                {/* Left Sidebar Track */}
                <div className="hidden h-full lg:flex lg:flex-col lg:items-end">
                    <motion.aside
                        initial={false}
                        animate={{
                            opacity: mounted && leftOpen ? 1 : 0,
                            x: mounted && leftOpen ? 0 : -20,
                        }}
                        transition={{
                            duration: isLoaded ? 0.3 : 0,
                            ease: "easeInOut",
                        }}
                        className={cn(
                            "sticky top-24 hidden h-fit overflow-hidden lg:block",
                            !leftOpen && "pointer-events-none",
                        )}
                        aria-hidden={!leftOpen}
                    >
                        <div className="flex w-60 flex-col gap-8 pr-4 xl:w-62.5 xl:pr-8">
                            {leftSidebar}
                        </div>
                    </motion.aside>
                </div>

                {/* Main Article */}
                <article className="w-full">{children}</article>

                {/* Right Sidebar Track */}
                <div className="hidden h-full lg:block">
                    <motion.aside
                        initial={false}
                        animate={{
                            opacity: mounted && rightOpen ? 1 : 0,
                            x: mounted && rightOpen ? 0 : 20,
                        }}
                        transition={{
                            duration: isLoaded ? 0.3 : 0,
                            ease: "easeInOut",
                        }}
                        className={cn(
                            "sticky top-24 hidden h-fit overflow-hidden lg:block",
                            !rightOpen && "pointer-events-none",
                        )}
                        aria-hidden={!rightOpen}
                    >
                        <div className="w-[250px]">{rightSidebar}</div>
                    </motion.aside>
                </div>
            </div>
        </>
    );
}
