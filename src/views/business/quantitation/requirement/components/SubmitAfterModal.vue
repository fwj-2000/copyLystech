<template>
  <BasicModal
    v-bind="$attrs"
    :closable="false"
    @register="registerModal"
    canFullscreen
    draggable
    title="检测到以下料号有旧版需求，是否要终止旧版需求?"
    destroy-on-close
    :width="1000">
    <div style="height: 500px">
      <Grid />
    </div>
    <template #footer>
      <a-button key="back" @click="handleSubmit" type="primary" ghost>终止 </a-button>
      <a-button key="submit" type="primary" @click="handleCancel">取消 </a-button>
    </template>
  </BasicModal>
  <StopModal @register="registerStopModal" @reload="handleStopSuccess"></StopModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { Modal } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { canMakeECN, getPccTomake } from '/@/api/engineering/pcc';
  import { useRouter } from 'vue-router';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { bulkbacktermination } from '/@/api/business/quantitation';
  import { StopModal } from '/@/components/CustomComponents';

  const filePreviewRef = ref<any | null>(null);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register', 'close', 'reload']);

  const router = useRouter();

  const state = reactive({
    id: '',
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const [registerStopModal, { openModal: openStopModal }] = useModal();

  const [Grid, { reloadData, getSelectRowKeys }] = useVbenVxeGrid({
    gridOptions: {
      showIndexColumn: true,
      columns: [
        { type: 'checkbox', field: 'checkbox', width: 70 },
        {
          title: '申请单号',
          field: 'applyNo',
        },
        {
          title: '料号',
          field: 'innerMaterialNumber',
        },
        {
          title: '终端客户料号',
          field: 'terminalCustomerPartNumber',
        },
        {
          title: '终端料号版本',
          field: 'terminalCustomerPartVersion',
        },
        {
          title: '申请时间',
          field: 'applyDateTime',
        },
      ],
      pagerConfig: {
        enabled: false,
      },
    },
  });

  function init(data) {
    reloadData(data);
  }

  function handleStopSuccess() {
    createMessage.info({
      content: '数据已提交到后台终止中，请稍后刷新',
    });
    handleCancel();
  }

  function handleSubmit() {
    changeOkLoading(true);
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      changeOkLoading(false);
      return;
    }

    openStopModal(true, {
      idList,
      api: bulkbacktermination,
      beforeFetch: params => {
        return {
          ids: idList,
          terminationRemarks: params.remark,
        };
      },
    });
  }

  function handleCancel() {
    // emit('reload');
    closeModal();
    emit('close');
  }

  // function handleSubmit() {
  //   const rows = getSelectRows();
  //   emit("submit", rows);
  // }
</script>
