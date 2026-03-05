<template>
  <BasicModal :width="1000" v-bind="$attrs" @register="registerModal" canFullscreen draggable title="选择数据" @ok="handleSubmit" destroy-on-close>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text, index }">
        <template v-if="column.key === 'desensitizedDrawingsName'">
          <a
            @click.stop="
              () => {
                filePreviewRef.init({
                  name: record.desensitizedDrawingsName,
                  Id: record.desensitizedDrawingsId,
                  previewType: 'localPreview',
                  noCache: false,
                  isCopy: 0,
                });
              }
            "
            >{{ record.desensitizedDrawingsName }}</a
          >
        </template>
      </template>
    </BasicTable>
    <Preview ref="filePreviewRef" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, FormProps, useTable } from '/@/components/Table';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { ref, unref, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getPccHandledPage, getPccTomake } from '/@/api/engineering/pcc';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';

  const state = reactive({
    InsidePartNumber: '',
  });
  const filePreviewRef = ref<any | null>(null);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register', 'openAttachUpload']);

  const columns: BasicColumn[] = [
    { title: '来源单号', dataIndex: 'originCode', width: 220 },
    { title: '产品内部料号', dataIndex: 'insidePartNumber', width: 220 },
    { title: '版本', dataIndex: 'version', width: 220 },
    { title: 'PD', dataIndex: 'applyUserName', width: 180 },
    { title: '脱敏图纸', dataIndex: 'desensitizedDrawingsName', width: 220 },
  ];

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const [registerTable, { getForm, getSelectRows, clearSelectedRowKeys, reload }] = useTable({
    api: getPccHandledPage,
    columns,
    rowKey: 'id',
    useSearchForm: false,
    immediate: false,
    formConfig: getFormConfig(),

    showTableSetting: false,
    beforeFetch: params => {
      params.InsidePartNumber = state.InsidePartNumber;
      console.log(params, 'params-------');
      return params;
    },
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
      return createMessage.warning('请选择要上传附件的数据');
    }
    closeModal();
    emit('openAttachUpload', rows);
    clearSelectedRowKeys();
  }
  function getFormConfig(): Partial<FormProps> {
    return {
      schemas: [
        {
          field: 'originCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '来源单号',
          },
        },
        {
          field: 'originType',
          label: '',
          component: 'Select',
          componentProps: {
            placeholder: '来源类型',
            options: [
              {
                fullName: '量试',
                id: '1',
              },
              {
                fullName: '报价',
                id: '2',
              },
              {
                fullName: '图纸评审',
                id: '3',
              },
            ],
          },
        },
      ],
    };
  }
  function init(data) {
    state.InsidePartNumber = data.InsidePartNumber;
    reload();
  }
  function handleSubmit() {
    const rows = getSelectRows();
    emit('submit', rows);
  }
</script>
