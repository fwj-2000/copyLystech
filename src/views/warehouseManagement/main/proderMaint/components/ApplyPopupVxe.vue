<template>
  <BasicPopup v-bind="$attrs" showOkBtn @register="registerPopup" :okText="t('common.submit')" :title="title" @ok="handleSave" class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <Subtitle :title="t('dict.ProductionPersonnelColumn')" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }">
        <template #extra>
          <div class="flex">
            <div class="mr-10px">
              {{ t('dict.MainProcess') }}:
              <LydcSelect v-model:value="state.mainProcess" :options="state.mainProcessList" style="width: 200px" />
            </div>
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
  import { reactive, toRefs, onMounted } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';
  import { addProductionPersonnel } from '/@/api/warehouse/mainProder';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { getMainProcess } from '/@/utils/business/index';
  import { getFactoryList } from '/@/api/business/shippingspace';

  const emits = defineEmits(['register', 'reload']);

  interface State {
    type: 'add' | 'edit' | 'view';
    title: string;
    base: any;
    line: number;
    mainProcess: string;
    mainProcessList: any[];
  }

  const { t } = useI18n();
  const state = reactive<State>({
    title: '',
    type: 'add',
    base: {},
    line: 1,
    mainProcess: '1',
    mainProcessList: [],
  });
  const { title } = toRefs(state);
  const { createMessage } = useMessage();
  onMounted(async () => {
    state.mainProcessList = await getMainProcess();
  });

  let menuTableColumns: any[] = [
    {
      title: '工厂',
      field: 'factory',
      i18nField: 'CommonCol.factory',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'factoryCode',
          },
          beforeFetch: params => {
            const _params = params || {};
            _params.mainProcess = state.mainProcess;
            return _params;
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Code', '/', 'Name'],
        },
      },
    },
    {
      title: '制单员',
      field: 'swipeUserId',
      i18nField: 'swipeUserName',
      width: 120,
      editRender: {
        cacheField: 'swipeUserName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '领料人',
      field: 'receiveMoldUserIds',
      i18nField: 'receiveMoldUserNames',
      width: 400,
      editRender: {
        cacheField: 'receiveMoldUserNames',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: '退料人',
      field: 'refundMoldUserIds',
      i18nField: 'refundMoldUserNames',
      width: 400,
      editRender: {
        cacheField: 'refundMoldUserNames',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
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
    id: 'warehouse-main-proderMaint-edit',
    columns: menuTableColumns,
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
    i18nConfig: {
      moduleCode: 'ProductionPersonnelColumn',
    },
    showIndexColumn: true,
    pagerConfig: {
      enabled: false,
    },
    position: 'modal',
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { getDataSource } = gridApi;

  const [registerPopup, { closePopup, changeOkLoading }] = usePopupInner(init);

  async function init(data) {
    state.title = t('common.add');
    state.type = data.type || 'add';
    addColumn(1);
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
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
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
    // if (typeof rowIndex != 'undefined') {
    //   list.splice(rowIndex + 1, 0, {
    //     _X_ROW_KEY: buildUUID(),
    //   });
    // } else {
    //   for (let i = 0; i < line; i++) {
    //     list.push({
    //       _X_ROW_KEY: buildUUID(),
    //     });
    //   }
    // }
    if (rowIndex === undefined) {
      for (let i = 0; i < line; i++) {
        list.push({
          _X_ROW_KEY: buildUUID(),
        });
      }
    } else {
      list.splice(rowIndex + 1, 0, {
        _X_ROW_KEY: buildUUID(),
      });
    }
    gridApi.grid.reloadData(list);
  }
  /**
   * @description 复制整行
   * */
  function handleCopy(row) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    console.log('index', index);
    list.splice(index + 1, 0, item);
    gridApi.grid.reloadData(list);
    // 如果需要在指定位置插入，可以使用以下代码
    // gridApi.grid.insertAt(list, index + 1);
  }

  /**
   * @description 提交
   * */
  async function handleSave() {
    const list = getDataSource().map(el => {
      return {
        swipeUserId: el.swipeUserId,
        receiveMoldUserIds: el.receiveMoldUserIds,
        refundMoldUserIds: el.refundMoldUserIds,
        factory: el.factory,
      };
    });
    changeOkLoading(true);
    addProductionPersonnel(list, state.mainProcess)
      .then(res => {
        changeOkLoading(true);
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
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
