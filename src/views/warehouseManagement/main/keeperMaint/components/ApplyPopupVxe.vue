<template>
  <BasicPopup v-bind="$attrs" showOkBtn @register="registerPopup" :okText="t('common.submit')" :title="title" @ok="handleSave" class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <Subtitle :title="t('dict.WarehouseBaseColumn')" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }">
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
  import { addWarehouseBase } from '/@/api/warehouse/main';
  import { getFactoryList } from '/@/api/business/shippingspace';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { getMainProcess } from '/@/utils/business/index';
  import { getShipList } from '/@/api/common/basedata';
  import { getSapFactoryList } from '/@/api/purchase/supplierInformation';

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
      field: 'factoryCode',
      i18nField: 'factory',
      minWidth: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'factory',
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
          filterOption: false,
          onChange: (_v: string, _option: any, { row }) => {
            row.sapFactory = '';
          },
        },
      },
    },
    {
      field: 'sapFactory',
      title: 'SAP工厂代码',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'sapFactoryName',
        props: {
          api: getSapFactoryList,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          rowParams: {
            factoryCode: 'factoryCode',
          },
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          showSearch: true,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
          nameFormat: ['code', '/', 'name'],
        },
      },
    },
    {
      title: '仓位',
      field: 'shippingSpaceCode',
      minWidth: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'shippingSpaceName',
        props: {
          api: getShipList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'shippingSpace',
          },
          rowParams: {
            factoryCode: 'factoryCode',
            sapFactoryCode: 'sapFactory',
          },
          resultField: 'data',
          labelField: 'shippingSpaceName',
          valueField: 'shippingSpaceCode',
          nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
          filterOption: false,
        },
      },
    },
    {
      title: '仓位地址',
      field: 'shippingAddress',
      editRender: {
        name: 'Input',
      },
      minWidth: 360,
    },
    {
      title: '仓管员',
      field: 'warehouseKeeperIds',
      i18nField: 'warehouseKeeperNames',
      minWidth: 400,
      editRender: {
        cacheField: 'warehouseKeeperNames',
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
    id: 'warehouse-main-keeperMaint-edit',
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
      moduleCode: 'WarehouseBaseColumn',
    },
    showIndexColumn: true,
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { getDataSource } = gridApi;

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

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
        onClick: handleCopy.bind(null, row, rowIndex),
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
    // if (typeof rowIndex != 'undefined') {
    //   list.push({
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
      list.push({
        _X_ROW_KEY: buildUUID(),
      });
    }
    gridApi.grid.reloadData(list);
  }
  /**
   * @description 复制整行
   * */
  function handleCopy(row, index) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    gridApi.grid.insertNextAt(item, index);
  }

  /**
   * @description 提交
   * */
  async function handleSave() {
    const list = getDataSource().map(el => {
      return {
        warehouseKeeperIds: el.warehouseKeeperIds,
        factory: el.factoryCode,
        shippingSpaceCode: el.shippingSpaceCode,
        shippingAddress: el.shippingAddress,
        sapFactory: el.sapFactory,
      };
    });
    changeOkLoading(true);
    // let method: any = null;
    // method = addWarehouseBase;
    addWarehouseBase(list, state.mainProcess)
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
