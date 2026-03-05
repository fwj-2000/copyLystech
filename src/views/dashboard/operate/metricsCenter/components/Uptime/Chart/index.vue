<!-- 开机率圆环图 -->
<template>
  <div class="compo-container flex">
    <!-- 联机率图表 -->
    <div class="left-wrapper">
      <div class="title-wrapper flex ct-start">
        <p class="text-hover" @click="goDetail({})"> {{ t('views.dashboard.operate.uptimeDetail.numberOfMachines') }}：{{ info.onlineInfo.totalNum || 0 }} </p>
        <p
          class="text-hover ml-8px"
          @click="
            goDetail({
              isonline: OnlineStatus.OFF,
            })
          ">
          {{ t('views.dashboard.operate.uptimeDetail.numberOfUnconnected') }}：{{ info.onlineInfo.totalNum - info.onlineInfo.onlineNum || 0 }}
        </p>
      </div>
      <div class="chart-wrapper">
        <Availability
          style="width: 100%; height: 100%"
          v-bind="{
            rate: parseFloat(info.onlineInfo.onlineRate) || 0.0,
            onlineNum: info.onlineInfo.onlineNum || 0,
            name: t('views.dashboard.operate.uptimeDetail.onlineConnections'),
            orgCode: info.orgCode,
          }"></Availability>
      </div>
    </div>
    <!-- 开机率图表 -->
    <div class="right-wrapper flex">
      <div v-for="(item, idx) in chartList" :key="idx" class="chart-item-wrapper flex" :style="{ width: `${100 / chartList.length}%` }">
        <Chart :ref="setRefs(idx * 2)" :options="item.option1" height="100%" style="height: 100%; width: 30%" />
        <Chart :ref="setRefs(idx * 2 + 1)" :options="item.option2" height="100%" style="height: 100%; width: 70%" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, inject, watch, onMounted } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { chartOptions, colorStyle, highlightColor, chartOptions2 } from './config';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRefs } from '/@/hooks/core/useRefs';
  import { useGo } from '/@/hooks/web/usePage';
  import decimal from 'decimal.js';

  import { PowerOnStatus } from '/@/views/dashboard/operate/types';
  import { OnlineStatus } from '../types';

  import { Chart } from '/@/components/Chart';
  import { EChartsOption } from 'echarts';

  import Availability from './Availability.vue';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const [refs, setRefs] = useRefs();
  const go = useGo();

  const DETAIL_URL = '/dashboard/operate/uptime/machineDetails';

  const props = defineProps<{
    info: any;
  }>();
  const info = ref({});

  const chartList = ref<
    {
      option1: EChartsOption;
      option2: EChartsOption;
    }[]
  >([]);

  // 获取配置1
  const getOption1 = (info): EChartsOption => {
    return {
      xAxis: {
        data: [info.name],
      },
      yAxis: {
        max: info.max,
      },
      series: [
        {
          data: [
            {
              value: info.total === 0 ? null : 0,
              itemStyle: {
                color: info.colorStyle.foot,
              },
            },
          ],
        },
        {
          data: [
            {
              value: info.total === 0 ? null : info.total,
              itemStyle: {
                color: info.colorStyle.head,
              },
            },
          ],
        },
        {
          data: [
            {
              value: info.total,
              clickable: true,
              itemStyle: {
                color: highlightColor,
              },
              routeParams: {
                type: info.name,
                isonline: OnlineStatus.ON,
              },
            },
          ],
        },
        {
          data: [
            {
              value: info.total,
              itemStyle: {
                color: info.colorStyle.bar,
              },
            },
          ],
        },
      ],
    };
  };
  // 获取配置2
  const getOption2 = (info): EChartsOption => {
    return {
      xAxis: {
        data: [t('views.dashboard.operate.uptimeDetail.freeTime'), t('views.dashboard.operate.uptimeDetail.scheduling')],
      },
      yAxis: {
        max: info.max,
      },
      series: [
        {
          data: [
            { value: info.pc },
            {
              value: info.pc,
              clickable: true,
              routeParams: {
                type: info.name,
                status: PowerOnStatus.ON,
                isonline: OnlineStatus.ON,
              },
            },
          ],
        },
        {
          data: [
            {
              value: info.kx,
              clickable: true,
              routeParams: {
                type: info.name,
                status: PowerOnStatus.OFF,
                isonline: OnlineStatus.ON,
              },
            },
            { value: info.kx },
          ],
        },
      ],
    };
  };

  // 设置图表数据
  watch(
    () => props.info,
    value => {
      const {
        WorkingRate = '0.00%',
        PlatWorkingRate = '0.00%',
        RotaryWorkingRate = '0.00%',
        PlatWorkingNum = 0,
        PlatFreeNum = 0,
        RotaryWoringNum = 0,
        RotaryFreeNum = 0,
        OnlineNum = 0,
        TotalNum = 0,
        OnlineRate = '0.00%',
        OrgCode = '',
      } = value;
      const dataInfo = [
        {
          name: t('views.dashboard.operate.uptimeDetail.rotary'),
          pc: RotaryWoringNum,
          kx: RotaryFreeNum,
          pcRate: RotaryWorkingRate,
          kxRate: `${new decimal(100).minus(new decimal(Number.parseFloat(RotaryWorkingRate)))}%`,
          total: RotaryWoringNum + RotaryFreeNum,
        },
        {
          name: t('views.dashboard.operate.uptimeDetail.flat'),
          pc: PlatWorkingNum,
          kx: PlatFreeNum,
          pcRate: PlatWorkingRate,
          kxRate: `${new decimal(100).minus(new decimal(Number.parseFloat(PlatWorkingRate)))}%`,
          total: PlatWorkingNum + PlatFreeNum,
        },
      ];
      info.value = {
        title: WorkingRate,
        orgCode: OrgCode,
        onlineInfo: {
          onlineNum: OnlineNum,
          totalNum: TotalNum,
          onlineRate: OnlineRate,
        },
        data: dataInfo,
        powerTotal: RotaryWoringNum + PlatWorkingNum,
      };
      const colorStyleList = Object.values(colorStyle);
      const max = Math.max(...dataInfo.map(item => item.total));
      chartList.value = dataInfo.reduce((pre, cur, idx) => {
        if (cur.total > 0) {
          return [
            ...pre,
            {
              option1: merge(cloneDeep(chartOptions), getOption1({ ...cur, colorStyle: colorStyleList[idx], max })),
              option2: merge(cloneDeep(chartOptions2), getOption2({ ...cur, max })),
            },
          ];
        }
        return pre;
      }, []);
    },
    { deep: true, immediate: true },
  );

  onMounted(() => {
    // 给图表绑定点击事件
    refs.value.map(ref => bindChartClick(ref));
  });

  // 图表点击事件
  const bindChartClick = chartRef => {
    if (chartRef) {
      const instance = chartRef.getInstance();
      instance?.on('click', function (params: any) {
        const { data: { clickable = false, routeParams = {} } = {} } = params;
        if (clickable) {
          goDetail(routeParams);
        }
      });
    }
  };

  // 去详情页
  const getSearchFormValue = inject('getSearchFormValue', () => {});
  const goDetail = (params = {}) => {
    const orgCode = props.info.OrgCode || 'MQ';
    const { date } = getSearchFormValue() as any;
    // 构造路由参数
    const url = `${DETAIL_URL}?${objectToQueryParams({
      orgCode,
      date: dayjs(date).format('YYYY-MM-DD'),
      ...params,
    })}`;
    go(url);
  };
</script>

<style lang="less" scoped>
  @barTitleHeight: 32px;

  .compo-container {
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: hidden;

    .left-wrapper {
      position: relative;
      width: 35%;
      height: 100%;

      .title-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        color: #666;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        height: @barTitleHeight;
        line-height: @barTitleHeight;
        white-space: nowrap;
      }

      .chart-wrapper {
        width: 100%;
        height: calc(100% - 12px);
        margin: 12px 0 24px;
      }
    }

    .right-wrapper {
      position: relative;
      z-index: 1;
      width: 65%;
      height: 80%;
      margin-top: 10%;
      flex-shrink: 1;

      .chart-item-wrapper {
        width: 50%;
        height: 100%;
        margin-right: 10px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
