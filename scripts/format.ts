import * as fs from "fs";
import * as path from "path";

export { skillClass, checkClass, transformLine } from "../app/src/core/transform";
import { transformLine } from "../app/src/core/transform";

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    process.stderr.write("Usage: ts-node format.ts <input.html>\n");
    process.exit(1);
  }

  const absInput = path.resolve(inputPath);
  if (!fs.existsSync(absInput)) {
    process.stderr.write(`File not found: ${absInput}\n`);
    process.exit(1);
  }

  const raw = fs.readFileSync(absInput, "utf8");
  const lines = raw.split("\n");
  const out = lines.map(transformLine).join("\n");

  const ext = path.extname(absInput);
  const base = absInput.slice(0, -ext.length);
  const outputPath = `${base}.formatted${ext}`;

  fs.writeFileSync(outputPath, out, "utf8");
  process.stdout.write(`Written: ${outputPath}\n`);
}

if (require.main === module) main();
