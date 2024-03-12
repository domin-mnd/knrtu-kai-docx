import { type IRunOptions, TextRun } from "docx";

export const inlineCode: IRunOptions = {
  font: "Consolas",
  size: "14pt",
};

export const InlineCode = (options: IRunOptions) =>
  new TextRun({
    ...inlineCode,
    ...options,
  });
