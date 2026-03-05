<template>
  <div class="basic-info mt-8px">
    <div
      v-if="Object.keys(state.columns).length"
      v-for="(item, index) in state.columns"
      :key="index"
      :class="['cell', `w-1/${props.colNum}`, showTableBorder(index, 'col') ? 'br-0' : '', showTableBorder(index, 'row') ? 'bb-0' : '']">
      <div class="label">{{ item.title }}：</div><div class="value">{{ state.basicInfo[item.dataIndex] }}</div>
    </div>
    <div class="cell w-1/1 br-0 bb-0" style="border-top: 1px solid #ccc" v-if="Object.keys(props.extra).length">
      <div class="label">{{ state.extra.title }}：</div><div class="value">{{ state.basicInfo[state.extra.dataIndex] }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  const props = defineProps({
    columns: {
      type: Array,
      default: () => [],
    },
    basicInfo: {
      type: Object,
      default: () => ({}),
    },
    extra: {
      type: Object,
      default: () => ({}),
    },
    colNum: {
      type: Number,
      default: 3,
    },
  });

  const state = reactive({
    columns: props.columns as any,
    basicInfo: {},
    extra: props.extra,
  });

  watch(
    () => props.basicInfo,
    newValue => {
      state.basicInfo = newValue;
    },
    { deep: true },
  );

  function showTableBorder(index, type = 'row') {
    if (type == 'row') {
      const remainder = state.columns.length % props.colNum;
      const lastRowIndex = remainder === 0 ? state.columns.length - props.colNum : state.columns.length - remainder;
      return index >= lastRowIndex;
    }
    return (index + 1) % props.colNum == 0;
  }
</script>
<style lang="less" scoped>
  .basic-info {
    display: flex;
    flex-flow: wrap;
    border: 1px solid #ccc;

    .cell {
      // height: 42px;
      // line-height: 42px;
      // padding-left: 12px;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      display: flex;

      .label {
        width: 140px;
        background: #f3f3f3;
        color: #1a1a1a;

        /* 中文/正文14 */

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        padding: 10px 0 10px 12px;
        border-right: 1px solid #dbdbdb;
      }

      .value {
        flex: 1;
        word-break: break-all;
        color: #666;

        /* 中文/正文14 */

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        padding: 10px 14px;
      }
    }

    .br-0 {
      border-right: none;
    }

    .bb-0 {
      border-bottom: none;
    }
  }
</style>
