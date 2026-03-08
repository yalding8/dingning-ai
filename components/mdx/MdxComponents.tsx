import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  table: Table,
};
