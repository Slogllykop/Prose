const fs = require("node:fs");
const path = require("node:path");

const blogsDir = path.join(__dirname, "..", "src", "blogs");

if (!fs.existsSync(blogsDir)) {
    console.log("The blogs directory does not exist.");
    process.exit(0);
}

const entries = fs.readdirSync(blogsDir, { withFileTypes: true });

for (const entry of entries) {
    if (entry.name !== "example") {
        const fullPath = path.join(blogsDir, entry.name);
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`Deleted folder or file: ${entry.name}`);
    }
}

console.log(
    "Cleanup complete. All blogs except the example blog have been deleted.",
);
