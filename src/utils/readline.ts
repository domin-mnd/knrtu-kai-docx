import { createInterface } from "node:readline/promises";

export async function input(query: string) {
  // Lots of boilerplate smh
  const readline = createInterface(process.stdin, process.stdout);
  const answer = await readline.question(query);
  readline.close();
  return answer;
}

export async function ask() {
  return {
    input: await input("Укажите путь к markdown файлу: "),
    output: await input("Укажите путь для docx файла: "),
  };
}
