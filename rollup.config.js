import {readFileSync} from "node:fs";
import RollupNode from "@rollup/plugin-node-resolve";
import RollupTerser from "@rollup/plugin-terser";
import meta from "./package.json" with {type: "json"};

// Extract copyrights from the LICENSE.
const copyright = readFileSync("./LICENSE", "utf-8")
  .split(/\n/g)
  .filter(line => /^copyright\s+/i.test(line))
  .map(line => line.replace(/^copyright\s+/i, ""))
  .join(", ");

const banner = `// ${meta.homepage} v${meta.version} Copyright ${copyright}`;

const terser = RollupTerser({
  output: {
    preamble: banner
  }
});

function config(options) {
  return {
    ...options,
    input: "src/index.js",
    output: {
      ...options.output,
      name: "versor",
      indent: false,
      banner
    },
    plugins: [
      RollupNode(),
      ...(options.plugins ?? [])
    ]
  };
}

export default [
  config({
    output: {
      file: `dist/${meta.name}.mjs`,
      format: "es"
    }
  }),
  config({
    output: {
      file: `dist/${meta.name}.min.mjs`,
      format: "es"
    },
    plugins: [
      terser
    ]
  }),
  config({
    output: {
      file: `dist/${meta.name}.js`,
      format: "umd"
    }
  }),
  config({
    output: {
      file: `dist/${meta.name}.min.js`,
      format: "umd"
    },
    plugins: [
      terser
    ]
  })
];
