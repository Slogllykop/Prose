import { ImageResponse } from "next/og";
import { getBlogBySlug } from "@/lib/blog";
import { AUTHOR_NAME } from "@/lib/constants";
import { getPublicFileAsBase64 } from "@/lib/og-utils";

export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;
    const blog = getBlogBySlug(slug);
    const title = blog?.title || "Blog Post";

    const logoSrc = getPublicFileAsBase64("logo.png");
    const profileSrc = getPublicFileAsBase64("profile.png");

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000000",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle curvy background lines */}
            <svg
                width="1200"
                height="630"
                viewBox="0 0 1200 630"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
            >
                <title>Background decoration</title>
                <path
                    d="M0 200 Q300 100 600 250 T1200 180"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1.5"
                    fill="none"
                />
                <path
                    d="M0 350 Q400 280 700 400 T1200 320"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="1.5"
                    fill="none"
                />
                <path
                    d="M0 500 Q250 430 500 520 T1200 460"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1.5"
                    fill="none"
                />
                <path
                    d="M0 100 Q350 50 650 130 T1200 80"
                    stroke="rgba(255,255,255,0.025)"
                    strokeWidth="1"
                    fill="none"
                />
                <path
                    d="M0 550 Q300 600 600 530 T1200 580"
                    stroke="rgba(255,255,255,0.025)"
                    strokeWidth="1"
                    fill="none"
                />
            </svg>

            {/* Logo top-left */}
            {/* biome-ignore lint/performance/noImgElement: next/og operates on Satori which requires native img */}
            <img
                src={logoSrc}
                alt=""
                width={48}
                height={48}
                style={{
                    position: "absolute",
                    top: 32,
                    left: 40,
                    borderRadius: 8,
                }}
            />

            {/* Center content */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 20,
                    maxWidth: 900,
                    padding: "0 40px",
                }}
            >
                {/* Profile image */}
                {/* biome-ignore lint/performance/noImgElement: next/og operates on Satori which requires native img */}
                <img
                    src={profileSrc}
                    alt=""
                    width={80}
                    height={80}
                    style={{
                        borderRadius: "50%",
                        border: "3px solid rgba(255,255,255,0.15)",
                    }}
                />

                {/* Author name */}
                <div
                    style={{
                        color: "#ffffff",
                        fontSize: 32,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {AUTHOR_NAME}
                </div>

                {/* Blog title as subheading */}
                <div
                    style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 24,
                        fontWeight: 400,
                        textAlign: "center",
                        lineHeight: 1.4,
                        letterSpacing: "0.01em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {title}
                </div>
            </div>

            {/* Bottom-right branding */}
            <div
                style={{
                    position: "absolute",
                    bottom: 32,
                    right: 40,
                    color: "rgba(255,255,255,0.25)",
                    fontSize: 16,
                    fontWeight: 500,
                }}
            >
                blog.isdevs.cv
            </div>
        </div>,
        { ...size },
    );
}
