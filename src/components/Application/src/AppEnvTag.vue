<template>
  <Teleport to="body">
    <!-- 正式环境不显示 -->
    <div v-show="!isProd" class="env-float" :style="{ left: `${pos.x}px`, top: `${pos.y}px` }" @mousedown.prevent="onMouseDown">
      {{ t('common.currentEnvironment') }}：{{ meta.label }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive } from 'vue';
  import { getEnvFromHost, getEnvMeta } from '/@/utils/envTag';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const kind = computed(() => getEnvFromHost());
  const meta = computed(() => getEnvMeta(kind.value));
  const isProd = computed(() => kind.value === 'prod'); //  prod 不显示

  const STORAGE_KEY = 'env-float-pos';

  // 浮窗位置
  const pos = reactive({ x: 0, y: 0 });

  // 拖拽状态
  const drag = reactive({
    dragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  function loadPos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (typeof p?.x === 'number' && typeof p?.y === 'number') return p;
    } catch {}
    return null;
  }

  function savePos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: pos.x, y: pos.y }));
    } catch {}
  }

  function setDefaultPos() {
    const saved = loadPos();
    if (saved) {
      pos.x = saved.x;
      pos.y = saved.y;
      return;
    }

    const header = document.querySelector('.layout-header') as HTMLElement | null;

    const floatW = 140;
    const floatH = 32;

    if (header) {
      const r = header.getBoundingClientRect();
      pos.x = Math.round(r.left + r.width / 2 - floatW / 2);
      pos.y = Math.round(r.top + r.height / 2 - floatH / 2);
    } else {
      pos.x = Math.round(window.innerWidth / 2 - floatW / 2);
      pos.y = 12;
    }

    pos.x = clamp(pos.x, 8, window.innerWidth - floatW - 8);
    pos.y = clamp(pos.y, 8, window.innerHeight - floatH - 8);
  }

  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;

    drag.dragging = true;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    drag.startLeft = pos.x;
    drag.startTop = pos.y;

    const onMove = (ev: MouseEvent) => {
      if (!drag.dragging) return;

      const dx = ev.clientX - drag.startX;
      const dy = ev.clientY - drag.startY;

      const floatW = 200;
      const floatH = 40;

      pos.x = clamp(Math.round(drag.startLeft + dx), 8, window.innerWidth - floatW - 8);
      pos.y = clamp(Math.round(drag.startTop + dy), 8, window.innerHeight - floatH - 8);
    };

    const onUp = () => {
      drag.dragging = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      savePos();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  onMounted(() => {
    setDefaultPos();
  });
</script>

<style scoped lang="less">
  :global(.env-float) {
    position: fixed;
    z-index: 2147483647; /* 32 位有符号整数的最大值  2³¹ - 1 = 2147483647  */
    height: 32px;
    line-height: 32px;
    padding: 0 14px;
    border-radius: 6px;
    background: #ff7a00;
    color: #fff !important;
    font-weight: 700;
    font-size: 13px;
    user-select: none;
    cursor: move;
    white-space: nowrap;
    box-shadow: 0 4px 14px rgb(0 0 0 / 15%);
  }
</style>
