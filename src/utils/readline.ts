import { createInterface } from "node:readline/promises";

export async function askPath() {
  // Lots of boilerplate smh
  const readline = createInterface(process.stdin, process.stdout);
  const answer = await readline.question("Укажите путь к файлу: ");
  readline.close();
  return answer;
}
