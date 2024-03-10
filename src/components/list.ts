import { text } from "@/components/text";
import {
  AlignmentType,
  type ILevelsOptions,
  type INumberingOptions,
  LevelFormat,
  convertInchesToTwip,
} from "docx";

interface ListStyle {
  reference: string;
  levels: ILevelsOptions[];
}

const orderedPart = (level: number): ILevelsOptions[] => [
  {
    level: 0 + level,
    format: LevelFormat.DECIMAL,
    text: `%${1 + level}.`,
    alignment: AlignmentType.START,
    style: {
      paragraph: {
        indent: {
          left: convertInchesToTwip(0 + level * 0.5),
          hanging: convertInchesToTwip(0.18),
        },
      },
      run: text,
    },
  },
  {
    level: 1 + level,
    format: LevelFormat.LOWER_LETTER,
    text: `%${2 + level}.`,
    alignment: AlignmentType.START,
    style: {
      paragraph: {
        indent: {
          left: convertInchesToTwip(0.5 + level * 0.5),
          hanging: convertInchesToTwip(0.68),
        },
      },
      run: text,
    },
  },
  {
    level: 2 + level,
    format: LevelFormat.LOWER_ROMAN,
    text: `%${3 + level}.`,
    alignment: AlignmentType.START,
    style: {
      paragraph: {
        indent: {
          left: convertInchesToTwip(1.0 + level * 0.5),
          hanging: convertInchesToTwip(1.18),
        },
      },
      run: text,
    },
  },
];

const ordered: ListStyle = {
  reference: "ordered",
  levels: [...orderedPart(0), ...orderedPart(3), ...orderedPart(6)],
};

const unorderedPart = (level: number): ILevelsOptions[] => [
  {
    level: 0 + level,
    format: LevelFormat.BULLET,
    text: "·",
    alignment: AlignmentType.START,
    style: {
      paragraph: {
        indent: {
          left: convertInchesToTwip(0 + level * 0.5),
          hanging: convertInchesToTwip(0.18),
        },
      },
      run: {
        ...text,
        font: "Symbol",
      },
    },
  },
  {
    level: 1 + level,
    format: LevelFormat.BULLET,
    text: "\u006F",
    alignment: AlignmentType.START,
    style: {
      paragraph: {
        indent: {
          left: convertInchesToTwip(0.5 + level * 0.5),
          hanging: convertInchesToTwip(0.68),
        },
      },
      run: {
        ...text,
        font: "Courier New",
      },
    },
  },
  {
    level: 2 + level,
    format: LevelFormat.BULLET,
    text: "§",
    alignment: AlignmentType.START,
    style: {
      paragraph: {
        indent: {
          left: convertInchesToTwip(1.0 + level * 0.5),
          hanging: convertInchesToTwip(1.18),
        },
      },
      run: {
        ...text,
        font: "Wingdings",
      },
    },
  },
];

const unordered: ListStyle = {
  reference: "unordered",
  levels: [
    ...unorderedPart(0),
    ...unorderedPart(3),
    ...unorderedPart(6),
  ],
};

export enum ListStyleType {
  Ordered = "ordered",
  Unordered = "unordered",
}

export const numbering: INumberingOptions = {
  config: [ordered, unordered],
};
