import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_TITLE,
        short_name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#ffde42",
        icons: [
            {
                src: "/icon.png",
                sizes: "192x192",
                type: "image/png",
            },
        ],
    };
}
