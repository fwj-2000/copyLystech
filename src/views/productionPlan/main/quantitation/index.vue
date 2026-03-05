<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <TodoGrid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_plan'" type="primary" @click="handleSubmit">{{ t('common.MC') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
                <a-button v-auth="'btn_reject'" @click="handleReject"> {{ t('common.rejectText') }} </a-button>
              </template>
              <template #engineeringRemarks="{ row }">
                <a-tooltip :title="richTextToPlainText(row.engineeringRemarks)">
                  <div v-html="row.engineeringRemarks"></div>
                </a-tooltip>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getunReviewActions(row)" />
              </template>
              <template #pdReview="{ row }">
                <span class="table-a" @click="handlePdDetail(row)"> {{ t('common.viewDetails') }} </span>
              </template>
            </TodoGrid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <DoneGrid>
              <template #toolbar-actions>
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
                <a-button @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #engineeringRemarks="{ row }">
                <a-tooltip :title="richTextToPlainText(row.engineeringRemarks)">
                  <div v-html="row.engineeringRemarks"></div>
                </a-tooltip>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getunReviewActions(row)" />
              </template>
              <template #pdReview="{ row }">
                <span class="table-a" @click="handlePdDetail(row)"> {{ t('common.viewDetails') }} </span>
              </template>
            </DoneGrid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerTransferModal" @reload="reload" />
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <DetailPopup @register="registerDetail" @reload="reload" />
    <QuanlityPopup @register="registerQuantity" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { nextTick, onMounted, reactive, toRefs, unref } from 'vue';
  import { getUnReviewColumns, getUnReviewFormConfig } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, omit, trim, replace } from 'lodash-es';
  import { getMainQuantityListAPI, getMainQuantitytransferuserAPI, exportExleAPI, rejectApi, recallApi } from '/@/api/productionPlan/mainplan';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './components/DetailPopup.vue';
  import { TransferModal, RejectModal, NodeModal } from '/@/components/CustomComponents';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getNodelist } from '/@/api/business/quantitation';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRoute } from 'vue-router';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import QuanlityPopup from '/@/views/engineering/data/produce/componentsBom/DetailPopup.vue';

  defineOptions({ name: 'main-quantitation' });
  const { t } = useI18n();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerQuantity, { openPopup: openQuanlityPopup }] = usePopup();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);
  const tableConfig: any = {
    api: getMainQuantityListAPI,
    columns: getUnReviewColumns(),
    pagerConfig: {
      autoHidden: false,
    },
    showIndexColumn: true,
    beforeFetch: params => {
      params.identification = state.activeKey;
      return params;
    },
    clipConfig: {
      copyMethod: ({ column, row, cellValue }) => {
        if (column.field == 'engineeringRemarks') {
          return richTextToPlainText(cellValue);
        }
        return cellValue;
      },
    },
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
    },
  };

  const [TodoGrid, todoGridApi] = useVbenVxeGrid({
    formOptions: getUnReviewFormConfig(true),
    gridOptions: {
      ...tableConfig,
      id: 'productionPlan-main-quantitation-todo',
    },
  });

  const [DoneGrid, doneGridApi] = useVbenVxeGrid({
    formOptions: getUnReviewFormConfig(false),
    gridOptions: {
      ...tableConfig,
      id: 'productionPlan-main-quantitation-done',
    },
  });

  function reload() {
    clearSelectedRowKeys();
    if (state.activeKey == '1') {
      return todoGridApi.reload();
    }
    return doneGridApi.reload();
  }
  async function getFetchParams() {
    if (state.activeKey == '1') {
      const params = await todoGridApi.getFetchParams();
      const { pager } = todoGridApi.grid.getProxyInfo() || {};
      return { ...params, ...omit(pager, 'total') };
    }
    const params = await doneGridApi.getFetchParams();
    const { pager } = doneGridApi.grid.getProxyInfo() || {};
    return { ...params, ...omit(pager, 'total') };
  }
  function getSelectRowKeys() {
    if (state.activeKey == '1') {
      return todoGridApi.getSelectRowKeys();
    }
    return doneGridApi.getSelectRowKeys();
  }
  function clearSelectedRowKeys() {
    if (state.activeKey == '1') {
      return todoGridApi.clearSelectedRowKeys();
    }
    return doneGridApi.clearSelectedRowKeys();
  }

  function getunReviewActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleReview.bind(null, record.id),
        auth: 'btn_detail',
      },
    ];
  }
  function handleReview(id) {
    openDetail(true, {
      index: 0,
      type: 'view',
      ids: [id],
    });
  }

  // 打开量试订单评审
  function handlePdDetail(data) {
    const { engineeringId } = data;
    openQuanlityPopup(true, {
      type: 'view',
      index: 0,
      ids: [engineeringId],
      cacheList: [{ id: engineeringId }],
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.quantitativeApplyId,
    });
  }

  function handleTransfer(id = '') {
    const idList = getSelectRowKeys();
    if (!idList.length) return message.warning(t('common.selectText'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }
  const handleTransferCB = async data => {
    const { id } = unref(data);
    const r = await getMainQuantitytransferuserAPI({
      ids: id,
      transferRemarks: data.remark,
      transferUserId: data.transferUser,
    });
    return r;
  };

  async function handleUnReviewExport() {
    const exportColumns = cloneDeep(getUnReviewColumns());
    openExportModal(true, {
      api: exportExleAPI,
      listQuery: {
        ...(await getFetchParams()),
        identification: state.activeKey,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'EngineeringInformationColumn',
      },
    });
  }

  //  驳回
  async function handleReject() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openRejectModal(true, {
        api: rejectApi,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  }
  // 撤回
  async function handleRecall() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return recallApi(idList);
    }
    message.info(t('common.selectText'));
  }

  function handleSubmit() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openDetail(true, {
        index: 0,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  }

  const route = useRoute();
  onMounted(() => {
    const { id, tab } = route.query as any;
    if (id && tab) {
      state.activeKey = tab;
      nextTick(() => {
        handleReview(id);
      });
    }
  });

  // 复制富文本
  function richTextToPlainText(html) {
    if (!html) return '';

    // 创建一个临时的div元素来解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 获取纯文本内容
    let text = tempDiv.textContent || tempDiv.innerText || '';

    // 使用lodash处理文本
    text = trim(text);
    text = replace(text, /\s+/g, ' '); // 将多个空白字符替换为单个空格
    text = replace(text, /\n\s*\n/g, '\n'); // 清理多余的空行

    return text;
  }
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
