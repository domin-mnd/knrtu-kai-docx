import { type IRunOptions, TextRun } from "docx";

export const text: IRunOptions = {
  font: "Times New Roman",
  size: "14pt",
};

export const Text = (options: IRunOptions) =>
  new TextRun({
    ...text,
    ...options,
  });
