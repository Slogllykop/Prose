import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
    AUTHOR_NAME,
    AUTHOR_TITLE,
    AUTHOR_URL,
    SEO_KEYWORDS,
    SITE_DESCRIPTION,
    SITE_TITLE,
    SITE_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_TITLE} | ${AUTHOR_NAME}`,
        template: `%s | ${SITE_TITLE}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SEO_KEYWORDS,
    authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
    creator: AUTHOR_NAME,
    publisher: AUTHOR_NAME,
    alternates: {
        canonical: SITE_URL,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        siteName: SITE_TITLE,
        title: `${SITE_TITLE} | ${AUTHOR_NAME} - ${AUTHOR_TITLE}`,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_TITLE} | ${AUTHOR_NAME}`,
        description: SITE_DESCRIPTION,
        creator: `@${AUTHOR_NAME.replace(/\s+/g, "")}`,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={cn("h-full", "antialiased", "font-sans", inter.variable)}
        >
            <body className="flex min-h-full flex-col">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
