<template>
  <div class="sub-title">
    <div class="sub-line"></div>
    <div class="title"
      >{{ title }}
      <slot name="icon" v-if="tips">
        <a-tooltip placement="top" overlayClassName="card-toolip">
          <template #title>
            <div v-html="tips.replace(/\[br]/g, '<br>')"></div>
          </template>
          <i class="ym-diecut ym-diecut-help-circle text-[gray]"></i>
        </a-tooltip>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
  });
</script>
<style lang="less" scoped>
  .sub-title {
    display: flex;
    align-items: center;

    .sub-line {
      width: 2px;
      height: 16px;
      border-radius: 2px;
      background-color: #ff7b00;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      line-height: 24px;
      font-weight: 700;
      margin-left: 6px;
    }
  }

  .card-tooltip {
    width: 400px;
  }
</style>
