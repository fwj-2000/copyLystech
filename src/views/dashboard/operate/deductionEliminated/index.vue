<!-- 每日即时库存 -->
<template>
  <!-- 内容加载封装组件 -->
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button :loading="batchExportLoading" @click="handleAdd" type="primary">{{ t('common.add2Text') }}</a-button>
            <a-button :loading="batchExportLoading" @click="handleBatchExport">{{ t('common.batchExport') }}</a-button>
          </template>
          <template #Remark="{ row }">
            <a-textarea v-model:value="row.Remark" :auto-size="{ minRows: 1, maxRows: 1 }" placeholder="请输入备注" allow-clear />
          </template>
          <template #action="{ row, rowIndex }">
            <TableAction outside :actions="getAction(row, rowIndex)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <FormModal @register="registerFormModal" @reload="gridApi.reload" />
  </div>
</template>

<script lang="ts" setup>
  import { provide, ref } from 'vue';
  import { column, getExportColumn } from './config';
  import { kucuntbexportdata, getshipmentdebitPage, deleteShipmentdebit } from '/@/api/dashbord/report';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useModal } from '/@/components/Modal';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction } from '/@/components/Table';
  import FormModal from './Form.vue';
  import { bulkDeletePcc } from '/@/api/engineering/pcc';
  import { useMessage } from '/@/hooks/web/useMessage';

  defineOptions({ name: 'dashboard-operate-deductionEliminated' });
  const { t } = useI18n();

  const exportLoading = ref(false);

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerFormModal, { openModal: openFormModal }] = useModal();

  const batchExportLoading = ref(false);
  const { createMessage } = useMessage();

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
      schema: [
        {
          fieldName: 'werks',
          label: '',
          i18nField: 'werks',
          component: 'Input',
          componentProps: {
            placeholder: '销售组织',
          },
        },
        {
          fieldName: 'sellerCode',
          label: '',
          i18nField: 'sellerCode',
          component: 'Input',
          componentProps: {
            placeholder: '售达方',
          },
        },
      ],
    },
    gridOptions: {
      id: 'dashboard-operate-deductionEliminated-list',
      columns: column,
      api: getshipmentdebitPage,
      rowConfig: {
        keyField: 'Id',
      },
      // exportConfig: {
      //   type: '',
      // },
      // beforeFetch: params => {
      //   console.log("🚀 ~ beforeFetch ~ params: ", params);
      //   return {
      //     ...params,
      //   };
      // },
    },
  });
  setTimeout(() => {
    console.log('🚀 ~  ~ gridApi.getSelectRows(): ', gridApi.getSelectRows());
  }, 2000);
  function exportAction(query) {
    kucuntbexportdata(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }

  function getAction(record, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, record, index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record.Id),
        },
        tooltip: t('common.deleted'),
      },
    ];
  }

  function onDelete(id) {
    deleteShipmentdebit(id).then(({ code, msg }) => {
      if (code === 200) {
        createMessage.success(msg);
      }
      gridApi.reload();
    });
  }

  function handleEdit(record, index) {
    openFormModal(true, record);
  }

  function handleAdd() {
    openFormModal(true, {});
  }

  // 批量导出
  const handleBatchExport = async () => {
    const { grid } = gridApi;
    // const params = props.tableConfig?.getExportParams?.() ?? {};
    const params = {
      filename: `扣账关系剔除_${dateUtil().format('YYYY-MM-DD')}`,
    };
    if (grid) {
      grid.openExport({
        // grid.exportData({
        ...params,
        type: 'xlsx',
        isTitle: true,
        useStyle: true,
        sheetMethod: ({ worksheet }) => {
          worksheet.eachRow(excelRow => {
            excelRow.eachCell(excelCell => {
              excelCell.numFmt = '@';
            });
          });
        },
      });
    }
  };
</script>

<style lang="less">
  .table-wrapper {
    .hightlignt-row {
      td {
        background-color: #fff2e6;
      }
    }
  }
</style>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');

  @borderColor: #ccc;

  .dashboard-content-container {
    height: calc(100% - 60px);

    :deep(.ant-spin-container) {
      min-height: 60vh;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }

  :deep(.ant-table-container) {
    font-size: 12px;
  }

  :deep(.ant-table-thead > tr) {
    & > th {
      font-weight: 700;
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      text-align: center !important;
      // border-color: @borderColor !important;
    }
  }

  :deep(.ant-table-tbody > tr) {
    &:first-child {
      & > td {
        padding: 0 !important;
      }
    }

    & > td {
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      border-color: @borderColor !important;
      padding: 4px 8px !important;
    }
  }
</style>
