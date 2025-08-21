const esbuild = require("esbuild");
esbuild
  .build({
    entryPoints: ["index.js"],
    bundle: true,
    platform: "node",
    minify: true,
    sourcemap: true,
    outfile: "output.js",
  })
  .catch((e) => {
    process.exit(1);
  });