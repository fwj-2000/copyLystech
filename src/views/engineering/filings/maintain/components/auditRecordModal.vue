<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :cancelText="t('common.closeText')"
    :show-ok-btn="false"
    :title="t('dict.CommonCol.auditRecord')"
    :width="1100"
    :minHeight="500"
    destroy-on-close>
    <Grid />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getReviewHistory } from '/@/api/business/filingLogReview';

  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();

  const state = reactive<{
    id: string;
    type: '1' | '2'; // 审批类型 `1`为`工程资料`,`2`为`生产资料`
  }>({
    id: '',
    type: '1',
  });

  enum REVIEW_STATUS_ENUM {
    通过 = 1,
    不通过 = 0,
  }

  /** 审批状态 */
  const reviewStatusOptions = [
    // 通过
    { id: REVIEW_STATUS_ENUM.通过, fullName: t('common.passThroughText'), theme: 'green' },
    // 不通过
    { id: REVIEW_STATUS_ENUM.不通过, fullName: t('common.notPassThroughText'), theme: 'red' },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      height: '500px',
      id: 'engineering-filings-maintain-auditRecord-table',
      columns: [
        {
          field: 'seq',
          title: t('component.table.index'),
          type: 'seq',
          width: '50',
          align: 'center',
        },
        {
          title: t('dict.CommonCol.category'),
          field: 'reviewType',
          width: 100,
          formatter: ({ cellValue }) => {
            return `${cellValue}` === '1' ? t('dict.CustomsAffairsReview.engineeringMaintenanceData') : t('dict.CustomsAffairsReview.productMaintenanceData');
          },
        },
        // 审核人
        {
          title: t('dict.CAApplyColumn.reviewUserName'),
          field: 'reviewUserName',
          width: 200,
        },
        // 审核时间
        {
          title: t('dict.CommonCol.auditTime'),
          field: 'reviewDate',
          width: 150,
          cellRender: {
            name: 'Date',
            // @ts-ignore
            format: 'YYYY-MM-DD HH:mm:ss',
          },
        },
        // 审批状态
        {
          title: t('dict.CommonCol.status'),
          field: 'reviewStatus',
          width: 100,
          cellRender: {
            name: 'Tag',
            options: reviewStatusOptions as any,
          },
        },
        // 审批备注
        {
          title: t('dict.CommonCol.remark'),
          field: 'reviewRemarks',
          minWidth: 200,
        },
      ],
      pagerConfig: {
        enabled: false,
        autoHidden: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    },
  });

  function getTableData() {
    gridApi.setLoading(true);
    getReviewHistory({ id: state.id, reviewType: state.type })
      .then(res => {
        gridApi.reloadData(res.data || []);
      })
      .finally(() => {
        gridApi.setLoading(false);
      });
  }

  const [registerModal] = useModalInner(init);
  function init(data: { id: string; type: '1' | '2' }) {
    state.id = data.id;
    state.type = data.type;
    getTableData();
  }
</script>
