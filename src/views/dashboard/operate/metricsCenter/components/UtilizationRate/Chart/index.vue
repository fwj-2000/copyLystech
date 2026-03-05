<!-- AOI稼动图表 -->
<template>
  <div class="content-wrapper">
    <!-- 数值展示 -->
    <div class="value-list-container">
      <ValueList
        v-bind="{
          list: valueList,
          valueClickable: true,
          valueClickMth: goPage,
        }" />
    </div>
    <div class="chart-wrapper mt-[6px]">
      <div v-for="(info, idx) in chartData" :key="idx" class="process-wrapper flex">
        <div class="name">{{ info.label }}</div>
        <div class="chart">
          <div class="label flex" :style="{ width: `${info.value}%` }">{{ info.value }}%</div>
          <Process :clipPathId="`rate-${props.info?.OrgCode}-${idx}`" :rate="info.value"></Process>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ValueList from '/@/views/dashboard/operate/components/styleItem/src/ValueList.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import Process from './Process.vue';
  import { computed, inject } from 'vue';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
  import dayjs from 'dayjs';

  import { PowerOnStatus } from '/@/views/dashboard/operate/types';

  const props = defineProps<{
    info: any;
  }>();

  const go = useGo();
  const getSearchFormValue = inject('getSearchFormValue', () => {});
  const getExtraParams = inject('getExtraParams', () => {});

  // 跳转页面
  const goPage = (params = {}) => {
    const { date, orgCode } = getSearchFormValue() as any;
    const extraParams = getExtraParams() as any;
    // 构造路由参数
    const url = `/dashboard/operate/utilizationRate/infoDetail?${objectToQueryParams({
      orgCode: props.info?.OrgCode || orgCode || 'MQ',
      date: dayjs(date).format('YYYY-MM-DD'),
      ...params,
      ...extraParams,
    })}`;
    go(url);
  };
  const chartData = computed(() => {
    return [
      {
        label: '联机率',
        value: formatValue(props.info.Lianjilv),
      },
      {
        label: '开机率',
        value: formatValue(props.info.Kaijilv),
      },
      {
        label: '稼动率',
        value: formatValue(props.info.Jitaijiadonglv),
      },
      {
        label: '良率',
        value: formatValue(props.info.Lianglv),
      },
    ];
  });

  const valueList = computed(() => {
    return [
      {
        label: '开机数',
        value: props.info.Kaijibanci || props.info.KaijiNum || 0,
        params: { status: PowerOnStatus.ON },
      },
      {
        label: '联机数',
        value: props.info.ActiveMachines30Days || 0,
        params: { lianjistatu: PowerOnStatus.ON },
      },
      {
        label: '总机台数',
        value: props.info.Totaldevices || props.info.MachNum || 0,
        // params: { status: PowerOnStatus.OFF },
      },
    ];
  });

  // 格式化后台返回数据
  const formatValue = (value: string | number) => {
    if (!value) return 0;
    const valueStr = typeof value === 'number' ? value.toFixed(2).toString() : value.toString();
    return Number.parseFloat(valueStr.split(' ')[0]) || 0;
  };
</script>

<style lang="less" scoped>
  @valueHeight: 60px;

  .content-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 8px;
  }

  .chart-wrapper {
    width: 100%;
    height: calc(100% - @valueHeight - 6px);

    .process-wrapper {
      width: 100%;
      height: 20%;
      margin-top: 2%;

      .name {
        width: 25%;
        min-width: 68px;
        white-space: nowrap;
      }

      .chart {
        position: relative;
        width: 100%;
        margin-left: 12px;

        .label {
          position: absolute;
          top: -18px;
          min-width: 44px;
          max-width: 100%;
        }
      }
    }
  }
</style>
