import { numbering } from "@/components/list";
import {
  AlignmentType,
  Document as DOCXDocument,
  Footer,
  NumberFormat,
  PageNumber,
  Paragraph,
  TextRun,
} from "docx";
import type { IPropertiesOptions } from "docx/build/file/core-properties";
import type { FileChild } from "docx/build/file/file-child";

export const Document = (
  children: FileChild[],
  documentOptions?: Partial<IPropertiesOptions>,
) =>
  new DOCXDocument({
    numbering,
    ...documentOptions,
    sections: [
      {
        properties: {
          titlePage: true,
          page: {
            margin: {
              left: "3cm",
              right: "1cm",
              top: "1cm",
              bottom: "1cm",
            },
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Times New Roman",
                    size: "14pt",
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
