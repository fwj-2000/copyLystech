<template>
  <GridDone>
    <template #toolbar-actions>
      <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
    </template>
    <template #nodeDetail="{ row }">
      <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
    </template>
  </GridDone>
  <NodeModal @register="registerNodeModal"></NodeModal>
  <ExportModal @register="registerExportModal" />
</template>
<script lang="ts" setup>
  // import { ActionItem, TableAction } from '/@/components/Table';
  import { schemaLists, toBackColumns } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getUseBackList, exportExcel, getNodeList } from '/@/api/productionDeal/moIdUseBack';
  import { useModal } from '/@/components/Modal';
  import { NodeModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  // import { useRoute } from 'vue-router';
  // import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';

  defineOptions({ name: 'warehouse-mouldBusiness-useBack' });
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const props = defineProps({
    idKey: {
      type: String,
      default: '4',
    },
  });
  const tableConfig: any = {
    api: getUseBackList,
    beforeFetch: params => {
      params.identification = props.idKey;
      return params;
    },
    showIndexColumn: true,
    i18nConfig: {
      moduleCode: 'MoldReceiveRefundColumn',
    },
  };
  const formConfig = {
    commonConfig: {
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-1',
    schema: schemaLists,
    // i18nConfig: {
    //   moduleCode: 'MoldReceiveRefundColumn',
    //   transferRange: ['placeholder'],
    // },
  };
  const [GridDone, { getFetchParams }] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'warehouse-mouldBusiness-useBack-done',
      columns: toBackColumns(),
      toolbarConfig: {
        superQuery: true,
      },
    },
  });

  // 查看详情
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }
  // 批量导出
  function handleExport() {
    openExportModal(true, {
      api: exportExcel,
      listQuery: {
        ...getFetchParams(),
        identification: props.idKey,
      },
      exportOptions: toBackColumns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldReceiveRefundColumn',
      },
    });
  }
</script>
