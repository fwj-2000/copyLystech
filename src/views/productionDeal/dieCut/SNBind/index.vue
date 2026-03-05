<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 叠料扫码 -->
              <a-button v-auth="'btn_scanCode'" type="primary" @click="handleAdd">{{ t('dict.CommonCol.scanQRCode') }}</a-button>
              <a-button v-auth="'btn_snVoid'" type="primary" ghost @click="handleSNVoid">{{ t('dict.CommonCol.SNVoid') }}</a-button>
              <a-button type="primary" ghost @click="handleLaserBind" v-auth="'btn_laserBind'">{{ t('dict.CommonCol.laserSerialNumberBind') }}</a-button>
              <vShowDropdown>
                <template #overlay>
                  <button @click="batchImportFile" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                  <button @click="batchExport" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
            </a-space>
          </template>
          <template #lsUsed="{ row }">
            <LydcTag v-if="row.lsUsed === '1'" theme="green" :text="t('common.yesText')"></LydcTag>
            <LydcTag v-else theme="red" :text="t('common.noText')"></LydcTag>
          </template>
          <!-- <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template> -->
        </Grid>
      </div>
    </div>
    <AddModal @register="registerAdd" @reload="reload"></AddModal>
    <LaserBindModal @register="registerLaserBind" @reload="reload"></LaserBindModal>
    <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getDispatchcode, discard, getTemplateDownload, saveimport, importExcel, exportExcel } from '/@/api/productionDeal/SNBind';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFormSchema, columns } from './config';
  import { useModal } from '/@/components/Modal';
  import AddModal from './components/AddModal.vue';
  import LaserBindModal from './components/LaserBindModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { uniq } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { downloadByUrl } from '/@/utils/file/download';

  const { t } = useI18n();
  defineOptions({ name: 'productionDeal-dieCut-SNBind' });
  const [registerAdd, { openModal: openAddModal }] = useModal();
  const [registerLaserBind, { openModal: openLaserBindModal }] = useModal();
  const { createConfirm, createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const gridEvents = {
    checkboxChange: ({ row, checked }) => {
      let tableList = getDataSource();
      if (!checked) {
        // 去掉勾选也要将同一单据的其他勾选去掉
        const unSelectList = tableList.filter(item => item.documentNumber === row.documentNumber);
        gridApi.grid.setCheckboxRow(unSelectList, false);
      }
      const rows = getSelectRows();
      // 获取已经选中数据的单据号数组并进行去重
      const uniqDocumentNumberList = uniq(rows.map(item => item.documentNumber));
      // 相同单据号的也要一起同步勾选
      const selectList = tableList.filter(item => uniqDocumentNumberList.includes(item.documentNumber));
      gridApi.grid.setCheckboxRow(selectList, true);
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      // showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'StackMaterialColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-dieCut-SNBind-list',
      columns,
      api: getDispatchcode,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'StackMaterialColumn',
      },
      virtualYConfig: {
        enabled: true,
        gt: 0,
      },
      // beforeFetch: params => {
      //   params.snCodes = params.snCodes && params.snCodes.trim().split(/\s+/);
      //   // if (params.snCodes && params.snCodes.length > 200) {
      //   //   createMessage.warning(t('dict.CommonCol.scanUp200SNs'));
      //   //   params.snCodes = null;
      //   // }
      //   return params;
      // },
      afterFetch: () => {
        gridApi.setFieldValue('snCodes', null);
      },
    },
    gridEvents,
  });

  const { reload, getSelectRows, getDataSource, getFetchParams } = gridApi;

  // 叠料扫码
  const handleAdd = () => {
    openAddModal(true, {});
  };

  // SN作废
  const handleSNVoid = async () => {
    const rows = getSelectRows();
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchInvalidationTip'),
      onOk: async () => {
        const { msg } = await discard({ documentNumberList: uniq(rows.map(item => item.documentNumber)) });
        message.success(msg);
        reload();
      },
    });
  };

  // 镭射号绑定
  const handleLaserBind = () => {
    openLaserBindModal(true, {});
  };

  const importColumns = [
    {
      title: 'SN',
      field: 'serialNumber',
      slots: { default: 'serialNumber' },
    },
    // 镭射序号
    {
      title: t('dict.CommonCol.laserNumber'),
      field: 'lsSeq',
      width: 160,
      slots: { default: 'lsSeq' },
    },
  ];

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importExcel,
      importSaveApi: saveimport,
      templateApi: getTemplateDownload,
      version: '2',
      templateUrl: '/api/Production/dispatchcode/download/importtemplate',
      previewColumn: importColumns,
      usePolling: false,
      pollingParams: {
        interval: 5000,
      },
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    });
  }

  async function batchExport() {
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  const exportAction = query => {
    exportExcel(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };
</script>

<style lang="less" scoped>
  ::v-deep(textarea) {
    resize: none; /* 禁止拖动改变大小 */
  }

  .lydc-content-wrapper {
    position: absolute;
  }

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
