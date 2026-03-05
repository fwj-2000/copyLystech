<!-- 出勤概况 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead
        v-bind="{
          title: t('views.dashboard.operate.attendanceProfile') || '',
          mainPage: '/dashboard/operate/processYield',
          clickMth: goPage,
        }">
        <template #left>
          <div class="flex ct-start">
            <span class="text-hover" @click="goPage('/dashboard/operate/attendanceRate')"> {{ t('views.dashboard.operate.attendanceProfile') }} </span>
            <div v-if="showTitleInfo" class="sub-title ml-16px">
              <span class="mr-16px">在职{{ info.ParentAllZZNum }}人</span>
              <span>出勤{{ info.ParentAllCQRate }}</span>
            </div>
          </div>
        </template>
        <template #right>
          <img :src="rankSvg" class="zoom-icon mr-8px" @click="goPage('/dashboard/operate/ranking', { name: EModules.ATTENDANCE })" />
          <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPage('/dashboard/operate/attendanceRate/detail')" />
          <a-popover placement="right">
            <template #content>
              <RatePopover />
            </template>
            <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
          </a-popover>
        </template>
      </CompoHead>
    </div>
    <div class="compo-body">
      <!-- 内容封装组件 -->
      <SpinContent
        v-bind="{
          loading,
          isEmptyData,
          showList: false,
        }">
        <div class="compo-content-container flex">
          <div class="left-container content-container flex column all-start">
            <div class="title-wrapper">
              <span class="mr-16px">运营</span>
              <span v-if="!isOperateEmptyData" class="mr-12px text-hover" @click="goPersonalDetailPage('', info.OrgCode)">{{ info.AllZZNum }}人</span>
              <span class="mr-12px">{{ info.AllCQRate }}</span>
            </div>
            <div v-if="!isOperateEmptyData" class="content-wrapper flex ct-start">
              <!-- 运营图表 -->
              <div class="chart-wrapper flex column">
                <div class="info rate-info flex row ct-between">
                  <p>{{ info.IDLCQRate }}</p>
                  <p>{{ info.DLCQRate }}</p>
                </div>
                <div class="flex" style="width: 100%; height: calc(100% - 48px)">
                  <Chart ref="chartRef1" :options="options2" height="100%" style="height: 100%; width: 50%" />
                  <Chart ref="chartRef2" :options="options" height="100%" style="height: 100%; width: 50%" />
                </div>
                <div class="info num-info flex row ct-between">
                  <p class="mt-4px text-hover" @click="goPersonalDetailPage('IDL', info.OrgCode)">{{ info.IDLCQNum + info.IDLQQNum }} </p>
                  <p class="mt-4px text-hover" @click="goPersonalDetailPage('DL', info.OrgCode)">{{ info.DLCQNum + info.DLQQNum }} </p>
                </div>
              </div>
              <!-- 运营图例 -->
              <div class="legend-wrapper flex column ct-between">
                <div class="head-wrapper"> IDL : DL = {{ info.IDLvsDL }} </div>
                <div class="body-wrapper flex column item-start ct-between">
                  <div class="title text-hover" @click="goPersonalDetailPage('IDL', info.OrgCode)">IDL</div>
                  <div class="info-container flex column item-start">
                    <div class="flex ct-between" style="width: 100%">
                      <div class="item flex ct-start text-hover" @click="goPersonalDetailPage('IDL1', info.OrgCode)">
                        <span class="legend legend1 mr-4px" />
                        <span class="name">IDL1: </span>
                        <span class="value">{{ info.IDL1CQNum }}/{{ info.IDL1ZZNum }}</span>
                        <span class="name ml-12px">{{ getRate(info.IDL1CQNum, info.IDL1ZZNum) }}</span>
                      </div>
                      <div class="item flex ct-start text-hover" @click="goPersonalDetailPage('IDL3', info.OrgCode)">
                        <span class="legend legend3 mr-4px" />
                        <span class="name">IDL3: </span>
                        <span class="value">{{ info.IDL3CQNum }}/{{ info.IDL3ZZNum }}</span>
                        <span class="name ml-12px">{{ getRate(info.IDL3CQNum, info.IDL3ZZNum) }}</span>
                      </div>
                    </div>
                    <div class="flex ct-between" style="width: 100%">
                      <div class="item flex ct-start text-hover" @click="goPersonalDetailPage('IDL2', info.OrgCode)">
                        <span class="legend legend2 mr-4px" />
                        <span class="name">IDL2: </span>
                        <span class="value">{{ info.IDL2CQNum }}/{{ info.IDL2ZZNum }}</span>
                        <span class="name ml-12px">{{ getRate(info.IDL2CQNum, info.IDL2ZZNum) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="title text-hover" @click="goPersonalDetailPage('DL', info.OrgCode)">DL</div>
                  <div class="info-container flex ct-between">
                    <div>
                      <div class="item flex ct-between text-hover" @click="goPersonalDetailPage('DL1', info.OrgCode)">
                        <div class="flex ct-between">
                          <span class="legend legend1 mr-4px" />
                          <span class="name">DL1: </span>
                          <span class="value">{{ info.DL1CQNum }}/{{ info.DL1ZZNum }}</span>
                        </div>
                        <span class="name ml-12px">{{ getRate(info.DL1CQNum, info.DL1ZZNum) }}</span>
                      </div>
                      <div class="item flex ct-between text-hover" @click="goPersonalDetailPage('DL2', info.OrgCode)">
                        <div class="flex ct-between">
                          <span class="legend legend2 mr-4px" />
                          <span class="name">DL2: </span>
                          <span class="value">{{ info.DL2CQNum }}/{{ info.DL2ZZNum }}</span>
                        </div>
                        <span class="name ml-12px">{{ getRate(info.DL2CQNum, info.DL2ZZNum) }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="item flex ct-between text-hover" @click="goPersonalDetailPage('手工', info.OrgCode)">
                        <div class="flex ct-between">
                          <span class="legend legend4 mr-4px" />
                          <span class="name">手工: </span>
                          <span class="value">{{ info.SGCQNum }}/{{ info.SGZZNum }}</span>
                        </div>
                        <span class="name ml-12px">{{ info.SGCQRate }}</span>
                      </div>
                      <div class="item flex ct-between text-hover" @click="goPersonalDetailPage('模切', info.OrgCode)">
                        <div class="flex ct-between">
                          <span class="legend legend5 mr-4px" />
                          <span class="name">模切: </span>
                          <span class="value">{{ info.MQCQNum }}/{{ info.MQZZNum }}</span>
                        </div>
                        <span class="name ml-12px">{{ info.MQCQRate }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 数据为空展示 -->
            <emptyData v-else></emptyData>
          </div>
          <template v-if="showCenter">
            <!-- 五大中心 && 模具厂 -->
            <div v-if="!isMoldEmptyData" class="right-container content-container flex column all-start ml-12px">
              <div class="title-wrapper"></div>
              <div class="content-wrapper">
                <!-- 运营图表 -->
                <div class="chart-wrapper flex column">
                  <div class="info rate-info flex row ct-between">
                    <p>{{ moldInfo.centerAllCQRate || '0.00%' }}</p>
                    <p>{{ moldInfo.moldAllCQRate }}</p>
                  </div>
                  <div class="flex" style="width: 100%; height: calc(100% - 48px)">
                    <Chart ref="chartRef4" :options="options4" height="100%" style="height: 100%; width: 50%" />
                    <Chart ref="chartRef5" :options="options5" height="100%" style="height: 100%; width: 50%" />
                  </div>
                  <div class="info num-info flex row ct-between">
                    <p class="mt-4px text-hover" @click="goPersonalDetailPage('', moldInfo.centerOrgCode || '')">{{ moldInfo.centerAllZZNum }} </p>
                    <p class="mt-4px text-hover" @click="goPersonalDetailPage('', moldInfo.moldOrgCode || '')">{{ moldInfo.moldAllZZNum }} </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- 五大中心数据 -->
            <div v-else class="chart-right-container content-container center-chart-right-container">
              <!-- 占位勿删 -->
              <div class="title-wrapper">
                <span class="mr-16px">五大中心</span>
                <span v-if="!isOperateEmptyData" class="mr-12px text-hover" @click="goPersonalDetailPage('', centerInfo.OrgCode)"
                  >{{ centerInfo.AllZZNum }}人</span
                >
                <span class="mr-12px">{{ centerInfo.AllCQRate }}</span>
              </div>
              <div class="content-wrapper flex column ct-start">
                <!-- 饼图 -->
                <div class="pie-wrapper flex">
                  <highcharts :options="centerPieOptions" height="136px" style="width: 100%" />
                </div>
                <div class="pie-legend-wrapper flex column all-start">
                  <div
                    v-for="(item, idx) in state.centerPieData"
                    :key="idx"
                    class="item flex ct-between text-hover"
                    @click="goPersonalDetailPage('', item.OrgCode)">
                    <div style="color: #666">
                      <span class="legend" :style="{ backgroundColor: item.color }"></span>
                      {{ item.OrgName }}:
                      <span style="font-size: 12px">{{ item.AllCQNum }}/{{ item.AllZZNum }}</span>
                    </div>
                    <span class="ml-6px" style="color: #666; font-size: 12px">{{ item.AllCQRate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- 劳动类型图表 -->
          <template v-else>
            <div class="chart-right-container content-container">
              <!-- 占位勿删 -->
              <div class="title-wrapper"></div>
              <div v-if="!isTypeEmptyData" class="content-wrapper flex column ct-start">
                <!-- 饼图 -->
                <div class="pie-wrapper flex">
                  <highcharts :options="pieOptions" style="height: 136px; width: 100%" />
                </div>
                <div class="pie-legend-wrapper flex column all-start">
                  <div class="item flex ct-between text-hover" @click="goPersonalDetailPage('正式工', info.OrgCode)">
                    <div style="color: #666">
                      <span class="legend legend1"></span>
                      正式工:
                      <span style="font-size: 14px">{{ info.DLZhengshiCQNum }}/{{ info.DLZhengshiZZNum }}</span>
                    </div>
                    <span class="ml-6px" style="color: #666; font-size: 14px">{{ info.DLZhengshiCQRate }}</span>
                  </div>
                  <div class="item flex ct-between text-hover" @click="goPersonalDetailPage('派遣工', info.OrgCode)">
                    <div style="color: #666">
                      <span class="legend legend2"></span>
                      派遣工:
                      <span style="font-size: 14px">{{ info.DLPaiqianCQNum }}/{{ info.DLPaiqianZZNum }}</span>
                    </div>
                    <span class="ml-6px" style="color: #666; font-size: 14px">{{ info.DLPaiqianCQRate }}</span>
                  </div>
                  <div class="item flex ct-between text-hover" @click="goPersonalDetailPage('临时工', info.OrgCode)">
                    <div style="color: #666">
                      <span class="legend legend3"></span>
                      临时工:
                      <span style="font-size: 14px">{{ info.DLLinshiCQNum }}/{{ info.DLLinshiZZNum }}</span>
                    </div>
                    <span class="ml-6px" style="color: #666; font-size: 14px">{{ info.DLLinshiCQRate }}</span>
                  </div>
                </div>
              </div>
              <!-- 数据为空展示 -->
              <emptyData v-else></emptyData>
            </div>
          </template>
        </div>
      </SpinContent>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, nextTick } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
  import { cloneDeep, merge, isEmpty } from 'lodash-es';
  import { basePieOptions, baseOptions, baseOptions2, baseOptions4, baseOptions5 } from './config';
  import { Chart } from '/@/components/Chart';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  import RatePopover from '/@/views/dashboard/operate/attendanceRate/components/RatePopover.vue';
  import emptyData from '/@/views/dashboard/operate/components/emptyData.vue';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import rankSvg from '/@/assets/svg/report/rank.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  import { getAttendancedata } from '/@/api/dashbord/operate';
  import dayjs from 'dayjs';

  import { SearchFormValueType } from '/@/views/dashboard/operate/types';
  import { EModules } from '/@/views/dashboard/operate/ranking/type';

  interface ChartInstance extends InstanceType<typeof Chart> {}

  const isMoldEmptyData = ref(true);
  const isTypeEmptyData = ref(true);
  const isOperateEmptyData = ref(true);
  const showCenter = ref(true);
  const go = useGo();
  const emits = defineEmits(['updateValues']);

  let pieOptions = {}; // 劳动类型饼图
  let centerPieOptions = {}; // 五大中心饼图

  const info: any = ref({});
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
  const chartRef1 = ref<ChartInstance | null>(null);
  const chartRef2 = ref<ChartInstance | null>(null);
  const chartRef4 = ref<ChartInstance | null>(null);
  const chartRef5 = ref<ChartInstance | null>(null);

  const options = ref({});
  const options2 = ref({});
  const options4 = ref({});
  const options5 = ref({});

  const state: {
    centerPieData: any[];
  } = reactive({
    centerPieData: [],
  });

  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();

  // 是否展示标题位置的数据
  const showTitleInfo = computed(() => {
    return !isOperateEmptyData.value && info.value.ParentAllZZNum && !loading.value;
  });

  const handleChartClick = (instance, paramsName = 'type') => {
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
      const { date = dayjs().tz().subtract(1, 'day'), timeDimension = 'day' } = props.queryInfo;
      go(
        `/dashboard/operate/attendanceRate/personnelDetail?&dimension=${timeDimension}&date=${date.format('YYYY-MM-DD')}&${paramsName}=${
          paramsName === 'orgCode' ? orgCode : type
        }`,
      );
    });
  };

  // 初始化图表数据
  const initData = async (data, { isEmptyData, t }) => {
    info.value = {};
    isEmptyData.value = isEmpty(data);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    // 缓存结果数据
    emits('updateValues', props.element.id, data);
    const { list = [], list1 = [], list2 = [] } = data;
    isEmptyData.value = isEmpty([...list1, ...list2, ...list]);
    if (!isEmpty(list)) {
      isOperateEmptyData.value = false;
      initOperateData(list);
      // 没有五大中心的数据就显示劳动类型图表
      showCenter.value = !isEmpty(list1);
      if (!showCenter.value) {
        initRightChartData(list[0]);
      }
    }
    // 初始化模具厂&五大中心的数据
    initMoldData(list1, list2, t);
    // 确保在 DOM 更新后执行
    await nextTick();
    // 给图表绑定点击事件
    bindChartClick();
  };

  // 给图表绑定点击事件
  const bindChartClick = () => {
    if (chartRef1.value) {
      const instance = chartRef1.value?.getInstance();
      handleChartClick(instance);
    }
    if (chartRef2.value) {
      const instance = chartRef2.value?.getInstance();
      handleChartClick(instance);
    }
    if (chartRef4.value) {
      const instance = chartRef4.value?.getInstance();
      handleChartClick(instance, 'orgCode');
    }
    if (chartRef5.value) {
      const instance = chartRef5.value?.getInstance();
      handleChartClick(instance, 'orgCode');
    }
  };

  // 初始化运营数据
  const initOperateData = data => {
    info.value = data[0];
    const {
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
    } = info.value;
    const DLZZNum = DLCQNum + DLQQNum;
    const IDLZZNum = IDLCQNum + IDLQQNum;
    const max = DLZZNum + IDLZZNum;
    // DL 图表数据
    const handleOptions = {
      yAxis: {
        max,
      },
      series: [
        { data: [DL1CQNum + DL2CQNum === 0 ? null : 0] }, // 此处是原片显示逻辑,为0才显示
        { data: [MQCQNum + SGCQNum === 0 ? null : 0] },
        { data: [DL1CQNum || null] },
        { data: [MQCQNum || null] },
        { data: [DL1CQNum + DL2CQNum || null] },
        { data: [MQCQNum + SGCQNum || null] },
        {
          data: [
            {
              value: DL1CQNum,
              qq: DL1ZZNum - DL1CQNum,
            },
          ],
        }, // DL1
        {
          data: [{ value: DL2CQNum, qq: DL2ZZNum - DL2CQNum }],
        }, // DL2
        {
          data: [{ value: MQCQNum, qq: MQZZNum - MQCQNum }],
        }, // 模切
        {
          data: [{ value: SGCQNum, qq: SGZZNum - SGCQNum }],
        }, // 手工
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
          data: [{ value: IDL1CQNum, qq: IDL1ZZNum - IDL1CQNum }],
        }, // IDL1
        {
          data: [{ value: IDL2CQNum, qq: IDL2ZZNum - IDL2CQNum }],
        }, // IDL2
        {
          data: [{ value: IDL3CQNum, qq: IDL3ZZNum - IDL3CQNum }],
        }, // IDL3
      ],
    };
    options.value = merge(cloneDeep(baseOptions), handleOptions);
    options2.value = merge(cloneDeep(baseOptions2), handleOptions2);
  };

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
    const colors = ['#00A0AA', '#884BEC', '#46AAF2', '#EFC56C', '#E08D73'];
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
  const initMoldData = (centerData, moldData, t) => {
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
        data: [t('views.dashboard.operate.attendance.fiveCenters')],
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
        data: [t('views.dashboard.operate.attendance.mouldFactory')],
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

  // 打开人力出勤详情页
  const goPersonalDetailPage = (type = '', orgCode = '') => {
    const { date = dayjs().tz().subtract(2, 'day'), timeDimension = 'day' } = props.queryInfo;
    go(
      `/dashboard/operate/attendanceRate/personnelDetail?dimension=${timeDimension}&date=${date.format('YYYY-MM-DD')}${type ? `&type=${type}` : ''}${
        orgCode ? `&orgCode=${orgCode}` : ''
      }`,
    );
  };

  // 给五大中心&模具厂图表 tooltip 绑定点击事件
  (window as any).goPersonalDetailPage = (instanceName = 'center', orgCode) => {
    const instance = (instanceName === 'center' ? chartRef4 : chartRef5).value?.getInstance();
    // 隐藏 tooltips
    instance?.dispatchAction({
      type: 'hideTip',
    });
    goPersonalDetailPage('', orgCode);
  };

  // 获取比例
  const getRate = (a, b) => {
    return b === 0 ? '0.00%' : `${((a / b) * 100).toFixed(2)}%` || '0.00%';
  };

  const { loading, isEmptyData, t, goPage } = useMainCompo({
    props,
    reqMth: getAttendancedata,
    initData: initData,
  });
</script>

<style lang="less" scoped>
  @titleHeight: 44px;
  @subTitleHeight: 26px;
  @leftContainerHeight: 70%;

  .sub-title {
    font-size: 14px;
    font-weight: 400;
  }

  .compo-body {
    overflow-x: auto;
  }

  .compo-content-container {
    width: 100%;
    height: 100%;
    min-width: 730px;
    padding: 0 16px 16px 0;
    background-color: #fff;

    .content-container {
      padding: 0;

      .title-wrapper {
        width: 100%;
        height: @subTitleHeight;
        color: #666;
        font-size: 14px;
        font-weight: 400;
      }

      .content-wrapper {
        position: relative;
        width: 100%;
        height: calc(100% - @subTitleHeight);
        padding: 9px 12px;
        border-radius: 4px;
        border: 1px solid #dbdbdb;
        overflow: hidden;
      }
    }

    .chart-right-container {
      width: calc(100% - @leftContainerHeight - 12px);
      height: 100%;
      overflow: hidden;
      margin-left: 12px;

      &.center-chart-right-container {
        .pie-legend-wrapper {
          .item {
            font-size: 11px;
          }
        }

        .pie-wrapper {
          top: 35%;
          height: 70%;
        }
      }

      .pie-wrapper {
        position: absolute;
        z-index: 1;
        top: 30%;
        left: 5%;
        width: 80%;
        height: 69.5%;
        overflow: hidden;
      }

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
    }

    .left-container {
      width: @leftContainerHeight;
      height: 100%;

      .legend-wrapper {
        width: 70%;
        height: 100%;
        font-size: 12px;

        .head-wrapper {
          width: 100%;
          color: #1a1a1a;
          text-align: left;
        }

        .body-wrapper {
          width: 100%;
          height: calc(100% - 24px);

          .title {
            font-size: 12px;
          }

          .info-container {
            position: relative;
            z-index: 1;
            width: 100%;
            color: #666;
            padding: 6px 12px;
            font-size: 12px;
            border-radius: 4px;
            background-color: #f2f2f2;
            overflow: hidden;

            .legend {
              display: inline-block;
              width: 8px;
              height: 8px;

              &.legend1 {
                background: #4676e6;
              }

              &.legend2 {
                background: linear-gradient(37deg, #00d6d0 23.36%, #00aae2 90.54%);
              }

              &.legend3 {
                background: #72ddca;
              }

              &.legend4 {
                background: #57c25b;
              }

              &.legend5 {
                background: #eec56b;
              }
            }
          }
        }
      }

      .content-wrapper {
        .chart-wrapper {
          width: 30%;
          height: 100%;
          padding: 0 12px;
          flex-shrink: 1;

          .rate-info {
            margin-bottom: 4px;

            p {
              width: 50%;
              text-align: center;
            }
          }

          .num-info {
            position: relative;

            p {
              width: 50%;
              text-align: center;

              &.label {
                position: absolute;
                top: 0;
                left: -12px;
                width: 24px;
                width: auto;
                font-size: 12px;
              }
            }
          }

          .info {
            width: 100%;
            color: #1a1a1a;
            font-size: 12px;
            line-height: 22px;

            .label {
              color: #999;
            }
          }
        }
      }
    }

    .right-container {
      width: calc(100% - @leftContainerHeight - 12px);
      height: 100%;

      .content-wrapper {
        .chart-wrapper {
          width: 100%;
          height: 100%;
          padding: 0 12px;
          flex-shrink: 1;

          .rate-info {
            margin-bottom: 4px;

            p {
              width: 50%;
              text-align: center;
            }
          }

          .num-info {
            position: relative;

            p {
              width: 50%;
              text-align: center;

              &.label {
                position: absolute;
                top: 0;
                left: -12px;
                width: 24px;
                width: auto;
                font-size: 12px;
              }
            }
          }

          .info {
            width: 100%;
            color: #1a1a1a;
            font-size: 12px;
            line-height: 22px;

            .label {
              color: #999;
            }
          }
        }
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

<style lang="less">
  .attendance-rate-tooltips {
    .head-container {
      color: #1a1a1a;
      font-size: 16px;
    }

    .title-container {
      color: #1a1a1a;
      font-size: 14px;
      margin: 8px 0 6px;
    }

    .content-container {
      width: 100%;
      height: 100%;

      .item-container {
        width: 300px;
        font-size: 12px;
        padding: 6px 12px;
        background: #f2f2f2;
        margin-bottom: 12px;

        .item {
          &.style1 {
            color: '#1a1a1a';
          }

          &.style2 {
            color: '#666';
          }
        }

        &:last-child {
          margin: 0;
        }
      }
    }
  }
</style>
