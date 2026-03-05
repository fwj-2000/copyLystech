<template>
  <div class="OEE-rate h-[100%] pl-[12px] pr-[12px] pb-[40px]">
    <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
    <div class="legend-container">
      <div class="legend-item">
        <div class="legend-color color1"></div>
        <div class="legend-text">{{ t('dict.UtilizationRateColumn.equipmentUtilization') }}: {{ chartData.utilizationRateSum }}%</div>
      </div>
      <div class="legend-item">
        <div class="legend-color color2"></div>
        <div class="legend-text">{{ t('dict.CommonCol.dieCuttingEfficiency') }}: {{ chartData.currentProductionEfficiencyRate }}%</div>
      </div>
      <div class="legend-item">
        <div class="legend-color color3"></div>
        <div class="legend-text">{{ t('dict.CommonCol.productPassRate') }}: {{ chartData.currentYieldRate }}%</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { Chart } from '/@/components/Chart';
  import { useI18n } from '/@/hooks/web/useI18n';
  import bubbleSrc from '/@/assets/images/lockScreen/OEE_bg.png';
  import { merge } from 'lodash-es';

  const { t } = useI18n();

  const options = ref({});

  const props = defineProps({
    utilizationAchievementInfo: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: () => ({
        utilizationRateSum: 0,
        currentProductionEfficiencyRate: 0,
        currentYieldRate: 0,
        oeeUtilizationRate: 0,
        oeeYieldRate: 0,
        oeeEfficiencyRate: 0,
        oee: 0,
      }),
    },
    activeKey: {
      type: String,
      default: '',
    },
  });

  const initChart = () => {
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      // legend: {
      //   data: [t('dict.UtilizationRateColumn.equipmentUtilization'), t('dict.CommonCol.dieCuttingEfficiency'), t('dict.CommonCol.productPassRate')],
      //   orient: 'horizontal',
      //   left: 'center',
      //   bottom: '-6',
      //   itemWidth: 10,
      //   itemHeight: 10,
      //   icon: 'circle',
      // },
      color: ['rgba(56, 116, 255)', 'rgba(94, 190, 255)', 'rgba(255, 123, 0)'], // 外环配色
      series: [
        /* 外环指标 */
        {
          name: t('dict.CommonCol.comprehensiveIndicator'),
          type: 'pie',
          radius: ['50%', '75%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{c}%',
            // position: 'inner',
            fontSize: 12,
            color: '#000',
          },
          // data: [
          //   { value: 90, name: '机台稼动率' },
          //   { value: 20, name: '模切效率' },
          //   { value: 60, name: '产品合格率' },
          // ],
          emphasis: { scale: true },
        },
      ],
      /* 圆心固定显示 OEE */
      graphic: [
        {
          type: 'image',
          z: -1,
          left: 'center',
          top: 'middle',
          style: {
            image: bubbleSrc,
            width: 130,
            height: 130,
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '46%',
          style: {
            // 动态
            text: '20%',
            fontSize: '28px',
            fill: '#FF7B00',
            textAlign: 'center',
          },
        },
        {
          type: 'text',
          // z: 100,
          left: 'center',
          top: '56%',
          style: {
            text: 'OEE',
            fontSize: '16px',
            fill: '#000',
            textAlign: 'center',
          },
        },
      ],
    };
  };

  const setChartOption = () => {
    options.value = merge({}, initChart(), {
      series: [
        {
          data: [
            {
              value: props.chartData.oeeUtilizationRate,
              name: t('dict.UtilizationRateColumn.equipmentUtilization'), // 机台稼动率
            },
            {
              value: props.chartData.oeeEfficiencyRate,
              name: t('dict.CommonCol.dieCuttingEfficiency'), // 模切效率
            },
            {
              value: props.chartData.oeeYieldRate,
              name: t('dict.CommonCol.productPassRate'), // 产品合格率
            },
          ],
        },
      ],
      graphic: [{}, { style: { text: props.chartData.oee + '%' } }],
    });
  };

  watch(
    () => props.chartData,
    () => {
      setChartOption();
    },
    { immediate: true, deep: true },
  );

  onMounted(() => {
    // initChart();
  });
</script>
<style lang="less" scoped>
  .OEE-rate {
    position: relative;

    .legend-container {
      position: absolute;
      width: 100%;
      bottom: 10px;
      display: flex;
      justify-content: center;

      .legend-item {
        display: flex;
        align-items: center;
        margin-right: 10px;

        .legend-color {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 4px;
        }

        .color1 {
          background-color: #3874ff;
        }

        .color2 {
          background-color: #5ebeff;
        }

        .color3 {
          background-color: #ff7b00;
        }

        .legend-text {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
</style>
