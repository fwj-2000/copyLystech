<template>
  <div class="flex-container" :class="`columns-${columns} ${props.layout}`" :style="containerStyle">
    <div v-for="(item, index) in config" :key="index" class="flex-item" :style="handleCurrentItemStyle(item)">
      <BasicInfoValueItem v-if="item.format" :info="item" :source-val="props.dataSource[item.dataIndex]" :i18nConfig="i18nConfig"></BasicInfoValueItem>
      <div v-else class="data-point">
        <span class="label">{{ getLable(item) }}: </span>
        <span class="value">{{ toVal(item, props.dataSource) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, computed, reactive } from 'vue';
  import BasicInfoValueItem from './BasicInfoValueItem.vue';
  import { toVal } from '/@/utils/baseinfo';
  import { transformI18n } from '/@/utils';

  const props = defineProps({
    config: {
      type: Object,
      default: () => ({}),
    },
    dataSource: {
      type: Object,
      default: () => {},
    },
    layout: {
      type: String,
      default: 'horizontal', // 默认布局方式为水平布局
    },
    columns: {
      type: Number,
      default: 1, // 默认列数为1
    },
    gapX: {
      type: Number,
      default: 15, // 默认水平间距为15px
    },
    gapY: {
      type: Number,
      default: 2, // 默认垂直间距为15px
    },
    i18nConfig: {
      type: Object,
      default: () => {
        return {
          moduleCode: '',
        };
      },
    },
  });

  // 动态样式
  const containerStyle = computed(() => {
    return {
      '--gap-x': `${props.gapX}px`,
      '--gap-y': `${props.gapY}px`,
    };
  });
  const itemStyle = computed(() => {
    return {
      marginBottom: props.gapY > 0 ? `var(--gap-y)` : undefined,
      marginTop: `var(--gap-y)`,
    };
  });

  // 获取label的值
  function getLable(item) {
    if (props.i18nConfig) {
      const { moduleCode } = props.i18nConfig;
      if (moduleCode && moduleCode != '') {
        const field = item.field || item.dataIndex || item.i18nField;
        return transformI18n(moduleCode, field);
      }
    }
    return item.title;
  }

  // 当前单元格的样式
  function handleCurrentItemStyle(row) {
    if (row.baseCols) {
      return {
        width: `${100 / (24 / row.baseCols.cols)}%`,
        ...itemStyle.value,
      };
    } else {
      return itemStyle.value;
    }
  }
</script>

<style lang="less" scoped>
  .flex-container {
    display: flex;
    flex-wrap: wrap;

    &.vertical {
      .data-point,
      .label,
      .value {
        display: block;
      }
    }
  }

  .flex-item {
    box-sizing: border-box; /* 确保padding不影响宽度计算 */
  }

  /* 根据不同的列数生成不同的样式 */
  .columns-1 .flex-item {
    width: calc(100% - var(--gap-x));
  }

  .columns-2 .flex-item {
    width: calc(50% - var(--gap-x));
  }

  .columns-3 .flex-item {
    width: calc(33.3% - var(--gap-x));
  }

  .columns-4 .flex-item {
    width: calc(25% - var(--gap-x));
  }

  .columns-5 .flex-item {
    width: calc(20% - var(--gap-x));
  }

  .data-point {
    display: flex;
    align-items: flex-start;
    align-items: baseline;
    justify-content: flex-start;
    margin-bottom: var(--gap-y);
  }

  .label {
    color: rgb(26 26 26 / 70%);
    margin-right: 10px;
    margin-top: 3px;
    margin-bottom: 2px;

    /* flex: 1; */
    text-wrap: nowrap;
  }

  .value {
    /* flex-grow: 1; */
    color: rgb(26 26 26 / 70%);
    font-weight: bold;
  }
</style>
