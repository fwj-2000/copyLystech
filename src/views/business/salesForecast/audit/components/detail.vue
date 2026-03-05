<template>
  <BasicPopup
    v-bind="$attrs"
    :title="t('common.detailText')"
    :showOkBtn="isCanEdit"
    :okText="t('common.agree')"
    :okButtonProps="{ class: 'my-12px mx-12px' }"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'my-12px mx-12px' }"
    :cancelText="t('common.cancelText')"
    destroyOnClose
    class="full-popup"
    @register="registerPopup"
    @ok="handleSubmit">
    <template v-if="isCanEdit" #centerToolbar>
      <a-button type="primary" ghost @click="handleReject" class="my-12px">{{ t('common.rejectText') }}</a-button>
      <RejectModal @register="registerRejectModal" @reload="reload" />
    </template>

    <Subtitle :title="t('routes.business-salesForecast-audit')" class="p-4 !pb-0" />

    <div style="height: calc(100% - 50px)">
      <VxeBasicTable ref="tableRef" v-bind="gridOptions" :tableStyle="{ width: '100%' }" />
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';

  import { ref, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { detailColumns, STATUS_ENUM } from '../config';
  import { getDynamicsTableColumn, formatDateilListToShow, MODULE_TYPE_ENUM } from '/@/views/business/salesForecast/config';
  import { useModal } from '/@/components/Modal';
  import { getSalesForecastByBatchCode, getSalesForecastByIds, review, rejectSalesForecast } from '/@/api/business/salesForecast';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { VxeBasicTable } from '/@/components/VxeTable';
  import RejectModal from '/@/components/CustomComponents/src/RejectModal.vue';

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { t } = useI18n();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const { createMessage } = useMessage();
  const emits = defineEmits(['reload']);
  const isCanEdit = ref(true);
  const tableRef = ref<VxeGridInstance>();

  const gridOptions = reactive<BasicTableProps>({
    mouseConfig: {
      area: false, // 是否开启区域选取
      extension: false,
    },
    columnConfig: {
      resizable: true,
    },
    formConfig: {
      enabled: false,
    },
    height: 'auto',
    proxyConfig: {
      enabled: false,
    },
    pagerConfig: {
      enabled: false,
    },
    editConfig: {
      enabled: true,
      trigger: 'click',
      mode: 'row',
    },
    toolbarConfig: {
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
  });

  async function init(data: any) {
    changeLoading(true);
    isCanEdit.value = typeof data.isCanEdit === 'boolean' ? data.isCanEdit : false;
    await getTableData(data);
    changeLoading(false);
  }

  async function handleSubmit() {
    const tableData = tableRef.value?.getTableData()?.fullData || [];

    changeLoading(true);
    return review(tableData[0].batchCode, [...new Set(tableData.map(item => item.id))])
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

  async function getTableData(data: any): Promise<any[]> {
    let api: Promise<any> | null = null;

    if (data.batchCode) {
      api = getSalesForecastByBatchCode(MODULE_TYPE_ENUM.需求审核, {
        batchCode: data.batchCode,
        mainProcess: data.mainProcess,
        status: isCanEdit.value ? '' : STATUS_ENUM.同意,
      });
    } else if (data.selectedIds) {
      api = getSalesForecastByIds(data.selectedIds);
    }

    if (!api) {
      return [];
    }

    const res = await api;
    const tableData = formatDateilListToShow(res.data ?? [], 'computedDatas');

    if (tableRef.value) {
      tableRef.value.reloadColumn([...detailColumns, ...getDynamicsTableColumn(tableData, false, 'targetDatas')]);
      tableRef.value.reloadData(tableData);
    }

    return tableData;
  }

  function handleReject() {
    const tableData = tableRef.value?.getTableData()?.fullData || [];

    openRejectModal(true, {
      api: rejectSalesForecast,
      ids: tableData.map(item => item.id),
    });
  }

  function reload() {
    createMessage.success(t('common.operatorSuccess'));
    closePopup();
    emits('reload');
  }
</script>
