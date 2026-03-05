<!-- 问题分析浮窗 -->
<template>
  <div class="content">
    <a-spin v-if="loading" />
    <div v-else>
      <p class="item" v-for="(p, pidx) in infoList" :key="pidx">{{ p }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref } from 'vue';
  import { getProblemInfo } from '/@/api/dashbord/report';

  import { isEmpty } from 'lodash-es';

  const infoList = ref<any[]>([]);
  const loading = ref(true);
  const props = withDefaults(
    defineProps<{
      record: any;
      column: any;
      searchFormValue: any;
    }>(),
    {
      record: {},
      column: {},
      searchFormValue: {},
    },
  );
  const { column, record, searchFormValue } = props;

  getProblemInfo({
    startTime: dayjs(column.dataIndex).tz().valueOf(),
    endTime: dayjs(column.dataIndex).tz().valueOf(),
    target: record.category,
    orgCode: searchFormValue.orgCode,
  })
    .then(res => {
      const { data = [] } = res;
      if (isEmpty(data)) {
        infoList.value = ['暂无数据'];
        return;
      }
      infoList.value = data;
    })
    .finally(() => (loading.value = false));
</script>

<style lang="less" scoped>
  .content {
    // padding: 6px 0;
    .item {
      color: #666;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      padding: 12px 16px;
      background-color: #f2f2f2;
      border-radius: 4px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
