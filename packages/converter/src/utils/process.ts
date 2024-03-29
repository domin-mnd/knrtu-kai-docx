import { execSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename } from "node:path";

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
  execSync(`taskkill /FI "WindowTitle eq ${basename(path)}*" /T /F`);
  return true;
}

/**
 * Windows only utility to view docx.
 * @todo Add support for every platform.
 */
export function startProcess(path: string) {
  if (process.platform !== "win32") return;
  if (!existsSync(path)) return;
  execSync(`start ${path}`);
}
