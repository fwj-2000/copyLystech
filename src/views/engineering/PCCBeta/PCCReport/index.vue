<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
            <a-button v-auth="'btn_defaultBOM'" @click="handleDefaultBOM">{{ t('common.defaultBOM') }} </a-button>
            <a-button v-auth="'btn_print'" @click="handlePrint">{{ t('common.printText') }} </a-button>
            <a-button v-auth="'btn_pushPdf'" @click="handleSendPdf">{{ t('dict.PCCReport.pushPdfTo3.8') }} </a-button>
            <a-button v-auth="'btn_masterialProcess'" @click="handleMaterialHeadProcess">{{ t('common.materialHeadProcess') }} </a-button>
            <a-button v-auth="'btn_masterialProcess'" @click="handleExportPcc">{{ t('common.ExportPCC') }} </a-button>
          </template>
          <template #PDF="{ row }">
            <span v-if="row.fileName" class="table-a cursor-pointer" @click="handlePreview(row)">{{ row.fileName }}</span>
          </template>
          <template #materialProcess="{ row }">
            <LydcTag v-if="row.isStubbar" theme="green" :text="t('common.yes')"></LydcTag>
            <p v-else>{{ t('common.no') }}</p>
          </template>
          <template #desensitizationDrawing="{ row }">
            <a-tooltip :title="t('common.clickView', [t('common.newDraw')])">
              <FileDoneOutlined class="table-a mr-5px" @click="handleDesensitizeList(row)" />
            </a-tooltip>
            <span v-if="row.desensitizedDrawingsId" class="table-a" @click="handleDesensitize(row)">{{ row.desensitizedDrawingsName }}</span>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction outside :actions="getReviewActions(rowIndex, row)" />
          </template>
        </Grid>
      </div>
    </div>

    <DetailPopup @register="registerDetail" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <FileListModal @register="registerFileList"></FileListModal>
    <PreviewModal ref="filePreviewRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import {
    bulkBackDefaultBOM,
    bulkBackStubBar,
    exportExcelTomake,
    getEngineeringDocApplyHistory,
    getPccReportList,
    exportPccToSap,
  } from '/@/api/engineering/pcc';
  import { reactive, ref } from 'vue';
  import { cloneDeep, omit } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { NodeModal } from '/@/components/CustomComponents';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from '/@/views/engineering/PCCBeta/components/DetailPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getUnReviewColumns, schemas } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { fileDownload } from '/@/api/purchase/importMateria';
  import { printPCCDetailByIds, generatePdfByIds } from '/@/views/engineering/pcc/pccApply/components/print';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PreviewModal, FileListModal } from '/@/components/Upload';
  import { FileDoneOutlined } from '@ant-design/icons-vue';
  import { handleDrawParams } from '/@/components/Upload/src/utils';
  import LydcTag from '/@/components/Lydc/Tag/src/Tag.vue';
  import { downloadByUrl } from '/@/utils/file/download';

  defineOptions({ name: 'engineering-PCC-Report' });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerFileList, { openModal: openFileList }] = useModal();

  const state = reactive<{ cacheReviewData: Array<any> }>({
    cacheReviewData: [],
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: schemas,
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-PCCBeta-PCCReport-list',
      showIndexColumn: true,
      columns: getUnReviewColumns(handleNodeModal).filter(item => item.field !== 'pdLeaderName'),
      rowConfig: {
        keyField: 'id',
      },
      api: getPccReportList,
      pagerConfig: {
        autoHidden: false,
        pageSize: 20,
      },
      beforeFetch: (params: any) => {
        // params.dataFilter = 2;
        params.status = 3;
        if (params.time && params.time.length > 0) {
          params.startTime = params.time[0];
          params.endTime = params.time[1];
          delete params.time;
        }
        return params;
      },
      afterFetch: (data: any) => {
        state.cacheReviewData = data.list;
      },
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
      },
      toolbarConfig: {
        superQuery: true,
      },
    },
  });

  const { getSelectRowKeys, setLoading, getSelectRows } = gridApi;

  async function handleUnReviewExport() {
    const exportColumns = cloneDeep(gridApi.grid.getColumns());
    const params = await gridApi.getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportExcelTomake,
      listQuery: {
        dataFilter: 3,
        ...params,
        ...omit(pager, 'total'),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  async function handleExportPcc() {
    const keys = getSelectRowKeys();
    if (keys.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    gridApi.setLoading(true);
    exportPccToSap({ selectIds: keys.join(',') }).then(res => {
      const isArrayResponse = Array.isArray(res?.data);
      const hasSingleFile = !isArrayResponse && !!res?.data?.url;
      let files: Array<any> = [];
      if (isArrayResponse) {
        files = res?.data || [];
      } else if (hasSingleFile) {
        files = [res?.data];
      }
      if (!files.length) {
        createMessage.warning(t('common.noData'));
        return;
      }
      files.forEach((item, index) => {
        if (!item?.url) return;
        setTimeout(() => {
          setLoading(false);
          downloadByUrl({ url: item.url, fileName: item.name });
          gridApi.clearSelectedRowKeys();
        }, index * 200);
      });
    });
  }

  function getReviewActions(index, row): ActionItem[] {
    return [
      // {
      //   icon: 'ym-custom ym-custom-backup-restore',
      //   onClick: handleRevocation.bind(null, index),
      //   // auth: 'btn_detail',
      // },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'reviewed', index, row),
      },
    ];
  }

  function handleApprove(type, index, record) {
    const { tag } = record;
    if (tag == 'ED') {
      openFileList(true, {
        insidePartNumber: record.insidePartNumber,
        keyFieldName: 'insidePartNumber',
        downloadApi: fileDownload,
        useQuery: true,
        usePath: true,
        useMerge: false,
        listApi: params =>
          getEngineeringDocApplyHistory(params).then(res => {
            const list = res?.data?.list || [];
            // 文件启用状态赋值
            // 因为使用`FileListModal`组件，组件内部使用`status`显示状态，值为`1`时显示启用状态，否则显示禁用状态
            // 当前文件`启用状态`字段为`enable`，为`boolean`，直接赋值给`status`字段，组件内部通过隐式转换显示文件的`启用状态`
            res.data.list = list.map((item: any) => {
              item.status = item.enable;
              return item;
            });
            return res;
          }),
        resultField: 'list',
      });
      return;
    }
    if (type == 'reviewed') {
      openDetail(true, {
        index: index,
        mode: 'view',
        cacheList: state.cacheReviewData,
        showReview: false,
        showReject: false,
      });
    }
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function handlePrint() {
    const ids = gridApi.getSelectRowKeys();

    if (ids.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    gridApi.setLoading(true);
    printPCCDetailByIds(ids).finally(() => {
      gridApi.setLoading(false);
    });
  }

  function handleSendPdf() {
    const rows = gridApi.getSelectRows();

    if (rows.length === 0 || rows.some(item => item.docType !== 'PCC')) {
      createMessage.warning(t('dict.PCCReport.selectedToGeneratePdfTip'));
      return false;
    }

    gridApi.setLoading(true);
    generatePdfByIds(rows.map(item => item.id))
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        gridApi.query();
      })
      .catch(e => {
        console.warn('🚀 ~ handleSendPdf ~ e:', e);
      })
      .finally(() => {
        gridApi.setLoading(false);
      });
  }

  function reloadTable() {
    gridApi.reload();
  }

  // 打开脱敏图纸列表弹框
  function handleDesensitizeList(record) {
    openFileList(
      true,
      handleDrawParams({
        insidePartNumber: record.insidePartNumber,
      }),
    );
  }

  // 默认BOM
  function handleDefaultBOM() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    setLoading(true);
    bulkBackDefaultBOM(ids)
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg || t('sys.api.operationSuccess'));
          gridApi.grid.clearCheckboxRow();
          reloadTable();
          return;
        }
        createMessage.error(msg || t('sys.api.operationFailed'));
      })
      .finally(() => setLoading(false));
  }

  // 料头处理
  function handleMaterialHeadProcess() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    setLoading(true);
    bulkBackStubBar(ids)
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg || t('sys.api.operationSuccess'));
          gridApi.grid.clearCheckboxRow();
          reloadTable();
          return;
        }
        createMessage.error(msg || t('sys.api.operationFailed'));
      })
      .finally(() => setLoading(false));
  }

  const filePreviewRef = ref<any | null>(null);
  // 打开脱敏图纸
  function handleDesensitize(row) {
    const params = {
      previewType: 'localPreview',
      Id: row.desensitizedDrawingsId,
      fileName: row.desensitizedDrawingsName,
    };
    filePreviewRef.value?.init(params);
  }

  function handlePreview(row: any) {
    const params = {
      previewType: 'localPreview',
      filePath: row.filePath,
      fileName: row.fileName,
    };
    filePreviewRef.value?.init(params);
  }
</script>

<style lang="less" scoped>
  :deep(.toggle-current) {
    margin-left: 0;
  }
</style>
