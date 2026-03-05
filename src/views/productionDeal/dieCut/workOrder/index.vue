<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="addOrUpdateHandle()" v-auth="'btn_add'">{{ t('common.add') }}</a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-auth="'btn_upload'">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-auth="'btn_download'">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              <a-button v-auth="'btn_batchRemove'">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button>
            <a-button v-auth="'btn_syncSAP'" type="link" @click="syncWorkOrderSap"
              ><i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>{{ t('common.syncSap') }}
            </a-button>
            <a-button v-auth="'btn_syncBOM'" type="link" @click="syncWorkOrderBom"
              ><i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>{{ t('common.syncBom') }}
            </a-button>
          </template>
          <template #workOrderNo="{ row }">
            <!-- <template v-if="column.dataIndex === 'workOrderNo'"> -->
            <span class="table-a" @click="goBomDetail(row)">{{ row[row.dataIndex] }}</span>
          </template>
          <template #relationWorkOrderNo="{ row }">
            <TableAction :outside="true" :actions="getRelationActions(row)" />
          </template>
          <!-- <template v-if="column.dataIndex === 'relationWorkOrderNo'">
              <TableAction :actions="getRelationActions(record)" />
            </template> -->
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
          <!-- <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template> -->
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <BatchUpload @register="registerBatchImportPop" @reload="reload" />
    <Detail @register="registerDetailPop" @reload="reload" />
    <syncSap @register="registerSyncSap" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getWorkOrder, deleteWorkOrder, blukDeleteWorkOrder, exportWorkOrderExcel, syncWorkOrderFromBom } from '/@/api/productionDeal/workOrder';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';

  import add from './components/add.vue';
  import syncSap from './components/syncSap.vue';
  import { columns } from './components/config';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BatchUpload from './components/importPop.vue';
  import Detail from './components/detail.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRouter } from 'vue-router';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'productionDeal-dieCut-workOrder' });
  const { hasBtnP } = usePermission();
  const router = useRouter();
  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    workOrderTypeList: any[];
    bomTypeList: any[];
    processRouteTypeList: any[];
    bOrderTypeList: any[];
    workOrderNos: string[];
  }

  const state = reactive<State>({
    workOrderTypeList: [],
    bomTypeList: [],
    processRouteTypeList: [],
    bOrderTypeList: [],
    workOrderNos: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerSyncSap, { openModal: openSyncSap }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();

  function getVxeSchema() {
    return [
      {
        fieldName: 'workOrderNo',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '请输入工单号',
        },
      },
      {
        fieldName: 'produceWorkshopCode',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '请输入生产车间编码',
        },
      },
      {
        fieldName: 'productCode',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '请输入内部料号',
        },
      },
      {
        fieldName: 'workOrderType',
        i18nField: 'workOrderTypeDesc',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: '工单类型',
          fieldNames: {
            value: 'id',
            label: 'fullName',
          },
        },
      },
      {
        fieldName: 'bomType',
        i18nField: 'bomTypeDesc',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: 'BOM类型',
          fieldNames: {
            value: 'id',
            label: 'fullName',
          },
        },
      },
      {
        fieldName: 'bOrderType',
        i18nField: 'bOrderTypeDesc',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: 'B/非B工单',
          fieldNames: {
            value: 'id',
            label: 'fullName',
          },
        },
      },
      {
        fieldName: 'dataSources',
        i18nField: 'dataSourcesDesc',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: '数据来源',
          fieldNames: {
            value: 'id',
            label: 'fullName',
          },
        },
      },
    ];
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getVxeSchema(),
      i18nConfig: {
        moduleCode: 'WorkOrderColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-dieCut-workOrder-list',
      striped: true,
      useSearchForm: true, //使用搜索表单
      showTableSetting: true, //刷新按钮,默认打开
      isCanResizeParent: true,
      canResize: true, //自适应高度
      columns: columns,
      api: getWorkOrder,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'WorkOrderColumn',
      },
    },
  });
  const { reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys, updateSchema, getFetchParams, setLoading } = gridApi;
  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  // const [registerTable, { getRowSelection, clearSelectedRowKeys, reload, getFetchParams, getForm, setLoading, getSelectRows, getSelectRowKeys }] = useTable({
  //   api: getWorkOrder,
  //   title: '',
  //   columns,
  //   // rowKey: 'workOrderNo',
  //   isCanResizeParent: true,
  //   canResize: true, //自适应高度
  //   formConfig: {
  //     //搜索框
  //     labelWidth: 100,
  //     schemas: searchFormSchema,
  //     autoAdvancedLine: 1, //自动展开行
  //   },
  //   striped: true,
  //   useSearchForm: true, //使用搜索表单
  //   showTableSetting: true, //刷新按钮,默认打开

  //   showIndexColumn: true, //显示序号
  //   pagination: {
  //     pageSize: 30,
  //     size: 'small',
  //   },
  //   rowSelection: {
  //     type: 'checkbox',
  //   },
  //   actionColumn: {
  //     width: 100,
  //     title: t('common.action'),
  //     dataIndex: 'action', //字段
  //     fixed: 'right', //显示在右边
  //   },
  // });

  function getRelationActions(record): ActionItem[] {
    return [
      {
        label: record.relationWorkOrderNo || '',
        onClick: goDetail.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(record = '') {
    openFormModal(true, {
      record,
      workOrderTypeList: state.workOrderTypeList,
      bomTypeList: state.bomTypeList,
      processRouteTypeList: state.processRouteTypeList,
      bOrderTypeList: state.bOrderTypeList,
    });
  }

  //同步sap
  function syncWorkOrderSap() {
    openSyncSap(true, {});
  }

  // 同步bom
  async function syncWorkOrderBom() {
    const workOrderNos = getSelectRows().map(item => item.workOrderNo);
    if (workOrderNos?.length === 0) {
      return message.warning(t('common.BomSyncSelectRow'));
    }
    setLoading(true);
    try {
      const { code } = await syncWorkOrderFromBom({ workOrderNos });
      if (code === 200) {
        createMessage.success(t('common.synchronizationSuccessful'));
        reload();
      } else {
        createMessage.error(t('common.syncFailed'));
      }
    } catch (error) {
      console.error(error);
    } finally {
      clearSelectedRowKeys();
      setLoading(false);
    }
  }
  function goBomDetail(record: any = {}) {
    router.push({
      name: 'productionDeal-dieCut-bom',
      query: {
        workOrderNo: record.workOrderNo,
      },
    });
  }

  //查看详情
  function goDetail(record = {}) {
    openDetailPopup(true, { ...record, title: t('common.view'), type: 'view', isDevPlatform: false });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteWorkOrder(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteWorkOrder(list);
            if (code == 200) {
              message.warning(t('common.delSuccess'));
            }
            clearSelectedRowKeys();
            reload();
          } catch (e) {
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }
  //导入
  function handleImport() {
    openImportPopup(true, {
      title: t('common.add'),
      isDevPlatform: false,
    });
  }
  //导出
  async function handleExport() {
    openExportModal(true, {
      api: exportWorkOrderExcel,
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  onMounted(async () => {
    const workOrderTypeList = (await baseStore.getDictionaryData('WorkOrder.Type')) as any[];
    const optionsWorkOrderTypeList = workOrderTypeList.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.workOrderTypeList = optionsWorkOrderTypeList;

    const bomTypeList = (await baseStore.getDictionaryData('WorkOrder.BomType')) as any[];
    const optionsBomTypeList = bomTypeList.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.bomTypeList = optionsBomTypeList;

    const processRouteTypeList = (await baseStore.getDictionaryData('ProcessRoute.RouteType')) as any[];
    const optionsProcessRouteTypeList = processRouteTypeList.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.processRouteTypeList = optionsProcessRouteTypeList;

    const bOrderTypeList = (await baseStore.getDictionaryData('WorkOrder.BOrderType')) as any[];
    const optionsBOrderTypeList = bOrderTypeList.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.bOrderTypeList = optionsBOrderTypeList;

    const dataSourcesList = (await baseStore.getDictionaryData('WorkOrder.DataSources')) as any[];
    const optionsDataSourcesList = dataSourcesList.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });

    // updateSchema([{
    //   fieldName: 'workOrderType',
    //   componentProps: {
    //     options: optionsWorkOrderTypeList,
    //   },
    // }]);
    // updateSchema([
    //   {
    //     fieldName: 'bomType',
    //     componentProps: {
    //       options: optionsBomTypeList,
    //     },
    //   },
    // ]);
    // updateSchema([
    //   {
    //     fieldName: 'processRouteType',
    //     componentProps: {
    //       options: optionsBomTypeList,
    //     },
    //   },
    // ]);
    // updateSchema([
    //   {
    //     fieldName: 'bOrderType',
    //     componentProps: {
    //       options: optionsBOrderTypeList,
    //     },
    //   },
    // ]);
    updateSchema([
      {
        fieldName: 'workOrderType',
        componentProps: {
          options: optionsWorkOrderTypeList,
        },
      },
      {
        fieldName: 'bomType',
        componentProps: {
          options: optionsBomTypeList,
        },
      },
      {
        fieldName: 'processRouteType',
        componentProps: {
          options: optionsProcessRouteTypeList,
        },
      },
      {
        fieldName: 'bOrderType',
        componentProps: {
          options: optionsBOrderTypeList,
        },
      },
      {
        fieldName: 'dataSources',
        componentProps: {
          options: optionsDataSourcesList,
        },
      },
    ]);
  });
</script>
