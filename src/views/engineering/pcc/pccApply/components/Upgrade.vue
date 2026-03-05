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
    <!--    <BasicTable @register="registerTable"> </BasicTable>-->
    <div style="height: 500px">
      <Grid>
        <template #desensitizedDrawingsName="{ row }">
          <div class="table-a" @dblclick="handlePreview(row)">
            {{ row.desensitizedDrawingsName }}
          </div>
        </template>
      </Grid>
    </div>
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
  import { confirmUpgradeVersion, getPccHandledPage, getPccTomake, postConvertHistoryData } from '/@/api/engineering/pcc';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { isNullOrUnDef } from '/@/utils/is';

  const baseStore = useBaseStore();
  const filePreviewRef = ref<any | null>(null);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register', 'openAttachUpload']);

  const columns = [
    {
      type: 'radio',
      field: 'radio',
      width: 35,
    },
    // 来源单号
    { title: t('dict.CustomsAffairsReportColumn.quantitativeApplyNo'), field: 'originCode', width: 220 },
    // 产品内部料号
    { title: t('dict.CommonCol.insidePartNumber'), field: 'insidePartNumber', width: 220 },
    {
      title: t('dict.PCCColumn.demandTypeName'),
      field: 'demandTypeName',
      width: 180,
    },
    {
      title: t('component.upload.version'),
      field: 'version',
      width: 80,
      formatter: ({ cellValue }) => {
        if (isNullOrUnDef(cellValue)) {
          return '/';
        } else {
          return `T${cellValue}`;
        }
      },
    },
    { title: t('dict.CommonCol.insidePartNumber'), field: 'insidePartNumber', width: 220 },
    { title: 'PD', field: 'applyUserName', width: 180 },
    // 脱敏图纸
    {
      title: t('dict.MoldApplyColumn.drawingshistory'),
      field: 'desensitizedDrawingsName',
      width: 220,
      slots: { default: 'desensitizedDrawingsName' },
    },
  ];

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  // const [registerTable, { getForm, getSelectRows, clearSelectedRowKeys }] = useTable({
  //   api: getPccHandledPage,
  //   columns,
  //   rowKey: 'id',
  //   useSearchForm: true,
  //   formConfig: getFormConfig(),
  //   showTableSetting: false,
  //   rowSelection: { type: 'radio' },
  //   isCanResizeParent: false,
  //   canResize: true,
  //   resizeHeightOffset: -70,
  //   scroll: {
  //     y: 430,
  //   },
  //   clickToRowSelect: true,
  // });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: getFormConfig(),
    },
    gridOptions: {
      api: getPccHandledPage,
      columns,
      rowConfig: {
        keyField: 'id',
      },
      height: 'auto',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CommonCol',
      },
      toolbarConfig: {
        enabled: false,
      },
      position: 'modal',
      id: 'components-upgrade-modal',
    },
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
  // function handleAttachUpload() {
  //   const rows = gridApi.grid.getRadioRecord();
  //   if (rows.length <= 0) {
  //     // 请选择要上传附件的数据
  //     return createMessage.warning(t('dict.DrawingsReviewColumn.selectDataToUploadAttachment'));
  //   }
  //   closeModal();
  //   emit('openAttachUpload', rows);
  //   gridApi.clearSelectedRowKeys();
  // }
  function getFormConfig(): Partial<FormProps> {
    return [
      {
        fieldName: 'InsidePartNumber',
        label: '',
        component: 'Input',
        componentProps: {
          // 产品内部料号
          placeholder: t('dict.CommonCol.insidePartNumber'),
        },
      },
      {
        fieldName: 'originCode',
        label: '',
        component: 'Input',
        componentProps: {
          // 来源单号
          placeholder: t('dict.CustomsAffairsReportColumn.quantitativeApplyNo'),
        },
      },
      {
        fieldName: 'demandType',
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
    ];
  }
  function init() {
    console.log('init');
    changeLoading(false);
    changeOkLoading(false);
  }
  async function handleSubmit() {
    const row = gridApi.grid.getRadioRecord();
    if (!row) return createMessage.warning(t('dict.PCCApplyColumn.selectDataForVersionUpgrade'));
    changeLoading(true);
    changeOkLoading(true);
    confirmUpgradeVersion({
      id: row.id,
    })
      .then(({ code, data, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          emit('submit', data);
          closeModal();
        }
      })
      .catch(() => {
        changeLoading(false);
        changeOkLoading(false);
      });
  }
</script>
