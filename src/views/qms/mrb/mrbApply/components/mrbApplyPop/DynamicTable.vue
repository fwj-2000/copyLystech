<template>
  <Subtitle :title="state.title" v-if="state.title" class="p-10px" />
  <Grid>
    <template #downloadFile="{ row }">
      <div @click="downloadFileFn(row.reportName, row.reportPath)" class="table-a">{{ row.reportName }}</div>
    </template>
    <template #action="data">
      <TableAction :outside="true" :actions="getTableActions(data.row)" />
    </template>
  </Grid>
</template>
<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import type { VxeGridPropTypes } from '/@/components/VxeTable';
  import { Subtitle } from '/@/components/Subtitle';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';

  import { useGlobSetting } from '/@/hooks/setting';
  const globSetting = useGlobSetting();

  interface IState {
    template?: {};
    title?: string;
    editRules?: {};
    fileList?: any[];
  }

  interface IinitState {
    columns: VxeGridPropTypes.Columns;
    title?: string;
    data?: any[];
    editRules?: {};
    mode?: 'add' | 'edit' | 'view';
  }

  const props = defineProps({
    moduleCode: {
      type: String,
      default: '',
    },
  });
  const state = reactive<IState>({
    title: '',
    template: {},
    editRules: {},
    fileList: [],
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridEvents: {},
    gridOptions: {
      toolbarConfig: {
        enabled: false,
      },
      virtualXConfig: {
        enabled: false,
      },
      virtualYConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        showAsterisk: true,
        showStatus: true,
      },
      editRules: state.editRules,
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      pagerConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: props.moduleCode,
      },
    },
  });
  const { getDataSource } = gridApi;
  function getRowTemplate(columns) {
    return columns.map(item => {
      return item.field !== 'action';
    });
  }

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleAdd.bind(null),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  // 删除数据
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  // 增加列
  function handleAdd() {
    const list = getDataSource();
    list.push({
      _X_ROW_KEY: buildUUID(),
      ...state.template,
    });
    gridApi.grid.reloadData(list);
  }

  function initFn({ title, columns, editRules, data = [], mode }: IinitState): void {
    state.title = title;
    state.editRules = editRules;

    gridApi.setState({
      gridOptions: {
        editRules,
      },
    });
    state.template = getRowTemplate(columns);
    let _columns = columns;
    if (mode === 'view') {
      _columns = _columns.filter(item => item.field !== 'action');
      gridApi.grid.reloadData(data);
    } else {
      // if (data?.length) {
      //   gridApi.grid.reloadData(data);
      // } else {
      //   handleAdd();
      // }
      data?.length ? gridApi.grid.reloadData(data) : handleAdd();
    }
    gridApi.loadColumn(_columns);
    gridApi.grid.clearValidate();
  }
  function getParamsFn() {
    return gridApi.getDataSource();
  }

  function reloadFn() {
    gridApi.reload();
  }

  function downloadFileFn(name, url) {
    return window.open(`${globSetting.apiUrl}/api/Information/fileinfo/downloadfile?filePath=${url}&fileName=${name}`);
  }

  defineExpose({
    initFn,
    reloadFn,
    gridApi,
    getParamsFn,
  });
</script>

<style lang="less" scoped>
  .lydc-subtitle-container {
    padding: 0 !important;
  }
</style>
