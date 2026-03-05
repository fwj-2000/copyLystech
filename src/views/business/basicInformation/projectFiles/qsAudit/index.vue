<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <Grid>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_review'" @click="handleAudit">{{ t('routes.business-basicInformation-projectFiles-qsAudit') }}</a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer">{{ t('common.transfer') }}</a-button>
                <!-- <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }} </a-button> -->
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #files="{ row }">
                <span class="table-a" @click="handlePreview(row)">{{ row.problemReleaseFiles ? t('common.searchDetail') : '' }}</span>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="getTableActions(row)" />
              </template>
            </Grid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <ModelConfirmButton
                  v-auth="'btn_recall'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span>{{ t('common.revoke') }}</span>
                </ModelConfirmButton>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #files="{ row }">
                <span class="table-a" @click="handlePreview(row)">{{ row.problemReleaseFiles ? t('common.searchDetail') : '' }}</span>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="getTableActions(row)" />
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <PreviewModal ref="filePreviewRef" />
    <TransferModal @register="registerTransferModal" @reload="reload"></TransferModal>
    <DetailPop @register="registerDetailPop" @refresh="reload"></DetailPop>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getQsAuditList, bulkBackReviewQsAudit, bulkTransferQsAudit } from '/@/api/business/projectQsAudit';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columnsVxe, formSchema } from './config';
  import DetailPop from '../components/qs/DetailPopup.vue';
  import { NodeModal, TransferModal } from '/@/components/CustomComponents';
  import { PreviewModal } from '/@/components/Upload';
  import { ModelConfirmButton } from '/@/components/Button';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { usePopup } from '/@/components/Popup';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  defineOptions({ name: 'business-basicInformation-projectFiles-qsDeal' });

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();

  const state = reactive({
    activeKey: '1',
  });

  const formOptions = {
    commonConfig: {
      labelClass: 'w-0',
    },
    showCollapseButton: true,
    wrapperClass: 'grid grid-cols-5 gap-1',
    schema: formSchema,
    // i18nConfig: {
    //   moduleCode: 'WarehouseBaseColumn',
    //   transferRange: ['placeholder'],
    // },
  };
  const gridOptions = {
    showIndexColumn: true,
    columns: columnsVxe,
    api: getQsAuditList,
    beforeFetch: params => {
      return {
        ...params,
        identification: state.activeKey,
      };
    },
    i18nConfig: {
      moduleCode: 'ProjDocColumn',
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions,
    gridOptions: {
      ...gridOptions,
      id: 'business-basicInformation-projectFiles-qsDeal-Todo',
    },
  });
  const [GridDone, gridApiDone] = useVbenVxeGrid({
    formOptions,
    gridOptions: {
      ...gridOptions,
      id: 'business-basicInformation-projectFiles-qsDeal-Done',
    },
  });

  function getTableActions(row): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-view',
        tooltip: t('common.detailText'),
        onClick: handleDetail.bind(null, row),
      },
    ];
  }

  const { getSelectRowKeys: getSelectRowKeysTodo, reload: reloadTodo, clearSelectedRowKeys: clearSelectedRowKeysTodo } = gridApi;
  const { getSelectRowKeys: getSelectRowKeysDone, reload: reloadDone, clearSelectedRowKeys: clearSelectedRowKeysDone } = gridApiDone;

  function getSelectRowKeys() {
    return state.activeKey == '1' ? getSelectRowKeysTodo() : getSelectRowKeysDone();
  }
  function reload() {
    return state.activeKey == '1' ? reloadTodo() : reloadDone();
  }
  function clearSelectedRowKeys() {
    return state.activeKey == '1' ? clearSelectedRowKeysTodo() : clearSelectedRowKeysDone();
  }

  // 节点详情
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
    });
  }

  // 问题审核
  const handleAudit = async () => {
    const rows = getSelectRowKeys();
    if (!rows.length) {
      return createMessage.info(t('common.selectText'));
    }
    openDetailPopup(true, {
      mode: 'review',
      ids: rows,
    });
  };

  // 详情
  function handleDetail(record) {
    openDetailPopup(true, {
      ids: [record.id],
      mode: 'detailed',
    });
  }

  // 撤回
  const handleRecall = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return bulkBackReviewQsAudit(idList).then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        clearSelectedRowKeys();
        reload();
      });
    }
    createMessage.info(t('common.selectText'));
  };

  //  文件预览
  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      fileList: item.problemReleaseFiles,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  // 转办
  function handleTransfer() {
    const ids = getSelectRowKeys();
    if (!ids.length) {
      return createMessage.info(t('common.selectText'));
    }
    openTransferModal(true, {
      id: ids,
      api: bulkTransferQsAudit,
      beforeFetch: params => {
        return {
          idList: ids,
          handlerId: params.transferUser,
          remark: params.remark,
        };
      },
    });
  }
</script>
<style lang="less" scoped>
  @import url('/@/design/page.less');
</style>
