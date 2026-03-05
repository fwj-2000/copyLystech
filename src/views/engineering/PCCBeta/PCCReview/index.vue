<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_enable'" type="primary" @click="handleBatchEnable">{{ t('common.enableText') }} </a-button>
            <a-button v-auth="'btn_disable'" type="primary" ghost @click="handleBatchDisable">{{ t('common.disableText') }} </a-button>
            <a-button v-auth="'btn_masterialProcess'" @click="handleMaterialHeadProcess">{{ t('common.materialHeadProcess') }} </a-button>
            <a-button v-auth="'btn_print'" @click="handlePrint">{{ t('common.printText') }} </a-button>
            <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
            <a-button v-auth="'btn_defaultBOM'" @click="handleDefaultBOM">{{ t('common.defaultBOM') }} </a-button>
            <!-- PCC转化 -->
            <a-button v-auth="'btn_PCCTrans'" @click="handlePCCTrans">{{ t('dict.PCCTransColumn') }} </a-button>
            <a-button v-auth="'btn_default'" @click="handleDefault">{{ t('common.default') }} </a-button>
            <a-button v-auth="'btn_PCCTrans'" @click="handlePush">{{ t('common.pushMany3.8') }} </a-button>
          </template>

          <template #record="{ row }">
            <span class="table-a" @click="handleOpenRecordModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>

          <template #materialProcess="{ row }">
            <LydcTag v-if="row.isStubbar" theme="green" :text="t('common.yes')"></LydcTag>
            <p v-else>{{ t('common.no') }}</p>
          </template>

          <template #action="{ row, rowIndex }">
            <TableAction outside :actions="getunReviewActions(rowIndex, row)" />
          </template>
        </Grid>
      </div>
    </div>
    <DetailPopup @register="registerDetail" />
    <FileListModal @register="registerFileList"></FileListModal>
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <RecordModal @register="registerRecordModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { onMounted, reactive, computed, watch, nextTick } from 'vue';
  import {
    exportQuotation,
    getEngineeringDocApplyHistory,
    getPccList,
    bulkBackEnable,
    bulkBackDisable,
    bulkBackDefaultBOM,
    bulkBackStubBar,
    transPCC,
    bulkEnable,
    pushPCC,
  } from '/@/api/engineering/pcc';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, isEmpty, omit } from 'lodash-es';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from '/@/views/engineering/PCCBeta/components/DetailPopup.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { FileListModal } from '/@/components/Upload';
  import { useModal } from '/@/components/Modal';
  import { fileDownload } from '/@/api/purchase/importMateria';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { NodeModal } from '/@/components/CustomComponents';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getUnReviewColumns, schemas } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { printPCCDetailByIds } from '/@/views/engineering/pcc/pccApply/components/print';
  import { useRoute } from 'vue-router';
  import { useProductCodeLifyCycleStore } from '/@/store/modules/productCodeLifeCycle';
  import RecordModal from './components/recordModal.vue';
  import LydcTag from '/@/components/Lydc/Tag/src/Tag.vue';

  const baseStore = useBaseStore();

  defineOptions({ name: 'engineering-PCC-review' });
  const { t } = useI18n();
  const { createConfirm, createMessage } = useMessage();

  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  onMounted(() => {
    getTypeOptions();
  });
  interface StateType {
    cacheUnReviewData: Array<any>;
    cacheReviewData: Array<any>;
    statusList: Array<any>;
  }

  const state = reactive<StateType>({
    cacheUnReviewData: [],
    cacheReviewData: [],
    statusList: [],
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
      id: 'engineering-PCCBeta-PCCReview-list',
      columns: getUnReviewColumns(handleNodeModal),
      rowConfig: {
        keyField: 'id',
      },
      api: getPccList,
      pagerConfig: {
        autoHidden: false,
      },
      // @ts-ignore
      proxyConfig: {
        autoLoad: false,
      },
      beforeFetch: (params: any) => {
        return formatFetchParams(params);
      },
      afterFetch: (data: any) => {
        state.cacheUnReviewData = data.list;
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

  function formatFetchParams(params: any) {
    if (params.time && params.time.length > 0) {
      params.startTime = params.time[0];
      params.endTime = params.time[1];
      delete params.time;
    }
    return params;
  }

  function reloadTable() {
    gridApi.reload();
  }

  function getunReviewActions(index, record): ActionItem[] {
    return [
      // {
      //   icon: 'icon-ym icon-ym-turn',
      //   onClick: handleTurn.bind(null, "unReview", index)
      //   // auth: 'btn_detail',
      // },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'unReview', index, record),
        // auth: 'btn_detail',
      },
      // {
      //   icon: 'icon-ym icon-ym-delete',
      //   modelConfirm: {
      //     onOk: onDelete.bind(null, index),
      //   },
      //   auth: 'btn_remove',
      // },
    ];
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
          getEngineeringDocApplyHistory({ ...params, docType: record.docTypeEnum }).then(res => {
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
    if (type == 'unReview') {
      openDetail(true, {
        index: index,
        mode: 'view',
        cacheList: state.cacheUnReviewData,
      });
    }
  }

  async function handleUnReviewExport() {
    const exportColumns = cloneDeep(gridApi.grid.getColumns());
    const params = await gridApi.getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportQuotation,
      listQuery: {
        ...formatFetchParams(params),
        ...omit(pager, 'total'),
      },

      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
      },
    });
  }

  async function getTypeOptions() {
    state.statusList = (await baseStore.getDictionaryData('DrawingsReview.Status')) as Array<any>;
  }

  function handleBatchEnable() {
    const rows = getSelectRows();
    if (rows?.length === 0) return createMessage.error(t('common.selectText'));
    // const selectedRowKeys = gridApi.getSelectRowKeys();
    // if (selectedRowKeys?.length === 0) return createMessage.error(t('common.selectText'));

    // 过滤掉启用状态
    const list = rows.filter(row => !row.enable);

    if (list.length === 0) {
      return createMessage.error(t('dict.semifinishedproducts.enableTip'));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeEnableTip'),
      onOk: async () => {
        const { code, msg } = await bulkBackEnable(list.map(row => row.id));
        if (code === 200) {
          gridApi.grid.clearCheckboxRow();
          reloadTable();
          return createMessage.success(msg);
        }
      },
    });
  }

  function handleBatchDisable() {
    // const selectedRowKeys = gridApi.getSelectRowKeys();
    // if (selectedRowKeys?.length === 0) return createMessage.error(t('common.selectText'));
    const rows = getSelectRows();
    if (rows?.length === 0) return createMessage.error(t('common.selectText'));

    // 过滤掉禁用状态
    const list = rows.filter(row => row.enable);

    if (list.length === 0) {
      return createMessage.error(t('dict.semifinishedproducts.disableTip'));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDisableTip'),
      onOk: async () => {
        const { code, msg } = await bulkBackDisable(list.map(row => row.id));
        if (code === 200) {
          gridApi.grid.clearCheckboxRow();
          reloadTable();
          return createMessage.success(msg);
        }
      },
    });
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

  function handlePrint() {
    const ids = getSelectRowKeys();

    if (ids.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    setLoading(true);
    printPCCDetailByIds(ids).finally(() => {
      setLoading(false);
    });
  }

  // 设置默认
  function handleDefault() {
    const ids = gridApi.getSelectRowKeys();
    if (ids.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    bulkEnable(ids).finally(() => {
      gridApi.reload();
    });
  }

  function handlePush() {
    const ids = gridApi.getSelectRowKeys();
    if (isEmpty(ids)) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    if (ids.length > 1) {
      createMessage.warning(t('common.OnlyOnePiece'));
      return;
    }
    gridApi.setLoading(true);
    pushPCC(ids[0]).then(({ code, msg }) => {
      if (code === 200) {
        createMessage.success(msg);
        gridApi.clearSelectedRowKeys();
        gridApi.setLoading(false);
      }
    });
  }

  const [registerRecordModal, { openModal: openRecordModal }] = useModal();
  /** 打开修改记录弹窗 */
  function handleOpenRecordModal(row: any) {
    openRecordModal(true, { id: row.id });
  }

  /** PCC转化 */
  function handlePCCTrans() {
    const rows = getSelectRows();
    // 有且只能有勾选一条数据
    if (rows?.length === 0) return createMessage.warn(t('common.selectDataTip'));
    if (rows.length > 1) return createMessage.warn(t('common.selectSingleDataTip'));
    // `受控时间(effectiveDate)` 不能为空
    // if (!rows[0].effectiveDate) return createMessage.warn(t('dict.PCCApply.hasEffectiveDateToTrans'));

    setLoading(true);
    transPCC(rows[0].id)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // 成品编码生命周期跳转到当前页面的处理 开始
  const productCodeLifyCycleStore = useProductCodeLifyCycleStore();
  const routePath = useRoute().path;
  const productCodeLifyCycleParams = computed(() => productCodeLifyCycleStore.lifeCycleParamMap[routePath]);

  watch(productCodeLifyCycleParams, () => {
    productCodeLifyCycleParams.value && reloadByProductCodeLifyCycle();
  });

  function reloadByProductCodeLifyCycle() {
    setTimeout(async () => {
      if (!productCodeLifyCycleParams.value) {
        return false;
      }
      const params = await gridApi.getFetchParams();
      if (params.originCode === productCodeLifyCycleParams.value.applyCode && params.insidePartNumber === productCodeLifyCycleParams.value.insidePartNumber) {
        return false;
      }

      // 手动设置筛选条件并提交查询
      const { pager } = gridApi.grid.getProxyInfo() || {};
      if (pager) {
        pager.currentPage = 1;
      }
      gridApi.formApi.setFieldValue('originCode', productCodeLifyCycleParams.value.applyCode);
      gridApi.formApi.setFieldValue('insidePartNumber', productCodeLifyCycleParams.value.insidePartNumber);
      gridApi.formApi.submitForm();
      // 清空存储的筛选条件
      productCodeLifyCycleStore.setLifeCycleParam(routePath, null);
    });
  }

  onMounted(async () => {
    await nextTick();
    productCodeLifyCycleParams.value ? reloadByProductCodeLifyCycle() : gridApi.grid.commitProxy('query');
  });
  // 成品编码生命周期跳转到当前页面的处理 结束
</script>

<style lang="less" scoped>
  :deep(.toggle-current) {
    margin-left: 0;
    margin-right: 12px;
  }
</style>
