import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    reactCompiler: true,
    output: "standalone",
    images: {
        formats: ["image/avif", "image/webp"],
    },
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [
            "remark-gfm",
            "remark-frontmatter",
            "remark-mdx-frontmatter",
        ],
        rehypePlugins: [
            [
                "@shikijs/rehype",
                { themes: { dark: "github-dark", light: "github-light" } },
            ],
        ],
    },
});

export default withMDX(nextConfig);
