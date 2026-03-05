<template>
  <BasicPopup v-bind="$attrs" showOkBtn @register="registerPopup" :okText="t('common.submit')" :title="title" @ok="handleSave" class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <Subtitle title="项目信息新增" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }">
        <!-- <Subtitle :title="t('dict.WarehouseBaseColumn')" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }"> -->
        <template #extra>
          <div class="flex">
            <!-- <div class="mr-10px">
              {{ t('dict.MainProcess') }}:
              <LydcSelect v-model:value="state.mainProcess"
                          :options="state.mainProcessList"
                          style="width: 200px"
                          @change="changeMainprocess" />
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
  import { reactive, toRefs, onMounted, h, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';
  // import { addWarehouseBase } from '/@/api/warehouse/main';
  // import { getFactoryList } from '/@/api/business/quantitation';
  // import { getList } from '/@/api/business/shippingspace';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { getMainProcess } from '/@/utils/business/index';
  import { updateBaseAddOrUpdatee } from '/@/api/dashbord/vc';

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
    // {
    //   title: '工厂',
    //   field: 'factoryCode',
    //   i18nField: 'factory',
    //   minWidth: 240,
    //   formatter: 'ApiSelect',
    //   editRender: {
    //     name: 'ApiSelect',
    //     cacheField: 'factory',
    //     props: {
    //       api: getFactoryList,
    //       showSearch: true,
    //       apiSearch: {
    //         show: true,
    //         searchName: 'factoryCode',
    //       },
    //       rowParams: {
    //         insidePartNumber: 'innerMaterialNumber',
    //       },
    //       resultField: 'data',
    //       labelField: 'Name',
    //       valueField: 'Code',
    //       nameFormat: ['Code', '/', 'Name'],
    //       onChange: (_, data, { row }) => {},
    //     },
    //   },
    // },

    {
      title: '项目',
      field: 'project',
      editRender: { name: 'Input' },
      minWidth: 160,
    },
    {
      title: '阶段',
      field: 'stage',
      editRender: { name: 'Input' },
      // width: 100,
      minWidth: 160,
    },
    {
      title: '工序',
      field: 'processe',
      editRender: { name: 'Input' },
      minWidth: 160,
    },
    {
      title: '次序',
      field: 'sequence',
      editRender: { name: 'Input' },
      minWidth: 160,
    },
    {
      title: '料号',
      field: 'itemNumber',
      editRender: { name: 'Input' },
      minWidth: 160,
    },
    {
      title: '标准产能',
      field: 'standardCapacity',
      editRender: { name: 'Input' },
      minWidth: 160,
    },
    {
      title: '目标良率',
      field: 'targetYieldRate',
      editRender: { name: 'Input' },
      minWidth: 160,
    },
    {
      title: '是否关键工序',
      field: 'isCriticalProcess',
      editRender: {
        name: 'ASelect',
        props: {
          options: [
            { title: '是', value: true },
            { title: '否', value: false },
          ],
          fieldNames: { label: 'title', value: 'value' },
          allowClear: true,
        },
      },
      minWidth: 160,
    },

    {
      field: 'action',
      width: 100,
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

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  async function init(data) {
    // changeLoading(true);
    state.title = t('common.add');
    state.type = data.type || 'add';
    addColumn(1);
    gridApi.grid.reloadData([
      {
        _X_ROW_KEY: buildUUID(),
      },
    ]);
    // 判断当前的环境
    // changeLoading(false);
  }

  // async function getDetail(type?: string) {
  //   // const res = await getQuantitationApplyDetail(state.id);
  //   const { data } = res;
  //   const { grid } = gridApi;
  //   grid.reloadData(
  //     data.quantitativeApplyOutputs.map(el => {
  //       el.customerDeliveryTime = el.customerDeliveryTime ? el.customerDeliveryDateTime : '';
  //       return el;
  //     }),
  //   );
  // }
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
    console.log('addColumn', line, rowIndex);

    const list = getDataSource();
    const addList: any = [];
    if (typeof rowIndex != 'undefined') {
      addList.push({
        _X_ROW_KEY: buildUUID(),
      });
    } else {
      for (let i = 0; i < line; i++) {
        addList.push({
          _X_ROW_KEY: buildUUID(),
        });
      }
    }
    gridApi.grid.reloadData([...list, ...addList]);
  }
  /**
   * @description 复制整行
   * */
  function handleCopy(row, index) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    gridApi.grid.insertAt(item, index + 1);
  }

  /**
   * @description 提交
   * */
  async function handleSave() {
    const list = getDataSource().map(el => {
      return {
        id: '',
        project: el.project,
        stage: el.stage,
        processe: el.processe,
        sequence: el.sequence * 1,
        itemNumber: el.itemNumber,
        standardCapacity: el.standardCapacity * 1,
        isCriticalProcess: el.isCriticalProcess,
        targetYieldRate: el.targetYieldRate * 1,
        // warehouseKeeperIds: el.warehouseKeeperIds,
        // factory: el.factoryCode,
        // shippingSpaceCode: el.shippingSpaceCode,
        // shippingAddress: el.shippingAddress,
      };
    });
    changeOkLoading(true);
    // let method: any = null;
    // method = addWarehouseBase;
    // addWarehouseBase(list, state.mainProcess)
    updateBaseAddOrUpdatee(list)
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
