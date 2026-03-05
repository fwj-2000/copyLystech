<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="initData" @reset="initData" />
      </div>
      <div class="lydc-content-dashboard-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, schema } from './config';
  import { getPsTableData, exportExcel } from '/@/api/mps/productionPlan/psTableData';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { omit } from 'lodash-es';
  import ExportModal from '/@/components/ExportModal/index.vue';

  defineOptions({ name: 'productionPlan-main-psTableData' });

  const { hasBtnP } = usePermission();
  const { t } = useI18n();

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: schema,
    fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
  });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-psTableData-list',
      columns,
      api: getPsTableData,
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
        };
      },
    },
  });

  async function handleExport() {
    const params = await gridApi.getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total') },
      api: exportExcel,
      exportOptions: columns.slice(2).map(item => {
        return {
          ...item,
          title: item.title,
          dataIndex: item.field,
        };
      }),
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  }

  const initData = async () => {
    gridApi.reload();
  };

  onMounted(() => {
    initData();
  });
</script>
