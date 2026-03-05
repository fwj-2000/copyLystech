<!-- 平铺页分组单个数据项 -->
<template>
  <div class="compo-container">
    <div class="compo-header-container flex ct-between">
      <div class="title flex ct-start">
        <p class="factory-name">{{ props.info.OrgName }}</p>
        <slot name="itemHeadLeft"></slot>
      </div>
      <div class="flex">
        <slot name="itemHeadRight"></slot>
        <img :src="chartSvg" class="chart-icon ml-8px" @click="goDetail()" />
      </div>
    </div>
    <div class="relative compo-content-container">
      <component :is="props.component" :info="props.info" :listData="props.listData" :extraInfo="props.extraInfo"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject } from 'vue';
  import { groupItemDataProps } from './props';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';

  import chartSvg from '/@/assets/svg/report/chart.svg';

  const props = defineProps(groupItemDataProps);
  const go = useGo();
  const getSearchFormValue = inject('getSearchFormValue', () => {});
  const getExtraParams = inject('getExtraParams', () => {});
  // 去详情页
  const goDetail = () => {
    const orgCode = props.info.OrgCode;
    const { timeDimension, date } = getSearchFormValue() as any;
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
  @titleHeight: 38px;

  .compo-container {
    width: 100%;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;

    .compo-content-container {
      width: 100%;
      height: calc(100% - @titleHeight);
      padding: 12px 0 0;
      background-color: #fff;

      .chart-wrapper {
        width: 100%;
        height: 100%;
      }
    }

    .compo-header-container {
      width: 100%;
      padding: 0 12px;
      height: @titleHeight;
      background-color: #f7f7f7;

      .chart-icon {
        cursor: pointer;

        &:hover {
          transform: scale(1.2);
        }
      }

      .value-wrapper {
        color: #1a1a1a;
        font-size: 16px;
        line-height: 22px;

        .value {
          font-size: 18px;
          line-height: 22px;
        }

        &.error {
          color: #e12929;
        }
      }

      .title {
        position: relative;
        color: #1a1a1a;

        .factory-name {
          font-size: 16px;
        }

        .illustrate {
          margin-left: 11px;
        }
      }
    }
  }
</style>
