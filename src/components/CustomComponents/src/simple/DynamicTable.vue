<template>
  <Grid>
    <template #toolbar>
      <div class="flex justify-end pb-10px mr-10px">
        <AddCustomRows @submit="addColumn" @enter="addColumn" />
      </div>
    </template>
    <!-- 动态插槽透传 -->
    <template v-for="(slotFn, name) in $slots" :key="name" #[name]="scope">
      <slot :name="name" v-bind="scope"></slot>
    </template>
    <template #action="data">
      <TableAction :outside="true" :actions="getTableActions(data.row)" />
    </template>
  </Grid>
</template>
<script setup lang="ts">
  import { ref, reactive, nextTick } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import type { VxeGridPropTypes } from '/@/components/VxeTable';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { isEmpty, cloneDeep } from 'lodash-es';

  type TVxeConfig = {
    gridEvents: Record<string, Function>;
    gridOptions: any;
  };

  interface IState {
    template?: Record<string, unknown>;
    // title?: string;
    editRules?: {};
    fileList?: any[];
    vxeConfig: TVxeConfig;
  }

  interface IinitState {
    rowTemplate?: Record<string, unknown>; // 行模板
    columns: VxeGridPropTypes.Columns; //  列
    // title?: string;                       //  标题
    data?: any[]; //  数据
    editRules?: {}; //  校验规则
    mode?: 'add' | 'edit' | 'view'; //  模式
    vxeConfig?: TVxeConfig; //  配置
  }
  const state = reactive<IState>({
    // title: '',
    template: {},
    editRules: {},
    fileList: [],
    vxeConfig: {
      gridEvents: {},
      gridOptions: {},
    },
  });
  const vxeConfig = {
    gridEvents: {
      cellAreaPaste: params => {
        console.log(params, ' 输出粘贴的单元格区域信息'); // 输出粘贴的单元格区域信息
      },
      ...state.vxeConfig.gridEvents,
    },
    gridOptions: {
      // height: '100%',
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
      mouseConfig: {
        area: true, // 是否开启区域选取
      },
      clipConfig: {
        isPaste: true,
        isRowIncrement: true,
        // afterPasteMethod: handleAfterPaster,
        // copyMethod: handleCopyMethod,
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      keepSource: true,
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      // i18nConfig: {
      //   moduleCode: '',
      // },
      ...state.vxeConfig.gridOptions,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid(vxeConfig);
  function getRowTemplate(columns) {
    const template = {};
    columns.forEach(item => {
      if (!['seq', 'action'].includes(item.field)) {
        template[item.field] = item.defaultValue || '';
      }
    });
    return template;
  }

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleAdd.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  // 增加列
  function addColumn(line) {
    const templates = Array.from({ length: line }, () => JSON.parse(JSON.stringify(state.template)));
    templates.forEach(template => {
      gridApi.grid.insertAt(template, -1);
    });
  }
  // 删除数据
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  // 根据columns生成模板数据
  async function handleAdd(row = {}) {
    const template: any = cloneDeep(state.template);
    // 初始化调用默认新增一行
    if (isEmpty(row)) {
      nextTick(() => {
        gridApi.grid.insertAt(template, row);
      });
      return;
    }

    const keys: any[] = Object.keys(template);
    keys.forEach(key => {
      template[key] = row[key] ? row[key] : '';
    });
    await gridApi.grid.insertAt(template, -1);
  }

  function initFn({ rowTemplate, columns, editRules, data = [], mode }: IinitState): void {
    // state.title = title;
    state.editRules = editRules;
    gridApi.setState({
      gridOptions: {
        editRules,
      },
    });
    // 有传就拿模板，没有就根据columns生成row行模板数据
    state.template = rowTemplate ? rowTemplate : getRowTemplate(columns);
    let _columns = columns;
    // 预览模式隐藏操作栏
    if (mode === 'view') {
      _columns = _columns.filter(item => item.field !== 'action');
      gridApi.grid.reloadData(data);
    } else {
      if (data?.length) {
        gridApi.grid.reloadData(data);
      } else {
        console.log('没有数据，自动增加一行');
        handleAdd({});
      }
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

  defineExpose({
    initFn,
    reloadFn,
    gridApi,
    getParamsFn,
  });
</script>

<style lang="less" scoped>
  ::v-deep .vxe-grid--layout-body-content-wrapper {
    overflow-y: hidden;
  }
</style>
