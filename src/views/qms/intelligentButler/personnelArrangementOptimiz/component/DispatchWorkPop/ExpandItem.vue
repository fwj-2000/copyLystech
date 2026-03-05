<template>
  <div class="expand-content">
    <div class="expand-item" v-for="(item, index) in list" :key="index">
      <div class="expand-item-title"> Top{{ index + 1 }} </div>
      <div class="expand-item-content">
        <div class="expand-item-label" v-if="item.rate || item.rate === 0">Top{{ index + 1 }}{{ rateType }}：{{ item.rate }}%</div>
        <div class="expand-item-label" v-else>Top{{ index + 1 }}{{ rateType }}：/</div>
        <div class="expand-item-value">{{ t('dict.OptimalScheduleColumn.machineOperatorName') }}：{{ exitValue(item.userName) }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { exitValue } from './config';
  const { t } = useI18n();

  const props = defineProps({
    list: {
      type: Array as any,
      default: () => [],
    },
    rateType: {
      type: String,
      default: '',
    },
  });

  const { list, rateType } = toRefs(props);
</script>

<style lang="less" scoped>
  .expand-content {
    display: flex;
    border-bottom: 0;

    .expand-item {
      flex: 1;
      border-right: 1px solid #dbdbdb;
      font-size: 14px;
      padding: 0 12px;

      &:last-child {
        border-right: 0;
      }

      .expand-item-title {
        color: #ff7b00;
        font-weight: 700;
      }

      .expand-item-content {
        margin-top: 4px;
        display: flex;

        .expand-item-label {
          width: 40%;
        }

        .expand-item-value {
          flex: 1;
        }
      }
    }
  }
</style>
