import type { UserConfig, ConfigEnv } from 'vite';
import pkg from './package.json';
import dayjs from 'dayjs';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import { generateModifyVars } from './build/generate/generateModifyVars';
import { createProxy } from './build/vite/proxy';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

const timeStamp = new Date().getTime();

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  // const { VITE_GLOB_LYDC_RUN_ENV } = env;

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

  const isBuild = command === 'build';
  // const isBuild = VITE_GLOB_LYDC_RUN_ENV == 'DEV' ? false : command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      allowedHosts: true,
      https: false,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createProxy(VITE_PROXY),
      open: true, //vite项目启动时自动打开浏览器
      watch: {
        ignored: ['**/node_modules/**'],
      },
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE ? ['console', 'debugger'] : [],
    },
    build: {
      target: 'esnext',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      // 🚀 改用 esbuild (快20-40 倍)
      minify: VITE_DROP_CONSOLE ? 'esbuild' : false,
      ...(VITE_DROP_CONSOLE && {
        terserOptions: {
          compress: {
            keep_infinity: true,
            // Used to delete console in production environment
            drop_console: VITE_DROP_CONSOLE,
            drop_debugger: true,
          },
        },
      }),
      // Turning off reportCompressedSize display can slightly reduce packaging time
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        maxParallelFileOps: Math.max(2, require('node:os').cpus().length - 1),
        input: {
          index: pathResolve('index.html'),
        },
        // 静态资源分类打包
        output: {
          manualChunks: {
            tinymce: ['tinymce'],
            antd: ['ant-design-vue', '@ant-design/icons-vue'],
            charts: ['echarts', 'echarts-stat', 'highcharts', 'highcharts-3d', 'highcharts-more', 'highcharts-vue', 'vue-highcharts'],
          },
          // 优化 manualChunks - 更智能的分包
          // manualChunks(id) {
          //   if (id.includes('node_modules')) {
          //     // 提取包名
          //     const pkgMatch = id.match(/node_modules\/(@[^\/]+\/[^\/]+|[^\/]+)/);
          //     if (!pkgMatch) return 'vendor';
          //     const pkgName = pkgMatch[1];
          //     // 1. 编辑器类（体积巨大，必须单独拆）
          //     if (pkgName.includes('monaco-editor')) return 'editor-monaco';
          //     if (pkgName.includes('tinymce')) return 'editor-tinymce';
          //     if (pkgName.includes('@wangeditor-next')) return 'editor-wangeditor';
          //     if (pkgName.includes('codemirror')) return 'editor-codemirror';
          //     if (pkgName.includes('vditor')) return 'editor-vditor';
          //     // 2. 图表类
          //     if (['echarts', 'echarts-stat', 'highcharts', 'highcharts-3d', 'highcharts-more', 'highcharts-vue', 'vue-highcharts'].includes(pkgName)) {
          //       return 'charts';
          //     }
          //     if (['ant-design-vue', '@ant-design/icons-vue'].includes(pkgName)) {
          //       return 'ui-antd';
          //     }
          //     if (['vxe-table', 'vxe-pc-ui', 'pinia', 'vue-router'].includes(pkgName)) {
          //       return 'ui-vxe';
          //     }
          //     // 5. 重型功能库
          //     if (['@logicflow', '@fullcalendar'].includes(pkgName)) {
          //       return 'lib';
          //     }
          //     // 6. 核心工具库（经常一起使用）
          //     if (
          //       pkgName.includes('lodash') ||
          //       pkgName.includes('axios') ||
          //       pkgName.includes('dayjs') ||
          //       pkgName.includes('moment') ||
          //       pkgName.includes('qs')
          //     ) {
          //       return 'utils-core';
          //     }
          //     // 7. 其他依赖到 vendor
          //     return 'vendor';
          //   }

          //   // 业务代码按路由/功能拆分
          //   if (id.includes('src/views/')) {
          //     const match = id.match(/src\/views\/([^\/]+)/);
          //     if (match && match[1]) {
          //       return `view-${match[1]}`;
          //     }
          //   }
          // },
          chunkFileNames: ({ name }) => {
            if (name === 'vendor') {
              return 'static/js/[name]-[hash:12].js';
            } else {
              return `static/js/[name]-[hash:8]-${timeStamp}.js`;
            }
          },
          entryFileNames: ({ name }) => {
            if (name === 'vendor') {
              return 'static/js/[name]-[hash:12].js';
            } else {
              return `static/js/[name]-[hash:8]-${timeStamp}.js`;
            }
          },
          assetFileNames: 'static/[ext]/[name]-[hash:12].[ext]',
        },
      },
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      // Fix for disabled vite-plugin-theme
      __COLOR_PLUGIN_OUTPUT_FILE_NAME__: JSON.stringify(''),
      __PROD__: isBuild,
      __COLOR_PLUGIN_OPTIONS__: JSON.stringify({}),
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
          timeout: 15000, // 延长 less 编译超时时间
        },
      },
    },

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    plugins: createVitePlugins(viteEnv, isBuild),

    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/zh_TW',
        'ant-design-vue/es/locale/en_US',
        // `monaco-editor/esm/vs/language/json/json.worker`,
        // `monaco-editor/esm/vs/language/css/css.worker`,
        // `monaco-editor/esm/vs/language/html/html.worker`,
        // `monaco-editor/esm/vs/language/typescript/ts.worker`,
        // `monaco-editor/esm/vs/editor/editor.worker`,
      ],
    },
  };
};
