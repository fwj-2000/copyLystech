<!-- 出勤率额外的图表信息 -->
<template>
  <template v-if="showCenter">
    <!-- 五大中心 && 模具厂 -->
    <div v-if="!isMoldEmptyData" class="w-[100%] h-[100%] flex column all-start warm-border p-6px">
      <!-- 运营图表 -->
      <div class="w-[100%] rate-info flex row ct-between">
        <p class="w-[50%] flex center">{{ moldInfo.centerAllCQRate || '0.00%' }}</p>
        <p class="w-[50%] flex center">{{ moldInfo.moldAllCQRate }}</p>
      </div>
      <div class="flex" style="width: 100%; height: calc(100% - 44px)">
        <Chart ref="chartRef4" :options="options4" height="100%" style="height: 100%; width: 50%" />
        <Chart ref="chartRef5" :options="options5" height="100%" style="height: 100%; width: 50%" />
      </div>
      <div class="w-[100%] num-info flex row ct-between">
        <p class="w-[50%] flex center mt-4px text-hover" @click="goPersonalDetailPage({ orgCode: moldInfo.centerOrgCode || '' })"
          >{{ moldInfo.centerAllZZNum }}
        </p>
        <p class="w-[50%] flex center mt-4px text-hover" @click="goPersonalDetailPage({ orgCode: moldInfo.centerOrgCode || '' })"
          >{{ moldInfo.moldAllZZNum }}
        </p>
      </div>
    </div>
    <!-- 五大中心数据 -->
    <div v-else class="relative w-[100%] h-[100%]" style="overflow: hidden">
      <div class="title-wrapper text-[12px] flex justify-between my-2px">
        <span class="mr-8px font-bold">中心部门</span>
        <div>
          <span class="mr-12px">{{ centerInfo.AllZZNum }}人</span>
          <span>{{ centerInfo.AllCQRate }}</span>
        </div>
      </div>
      <div class="w-[100%] flex column ct-start">
        <!-- 图例 -->
        <div class="pie-legend-wrapper flex column all-start text-[11px]">
          <div
            v-for="(item, idx) in state.centerPieData"
            :key="idx"
            class="item flex ct-between text-hover mt-6px"
            @click="goPersonalDetailPage({ orgCode: item.OrgCode || '' })">
            <div style="color: #666">
              <span class="legend" :style="{ backgroundColor: item.color }"></span>
              {{ item.OrgName }}:
              <span style="font-size: 12px">{{ item.AllZZNum }}</span>
            </div>
            <span class="ml-6px" style="color: #666; font-size: 12px">{{ item.AllCQRate }}</span>
          </div>
        </div>
        <!-- 饼图 -->
        <div class="absolute w-[136px] h-[156px] bottom-[-24px]">
          <highcharts :options="centerPieOptions" style="width: 100%; height: 156px" />
        </div>
      </div>
    </div>
  </template>
  <!-- 劳动类型图表 -->
  <template v-else>
    <div class="relative w-[100%] h-[100%]" style="overflow: hidden">
      <!-- 占位勿删 -->
      <div class="title-wrapper"></div>
      <div v-if="!isTypeEmptyData" class="content-wrapper flex column ct-start">
        <!-- 饼图 -->
        <div class="absolute w-[136px] h-[156px] bottom-[-16px]">
          <highcharts :options="pieOptions" style="width: 100%; height: 156px" />
        </div>
        <!-- 图例 -->
        <div class="pie-legend-wrapper flex column all-start text-[11px]">
          <div class="item flex ct-between text-hover mt-6px" @click="goPersonalDetailPage({ type: '正式工', orgCode: info.OrgCode })">
            <div style="color: #666">
              <span class="legend legend1"></span>
              正式工:
              <span style="font-size: 14px">{{ info.DLZhengshiZZNum }}</span>
            </div>
            <span class="ml-6px" style="color: #666; font-size: 14px">{{ info.DLZhengshiCQRate }}</span>
          </div>
          <div class="item flex ct-between text-hover mt-6px" @click="goPersonalDetailPage({ type: '派遣工', orgCode: operateInfo.OrgCode })">
            <div style="color: #666">
              <span class="legend legend2"></span>
              派遣工:
              <span style="font-size: 14px">{{ info.DLPaiqianZZNum }}</span>
            </div>
            <span class="ml-6px" style="color: #666; font-size: 14px">{{ info.DLPaiqianCQRate }}</span>
          </div>
          <div class="item flex ct-between text-hover mt-6px" @click="goPersonalDetailPage({ type: '临时工', orgCode: info.OrgCode })">
            <div style="color: #666">
              <span class="legend legend3"></span>
              临时工:
              <span style="font-size: 14px">{{ info.DLLinshiZZNum }}</span>
            </div>
            <span class="ml-6px" style="color: #666; font-size: 14px">{{ info.DLLinshiCQRate }}</span>
          </div>
        </div>
      </div>
      <!-- 数据为空展示 -->
      <emptyData v-else></emptyData>
    </div>
  </template>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { computed, ref, watch, reactive } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { cloneDeep, isEmpty, merge } from 'lodash-es';
  import { basePieOptions, baseOptions4, baseOptions5 } from './config';

  import { Chart } from '/@/components/Chart';
  import { objectToQueryParams } from '../../../../utils';

  interface IProps {
    operateInfo: any;
    centerInfo: any;
    modelInfo: any;
    queryInfo: any;
  }
  const props = withDefaults(defineProps<IProps>(), {
    operateInfo: {},
    centerInfo: {},
    modelInfo: {},
    queryInfo: {},
  });

  const go = useGo();
  let pieOptions = {}; // 劳动类型饼图
  let centerPieOptions = {}; // 五大中心饼图
  const options4 = ref({});
  const options5 = ref({});
  const moldInfo = ref({
    centerAllCQRate: '0.00%',
    centerAllZZNum: 0,
    centerOrgCode: '',
    moldAllCQRate: '0.00%',
    moldAllZZNum: 0,
    moldOrgCode: '',
  });

  const centerInfo = ref({
    OrgCode: '',
    AllZZNum: '0',
    AllCQRate: '0.00%',
  });
  const isMoldEmptyData = ref(true);
  const isTypeEmptyData = ref(true);
  const showCenter = ref(true);
  const state: {
    centerPieData: any[];
  } = reactive({
    centerPieData: [],
  });

  // 初始化正式工出勤数据
  const initRightChartData = data => {
    isTypeEmptyData.value = false;
    if (isEmpty(data)) {
      return;
    }
    const { DLPaiqianZZNum, DLLinshiZZNum, DLZhengshiZZNum } = data;
    const handlePieOptions = {
      series: [
        {
          data: [{ y: DLPaiqianZZNum }, { y: DLLinshiZZNum }, { y: DLZhengshiZZNum }],
        },
      ],
    };
    pieOptions = merge(cloneDeep(basePieOptions), handlePieOptions);
  };

  // 初始化五大中心饼图
  const initCenterData = centerData => {
    const centerParentInfo = centerData[0] || {};
    centerInfo.value = {
      OrgCode: centerParentInfo.ParentOrgCode,
      AllZZNum: centerParentInfo.ParentAllZZNum,
      AllCQRate: centerParentInfo.ParentAllCQRate,
    };
    const colors = ['#00A0AA', '#884BEC', '#46AAF2', '#EFC56C', '#E08D73', '#54B45F'];
    state.centerPieData = centerData.map((item, idx) => ({
      OrgName: item.OrgName,
      OrgCode: item.OrgCode,
      AllZZNum: item.AllZZNum,
      AllCQNum: item.AllCQNum,
      AllCQRate: item.AllCQRate,
      color: colors[idx],
    }));
    const handlePieOptions = {
      series: [
        {
          data: centerData.map((item, idx) => ({
            y: item.AllZZNum,
            name: item.OrgName,
            color: colors[idx],
          })),
        },
      ],
    };
    centerPieOptions = merge(cloneDeep(basePieOptions), handlePieOptions);
  };
  // 初始化五大中心&模具厂的数据
  const initMoldData = (centerData, moldData) => {
    isMoldEmptyData.value = isEmpty(moldData);
    if (isMoldEmptyData.value) {
      initCenterData(centerData);
      return;
    }
    const centerParentInfo = centerData[0] || {};
    const moldParentInfo = moldData[0] || {};
    // 五大中心
    const centerAllCQRate = Number.parseFloat(moldParentInfo?.ParentAllCQRate) || 0.0;
    options4.value = merge(cloneDeep(baseOptions4), {
      xAxis: {
        data: ['五大中心'],
      },
      yAxis: {
        max: 100,
      },
      series: [
        {},
        { data: [centerAllCQRate] },
        {
          data: [
            {
              value: centerAllCQRate,
              tooltips: centerData.map(item => ({
                name: item.OrgName,
                orgCode: item.OrgCode,
                cqRate: item.AllCQRate,
                cqNum: item.AllCQNum,
                zzNum: item.AllZZNum,
                instanceName: 'center', // 给tooltip全局事件用
              })),
            },
          ],
        },
      ],
    });

    // 模具厂
    const moldAllCQRate = Number.parseFloat(moldParentInfo?.ParentAllCQRate) || 0.0;
    options5.value = merge(cloneDeep(baseOptions5), {
      xAxis: {
        data: ['模具厂'],
      },
      yAxis: {
        max: 100,
      },
      series: [
        {},
        { data: [moldAllCQRate] },
        {
          data: [
            {
              value: moldAllCQRate,
              tooltips: moldData.map(item => ({
                name: item.OrgName,
                orgCode: item.OrgCode,
                cqRate: item.AllCQRate,
                cqNum: item.AllCQNum,
                zzNum: item.AllZZNum,
                instanceName: 'mold', // 给tooltip全局事件用
              })),
            },
          ],
        },
      ],
    });
    moldInfo.value = {
      centerAllCQRate: centerParentInfo?.ParentAllCQRate || '0.00%',
      centerAllZZNum: centerParentInfo?.ParentAllZZNum || 0,
      centerOrgCode: centerParentInfo?.ParentOrgCode || '',
      moldAllCQRate: moldParentInfo?.ParentAllCQRate || '0.00%',
      moldAllZZNum: moldParentInfo?.ParentAllZZNum || 0,
      moldOrgCode: moldParentInfo?.ParentOrgCode || '',
    };
  };

  const info = computed(() => {
    return props.operateInfo;
  });

  watch(
    () => props,
    () => {
      const { operateInfo, centerInfo, modelInfo } = props;
      if (!isEmpty(operateInfo)) {
        // 没有五大中心的数据就显示劳动类型图表
        showCenter.value = !isEmpty(centerInfo);
        if (!showCenter.value) {
          initRightChartData(operateInfo);
        }
      }
      // 初始化模具厂&五大中心的数据
      initMoldData(centerInfo, modelInfo);
    },
    { immediate: true, deep: true },
  );

  // 打开新标签页
  const goPage = (path, params = {}) => {
    if (!path) return;
    const { orgCode = '', date = dayjs().tz().subtract(1, 'day'), timeDimension = 'day' } = props.queryInfo;
    // 构造路由参数
    const url = `${path}?${objectToQueryParams({
      orgCode,
      dimension: timeDimension,
      date: date.format('YYYY-MM-DD'),
      ...params,
    })}`;
    go(url);
  };

  // 打开人力出勤详情页
  const goPersonalDetailPage = (params = {}) => {
    const { date = dayjs().tz().subtract(2, 'day'), timeDimension = 'day' } = props.queryInfo;
    goPage('/dashboard/operate/attendanceRate/personnelDetail', {
      dimension: timeDimension,
      date: date.format('YYYY-MM-DD'),
      // status: 1, //查出勤人员信息
      ...params,
    });
  };
</script>

<style lang="less" scoped>
  .pie-legend-wrapper {
    position: relative;
    z-index: 2;
    width: 100%;
    flex-wrap: wrap;

    .item {
      position: relative;
      z-index: 1;
      width: 100%;
      color: #666;
      font-size: 12px;

      .legend {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 2px;

        &.legend1 {
          background: #2eaadd;
        }

        &.legend2 {
          background: #4bc8a0;
        }

        &.legend3 {
          background: #eec364;
        }

        &.legend4 {
          background: #3b90df;
        }

        &.legend5 {
          background: #97e498;
        }
      }
    }
  }
</style>
