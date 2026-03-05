<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="handleAdd">{{ t('common.add') }}</a-button>
            <ModelConfirmButton
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: t('common.withdrawSelectedData'),
                  onOk: handleRecall.bind(null),
                },
              }">
              <span v-auth="'btn_recall'">{{ t('common.revoke') }}</span>
            </ModelConfirmButton>
            <a-button v-auth="'btn_stop'" @click="handleStop">{{ t('common.stopText') }}</a-button>
            <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList">{{ t('common.batchDelText') }}</a-button>
            <!-- 一次性功能： 填充旧数据的材料描述-->
            <!-- <a-button v-auth="'btn_vertify'" @click="handleVerify">{{ t('common.oneVerify') }}</a-button> -->
            <!-- 一次性功能： 修改旧数据的预估总量计算  -->
            <a-button v-auth="'btn_vertify'" @click="handleVerify">{{ t('common.calTotal') }}</a-button>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <addPop @register="registerAddPop" @reload="refresh"></addPop>
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <RemarkModal @register="registerRemarkModal" @reload="refresh"></RemarkModal>
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import {
    getNewMaterial,
    blukDeleteNewMaterial,
    exportNewMaterialExcel,
    recallMaterial,
    getNodelist,
    stopMaterial,
    verifySpec,
    synproductarea,
  } from '/@/api/engineering/newMateria';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { ModelConfirmButton } from '/@/components/Button';
  import { onMounted, h, nextTick } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getStatus } from '/@/components/CustomComponents/src/material/Constant';
  import addPop from './components/addPop.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, RemarkModal } from '/@/components/CustomComponents';
  import { useRoute } from 'vue-router';
  import { formatTableDefaultText } from '/@/utils';
  import { getSearchFormSchema } from './components/config';
  import { useBaseStore } from '/@/store/modules/base';

  defineOptions({ name: 'engineering-newMateria-devlop' });
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerAddPop, { openPopup: openAddPop }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerRemarkModal, { openModal: openRemarkModal }] = useModal();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '需求单号', field: 'applyNumber', width: 160, minWidth: 38 },
    { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
    { title: '旧版成品编码', field: 'insideNumberOld', width: 170 },
    {
      title: '状态',
      field: 'status',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: getStatus('statusDesc'),
      },
    },
    { title: '当前处理人', field: 'currentProcessor', width: 230 },
    { title: '当前节点', field: 'currentNodeName', width: 160, minWidth: 38 },
    {
      title: '节点记录',
      field: 'nodeDetail',
      width: 100,
      slots: { default: 'nodeDetail' },
    },
    { title: '工厂', field: 'factoryName', width: 160, minWidth: 38 },
    {
      title: '开发采购',
      field: 'purchaseUserName',
      filters: [{ data: '' }],
      filterRender: {
        searchField: 'purchaseUserId',
        name: 'CustomUserSelect',
      },
      width: 170,
    },
    {
      title: '材料描述',
      field: 'materialDesc',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      width: 160,
      minWidth: 38,
    },
    { title: '申请人', field: 'applyUserName', width: 230, i18nField: 'CommonCol.applyUser' },
    {
      title: '申请时间',
      field: 'applyDateTime',
      cellRender: {
        name: 'Date',
      },
      width: 160,
      minWidth: 38,
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      width: 230,
      visible: false,
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
      width: 160,
      minWidth: 38,
      visible: false,
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 50, fixed: 'right' },
  ];

  // const [registerTable, { getRowSelection, clearSelectedRowKeys, reload, getFetchParams, getSelectRowKeys }] = useTable({
  //   api: getNewMaterial,
  //   title: '',
  //   columns,
  //   rowKey: 'id',
  //   isCanResizeParent: true,
  //   canResize: true, //自适应高度
  //   formConfig: {
  //     schemas: searchFormSchema,
  //     baseColProps: {
  //       span: 4,
  //     },
  //     autoAdvancedLine: 1,
  //     i18nConfig: {
  //       moduleCode: 'MaterialDevelopApplyColumn',
  //       transferRange: ['placeholder'],
  //     },
  //   },
  //   striped: true,
  //   useSearchForm: true, //使用搜索表单
  //   bordered: true, //显示表格边框
  //   showIndexColumn: true, //显示序号
  //   pagination: {
  //     pageSize: 30,
  //     size: 'small',
  //   },
  //   tableSetting: {
  //     delStatus: true,
  //   },
  //   rowSelection: {
  //     type: 'checkbox',
  //   },
  //   actionColumn: {
  //     width: 70,
  //     title: '操作',
  //     dataIndex: 'action',
  //   },
  //   transformCellText: ({ text }) => formatTableDefaultText(text),
  //   i18nConfig: {
  //     moduleCode: 'MaterialDevelopApplyColumn',
  //   },
  // });

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
      schema: getSearchFormSchema(),
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-newMateria-devlop-list',
      columns: columns,
      api: getNewMaterial,
      useSearchForm: true,
      bordered: true,
      isCanResizeParent: true,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
      // 文本统一兜底
      transformCellText: ({ cellValue }) => formatTableDefaultText(cellValue),
      toolbarConfig: {
        delStatus: true,
      },
      // tableSetting: {

      // },
      pagerConfig: {
        pageSize: 30,
        size: 'small',
      },
    },
  });

  const { reload, setLoading, getFetchParams, getSelectRowKeys, clearSelectedRowKeys, getDataSource } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record.id),
        auth: 'btn_detail',
      },
    ];
  }

  const { createConfirm } = useMessage();

  //新增或者修改
  function handleDetail(id = '') {
    openAddPop(true, {
      type: 'view',
      id: id,
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.id,
      fetchSetting: {
        listField: 'mianBillFlow.flowNodeInstanceHisList',
      },
    });
  }

  function handleAdd() {
    openAddPop(true, {});
  }

  async function handleVerify() {
    // const res = await verifySpec();
    const res = await synproductarea();
    if (res.code == 200) {
      reload();
      createMessage.success(t('sys.api.operationSuccess'));
    }
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      clearSelectedRowKeys();
      return createMessage.info(t('common.selectText'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteNewMaterial(list);
            if (code == 200) {
              createMessage.info(t('sys.api.operationSuccess'));
            }
            refresh();
          } catch (e) {
            refresh();
          }
        },
      });
    }
  }
  //导入
  // function handleImport() {
  //   openImportPopup(true, {
  //     title: t('common.add'),
  //     isDevPlatform: false,
  //   });
  // }
  //导出
  function handleExport() {
    openExportModal(true, {
      api: exportNewMaterialExcel,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  async function handleSelectData(method) {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      const r = await method(idList);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        refresh();
      }
    } else {
      createMessage.info(t('common.selectText'));
    }
  }

  //  终止
  async function handleStop() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return createMessage.info(t('common.selectText'));
    }
    openRemarkModal(true, {
      api: stopMaterial,
      type: 'stop',
      title: t('common.stopText'),
      required: true,
      beforeFetch: params => {
        return {
          ids: idList,
          terminationRemarks: params.remarks,
        };
      },
    });
  }

  // 撤回
  async function handleRecall() {
    handleSelectData(recallMaterial);
  }

  function refresh() {
    reload();
    clearSelectedRowKeys();
  }

  const route = useRoute();
  onMounted(async () => {
    const { id } = route.query as any;
    if (id) {
      handleDetail(id);
    }
    setTimeout(() => {
      const baseStore = useBaseStore();
      baseStore.getDictionaryData('ProjectStage');
    }, 300);
  });
</script>
