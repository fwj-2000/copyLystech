<!-- 内容组件 -->
<template>
  <div class="h-[100%] flex flex-col justify-start" style="gap: 0 12px">
    <div v-for="item in props.dataInfo" class="relative w-[100%] h-[33%] min-h-[200px] bx-shadow">
      <div class="w-[100%] h-[calc(100%-13px)] flex gap-16px">
        <div class="min-w-[300px] w-[25%] h-[100%]">
          <!-- 柱形图 -->
          <BarChart :info="getBarChartInfo(item)" :metricKey="item.machineType" @openDialog="openDialog" />
        </div>
        <div class="h-[100%] w-[100%] flex-1 relative">
          <!-- 停机原因分析 -->
          <PieChart :dataInfo="getPieInfo(item)" :metricKey="item.machineType" />
        </div>
        <!-- 达成率图形 -->
        <div class="w-[200px] h-[100%] flex flex-col items-start achievement-rate">
          <div class="p-8px text-[18px] font-bold text-[#fff]">达成率</div>
          <div class="w-[100%] h-[100%] flex-1">
            <div class="w-[100%] h-[100%] flex center">
              <RateSvg :type="achievementRateTypeMap[item.machineType]" :value="item.achievementRate * 100" class="w-80% h-[60%]" :key="item.achievementRate" />
            </div>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="w-[100%] h-1px split-line my-[6px]"></div>
    </div>
  </div>
  <!-- 彈窗组件 -->
  <div v-show="showDialog" class="dialog flex flex-center">
    <div class="relative w-[60%] h-[60%] content">
      <!-- 关闭 -->
      <div class="absolute top-[-60px] right-[0px] h-[44px] flex justify-center items-center" @click.present="showDialog = false">
        <img :src="back" class="w-[14px] h-[20px]" style="transform: scaleX(-1)" />
        <img :src="back" class="w-[14px] h-[20px] ml-[-6px]" />
        <span class="text-[#fff] text-20px ml-[8px] btn-text">关闭</span>
      </div>
      <!-- 表格 -->
      <ErrorTable :params="params" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { achievementRateTypeMap, mainColorMap } from './config';
  import { pick } from 'lodash-es';

  import back from '../static/back.png';
  import BarChart from './BarChart.vue';
  import PieChart from './PieChart.vue';
  import RateSvg from './RateSvg.vue';
  import ErrorTable from './ErrorTable.vue';

  interface IProps {
    dataInfo: Record<string, any>[];
    id: string | number;
  }
  const showDialog = ref(false);
  const params = ref({});
  const props = withDefaults(defineProps<IProps>(), {
    dataInfo: () => [],
    id: 0,
  });
  const openDialog = paramsData => {
    showDialog.value = true;
    const mapKey = {
      '低于30%': '<30',
      '30%-60%': '30~60',
      '60%-80%': '60~80',
      '80%以上': '>80',
    };
    params.value = {
      range: mapKey[paramsData.name],
      type: paramsData.metricKey,
      id: props.id,
    };
  };
  // 获取停机原因分析数据信息
  const getPieInfo = info => {
    return info.analysList;
  };

  // 获取柱状图数据信息
  const getBarChartInfo = info => {
    const { machineType } = info;
    const infoKeys = ['machineType', 'above80', 'below30', 'sixtyToEighty', 'thirtyToSixty'];
    const mainColor = mainColorMap[machineType];
    return {
      mainColor,
      ...pick(info, infoKeys),
    };
  };
</script>

<style lang="less" scoped>
  .split-line {
    background: linear-gradient(90deg, rgb(255 255 255 / 0%) 0%, #fff 56.04%, rgb(255 255 255 / 0%) 100%);
  }

  .dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgb(0 0 0 / 60%);
    z-index: 1000;

    .content {
      padding: 9px 18px;
      border: 0.84px solid #2b95e5;
      background: #050b23;
      box-shadow: 0 0 33.2px 0 rgb(34 120 207 / 80%) inset;
    }
  }

  .btn-text {
    color: #fff;
    text-align: center;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    background: linear-gradient(0deg, #006dd2 0%, #fff 67.24%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
