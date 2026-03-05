<!-- 文本图片报表 -->
<template>
  <div class="compo-container">
    <div class="compo-body">
      <img :src="props.info.image" class="ticket-img" />
      <div class="compo-content flex flex-col item-start">
        <div class="title flex ct-start">
          <span style="margin-right: 4px">{{ props.info.main.label }}</span>
          <img :src="vectorSvg" style="margin-bottom: 2px" />
        </div>
        <div class="value">{{ props.info.main.value }}</div>
      </div>
    </div>
    <div class="compo-footer flex ct-start">
      <div v-for="(item, idx) in props.info.secondary" :key="idx" class="item-content flex">
        <span class="title">{{ item.label }}</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import vectorSvg from '/@/assets/svg/report/vector.svg';
  import { TextReportInfo } from '../types';

  const props = defineProps({
    info: {
      type: Object as PropType<TextReportInfo>,
      default: () => ({}),
    },
  });
</script>

<style lang="less" scoped>
  .compo-container {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    border-radius: 3px;
    background: #fff;
    box-shadow: 0 1px 15px 0 rgb(0 0 0 / 5%), 0 -1px 15px 0 rgb(0 0 0 / 5%);

    .compo-footer {
      width: 100%;
      height: 35px;
      padding: 0 14px;

      .item-content {
        span {
          color: #1a1a1a;
        }

        &::after {
          content: '';
          display: inline-block;
          width: 1px;
          height: 16px;
          background: #e6e6e6;
          margin: 0 8px;
        }

        &:last-child {
          &::after {
            display: none;
          }
        }
      }
    }

    .compo-body {
      position: relative;
      padding-bottom: 3px;

      .ticket-img {
        width: 100%;
        aspect-ratio: 10 / 3;
      }

      .compo-content {
        position: absolute;
        top: 0;
        left: 35%;
        width: 65%;
        height: 100%;

        .title {
          height: 24px;
          color: #666;
        }

        .value {
          color: #1a1a1a;
          font-family: Roboto, sans-serif;
          font-size: 28px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }
    }
  }
</style>
