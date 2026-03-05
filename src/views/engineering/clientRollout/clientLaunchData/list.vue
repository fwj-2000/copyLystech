<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 录入 -->
              <a-button v-auth="'btn_entry'" type="primary" @click="entryFn('add')" v-if="activeKey === 'pending'">{{ t('common.enter') }}</a-button>
              <!-- 转办 -->
              <a-button v-auth="'btn_batchTransfer'" @click="handleBatchTransfer" v-if="activeKey === 'pending'">{{ t('common.transfer') }}</a-button>
              <!-- 修改 -->
              <a-button v-auth="'btn_edit'" type="primary" @click="entryFn('edit')" v-if="activeKey === 'handled'">{{ t('dict.CommonCol.modify') }}</a-button>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #record="{ row }">
            <div v-auth="'btn_detail'" class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <TransferModal @register="registerTransferModal" @reload="reload" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed } from 'vue';
  import { getShipmentOnline, transfer, maintenanceCqeExportData, shipmentGetNodeList } from '/@/api/engineering/clientRollout';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, getFormSchema, getExportColumn } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { message } from 'ant-design-vue';
  import { TransferModal, NodeModal } from '/@/components/CustomComponents';

  const { t } = useI18n();

  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const status = computed(() => {
    return props.activeKey === 'pending' ? 3 : 4;
  });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const [Grid, { reload, getSelectRows, getFetchParams, getSelectRowKeys, clearSelectedRowKeys }] = useVbenVxeGrid({
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
        moduleCode: 'NpiShipmentOnlineColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: props.activeKey === 'pending' ? 'engineering-clientRollout-clientLaunchData-list-wait' : 'engineering-clientRollout-clientLaunchData-list-done',
      columns: getColumn(),
      api: getShipmentOnline,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'NpiShipmentOnlineColumn',
      },
      // 当数据源被更改时，自动将纵向滚动条滚动到顶部
      virtualYConfig: {
        scrollToTopOnChange: true,
      },
      beforeFetch: params => {
        return {
          ...params,
          identification: status.value,
        };
      },
    },
  });

  const emits = defineEmits(['entryFn']);
  // 录入
  const entryFn = type => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    emits('entryFn', type, list);
  };

  // 查看节点记录
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: shipmentGetNodeList,
      id: record.id,
    });
  }

  // 转办
  const handleBatchTransfer = async () => {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('dict.CheckDataTip'));
    }
    openTransferModal(true, {
      id: ids || [],
      submitCallback: handleTransferCB,
    });
  };

  const handleTransferCB = async params => {
    const r = await transfer({
      ids: params.id,
      transferUserId: params.transferUser,
      transferUserName: params.transferUserInfo.fullName,
      transferRemarks: params.remark,
    });
    return r;
  };

  // 批量导出
  const handleExport = async () => {
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
        identification: status.value,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    maintenanceCqeExportData(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  defineExpose({ reload });
</script>
