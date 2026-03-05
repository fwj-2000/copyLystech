<script lang="ts" setup>
  import { ref } from 'vue';
  import { getViewportOffset } from '/@/utils/domUtils';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['scrollEvent']);
  const navBox = ref<HTMLElement | null>(null);

  const { t } = useI18n();

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
      key: 'halfPart',
      name: t('dict.CommonCol.SemiFinishedProduct'),
    },
    {
      key: 'material',
      name: t('common.metaria'),
    },
    {
      key: 'packaging',
      name: t('common.packageMetaria'),
    },
  ];
  const currentKey = ref(NAV_MAP[0].key);

  function handleScroll(key) {
    currentKey.value = key;
    const target = document.querySelector(`#${key}`);
    const { top } = getViewportOffset(target);
    emit('scrollEvent', top);
  }
</script>

<template>
  <div ref="navBox">
    <a-tabs v-model:activeKey="currentKey" @change="handleScroll">
      <a-tab-pane v-for="item in NAV_MAP" :key="item.key" :tab="item.name"> </a-tab-pane>
    </a-tabs>
  </div>
</template>
