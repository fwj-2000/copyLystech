<template>
  <div class="date-picker">
    <div
      v-for="(item, index) in pickerDate"
      :key="index"
      :class="['picker-item', pickerStatus === item.status ? 'active-item' : '']"
      @click="item.dateRange(item.status)">
      {{ item.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const pickerStatus = ref('week');
  const emit = defineEmits(['dateChange', 'confirm']);

  const now = dayjs();
  const dateRange = (status: string) => {
    pickerStatus.value = status;
    let days = 0;
    if (status === 'week') {
      days = 6;
    } else if (status === 'month') {
      days = 30;
    } else {
      days = 90;
    }
    const startOfWeek = now.subtract(days, 'day').startOf('day'); // 减去6天，然后设置为当天的开始（00:00:00）
    const endOfWeek = now.endOf('day'); // 设置为当天的结束（23:59:59）
    const startDate = startOfWeek.format('YYYY-MM-DD');
    const endDate = endOfWeek.format('YYYY-MM-DD');
    emit('dateChange', { startDate, endDate });
  };

  const pickerDate = ref([
    { status: 'week', name: t('dict.PastWeek'), dateRange },
    { status: 'month', name: t('dict.PastMonth'), dateRange },
    { status: 'threeMonth', name: t('dict.PastThreeMonths'), dateRange },
  ]);

  onMounted(() => {
    nextTick(() => {
      dateRange(pickerStatus.value);
    });
  });
</script>
<style lang="less" scoped>
  .date-picker {
    display: flex;
    border-left: 1px solid rgb(217 217 217);
    margin-right: 20px;

    .picker-item {
      padding: 0 20px;
      font-size: 14px;
      line-height: 30px;
      border: 1px solid rgb(217 217 217);
      border-left: none;
      cursor: pointer;
    }

    .active-item {
      color: #fff;
      background: #ff7b00;
    }
  }
</style>
