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
      <TargetTable ref="targetTableRef" :gridOptions="props.targetTableConfig" @lock="handleLock" @unlock="handleUnlock" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch, onMounted } from 'vue';
  import OriginTable from './OriginTable.vue';
  import TargetTable from './TargetTable.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableData, OriginTableConfig, TargetColumnConfig } from './types';
  import { cloneDeep } from 'lodash-es';
  const { t } = useI18n();

  const props = withDefaults(
    defineProps<{
      type?: 'checkbox' | 'radio';
      originTablesConfig?: OriginTableConfig[];
      defaultTargetData?: TableData[];
      matchDisplayField?: string;
      targetTableConfig?: any;
    }>(),
    {
      type: 'checkbox',
      matchDisplayField: 'seq',
      targetTableConfig: () => {},
    },
  );
  // 计算属性 - 统一处理匹配字段
  const originTables = computed(() => {
    if (!props.originTablesConfig || props.originTablesConfig.length === 0) {
      return [];
    }

    return props.originTablesConfig.map(table => {
      const matchField = table.idField || props.matchDisplayField || 'seq';

      // 确保列配置有匹配字段
      const hasMatchColumn = table.columns.some(col => col.field === matchField);
      const processedColumns = hasMatchColumn
        ? [...table.columns]
        : (() => {
            // const checkColumn = props.type === 'checkbox' ? { type: 'checkbox', width: 45, field: 'checkbox' } : { type: 'radio', width: 45, field: 'radio' };
            const columns = [
              // checkColumn,
              {
                title: t('component.table.index'),
                field: matchField,
                width: 45,
                fixed: 'left',
              },
              ...table.columns,
            ];
            return columns;
          })();

      return {
        ...table,
        matchField, // 保存每个表的匹配字段
        columns: processedColumns,
      };
    });
  });

  const emit = defineEmits(['selectChange', 'lock', 'unlock']);

  const targetTableRef = ref<InstanceType<typeof TargetTable>>();
  const tableRefs = ref<Record<string, any>>({});
  const setTableRef = (el: any, id: string) => {
    tableRefs.value[id] = el;
  };

  const handleSelectChange = (e: any, id: string) => {
    // 获取变动值
    targetTableRef.value?.currentDataChange(e.seq, id);
  };

  const handleLock = (e: any) => {
    emit('lock', e);
  };

  const handleUnlock = (e: any) => {
    emit('unlock', e);
  };

  const setTargetData = (data: any) => {
    targetTableRef.value?.setTargetData(data);
  };

  const setOriginTableData = (data: any) => {
    tableRefs.value[data.id]?.setData(data);
  };

  // 获取匹配的值
  const getAllMatchResults = () => {
    const targetData = cloneDeep(targetTableRef.value?.getDataSource() || []);
    // 通过id匹配
    const matchResults = targetData.map((item: any) => {
      const importTableValue = item.importTable;
      item.importTable = tableRefs.value.importTable?.getDataSource()?.find((i: any) => i.seq == importTableValue);
      const dbTablevalue = item.dbTable;
      item.dbTable = tableRefs.value.dbTable?.getDataSource()?.find((i: any) => i.seq == dbTablevalue);
      return item;
    });
    return matchResults;
  };

  const init = data => {
    // 初始化时，填充已匹配的数据
    for (const table in data.originTable) {
      tableRefs.value[table]?.setData(data.originTable[table]);
    }
    setTargetData(data.targetTable);
  };

  defineExpose({
    init,
    setTargetData,
    setOriginTableData,
    getAllMatchResults,
  });
</script>

<!-- <style lang="scss" scoped>
  .match-table {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .origin-table {
      width: 40%;
    }
    .target-table {
      width: 40%;
    }
  }
</style> -->
<style lang="less" scoped>
  .match-table {
    display: flex;
    min-height: 500px;
  }
</style>
