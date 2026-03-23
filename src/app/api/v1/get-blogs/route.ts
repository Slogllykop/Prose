import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAllBlogs } from "@/lib/blog";

let cachedResponse: Array<{
    title: string;
    description: string;
    mins_required: number;
    date_uploaded: string;
    date_updated: string;
}> | null = null;
let lastKnownMaxMtime = 0;

/**
 * Gets the most recent modification time among the blogs directory
 * and its MDX files.
 */
function getMaxMtime(dir: string): number {
    let maxTime = 0;
    if (!fs.existsSync(dir)) return 0;

    // Check main dir
    const stats = fs.statSync(dir);
    maxTime = Math.max(maxTime, stats.mtimeMs);

    // Check subdirs safely
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory()) {
                const itemPath = path.join(dir, item.name);
                const itemStats = fs.statSync(itemPath);
                maxTime = Math.max(maxTime, itemStats.mtimeMs);

                // Check contents of blog folder
                const subItems = fs.readdirSync(itemPath, {
                    withFileTypes: true,
                });
                for (const subItem of subItems) {
                    if (subItem.isFile() && subItem.name.endsWith(".mdx")) {
                        const subItemPath = path.join(itemPath, subItem.name);
                        const subItemStats = fs.statSync(subItemPath);
                        maxTime = Math.max(maxTime, subItemStats.mtimeMs);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error reading directory stats:", error);
    }

    return maxTime;
}

export async function GET() {
    try {
        const BLOGS_DIR = path.join(process.cwd(), "src", "blogs");
        const currentMaxMtime = getMaxMtime(BLOGS_DIR);

        // Return cache if it exists and no files have been modified
        if (cachedResponse && currentMaxMtime === lastKnownMaxMtime) {
            return NextResponse.json(cachedResponse, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control":
                        "public, s-maxage=60, stale-while-revalidate=300",
                },
            });
        }

        // Cache miss or files changed, re-analyze
        const blogs = getAllBlogs();

        const responseData = blogs
            .map((blog) => ({
                title: blog.title,
                description: blog.description,
                mins_required: blog.readingTime,
                date_uploaded: blog.date,
                date_updated: blog.updated,
            }))
            .sort(
                (a, b) =>
                    new Date(b.date_updated).getTime() -
                    new Date(a.date_updated).getTime(),
            );

        // Update cache
        cachedResponse = responseData;
        lastKnownMaxMtime = currentMaxMtime;

        return NextResponse.json(responseData, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control":
                    "public, s-maxage=60, stale-while-revalidate=300",
            },
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
