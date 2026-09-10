import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = process.env.GARAGE_BUILD_SOURCE
  ? path.resolve(process.env.GARAGE_BUILD_SOURCE)
  : path.join(root, "src/candidate/garage-control-card.js");
const output = process.env.GARAGE_BUILD_OUTPUT
  ? path.resolve(process.env.GARAGE_BUILD_OUTPUT)
  : path.join(root, "dist/garage-control-card.js");

await build({
  stdin: {
    contents: fs.readFileSync(source, "utf8").replace(
      "https://cdn.jsdelivr.net/npm/lit-element@4.2.0/+esm",
      "lit-element",
    ),
    loader: "js",
    resolveDir: path.dirname(source),
    sourcefile: path.basename(source),
  },
  outfile: output,
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  charset: "utf8",
  legalComments: "none",
  sourcemap: false,
  minify: false,
  banner: { js: "/* HA-BOARD Garage Control 1.1.0 | lit-element 4.2.0 incorporated | see THIRD-PARTY-NOTICES.md */" },
});

console.log(`Built Garage module: ${path.relative(root, output)}`);
