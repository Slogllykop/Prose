"use client";

import {
    IconBrandFacebook,
    IconBrandLinkedin,
    IconBrandX,
    IconCheck,
    IconLink,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialShareProps {
    url: string;
    title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
    const [copied, setCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(url);

    // If no URL is provided, try to use window.location.href (client side only)
    useEffect(() => {
        if (!url && typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, [url]);

    const shareLinks = [
        {
            name: "Share on X",
            icon: IconBrandX,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
        },
        {
            name: "Share on LinkedIn",
            icon: IconBrandLinkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
        },
        {
            name: "Share on Facebook",
            icon: IconBrandFacebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        },
    ];

    const copyToClipboard = () => {
        if (!currentUrl) return;
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Share this article
            </p>
            <TooltipProvider delayDuration={200}>
                <div className="flex flex-row flex-wrap gap-3">
                    {shareLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Tooltip key={link.name}>
                                <TooltipTrigger asChild>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group w-fit rounded-full border border-border/50 bg-muted/50 p-2.5 text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                                        aria-label={link.name}
                                    >
                                        <Icon className="size-5" stroke={1.5} />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>{link.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={copyToClipboard}
                                className="group w-fit cursor-pointer rounded-full border border-border/50 bg-muted/50 p-2.5 text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                                aria-label="Copy link"
                            >
                                {copied ? (
                                    <IconCheck
                                        className="size-5 text-green-500"
                                        stroke={1.5}
                                    />
                                ) : (
                                    <IconLink className="size-5" stroke={1.5} />
                                )}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p>{copied ? "Copied!" : "Copy link"}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}
