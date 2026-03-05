<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="false"
    :title="title"
    :destroy-on-close="true"
    style="position: relative; background-color: red"
    class="top-0"
    contentHeight="100%">
    <template #insertToolbar>
      <div class="toggle-current flex" v-if="state.auditList.length > 1">
        <a-button preIcon="icon-ym icon-ym-left" @click="handleChangePage('pre')" :disabled="state.currentIndex < 1"></a-button>
        <div class="state-box m-2">
          <span style="color: rgb(255 123 0 / var(--tw-bg-opacity))">{{ state.currentIndex + 1 }}</span> / {{ state.auditList.length }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="handleChangePage('next')" :disabled="state.currentIndex >= state.auditList.length - 1"></a-button>
      </div>
    </template>
    <div class="lydc-basic-cell-content">
      <div style="height: 100%; overflow: auto">
        <Subtitle :title="t('views.filings.filingsInfo')" class="mt-8px pl-12px pr-12px" style="padding-bottom: 8px" :extra="{ show: false, hideAdd: true }" />
        <BasicForm @register="registerExportMainlandForm"> </BasicForm>

        <Subtitle :title="t('dict.filings.produceImage')" class="mt-8px pl-12px pr-12px" style="padding-bottom: 8px" :extra="{ show: false, hideAdd: true }" />
        <div>
          <Grid>
            <template #file="{ row }">
              <span class="table-a" @click="handlePreview(row)">{{ row.fileName }}</span>
            </template>
            <template #action="{ row }">
              <TableAction :outside="true" :actions="getTableActions(row)" />
            </template>
          </Grid>
        </div>
      </div>
      <div class="lydc-basic-cell-footer">
        <div class="flex" v-if="auditable">
          <lydc-radio class="flex" v-model:value="state.formConf.auditStatus" :options="auditStatusOptions" />
          <div class="whitespace-nowrap" :class="{ required: state.formConf.auditStatus === 0 }">{{ t('dict.CommonCol.remark') }}：</div>
          <lydc-input v-model:value="state.formConf.remark" style="width: 300px"></lydc-input>
        </div>
        <div v-if="auditable">
          <a-button @click="handleClose">{{ t('common.cancelText') }}</a-button>
          <a-button v-auth="'btn_review'" @click="handleAudit" type="primary" class="ml-8px">{{ t('common.submit') }}</a-button>
        </div>
      </div>
    </div>

    <!-- 文件预览 -->
    <PreviewModal ref="filePreviewRef" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import type { ActionItem } from '/@/components/Table';

  import { reactive, toRefs, computed, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getUnMakeDetail, review } from '/@/api/logisticAffairs/customsAffairsMake';
  import { fieldConfigMap } from './ApplyPopConfig';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getImageTableColumns } from './DetailPopConfig';
  import { downloadByUrl } from '/@/utils/file/download';
  import { TableAction } from '/@/components/Table';
  import { PreviewModal } from '/@/components/Upload';

  const { createMessage } = useMessage();

  const emits = defineEmits(['register', 'refresh', 'reload']);

  interface State {
    type: 'audit' | 'view';
    title: string;
    formConf: any;
    auditList: any[];
    currentIndex: number;
    currentId: string;
    customerColumns: any[];
    customerConfigId: '';
    customerInfo: any;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    type: 'view',
    title: '',
    formConf: {
      auditStatus: 1,
      remark: '',
    },
    auditList: [],
    currentIndex: 0,
    currentId: '',
    customerColumns: [],
    customerConfigId: '',
    customerInfo: {},
  });
  const { title } = toRefs(state);

  const auditStatusOptions = [
    { id: 1, fullName: t('common.passThroughText') },
    { id: 0, fullName: t('common.notPassThroughText') },
  ];

  const auditable = computed(() => {
    return state.type == 'audit';
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerExportMainlandForm, { resetSchema, setFieldsValue: setBaseInfoFieldsValue }] = useForm({
    schemas: [],
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 4,
    },
    disabled: true,
    baseRowStyle: {
      'margin-left': '4px',
      'margin-right': '4px',
    },
    // i18nConfig: {
    //   moduleCode: 'FillingBillCustomerTemplate',
    //   transferRange: ['label', 'placeholder'],
    // },
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      height: -1,
      columns: getImageTableColumns() as any,
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: false,
      },
    },
  });

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        label: t('common.downloadText'),
        onClick: handleDownload.bind(null, row),
      },
    ];
  }

  function init(data: any) {
    state.title = data?.title || t('common.detailText');
    state.type = data?.type;
    state.auditList = data?.ids || [];
    state.currentId = state.auditList[0];
    state.currentIndex = 0;
    state.customerConfigId = data.customerConfigId || '';
    state.customerInfo = data?.customerInfo || {};

    state.formConf = {
      auditStatus: 1,
      remark: '',
    };
    getDetail();
  }

  function handleChangePage(type) {
    if (type == 'pre') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.currentId = state.auditList[state.currentIndex];
    getDetail();
  }

  const currentMoldeJsonList = ref<Array<any>>([]);
  const detailDataList = ref<Array<any>>([]);
  async function getDetail() {
    changeLoading(true);
    try {
      const res = await getUnMakeDetail({ ids: [state.currentId], customerConfigId: state.customerConfigId });
      if (res.code == 200) {
        const ls = [] as any;
        const { outputs, moldeJsonList } = res.data;
        currentMoldeJsonList.value = Array.isArray(moldeJsonList) ? moldeJsonList : [];
        detailDataList.value = Array.isArray(outputs) ? outputs : [];
        const formData: any = {};
        currentMoldeJsonList.value.forEach((el: any) => {
          const fieldConfig = fieldConfigMap[el.systemField];
          ls.push({
            label: el.translateField,
            field: el.jsonId,
            component: fieldConfig?.formComponentName || fieldConfig?.name || 'Input',
            componentProps: {
              ...fieldConfig?.props,
              ...(el?.moldeField.includes('Date') ? { format: 'YYYY-MM-DD HH:mm:ss' } : {}),
            },
            colProps: { span: fieldConfig?.span || 4 },
          });
        });
        state.customerColumns = ls;
        resetSchema(ls);

        const { infoJsonList, produceImgOutputs } = outputs?.[0] || { infoJsonList: [], produceImgOutputs: [] };
        (Array.isArray(infoJsonList) ? infoJsonList : []).forEach(item => {
          formData[item.jsonId] = item.value;
        });
        setBaseInfoFieldsValue(formData);
        gridApi.reloadData(produceImgOutputs);
      }
    } catch (error) {
      console.warn('🚀 ~ getDetail ~ error:', error);
      closePopup();
    }
    changeLoading(false);
  }

  function handleDownload(row: any) {
    downloadByUrl({ url: row.fileUrl });
  }

  const filePreviewRef = ref<any>(null);
  // 文件预览
  function handlePreview({ fileUrl, fileName }) {
    // 文件预览
    const params = {
      name: fileName,
      url: fileUrl,
    };
    filePreviewRef.value?.init(params);
  }

  function handleClose() {
    closePopup();
  }

  async function handleAudit() {
    try {
      if (state.formConf.auditStatus === 0 && !state.formConf.remark) {
        // 不通过 备注必填
        return createMessage.warning(t('common.remarksRequiredTip'));
      }

      changeLoading(true);
      const r = await review({
        id: state.currentId,
        reviewStatus: state.formConf.auditStatus,
        reviewRemarks: state.formConf.remark,
      });
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        if (state.auditList.length > 1) {
          handleChangePage('next');
        } else {
          closePopup();
          emits('reload');
        }
      }
      changeLoading(false);
    } catch (error) {
      changeLoading(false);
      throw error;
    }
  }
</script>

<style lang="less" scoped>
  .lydc-basic-popup {
    :deep(.scrollbar__view) {
      height: 100% !important;
      padding: 0 0 10px !important;
    }
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.lydc-basic-table) {
    height: calc(100% - 70px);
  }

  .lydc-basic-cell-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // position: relative;

    .lydc-basic-cell-footer {
      // position: fixed;
      bottom: 16px;
      right: 8px;
      padding: 16px 16px 6px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgb(0 0 0 / 6%);
    }
  }

  .required {
    position: relative;

    &::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ed6f6f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
</style>
