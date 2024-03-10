import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";
import { processor } from "@/parser/processor";

export async function trace(
  markdownPath: string,
  jsonPath: string = `./output/${markdownPath.replace(
    /\.md$/g,
    "",
  )}.json`,
) {
  const data = readFileSync(markdownPath),
    tree = processor.parse(data.toString());
  const dir = dirname(jsonPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(jsonPath, JSON.stringify(tree, null, 2));
}
