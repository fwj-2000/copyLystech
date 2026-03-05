<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <TableLayout> </TableLayout>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, computed, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { humanMachineCqdetail } from '/@/api/dashbord/operate';
  import { columns } from './config.ts';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';

  const { getParams } = useRouteParams();

  defineOptions({ name: 'dashboard-operate-humanMachine' });

  const { t } = useI18n();

  const [TableLayout, gridApi] = useTableLayout({
    formConfig: {
      enabled: false,
    },
    tableConfig: {
      columns,
      attrs: {
        id: 'humanMachine-chuqing-list',
        toolbarConfig: {
          enabled: false,
        },
        rowClassName: ({ rowIndex }) => {
          return rowIndex % 2 === 0 ? 'bg-white' : 'bg-yellow';
        },
      },
      api: humanMachineCqdetail,
      getQueryExtraParams: () => {
        const params = getParams();
        return params;
      },
    },
  });
</script>
