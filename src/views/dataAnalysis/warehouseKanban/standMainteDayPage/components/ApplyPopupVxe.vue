<template>
  <BasicPopup
    v-bind="$attrs"
    showOkBtn
    @register="registerPopup"
    :okText="t('common.submit')"
    :title="title"
    @ok="handleSave"
    @close="handleClose"
    class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <!-- <Subtitle :title="t('dict.WarehouseBaseColumn')" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }"> -->
      <Subtitle class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }">
        <template #extra>
          <div class="flex">
            <!-- <div class="mr-10px">
              {{ t('dict.MainProcess') }}:
              <LydcSelect v-model:value="state.mainProcess" :options="state.mainProcessList" style="width: 200px" />
            </div> -->
            <AddCustomRows @submit="addColumn" />
          </div>
        </template>
      </Subtitle>
      <Grid>
        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';

  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { detailfactoryselectparam, addorupdatestandMainteDay } from '/@/api/dataAnalysis/warehouseKanban';

  const emits = defineEmits(['register', 'reload', 'handleCloseFlag']);

  interface State {
    type: 'add' | 'edit' | 'view';
    title: string;
    base: any;
    line: number;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    title: '',
    type: 'add',
    base: {},
    line: 1,
  });
  const { title } = toRefs(state);
  const { createMessage } = useMessage();

  const menuTableColumns: any[] = [
    {
      title: '厂区',
      field: 'orgCode',
      i18nField: 'factory',
      minWidth: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'factory',
        props: {
          api: async () => {
            const { data } = await detailfactoryselectparam({});
            let list = Object.entries(data).map(([key, value]) => ({
              Name: value as string,
              Code: key,
            }));
            return list;
          },
          showSearch: false,
          onChange: (_value: string, option: any, { row }) => {
            row.factory = option?.label ?? option?.Name;
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name'],
          // nameFormat: ['Code', '/', 'Name'],
          filterOption: false,
        },
      },
    },
    {
      title: '标准天数',
      field: 'days',
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          controlsPosition: 'right',
        },
      },
      minWidth: 160,
    },
    {
      title: '操作',
      field: 'action',
      width: 100,
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];

  const gridOptions: VxeGridProps = {
    id: 'warehouse-main-keeperMaint-edit',
    columns: menuTableColumns,
    editRules: {
      orgCode: [{ required: true, message: t('common.required') }],
      days: [{ required: true, message: t('common.required') }],
    },
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    toolbarConfig: {
      enabled: false,
    },
    // i18nConfig: {
    //   moduleCode: 'WarehouseBaseColumn',
    // },
    showIndexColumn: true,
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { getDataSource } = gridApi;

  const [registerPopup, { closePopup, changeOkLoading }] = usePopupInner(init);

  async function init(data) {
    state.title = t('common.add');
    state.type = data.type || 'add';
    addColumn(1);
    gridApi.grid.reloadData([
      {
        _X_ROW_KEY: buildUUID(),
      },
    ]);
  }

  function getTableActions(row, rowIndex): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        tooltip: t('common.addText'),
        onClick: addColumn.bind(null, 1, rowIndex),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copyText'),
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  /**
   * @description 删除整行
   * */
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  /**
   * @description 新增
   * @param line 新增的行数
   * @param rowIndex 指定起增行
   * */
  function addColumn(line, rowIndex?: number) {
    const list = getDataSource();
    if (typeof rowIndex != 'undefined') {
      list.push({
        _X_ROW_KEY: buildUUID(),
      });
    } else {
      for (let i = 0; i < line; i++) {
        list.push({
          _X_ROW_KEY: buildUUID(),
        });
      }
    }
    gridApi.grid.reloadData(list);
  }
  /**
   * @description 复制整行
   * */
  function handleCopy(row) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    if (item.id) {
      delete item.id;
    }
    const list = gridApi.getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }
  /**
   * @description 关闭弹窗
   * */
  function handleClose() {
    emits('handleCloseFlag', false);
  }
  /**
   * @description 提交
   * */
  async function handleSave() {
    const list = getDataSource().map(el => ({
      days: el.days,
      orgCode: el.orgCode,
      factory: el.factory,
    }));
    changeOkLoading(true);
    addorupdatestandMainteDay(list)
      .then(res => {
        changeOkLoading(true);
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        emits('handleCloseFlag', false);
        closePopup();
      })
      .catch(err => {
        changeOkLoading(false);
      });
  }
</script>

<style lang="less">
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
