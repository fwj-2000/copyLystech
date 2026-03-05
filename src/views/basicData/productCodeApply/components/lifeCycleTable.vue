<template>
  <Grid>
    <template #applyCode="{ row }">
      <span class="table-a" @click="showReport(row)">{{ row.applyCode }}</span>
    </template>
    <template #action="{ row }">
      <TableAction outside :actions="getTableActions(row)" />
    </template>
  </Grid>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getLifeCycleList } from '/@/api/basicData/productCodeApply';
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProductCodeLifyCycleStore } from '/@/store/modules/productCodeLifeCycle';

  import { TableAction } from '/@/components/Table';

  const props = defineProps({
    type: {
      // 1: 报价需求, 2: 量试需求, 3: 图纸评审, 4: PCC, 5: ECN
      type: String as PropType<'1' | '2' | '3' | '4' | '5'>,
      default: '',
    },
    // 产品内部料号
    InsidePartNumber: {
      type: String,
      default: '',
    },
  });

  const { t } = useI18n();

  const router = useRouter();

  const { setLifeCycleParam } = useProductCodeLifyCycleStore();

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      api: (params: any) =>
        getLifeCycleList({
          ...params,
          type: props.type,
          InsidePartNumber: props.InsidePartNumber,
        }),
      maxHeight: 600,
      height: '',
      minHeight: 450,
      // scrollY: {
      //   enabled: false,
      // },
      columns: [
        {
          field: 'seq',
          title: t('component.table.index'),
          type: 'seq',
          width: '50',
          align: 'center',
        },
        // 申请单号
        {
          field: 'applyCode',
          title: t('dict.CommonCol.applyNo'),
          slots: {
            default: 'applyCode',
          },
        },
        // 申请人
        {
          field: 'applyUserName',
          title: t('dict.CommonCol.applyUser'),
        },
        // 申请时间
        {
          field: 'applyDate',
          title: t('dict.CommonCol.applyTime'),
          cellRender: {
            name: 'Date',
            // @ts-ignore
            format: 'YYYY-MM-DD HH:mm:ss',
          },
        },
        // 操作行
        {
          title: t('common.action'),
          width: '60',
          field: 'action',
          fixed: 'right',
          slots: {
            default: 'action',
          },
        },
      ],
      toolbarConfig: {
        enabled: false,
      },
    },
  });

  const getTableActions = (row: any) => {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: showReport.bind(null, row),
      },
    ];
  };

  const routeMap = {
    '1': '/business/report/quotation',
    '2': {
      BusinessSamples: '/business/report/samples',
      EngineeringSamples: '/business/report/engineeringSamples',
      Quantitative: '/business/report/quantitativeApply',
    },
    '3': '/engineering/drawing/reviewInquiry',
    '4': '/engineering/PCCBeta/PCCReview',
    '5': '/engineering/ecn/ecnReport',
  };

  const reportPath = computed(() => {
    return routeMap[props.type] || '';
  });

  function showReport(row: any) {
    let path = '';
    if (props.type === '2') {
      path = reportPath.value[row.demandType] || reportPath.value['Quantitative'] || '';
    } else {
      path = reportPath.value as string;
    }

    if (!path) {
      return false;
    }
    setLifeCycleParam(path, { insidePartNumber: props.InsidePartNumber, applyCode: row.applyCode });
    router.push(path);
  }

  onMounted(() => {
    gridApi.reload();
  });
</script>

<style scoped lang="less">
  :deep(div.vxe-grid) {
    padding: 0;
  }

  :deep(div.vxe-grid--layout-body-wrapper) {
    padding-left: 0;
    padding-right: 0;
  }
</style>
