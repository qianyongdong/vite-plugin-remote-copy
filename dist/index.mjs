// src/index.ts
import fs from "fs";
import path from "path";
import { mkdir } from "fs/promises";
import https from "https";
import http from "http";
function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}, status: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
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
      const distDir = path.resolve(process.cwd(), "dist");
      for (const { src, dest = "", rename } of options.targets) {
        const fileName = rename ?? path.basename(src);
        const outputDir = path.resolve(distDir, dest);
        const outputPath = path.resolve(outputDir, fileName);
        await mkdir(outputDir, { recursive: true });
        if (src.startsWith("http://") || src.startsWith("https://")) {
          await download(src, outputPath);
        } else {
          const srcPath = path.resolve(process.cwd(), src);
          fs.copyFileSync(srcPath, outputPath);
          console.log(`[vite-remote-copy] Copied: ${srcPath} \u2192 ${outputPath}`);
        }
      }
    }
  };
}
export {
  remoteCopyPlugin as default
};
