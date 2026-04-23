import Image from "next/image";
import Link from "next/link";
import {
    AUTHOR_DESCRIPTION,
    AUTHOR_IMAGE,
    AUTHOR_NAME,
    AUTHOR_URL,
} from "@/lib/constants";

export function AuthorCard() {
    return (
        <div className="flex flex-col gap-4">
            <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Written by
            </p>
            <div className="flex flex-col gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-full border border-border bg-muted">
                    <Image
                        src={AUTHOR_IMAGE}
                        alt={AUTHOR_NAME}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-base text-foreground">
                        <Link
                            href={AUTHOR_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            {AUTHOR_NAME}
                        </Link>
                    </h3>
                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                        {AUTHOR_DESCRIPTION}
                    </p>
                </div>
            </div>
        </div>
    );
}
