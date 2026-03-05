<template>
  <BasicModal
    :width="1000"
    v-bind="$attrs"
    @register="registerModal"
    canFullscreen
    draggable
    :title="t('component.lydc.popupSelect.modalTitle')"
    :showOkBtn="hasBtnP('btn_edit')"
    @ok="handleSubmit"
    destroy-on-close>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
        <a-button v-auth="'btn_attach'" @click="handleAttachUpload">{{ t('dict.DrawingsReviewColumn.attachmentUpload') }}</a-button>
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex === 'originCode'">
          {{ text }}
          <a-tag color="success" v-if="record.originType == '1'">
            {{ record.demandType || t('dict.FQC.ProduceType.1') }}
          </a-tag>
          <a-tag color="warning" v-if="record.originType == '2'">{{ record.demandType }}</a-tag>
          <a-tag color="processing" v-if="record.originType == '3'">{{ record.demandType }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'desensitizedDrawingsName'">
          <a-button @click.stop="handlePreview(record)" type="link">{{ text }}</a-button>
        </template>
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

  const filePreviewRef = ref<any | null>(null);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register', 'openAttachUpload']);

  const columns: BasicColumn[] = [
    { title: t('dict.FilingsApplyColumn.QuantitativeApplyNo'), dataIndex: 'originCode', width: 280 },
    { title: t('dict.CommonCol.insidePartNumber'), dataIndex: 'insidePartNumber', width: 220 },
    { title: t('dict.SalesForecastColumn.handlerName'), dataIndex: 'handlerName', width: 140 },
    { title: t('dict.MoldApplyColumn.drawingshistory'), dataIndex: 'desensitizedDrawingsName', width: 220 },
  ];

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();

  const [registerTable, { getForm, getSelectRows, clearSelectedRowKeys, reload }] = useTable({
    api: getDrawingsReviewUnreviewedList,
    columns,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    // immediate: false,
    rowSelection: { type: 'checkbox' },
    isCanResizeParent: false,
    canResize: true,
    resizeHeightOffset: -70,
    scroll: {
      y: 430,
    },
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
      return createMessage.warning(t('dict.DrawingsReviewColumn.selectDataToUploadAttachment'));
    }
    closeModal();
    emit('openAttachUpload', rows);
    clearSelectedRowKeys();
  }

  function handleTransfer(id = '') {
    const idList = getSelectRows();
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
            placeholder: t('dict.CommonCol.insidePartNumber'),
          },
        },
        {
          field: 'originCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
          },
        },
        {
          field: 'originType',
          label: '',
          component: 'Select',
          componentProps: {
            placeholder: t('dict.SourceType'),
            options: [
              {
                fullName: t('dict.CurrentStageEnum.Quantitative'),
                id: '1',
              },
              {
                fullName: t('dict.Quotation.ConfirmOriginType.1'),
                id: '2',
              },
              {
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
