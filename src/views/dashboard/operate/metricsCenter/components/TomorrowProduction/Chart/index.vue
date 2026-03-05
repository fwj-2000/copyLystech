<!--  -->
<template>
  <div class="charts-container flex ct-start">
    <!-- 左边svg图表 -->
    <RingChart height="100%" class="left-chart-wrapper" />
    <!-- 中间图例 -->
    <div class="legend-wrapper flex column">
      <div v-for="(item, idx) in valueList" class="item-wrapper" :key="idx">
        <p class="title mb-4px">{{ item.title }}</p>
        <div class="content">
          <div v-for="(legend, lIdx) in item.data" :key="lIdx" class="legend-item flex ct-between">
            <div class="flex ct-start mr-6px">
              <span class="legend mr-6px" :style="{ backgroundColor: legend.color }"></span>
              <p>{{ legend.label }}</p>
            </div>
            <p>{{ legend.value }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 右边图表 -->
    <div class="right-chart-wrapper">
      <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref } from 'vue';
  import { EChartsOption } from 'echarts';

  import { getOptions } from './config';

  import RingChart from './Ring.vue';
  import { Chart } from '/@/components/Chart';

  const { t } = useI18n();
  const chartInfo = [
    {
      category: '仓库',
      data: [
        { name: 'Pending', value: 40 },
        { name: 'Ok', value: 20 },
        { name: 'Ongoing', value: 80 },
      ],
    },
    {
      category: '模具',
      data: [
        { name: 'Pending', value: 20 },
        { name: 'Ok', value: 20 },
        { name: 'Ongoing', value: 20 },
      ],
    },
    {
      category: '分切',
      data: [
        { name: 'Pending', value: 20 },
        { name: 'Ok', value: 20 },
        { name: 'Ongoing', value: 20 },
      ],
    },
    {
      category: '模切',
      data: [
        { name: 'Pending', value: 20 },
        { name: 'Ok', value: 20 },
        { name: 'Ongoing', value: 20 },
      ],
    },
  ];
  const options = ref<EChartsOption>(getOptions(chartInfo));

  const valueList = ref([
    {
      title: t('views.dashboard.operate.tomorrowProductionPreparation.dayShift'),
      data: [
        { label: 'Ongoing', value: 3, color: '#4fc7f2' },
        { label: 'Ok', value: 2, color: '#d8d8d8' },
      ],
    },
    {
      title: t('views.dashboard.operate.tomorrowProductionPreparation.nightShift'),
      data: [
        { label: 'Ongoing', value: 3, color: '#6590f2' },
        { label: 'Ok', value: 2, color: '#d8d8d8' },
      ],
    },
  ]);
</script>
<style lang="less" scoped>
  .charts-container {
    width: 100%;
    height: 100%;
    padding: 0 6px;

    .legend-wrapper {
      width: 25%;
      height: 100%;
      padding-right: 5%;

      .item-wrapper {
        width: 100%;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .content {
        width: 100%;
        padding: 8px;
        background-color: #f2f2f2;
        border-radius: 6px;
        overflow: hidden;

        .legend-item {
          .legend {
            display: inline-block;
            width: 8px;
            height: 8px;
          }
        }
      }

      .title {
        color: #666;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }

    .left-chart-wrapper {
      width: 35%;
      height: 100%;
    }

    .right-chart-wrapper {
      width: 40%;
      height: 100%;
    }
  }
</style>
