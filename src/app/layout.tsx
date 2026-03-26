import type { Metadata, Viewport } from "next";
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
export const viewport: Viewport = {
    themeColor: "#ffde42",
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_TITLE} | ${AUTHOR_NAME}`,
        template: `%s | ${SITE_TITLE}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SEO_KEYWORDS,
    applicationName: SITE_TITLE,
    appleWebApp: {
        title: SITE_TITLE,
    },
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
        site: `@${SITE_TITLE}`,
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
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon.png", type: "image/png", sizes: "32x32" },
            { url: "/icon.png", type: "image/png", sizes: "48x48" },
            { url: "/icon.png", type: "image/png", sizes: "96x96" },
            { url: "/icon.png", type: "image/png", sizes: "144x144" },
            { url: "/icon.png", type: "image/png", sizes: "192x192" },
        ],
        apple: [
            { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
        ],
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
                <a href="#main-content" className="skip-link">
                    Skip to content
                </a>
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
