# vite-plugin-remote-copy

📦 A Vite plugin to download remote assets or copy local files into the `dist` directory during build.

📦 一个用于在构建时将远程资源下载或将本地文件复制到 `dist` 目录的 Vite 插件。

---

## ✨ Features | 功能特性

- ✅ Supports downloading remote files（支持下载远程文件）
- ✅ Supports copying local files（支持复制本地文件）
- ✅ Supports renaming and subdirectory output（支持重命名和子目录输出）
- ✅ Simple and clear configuration（配置简单清晰）

---

## 📦 Install | 安装

```bash
npm install vite-plugin-remote-copy --save-dev
# 或者
pnpm add vite-plugin-remote-copy -D
```

🚀 Usage | 使用方式

```typescript
import remoteCopyPlugin from "vite-plugin-remote-copy";

export default {
  plugins: [
    remoteCopyPlugin({
      targets: [
        {
          src: "https://cdn.example.com/remote-entry.js",
          dest: "assets",
          rename: "remote-entry.js",
        },
        {
          src: "local/static/config.json",
          dest: "",
          rename: "config.json",
        },
      ],
    }),
  ],
};
```

⚙️ Options | 配置项

```type.d.ts
interface CopyTarget {
  src: string;         // Remote URL or local path | 远程链接或本地路径
  dest?: string;       // Output folder under /dist | 输出到 dist 下的子目录
  rename?: string;     // Rename the file | 重命名文件
}

interface PluginOptions {
  targets: CopyTarget[];
}
```

📝 License | 许可证

```
MIT © qianyongdong
```
