<!-- 出勤率&五大中心|模具厂 -->
<template>
  <div class="px-6px">
    <!-- 标题 -->
    <div class="w-[100%] flex items-center justify-between h-[24px] text-[12px]">
      <div class="flex items-center justify-start">
        <span
          v-for="(item, idx) in getTitleDataOptions(operateInfo)"
          :key="idx"
          class="mr-8px text-hover"
          @click="goPersonalDetailPage({ orgCode: operateInfo.OrgCode || 'AllBU' })">
          {{ item?.text || '' }}
          {{ props.operateInfo?.[item?.key] || '' }}
          {{ item?.suffix || '' }}
        </span>
      </div>
      <div class="flex">
        <img :src="rankSvg" class="zoom-icon mr-8px" @click="goPage('/dashboard/operate/ranking', { name: EModules.ATTENDANCE, title: '出勤率排名' })" />
        <img :src="chartSvg" class="zoom-icon mr-6px" @click="goPage('/dashboard/operate/attendanceRate/detail')" />
        <a-popover placement="right">
          <template #content>
            <RatePopover />
          </template>
          <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
        </a-popover>
      </div>
    </div>
    <!-- 内容 -->
    <div class="w-[100%] h-[calc(100%-30px)] flex items-center justify-between gap-[6px]">
      <!-- IDL -->
      <div class="w-[33%] h-[100%] info-wrapper idl-wrapper">
        <IDLInfo :info="props.operateInfo" />
      </div>
      <!-- DL -->
      <div class="w-[33%] h-[100%] info-wrapper dl-wrapper">
        <DLInfo :info="props.operateInfo" />
      </div>
      <!-- 五大中心 -->
      <div class="w-[33%] h-[100%]">
        <ExtraInfo :operateInfo="props.operateInfo" :centerInfo="props.centerInfo" :modelInfo="props.modelInfo" :queryInfo="props.queryInfo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject } from 'vue';
  import { getTitleDataOptions } from './config';

  import RatePopover from '/@/views/dashboard/operate/attendanceRate/components/RatePopover.vue';
  import IDLInfo from './IDLInfo.vue';
  import DLInfo from './DLInfo.vue';
  import ExtraInfo from './ExtraInfo.vue';
  import { EModules } from '/@/views/dashboard/operate/ranking/type';

  import rankSvg from '/@/assets/svg/report/rank.svg';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  interface IProps {
    operateInfo: any;
    centerInfo: any;
    modelInfo: any;
    queryInfo: any;
  }
  const props = withDefaults(defineProps<IProps>(), {
    operateInfo: {},
    centerInfo: [],
    modelInfo: [],
    queryInfo: {},
  });
  const goPage: any = inject('goPage', () => {});
  const goPersonalDetailPage: any = inject('goPersonalDetailPage', () => {});
</script>

<style lang="less" scoped>
  .info-wrapper {
    border-radius: 2px;
    background: linear-gradient(180deg, #e9eeff 2.17%, #fff 100%);
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 8%);

    &.idl-wrapper {
      background: linear-gradient(180deg, #e9eeff 2.17%, #fff 100%);
    }

    &.dl-wrapper {
      background: linear-gradient(180deg, #e5f9ff 2.17%, #fff 100%);
    }
  }
</style>
