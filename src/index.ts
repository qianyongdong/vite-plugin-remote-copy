import fs from 'fs'
import path from 'path'
import { mkdir } from 'fs/promises'
import https from 'https'
import http from 'http'
import type { Plugin } from 'vite'

interface CopyTarget {
  src: string
  dest?: string
  rename?: string
}

interface PluginOptions {
  targets: CopyTarget[]
}

function download(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}, status: ${res.statusCode}`))
        return
      }
      const fileStream = fs.createWriteStream(destPath)
      res.pipe(fileStream)
      fileStream.on('finish', () => {
        fileStream.close()
        console.log(`[vite-remote-copy] Downloaded: ${url} → ${destPath}`)
        resolve()
      })
    }).on('error', reject)
  })
}

export default function remoteCopyPlugin(options: PluginOptions): Plugin {
  return {
    name: 'vite-plugin-remote-copy',
    apply: 'build',

    async closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')

      for (const { src, dest = '', rename } of options.targets) {
        const fileName = rename ?? path.basename(src)
        const outputDir = path.resolve(distDir, dest)
        const outputPath = path.resolve(outputDir, fileName)

        await mkdir(outputDir, { recursive: true })

        if (src.startsWith('http://') || src.startsWith('https://')) {
          await download(src, outputPath)
        } else {
          // 本地文件拷贝
          const srcPath = path.resolve(process.cwd(), src)
          fs.copyFileSync(srcPath, outputPath)
          console.log(`[vite-remote-copy] Copied: ${srcPath} → ${outputPath}`)
        }
      }
    },
  }
}
