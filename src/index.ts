import { existsSync } from "node:fs";
import { compile } from "@/parser/compile";
import { trace } from "@/parser/debug";
import { throwError } from "@/utils/error";
import {
  markdownPathToDocx,
  startProcess,
  stopProcesses,
} from "@/utils/process";
import { askPath } from "@/utils/readline";

export async function main(path?: string) {
  if (!path) path = await askPath();
  if (!existsSync(path)) throwError(`Путь "${path}" не существует!`);

  const docxPath = markdownPathToDocx(path);
  const closedProcess = stopProcesses(docxPath);

  await compile(path);
  await trace(path);

  if (!closedProcess) return;
  console.info(`Пытаюсь снова открыть "${docxPath}"...`);
  startProcess(docxPath);
}

main();
