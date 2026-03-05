# 使用 Node.js 的镜像作为基础镜像，并指定版本和操作系统版本
FROM 10.0.0.55:6001/node:22.21.1-bullseye-slim-yarn-v1 AS build-stage

# 设置工作目录为 /app
WORKDIR /app

# 设置 Yarn 镜像源
RUN yarn config set registry https://registry.npmmirror.com

COPY .yarnrc.yml ./

# 将配置文件和锁文件复制到容器中（锁文件确保依赖版本一致性）
COPY package.json yarn.lock ./

# package.json 的哈希作为缓存 key，依赖变更时自动使用新缓存
ARG PKG_HASH=unknown

# 使用 BuildKit 缓存挂载，按依赖内容隔离缓存，安装依赖项
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,id=yarn-cache-${PKG_HASH},sharing=locked \
    yarn install --frozen-lockfile --network-timeout 600000

# 将源代码复制到容器中
COPY . .

# 使用构建参数传递 build 命令，默认构建参数：build:dev
ARG BUILD_COMMAND="yarn build:dev"

# 增加 Node 内存限制
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN $BUILD_COMMAND

# 指定了基础镜像用于生产镜像
FROM 10.0.0.55:6001/nginx:stable-alpine AS production-stage

# 设置工作目录
WORKDIR /home/lydcsoft/lydc-web

# 从上一个步骤构建生产的dist目录复制到生产镜像中
COPY --from=build-stage /app/dist /home/lydcsoft/lydc-web

# 复制Nginx配置文件
COPY conf/default.conf /etc/nginx/conf.d/

# 对外暴露的端口为 80
EXPOSE 80

# 启动 Nginx，前台运行
CMD ["nginx", "-g", "daemon off;"]
