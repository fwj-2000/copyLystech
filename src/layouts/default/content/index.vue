<template>
  <div :class="[prefixCls, getLayoutContentMode]" v-loading="getOpenPageLoading && getPageLoading" :copyright="copyright">
    <div class="app-main h-full">
      <PageLayout />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import PageLayout from '/@/layouts/page/index.vue';
  import { Spinner } from '/@/components/VxeTable/ui-kit/shadcn-ui/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useContentViewHeight } from './useContentViewHeight';
  import { useAppStore } from '/@/store/modules/app';

  export default defineComponent({
    name: 'LayoutContent',
    components: { PageLayout, Spinner },
    setup() {
      const { prefixCls } = useDesign('layout-content');
      const { getOpenPageLoading } = useTransitionSetting();
      const { getLayoutContentMode, getPageLoading } = useRootSetting();
      const appStore = useAppStore();
      const { copyright } = appStore.getSysConfigInfo;

      useContentViewHeight();
      return {
        prefixCls,
        getOpenPageLoading,
        getLayoutContentMode,
        getPageLoading,
        copyright,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-content';

  .@{prefix-cls} {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    height: calc(100vh - @header-height - @multiple-height - 10px);
    overflow: hidden;
    padding: 0 10px 10px;
    box-sizing: border-box;
    background: url('/@/assets/images/loading-iframe.gif') no-repeat center center;
    background-color: @app-main-background;
    background-size: 600px 450px;
    margin-top: 10px;

    &::before {
      content: attr(copyright);
      font-size: 14px;
      color: #999;
      text-align: center;
      width: 100%;
      display: block;
      position: absolute;
      bottom: 20px;
      left: 0;
    }

    .app-main {
      overflow: hidden auto;
      position: relative;
    }

    &.fixed {
      width: 1200px;
      margin: 0 auto;
    }

    &-loading {
      position: absolute;
      top: 200px;
      z-index: @page-loading-z-index;
    }
  }
</style>
