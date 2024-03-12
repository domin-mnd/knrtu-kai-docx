import { text } from "@/components/text";
import {
  AlignmentType,
  HeadingLevel,
  type IRunOptions,
  Paragraph,
  type ParagraphChild,
  TextRun,
  convertInchesToTwip,
} from "docx";

export const heading: IRunOptions = {
  ...text,
  size: "16pt",
  color: "000000",
  bold: true,
};

export const HeadingLabel = (options: IRunOptions) =>
  new TextRun({
    ...heading,
    ...options,
  });

export const Heading = (children: ParagraphChild[]) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    heading: HeadingLevel.HEADING_6,
    spacing: {
      line: convertInchesToTwip(0.25),
    },
    children,
  });
