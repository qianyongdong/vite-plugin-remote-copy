"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => remoteCopyPlugin
});
module.exports = __toCommonJS(src_exports);
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_promises = require("fs/promises");
var import_https = __toESM(require("https"));
var import_http = __toESM(require("http"));
function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? import_https.default : import_http.default;
    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}, status: ${res.statusCode}`));
        return;
      }
      const fileStream = import_fs.default.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        console.log(`[vite-remote-copy] Downloaded: ${url} \u2192 ${destPath}`);
        resolve();
      });
    }).on("error", reject);
  });
}
function remoteCopyPlugin(options) {
  return {
    name: "vite-plugin-remote-copy",
    apply: "build",
    async closeBundle() {
      const distDir = import_path.default.resolve(process.cwd(), "dist");
      for (const { src, dest = "", rename } of options.targets) {
        const fileName = rename ?? import_path.default.basename(src);
        const outputDir = import_path.default.resolve(distDir, dest);
        const outputPath = import_path.default.resolve(outputDir, fileName);
        await (0, import_promises.mkdir)(outputDir, { recursive: true });
        if (src.startsWith("http://") || src.startsWith("https://")) {
          await download(src, outputPath);
        } else {
          const srcPath = import_path.default.resolve(process.cwd(), src);
          import_fs.default.copyFileSync(srcPath, outputPath);
          console.log(`[vite-remote-copy] Copied: ${srcPath} \u2192 ${outputPath}`);
        }
      }
    }
  };
}
