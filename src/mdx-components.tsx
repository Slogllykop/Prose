import type { MDXComponents } from "mdx/types";
import { CopyButton } from "@/components/copy-button";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        h1: (props) => (
            <h1
                className="mt-2 scroll-m-20 font-bold text-4xl tracking-tight"
                {...props}
            />
        ),
        h2: (props) => (
            <h2
                className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0"
                {...props}
            />
        ),
        h3: (props) => (
            <h3
                className="mt-8 scroll-m-20 font-semibold text-2xl tracking-tight"
                {...props}
            />
        ),
        h4: (props) => (
            <h4
                className="mt-8 scroll-m-20 font-semibold text-xl tracking-tight"
                {...props}
            />
        ),
        h5: (props) => (
            <h5
                className="mt-8 scroll-m-20 font-semibold text-lg tracking-tight"
                {...props}
            />
        ),
        h6: (props) => (
            <h6
                className="mt-8 scroll-m-20 font-semibold text-base tracking-tight"
                {...props}
            />
        ),
        pre: (props) => (
            <div className="group relative my-4">
                <pre {...props} className={`${props.className || ""} m-0`} />
                <CopyButton />
            </div>
        ),
    };
}
