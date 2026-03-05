<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid>
          <template #toolbar-actions>
            <!-- 审核 -->
            <a-button type="primary" @click="handleAudit" v-auth="'btn_audit'">{{ t('common.audit') }}</a-button>
            <!-- 驳回 -->
            <a-button type="primary" v-auth="'btn_reject'" ghost @click="handleReject">
              {{ t('common.rejectText') }}
            </a-button>
            <!-- 撤回 -->
            <a-button type="primary" v-auth="'btn_recall'" ghost @click="handleFlowwithdraw">{{ t('common.revoke') }}</a-button>
            <!-- 转办 -->
            <a-button type="primary" ghost v-auth="'btn_transfer'" @click="handleTransferProcess">{{ t('common.transfer') }}</a-button>
          </template>
          <!-- 节点详情 -->
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
          </template>

          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <!-- 审核 -->
    <AuditModal @register="registerAudit" @reload="reload"> </AuditModal>
    <!-- 驳回 -->
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <!-- 转办 -->
    <TransferProcessModal @register="registerTransferProcess" @reload="reload" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { bkkaoicustomerapprover, flowreject, flowwithdraw, downloadfile } from '/@/api/productionDeal/AOIDataAudit';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFormSchema, columns } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AuditModal from './components/auditModal.vue';
  import { useModal } from '/@/components/Modal';
  import { RejectModal, NodeModal } from '/@/components/CustomComponents';
  import TransferProcessModal from './components/transferProcessModal.vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { TableAction } from '/@/components/Table';
  import { downloadByUrl } from '/@/utils/file/download';

  const { t } = useI18n();
  defineOptions({ name: 'productionDeal-basicReport-AOIDataAudit' });
  const { createMessage, createConfirm } = useMessage();
  const [registerAudit, { openModal: openAudit }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerTransferProcess, { openModal: openTransferProcessModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const [Grid, { reload, getSelectRows, getSelectRowKeys }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'BkkAoiCustomerApproverCloumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-basicReport-AOIDataAudit-list',
      columns,
      api: bkkaoicustomerapprover,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'BkkAoiCustomerApproverCloumn',
        otherConfig: {
          minWidth: 0,
          resizeable: true,
        },
      },
    },
  });

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-download',
        onClick: handleDownload.bind(null, row),
        auth: 'btn_download',
        tooltip: t('dict.CommonCol.fileDownload'),
      },
    ];
  }

  const handleDownload = async row => {
    const { data } = await downloadfile(row.id);
    if (!data.url) return;
    downloadByUrl({ url: data.url });
  };

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.documentNumber,
    });
  }

  const handleAudit = () => {
    const list = getSelectRows();
    if (!list.length) return createMessage.warning(t('dict.CheckDataTip'));
    if (list.length > 1) return createMessage.warning(t('dict.CommonCol.selectedOneData'));
    openAudit(true, list[0]);
  };

  const handleReject = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    return openRejectModal(true, {
      api: flowreject,
      beforeFetch: params => {
        return {
          ids: idList,
          remark: params.rejectRemark,
        };
      },
    });
  };

  // 撤回
  const handleFlowwithdraw = () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length === 0) return createMessage.warning(t('common.selectText'));
    if (idList.length > 1) return createMessage.warning(t('dict.CommonCol.selectedOneData'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.batchRecallOperationTip'),
      onOk: async () => {
        const { msg, code } = await flowwithdraw({ id: idList[0] });
        if (code === 200) {
          createMessage.success(msg);
          reload();
        }
      },
    });
  };

  // 转办
  const handleTransferProcess = () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length === 0) return createMessage.warning(t('common.selectText'));
    if (idList.length > 1) return createMessage.warning(t('dict.CommonCol.selectedOneData'));
    openTransferProcessModal(true, idList[0]);
  };
</script>
