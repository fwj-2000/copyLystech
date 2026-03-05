<template>
  <div class="process-box cursor-pointer" @click="goPage">
    <div v-if="props.isCurrentMonth" class="flex justify-between flex-nowrap">
      <span class="sub-title text-ellipsis text-hover" :title="`${currentMonth}月${props.keyWord}达成`"> {{ currentMonth }}月{{ props.keyWord }}达成 </span>
      <span class="sub-rate current-rate text-hover" :class="{ 'font-red': isShowRedRate }">{{ props.value || 0 }}%</span>
    </div>

    <div v-else class="flex justify-between flex-nowrap">
      <span class="sub-title text-ellipsis text-hover" :title="`${currentMonth === '1' ? '1-1' : '1-' + (+currentMonth - 1)}月实际${props.keyWord}达成`">
        {{ currentMonth === '1' ? '1-1' : `1-${+currentMonth - 1}` }}月实际{{ props.keyWord }}达成
      </span>
      <span class="sub-rate text-hover">{{ props.value || 0 }}%</span>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177 4" fill="none">
      <path
        d="M0 2C0 0.895431 0.699999 0 1.56349 0H175.437C176.3 0 177 0.895431 177 2C177 3.10457 176.3 4 175.437 4H1.56349C0.699993 4 0 3.10457 0 2Z"
        fill="#CCCCCC" />
      <path :d="processSvgPath" :fill="`url(#paint0_linear_${instanceUid})`">
        <animate
          attributeName="d"
          :from="`M0 2C0 0.895431 0.47757 0 1.06668 0H0C0.5224 0 1 0.895431 1 2C1 3.10457 0.5224 4 1 4H1.06668C0.477566 4 0 3.10457 0 2Z`"
          :to="processSvgPath"
          dur="1000ms"
          fill="freeze" />
      </path>
      <defs>
        <linearGradient :id="`paint0_linear_${instanceUid}`" x1="0" y1="2" :x2="lineLen" y2="2" gradientUnits="userSpaceOnUse">
          <stop :stop-color="linearColor.startColor" />
          <stop offset="1" :stop-color="linearColor.endColor" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts" setup>
  import type { Dayjs } from 'dayjs';

  import { computed, getCurrentInstance, inject } from 'vue';
  import { propOptions } from './config';
  import { EProgressColor } from '../config';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import dayjs from 'dayjs';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  const { goPath } = useRouteParams();
  const props = defineProps({
    currentMonth: propOptions.currentMonth,
    keyWord: propOptions.keyWord,
    colorType: propOptions.colorType,
    info: propOptions.info,
    isShowRedRate: propOptions.isShowRedRate,
    value: {
      type: Number,
      required: true,
    },
    isCurrentMonth: {
      type: Boolean,
      default: false,
    },
  });

  const currentMonth = computed(() => props.currentMonth || '1');

  const lineLen = computed(() => {
    const value = Number.isNaN(props.value) ? 0 : +props.value;
    return Math.min((value / 100) * 177, 177);
  });

  const processSvgPath = computed(() => {
    const len = lineLen.value;
    return `M0 2C0 0.895431 0.47757 0 1.06668 0H${len}C${len + 0.5224} 0 ${len + 1} 0.895431 ${len + 1} 2C${len + 1} 3.10457 ${
      len + 0.5224
    } 4 ${len} 4H1.06668C0.477566 4 0 3.10457 0 2Z`;
  });

  const linearColor = computed(() => {
    const { colorType } = props;
    const color = (EProgressColor[colorType] || '').split(',');
    return {
      startColor: color[0] || '#3969D8',
      endColor: color[1] || '#84A8FF',
    };
  });

  const instance = getCurrentInstance();
  const instanceUid = computed(() => instance && instance.uid);

  const go = useGo();
  const getSearchFormValue = inject('getSearchFormValue', () => {});
  /**
   * @description 打开对应的详情页面
   */
  function goPage() {
    const path = '/dataAnalysis/financial/profit/report';
    const searchFormValue = getSearchFormValue() as any;
    const date = searchFormValue.date instanceof dayjs ? searchFormValue.date : dayjs(searchFormValue.date).tz();
    // 根据跳转页面，创建对应的页面参数
    const query = props.isCurrentMonth
      ? {
          orgCode: props.info?.OrgCode || searchFormValue.orgCode,
          dateRange: [dayjs(date.startOf('month')), dayjs(getMqkpiEndDate(date))],
          dimension: TimeDimension.WEEK,
        }
      : {
          orgCode: props.info?.OrgCode || searchFormValue.orgCode,
          dateRange: [dayjs(date.startOf('year')), dayjs(getProfitkpiEndDate(date))],
          dimension: 'cz',
          timeDimension: TimeDimension.MONTH,
        };
    // console.log('🚀 ~ goPage ~ query:', query);
    // return;
    // 构造路由参数
    goPath(path, query);
  }
  // function goPage() {
  //   // 如果是当前月份(`props.isCurrentMonth === true`)的达成数值，跳转到[周损益报表](/dashboard/operate/profitkpi)
  //   // 如果是之前月份(`props.isCurrentMonth === false`)累计达成数值，跳转到[月损益报表](/dashboard/operate/profitkpi)
  //   const path = '/dashboard/operate/profitkpi';
  //   const searchFormValue = getSearchFormValue() as any;
  //   const date = searchFormValue.date instanceof dayjs ? searchFormValue.date : dayjs(searchFormValue.date).tz();
  //   // 根据跳转页面，创建对应的页面参数
  //   const query = props.isCurrentMonth
  //     ? {
  //         orgCode: props.info?.OrgCode || searchFormValue.orgCode,
  //         startDate: date.startOf('month').format('YYYY-MM-DD'),
  //         endDate: getMqkpiEndDate(date),
  //         timeDimension: TimeDimension.WEEK,
  //       }
  //     : {
  //         orgCode: props.info?.OrgCode || searchFormValue.orgCode,
  //         startDate: date.startOf('year').format('YYYY-MM-DD'),
  //         endDate: getProfitkpiEndDate(date),
  //         timeDimension: TimeDimension.MONTH,
  //       };
  //   // 构造路由参数
  //   const url = `${path}?${objectToQueryParams(query)}`;
  //   go(url);
  // }

  /**
   * @description 获取跳转到 [模切KPI](/dashboard/operate/mqkpi) 的结束日期
   * @param { Dayjs } date 日期
   */
  function getMqkpiEndDate(date: Dayjs) {
    const endDate = date.endOf('month');
    // 结束日期是当前年的最后一天，并且不是周日，获取当前年最后一周(不跨年)的最后一天
    return endDate.format('YYYY-MM-DD') === date.endOf('year').format('YYYY-MM-DD') && endDate.day() !== 0
      ? endDate.subtract(7, 'day').endOf('weeks').format('YYYY-MM-DD')
      : endDate.format('YYYY-MM-DD');
  }

  /**
   * @description 获取 [损益报表](/dashboard/operate/profitkpi) 的结束日期
   * @param { Dayjs } date 日期
   */
  function getProfitkpiEndDate(date: Dayjs) {
    // 当前月份是一月份，则结束日期取一月份的最后一天；如果不是，结束日期取上一个月份的最后一天
    return date.month() === 0 ? date.endOf('month').format('YYYY-MM-DD') : date.subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
  }
</script>

<style scoped lang="less">
  .process-box {
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;
    border-radius: 4px;
    padding: 9px 11px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sub-title {
    font-size: 12px;
  }

  .sub-rate {
    color: #1a1a1a;
    font-size: 14px;
    font-style: normal;
    font-weight: 550;
    line-height: normal;
  }

  .current-rate {
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .font-red {
    color: #ff4d4f;
  }
</style>
