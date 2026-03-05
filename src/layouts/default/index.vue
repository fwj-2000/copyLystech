<template>
  <Layout :class="prefixCls" v-bind="lockEvents">
    <LayoutFeatures />
    <LayoutHeader fixed v-if="getShowFullHeaderRef" />
    <Layout :class="[layoutClass, `${prefixCls}-out`]">
      <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      <Layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <LayoutContent />
      </Layout>
    </Layout>
  </Layout>
  <Teleport v-if="zoomTourContainerRef" :to="zoomTourContainerRef">
    <div v-if="zoomTourOpen" class="zoom-tour-backdrop" :style="{ zIndex: zoomTourZIndex }" />
    <Tour
      v-model:current="zoomTourCurrent"
      :open="zoomTourOpen"
      :steps="zoomTourSteps"
      :popup-align="zoomTourAlign"
      :mask="false"
      :zIndex="zoomTourZIndex + 1"
      @close="handleZoomTourClose" />
  </Teleport>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue';
  import type { TourProps } from 'ant-design-vue';
  import { Layout, Tour } from 'ant-design-vue';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  import LayoutHeader from './header/index.vue';
  import LayoutContent from './content/index.vue';
  import LayoutSideBar from './sider/index.vue';
  import LayoutMultipleHeader from './header/MultipleHeader.vue';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLockPage } from '/@/hooks/web/useLockPage';

  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { useWebSocket } from '/@/hooks/web/useWebSocket';
  import { initShortcuts } from '/@/hooks/web/useShortcutManager';
  import { useI18n } from '/@/hooks/web/useI18n';
  const LayoutFeatures = createAsyncComponent(() => import('/@/layouts/default/feature/index.vue'));

  defineOptions({ name: 'DefaultLayout' });

  const { t } = useI18n();
  const { prefixCls } = useDesign('default-layout');
  const { getIsMobile } = useAppInject();
  const { getShowFullHeaderRef } = useHeaderSetting();
  const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();
  const { getAutoCollapse } = useMultipleTabSetting();

  const layoutClass = computed(() => {
    let cls: string[] = ['ant-layout'];
    if (unref(getIsMixSidebar) || unref(getShowMenu)) {
      cls.push('ant-layout-has-sider');
    }

    if (!unref(getShowMenu) && unref(getAutoCollapse)) {
      cls.push('ant-layout-auto-collapse-tabs');
    }

    return cls;
  });
  const lockEvents = useLockPage();
  const { initWebSocket } = useWebSocket();
  initShortcuts();
  const zoomTourOpen = ref(false);
  const zoomTourCurrent = ref(0);
  const zoomTourSuccess = ref(false);
  const zoomTourZIndex = 1000;
  const zoomTourTargetRef = ref<HTMLElement | null>(null);
  const zoomTourContainerRef = ref<HTMLElement | null>(null);
  const zoomTourAlign = ref({
    points: ['cc', 'cc'],
    offset: [0, 0],
    targetOffset: [0, 0],
  });
  const zoomTourSteps = computed<TourProps['steps']>(() => [
    {
      title: t('common.tipTitle'),
      description: zoomTourSuccess.value ? t('layout.tour.zoomSuccess') : t('layout.tour.zoomTip'),
      target: () => zoomTourTargetRef.value,
    },
  ]);
  const resolveZoomTourContainer = () => {
    const container = document.querySelector<HTMLElement>('.lydc-content-wrapper-content') || document.querySelector<HTMLElement>('.lydc-layout-content.full');
    zoomTourContainerRef.value = container ?? document.body;
    zoomTourTargetRef.value = container ?? document.body;
    if (container) {
      const style = window.getComputedStyle(container);
      if (style.position === 'static') {
        container.style.position = 'relative';
      }
    }
  };

  const updateZoomTourAlign = () => {
    const target = zoomTourTargetRef.value;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;
    zoomTourAlign.value = {
      points: ['cc', 'cc'],
      offset: [Math.round(viewportCenterX - targetCenterX), Math.round(viewportCenterY - targetCenterY)],
      targetOffset: [0, 0],
    };
  };
  const zoomTourStorageKey = 'has_seen_zoom_tour';
  let zoomTourTimer: number | undefined;
  let zoomListenerActive = false;
  let initialDevicePixelRatio = 1;
  let initialViewportScale: number | undefined;

  const handleZoomMaybeChanged = () => {
    if (zoomTourSuccess.value) return;
    const currentDevicePixelRatio = window.devicePixelRatio;
    const currentViewportScale = window.visualViewport?.scale;
    const devicePixelRatioChanged = currentDevicePixelRatio !== initialDevicePixelRatio;
    const viewportScaleChanged =
      typeof initialViewportScale === 'number' && typeof currentViewportScale === 'number' && currentViewportScale !== initialViewportScale;
    if (devicePixelRatioChanged || viewportScaleChanged) {
      zoomTourSuccess.value = true;
      stopZoomListener();
    }
  };

  const handleWheel = (event: WheelEvent) => {
    if (!event.ctrlKey) return;
    window.setTimeout(handleZoomMaybeChanged, 0);
  };

  const startZoomListener = () => {
    if (zoomListenerActive) return;
    zoomListenerActive = true;
    initialDevicePixelRatio = window.devicePixelRatio;
    initialViewportScale = window.visualViewport?.scale;
    window.addEventListener('resize', handleZoomMaybeChanged, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('resize', updateZoomTourAlign, { passive: true });
    window.visualViewport?.addEventListener('resize', handleZoomMaybeChanged, { passive: true });
    updateZoomTourAlign();
  };

  const stopZoomListener = () => {
    if (!zoomListenerActive) return;
    window.removeEventListener('resize', handleZoomMaybeChanged);
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('resize', updateZoomTourAlign);
    window.visualViewport?.removeEventListener('resize', handleZoomMaybeChanged);
    zoomListenerActive = false;
  };

  const handleZoomTourClose = () => {
    zoomTourOpen.value = false;
    stopZoomListener();
  };
  onMounted(() => {
    initWebSocket();
    if (localStorage.getItem(zoomTourStorageKey) === 'true') return;
    zoomTourTimer = window.setTimeout(async () => {
      if (localStorage.getItem(zoomTourStorageKey) === 'true') return;
      localStorage.setItem(zoomTourStorageKey, 'true');
      zoomTourSuccess.value = false;
      zoomTourCurrent.value = 0;
      resolveZoomTourContainer();
      await nextTick();
      updateZoomTourAlign();
      zoomTourOpen.value = true;
      startZoomListener();
    }, 5000);
  });

  onBeforeUnmount(() => {
    if (typeof zoomTourTimer === 'number') {
      window.clearTimeout(zoomTourTimer);
    }
    stopZoomListener();
  });

  watch(
    () => zoomTourOpen.value,
    open => {
      if (!open) {
        stopZoomListener();
      }
    },
  );
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    background-color: @content-bg;

    > .ant-layout {
      min-height: 100%;
    }

    &-main {
      width: 100%;
      margin-left: 1px;
    }
  }

  .@{prefix-cls}-out {
    &.ant-layout-has-sider {
      .@{prefix-cls} {
        &-main {
          margin-left: 1px;
        }
      }
    }
  }

  .zoom-tour-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgb(0 0 0 / 45%);
  }
</style>
