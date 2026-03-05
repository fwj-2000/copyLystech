<script lang="ts" setup>
  import { ref } from 'vue';
  import { getViewportOffset } from '/@/utils/domUtils';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['scrollEvent']);
  const navBox = ref<HTMLElement | null>(null);

  const currentKey = ref('base-info');
  const { t } = useI18n();

  const motionProps = {
    delay: 0,
    duration: 300,
    enter: { scale: 1 },
    hovered: { scale: 1.05, transition: { delay: 0, duration: 50 } },
    preset: 'fade',
    tapped: { scale: 0.9, transition: { delay: 0, duration: 50 } },
  };

  const NAV_MAP = [
    {
      key: 'base-info',
      name: t('common.baseinfo'),
    },
    {
      key: 'process',
      name: t('common.process'),
    },
    {
      key: 'halfFinished',
      name: t('dict.CommonCol.SemiFinishedProduct'),
    },
    {
      key: 'material',
      name: t('common.metaria'),
    },
    {
      key: 'mould',
      name: t('common.Mold'),
    },
    {
      key: 'packaging',
      name: t('common.package'),
    },
    {
      key: 'silicone',
      name: t('common.silicone'),
    },
  ];

  function handleScroll(key) {
    currentKey.value = key;
    const target = document.querySelector(`#${key}`);
    if (target) {
      const { top } = getViewportOffset(target);
      emit('scrollEvent', top);
    }
  }
</script>

<template>
  <div ref="navBox" class="flex gap-2 overflow-hidden main-nav">
    <MotionGroup v-for="(item, i) in NAV_MAP" :key="i" v-bind="{ ...motionProps, delay: motionProps.delay + 100 * i }">
      <a-button size="small" :type="currentKey === item.key ? 'primary' : undefined" :ghost="currentKey === item.key" @click="handleScroll(item.key)">{{
        item.name
      }}</a-button>
    </MotionGroup>
  </div>
</template>

<style>
  .main-nav {
    display: flex;
    flex-direction: row;
    position: fixed;
    z-index: 10;
    background: rgb(255 255 255 / 80%);
    padding: 3px;
  }
</style>
