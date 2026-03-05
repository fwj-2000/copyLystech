<template>
  <div class="lydc-content-wrapper h-[100%]">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 打印 -->
              <a-button v-auth="'btn_print'" v-if="searchKey === '0'" type="primary" @click="handleAdd">{{ t('dict.CommonCol.print') }}</a-button>
              <a-button v-auth="'btn_singlePrint'" v-if="searchKey === '1'" type="primary" @click="handleAddSN">{{ t('dict.CommonCol.singlePrint') }}</a-button>
              <a-button v-auth="'btn_singlePrint'" v-if="searchKey === '1'" type="primary" @click="handlePrintBatch()">{{
                t('dict.CommonCol.batchReprint')
              }}</a-button>
              <a-button v-if="searchKey === '1'" v-auth="'btn_customerPrint'" type="primary" ghost @click="handleCustomerPrint">{{
                t('dict.CommonCol.customerPrint')
              }}</a-button>
              <a-button v-if="searchKey === '1'" v-auth="'btn_innerReScan'" type="primary" ghost @click="handleInPackageRescan">{{
                t('dict.CommonCol.innerReScan')
              }}</a-button>
              <a-button v-if="searchKey === '1'" v-auth="'btn_inPackageMerge'" type="primary" ghost @click="handleInPackageMerge">{{
                t('dict.CommonCol.inPackageMerge')
              }}</a-button>
              <a-button v-if="searchKey === '1'" v-auth="'btn_inPackDelete'" danger @click="handleDeleteInPack">{{
                t('dict.CommonCol.inPackageDelete')
              }}</a-button>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <!-- 批量删除v-auth="'btn_batchRemove'" -->
              <!-- <a-button class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button> -->
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <PrintModal @register="registerPrint" @reload="reload"> </PrintModal>
    <PrintSNModal @register="registerPrintSN" @reload="reload"> </PrintSNModal>
    <CustomerPrintSNModal @register="registerCustomerPrintSN" @reload="reload"> </CustomerPrintSNModal>
    <InPackageRescanModal @register="registerInPackageRescan" @openPrintSN="inPackageRescanSuccess"> </InPackageRescanModal>
    <InPackageMergeModal @register="registerInPackageMerge" @reload="reload"> </InPackageMergeModal>
    <EditLabelModal @register="registerEditLabel" @reload="reload"> </EditLabelModal>
    <Detail @register="registerDetailForm" />
    <!--  -->
    <designindex v-show="false" ref="designindexPrint" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, h } from 'vue';
  import {
    getPackLabelPrint,
    ExportData,
    ExportDataSingle,
    getPrintTemplateDetail,
    PageNew,
    getDetails,
    deleteInPack,
  } from '/@/api/productionDeal/packagePrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema, column, snColumn, snFormSchema } from './config';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import PrintModal from './components/printModal.vue';
  import PrintSNModal from './components/printSNModal.vue';
  import CustomerPrintSNModal from './components/customerPrintSNModal.vue';
  import InPackageRescanModal from './components/inPackageRescanModal.vue';
  import InPackageMergeModal from './components/inPackageMergeModal.vue';
  import Detail from './components/detail.vue';
  import { uniq } from 'lodash-es';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';
  import EditLabelModal from './components/editLabelModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Modal, message, Button } from 'ant-design-vue';
  const { t } = useI18n();

  interface DesignindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }

  const props = defineProps({
    searchKey: { default: '0' },
  });

  const designindexPrint = ref<DesignindexPrintType>();
  const [registerDetailForm, { openModal: openFormDetailModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerPrint, { openModal: openPrint }] = useModal();
  const [registerPrintSN, { openModal: openPrintSN }] = useModal();
  const [registerCustomerPrintSN, { openModal: openCustomerPrintSN }] = useModal();
  const [registerInPackageRescan, { openModal: openInPackageRescan }] = useModal();
  const [registerInPackageMerge, { openModal: openInPackageMerge }] = useModal();
  const [registerEditLabel, { openModal: openEditLabel }] = useModal();
  const { createConfirm } = useMessage();

  const [Grid, { reload, getFetchParams, getSelectRows }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: props.searchKey === '0' ? formSchema : snFormSchema,
      i18nConfig: {
        moduleCode: 'PackLabelPrintColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-dieCut-halfCodePackagePrint-list',
      columns: props.searchKey === '0' ? column : snColumn,
      rowConfig: {
        keyField: 'Id',
      },
      api: props.searchKey === '0' ? getPackLabelPrint : PageNew,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PackLabelPrintColumn',
      },
    },
  });

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-report-icon-preview-printPreview',
        onClick: handlePrintRow.bind(null, row),
        auth: 'btn_print',
        toolTip: t('dict.CommonCol.print'),
      },

      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEditPackageInfo.bind(null, row),
        auth: 'btn_editPackageInfo',
        tooltip: t('dict.CommonCol.editPackageInfo'),
        ifShow: props.searchKey === '1',
      },
      {
        icon: 'ym-diecut ym-diecut-a-chakanxiangqing1',
        onClick: getDetail.bind(null, row),
        auth: 'btn_detail',
        tooltip: t('common.detailText'),
        ifShow: props.searchKey === '1',
      },
    ];
  }
  // 详情
  const getDetail = async record => {
    // 这里可以打开一个详情弹窗，显示 record 的详细信息
    console.log('查看详情:', record);
    // 例如，可以使用 Modal 或其他组件来展示详情
    openFormDetailModal(true, { record });
  };
  // 打印
  const handleAdd = () => {
    openPrint(true, { handleType: 'add' });
  };

  // 单品打印，传过去没有detail
  const handleAddSN = () => {
    openPrintSN(true, { handleType: 'add' });
  };

  // 客户打印
  const handleCustomerPrint = () => {
    openCustomerPrintSN(true, {});
  };

  const handleInPackageRescan = () => {
    openInPackageRescan(true, {});
  };

  const handleInPackageMerge = () => {
    openInPackageMerge(true, {});
  };

  // 内包删除
  const handleDeleteInPack = async () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        // 获取勾选的数据
        const ids = list.map(item => item.uniqueCodeInPack);
        const res = await deleteInPack(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 补扫，有传过去detail
  const inPackageRescanSuccess = data => {
    openPrintSN(true, { detail: data });
  };

  // 批量导出
  const handleExport = async () => {
    const selectIds = props.searchKey === '1' ? getSelectRows().map(item => item.uniqueCodeInPack) : [];
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: props.searchKey === '0' ? column : snColumn,
      nameProps: 'title',
      idProps: 'field',
      selectIds,
    });
  };
  const exportAction = query => {
    const exportApi = props.searchKey === '0' ? ExportData : ExportDataSingle;
    if (props.searchKey === '1' && query.selectIds) {
      query.uniqueCode = query.selectIds;
      delete query.selectIds;
    }
    exportApi(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  const printClick = async ({ rows, type }) => {
    let uniqueCodes: string[] = [];
    if (type === 'internal') {
      uniqueCodes = uniq(rows.map(item => item.uniqueCodeInPack));
      if (!uniqueCodes.length || uniqueCodes.some(item => !item)) return message.warning(t('dict.CommonCol.innerUniqueCodeEmpty'));
    } else {
      uniqueCodes = uniq(rows.map(item => item.uniqueCodeOutBox));
      if (!uniqueCodes.length || uniqueCodes.some(item => !item)) return message.warning(t('dict.CommonCol.outerUniqueCodeEmpty'));
    }
    const { data } = await getDetails({ uniqueCodes });
    if (!data.length) return;
    getPrintTemplateDetail(data[0].templateId).then(res => {
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint(data);
      }
    });
  };
  // 补打
  const handlePrintRow = row => {
    if (props.searchKey === '1') {
      openPrintModal([row]);
      return;
    }
    getPrintTemplateDetail(row.templateId.split(',')[0]).then(res => {
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint([row]);
      }
    });
  };

  const handleEdit = row => {
    if (!row.uniqueCode) return message.warning(t('dict.CommonCol.createLabelTip'));
    openEditLabel(true, row);
    Modal.destroyAll();
  };

  // 修改包装信息
  const handleEditPackageInfo = row => {
    Modal.confirm({
      centered: true,
      closable: true,
      title: () => t('dict.CommonCol.selectModifyLabelTip'),
      footer: () => [
        h(
          Button,
          {
            type: 'primary',
            onClick: () => {
              handleEdit({ uniqueCode: row.uniqueCodeInPack });
            },
            style: { marginRight: '16px', marginTop: '10px' },
          },
          { default: () => t('dict.CommonCol.InTagModify') }, // 内部标签
        ),
        h(
          Button,
          {
            type: 'primary',
            onClick: () => {
              handleEdit({ uniqueCode: row.uniqueCodeOutBox });
            },
            style: { marginTop: '10px' },
          },
          { default: () => t('dict.CommonCol.OUTTagModify') }, // 外部标签
        ),
      ],
    });
  };

  const openPrintModal = rows => {
    Modal.confirm({
      centered: true,
      closable: true,
      okText: t('dict.CommonCol.OUTPrint'),
      cancelText: t('dict.CommonCol.InPrint'),
      icon: () => '',
      title: () => t('dict.CommonCol.selectPrintData'),
      content: null,
      footer: () => [
        // ❷ 自定义底部按钮区域
        h(
          Button,
          {
            type: 'primary',
            onClick: () => {
              printClick({ rows, type: 'internal' }); // 原 cancel 逻辑
              // Modal.destroyAll();
            },
            style: { marginRight: '16px', marginTop: '10px' },
          },
          { default: () => t('dict.CommonCol.InPrint') }, // 内部标签
        ),
        h(
          Button,
          {
            type: 'primary',
            onClick: () => {
              printClick({ rows, type: 'external' }); // 原 ok 逻辑
              // Modal.destroyAll();
            },
            style: { marginTop: '10px' },
          },
          { default: () => t('dict.CommonCol.OUTPrint') }, // 外部标签
        ),
      ],
    });
  };

  // 批量补打
  const handlePrintBatch = () => {
    let rows = getSelectRows();
    if (rows.length === 0) return message.warning(t('dict.CommonCol.pleaseSelectData'));
    openPrintModal(rows);
  };

  function filterStrByFields(str, uniqueCodeSmPouch, uniqueCodeInPack, uniqueCodeOutBox, current) {
    const map = [
      { key: 'PE', value: uniqueCodeSmPouch },
      { key: 'internal', value: uniqueCodeInPack },
      { key: 'external', value: uniqueCodeOutBox },
    ];
    const validList = map.filter(item => !!item.value);
    const strList = str.split(',');
    if (strList.length !== validList.length) {
      console.log('str 与有效字段数量不匹配，请检查数据:', strList, validList);
    }
    const index = validList.findIndex(item => item.key === current);
    if (index === -1) return null;
    return strList[index] || null;
  }
</script>

<style lang="less" scoped>
  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }
</style>
