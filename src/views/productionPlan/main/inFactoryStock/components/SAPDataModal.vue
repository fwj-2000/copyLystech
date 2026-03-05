<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="同步SAP数据" @ok="handleSyncSAP" width="900px" destroyOnClose>
    <Grid> </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getSAPData } from '/@/api/mps/productionPlan/inFactoryStock';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const factoryAreaParam = ref('');
  const SAPDatalColumn = [
    {
      field: 'checkbox',
      type: 'checkbox',
      width: '50',
      align: 'center',
    },
    {
      title: '工厂',
      field: 'FactoryName',
    },
    {
      title: '物料编码',
      field: 'InsidePartNumber',
    },
    {
      title: '创建时间',
      field: 'CreatorTime',
      cellRender: {
        name: 'Date',
      },
    },
  ];
  const SAPFormSchema = [
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
      },
      defaultValue: [dayjs().subtract(3, 'month').startOf('day').valueOf(), dayjs().endOf('day').valueOf()],
    },
    {
      fieldName: 'InsidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '物料编码',
        allowClear: true,
      },
    },
  ];

  const [Grid, { reloadData }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnChange: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-3 gap-4',
      schema: SAPFormSchema,
      i18nConfig: {
        // moduleCode: 'InFactoryStockColumn',
        // transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionPlan-main-fedPlan-PODetailList',
      api: getSAPData,
      columns: SAPDatalColumn,
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        // moduleCode: 'InFactoryStockColumn',
      },
      position: 'modal',
      height: 400,
      beforeFetch: params => handleParams(params),
    },
  });

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  async function init({ factoryArea }) {
    reloadData([]);
    factoryAreaParam.value = factoryArea;
    // changeLoading(true);
    // const { code, data } = await getPODetail(row.id).finally(() => {
    //   changeLoading(false);
    // });
    // if (code === 200) {
    //   reloadData(data);
    // }
  }

  function handleParams(params) {
    if (params.pickerVal) {
      params.startDate = params.pickerVal[0];
      params.endDate = params.pickerVal[1];
      delete params.pickerVal;
    }
    params.factory = factoryAreaParam.value;
    return params;
  }

  async function handleSyncSAP() {
    console.log('同步SAP数据');
  }
</script>
<style scoped lang="less">
  :deep(.vxe-form) {
    padding: 0 0 10px !important;
  }
</style>
