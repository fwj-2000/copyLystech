<template>
  <div class="origin-table-wrap">
    <div class="origin-table-title">{{ props.title }}</div>
    <Grid></Grid>
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const emit = defineEmits(['selectChange', 'selectNotDisableChange']);

  const props = defineProps({
    gridOptions: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: '',
    },
    selectionType: {
      type: String,
      default: 'checkbox',
      validator: (value: string) => ['checkbox', 'radio'].includes(value),
    },
  });

  const gridConfig = {
    id: '',
    columns: [],
    toolbarConfig: {
      enabled: false,
    },
    pagerConfig: {
      enabled: false,
    },
    height: '',
    minHeight: 300,
    maxHeight: 360,
    ...props.gridOptions,
  };

  // 根据选择类型配置不同的选择配置
  if (props.selectionType === 'radio') {
    gridConfig.radioConfig = {
      checkMethod: ({ row }) => {
        return !row.disabled;
      },
      trigger: 'row',
    };
    // 移除多选配置
    delete gridConfig.checkboxConfig;
  } else {
    gridConfig.checkboxConfig = {
      checkMethod: ({ row }) => {
        return !row.disabled;
      },
    };
    // 移除单选配置
    delete gridConfig.radioConfig;
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: gridConfig,
    gridEvents: {
      checkboxChange: ({ records }) => {
        emit('selectChange', records);
        const notDisableRecords = records.filter(item => !item.disabled);
        emit('selectNotDisableChange', notDisableRecords);
      },
      radioChange: ({ row }) => {
        // 单选模式下，record 是当前选中的行，records 是空数组
        const records = row ? [row] : [];
        console.log(records);
        emit('selectChange', row);
        const notDisableRecords = records.filter(item => !item.disabled);
        emit('selectNotDisableChange', notDisableRecords);
      },
    },
  });

  // 设置行是否禁用
  function setRowsDisabled(ids: (string | number)[], isLock: boolean): void {
    if (!ids || ids.length === 0) return;
    const allData = gridApi.getDataSource();
    let updated = false;
    allData.forEach(item => {
      if (ids.includes(item.id)) {
        item.disabled = isLock;
        updated = true;
      }
    });
    if (updated) {
      gridApi.grid.updateData(allData);
    }
  }

  function clearSelection(): void {
    if (props.selectionType === 'radio') {
      gridApi.grid.clearRadioRow();
    } else {
      gridApi.grid.clearCheckboxRow();
    }
  }

  function setRowsChecked(
    options: {
      ids?: (string | number)[];
      displayValues?: any[];
      displayField?: string;
      append?: boolean;
    } = {},
  ): void {
    const { ids = [], displayValues = [], displayField, append = false } = options;
    const dataSource = gridApi.getDataSource();
    const records: any[] = [];

    if (!append) {
      clearSelection();
    }

    if (ids.length > 0) {
      ids.forEach(id => {
        const row = dataSource.find(item => item.id === id);
        if (row) {
          records.push(row);
        }
      });
    }

    if (displayField && displayValues.length > 0) {
      displayValues.forEach(value => {
        const row = dataSource.find(item => String(item[displayField]) === String(value));
        if (row && !records.includes(row)) {
          records.push(row);
        }
      });
    }

    if (props.selectionType === 'radio') {
      // 单选模式下只设置第一个记录
      if (records.length > 0) {
        gridApi.grid.setRadioRow(records[0]);
      } else {
        gridApi.grid.clearRadioRow();
      }
    } else {
      // 多选模式下设置所有记录
      records.forEach(row => gridApi.grid.setCheckboxRow(row, true));
    }
  }

  function getDataSource(): any[] {
    return gridApi.getDataSource() || [];
  }

  function setData(dataList: any[]) {
    gridApi.grid.reloadData(dataList);
  }

  defineExpose({
    setRowsDisabled,
    setRowsChecked,
    clearSelection,
    getDataSource,
    setData,
  });
</script>

<style lang="less" scoped>
  .origin-table-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid rgb(239 239 239 / 100%);

    .origin-table-title {
      height: 36px;
      line-height: 36px;
      font-size: 16px;
      font-weight: 600;
      padding-left: 20px;
      background: rgb(239 239 239 / 100%);
      margin-bottom: 10px;
    }
  }
</style>
