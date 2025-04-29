import { Plugin } from 'vite';

interface CopyTarget {
    src: string;
    dest?: string;
    rename?: string;
}
interface PluginOptions {
    targets: CopyTarget[];
}
declare function remoteCopyPlugin(options: PluginOptions): Plugin;

export { remoteCopyPlugin as default };
