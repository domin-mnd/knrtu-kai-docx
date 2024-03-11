import { compile } from "@/parser/compile";
import { trace } from "@/parser/debug";
import { startProcess, stopProcesses } from "@/utils/process";
import { ask } from "@/utils/readline";

export async function main() {
  const { input, output } = await ask();

  const runningProcessesExist = stopProcesses(output);
  await compile(input, output);
  await trace(input);

  if (!runningProcessesExist) return;
  console.info(`Пытаюсь снова открыть "${output}"...`);
  startProcess(output);
}

main();
