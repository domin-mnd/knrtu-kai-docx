import {
  AlignmentType,
  type IParagraphOptions,
  Paragraph as DOCXParagraph,
  type ParagraphChild,
  convertInchesToTwip,
} from "docx";

export const Paragraph = (
  children: ParagraphChild[],
  options?: IParagraphOptions,
) =>
  new DOCXParagraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: {
      firstLine: "1.25cm",
    },
    spacing: {
      line: convertInchesToTwip(0.25),
    },
    children,
    ...options,
  });
