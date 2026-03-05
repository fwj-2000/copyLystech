<script setup lang="ts">
  import { reactive, toRefs } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { tomakeGetColumns, tomakeGetSchema, waitGetFormConfig, waitGetColumns, doneGetFormConfig, doneGetColumns } from './config';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { usePopup } from '/@/components/Popup';
  import { cloneDeep, uniq } from 'lodash-es';

  import { bulkDeletePcc, exportExcelApplyPage, getPccApplyPage, getPccTomake, transferPcc, notMakePcc } from '/@/api/engineering/pcc';
  import { NodeModal, TransferModal } from '/@/components/CustomComponents';
  import NotMade from '/@/views/engineering/pcc/pccApply/components/notMade.vue';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import Upgrade from '/@/views/engineering/pcc/pccApply/components/Upgrade.vue';
  import Revocation from '/@/views/engineering/pcc/pccApply/components/Revocation.vue';
  import Modal from '/@/views/engineering/pcc/pccApply/components/Modal.vue';
  import DetailPopup from '/@/views/engineering/PCCBeta/components/DetailPopup.vue';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import { isEmpty } from '/@/utils/is';

  const { t } = useI18n();

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerUpgradeModal, { openModal: openUpgradeModal, closeModal: closeUpgradeModal }] = useModal();
  const [registerModal, { openModal, closeModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerNotMade, { openModal: openNotMade }] = useModal();

  defineOptions({ name: 'engineering-PCC-apply' });

  const { createMessage } = useMessage();

  const state = reactive<Record<string, any>>({
    activeKey: '1',
    tomakeCacheList: [],
    waitCacheList: [],
    doneCacheList: [],
    index: 0,
  });

  const { activeKey } = toRefs(state);

  const [Tomake, { getSelectRows: tomakeGetSelectRows, reload: tomakeReload }] = useVbenVxeGrid({
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
      schema: tomakeGetSchema(),
      i18nConfig: {
        moduleCode: 'PartNumberApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-PCCBeta-PCCApply-list-tomake',
      columns: tomakeGetColumns(),
      api: getPccTomake,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
      },
      afterFetch: data => {
        state.tomakeCacheList = data.list;
      },
    },
  });

  const [Wait, { getSelectRows: waitGetSelectRows, reload: waitReload, getFetchParams: waitGetFetchParams }] = useVbenVxeGrid({
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
      schema: waitGetFormConfig(),
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-PCCBeta-PCCApply-list-wait',
      columns: waitGetColumns(),
      api: getPccApplyPage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
      },
      beforeFetch: params => {
        params.dataFilter = 1;
        return params;
      },
      afterFetch: data => {
        state.waitCacheList = data.list;
        if (Array.isArray(data.list)) {
          const insidePartNumberMap = new Map<string, any>();
          data.list.forEach(item => {
            const partNumber = item?.insidePartNumber;
            if (!partNumber) return;
            if (insidePartNumberMap.has(partNumber)) {
              console.debug('[PCCApply wait list] duplicated insidePartNumber', partNumber, {
                first: insidePartNumberMap.get(partNumber),
                duplicate: item,
              });
              createMessage.warning(t('dict.PCCApplyColumn.duplicatedInsidePartNumber'));
            } else {
              insidePartNumberMap.set(partNumber, item);
            }
          });
        }
        console.log(data.list, 'data.list');
      },
    },
  });

  const [Done, { getSelectRows: doeGetSelectRows, reload: doneReload, getFetchParams: doneGetFetchParams }] = useVbenVxeGrid({
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
      schema: doneGetFormConfig(),
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-PCCBeta-PCCApply-list-done',
      columns: doneGetColumns(),
      api: getPccApplyPage,
      showIndexColumn: true,
      beforeFetch: params => {
        params.dataFilter = 2;
        return params;
      },
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
      },
      afterFetch: data => {
        state.doneCacheList = data.list;
      },
    },
  });

  function handleNotMake() {
    if (tomakeGetSelectRows().length <= 0) {
      createMessage.error(t('common.checkOperationText'));
      return;
    }
    const demandTypeList = uniq(tomakeGetSelectRows().map(item => item.demandType));
    if (demandTypeList.length > 1 && demandTypeList.includes('Quantitative')) {
      createMessage.error(t('dict.PCCApplyColumn.notMakeError'));
      return;
    }

    const list = tomakeGetSelectRows().map(item => ({
      insidePartNumber: item.insidePartNumber,
      originType: item.originType,
      drawingsReviewId: item.id,
      demandType: item.demandType,
    }));
    openNotMade(true, {
      api: notMakePcc,
      list,
    });
  }

  function reloadTable() {
    if (state.activeKey == 1) {
      tomakeReload();
    } else if (state.activeKey == 2) {
      waitReload();
    } else {
      doneReload();
    }
  }

  function handleTransfer(id = '') {
    const idList = tomakeGetSelectRows();
    if (!idList.length) return createMessage.warning(t('dict.PCCApplyColumn.selectTransferContent'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  function onDelete(id) {
    bulkDeletePcc([id]).then(({ code, msg }) => {
      if (code === 200) {
        createMessage.success(msg);
      }
      reloadTable(state.activeKey);
    });
  }

  function handleEditTemplate() {
    openTemplateListModal(true, {
      mode: 'edit',
    });
  }

  function handleUpgradeSubmit(data) {
    openDetail(true, {
      index: 0,
      mode: ModeTypeEnum.EDIT,
      showSubmit: true,
      showDialog: true,
      canEditFactory: true,
      cacheList: [
        {
          ...data,
          originVersion: data.version,
        },
      ],
    });
    closeUpgradeModal();
  }

  const handleTransferCB = async data => {
    // const { id } = unref(data);
    const r = await transferPcc({
      list: tomakeGetSelectRows().map(item => ({ id: item.id, originType: item.originType })),
      remark: data.remark,
      reviewUserId: data.transferUser,
    });
    return r;
  };

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function handleUpgrade() {
    openUpgradeModal(true, {});
  }

  function handleRevocation(record) {
    openFormModal(true, { ...record });
  }

  type Source = 'wait' | 'done';

  function handleApprove(source: Source, index) {
    console.log('🚀 ~ handleApprove ~ index: ', index);
    console.log('🚀 ~ handleApprove ~ source: ', source);
    if (source == 'wait') {
      const list = state.waitCacheList.map(item => ({ ...item, originVersion: item.version }));
      // console.log(waitGetSelectRows(), 'waitGetSelectRows()waitGetSelectRows()');
      // let list = waitGetSelectRows().map(item => ({ ...item, originVersion: item.version }));
      // console.log('🚀 ~ handleApprove ~ list: ', list);
      // if (isEmpty(list)) {
      // }
      console.log('🚀 ~ handleApprove ~ list: ', list);
      // 待提交
      openDetail(true, {
        index: index,
        mode: ModeTypeEnum.EDIT,
        showSubmit: true,
        showDialog: true,
        cacheList: list,
      });
    } else if (source == 'done') {
      // 已提交
      openDetail(true, {
        index: index,
        mode: ModeTypeEnum.VIEW,
        cacheList: state.doneCacheList,
      });
    }
  }

  async function handleDoneReviewExport() {
    const exportColumns = cloneDeep(doneGetColumns());
    openExportModal(true, {
      api: exportExcelApplyPage,
      listQuery: {
        dataFilter: 2,
        ...(await doneGetFetchParams()),
      },

      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  function handleToMake(type, index, record) {
    if (index == -1) {
      const rows = tomakeGetSelectRows().map(item => ({ ...item, applyCode: '', originVersion: item.version }));
      if (rows.length <= 0) return createMessage.warning(t('dict.PCCApplyColumn.selectDataForProduction'));
      openDetail(true, {
        index: 0,
        cacheList: rows,
        mode: ModeTypeEnum.EDIT,
        showSubmit: true,
        showDialog: true,
        doNotTemplate: true,
        shouldInit: true,
      });
    } else {
      openDetail(true, {
        index: 0,
        cacheList: [{ ...record, applyCode: '', originVersion: record.version }],
        mode: ModeTypeEnum.EDIT,
        showSubmit: true,
        showDialog: true,
        doNotTemplate: true,
        shouldInit: true,
      });
    }
  }

  function handleSubmit(rows) {
    openDetail(true, {
      index: 0,
      cacheList: rows,
      mode: ModeTypeEnum.EDIT,
      showSubmit: true,
      doNotTemplate: true,
    });
    closeModal();
  }

  function toMakeGetTableActions(record, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleToMake.bind(null, 'toMake', index, record),
      },
    ];
  }

  function waitGetTableActions(row, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        // auth: 'btn_detail',
        tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: handleApprove.bind(null, 'wait', index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          onOk: onDelete.bind(null, row.id),
        },
        tooltip: t('common.deleted'),
      },
    ];
  }

  async function handleUnReviewExport() {
    const exportColumns = cloneDeep(waitGetColumns());
    // await waitGetFetchParams()
    openExportModal(true, {
      api: exportExcelApplyPage,
      listQuery: {
        dataFilter: 1,
        ...(await waitGetFetchParams()),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  // async function getTypeOptions() {
  // 	state.statusList = await baseStore.getDictionaryData('DrawingsReview.Status');
  // 	console.log(state.statusList);
  // }

  function doneGetAction(record, index): ActionItem[] {
    return [
      {
        icon: 'ym-custom ym-custom-backup-restore',
        onClick: handleRevocation.bind(null, record),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'done', index),
        // auth: 'btn_detail',
      },
    ];
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.waitMadeText')" class="h-full">
            <Tomake>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_edit'" type="primary" @click="handleToMake('toBe', -1)"> {{ t('routes.engineering-pcc-apply') }} </a-button>
                  <a-button v-auth="'btn_upgrade'" type="primary" ghost @click="handleUpgrade">{{ t('dict.PCCApplyColumn.versionUpgrade') }} </a-button>
                  <!-- 转办与量试订单评审功能有冲突，注释 -->
                  <a-button @click="handleTransfer"> {{ t('common.transfer') }}</a-button>
                  <a-button @click="handleNotMake" v-auth="'btn_edit'"> {{ t('dict.PCCColumn.notMade') }} </a-button>
                  <!--                  <a-button v-auth="'btn_edit_tmp'" @click="handleEditTemplate">{{ t('dict.PCCApplyColumn.commonTemplate') }} </a-button>-->
                </a-space>
              </template>
              <template #action="{ row, rowIndex }">
                <TableAction outside :actions="toMakeGetTableActions(row, rowIndex)" />
              </template>
            </Tomake>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('dict.Flow.BillStatus.1')">
            <Wait>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row, rowIndex }">
                <TableAction outside :actions="waitGetTableActions(row, rowIndex)" />
              </template>
            </Wait>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="t('common.submitted')">
            <Done>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_download'" @click="handleDoneReviewExport">{{ t('views.business.quota.export') }} </a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row, rowIndex }">
                <TableAction outside :actions="doneGetAction(row, rowIndex)" />
              </template>
            </Done>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <Revocation @register="registerForm" @reload="reloadTable" />
    <Modal @register="registerModal" @submit="handleSubmit" />
    <Upgrade @register="registerUpgradeModal" @submit="handleUpgradeSubmit" />
    <DetailPopup @register="registerDetail" @reload="reloadTable" />
    <!--    <TemplateList-->
    <!--      @register="registerTemplateList"-->
    <!--      @submit="-->
    <!--        data => {-->
    <!--          openTemplate(true, {-->
    <!--            index: 0,-->
    <!--            mode: 'edit',-->
    <!--            cacheList: [data],-->
    <!--          });-->
    <!--        }-->
    <!--      " />-->
    <!--    <Template @register="registerTemplate" @submit="() => {}" />-->
    <Preview ref="filePreviewRef" />
    <TransferModal @register="registerTransferModal" @reload="reloadTable(activeKey)" />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <NotMade @register="registerNotMade" @reload="reloadTable(activeKey)" />
  </div>
</template>

<style scoped lang="less">
  @import url('/src/design/page.less');

  :deep(.toggle-current) {
    margin-left: 12px;
    margin-right: 12px;
  }
</style>
