<!-- 人均产值 -->
<template>
  <div class="relative w-[100%] h-[100%] px-6px text-[12px] color-[rgba(26,26,26,0.70)]">
    <!-- 大标题 -->
    <div class="absolute top-[-34px] left-0 font-bold text-[14px] flex center">人力效能洞察集</div>
    <!-- 产值标题 -->
    <div class="w-[100%] flex items-center justify-between h-[24px] my-4px">
      <div class="flex items-center justify-start text-hover" @click="goPage('/dashboard/operate/manpower/detail/percapita')">
        <span class="font-bold">人均产值</span>
        <span class="ml-6px"> {{ props.info.AvgChanzhi }}</span>
        <span v-if="props.info.AvgChanzhi" class="text-[10px]">万元</span>
      </div>
      <div class="flex">
        <img :src="rankSvg" class="zoom-icon mr-8px" @click="goPage('/dashboard/operate/manpower/ranking/percapita')" />
        <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPage('/dashboard/operate/manpower/detail/percapita')" />
        <a-popover placement="right">
          <template #content>
            <InfoPopover :info-list="POPOVER_TOOLTIP_LIST"></InfoPopover>
          </template>
          <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
        </a-popover>
      </div>
    </div>
    <!-- 产值数据 -->
    <div class="h-[42%] flex center gap-4px">
      <div
        class="w-[30%] h-[100%] flex flex-col center info-wrapper style1 text-hover"
        @click="goPage('/dashboard/operate/manpower/detail/percapita', { key: 'IdlAvgChanzhi' })">
        <p class="font-bold">{{ props.info.IdlAvgChanzhi || 0 }}</p>
        <p class="mt-4px">IDL</p>
      </div>
      <div class="w-[70%] h-[100%] flex info-wrapper style2">
        <div
          class="w-[calc(35%-1px)] h-[100%] flex flex-col center text-hover"
          @click="goPage('/dashboard/operate/manpower/detail/percapita', { key: 'DlAvgChanzhi' })">
          <p class="font-bold">{{ props.info.DlAvgChanzhi || 0 }}</p>
          <p class="mt-4px">DL</p>
        </div>
        <div class="split-line"></div>
        <div class="w-[65%] h-[100%] flex flex-col center">
          <div class="w-[100%] h-[calc(50%-1px)] flex">
            <div
              class="w-[30%] flex flex-col center mr-4px text-hover"
              @click="goPage('/dashboard/operate/manpower/detail/percapita', { key: 'Dl1AvgChanzhi' })">
              <p class="font-bold">{{ props.info.Dl1AvgChanzhi || 0 }}</p>
              <p class="mt-4px">DL1</p>
            </div>
            <div
              class="w-[30%] flex flex-col center ml-4px text-hover"
              @click="goPage('/dashboard/operate/manpower/detail/percapita', { key: 'Dl2AvgChanzhi' })">
              <p class="font-bold">{{ props.info.Dl2AvgChanzhi || 0 }}</p>
              <p class="mt-4px">DL2</p>
            </div>
          </div>
          <div class="split-line-v"></div>
          <div class="w-[100%] h-[50%] flex">
            <div
              class="w-[30%] flex flex-col center mr-4px text-hover"
              @click="goPage('/dashboard/operate/manpower/detail/percapita', { key: 'ShougongAvgChanzhi' })">
              <p class="font-bold">{{ props.info.ShougongAvgChanzhi || 0 }}</p>
              <p class="mt-4px">手工</p>
            </div>
            <div
              class="w-[30%] flex flex-col center ml-4px text-hover"
              @click="goPage('/dashboard/operate/manpower/detail/percapita', { key: 'MoqieAvgChanzhi' })">
              <p class="font-bold">{{ props.info.MoqieAvgChanzhi || 0 }}</p>
              <p class="mt-4px">模切</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 人均开线数标题 -->
    <div class="w-[100%] flex items-center justify-between h-[24px] my-4px">
      <div>
        <span class="font-bold">开线人线比</span>
        <span class="ml-6px">{{ props.info.AvgMoqieKaixian }}</span>
      </div>
      <div v-if="props.info.AvgMoqieJiTai">
        <span class="font-bold">总人线比</span>
        <span class="ml-6px">{{ props.info.AvgMoqieJiTai }}</span>
      </div>
    </div>
    <!-- 人均开线数数据 -->
    <div class="w-[100%] h-[25%] flex justify-start gap-4px">
      <div
        class="w-[25%] h-[100%] flex flex-shrink flex-col center info-wrapper style1 text-hover"
        @click="handleGoPath('/dataAnalysis/operation/metricsCenter/detail/outputPerCapita', { MachineType: '平板' })">
        <p class="font-bold">{{ props.info.AvgPbKaixian || 0 }}</p>
        <p class="mt-4px">平板</p>
      </div>
      <div
        class="w-[25%] h-[100%] flex flex-shrink flex-col center info-wrapper style2 text-hover"
        @click="handleGoPath('/dataAnalysis/operation/metricsCenter/detail/outputPerCapita', { MachineType: '圆刀' })">
        <p class="font-bold">{{ props.info.AvgYdKaixian || 0 }}</p>
        <p class="mt-4px">圆刀</p>
      </div>
      <div
        class="w-[25%] h-[100%] flex flex-shrink flex-col center info-wrapper style2 text-hover"
        @click="handleGoPath('/dataAnalysis/operation/metricsCenter/detail/outputPerCapita', { MachineType: '激光' })">
        <p class="font-bold">{{ props.info.AvgJgKaiXian || 0 }}</p>
        <p class="mt-4px">激光</p>
      </div>
      <div
        class="w-[25%] h-[100%] flex flex-shrink flex-col center info-wrapper style2 text-hover"
        @click="handleGoPath('/dataAnalysis/operation/metricsCenter/detail/outputPerCapita', { MachineType: '成型' })">
        <p class="font-bold">{{ props.info.AvgCxKaiXian || 0 }}</p>
        <p class="mt-4px">成型</p>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
  import dayjs from 'dayjs';
  import { useGo } from '/@/hooks/web/usePage';
  import { inject } from 'vue';
  import { POPOVER_TOOLTIP_LIST } from './config';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';

  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';
  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  const getSearchFormValue = inject('getSearchFormValue', () => {});

  const props = defineProps<{
    info: any;
    isSingle: boolean;
  }>();

  const go = useGo();
  const { goPath } = useRouteParams();

  const handleGoPath = (url: string, params: any) => {
    const searchFormValue = getSearchFormValue() as any;
    goPath(url, {
      OrgCode: searchFormValue.orgCode,
      TimeDate: searchFormValue.date,
      SfKaiJi: '已开机',
      ...params,
    });
  };
  // 打开新标签页
  const goPage = (path: string, params = {}) => {
    if (!path) return;

    const searchFormValue = getSearchFormValue() as any;
    const { date = dayjs().tz() } = searchFormValue;
    // 构造路由参数
    const url = `${path}?${objectToQueryParams({
      orgCode: props.info.OrgCode || '',
      ...(props.isSingle
        ? {
            timeDimension: searchFormValue.timeDimension || 'week',
          }
        : {
            timeDimension: 'week',
            startDate: date.subtract('5', 'week').format('YYYY-MM-DD'),
          }),
      date: date.format('YYYY-MM-DD'),
      ...params,
    })}`;
    go(url);
  };
</script>

<style lang="less" scoped>
  .info-wrapper {
    border-radius: 2px;
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 8%);

    &.style1 {
      background: linear-gradient(180deg, #e9eeff 2.17%, #fff 100%);
    }

    &.style2 {
      background: linear-gradient(180deg, #e5f9ff 2.17%, #fff 100%);
    }
  }

  .split-line {
    width: 1px;
    height: 60%;
    background: linear-gradient(90deg, rgb(255 255 255 / 0%) -22.03%, #e6e6e6 51.69%, rgb(255 255 255 / 0%) 136.44%);
    transform: scale(0.8);
  }

  .split-line-v {
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, rgb(255 255 255 / 0%) -22.03%, #e6e6e6 51.69%, rgb(255 255 255 / 0%) 136.44%);
    transform: scale(0.8);
  }
</style>
