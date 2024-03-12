import { Paragraph } from "@/components/paragraph";
import { Text } from "@/components/text";
import { capitalize } from "@/parser/string";
import { AlignmentType, PageBreak, TextRun } from "docx";

export interface FullName {
  first: string;
  middle: string;
  last: string;
}

export interface TitlePageOptions {
  number: number;
  subject: string;
  title: string;
  group: number;
  student: FullName;
  professor: FullName;
}

function getLastNameWithInitials(name: FullName) {
  return `${capitalize(name.last)} ${capitalize(
    name.first.charAt(0),
  )}. ${capitalize(name.middle.charAt(0))}.`;
}

export function normalizeNewLines(text: string): TextRun[] {
  return text
    .split("\n")
    .map((line, index) => Text({ break: +!!index, text: line }));
}

export function LabTitlePage(options: TitlePageOptions) {
  const centered = `МИНИСТЕРСТВО НАУКИ И ВЫСШЕГО ОБРАЗОВАНИЯ РОССИЙСКОЙ ФЕДЕРАЦИИ
Федеральное государственное бюджетное образовательное учреждение высшего образования
«Казанский национальный исследовательский технический университет
им. А. Н. Туполева – КАИ»
Институт компьютерных технологий и защиты информации
Отделение СПО ИКТЗИ (Колледж информационных технологий)



ЛАБОРАТОРНАЯ РАБОТА №${options.number}
по дисциплине

${options.subject}


Тема: «${options.title}»`;

  // New lines depending on the length of title
  // Title shifts to new line if it's longer than 60 characters
  const newLineCount = 2 - Math.floor(options.title.length / 60);
  const newLines = "\n".repeat(newLineCount > 0 ? newLineCount : 0);

  const right = `${newLines}Работу выполнил
Студент гр. ${options.group}
${getLastNameWithInitials(options.student)}

Принял
Преподаватель ${getLastNameWithInitials(options.professor)}




`;
  const label = `Казань ${new Date().getFullYear()}`;
  return [
    Paragraph(normalizeNewLines(centered), {
      indent: {
        firstLine: 0,
      },
      alignment: AlignmentType.CENTER,
    }),
    Paragraph(normalizeNewLines(right), {
      indent: {
        firstLine: 0,
      },
      alignment: AlignmentType.END,
    }),
    Paragraph([...normalizeNewLines(label), new PageBreak()], {
      indent: {
        firstLine: 0,
      },
      alignment: AlignmentType.CENTER,
    }),
  ];
}
