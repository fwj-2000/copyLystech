<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, schema } from './config';
  import { getRemainingMaterial, exportRemainingMaterialExcel } from '/@/api/mps/productionPlan/surplusMaterial';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ExportModal from '/@/components/ExportModal/index.vue';

  defineOptions({ name: 'productionPlan-surplusMaterial' });

  const { t } = useI18n();

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      // i18nConfig: {
      //   moduleCode: ' ',
      //   transferRange: ['placeholder'],
      // },
      schema: schema,
    },
    gridOptions: {
      id: 'productionPlan-surplusMaterial-list',
      columns,
      api: getRemainingMaterial,
      keyboardConfig: {
        isBack: false,
      },
    },
  });

  async function handleExport() {
    const params = await gridApi.getFetchParams();

    openExportModal(true, {
      listQuery: params,
      api: exportRemainingMaterialExcel,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
    });
  }
</script>
