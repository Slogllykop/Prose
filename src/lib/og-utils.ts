import fs from "node:fs";
import path from "node:path";

/**
 * Reads a file from the public directory and returns it as a base64 data URI.
 */
export function getPublicFileAsBase64(filePath: string): string {
    const absolutePath = path.join(process.cwd(), "public", filePath);
    const buffer = fs.readFileSync(absolutePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const mimeMap: Record<string, string> = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        webp: "image/webp",
        svg: "image/svg+xml",
    };
    const mime = mimeMap[ext] || "image/png";
    return `data:${mime};base64,${buffer.toString("base64")}`;
}
