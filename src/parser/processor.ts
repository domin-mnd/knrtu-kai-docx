import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import { unified } from "unified";

export const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter);
