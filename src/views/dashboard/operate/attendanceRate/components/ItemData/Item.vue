<!-- 单个单图表样式 -->
<template>
  <div class="flex" style="width: 100%; height: 100%">
    <div class="chart-wrapper flex column">
      <div class="info flex row ct-around mb-6px" style="width: 100%"> 总在职人数：{{ props.info.AllZZNum }}人 </div>
      <div class="flex" style="width: 100%; height: calc(100% - 54px)">
        <Chart ref="chartRef1" :options="state.options2" height="100%" style="height: 100%; width: 50%" />
        <Chart ref="chartRef2" :options="state.options" height="100%" style="height: 100%; width: 50%" />
      </div>
      <div class="info rate-info flex row ct-between" style="margin-bottom: 12px">
        <!-- <p class="label">(人)</p> -->
        <p class="text-hover" @click="goPersonalDetailPage('IDL')">{{ props.info.IDLCQNum + props.info.IDLQQNum }}</p>
        <p class="text-hover" @click="goPersonalDetailPage('DL')">{{ props.info.DLCQNum + props.info.DLQQNum }}</p>
      </div>
    </div>
    <div class="chart-right-wrapper">
      <div class="flex column ct-start" style="height: 85%">
        <div class="info flex row ct-between text-hover" @click="goPersonalDetailPage('正式工')">
          <div style="color: #666" class="mr-6px">
            <span class="legend legend1"></span>
            正式工:
            <span style="font-size: 14px">{{ props.info.DLZhengshiCQNum }}/{{ props.info.DLZhengshiZZNum }}</span>
          </div>
          <span style="color: #666; font-size: 14px">{{ props.info.DLZhengshiCQRate }}</span>
        </div>
        <div class="info flex row ct-between text-hover" @click="goPersonalDetailPage('派遣工')">
          <div style="color: #666" class="mr-6px">
            <span class="legend legend2"></span>
            派遣工:
            <span style="font-size: 14px">{{ props.info.DLPaiqianCQNum }}/{{ props.info.DLPaiqianZZNum }}</span>
          </div>
          <span style="color: #666; font-size: 14px">{{ props.info.DLPaiqianCQRate }}</span>
        </div>
        <div class="info flex row ct-between text-hover" @click="goPersonalDetailPage('临时工')">
          <div style="color: #666" class="mr-6px">
            <span class="legend legend3"></span>
            临时工:
            <span style="font-size: 14px">{{ props.info.DLLinshiCQNum }}/{{ props.info.DLLinshiZZNum }}</span>
          </div>
          <span style="color: #666; font-size: 14px">{{ props.info.DLLinshiCQRate }}</span>
        </div>
      </div>
      <div class="chart-container flex">
        <highcharts :options="pieOptions" :data-highcharts-chart="props.info.Factory" style="height: 90%; width: 100%; margin-top: 20%" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch, nextTick, inject } from 'vue';
  import { baseOptions, baseOptions2, basePieOptions } from './config';
  import { cloneDeep, merge } from 'lodash-es';
  import { useGo } from '/@/hooks/web/usePage';
  import { Chart } from '/@/components/Chart';
  import dayjs from 'dayjs';
  const go = useGo();
  interface ChartInstance extends InstanceType<typeof Chart> {}
  const chartRef1 = ref<ChartInstance | null>(null);
  const chartRef2 = ref<ChartInstance | null>(null);

  const getSearchFormValue = inject('getSearchFormValue', () => ({}));

  const state = reactive({
    options: {},
    options2: {},
  });
  const props = defineProps({
    info: {
      type: Object,
      required: true,
    },
    searchFormValue: {
      type: Object,
      default: () => {},
    },
  });
  let pieOptions = {};

  const handleChartClick = instance => {
    instance?.on('click', function (params: any) {
      const {
        data: { name: type, orgCode },
      } = params;
      if (!type) return;
      // 隐藏 tooltips
      instance?.dispatchAction({
        type: 'hideTip',
      });
      // 跳转到人员详情
      const { date = dayjs().tz().subtract(1, 'day'), timeDimension = 'day' } = getSearchFormValue() as any;
      go(`/dashboard/operate/attendanceRate/personnelDetail?&dimension=${timeDimension}&date=${date.format('YYYY-MM-DD')}&type=${type}&orgCode=${orgCode}`);
    });
  };

  watch(
    () => props.info,
    async value => {
      const {
        OrgCode: orgCode,
        DL1ZZNum,
        DL2ZZNum,
        DL1CQNum,
        DL2CQNum,
        DLCQNum,
        DLQQNum,
        IDL1CQNum,
        IDL2CQNum,
        IDL3CQNum,
        IDLCQNum,
        IDLQQNum,
        IDL1ZZNum,
        IDL2ZZNum,
        IDL3ZZNum,
        MQCQNum,
        SGCQNum,
        MQZZNum,
        SGZZNum,
        DLPaiqianZZNum,
        DLLinshiZZNum,
        DLZhengshiZZNum,
      } = value;
      const DLZZNum = DLCQNum + DLQQNum;
      const IDLZZNum = IDLCQNum + IDLQQNum;
      const max = DLZZNum + IDLZZNum;
      // DL 图表数据
      const handleOptions = {
        yAxis: {
          max,
        },
        series: [
          { data: [DL1CQNum + DL2CQNum === 0 ? null : 0] },
          { data: [MQCQNum + SGCQNum === 0 ? null : 0] },
          { data: [DL2CQNum || null] },
          { data: [MQCQNum || null] },
          { data: [DL1CQNum + DL2CQNum || null] },
          { data: [MQCQNum + SGCQNum || null] },
          {
            data: [
              {
                value: DL2CQNum,
                qq: DL2ZZNum - DL2CQNum,
                orgCode,
              },
            ],
          }, // DL1
          {
            data: [
              {
                value: DL1CQNum,
                qq: DL1ZZNum - DL1CQNum,
                orgCode,
              },
            ],
          }, // DL2
          {
            data: [
              {
                value: MQCQNum,
                qq: MQZZNum - MQCQNum,
                orgCode,
              },
            ],
          }, // 模切
          {
            data: [
              {
                value: SGCQNum,
                qq: SGZZNum - SGCQNum,
                orgCode,
              },
            ],
          },
        ],
      };
      // IDL 图表数据
      const handleOptions2 = {
        yAxis: {
          max,
        },
        series: [
          { data: [IDL1CQNum + IDL2CQNum + IDL3CQNum === 0 ? null : 0] },
          { data: [IDL1CQNum || null] },
          { data: [IDL1CQNum + IDL2CQNum || null] },
          { data: [IDL1CQNum + IDL2CQNum + IDL3CQNum || null] },
          {
            data: [
              {
                value: IDL1CQNum,
                qq: IDL1ZZNum - IDL1CQNum,
                orgCode,
              },
            ],
          }, // IDL1
          {
            data: [
              {
                value: IDL2CQNum,
                qq: IDL2ZZNum - IDL2CQNum,
                orgCode,
              },
            ],
          }, // IDL2
          {
            data: [
              {
                value: IDL3CQNum,
                qq: IDL3ZZNum - IDL3CQNum,
                orgCode,
              },
            ],
          }, // IDL3
        ],
      };
      // 处理过后填充的数据
      const handlePieOptions = {
        series: [
          {
            data: [{ y: DLPaiqianZZNum }, { y: DLLinshiZZNum }, { y: DLZhengshiZZNum }],
          },
        ],
      };
      state.options = merge(cloneDeep(baseOptions), handleOptions);
      state.options2 = merge(cloneDeep(baseOptions2), handleOptions2);
      pieOptions = merge(cloneDeep(basePieOptions), handlePieOptions);
      await nextTick();
      if (chartRef1.value) {
        const instance = chartRef1.value?.getInstance();
        handleChartClick(instance);
      }
      if (chartRef2.value) {
        const instance = chartRef2.value?.getInstance();
        handleChartClick(instance);
      }
    },
    { immediate: true },
  );

  // 打开人力出勤详情页
  const goPersonalDetailPage = type => {
    const { date = dayjs().tz().subtract(2, 'day'), timeDimension = 'day' } = getSearchFormValue() as any;
    const orgCode = props.info.OrgCode;
    go(`/dashboard/operate/attendanceRate/personnelDetail?&dimension=${timeDimension}&date=${date.format('YYYY-MM-DD')}&type=${type}&orgCode=${orgCode || ''}`);
  };
</script>

<style lang="less" scoped>
  .chart-right-wrapper {
    position: relative;
    width: 60%;
    height: 100%;

    .chart-container {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
    }

    .info {
      position: relative;
      z-index: 1;
      width: 80%;
      color: #1a1a1a;
      font-size: 11px;
      flex-wrap: wrap;

      .legend {
        display: inline-block;
        width: 8px;
        height: 8px;

        &.legend1 {
          background: linear-gradient(37deg, #00d6d0 23.36%, #00aae2 90.54%);
        }

        &.legend2 {
          background: #4676e6;
        }

        &.legend3 {
          background: #eec56b;
        }
      }
    }
  }

  .chart-wrapper {
    width: 40%;
    height: 100%;

    .rate-info {
      p {
        width: 50%;
        text-align: center;
      }
    }

    .info {
      width: 100%;
      color: #1a1a1a;
      font-size: 11px;

      .label {
        color: #999;
      }
    }
  }
</style>

<style lang="less">
  .uptime-center-tooltips {
    .content-container {
      color: #1a1a1a;
      font-size: 14px !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' !important;
      font-style: normal;
      font-weight: 400;

      .item-container {
        width: 282px;
        padding: 10px 12px;
        background: #f2f2f2;
        margin: 6px 12px 6px 0;

        .item {
          &.style1 {
            color: '#1a1a1a';
          }

          &.style2 {
            color: '#666';
          }
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
