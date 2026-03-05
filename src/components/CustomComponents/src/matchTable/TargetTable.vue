<template>
  <div class="origin-table-wrap">
    <div class="origin-table-title">匹配结果</div>
    <Grid>
      <template #status="{ row }">
        {{ row.isDisabled ? '已匹配' : '待匹配' }}
      </template>
      <template #actions="{ row }">
        <div class="table-actions flex">
          <!-- <a-tooltip :title="row.isDisabled ? '取消匹配' : '确认匹配'">
          </a-tooltip> -->
          <!-- <div class="text-danger" v-if="row.isDisabled" @click="unlock(row)">
            <CloseCircleOutlined />
          </div> -->
          <div class="table-a" v-if="!row.isDisabled" @click="lock(row)">
            <CheckCircleOutlined />
          </div>
          <div class="table-a ml-5px" @click="handleDel(row)">
            <span class="icon-ym icon-ym-delete"></span>
          </div>
        </div>
      </template>
    </Grid>

    <div class="match-icon">
      <i class="icon-ym ym-icon ym-diecut ym-diecut-link"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['lock', 'unlock']);

  const props = defineProps({
    gridOptions: {
      type: Object,
      default: () => {
        return {
          columns: [],
          matchDisplayField: 'seq',
        };
      },
    },
    validateSample: {
      type: Boolean,
      default: true,
    },
  });

  // 记录每个目标行对应的完整原始数据
  const fullDataMap = ref<Record<number, Record<string, any>>>({});

  // 获取用于展示的字段
  const matchDisplayField = computed(() => props.gridOptions.matchDisplayField || 'seq');
  const columns = [
    {
      title: t('状态'),
      field: 'status',
      width: 80,
      slots: { default: 'status' },
    },
    {
      title: t('common.action'),
      field: 'actions',
      slots: { default: 'actions' },
      fixed: 'right',
      width: 60,
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'targetTable',
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      position: 'modal',
      columns: props.gridOptions.columns.concat(columns),
    },
  });
  const { getDataSource } = gridApi;

  // 锁住当前行
  function lock(row) {
    // 校验当前行数据是否与其他行数据重复
    if (props.validateSample) {
      const data = getDataSource();
      console.log('data', data, row);
      // props.gridOptions.columns.forEach((col) => {
      //   if (col.field !== matchDisplayField.value) {
      //     const value = row[col.field];
      //     const isRepeat = data.some((item) => item !== row && item[col.field] === value);
      //     if (isRepeat) {
      //       row.isDisabled = true;
      //       return;
      //     }
      //   }
      // })
    }
    row.isDisabled = true;
    emit('lock', getRowFullData(row));
  }

  // 解开当前行
  function unlock(row) {
    row.isDisabled = false;
    emit('unlock', getRowFullData(row));
  }

  // 获取行的完整数据用于锁定/解锁
  function getRowFullData(row): Record<string, (string | number)[]> {
    const rowIndex = getDataSource().findIndex(item => item === row);
    const fullData = fullDataMap.value[rowIndex] || {};

    const result: Record<string, (string | number)[]> = {};
    Object.keys(fullData).forEach(tableId => {
      const dataArray = fullData[tableId];
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        result[tableId] = dataArray.map(item => item.id).filter(Boolean);
      }
    });

    return result;
  }

  /**
   * 选中数据发生变化
   * @param data 新选择的匹配值数组
   * @param id 对应的目标列 id
   * @param displayField 用于显示的字段名
   */
  // function currentDataChange(data: any[], id: string, displayField?: string) {
  //   const columns = gridApi.grid.getFullColumns();
  //   if (!columns.find(item => item.field === id)) {
  //     return;
  //   }

  //   const targetList = getDataSource();
  //   const rowIndex = targetList.findIndex(item => !item.isDisabled);

  //   const displayValues = data.map(item => item);
  //   const displayValue = displayValues.length > 0 ? displayValues[0] ?? '' : '';

  //   if (rowIndex > -1) {
  //     // 更新已有行
  //     targetList[rowIndex][id] = displayValue;

  //     if (!fullDataMap.value[rowIndex]) {
  //       fullDataMap.value[rowIndex] = {};
  //     }
  //     if (Array.isArray(data) && data.length > 0) {
  //       fullDataMap.value[rowIndex][id] = data;
  //     } else {
  //       delete fullDataMap.value[rowIndex][id];
  //       if (Object.keys(fullDataMap.value[rowIndex]).length === 0) {
  //         delete fullDataMap.value[rowIndex];
  //       }
  //     }
  //   } else if (Array.isArray(data) && data.length > 0) {
  //     // 新增目标行
  //     const newRow = { [id]: displayValue };
  //     gridApi.grid.insertAt(newRow, -1);
  //     const newRowIndex = getDataSource().length - 1;
  //     fullDataMap.value[newRowIndex] = { [id]: data };
  //   }
  // }
  function currentDataChange(data: any[], id: string, displayField?: string, fullDataArray?: any[]): void {
    const columns = gridApi.grid.getFullColumns();
    if (!columns.find(item => item.field === id)) {
      return;
    }

    const targetList = getDataSource();
    const rowIndex = targetList.findIndex(item => !item.isDisabled);

    const displayValues = data.map(item => item);
    const displayValue = displayValues.length > 0 ? displayValues[0] ?? '' : '';

    if (rowIndex > -1) {
      // 更新已有行
      targetList[rowIndex][id] = displayValue;

      if (!fullDataMap.value[rowIndex]) {
        fullDataMap.value[rowIndex] = {};
      }
      if (Array.isArray(data) && data.length > 0) {
        // 关键修复：如果有传递完整数据，使用完整数据；否则使用匹配值
        fullDataMap.value[rowIndex][id] = fullDataArray && fullDataArray.length > 0 ? fullDataArray : data;
      } else {
        delete fullDataMap.value[rowIndex][id];
        if (Object.keys(fullDataMap.value[rowIndex]).length === 0) {
          delete fullDataMap.value[rowIndex];
        }
      }
    } else if (Array.isArray(data) && data.length > 0) {
      // 新增目标行
      const newRow = { [id]: displayValue };
      gridApi.grid.insertAt(newRow, -1);
      const newRowIndex = getDataSource().length - 1;
      // 关键修复：如果有传递完整数据，使用完整数据；否则使用匹配值
      fullDataMap.value[newRowIndex] = { [id]: fullDataArray && fullDataArray.length > 0 ? fullDataArray : data };
    }
  }

  /**
   * 设置目标表格数据 - 关键修复：确保正确显示匹配值
   * @param dataList 目标表数据
   */
  function setTargetData(dataList: any[]) {
    const displayField = matchDisplayField.value;
    fullDataMap.value = {};

    console.log('设置目标表数据:', dataList);

    const displayData = dataList.map((row, index) => {
      if (!row || typeof row !== 'object') {
        return row;
      }

      const rowFullData: Record<string, any> = {};
      const displayRow: Record<string, any> = {};

      Object.entries(row).forEach(([key, value]) => {
        if (key === '_fullData') {
          if (value && typeof value === 'object') {
            Object.entries(value as Record<string, any[]>).forEach(([innerKey, innerValue]) => {
              if (Array.isArray(innerValue)) {
                rowFullData[innerKey] = innerValue;
              }
            });
          }
          return;
        }

        if (key === '_isDisabled') {
          displayRow.isDisabled = value;
          return;
        }

        // 关键修复：直接显示传入的匹配值
        // 对于源表字段，直接显示匹配值（就是序号）
        displayRow[key] = value;
      });

      if (Object.keys(rowFullData).length > 0) {
        fullDataMap.value[index] = rowFullData;
      }

      return displayRow;
    });

    console.log('处理后显示数据:', displayData);
    gridApi.grid.reloadData(displayData);
  }

  /**
   * 获取匹配结果（包含锁定状态）
   */
  function getMatchResult() {
    const targetList = getDataSource();
    return targetList
      .map((row, rowIndex) => {
        const storedRow = fullDataMap.value[rowIndex] || {};
        const resultRow: Record<string, any> = {};

        Object.entries(storedRow).forEach(([key, value]) => {
          if (value !== undefined) {
            resultRow[key] = value;
          }
        });

        Object.entries(row).forEach(([key, value]) => {
          if (key === 'actions' || key === '_fullData') {
            return;
          }
          if (key === 'isDisabled' || key === '_isDisabled') {
            if (value !== undefined) {
              resultRow._isDisabled = Boolean(value);
            }
            return;
          }
          if (resultRow[key] !== undefined) {
            return;
          }
          if (value !== undefined && value !== null) {
            resultRow[key] = value;
          }
        });

        if (row.isDisabled !== undefined) {
          resultRow._isDisabled = Boolean(row.isDisabled);
        }

        if (Object.keys(resultRow).length === 0) {
          return null;
        }

        return resultRow;
      })
      .filter(Boolean);
  }

  function handleDel(row) {
    const rowFullData = getRowFullData(row);
    const dataSource = getDataSource();
    const rowIndex = dataSource.findIndex(item => item === row);

    gridApi.remove(row);

    if (rowIndex > -1) {
      const reorderedMap: Record<number, Record<string, any>> = {};
      Object.entries(fullDataMap.value).forEach(([key, value]) => {
        const index = Number(key);
        if (Number.isNaN(index) || index === rowIndex) {
          return;
        }
        const nextIndex = index > rowIndex ? index - 1 : index;
        reorderedMap[nextIndex] = value;
      });
      fullDataMap.value = reorderedMap;
    }

    emit('unlock', Object.keys(rowFullData).length > 0 ? rowFullData : row);
  }

  /**
   * 获取全部匹配结果
   */
  function getAllMatchResults() {
    return getMatchResult();
  }

  /**
   * 获取未锁定的匹配结果
   */
  function getUnlockedMatchResults() {
    return getMatchResult().filter(item => !item._isDisabled);
  }

  defineExpose({
    currentDataChange,
    setTargetData,
    getMatchResult,
    getAllMatchResults,
    getUnlockedMatchResults,
  });
</script>

<style lang="less" scoped>
  .origin-table-wrap {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;

    .origin-table-title {
      height: 36px;
      line-height: 36px;
      font-size: 16px;
      font-weight: 600;
      padding-left: 5px;
      color: #fff;
      background: linear-gradient(to right, @primary-color 0%, rgb(255 123 0 / 0%));
    }

    .match-icon {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      position: absolute;
      z-index: 10;
      top: 50%;
      left: -30px;
      color: #fff;
      background: @primary-color;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        font-size: 30px;
      }
    }

    .table-actions {
      font-size: 15px;
      text-align: center;
    }
  }
</style>
