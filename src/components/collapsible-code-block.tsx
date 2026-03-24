"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/copy-button";

const MAXIMUM_PERMITTED_LINES = 30;

export function CollapsibleCodeBlock({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLPreElement>) {
    const [isCollapsible, setIsCollapsible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [collapsedHeight, setCollapsedHeight] = useState<number | undefined>(
        undefined,
    );
    const preRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        if (preRef.current) {
            const lineElements = preRef.current.querySelectorAll(".line");
            let lineCount = 0;

            if (lineElements.length > 0) {
                lineCount = lineElements.length;
                if (lineCount > MAXIMUM_PERMITTED_LINES) {
                    const thresholdLine = lineElements[
                        MAXIMUM_PERMITTED_LINES - 1
                    ] as HTMLElement;
                    if (thresholdLine) {
                        // Include some padding so the threshold line is fully visible
                        setCollapsedHeight(
                            thresholdLine.offsetTop +
                                thresholdLine.offsetHeight +
                                16,
                        );
                    }
                    setIsCollapsible(true);
                }
            } else {
                const text = preRef.current.textContent || "";
                lineCount = text.split("\n").length;
                if (lineCount > MAXIMUM_PERMITTED_LINES) {
                    setIsCollapsible(true);
                }
            }
        }
    }, []);

    return (
        <div className="group relative my-4">
            <div
                className={
                    isCollapsible && !isExpanded
                        ? "relative overflow-hidden rounded-lg"
                        : "relative rounded-lg"
                }
                style={{
                    maxHeight:
                        isCollapsible && !isExpanded
                            ? collapsedHeight
                                ? `${collapsedHeight}px`
                                : `${MAXIMUM_PERMITTED_LINES * 1.25}rem` // Fallback: ~X lines * 1.25rem line-height
                            : undefined,
                }}
            >
                <pre
                    ref={preRef}
                    className={`${className || ""} m-0!`}
                    {...props}
                >
                    {children}
                </pre>
                <CopyButton />
                {isCollapsible && !isExpanded && (
                    <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-linear-to-t from-background to-transparent" />
                )}
            </div>

            {isCollapsible && (
                <div className="mt-3 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="rounded-md bg-muted px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted/80 hover:text-foreground"
                    >
                        {isExpanded ? "Collapse code" : "Expand code"}
                    </button>
                </div>
            )}
        </div>
    );
}
