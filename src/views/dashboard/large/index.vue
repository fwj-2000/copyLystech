<!-- 数据大屏页 -->
<template>
  <div class="dashboard-large-page">
    <div class="dashboard-large-container">
      <div class="dashboard-large-wrapper">
        <!-- 导航 -->
        <div class="dashboard-large-nav">
          <img class="w-[100%] h-[100%]" :src="headSvg" mode="widthFix" />
        </div>
        <!-- 内容 -->
        <div class="content-container">
          <div class="content-wrapper">
            <div v-for="(item, idx) in contentList" :key="idx" class="item" :style="getGridItemStyle(item)">
              <!-- 组件 -->
              <template v-if="item.type === EContentType.COMPONENT">
                <component :is="item?.component"></component>
              </template>
              <!-- 静态图片 -->
              <template v-else> <img class="w-[100%] h-[100%]" :src="item?.src" style="object-fit: contain" /> </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { contentList } from './config';

  import headSvg from './static/head.svg';
  import { EContentType } from './types';

  // 获取单个网格布局配置样式
  const getGridItemStyle = (item: any) => {
    return item?.gridStyle ?? {};
  };
</script>

<style lang="less" scoped>
  @import url('./style/index.less');
</style>
