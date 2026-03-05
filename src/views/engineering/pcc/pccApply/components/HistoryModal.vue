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
    <div style="height: 500px">
      <Grid></Grid>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive, ref, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { historyQuota, DocTypes } from '/@/api/engineering/pcc';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';

  const { createConfirm, createMessage } = useMessage();
  const baseStore = useBaseStore();
  const { t } = useI18n();
  const emit = defineEmits(['submit', 'register']);

  const state = reactive<{
    menuDocType: DocTypes;
  }>({
    menuDocType: 'PCC',
  });

  const columns = [
    {
      type: 'radio',
      field: 'radio',
      width: 35,
    },
    {
      title: '工程资料类型',
      field: 'docTypeName',
      width: 120,
    },
    {
      title: '需求类型',
      field: 'demandType',
      width: 120,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    {
      title: '版本',
      field: 'version',
      width: 80,
      formatter: ({ cellValue, row }) => {
        // 仅展示pcc的版本
        return row.docType == 1 && (cellValue || cellValue === 0) ? `T${cellValue}` : '';
      },
    },
    { title: 'PD', field: 'pdName', width: 180, i18nField: 'pd' },
    {
      title: '制作时间',
      field: 'createTime',
      width: 150,
      i18nField: 'makeTime',
      formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    },
  ];
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: [
        {
          fieldName: 'insidePartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: t('dict.CommonCol.insidePartNumber'),
          },
        },
        {
          fieldName: 'demandType',
          label: '',
          component: 'ApiSelect',
          componentProps: {
            placeholder: t('dict.CommonCol.demandType'),
            api: () => baseStore.getDictionaryData('DemandTypeEnum'),
            labelField: 'fullName',
            valueField: 'enCode',
            showSearch: false,
            resultField: '',
            immediate: true,
          },
        },
        {
          fieldName: 'docType',
          label: '',
          component: 'Select',
          componentProps: {
            placeholder: t('dict.CommonCol.docTypeName'),
            options: [
              {
                label: 'PCC',
                value: 'PCC',
              },
              {
                label: '量试订单评审',
                value: 'EngineeringInformation',
              },
              {
                label: '工程报价',
                value: 'Quotation',
              },
            ],
          },
        },
        {
          fieldName: 'rangTime',
          label: '',
          component: 'RangePicker',
        },
        {
          fieldName: 'pdName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: 'PD',
          },
        },
        {
          fieldName: 'isStop',
          label: '',
          component: 'Select',
          defaultValue: 0,
          componentProps: {
            allowClear: true,
            options: [
              { label: t('common.yes'), value: 1 },
              { label: t('common.no'), value: 0 },
            ],
            placeholder: t('common.isStop'),
          },
        },
      ],
    },
    gridOptions: {
      api: historyQuota,
      beforeFetch: params => {
        const _params = {
          ...params,
          menuDocType: state.menuDocType,
        };
        if (params.rangTime) {
          _params.startTime = dayjs(params.rangTime[0]).format('YYYY/MM/DD');
          _params.endTime = dayjs(params.rangTime[1]).format('YYYY/MM/DD');
          delete _params.rangTime;
        }
        return _params;
      },
      columns,
      rowConfig: {
        keyField: 'docId',
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
      id: 'components-historyQuota-modal',
    },
  });

  const { reload } = gridApi;

  const [registerModal, { closeModal }] = useModalInner(init);

  function init(data: { menuDocType: DocTypes }) {
    if (data.menuDocType) {
      state.menuDocType = data.menuDocType;
    }
    // reload();
  }
  function handleSubmit() {
    const rows = gridApi.grid.getRadioRecord();
    if (rows) {
      // 提示用户将会覆盖当前信息
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.quotaTip'),
        onOk: () => {
          emit('submit', rows);
          closeModal();
        },
      });
    } else {
      createMessage.info(t('common.selectText'));
    }
  }
</script>
