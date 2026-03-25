import fs from "node:fs";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import { resolveSlugToFolder } from "@/lib/blog";

const BLOGS_DIR = path.join(process.cwd(), "src", "blogs");

const MIME_TYPES: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".gif": "image/gif",
};

export async function GET(
    _request: NextRequest,
    props: { params: Promise<{ path: string[] }> },
) {
    const { path: segments } = await props.params;

    // The first segment is the blog slug; resolve it to the actual folder name
    const [slugOrFolder, ...rest] = segments;
    const folderName = resolveSlugToFolder(slugOrFolder) || slugOrFolder;

    const filePath = path.join(BLOGS_DIR, folderName, ...rest);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext];

    if (!mimeType) {
        return NextResponse.json(
            { error: "Unsupported format" },
            { status: 400 },
        );
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}
