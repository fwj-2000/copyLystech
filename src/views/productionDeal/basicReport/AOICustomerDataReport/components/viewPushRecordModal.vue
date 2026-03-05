<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.viewPushRecords')" :showOkBtn="false" width="800px">
    <Grid></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { datatransferrecord } from '/@/api/productionDeal/AOICustomerDataReport';
  import { pushRecordColumn } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register']);

  const { t } = useI18n();

  const [registerModal] = useModalInner(init);

  const [Grid, { reload }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-basicReport-AOICustomerDataReport-pushRecoed-list',
      columns: pushRecordColumn,
      showIndexColumn: true,
      api: datatransferrecord,
      height: 500,
      beforeFetch: params => {
        return {
          ...params,
          billId: billId.value,
        };
      },
    },
  });

  const billId = ref('');

  async function init(data) {
    billId.value = data.id;
    reload();
  }
</script>
