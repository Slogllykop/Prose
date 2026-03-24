import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/blog";
import { EXAMPLE_SLUG, SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
    const blogs = getAllBlogs();

    const blogEntries: MetadataRoute.Sitemap = blogs
        .filter((blog) => blog.slug !== EXAMPLE_SLUG)
        .map((blog) => ({
            url: `${SITE_URL}/${blog.slug}`,
            lastModified: new Date(blog.updated || blog.date),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1.0,
        },
        ...blogEntries,
    ];
}
