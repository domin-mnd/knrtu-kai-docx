import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";
import { parse } from "@/parser/markdown";
import { processor } from "@/parser/processor";
import { Packer } from "docx";

export async function convert(
  markdownPath: string,
  docxPath: string,
) {
  const data = readFileSync(markdownPath),
    tree = processor.parse(data.toString()),
    document = parse(tree);
  const dir = dirname(docxPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(docxPath, await Packer.toBuffer(document));
}
