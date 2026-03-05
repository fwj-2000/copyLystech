<template>
  <div class="lydc-content-wrapper h-[100%]">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 打印 -->
              <a-button type="primary" v-auth="'btn_print'" @click="handleAdd">{{ t('dict.CommonCol.print') }}</a-button>
              <a-button type="primary" @click="handleBatchPrint">{{ t('dict.CommonCol.batchReprint') }}</a-button>
              <!-- 批量导出v-auth="'btn_download'" -->
              <!-- <a-button class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button> -->
              <a-button class="mr-12px" v-auth="'btn_batchRemove'" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
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
    <designindex v-show="false" ref="designindexPrint" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref } from 'vue';
  import { getOtherLabelPrint, ExportData, getPrintTemplateDetail, batchDelete } from '/@/api/productionDeal/otherLabelPrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema, column } from './config';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import PrintModal from './components/printModal.vue';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';
  import { message } from 'ant-design-vue';

  defineOptions({ name: 'productionDeal-dieCut-otherLabelPrint' });

  const { t } = useI18n();

  const { createConfirm } = useMessage();
  interface designindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }

  const designindexPrint = ref<designindexPrintType>();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerPrint, { openModal: openPrint }] = useModal();

  const [Grid, { reload, getFetchParams, getSelectRows, getSelectRowKeys }] = useVbenVxeGrid({
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
      schema: formSchema,
      i18nConfig: {
        moduleCode: 'OtherLabelPrintColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-dieCut-otherLabelPrint-list',
      columns: column,
      rowConfig: {
        keyField: 'Id',
      },
      api: getOtherLabelPrint,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'OtherLabelPrintColumn',
      },
    },
  });

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-report-icon-preview-printPreview',
        onClick: handlePrint.bind(null, row),
        auth: 'btn_print',
        tooltip: t('dict.CommonCol.print'),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, row),
        auth: 'btn_copy',
        tooltip: t('common.copyText'),
      },
    ];
  }

  // 打印
  const handleAdd = () => {
    openPrint(true, { handleType: 'add' });
  };

  // 批量删除
  const handelDelete = async () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        // // 获取勾选的数据
        const ids = list.map(item => item.id);
        const res = await batchDelete(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 批量导出
  const handleExport = async () => {
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: column,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    const exportApi = ExportData;
    exportApi(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  // 补打
  const handlePrint = row => {
    console.log(row);
    getPrintTemplateDetail(row.templateId).then(res => {
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint([row]);
      }
    });
  };

  const handleCopy = row => {
    openPrint(true, { handleType: 'copy', row });
  };

  const handleBatchPrint = async () => {
    // const { templateId } = await getFromValue();
    // if (!templateId) return message.warning(t('dict.CommonCol.filterTemplatesTip'));
    const rows = getSelectRows();
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));
    const isSameTemplate = rows.every(item => item.templateId === rows[0].templateId);
    if (!isSameTemplate) return message.warning(t('dict.CommonCol.selectSameTemplateTip'));
    getPrintTemplateDetail(rows[0].templateId).then(res => {
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint(rows);
      }
    });
  };
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
