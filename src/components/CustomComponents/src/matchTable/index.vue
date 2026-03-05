<template>
  <div class="match-table">
    <div class="h-full" style="width: 70%">
      <div v-for="table in originTables" :key="table.id" class="mb-4">
        <OriginTable
          :ref="el => setTableRef(el, table.id)"
          :title="table.title"
          :gridOptions="table"
          :selectionType="props.type"
          @selectChange="e => handleSelectChange(e, table.id)"
          @selectNotDisableChange="e => handleSelectChange(e, table.id)" />
      </div>
    </div>
    <div style="width: 35%">
      <TargetTable ref="targetTableRef" :gridOptions="state.targetTable" @lock="handleLock" @unlock="handleUnlock" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, computed, type ComputedRef } from 'vue';
  import { OriginTable, TargetTable } from '/@/components/CustomComponents';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableData, OriginTableConfig, TargetColumnConfig } from './types';

  const { t } = useI18n();

  const emits = defineEmits<{
    register: [];
    reload: [];
  }>();

  const props = withDefaults(
    defineProps<{
      type?: 'checkbox' | 'radio';
      originTablesConfig?: OriginTableConfig[];
      defaultTargetData?: TableData[];
      matchDisplayField?: string;
    }>(),
    {
      type: 'checkbox',
      matchDisplayField: 'seq',
    },
  );

  // 初始化状态
  const isInitialized = ref(false);

  // 在组件内部维护源表数据的副本，用于状态管理
  const originDataStore = reactive<Record<string, TableData[]>>({});

  // 当前单选模式下选中的行（每个表只能选中一行）
  const radioSelectedRows = reactive<Record<string, TableData | null>>({});

  // 计算属性 - 统一处理匹配字段
  const originTables: ComputedRef<(OriginTableConfig & { matchField: string })[]> = computed(() => {
    if (!props.originTablesConfig || props.originTablesConfig.length === 0) {
      return [];
    }

    return props.originTablesConfig.map(table => {
      const matchField = table.idField || props.matchDisplayField || 'seq';

      // 如果数据存储中有数据，使用存储中的数据
      const tableData = originDataStore[table.id] || table.data || [];

      // 确保数据有匹配字段
      const processedData = tableData.map((row, index) => ({
        ...row,
        [matchField]: row[matchField] ?? index + 1,
      }));

      // 确保列配置有匹配字段
      const hasMatchColumn = table.columns.some(col => col.field === matchField);
      const processedColumns = hasMatchColumn
        ? [...table.columns]
        : (() => {
            const checkColumn = props.type === 'checkbox' ? { type: 'checkbox', width: 45, field: 'checkbox' } : { type: 'radio', width: 45, field: 'radio' };
            const columns = [
              checkColumn,
              {
                title: t('component.table.index'),
                field: matchField,
                width: 45,
                fixed: 'left',
              },
              ...table.columns,
            ];
            // const checkboxIndex = columns.findIndex(col => col.type === 'checkbox');
            // const insertIndex = checkboxIndex >= 0 ? checkboxIndex + 1 : 0;
            // columns.splice(insertIndex, 0, {
            //   title: t('component.table.index'),
            //   field: matchField,
            //   width: 45,
            //   fixed: 'left',
            // });
            return columns;
          })();

      return {
        ...table,
        matchField, // 保存每个表的匹配字段
        columns: processedColumns,
        data: processedData,
      };
    });
  });

  const targetColumns: ComputedRef<TargetColumnConfig[]> = computed(() => {
    return originTables.value.map(table => ({
      title: table.title || table.name || table.id,
      field: table.id,
      minWidth: 100,
    }));
  });

  const state = reactive({
    targetTable: computed(() => ({
      columns: targetColumns.value,
      id: 'targetTable',
      matchDisplayField: props.matchDisplayField || 'seq',
    })),
  });

  const tableRefs = ref<Record<string, any>>({});
  const targetTableRef = ref<InstanceType<typeof TargetTable>>();

  function setTableRef(el: any, tableId: string): void {
    if (el) {
      tableRefs.value[tableId] = el;
    }
  }

  // 统一获取表数据的方法
  function getTableDataSource(tableRef: any): TableData[] {
    if (!tableRef) return [];

    if (typeof tableRef.getDataSource === 'function') {
      return tableRef.getDataSource() ?? [];
    }
    if (typeof tableRef.getTableData === 'function') {
      const tableData = tableRef.getTableData();
      return tableData?.tableData || [];
    }
    return [];
  }

  /**
   * 统一的初始化方法
   */
  async function init(config: { originTable: Record<string, TableData[]>; targetTable: TableData[] }): Promise<void> {
    console.log('=== MatchTable 初始化开始 ===');

    isInitialized.value = false;

    try {
      // 1. 预处理所有数据
      const { processedOriginData, processedTargetData } = preprocessData(config);

      // 2. 更新数据存储
      Object.keys(processedOriginData).forEach(tableId => {
        originDataStore[tableId] = processedOriginData[tableId];
      });

      // 3. 一次性设置源表数据
      Object.keys(processedOriginData).forEach(tableId => {
        const tableRef = tableRefs.value[tableId];
        if (tableRef) {
          tableRef.setData(processedOriginData[tableId]);
        }
      });

      // 4. 一次性设置目标表数据
      if (targetTableRef.value) {
        targetTableRef.value.setTargetData(processedTargetData);
      }

      // 5. 更新源表选中状态
      updateOriginTablesSelection(processedTargetData);

      isInitialized.value = true;
      console.log('=== MatchTable 初始化完成 ===');
    } catch (error) {
      console.error('MatchTable 初始化失败:', error);
    }
  }

  // 数据预处理函数
  function preprocessData(config: { originTable: Record<string, TableData[]>; targetTable: TableData[] }): {
    processedOriginData: Record<string, TableData[]>;
    processedTargetData: TableData[];
  } {
    console.log('开始数据预处理...');

    const processedOriginData: Record<string, TableData[]> = {};
    let processedTargetData: TableData[] = [];

    // 1. 预处理源表数据
    Object.keys(config.originTable).forEach(tableId => {
      const dataList = config.originTable[tableId] || [];
      const table = originTables.value.find(t => t.id === tableId);
      const matchField = table?.matchField || props.matchDisplayField || 'seq';

      processedOriginData[tableId] = dataList.map((row, index) => {
        // 确保匹配字段正确设置
        let matchValue;

        if (tableId === 'importTable') {
          matchValue = row.importIndex ?? row.seq ?? index + 1;
        } else if (tableId === 'dbTable') {
          matchValue = row.dbIndex ?? row.seq ?? index + 1;
        } else {
          matchValue = row[matchField] ?? row.seq ?? index + 1;
        }

        return {
          ...row,
          [matchField]: matchValue,
          id: row.id || `temp_${tableId}_${index}`,
          // disabled: false, // 初始化为未禁用
        };
      });
    });

    // 2. 预处理目标表数据
    if (config.targetTable && config.targetTable.length > 0) {
      processedTargetData = config.targetTable.map(row => {
        if (!row || typeof row !== 'object') return row;

        const displayRow: Record<string, any> = {};
        const fullData: Record<string, TableData[]> = {};

        // 直接从预处理后的源表数据中查找匹配数据
        Object.keys(processedOriginData).forEach(tableId => {
          const matchValue = row[tableId];
          if (matchValue == null) return;

          const table = originTables.value.find(t => t.id === tableId);
          if (!table) return;

          const matchField = table.matchField;
          const dataSource = processedOriginData[tableId] || [];

          const resolvedData = dataSource.find(dataRow => {
            const rowValue = dataRow[matchField];
            return rowValue != null && String(rowValue) === String(matchValue);
          });

          if (resolvedData) {
            displayRow[tableId] = matchValue;
            fullData[tableId] = [resolvedData];
          }
        });

        // 传递状态
        if (row._isDisabled !== undefined) {
          displayRow._isDisabled = row._isDisabled;
        }

        // 添加完整数据引用
        if (Object.keys(fullData).length > 0) {
          displayRow._fullData = fullData;
        }

        return displayRow;
      });
    }

    return {
      processedOriginData,
      processedTargetData,
    };
  }

  // 更新源表选中状态
  function updateOriginTablesSelection(targetData: TableData[]): void {
    console.log('更新源表选中状态...');

    // 重置所有源表的选中和禁用状态
    originTables.value.forEach(table => {
      const tableRef = tableRefs.value[table.id];
      if (!tableRef) return;

      // 先清除所有选中和禁用
      tableRef.clearSelection?.();

      const dataSource = originDataStore[table.id] || [];
      dataSource.forEach(row => {
        row.disabled = false;
      });
      tableRef.setData([...dataSource]);
    });

    // 构建选中和禁用映射
    const selectionMap: Record<string, { selected: Set<string | number>; disabled: Set<string | number> }> = {};

    // 初始化映射
    originTables.value.forEach(table => {
      selectionMap[table.id] = {
        selected: new Set<string | number>(),
        disabled: new Set<string | number>(),
      };
    });

    // 收集所有需要选中和禁用的行ID
    targetData.forEach(row => {
      Object.keys(row._fullData || {}).forEach(tableId => {
        const fullData = row._fullData[tableId];
        if (fullData && Array.isArray(fullData)) {
          fullData.forEach(dataItem => {
            if (dataItem?.id) {
              selectionMap[tableId].selected.add(dataItem.id);
              if (row._isDisabled) {
                selectionMap[tableId].disabled.add(dataItem.id);
              }
            }
          });
        }
      });
    });

    // 一次性更新所有源表状态
    originTables.value.forEach(table => {
      const tableRef = tableRefs.value[table.id];
      if (!tableRef) return;

      const { selected, disabled } = selectionMap[table.id];

      console.log(`更新表 ${table.id} 选中状态:`, Array.from(selected));
      console.log(`更新表 ${table.id} 禁用状态:`, Array.from(disabled));

      // 更新数据存储中的禁用状态
      const dataSource = originDataStore[table.id] || [];
      dataSource.forEach(row => {
        if (disabled.has(row.id)) {
          row.disabled = true;
        }
      });

      // 设置表格数据
      tableRef.setData([...dataSource]);

      // 设置选中状态
      if (selected.size > 0) {
        if (props.type === 'radio') {
          // 单选模式下只选中第一个
          const firstSelectedId = Array.from(selected)[0];
          tableRef.setRowsChecked?.({
            ids: [firstSelectedId],
          });
          // 更新单选选中记录
          const selectedRow = dataSource.find(row => row.id === firstSelectedId);
          radioSelectedRows[table.id] = selectedRow || null;
        } else {
          // 多选模式下选中所有
          tableRef.setRowsChecked?.({
            ids: Array.from(selected),
          });
        }
      }
    });
  }

  // 简化的查找逻辑
  function findOriginRow(tableId: string, matchValue: any): TableData | undefined {
    const table = originTables.value.find(t => t.id === tableId);
    if (!table || matchValue == null) return undefined;

    const dataSource = originDataStore[tableId] || [];
    const matchField = table.matchField;

    const found = dataSource.find(row => {
      const rowValue = row[matchField];
      return rowValue != null && String(rowValue) === String(matchValue);
    });

    return found;
  }

  // 设置源表数据
  function setOriginTableData(tableId: string, dataList: TableData[]): void {
    const tableRef = tableRefs.value[tableId];
    if (!tableRef) {
      console.warn(`Table with id "${tableId}" not found`);
      return;
    }

    const table = originTables.value.find(t => t.id === tableId);
    const matchField = table?.matchField || props.matchDisplayField || 'seq';

    // 更新数据存储
    originDataStore[tableId] = dataList.map((row, index) => {
      const matchValue = row[matchField] ?? row.seq ?? index + 1;
      return {
        ...row,
        [matchField]: matchValue,
        id: row.id || `temp_${tableId}_${index}`,
        disabled: row.disabled || false,
      };
    });

    // 更新表格组件
    tableRef.setData(originDataStore[tableId]);
  }

  // 设置多个源表数据
  function setMultipleOriginTableData(dataMap: Record<string, TableData[]>): void {
    Object.keys(dataMap).forEach(tableId => {
      setOriginTableData(tableId, dataMap[tableId]);
    });
  }

  // 设置目标表数据
  function setTargetTableData(dataList: TableData[]): void {
    if (!targetTableRef.value) {
      console.warn('Target table ref not found');
      return;
    }

    const preparedData = (dataList || []).map(row => {
      if (!row || typeof row !== 'object') return row;

      const displayRow: Record<string, any> = {};
      const fullData: Record<string, TableData[]> = {};

      // 处理每个表的匹配数据
      originTables.value.forEach(table => {
        const matchValue = row[table.id];
        if (matchValue == null) return;

        const resolvedData = findOriginRow(table.id, matchValue);
        if (resolvedData) {
          displayRow[table.id] = matchValue;
          fullData[table.id] = [resolvedData];
        }
      });

      if (row._isDisabled !== undefined) {
        displayRow._isDisabled = row._isDisabled;
      }

      if (Object.keys(fullData).length > 0) {
        displayRow._fullData = fullData;
      }

      return displayRow;
    });

    targetTableRef.value.setTargetData(preparedData);
    updateOriginTablesSelection(preparedData);
  }

  // 选中处理 - 支持单选和多选模式
  function handleSelectChange(selectedRows: TableData[], tableId: string): void {
    const table = originTables.value.find(t => t.id === tableId);
    if (!table) return;

    if (props.type === 'radio') {
      // 单选模式处理
      if (selectedRows.length > 0) {
        // 只取最后选中的一行（单选模式下应该只有一行）
        const selectedRow = selectedRows[selectedRows.length - 1];

        // 更新单选选中记录
        radioSelectedRows[tableId] = selectedRow;

        // 确保传递正确的匹配字段值
        const matchField = table.matchField;
        const matchValue = selectedRow[matchField];

        console.log(`表 ${tableId} 单选选中，匹配字段值:`, matchValue);

        targetTableRef.value?.currentDataChange([matchValue], tableId, table.matchField);
      } else {
        // 取消选中
        radioSelectedRows[tableId] = null;
        targetTableRef.value?.currentDataChange([], tableId, table.matchField);
      }
    } else {
      // 多选模式处理
      const matchField = table.matchField;
      const matchValues = selectedRows.map(row => row[matchField]).filter(value => value != null);

      console.log(`表 ${tableId} 多选选中，匹配字段值:`, matchValues);

      targetTableRef.value?.currentDataChange(matchValues, tableId, table.matchField);
    }
  }

  // 锁定处理
  function handleLock(data: Record<string, (string | number)[]>): void {
    console.log('锁定数据:', data);

    originTables.value.forEach(table => {
      const tableRef = tableRefs.value[table.id];
      if (tableRef && data[table.id]) {
        const idsToLock = data[table.id];

        // 更新数据存储中的禁用状态
        const dataSource = originDataStore[table.id] || [];
        dataSource.forEach(row => {
          if (idsToLock.includes(row.id)) {
            row.disabled = true;
          }
        });

        // 更新表格显示
        tableRef.setData([...dataSource]);

        console.log(`表 ${table.id} 锁定行:`, idsToLock);
      }
    });
  }

  // 解锁处理
  function handleUnlock(data: Record<string, (string | number)[]>): void {
    console.log('解锁数据:', data);

    originTables.value.forEach(table => {
      const tableRef = tableRefs.value[table.id];
      if (tableRef && data[table.id]) {
        const idsToUnlock = data[table.id];

        // 更新数据存储中的禁用状态
        const dataSource = originDataStore[table.id] || [];
        dataSource.forEach(row => {
          if (idsToUnlock.includes(row.id)) {
            row.disabled = false;
          }
        });

        // 更新表格显示
        tableRef.setData([...dataSource]);

        console.log(`表 ${table.id} 解锁行:`, idsToUnlock);
      }
    });
  }

  // 获取当前选中的行（单选模式专用）
  function getSelectedRows(): Record<string, TableData | null> {
    if (props.type === 'radio') {
      return { ...radioSelectedRows };
    } else {
      console.warn('getSelectedRows 方法仅在单选模式下可用');
      return {};
    }
  }

  // 设置选中的行（单选模式专用）
  function setSelectedRows(selections: Record<string, TableData | null>): void {
    if (props.type === 'radio') {
      Object.keys(selections).forEach(tableId => {
        const selectedRow = selections[tableId];
        const tableRef = tableRefs.value[tableId];

        if (tableRef && selectedRow) {
          // 更新单选选中记录
          radioSelectedRows[tableId] = selectedRow;

          // 设置表格选中状态
          tableRef.setRowsChecked?.({
            ids: [selectedRow.id],
          });

          // 触发选中事件
          handleSelectChange([selectedRow], tableId);
        } else if (tableRef) {
          // 取消选中
          radioSelectedRows[tableId] = null;
          tableRef.clearSelection?.();
          handleSelectChange([], tableId);
        }
      });
    } else {
      console.warn('setSelectedRows 方法仅在单选模式下可用');
    }
  }

  // 清空所有选中状态（单选模式专用）
  function clearAllSelections(): void {
    if (props.type === 'radio') {
      Object.keys(radioSelectedRows).forEach(tableId => {
        radioSelectedRows[tableId] = null;
        const tableRef = tableRefs.value[tableId];
        if (tableRef) {
          tableRef.clearSelection?.();
        }
      });
    } else {
      console.warn('clearAllSelections 方法仅在单选模式下可用');
    }
  }

  // 结果转换
  function transformMatchResults(rawResults: any[]): any[] {
    return (rawResults || [])
      .map(row => {
        if (!row || typeof row !== 'object') return null;

        const result: Record<string, any> = {};

        // 直接处理每个表的数组数据
        originTables.value.forEach(table => {
          const tableId = table.id;

          // 如果该表的数据是数组且不为空，取第一个元素
          if (row[tableId] && Array.isArray(row[tableId]) && row[tableId].length > 0) {
            result[tableId] = { ...row[tableId][0] };
          }
          // 如果该表的数据是对象，直接使用
          else if (row[tableId] && typeof row[tableId] === 'object' && !Array.isArray(row[tableId])) {
            result[tableId] = { ...row[tableId] };
          }
        });

        // 添加状态
        if (row._isDisabled !== undefined) {
          result._isDisabled = row._isDisabled;
        }

        return Object.keys(result).length > 0 ? result : null;
      })
      .filter(Boolean);
  }

  function getMatchResult(): any[] {
    if (targetTableRef.value) {
      const rawResults = targetTableRef.value.getMatchResult();
      return transformMatchResults(rawResults);
    }
    return [];
  }

  function getAllMatchResults(): any[] {
    if (targetTableRef.value) {
      const rawResults = targetTableRef.value.getAllMatchResults();
      return transformMatchResults(rawResults);
    }
    return [];
  }

  function getUnlockedMatchResults(): any[] {
    if (targetTableRef.value) {
      const rawResults = targetTableRef.value.getUnlockedMatchResults();
      return transformMatchResults(rawResults);
    }
    return [];
  }

  // 在 defineExpose 中暴露所有方法
  defineExpose({
    init,
    setOriginTableData,
    setTargetTableData,
    setMultipleOriginTableData,
    getMatchResult,
    getAllMatchResults,
    getUnlockedMatchResults,
    // 单选模式专用API
    getSelectedRows,
    setSelectedRows,
    clearAllSelections,
  });
</script>

<style lang="less" scoped>
  .match-table {
    display: flex;
    min-height: 500px;
  }
</style>
