<template>
  <BasicPopup
    v-bind="$attrs"
    :title="t('common.detailText')"
    showOkBtn
    :okText="t('common.submitText')"
    :okButtonProps="{ class: 'my-12px mr-12px' }"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'my-12px mr-12px' }"
    destroyOnClose
    class="full-popup"
    :closeFunc="beforeClosePopup"
    @register="registerPopup"
    @ok="handleSubmit">
    <template #centerToolbar>
      <a-button type="primary" ghost @click="() => handleSubmit(true)" class="my-12px">{{ t('common.temporarySave') }}</a-button>
    </template>
    <Subtitle :title="t('routes.business-salesForecast-requirement')" class="p-4 !pb-0" />
    <div style="height: calc(100% - 50px)">
      <VxeBasicTable ref="tableRef" v-bind="gridOptions" :tableStyle="{ width: '100%' }" />
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';

  import { ref, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { detailColumns } from './config';
  import { getDynamicsTableColumn, MODULE_TYPE_ENUM } from '/@/views/business/salesForecast/config';
  import { getSalesForecastByBatchCode, getSalesForecastByIds, temporarySaveSalesForecast } from '/@/api/business/salesForecast';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { VxeBasicTable } from '/@/components/VxeTable';

  type InitPrarams = { batchCode?: string; selectedIds?: Array<string>; mainProcess: string | number };

  const tableRef = ref<VxeGridInstance>();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const emits = defineEmits(['reload']);

  const gridOptions = reactive<BasicTableProps>({
    keepSource: true,
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
    editConfig: {
      enabled: true,
      trigger: 'click',
      mode: 'row',
    },
    toolbarConfig: {
      enabled: false,
    },
    pagerConfig: {
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
      multiple: true, // 是否启用多区域选取功能
    },
    clipConfig: {
      isPaste: true,
      // afterPasteMethod: handleAfterPaster,
    },
    keyboardConfig: {
      isClip: true, // 是否开启复制粘贴
      isEdit: true, // 是否开启任意键进入编辑（功能键除外）
      isDel: true, // 是否开启删除键功能
      isEsc: true, // 是否开启Esc键关闭编辑功能
    },
  });

  async function init(data: InitPrarams) {
    changeLoading(true);
    await getTableData(data);
    changeLoading(false);
  }

  /**
   * @description 提交
   * @param isStorage 是否暂存
   */
  async function handleSubmit(isStorage = false) {
    const newTableData = tableRef.value?.getTableData()?.fullData || [];

    changeLoading(true);
    return temporarySaveSalesForecast(newTableData, !isStorage)
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

  async function getTableData(data: InitPrarams): Promise<any[]> {
    let api: Promise<any> | null = null;

    if (data.batchCode) {
      api = getSalesForecastByBatchCode(MODULE_TYPE_ENUM.草稿, {
        batchCode: data.batchCode,
        mainProcess: data.mainProcess,
        status: '',
      });
    } else if (data.selectedIds) {
      api = getSalesForecastByIds(data.selectedIds);
    }

    if (!api) {
      return [];
    }

    const res = await api;
    const tableData = res.data ?? [{}];

    if (tableRef.value) {
      tableRef.value.reloadColumn([...detailColumns, ...getDynamicsTableColumn(tableData, true)]);
      tableRef.value.reloadData(tableData);
    }

    return tableData;
  }

  /**
   * @description 弹窗关闭前操作，如果返回 `true` 则关闭弹窗，返回 `false` 则不关闭弹窗
   */
  function beforeClosePopup() {
    const isModified = (tableRef.value?.getUpdateRecords() || []).length > 0;

    return new Promise((resolve, reject) => {
      isModified
        ? createConfirm({
            iconType: 'warning',
            title: t('common.tipTitle'),
            content: t('dict.SalesForecast.exitWithoutSavingTip'),
            onOk: () => {
              resolve(true);
              return Promise.resolve();
            },
            onCancel: () => {
              reject(false);
            },
          })
        : resolve(true);
    });
  }
</script>
