<!-- 损益图表 -->
<template>
  <div class="compo-container">
    <div class="purpleGradient w-full flex center">
      <div class="w-[40%] mr-[7px] mb-[10px] mt-[8px]">
        <span class="font-bold ml-4">OA工时占比</span>
        <SvgOa :percentage="info.oaZb" />
      </div>
      <div class="flex justify-start w-[60%] h-[100%]">
        <div class="process bg-white h-[80%] w-[95%] rounded-[6px] shadow-[0px_5px_6px_0px_rgba(0,0,0,0.12)]">
          <Process
            colorType="purple"
            v-bind="props"
            :value="info.achievedTimes"
            :title="`达成工时`"
            :reference-value="hadleMaxValue([info.achievedTimes, info.oaTime])" />
          <Process
            colorType="purple"
            v-bind="props"
            :value="info.oaTime"
            :title="`OA工时`"
            :reference-value="hadleMaxValue([info.achievedTimes, info.oaTime])" />
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="w-full my-[6px]"></div>

    <div class="blueGradient w-full flex center">
      <div class="w-[40%] mr-[7px] mb-[10px] mt-[8px]">
        <span class="font-bold ml-4">间接分占比</span>
        <SvgScore :percentage="info.scoreZb" />
      </div>

      <div class="flex justify-start w-[60%] h-[100%]">
        <div class="process bg-white h-[80%] w-[95%] rounded-[6px] shadow-[0px_5px_6px_0px_rgba(0,0,0,0.12)]">
          <Process
            colorType="blue"
            v-bind="props"
            :value="info.currentScore"
            :title="`最终绩效分`"
            :reference-value="hadleMaxValue([info.currentScore, info.score])" />
          <Process colorType="blue" v-bind="props" :value="info.score" :title="`间接分`" :reference-value="hadleMaxValue([info.currentScore, info.score])" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import SvgOa from './record/SvgOa.vue';
  import SvgScore from './record/SvgScore.vue';
  import Process from './record/process.vue';
  import { type MPFInfo } from '../types';
  const props = withDefaults(
    defineProps<{
      info: MPFInfo;
      // extraInfo: Record<string, any>;
    }>(),
    {
      info: () => ({
        orgCode: '',
        months: '',
        groupName: '',
        currentScore: 0,
        score: 0,
        achievedTimes: 0,
        oaTime: 0,
        scoreZb: '',
        oaZb: '',
      }),
      // extraInfo: {},
    },
  );

  // 保留一位小数
  const formatRateValue = (value: number) => {
    if (!value) return 0;
    return Number.parseFloat(value.toFixed(1));
  };

  const info = computed(() => {
    const source = props.info;
    return Object.keys(source).reduce((obj, key) => {
      const value = source[key];
      return {
        ...obj,
        [key]: typeof value === 'number' ? formatRateValue(value) : value,
      };
    }, {} as MPFInfo);
  });

  const hadleMaxValue = (value: Array<number>) => {
    return Math.max(...value) * 1.1;
  };
</script>

<style lang="less" scoped>
  .compo-container {
    width: 100%;
    height: 100%;
    padding-bottom: 16px;
    overflow: hidden;
    font-size: 12px;

    .purpleGradient {
      height: 49%;
      background: linear-gradient(to right, rgb(233 238 255 / 100%), rgb(240 243 255 / 79%));
      border-radius: 5px;
    }

    .blueGradient {
      height: 49%;
      background: linear-gradient(to right, rgb(229 249 255 / 100%), rgb(241 252 255 / 79%));
      border-radius: 5px;
    }
  }
</style>
