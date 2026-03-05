<template>
  <BasicModal :width="1000" v-bind="$attrs" @register="registerModal" canFullscreen draggable title="引用历史记录" @ok="handleSubmit" destroy-on-close>
    <BasicTable @register="registerTable"></BasicTable>
    <Preview ref="filePreviewRef" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, FormProps, useTable } from '/@/components/Table';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { ref, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getPccHandledPage, getPccTomake } from '/@/api/engineering/pcc';
  import { useBaseStore } from '/@/store/modules/base';
  import { getUseHistory } from '/@/api/engineering/engineeringReview';

  const baseStore = useBaseStore();
  const filePreviewRef = ref<any | null>(null);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register', 'openAttachUpload']);

  const columns: BasicColumn[] = [
    // 需求类型
    {
      title: t('dict.PCCColumn.demandTypeName'),
      dataIndex: 'demandTypeName',
      width: 180,
    },
    {
      title: '图纸评审时间',
      dataIndex: 'reviewDate',
      width: 180,
      format: 'date|YYYY-MM-DD HH:mm:ss',
      // cellRender: {
      //   name: 'Date',
      //   format: 'YYYY-MM-DD HH:mm:ss',
      // },
    },
    // 产品内部料号
    { title: t('dict.CommonCol.insidePartNumber'), dataIndex: 'insidePartNumber', width: 220 },
    { title: 'PD', dataIndex: 'applyUserName', width: 180 },
    // 脱敏图纸
    // { title: t('dict.MoldApplyColumn.drawingshistory'), dataIndex: 'desensitizedDrawingsName', width: 220 },
  ];

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const [registerTable, { getForm, getSelectRows, clearSelectedRowKeys }] = useTable({
    api: getUseHistory,
    columns,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    rowSelection: { type: 'radio' },
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
      // 请选择要上传附件的数据
      return createMessage.warning(t('dict.DrawingsReviewColumn.selectDataToUploadAttachment'));
    }
    closeModal();
    emit('openAttachUpload', rows);
    clearSelectedRowKeys();
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      schemas: [
        {
          field: 'insidePartNumber',
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
          field: 'demandType',
          label: '',
          component: 'ApiSelect',
          componentProps: {
            // 来源类型
            placeholder: t('dict.CommonCol.demandTypeName'),
            api: () => baseStore.getDictionaryData('DemandTypeEnum'),
            showSearch: false,
            labelField: 'fullName',
            valueField: 'enCode',
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
