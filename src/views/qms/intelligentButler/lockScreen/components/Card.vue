<template>
  <div class="card">
    <div class="card-title">
      <div class="title">{{ title }}</div>
      <slot name="icon" v-if="tips">
        <a-tooltip placement="top" :title="tips">
          <i class="ym-diecut ym-diecut-help-circle"></i>
        </a-tooltip>
      </slot>
    </div>
    <div class="card-content">{{ content }}</div>
    <div class="card-icon">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  interface ICardProps {
    title: string;
    content: string;
    tips?: string;
  }

  const props = withDefaults(defineProps<ICardProps>(), {
    title: '',
    content: '',
    tips: '',
  });
</script>
<style lang="less" scoped>
  .card {
    border-radius: 4px;
    padding: 12px 16px;
    height: 68px;
    position: relative;

    .card-title {
      font-size: 13px;
      color: #fff;
      display: flex;
      align-items: center;

      .title {
        z-index: 99;
      }
    }

    .card-content {
      color: #fff;
      // margin-top: 10px;
      font-size: 20px;
      font-weight: 700;
      position: absolute;
      top: 34px;
      left: 16px;
      z-index: 99;
    }

    .card-icon {
      position: absolute;
      right: 16px;
      bottom: 0;
      height: 60px;
    }
  }
</style>
