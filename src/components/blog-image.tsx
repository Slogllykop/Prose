"use client";

import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const ALIGN_CLASSES: Record<string, string> = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
};

interface BlogImageProps {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    align?: "left" | "center" | "right";
    className?: string;
}

/**
 * Advanced image component for JSX usage in MDX with width, height, and align support.
 * Automatically rewrites relative image paths (starting with 'images/') to use the
 * dynamic blog asset API.
 *
 * Usage in MDX:
 * <BlogImage src="images/photo.png" alt="Description" width={400} align="center" />
 */
export function BlogImage({
    src,
    alt,
    width,
    height,
    align = "left",
    className,
}: BlogImageProps) {
    const params = useParams();
    const slug = params?.slug as string;

    const rewriteSrc = (url: string): string => {
        if (url.startsWith("images/") && slug) {
            return `/api/v1/blog-assets/${slug}/${url}`;
        }
        return url;
    };

    const finalSrc = rewriteSrc(src);
    const alignClass = ALIGN_CLASSES[align] || "";

    return (
        // biome-ignore lint/performance/noImgElement: required for dynamic MDX image path rewriting
        <img
            src={finalSrc}
            alt={alt || ""}
            width={width}
            height={height}
            className={cn("mt-8 mb-8 block rounded-lg", alignClass, className)}
            style={{
                width: width
                    ? typeof width === "number"
                        ? `${width}px`
                        : width
                    : undefined,
                height: height
                    ? typeof height === "number"
                        ? `${height}px`
                        : height
                    : undefined,
            }}
        />
    );
}
