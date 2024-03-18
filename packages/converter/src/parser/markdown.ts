import { join } from "node:path";
import { Document } from "@/components/document";
import { Heading, HeadingLabel } from "@/components/heading";
import { InlineCode, inlineCode } from "@/components/inlineCode";
import { Link } from "@/components/link";
import { ListStyleType } from "@/components/list";
import { Paragraph } from "@/components/paragraph";
import {
  Picture,
  PictureLabel,
  pictureParagraph,
} from "@/components/picture";
import { Text } from "@/components/text";
import {
  type FullName,
  LabTitlePage,
  type TitlePageOptions,
} from "@/components/titlePage";
import {
  AlignmentType,
  Document as DOCXDocument,
  ExternalHyperlink,
  type IParagraphOptions,
  ImageRun,
  PageBreak,
  Paragraph as DOCXParagraph,
  TextRun,
} from "docx";
import type {
  Code as ICode,
  Heading as IHeading,
  Html as IHtml,
  Image as IImage,
  InlineCode as IInlineCode,
  Link as ILink,
  List as IList,
  ListItem as IListItem,
  Paragraph as IParagraph,
  Root,
  RootContent,
  Text as IText,
  ThematicBreak as IThematicBreak,
} from "mdast";
import { parse as yamlParse } from "yaml";

// Tree usually looks something like:
// list -> listItem -> paragraph -> link /> image / text / inlineCode
// thematicBreak
// list -> listItem -> list -> listItem -> paragraph -> link /> image / text / inlineCode
// blockquote -> paragraph -> link /> image / text / inlineCode
// heading -> text

/** Paragraph configuration for either image or list parsing. */
let paragraphOptions: IParagraphOptions = {};

function paragraphOptionsClear() {
  const temp = Object.assign({}, paragraphOptions);
  paragraphOptions = {};
  return temp;
}

function isOfType(
  elements: RootContent[] | RootContent,
  type: RootContent["type"][],
) {
  if (Array.isArray(elements))
    return elements.every(element => type.includes(element.type));
  return type.includes(elements.type);
}

let cwd: string = "";
function parseImage(element: IImage): (ImageRun | TextRun)[] {
  if (!isOfType(element, ["image"])) return [];
  paragraphOptions = pictureParagraph;
  return [
    Picture(join(cwd, decodeURIComponent(element.url))),
    PictureLabel(element.alt ?? "Изображение"),
  ];
}

function parseText(element: IText): TextRun[] {
  if (!isOfType(element, ["text"])) return [];
  return [
    Text({
      text: element.value,
    }),
  ];
}

function parseInlineCode(element: IInlineCode): TextRun[] {
  if (!isOfType(element, ["inlineCode"])) return [];
  return [
    InlineCode({
      text: element.value,
    }),
  ];
}

function parseLink(element: ILink): ExternalHyperlink[] {
  const leaves: Leaf[] = element.children as Leaf[];
  if (
    !isOfType(element, ["link"]) ||
    !isOfType(leaves, ["text", "image", "inlineCode"])
  )
    return [] as ExternalHyperlink[];
  return [
    Link(element.url, {
      children: leaves.flatMap<ParsedLeaf>(parseLeaf),
    }),
  ];
}

function parseHeadingLabel(element: IText) {
  if (!isOfType(element, ["text"])) return [];
  return [
    HeadingLabel({
      text: element.value,
    }),
  ];
}

function parseParagraph(element: IParagraph) {
  const leaves: Leaf[] = element.children as Leaf[];
  if (
    !isOfType(element, ["paragraph"]) ||
    !isOfType(leaves, ["text", "image", "inlineCode", "link"])
  )
    return [];
  return [
    Paragraph(
      leaves.flatMap<ParsedLeaf>(parseLeaf),
      paragraphOptionsClear(),
    ),
  ];
}

function parseHeading(element: IHeading) {
  const leaves: IText[] = element.children as IText[];
  if (!isOfType(element, ["heading"]) || !isOfType(leaves, ["text"]))
    return [];
  return [Heading(leaves.flatMap<TextRun>(parseHeadingLabel))];
}

function parseHtml(_element: IHtml) {
  /** @todo Somehow add html support? */
  return [];
}

function parseCode(element: ICode): TextRun[] {
  if (!isOfType(element, ["code"])) return [];
  const codeLines = element.value.split("\n");
  return [
    InlineCode({
      children: codeLines.map(
        (line, index) =>
          // +!! - Converting index to boolean then to either 1 or 0
          // That way we're avoiding first break line
          new TextRun({ ...inlineCode, break: +!!index, text: line }),
      ),
    }),
  ];
}

type ListChildren = IParagraph | IList;
function parseListItem(
  element: IListItem,
  listLevel: number,
  ordered: boolean,
): DOCXParagraph[] {
  if (!isOfType(element, ["listItem"])) return [];
  const leaves: ListChildren[] = element.children as ListChildren[];
  if (!isOfType(leaves, ["paragraph", "list"])) return [];

  return leaves.flatMap(element => {
    switch (element.type) {
      case "paragraph":
        paragraphOptions = {
          ...paragraphOptions,
          indent: {
            firstLine: 0,
          },
          numbering: {
            reference: ordered
              ? ListStyleType.Ordered
              : ListStyleType.Unordered,
            level: listLevel,
          },
        };
        return parseParagraph(element);
      case "list":
        return parseList(element, listLevel + 1);
    }
  });
}

function parseList(
  element: IList,
  listLevel: number,
): DOCXParagraph[] {
  if (!isOfType(element, ["list"])) return [];
  const leaves = element.children;
  if (!isOfType(leaves, ["listItem"])) return [];
  return leaves.flatMap(el =>
    parseListItem(el, listLevel, element.ordered ?? false),
  );
}

function parseThematicBreak(_element: IThematicBreak) {
  return [new PageBreak()];
}

type Leaf = IText | IImage | IInlineCode | ILink;
type ParsedLeaf =
  | TextRun
  | DOCXParagraph
  | ImageRun
  | ExternalHyperlink;
function parseLeaf(element: Leaf) {
  switch (element.type) {
    case "image":
      return parseImage(element);
    case "text":
      return parseText(element);
    case "inlineCode":
      return parseInlineCode(element);
    case "link":
      return parseLink(element);
  }
}

function parseRoot(element: RootContent) {
  switch (element.type) {
    case "paragraph":
      return parseParagraph(element);
    case "heading":
      return parseHeading(element);
    case "code":
      return Paragraph(parseCode(element), {
        indent: {
          firstLine: 0,
        },
        alignment: AlignmentType.LEFT,
      });
    case "html":
      return parseHtml(element);
    case "list":
      return parseList(element, 0);
    case "thematicBreak":
      return Paragraph(parseThematicBreak(element));
    case "yaml":
      titlePageOptions = {
        ...titlePageOptions,
        ...yamlParse(element.value),
      };
    default:
      return [];
  }
}

interface PseudoOptions {
  номер?: number;
  дисциплина?: string;
  тема?: string;
  группа?: number;
  студент?: string;
  преподаватель?: string;
}

function parseFullname(name: string): FullName {
  const parts = name.split(" ");
  return {
    last: parts[0]?.length ? parts[0] : "Иванов",
    first: parts[1]?.length ? parts[1] : "Иван",
    middle: parts[2]?.length ? parts[2] : "Иванович",
  };
}

function parseOptions(options: PseudoOptions): TitlePageOptions {
  return {
    number: options?.номер ?? 1,
    subject: options?.дисциплина ?? "Неизвестная дисциплина",
    title: options?.тема ?? "Неизвестная тема",
    group: options?.группа ?? 4233,
    student: parseFullname(options?.студент ?? ""),
    professor: parseFullname(options?.преподаватель ?? ""),
  };
}

export interface ParseOptions {
  cwd: string;
}

let titlePageOptions: PseudoOptions = {};
export function parse(
  tree: Root,
  options: ParseOptions,
): DOCXDocument {
  // Current working directory option validation
  if (!options.cwd) throw "No CWD found";
  cwd = options.cwd;

  const xmlElements = tree.children.flatMap(parseRoot);
  if (Object.keys(titlePageOptions).length)
    xmlElements.unshift(
      ...LabTitlePage(parseOptions(titlePageOptions)),
    );

  if (!titlePageOptions.студент) return Document(xmlElements);

  const student = parseFullname(titlePageOptions.студент),
    author = `${student.first} ${student.last}`;
  return Document(xmlElements, {
    creator: author,
    lastModifiedBy: author,
  });
}
