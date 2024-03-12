import { Text } from "@/components/text";
import { ExternalHyperlink, type IRunOptions } from "docx";

export const link: IRunOptions = {
  style: "Hyperlink",
};

export const Link = (url: string, options: IRunOptions) =>
  new ExternalHyperlink({
    link: url,
    children: [
      Text({
        ...link,
        ...options,
      }),
    ],
  });
