## 一 环境要求

### 1.1 开发环境

- 操作系统：`Windows 10/11`，`MacOS`；
- `Node 16.15.0` 及以上版本(某些情况下可能需要安装 `Python3` 环境)；
- `pnpm v8.1.0`及以上版本；
- 浏览器推荐使用 `Chrome 90`及以上版本；
- `Visual Studio Code` (简称 VSCode)

### 1.2 运行环境

`Nginx 1.18.0` 及以上版本或 `TongHttpServer 6.0` (信创环境)

## 二 浏览器支持

> 支持现代浏览器，不支持 IE

| IE          | Edge            | Firefox         | Chrome          | Safari          |
| ----------- | --------------- | --------------- | --------------- | --------------- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 三 关联项目

| 项目            | 分支 | 说明         |
| --------------- | ---- | ------------ |
| lydc.server.web | dev  | 框架前端     |
| lydc.kkfileview | dev  | 文件预览服务 |
| ...             |      |              |

## 四 使用说明

### 4.1 开发环境

#### 4.1.1 安装 pnpm

> 推荐使用 `pnpm`，若使用 `yarn` ，建议使用 `Yarn v1.22.x` 版本，否则可能出现依赖安装失败的情况，使用 npm 的同学建议使用 pnpm 或者 yarn，npm 性能差且对 node-sass 等包支持不好。

在 Windows 的`PowerShell`中执行如下命令，这里建议使用 git bash，powershell 对 yarn 的支持不好，需要修改注册表策略

```bash
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

MacOS 通过 `Homebrew` 安装 `pnpm`<br/> 若已经安装了 `Homebrew` 软件包管理器，则可以使用如下命令赖安装 pnpm：

```bash
brew install pnpm
```

也可以通过 npm 安装 pnpm

```bash
npm install -g pnpm
或
npm install -g @pnpm/exe
```

#### 4.1.2 安装依赖

使用如下命令安装项目依赖

```bash
pnpm install

pnpm i
```

```bash
pnpm run dev # 启动开发环境
```

#### 4.1.3 后端接口配置

本地开发应复制`.env.development`文件重命名为`env.development.local`，然后根据情况自行修改`env.development.local`中的后端接口配置，在本地 env.development.local 优先级比 env.development 高

```bash
# 后端接口，修改接口api代理即可
VITE_PROXY = [["/dev","http://localhost:5000"]]

# websocket地址
# 在本地开发环境，将后端默认接口地址的协议改成 ws 即可
VITE_GLOB_WEBSOCKET_URL='ws://localhost:5000'


```

#### 4.1.4 关联项目配置

打开 `/src/hooks/setting/index.ts` 配置文件，默认配置如下所示

```bash
...
const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_API_URL + '/api/file/Uploader',
    webSocketUrl: VITE_GLOB_WEBSOCKET_URL,
    // 本地文件预览
    filePreviewServer: isDevMode() ? 'http://localhost:30090' : VITE_GLOB_API_URL + '/FileServer',
    // 大屏应用前端路径
    dataVUrl: isDevMode() ? 'http://localhost:8100/DataV/' : prodUrlPrefix + '/DataV/',
    // 数据报表接口-java cloud
    // reportServer: isDevMode() ? 'http://localhost:30000' : VITE_GLOB_API_URL,
    // 数据报表接口-java boot
    reportServer: isDevMode() ? 'http://localhost:30007' : VITE_GLOB_API_URL + '/ReportServer',
    // 报表前端路径
    report: isDevMode() ? 'http://localhost:8200' : VITE_GLOB_API_URL + '/Report',
};
...
```

#### 4.1.5 本地运行

完成上述操作后，使用如下命令运行前端项目

```bash
pnpm dev | yarn dev | npm run dev
```

### 4.2 运行环境

> 测试或生产环境

如果需要测试或生产环境发布，使用如下命令打包项目

```bash
pnpm build
```

然后将项目根目录下 `/dist/` 中所有的文件上传至服务器。

## 五 常见问题

### 5.1 修改项目基本信息

打开项目根目录 `.env` 文件，可以看到 `本地运行端口号`、`网站标题`、`简称` 等配置。

```bash
# 环境配置需要以 VITE_ 开头

# 端口号
VITE_PORT = 3100

# 网站标题，开发平台配置优先级大于前端配置
VITE_GLOB_APP_TITLE = DC Manage System

# 简称，用于配置文件名字 不要出现空格、数字开头等特殊字符
VITE_GLOB_APP_SHORT_NAME = lydc
```

### 5.2 在运行环境(测试或生产环境)报 ak 设置问题

错误信息如下所示

```bash
APP Referer校验失败。请检查该ak设置的白名单与访问所有的域名是否一致。详情查看：http://bsyun.baidu.com/apiconsole/key#。
```

需要去 百度地图开发平台（[https://lbsyun.baidu.com/](https://lbsyun.baidu.com/)）申请一个账号，然后修改 `src/views/extend/map/index.vue` 第 8 行代码中 `ak` 的值。

### 5.3 代码更新后报错

在开发或打包时报依赖缺失，可以先删除项目根目录下的 `pnpm-lock.yaml` 文件，然后重新执行 `pnpm install` 安装依赖即可解决。

## 六 其他

### 6.1 项目介绍

这是一个基于 Vue3 + Vite + TypeScript + Ant-Design-Vue + less 的项目模板。

### 6.2 前端开发方式

1. 运行 `pnpm dev` 命令，启动开发服务器，浏览器自动打开 `http://localhost:3100` 地址，即可看到项目首页。
2. 运行 `pnpm build` 命令，打包项目，打包后的文件会生成在 `dist` 目录下。
3. 运行 `pnpm preview` 命令，启动预览服务器，浏览器自动打开 `http://localhost:3101` 地址，即可看到项目首页。
4. 开发环境账号密码：admin/123456

### 6.3 项目目录结构

```bash
lydc.server.web
├.editorconfig
├.env
├.env.development
├.env.development.local
├.env.production
├.env.test
├.eslintignore
├.eslintrc.js
├.gitattributes
├.gitignore
├.gitlab-ci.yml
├.gitpod.yml
├.prettierignore
├.stylelintignore
├.vscode
│  ├settings.json
├build
│  ├config
│  ├constant.ts
│  ├generate
│  ├getConfigFileName.ts
│  ├script
│  ├utils.ts
│  ├vite
├conf
│  ├.gitkeep
│  ├default.conf
├deploy
│  ├default.conf
├Dockerfile
├Dockerfile.bak
├index.html
├k8s_deploy.yaml
├LICENSE
├package.json
├pnpm-lock.yaml
├postcss.config.js
├prettier.config.js
├public
│  ├cdn
│  ├favicon.ico
│  ├fonts
│  ├index.css
│  ├resource
├README.md
├src
│  ├api
│  ├App.vue
│  ├assets
│  ├components
│  ├design
│  ├directives
│  ├enums
│  ├hooks
│  ├layouts
│  ├locales
│  ├logics
│  ├main.ts
│  ├mock
│  ├router
│  ├settings
│  ├store
│  ├utils
│  ├views
├stylelint.config.js
├tsconfig.json
├types
│  ├axios.d.ts
│  ├config.d.ts
│  ├global.d.ts
│  ├index.d.ts
│  ├module.d.ts
│  ├store.d.ts
│  ├utils.d.ts
│  ├vue-router.d.ts
├vite.config.ts
├windi.config.ts
├yarn.lock
```

### 6.4 开发须知

```bash

1. 页面写在views下，按功能模块创建目录进行开发

2. 通用组件写在全局的components下，写之前可以看下现有的组件能不能满足你的需求，如果不满足，再新建一个组件

3. 业务组件写到自己在功能目录下在components下，比如订单页面的订单卡组件，写到订单页面的components下

4. 静态资源丢到assets下，按目录存放，图片、字体、视频等

5. 样式方面，布局可参考lydc-content-wrapper-**类样式来写，样式的类名尽量使用windi的类名，方便维护，项目中的基础组件是基于antd进行的二次封装，可以直接拿来用，如：basicTable、basicForm等

6. 路由我们只需要在views下创建一个对应在功能文件目录，然后通过菜单配置到对应的组件即可，具体操作：系统菜单 -> 开发平台 -> 菜单管理 -> 新建，选择对应的组件即可

7. api 全部统一在src/api/，统一使用axios发送请求，具体查看@/src/api下在代码

8. lint规范参考eslint和prettier，具体查看.eslintrc.js和prettier.config.js，vscode需要安装eslint、prettier插件

    - 2空格缩进
    - 引号内使用单引号
    - 末尾加逗号、分号
    ...

    module.exports = {
      printWidth: 160,
      semi: true,
      vueIndentScriptAndStyle: true,
      singleQuote: true,
      trailingComma: 'all',
      proseWrap: 'never',
      htmlWhitespaceSensitivity: 'strict',
      endOfLine: 'auto',
      bracketSameLine: true,
      jsxBracketSameLine: true,
      arrowParens: 'avoid',
    };

9. 代码提交规范检查、修正前置校验commitlint

(1) 工程代码做了git提交前置校验，代码需满足项目配置lint和prettier规则后才可以提交。

(2) script默认提供lint:fix和prettier:fix命令帮助快速修复代码格式化及简单的lint规范问题

(3) commit -m "msg" msg书写格式为"feat: xxx", 仅支持['feat', 'update', 'fix', 'refactor', 'optimize', 'style', 'docs', 'chore']描述类型

10. 代码合并规范

  (1) 允许功能分支合并对应环境分支，如feat/xxx 合并到 dev、test
  (2) 允许环境分支合并环境分支，main分支同步到test、dev除外，如不允许将dev合并到test
  (3)合并test环境前需要提交合并请求，冲突解决方案如下：
    a. 先从test环境出一个中间分支                                        test  => check out   middle branch
    b. 然后将功能分支合并到中间分支，解决冲突                             merge  feat branch  =>  middle branch     fix conflict
    c. 在gitlab上提交合并请求给对应的人合并，做完codereview，合并代码      gitlab merge request    middle branch  => test

```
