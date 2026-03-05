<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 维护 -->
              <a-button v-auth="'btn_maintain'" type="primary" @click="maintainCQE('add')" v-if="activeKey === 'pending'">{{
                t('dict.CommonCol.maintenance')
              }}</a-button>
              <!-- 同步数据 -->
              <a-button v-auth="'btn_syncData'" type="primary" ghost @click="handleSyncData" v-if="activeKey === 'pending'">{{
                t('dict.CommonCol.synchronizeData')
              }}</a-button>

              <!-- 同步产品阶段 -->
              <a-button v-auth="'btn_syncProductStage'" @click="handleSyncProductStage" v-if="activeKey === 'pending'">{{
                t('dict.CommonCol.synchronizeProductPhase')
              }}</a-button>
              <!-- 修改 -->
              <a-button v-auth="'btn_edit'" type="primary" @click="maintainCQE('edit')" v-if="activeKey === 'handled'">{{ t('common.modify') }}</a-button>
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
    <NodeModal @register="registerNodeModal"></NodeModal>
    <SyncDataModal @register="registerSyncData" @reload="reload"> </SyncDataModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, getFormSchema, getExportColumn } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { message } from 'ant-design-vue';
  import {
    getShipmentOnline,
    syncData,
    maintenanceCqeExportData,
    shipmentWithdraw,
    shipmentGetNodeList,
    syncProductStage,
  } from '/@/api/engineering/clientRollout';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { NodeModal } from '/@/components/CustomComponents';
  import SyncDataModal from './components/SyncDataModal.vue';

  const { t } = useI18n();
  const { createConfirm } = useMessage();

  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const status = computed(() => {
    return props.activeKey === 'pending' ? 1 : 2;
  });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerSyncData, { openModal: openSyncData }] = useModal();

  const [Grid, { reload, getSelectRows, getFetchParams, getSelectRowKeys }] = useVbenVxeGrid({
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
      wrapperClass: 'grid grid-cols-7 gap-4',
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'NpiShipmentOnlineColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: props.activeKey === 'pending' ? 'engineering-clientRollout-shipmentData-wait' : 'engineering-clientRollout-shipmentData-done',
      columns: getColumn(props.activeKey),
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

  // 查看节点记录
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: shipmentGetNodeList,
      id: record.id,
    });
  }

  // 同步数据
  const handleSyncData = () => {
    // createConfirm({
    //   iconType: 'warning',
    //   title: t('common.tipTitle'),
    //   content: t('dict.CommonCol.performSynchronousData'),
    //   onOk: async () => {
    //     const res = await syncData();
    //     if (res.code === 200) {
    //       reload();
    //     }
    //   },
    // });
    openSyncData(true, {});
  };

  // 同步产品阶段
  const handleSyncProductStage = () => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.syncProductStageTip'),
      onOk: async () => {
        const res = await syncProductStage();
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 撤回
  const handelWithdraw = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchRecallTip'),
      onOk: async () => {
        const res = await shipmentWithdraw(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  const emits = defineEmits(['maintainCQE']);
  // 维护CQE
  const maintainCQE = type => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    emits('maintainCQE', type, list);
  };

  // 批量导出
  const handleExport = async () => {
    const exportColumns = getExportColumn().filter(item => item.field !== 'currentNodeName' && item.field !== 'record');
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
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
