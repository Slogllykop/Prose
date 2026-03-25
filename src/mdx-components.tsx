import type { MDXComponents } from "mdx/types";
import { BlogImage } from "@/components/blog-image";
import { CollapsibleCodeBlock } from "@/components/collapsible-code-block";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        a: (props) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
        ),
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
        pre: (props) => <CollapsibleCodeBlock {...props} />,
        img: (props) => (
            <BlogImage
                src={(props.src as string) || ""}
                alt={(props.alt as string) || ""}
                {...props}
            />
        ),
        BlogImage,
        table: ({
            className,
            ...props
        }: React.HTMLAttributes<HTMLTableElement>) => (
            <div className="w-fit max-w-full overflow-x-auto rounded-lg border border-border">
                <table
                    className={`my-0! w-max text-sm ${className || ""}`}
                    {...props}
                />
            </div>
        ),
        thead: ({
            className,
            ...props
        }: React.HTMLAttributes<HTMLTableSectionElement>) => (
            <thead className={`bg-muted/50 ${className || ""}`} {...props} />
        ),
        tr: ({
            className,
            ...props
        }: React.HTMLAttributes<HTMLTableRowElement>) => (
            <tr
                className={`m-0 border-border border-b p-0 last:border-b-0 even:bg-muted/20 ${className || ""}`}
                {...props}
            />
        ),
        th: ({
            className,
            ...props
        }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
            <th
                className={`border-border border-r px-4 py-3 text-left font-medium last:border-r-0 [[align=center]]:text-center [[align=right]]:text-right ${className || ""}`}
                {...props}
            />
        ),
        td: ({
            className,
            ...props
        }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
            <td
                className={`border-border border-r px-4 py-3 text-left last:border-r-0 [[align=center]]:text-center [[align=right]]:text-right ${className || ""}`}
                {...props}
            />
        ),
    };
}
