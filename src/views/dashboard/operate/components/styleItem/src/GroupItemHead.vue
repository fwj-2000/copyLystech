<!-- 平铺页分组单个数据标题 -->
<template>
  <div class="head-container flex ct-between">
    <div class="flex ct-start">
      <span class="title">{{ props.groupName.replace(/(模切)/gi, '') }}</span>
      <slot name="groupHeadLeft">
        <span v-if="!props.groupValue" class="value">{{ props.title }}</span>
        <span v-else class="value">{{ props.title }}：{{ props.groupValue }}</span>
      </slot>
    </div>
    <div class="flex row">
      <img :src="chartSvg" class="chart-icon mr-8px" @click="goDetail()" />
      <a-popover v-if="!isEmpty(props.popoverInfoList)" placement="right">
        <template #content>
          <InfoPopover :info-list="props.popoverInfoList"></InfoPopover>
        </template>
        <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
      </a-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { groupItemHeadProps } from './props';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';

  import InfoPopover from '/@/views/dashboard/operate/components/InfoPopover.vue';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import { inject } from 'vue';
  import { isEmpty } from 'lodash-es';

  const props = defineProps(groupItemHeadProps);
  const go = useGo();

  const getExtraParams = inject('getExtraParams', () => {});
  // 去详情页
  const goDetail = () => {
    const orgCode = props.orgCode;
    const { timeDimension, date } = props.searchFormValue;
    const extraParams = getExtraParams() as any;
    // 构造路由参数
    const url = `${props.trendUrl}?${objectToQueryParams({
      orgCode,
      dimension: timeDimension,
      date: date.format('YYYY-MM-DD'),
      ...extraParams,
    })}`;
    go(url);
  };
</script>

<style lang="less" scoped>
  .head-container {
    height: 40px;
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    overflow: hidden;

    .chart-icon {
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }

    .value {
      color: #1a1a1a;
      font-weight: 700;

      &.error {
        color: #ff1417;
      }
    }

    .title {
      display: inline-block;
      position: relative;
      // width: 44px;
      margin: 0 7px;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: -7px;
        height: 12px;
        width: 100%;
        padding: 0 2px 0 6.36px;
        border-radius: 7px;
        background: linear-gradient(90deg, rgb(255 123 0 / 63%) 0%, rgb(255 255 255 / 0%) 81.13%);
      }
    }
  }
</style>
