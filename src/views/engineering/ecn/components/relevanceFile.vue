<template>
  <BasicModal
    :width="1000"
    v-bind="$attrs"
    :showOkBtn="mode === 'edit'"
    @register="registerModal"
    canFullscreen
    draggable
    :title="t('dict.ECNColumn.relatedDocuments')"
    @ok="handleSubmit"
    destroy-on-close>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ text, column, record, index }">
        <template v-if="column.key === 'relevanceFile'">
          <a-row :gutter="[10, 0]">
            <a-col :span="10">
              <a-select
                mode="multiple"
                v-model:value="record.relatedFilesList"
                :disabled="mode !== 'edit'"
                @change="
                  e => {
                    if (e.includes('10')) {
                      record.checkedOther = true;
                    } else {
                      record.checkedOther = false;
                    }
                  }
                ">
                <a-select-option v-for="item in documentTypeList" :key="item.enCode" :value="item.enCode">{{ item.fullName }} </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="10" style="align-items: center; display: flex">
              <a-checkbox :disabled="mode !== 'edit'" v-model:checked="record.checkedOther">{{ t('dict.IpqcMoldType.5') }}</a-checkbox>
              <a-input :disabled="mode !== 'edit'" v-if="record.checkedOther" :placeholder="t('common.inputPlaceholder')" v-model:value="record.otherVal" />
            </a-col>
          </a-row>
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, FormProps, useTable } from '/@/components/Table';
  import { reactive, ref, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { useBaseStore } from '/@/store/modules/base';

  const filePreviewRef = ref<any | null>(null);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register', 'openAttachUpload']);

  const columns: BasicColumn[] = [
    { title: t('dict.SalesForecastColumn.InsidePartNumber'), dataIndex: 'insidePartNumber', width: 120 },
    { title: t('dict.ECNColumn.relatedDocuments'), dataIndex: 'relevanceFile' },
  ];

  const state = reactive({
    documentTypeList: [],
    mode: '',
  });

  const { documentTypeList, mode } = toRefs(state);

  const baseStore = useBaseStore();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const [registerTable, { getForm, clearSelectedRowKeys, setTableData, getDataSource }] = useTable({
    columns,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    // afterFetch: data => {
    //   console.log(data);
    //   data.forEach(item => {
    //     item.checkedOther = false;
    //   });
    //   data[0].checkedOther = true;
    // },
    showTableSetting: false,
    isCanResizeParent: false,
    canResize: true,
    resizeHeightOffset: -70,
    showIndexColumn: false,
    scroll: {
      y: 430,
    },
    clickToRowSelect: true,
  });

  function handlePreview(record) {
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
          field: 'InsidePartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: t('dict.SalesForecastColumn.InsidePartNumber'),
          },
        },
      ],
    };
  }

  async function getTypeOps() {
    state.documentTypeList = await baseStore.getDictionaryData('ECN.DocumentType');
    console.log(state.documentTypeList);
  }

  function init(data) {
    console.log(data, 'relevanceFile init data');
    state.mode = data.mode;
    const partNumberList = data.pratNumber.map(item => {
      const target = {
        insidePartNumber: item.insidePartNumber,
      };
      console.log(item.relatedFilesList, 'item.relatedFilesList');
      if (!item.relatedFilesList) return target;
      target.relatedFilesList = item?.relatedFilesList?.map(v => v.key || v);
      const index = target.relatedFilesList.findIndex(item => item == 10);
      console.log(index);
      if (index != -1) {
        target.checkedOther = true;
        target.otherVal = item.relatedFilesList[index].value || item.otherVal;
      }
      return target;
    });
    getTypeOps();
    setTableData(partNumberList);
  }

  function handleSubmit() {
    const dataList = getDataSource();
    emit('submit', dataList);
  }
</script>
