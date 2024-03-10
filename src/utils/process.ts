import { execSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename } from "node:path";

export function markdownPathToDocx(path: string) {
  return `./output/${path.replace(/\.md$/g, "")}.docx`;
}

/**
 * Windows only utility to check if docx process exists.
 * @todo Add support for every platform.
 */
export function processExists(path: string) {
  if (process.platform !== "win32") return;
  const { stdout } = spawnSync("tasklist", [
    "/FI",
    `WindowTitle eq ${basename(path)}*`,
  ]);
  return !stdout
    ?.toString()
    .includes(
      "INFO: No tasks are running which match the specified criteria.",
    );
}

/**
 * Windows only utility to stop running docx processes.
 * @todo Add support for every platform.
 */
export function stopProcesses(path: string) {
  if (process.platform !== "win32") return false;
  if (!processExists(path)) return false;
  console.info(
    `Найден открытый файл "${path}" для перезаписи, закрываю...`,
  );
  execSync(`taskkill /FI "WindowTitle eq ${basename(path)}*" /T /F`);
  return true;
}

/**
 * Windows only utility to view docx.
 * @todo Add support for every platform.
 */
export function startProcess(path: string) {
  if (process.platform !== "win32") return;
  if (!existsSync(path))
    return console.error(`Путь "${path}" не существует!`);
  console.info(`Открытие файла "${path}"...`);
  execSync(`start ${path}`);
}
