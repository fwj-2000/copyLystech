<template>
  <BasicModal
    :width="1000"
    v-bind="$attrs"
    @register="registerModal"
    canFullscreen
    draggable
    :title="t('component.lydc.popupSelect.modalTitle')"
    @ok="handleSubmit"
    destroy-on-close>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
      </template>
    </BasicTable>
    <Preview ref="filePreviewRef" />
    <TransferModal @register="registerTransferModal" @reload="reload" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, FormProps, useTable } from '/@/components/Table';
  import { getDrawingsReviewUnreviewedList, postDrawingsReviewTransfer } from '/@/api/engineering/drawingReview';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { ref, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TransferModal } from '/@/components/CustomComponents';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getPccTomake } from '/@/api/engineering/pcc';
  const { t } = useI18n();

  const filePreviewRef = ref<any | null>(null);
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register', 'openAttachUpload']);

  const columns: BasicColumn[] = [
    // 来源单号
    { title: t('dict.DrawingsReviewColumn.originCode'), dataIndex: 'originCode', width: 220 },
    // 产品内部料号
    { title: t('dict.CommonCol.insidePartNumber'), dataIndex: 'insidePartNumber', width: 220 },
    { title: 'PD', dataIndex: 'applyUserName', width: 140 },
    // 脱敏图纸
    { title: t('dict.MoldApplyColumn.drawingshistory'), dataIndex: 'desensitizedDrawingsName', width: 220 },
  ];

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();

  const [registerTable, { getForm, getSelectRows, clearSelectedRowKeys, reload }] = useTable({
    api: getPccTomake,
    columns,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    // immediate: false,
    rowSelection: { type: 'checkbox' },
    canResize: true,
    clickToRowSelect: true,
  });

  function handlePreview(record) {
    console.log(record.desensitizedDrawingsId);
    const params = {
      name: record.desensitizedDrawingsName,
      Id: record.desensitizedDrawingsId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }
  function handleAttachUpload() {
    const rows = getSelectRows();
    if (rows.length <= 0) {
      // 请选择要上传附件的数据
      return createMessage.warning(t('dict.DrawingsReviewColumn.selectDataToUploadAttachment'));
    }
    closeModal();
    emit('openAttachUpload', rows);
    clearSelectedRowKeys();
  }

  function handleTransfer(id = '') {
    const idList = getSelectRows();
    // 请选择转办内容
    if (!idList.length) return createMessage.warning(t('dict.PCCApplyColumn.selectTransferContent'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    const { id } = unref(data);
    const r = await postDrawingsReviewTransfer({
      list: id,
      remark: data.remark,
      reviewUserId: data.transferUser,
    });
    return r;
  };

  function getFormConfig(): Partial<FormProps> {
    return {
      schemas: [
        {
          field: 'InsidePartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            // 产品内部料号
            placeholder: t('dict.CommonCol.insidePartNumber'),
          },
        },
        {
          field: 'originCode',
          label: '',
          component: 'Input',
          componentProps: {
            // 来源单号
            placeholder: t('dict.CustomsAffairsReportColumn.quantitativeApplyNo'),
          },
        },
        {
          field: 'originType',
          label: '',
          component: 'Select',
          componentProps: {
            // 来源类型
            placeholder: t('dict.SourceType'),
            options: [
              {
                // 量试
                fullName: t('dict.MoldApply.ProjectPhase.2'),
                id: '1',
              },
              {
                // 报价
                fullName: t('dict.DrawingsReview.OriginType.2'),
                id: '2',
              },
              {
                // 图纸评审
                fullName: t('dict.DrawingsReviewColumn'),
                id: '3',
              },
            ],
          },
        },
      ],
    };
  }
  function init() {
    console.log('init');
  }
  function handleSubmit() {
    const rows = getSelectRows();
    emit('submit', rows);
  }
</script>
