<!-- IDL出勤信息 -->
<template>
  <div class="flex center w-[100%] h-[100%]">
    <!-- 左侧 -->
    <div class="w-[calc(50%-1px)] h-[100%] flex flex-col">
      <!-- 占比图表 -->
      <ProcessSvg class="w-[80%] mb-8px" :processInfo="processInfo" />
      <p class="text-[11px] mb-6px" style="color: rgb(26 26 26 / 70%)"> 出勤率对比 </p>
      <p class="text-[13px] mb-10px text-hover text-center" @click="goPersonalDetailPage({ type: 'DL', orgCode: props.info.OrgCode || '' })">
        {{ props.info.DLZZNum }}人
        {{ getRate(props.info.DLCQNum, props.info.DLZZNum) }}
      </p>
      <p class="text-[16px] text-hover" @click="goPersonalDetailPage({ type: 'DL', orgCode: props.info.OrgCode || '' })">DL</p>
    </div>
    <!-- 分割线 -->
    <div class="split-line"></div>
    <!-- 右侧 -->
    <div class="w-[50%] h-[100%] flex flex-col">
      <template v-for="(item, idx) in metricInfo" :key="idx">
        <div class="w-[100%] flex flex-col text-[12px]" :style="getInfoItemStyle()">
          <p class="flex text-hover" @click="goPersonalDetailPage({ type: item.title, orgCode: props.info.OrgCode || '' })">
            <span>{{ props.info[item.zznumKey] }}人</span>
            <span class="ml-6px">{{ getRate(props.info[item.cqnumKey], props.info[item.zznumKey]) }}</span>
          </p>
          <p class="flex center mt-8px">
            <span class="w-[8px] h-[8px] mr-4px" :style="`background-color: ${item.color}`"></span>
            <span>{{ item.title }}</span>
          </p>
        </div>
        <div v-if="idx !== metricInfo.length - 1" class="split-line-v"></div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, computed } from 'vue';
  import ProcessSvg from './ProcessSvg.vue';

  interface IProps {
    info: Record<string, any>;
  }
  const props = withDefaults(defineProps<IProps>(), {
    info: () => ({}),
  });
  const goPersonalDetailPage: any = inject('goPersonalDetailPage', () => {});

  const metricInfo = [
    {
      title: 'DL1',
      color: 'rgba(123, 202, 255, 1)',
      zznumKey: 'DL1ZZNum',
      cqnumKey: 'DL1CQNum',
    },
    {
      title: 'DL2',
      color: 'rgba(77, 125, 236, 1)',
      zznumKey: 'DL2ZZNum',
      cqnumKey: 'DL2CQNum',
    },
    {
      title: '手工',
      color: 'rgba(132, 217, 136, 1)',
      zznumKey: 'SGZZNum',
      cqnumKey: 'SGCQNum',
    },
    {
      title: '模切',
      color: '#B183EA',
      zznumKey: 'MQZZNum',
      cqnumKey: 'MQCQNum',
    },
  ];

  const processInfo = computed(() => {
    return [
      {
        cx: 28.8195,
        cy: 29.3346,
        r: 27,
        linearId: 'paint0_linear_14183_36074',
        rate: getRateValue(props.info.DL1CQNum, props.info.DL1ZZNum),
      },
      {
        cx: 28.8195,
        cy: 29.3346,
        r: 21,
        linearId: 'paint2_linear_14183_36074',
        rate: getRateValue(props.info.DL2CQNum, props.info.DL2ZZNum),
      },
      {
        cx: 28.8195,
        cy: 29.3346,
        r: 15,
        linearId: 'paint3_linear_14183_36074',
        rate: getRateValue(props.info.SGCQNum, props.info.SGZZNum),
      },
      {
        cx: 28.8195,
        cy: 29.3346,
        r: 9,
        linearId: 'paint1_linear_14183_36074',
        rate: getRateValue(props.info.MQCQNum, props.info.MQZZNum),
      },
    ];
  });

  // 获取信息项高度
  const getInfoItemStyle = () => {
    const { length: len } = metricInfo;
    return {
      height: `calc(${100 / len}% - ${len - 1}px)`,
    };
  };

  // 获取比例
  const getRate = (a, b, ratio = 1) => {
    return b === 0 ? '0.00%' : `${((a / b) * 100).toFixed(ratio)}%` || '0.00%';
  };

  // 获取比例值
  const getRateValue = (a, b) => {
    return b === 0 ? 0 : a / b;
  };
</script>

<style lang="less" scoped>
  .split-line {
    width: 1px;
    height: 60%;
    background: linear-gradient(90deg, rgb(255 255 255 / 0%) -22.03%, #e6e6e6 51.69%, rgb(255 255 255 / 0%) 136.44%);
    transform: scale(0.8);
  }

  .split-line-v {
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, rgb(255 255 255 / 0%) -22.03%, #e6e6e6 51.69%, rgb(255 255 255 / 0%) 136.44%);
  }
</style>
