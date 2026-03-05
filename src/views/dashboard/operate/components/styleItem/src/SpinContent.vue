<!-- 指标中心 >>> 组件内容展示 -->
<template>
  <div class="compo-wrapper">
    <a-spin :spinning="props.loading">
      <slot name="empty">
        <!-- 数据为空展示 -->
        <emptyData v-show="!props.loading && props.isEmptyData"></emptyData>
        <!-- 接口異常 -->
        <emptyData v-show="!props.loading && props.isRequestError"></emptyData>
      </slot>
      <template v-if="!props.loading && !props.isEmptyData && !props.isRequestError">
        <!-- 数值展示 -->
        <div v-if="!props.loading && props.showList" class="value-list-container">
          <ValueList :list="props.list" />
        </div>
        <div class="compo-content-container" :class="{ 'none-list': !props.showList }">
          <!-- 内容插槽 -->
          <slot v-if="!props.loading"></slot>
        </div>
      </template>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { spinContentProps } from './props';
  import emptyData from '/@/views/dashboard/operate/components/emptyData.vue';
  import ValueList from './ValueList.vue';
  const props = defineProps(spinContentProps);
</script>

<style lang="less" scoped>
  @valueHeight: 60px;

  .compo-wrapper {
    width: 100%;
    height: 100%;

    .value-list-container {
      height: @valueHeight;
    }

    .compo-content-container {
      height: calc(100% - @valueHeight);

      &.none-list {
        height: 100%;
      }
    }

    .ant-spin-nested-loading {
      width: 100%;
      height: 100%;

      :deep(.ant-spin-container) {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
