<template>
  <table class="ly-table-simple">
    <tr v-for="(item, index) in colData" :key="index">
      <template v-for="(colitem, colIndex) in item" :key="colIndex">
        <td :colspan="colitem.keyCellSpan">{{ colitem.name }}</td>
        <td :colspan="colitem.valueCellSpan">{{ colitem.value }}</td>
      </template>
    </tr>
  </table>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  interface Colums {
    key?: string;
    title: string;
    dataIndex: string;
    unit?: string; // 单位
    format?: Function; // 文本格式化
    keyCellSpan?: number; // 表示表头占用的格子数
    valueCellSpan: number; // 用于 表格值 的格子跨度
  }
  interface DataSource {
    [key: string]: string;
  }
  const props = withDefaults(
    defineProps<{
      colums?: Colums[]; // 表格键值对
      dataSource?: DataSource; // 数据源
      groupNum?: number; // 列数
      emptyText?: string; // 空数据显示的文案
      autoFillRemaining?: boolean; // 是否自动填充剩余格子
    }>(),
    {
      colums: () => [],
      groupNum: 3,
      emptyText: '--',
    },
  );

  const colData = computed(() => {
    const arr: any = [];
    const _data = props.dataSource;
    const _groupNum = props.groupNum;
    const _colums = props.colums;
    let _group: {
      name: string;
      value: string;
      keyCellSpan: number;
      valueCellSpan: number;
    }[] = [];

    for (let i = 0; i < _colums.length; i++) {
      const _item = _colums[i];
      let _groupVal = props.emptyText;
      if (_data) {
        const _value = _data[_item.dataIndex];
        if (typeof _value !== 'undefined' && _value != null) {
          _groupVal = _value + (_item.unit || '');
          if (_item.format) {
            _groupVal = _item.format(_groupVal);
          }
        }
      }
      _group.push({
        name: _item.title,
        value: _groupVal,
        keyCellSpan: _item.keyCellSpan || 1,
        valueCellSpan: _item.valueCellSpan || 1,
      });

      if ((i + 1) % _groupNum === 0 || i === _colums.length - 1) {
        // 当达到一组或到最后一个时
        let totalKeyCellSpan = 0;
        let totalValueCellSpan = 0;
        for (const groupItem of _group) {
          totalKeyCellSpan += groupItem.keyCellSpan;
          totalValueCellSpan += groupItem.valueCellSpan;
        }

        if (i === _colums.length - 1) {
          // 如果是最后一组
          let lastGroup = _group;
          let remainingSpaces = _groupNum * 2 - (totalKeyCellSpan + totalValueCellSpan);
          lastGroup[lastGroup.length - 1].valueCellSpan += remainingSpaces; // 调整最后一个的 `value` 跨度
        }

        arr.push(_group);
        _group = [];
      }
    }

    return arr;
  });
</script>
<style lang="less">
  @border-color: #dbdbdb;

  .ly-table-simple {
    width: 100%;
    border: 1px solid @border-color;

    tr {
      border-bottom: 1px solid @border-color;
    }

    td {
      width: 200px;
      padding: 10px;
      border-right: 1px solid @border-color;
      color: #666;

      &:nth-child(2n + 1) {
        width: 140px;
        background: #f3f3f3;
        color: #1a1a1a;
      }
    }
  }
  // todo: 添加暗黑模式下的样式调整
</style>
