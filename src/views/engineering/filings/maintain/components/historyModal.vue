<template>
  <BasicModal
    :width="1200"
    v-bind="$attrs"
    @register="registerModal"
    canFullscreen
    draggable
    :title="t('component.lydc.popupSelect.modalTitle')"
    @ok="handleSubmit"
    destroy-on-close>
    <div style="height: 500px">
      <Grid />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getHistoryPage } from '/@/api/engineering/customsAffairsEngineering';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { langList } from './ApplyPopConfig';

  import { BasicModal, useModalInner } from '/@/components/Modal';

  const { createConfirm, createMessage } = useMessage();
  const baseStore = useBaseStore();
  const { t } = useI18n();
  const emit = defineEmits(['submit', 'register']);

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: [
        // 产品内部料号
        {
          fieldName: 'insidePartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: t('dict.CommonCol.insidePartNumber'),
            allowClear: true,
          },
        },
        // 直接客户
        {
          fieldName: 'immediateCustomerName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: t('dict.CommonCol.directCustomer'),
            allowClear: true,
          },
        },
        // 产品类型
        {
          fieldName: 'productType',
          label: '',
          component: 'ApiSelect',
          componentProps: {
            placeholder: t('dict.CommonCol.productTypeName'),
            api: () => baseStore.getDictionaryData('CAEProductType'),
            allowClear: true,
            resultField: 'data',
            labelField: 'fullName',
            valueField: 'enCode',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
          },
        },
        // PD
        {
          fieldName: 'pdPersonId',
          label: '',
          component: 'CustomUserSelect',
          componentProps: {
            placeholder: 'PD',
          },
        },
      ],
    },
    gridOptions: {
      api: getHistoryPage,
      beforeFetch: (params: any) => {
        params.filingsLanguage = filingsLanguage.value;
        return params;
      },
      columns: [
        {
          type: 'radio',
          field: 'radio',
          width: 50,
        },
        {
          title: '语言',
          field: 'filingsLanguage',
          width: 80,
          formatter: ({ cellValue }) => {
            const target = langList.find(item => `${item.enCode}` === `${cellValue}`);
            return target?.fullName || cellValue || '';
          },
        },
        {
          title: '产品内部料号',
          field: 'insidePartNumber',
          width: 180,
          i18nField: 'CommonCol.insidePartNumber',
        },
        {
          title: '工厂',
          field: 'factory',
          width: 180,
          formatter: ({ row }) => [row.factory, row.factoryName].filter(Boolean).join(' / '),
        },
        {
          title: '产品类型',
          field: 'productType',
          width: 220,
          formatter: ({ cellValue, row }) => row.productTypeName || cellValue || '',
        },
        {
          title: '直接客户',
          field: 'immediateCustomerName',
          width: 220,
          i18nField: 'CommonCol.directCustomer',
        },
        { title: 'PD', field: 'pdPersonName', minWidth: 30 },
      ],
      height: 'auto',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
      position: 'modal',
    },
  });

  const [registerModal, { closeModal }] = useModalInner(init);

  const filingsLanguage = ref<string | number>('');

  function init(data: { filingsLanguage: string | number }) {
    filingsLanguage.value = data.filingsLanguage;
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
