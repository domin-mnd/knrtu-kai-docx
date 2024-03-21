import { readFileSync } from "fs";
import { text } from "@/components/text";
import { documentWidth } from "@/utils/document";
import {
  AlignmentType,
  type IParagraphOptions,
  type IRunOptions,
  ImageRun,
  TextRun,
  convertInchesToTwip,
} from "docx";
import { type ImageMeta, imageMeta } from "image-meta";

interface Data extends ImageMeta {
  data: Buffer;
}

interface Source {
  width: number;
  height: number;
}

export const label: IRunOptions = {
  ...text,
  break: 1,
  size: "12pt",
};

export let counter = 1;

export function getFit(meta: Source, target: Source): Source {
  const ratio = meta.width / meta.height;

  let width: number, height: number;
  const targetRatio = target.width / target.height;

  if (targetRatio > ratio) {
    height = target.height;
    width = height * ratio;
  } else {
    width = target.width;
    height = width / ratio;
  }
  return {
    width,
    height,
  };
}

export function getData(url: string): Data {
  const imageBuffer = readFileSync(url);
  const meta = imageMeta(imageBuffer);
  return {
    data: imageBuffer,
    ...meta,
  };
}

export const resetCounter = () => (counter = 1);

export const PictureLabel = (text: string) =>
  new TextRun({
    ...label,
    text: `Рисунок ${counter++} – ${text}`,
  });

export const pictureParagraph: IParagraphOptions = {
  alignment: AlignmentType.CENTER,
  keepLines: true,
  spacing: {
    line: convertInchesToTwip(0.25),
  },
  indent: {
    firstLine: 0,
  },
};

export const Picture = (url: string) => {
  const { data, width, height } = getData(url);
  const { width: fitWidth, height: fitHeight } = getFit(
    { width: width ?? 1, height: height ?? 1 },
    { width: documentWidth, height: documentWidth / 2 },
  );

  return new ImageRun({
    data,
    transformation: {
      width: fitWidth,
      height: fitHeight,
    },
  });
};
