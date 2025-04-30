import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import remoteCopyPlugin from 'vite-plugin-remote-copy'


export default defineConfig({
    plugins: [
        vue(),
        remoteCopyPlugin({
            targets: [
                {
                    src: 'https://cdn.jsdelivr.net/npm/import-map-overrides@3.1.1/dist/import-map-overrides.js',
                    rename: 'import-map-overrides@3.1.1.js'
                }
            ]
        })
    ],
})