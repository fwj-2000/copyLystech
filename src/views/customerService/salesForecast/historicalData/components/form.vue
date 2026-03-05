<template>
  <BasicPopup
    v-bind="$attrs"
    :title="t('common.detailText')"
    :showOkBtn="isCanEdit"
    :okText="t('common.submitText')"
    destroyOnClose
    class="full-popup"
    @register="registerPopup"
    @ok="handleSubmit">
    <Subtitle :title="t('dict.SalesForecastHistory.userImport')" class="p-4 !pb-0" />

    <div style="height: calc(100% - 50px)">
      <VxeBasicTable ref="tableRef" v-bind="gridOptions" :tableStyle="{ width: '100%' }">
        <template #batchCode="{ row }">
          {{ row.batchCode }}
        </template>
      </VxeBasicTable>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';

  import { ref, computed, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { vxeTableColumns as columns, FORM_TYPE_ENUM, getDynamicsColumns, editRules } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getSalesForecastHistoryDetail, updateSalesForecastHistory } from '/@/api/customerSerivce/salesForecast';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { VxeBasicTable } from '/@/components/VxeTable';

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emits = defineEmits(['reload']);
  const tableRef = ref<VxeGridInstance>();
  const formType = ref<`${FORM_TYPE_ENUM}`>(FORM_TYPE_ENUM.详情);

  const isCanEdit = computed(() => {
    return formType.value !== FORM_TYPE_ENUM.详情;
  });

  const gridOptions = computed<BasicTableProps>(() => ({
    showFooter: true,
    height: 'auto',
    columns: columns.slice(1),
    columnConfig: {
      resizable: true,
    },
    formConfig: {
      enabled: false,
    },
    editConfig: {
      enabled: isCanEdit.value,
      trigger: 'click',
      mode: 'row',
    },
    editRules,
    toolbarConfig: {
      enabled: false,
    },
    proxyConfig: {
      enabled: false,
    },
    scrollY: {
      enabled: true,
      mode: 'wheel',
      gt: 0,
    },
    scrollX: {
      enabled: true,
      gt: 0,
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: isCanEdit.value, // 是否启用多区域选取功能
    },
    clipConfig: {
      isPaste: isCanEdit.value,
      // afterPasteMethod: handleAfterPaster,
    },
    keyboardConfig: {
      isClip: isCanEdit.value, // 是否开启复制粘贴
      isEdit: isCanEdit.value, // 是否开启任意键进入编辑（功能键除外）
      isDel: isCanEdit.value, // 是否开启删除键功能
      isEsc: isCanEdit.value, // 是否开启Esc键关闭编辑功能
    },
    pagerConfig: {
      enabled: false,
    },
  }));

  async function init(data: { batchCode: string; type: `${FORM_TYPE_ENUM}`; list: any[] }) {
    formType.value = data.type;
    if (data.batchCode) {
      getTableData(data);
      return;
    }
    nextTick(() => {
      tableRef.value && tableRef.value.reloadData(data.list || []);
      reloadColumns(data.list || []);
    });
  }

  async function handleSubmit() {
    if (await tableRef.value!.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    const data = tableRef.value!.getTableData().fullData;

    changeLoading(true);
    return updateSalesForecastHistory(data)
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
          closePopup();
          emits('reload');
        }
      })
      .catch(() => {})
      .finally(() => {
        changeLoading(false);
      });
  }

  async function getTableData(data: any) {
    const api = data.batchCode ? getSalesForecastHistoryDetail(data.batchCode) : null;
    if (!api) {
      return [];
    }
    changeLoading(true);
    return api
      .then(res => {
        if (tableRef.value) {
          tableRef.value.reloadData(res.data || []);
          reloadColumns(res?.data);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function reloadColumns(data: any) {
    nextTick(() => {
      Array.isArray(data) && data[0] && tableRef.value && tableRef.value.reloadColumn([...columns.slice(1), ...getDynamicsColumns(data[0].importDatas)]);
    });
  }
</script>

<style scoped lang="less">
  ::v-deep(.ant-form .ant-row.ant-form-item) {
    margin-bottom: 0;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
