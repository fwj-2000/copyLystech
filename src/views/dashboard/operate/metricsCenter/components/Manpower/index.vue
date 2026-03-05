<!-- 人力 -->
<template>
  <div class="dashboard-metrics-center-compo">
    <div class="compo-header">
      <!-- 标题封装组件 -->
      <CompoHead>
        <template #left>
          <div class="w-[70%] flex justify-start overflow-hidden flex-nowrap">
            <span class="text-hover whitespace-nowrap" @click="goPage('/dashboard/operate/manpower')"> 人力全景数据仓 </span>
            <div ref="moveRef" class="w-[100%] flex justify-start font-400 text-[12px] ml-16px overflow-hidden">
              <div :class="['whitespace-nowrap', { 'move-x': isMove }]">
                <span v-show="info.ParentAllZZNum" class="mr-16px text-hover" @click="goPersonalDetailPage()">
                  总在职：{{ info.ParentAllZZNum }}人(
                  <span v-if="info.Interiorly"> 国内:{{ info.Interiorly }} </span>
                  <span v-if="info.ZhusuZZ"> 注塑:{{ info.ZhusuZZ }}</span>
                  <span v-if="info.Overseas"> 海外:{{ info.Overseas }}</span>
                  )
                </span>
                <span v-show="info.ParentAllCQRate" class="mr-16px text-hover" @click="goPersonalDetailPage()">出勤率：{{ info.ParentAllCQRate }}</span>
                <span v-show="info.InformalRatio" ref="scrollViewRef">非正式工占比：{{ info.InformalRatio }}</span>
              </div>
            </div>
          </div>
        </template>
        <template #right>
          <!-- <div class="flex m-l-12px">
            <div class="flex px-6px" style="height: 24px; color: #1a1a1a; background-color: #e6e6e6">还原质量中心</div>
            <a-select ref="select" v-model:value="extraParams.isBack" size="small">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </div> -->
          <div></div>
        </template>
      </CompoHead>
    </div>
    <div class="compo-body">
      <!-- 内容封装组件 -->
      <SpinContent
        v-bind="{
          loading: loading,
          isEmptyData: isEmptyData,
          showList: false,
        }">
        <!-- 出勤相关图表 -->
        <Chart :info="attendanceInfo" :queryInfo="queryInfo"></Chart>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { isEmpty } from 'lodash-es';
  import weekOfYear from 'dayjs/plugin/weekOfYear';
  import { useMainCompo } from '/@/views/dashboard/operate/metricsCenter/useMainCompo';
  import { getAttendancedata } from '/@/api/dashbord/operate';

  import Chart from './Chart/index.vue';
  import { CompoHead, SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { SearchFormValueType } from '/@/views/dashboard/operate/types';

  dayjs.extend(weekOfYear);
  const emits = defineEmits(['updateValues']);

  const props = defineProps<{
    element: any;
    queryInfo: SearchFormValueType;
  }>();

  const isMove = ref<boolean>(false);
  const moveRef = ref<HTMLElement | null>(null);
  const info = ref({
    ParentAllZZNum: 0,
    ParentAllCQRate: '',
    InformalRatio: '',
    OrgCode: '',
    Interiorly: '',
    Overseas: '',
    ZhusuZZ: '',
    MQZZNum: '',
  });

  const attendanceInfo = ref({
    list: [],
    list1: [],
    list2: [],
  });

  const setIsMove = () => {
    if (moveRef.value) {
      isMove.value = moveRef.value?.clientWidth < 648;
    }
  };

  // 监听resize
  window.addEventListener('resize', () => {
    setIsMove();
  });

  onMounted(() => {
    setIsMove();
  });

  // const targetElement = document.getElementById('yourElementId');
  // 初始化图表数据
  const initData = async (data, { isEmptyData }) => {
    isEmptyData.value = isEmpty(data);
    // 数据为空
    if (isEmptyData.value) {
      return;
    }
    // 缓存结果数据
    emits('updateValues', props.element.id, data);
    const { list = [], list1 = [], list2 = [] } = data;
    isEmptyData.value = isEmpty([...list1, ...list2, ...list]);
    attendanceInfo.value = data;
    // 初始化运营数据
    info.value = list[0];
  };

  // 使用封装的组件hooks
  const { loading, isEmptyData, goPage } = useMainCompo({
    props,
    reqMth: getAttendancedata,
    initData: initData,
  });

  // 打开人力出勤详情页
  const goPersonalDetailPage = (params = {}) => {
    const { date = dayjs().subtract(2, 'day'), timeDimension = 'day' } = props.queryInfo;
    goPage('/dashboard/operate/attendanceRate/personnelDetail', {
      dimension: timeDimension,
      date: date.format('YYYY-MM-DD'),
      ...params,
    });
  };

  provide('goPage', goPage);
  provide('goPersonalDetailPage', goPersonalDetailPage);
</script>

<style lang="less" scoped>
  .move-x {
    animation: moveX 20s linear infinite;
  }
  @keyframes moveX {
    20% {
      transform: translateX(0%);
    }

    100% {
      transform: translateX(-100%);
    }
  }
</style>
