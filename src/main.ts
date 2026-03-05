import '/@/design/index.less';
import '/@/design/windi-base.css';
import 'virtual:windi-components.css';
import 'virtual:windi-utilities.css';
// Register icon sprite
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';
import gridLayout from 'vue-grid-layout';
import mitt from '/@/utils/mitt';
import { MotionPlugin } from '@vueuse/motion';
// import '/@/mock/index'; // 引入Mock.js配置文件 慎用，与vue-simple-uploader冲突，会导致文件断点续传失败
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';
import HC_3D from 'highcharts/highcharts-3d';
import '/@/components/VxeTable/src/css/index.scss';
import VxeUI from 'vxe-pc-ui';
import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx';
import ExcelJS from 'exceljs';

import 'ant-design-vue/dist/reset.css';

// 初始化 3D 模块
HC_3D(Highcharts);

const emitter = mitt();

import { isDevMode } from './utils/env';
import { initComponentAdapter } from '/@/adapter/components';

if (isDevMode()) {
  import('ant-design-vue/es/style');
}

async function bootstrap() {
  // 确保 window.ExcelJS 变量存在即表示安装完成
  VxeUI.use(VxeUIPluginExportXLSX, {
    ExcelJS,
  });
  const app = createApp(App);

  app.provide('emitter', emitter); // 注入provider

  app.use(VueHighcharts, {
    Highcharts: Highcharts,
  });
  // vueUse动画组件
  app.use(MotionPlugin);
  app.use(VxeUI);
  // Configure store
  // 配置 store
  setupStore(app);

  // Initialize internal system configuration
  // 初始化内部系统配置
  initAppConfigStore();

  // Register global components
  // 注册全局组件
  registerGlobComp(app);

  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取
  await setupI18n(app);

  // 初始化组件适配器
  await initComponentAdapter();

  // Configure routing
  // 配置路由
  setupRouter(app);

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app);

  // Configure global error handling
  // 配置全局错误处理
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();
  app.use(gridLayout);

  app.mount('#app');
}

bootstrap();
