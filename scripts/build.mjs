import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
let commit = args.find((argument) => !argument.startsWith("--")) ?? "";

for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];

  if (argument === "--commit") {
    commit = args[index + 1] ?? "";
    index += 1;
  } else if (argument.startsWith("--commit=")) {
    commit = argument.slice("--commit=".length);
  }
}

if (commit && !/^[0-9a-f]{7,40}$/i.test(commit)) {
  console.error("Commit hash must contain 7 to 40 hexadecimal characters.");
  process.exit(1);
}

const astro = fileURLToPath(
  new URL("../node_modules/astro/bin/astro.mjs", import.meta.url),
);
const child = spawn(process.execPath, [astro, "build"], {
  env: {
    ...process.env,
    PUBLIC_GIT_COMMIT: commit.slice(0, 7).toLowerCase(),
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
