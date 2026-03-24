"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" aria-label="Toggle theme">
                <IconSun className="size-5" aria-hidden="true" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
        >
            {resolvedTheme === "dark" ? (
                <IconSun className="size-5" aria-hidden="true" />
            ) : (
                <IconMoon className="size-5" aria-hidden="true" />
            )}
        </Button>
    );
}
