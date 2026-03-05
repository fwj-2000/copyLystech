<template>
  <GridTemp>
    <template #toolbar-actions>
      <a-button type="primary" v-auth="'btn_addUseTemp'" @click="handleApply">{{ t('common.addText') }} </a-button>
      <a-button v-auth="'btn_edit'" @click="handleUpdate">{{ t('common.updateText') }}</a-button>
      <a-button v-auth="'btn_remarks'" @click="handleModifyBillInfo">{{ t('common.editRm') }}</a-button>
      <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
    </template>
    <template #files="{ row }">
      <FileCell :list="row.testReport" @click="handlePreview"></FileCell>
    </template>
  </GridTemp>
  <ExportModal @register="registerExportModal" />
  <Teleport to="#MouldBusinessTemp">
    <ApplyPopup @register="registerApply" @reload="reload"></ApplyPopup>
    <ModifyBillModal @register="registerModifyBillInfoModal" @reload="reload" />
  </Teleport>
  <PreviewModal ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  // import { ActionItem, TableAction } from '/@/components/Table';
  import { ref } from 'vue';
  import { tempColums, schemas } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getTemporaryDeliveryList, exportTemporaryDelivery, updateTemporaryDeliveryRemarks } from '/@/api/warehouse/moldTemp';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import ApplyPopup from './ApplyPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { FileCell, PreviewModal } from '/@/components/Upload';
  import ModifyBillModal from '/@/views/warehouseManagement/bill/components/ModifyBillModal.vue';
  import { billColumnsRemark } from '/@/views/warehouseManagement/bill/components/config';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerApply, { openPopup: openApply }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerModifyBillInfoModal, { openModal: openModifyBillInfoModal }] = useModal();

  const tableConfig: any = {
    api: getTemporaryDeliveryList,
    showIndexColumn: true,
    i18nConfig: {
      moduleCode: 'MoldReceiveRefundColumn',
    },
  };
  const formConfig = {
    commonConfig: {
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-1',
    schema: schemas,
    showCollapseButton: false,
    // i18nConfig: {
    //   moduleCode: 'MoldReceiveRefundColumn',
    //   transferRange: ['placeholder'],
    // },
  };
  const [GridTemp, { reload, getFetchParams, getSelectRowKeys, clearSelectedRowKeys, getSelectRows }] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'warehouse-mouldBusiness-useBack-temp',
      columns: tempColums,
    },
  });

  // function getActions(record): ActionItem[] {
  //   return [
  //     {
  //       icon: 'icon-ym icon-ym-view',
  //       onClick: handleDetail.bind(null, record),
  //     },
  //   ];
  // }

  // 批量导出
  function handleExport() {
    openExportModal(true, {
      api: exportTemporaryDelivery,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: tempColums,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldReceiveRefundColumn',
      },
    });
  }

  async function handleSelectData(method) {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      const r = await method(idList);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        clearSelectedRowKeys();
        reload();
      }
    } else {
      createMessage.info(t('common.selectText'));
    }
  }

  // 申请
  function handleApply() {
    console.log('申请临时单据');
    openApply(true, {
      mode: 'add',
    });
  }

  // 修改
  function handleUpdate() {
    const rows = getSelectRows() || [];
    if (!rows.length) {
      return createMessage.info(t('common.selectText'));
    }
    openApply(true, {
      mode: 'update',
      list: rows,
    });
  }

  // 预览文件
  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  // 修改备注
  function handleModifyBillInfo(key: string) {
    const selectedRows = getSelectRows() || [];
    if (selectedRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    const params = {
      list: selectedRows,
      columns: billColumnsRemark,
      id: 'editRemark',
      picks: ['id', 'remarksOne', 'remarksTwo', 'remarksThree', 'remarksFour', 'remarksFive'],
      submitApi: updateTemporaryDeliveryRemarks,
      title: t('common.editRm'),
    };
    openModifyBillInfoModal(true, params);
  }
</script>
