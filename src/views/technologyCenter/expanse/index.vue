<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="handleApprove(-1)"> {{ t('dict.MaintenanceColumn.moldCodeMaintenance') }} </a-button>
            <a-button type="primary" ghost @click="handleModelChange"> {{ t('dict.MaintenanceColumn.moldUsageMaintenance') }} </a-button>
            <!--            <a-button @click="handleApprove(-1)"> {{ t('common.batchExport') }} </a-button>-->
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <MaintenanceApplyPop @register="registerApplyPop" @refresh="reload" />
    <modelDetail @register="registerDetail" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction } from '/@/components/Table';
  import { getFormConfig, getListColumns, getTableActions } from '/@/views/technologyCenter/expanse/CONFIG';
  import { getFactorymoldcodepurpose } from '/@/api/engineering/costCenter';
  import { formatTableDefaultText } from '/@/utils';
  import { reactive, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import MaintenanceApplyPop from './components/MaintenanceApplyPop.vue';
  import modelDetail from './components/modelDetail.vue';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';

  defineOptions({ name: `technologyCenter-expanse` });

  const inGroupSelecting = ref(false);

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const state = reactive({
    cacheList: [],
    index: 0,
  });

  const [registerApplyPop, { openPopup }] = usePopup();
  const [registerDetail, { openModal: openDetail }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'MaintenanceColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'technologyCenter-expanse-list',
      columns: getListColumns(),
      // rowConfig: { keyField: 'factoryCode' },
      showIndexColumn: true,
      useSearchForm: true,
      bordered: true,
      api: getFactorymoldcodepurpose,
      afterFetch: data => {
        state.cacheList = data;
      },
      tableSetting: {
        delStatus: true,
      },
      transformCellText: ({ text }) => {
        return formatTableDefaultText(text);
      },
      i18nConfig: {
        moduleCode: 'MaintenanceColumn',
      },
    },
    gridEvents: {
      checkboxChange: ({ $table, row, checked }) => {
        if (inGroupSelecting.value) return;
        inGroupSelecting.value = true;
        try {
          const code = row.factoryCode;
          if (!code) return;
          const { fullData = [] } = $table.getTableData?.() ?? {};
          const sameGroup = fullData.filter(r => r.factoryCode === code);
          $table.setCheckboxRow?.(sameGroup, checked);
        } finally {
          inGroupSelecting.value = false;
        }
      },
    },
  });
  const { reload, getSelectRows } = gridApi;

  function handleModelChange() {
    openDetail(true, {});
  }

  function handleApprove(index) {
    const factoryCodes = [...new Set(getSelectRows().map(item => item.factoryCode))];
    if (isEmpty(factoryCodes)) return createMessage.warning(t('common.checkOperationText'));
    openPopup(true, { factoryCodes: factoryCodes });
  }
</script>
