<!-- 指标中心 >>> 组件标题 -->
<template>
  <div class="compo-wrapper">
    <div class="title flex row ct-between">
      <!-- 左侧内容插槽 -->
      <slot name="left">
        <div>
          <span v-if="props.mainPage" class="text-hover" @click="props.clickMth(props.mainPage)"> {{ props.title
            }}</span>
          <span v-else> {{ props.title }}</span>
        </div>
      </slot>
      <div class="flex">
        <!-- 右侧内容插槽 -->
        <slot name="right">
          <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
import { compoHeadProps } from './props';
const props = defineProps(compoHeadProps)
</script>

<style lang="less" scoped>
.compo-wrapper {
  width: 100%;
  height: 100%;

  .title {
    width: 100%;
    color: #1a1a1a;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    height: @report-operate-compo-title-height;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>