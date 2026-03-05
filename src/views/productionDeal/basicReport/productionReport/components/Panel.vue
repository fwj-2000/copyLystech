<template>
  <div class="panel w-[100%]">
    <div class="panel-title">
      <Subtitle :title="title" :tips="tips"></Subtitle>
      <div @click="expandClick" class="collapse-expand ml-[12px]">
        <span>{{ showExpand ? t('component.form.fold') : t('common.expandAll') }}</span>
        <img :src="showExpand ? collapse : expand" class="icon" alt="" />
      </div>
    </div>
    <div class="panel-content p-[12px]">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Subtitle from '/@/views/qms/report/abnormalReport/components/SubTitle.vue';
  import collapse from '/@/assets/images/collapse.png';
  import expand from '/@/assets/images/expand.png';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
    showExpand: {
      type: Boolean,
      default: true,
    },
  });
  const emit = defineEmits(['expandClick']);

  const expandClick = () => {
    emit('expandClick');
  };
</script>
<style lang="less" scoped>
  .panel {
    border-radius: 2px;
    border: 1px solid rgb(240 240 240);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .panel-title {
      padding: 8px 16px;
      background: linear-gradient(180deg, #ffede5 0%, #fff8f5 100%);
      border-bottom: 1px solid #f9e8e1;
      display: flex;
      align-items: center;

      ::v-deep(.subtitle-container) {
        padding-bottom: 0;
      }

      .collapse-expand {
        display: flex;
        align-items: center;
        color: #ff7b00;
        font-size: 14px;
        line-height: 24px;
        cursor: pointer;

        .icon {
          width: 10px;
        }
      }
    }

    .panel-content {
      flex: 1;
      overflow: scroll;
    }

    ::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
      color: transparent;
      background-color: transparent;
    }
  }
</style>
