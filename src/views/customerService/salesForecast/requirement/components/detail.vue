<template>
  <BasicPopup
    v-bind="$attrs"
    :title="t('common.detailText')"
    :showOkBtn="isCanEdit"
    :okText="t('common.submitText')"
    :cancelButtonProps="{ class: 'mr-12px' }"
    destroyOnClose
    class="full-popup"
    @register="registerPopup"
    @ok="handleSubmit">
    <template v-if="isCanEdit" #insertToolbar>
      <a-button @click="handleExport" class="mx-12px">
        {{ t('component.excel.exportModalTitle') }}
      </a-button>
      <!-- <a-button type="primary" ghost @click="() => handleSubmit(true)">{{ t('common.temporarySave') }}</a-button> -->
      <a-button @click="getComputedData">{{ t('common.calText') }}</a-button>
      <a-divider type="vertical" style="margin: 12px" />
    </template>

    <div class="flex flex-col flex-start h-[100%] w-[100%]">
      <Subtitle :title="t('routes.customerService-salesForecast-requirement')" class="p-4 !pb-0" />

      <div class="flex-1 w-[100%]">
        <VxeBasicTable ref="tableRef" v-bind="gridOptions" :tableStyle="{ width: '100%' }" style="justify-content: flex-start" />
      </div>

      <div v-if="isCanEdit" class="p-4 pt-0 w-[100%]">
        <BasicAudit ref="basicAuditRef" approver-type="WaitProductionDemand" class="w-[100%]"></BasicAudit>
      </div>

      <!-- <div class="p-4 pt-0 flex flex-start flex-wrap auditors">
        <a-button v-if="isCanEdit" type="primary" ghost @click="addAuditor"> {{ t('common.addApprover') }} </a-button>
        <div v-for="(_, index) in auditors" :key="index">
          <lydc-custom-user-select
            v-model:value="auditors[index]"
            :placeholder="t('common.approver')"
            :allowClear="true"
            show-search
            class="w-[150px]"
            :disabled="!isCanEdit" />
          <i v-if="index !== 0" class="icon-ym icon-ym-delete cursor-pointer pl-1" @click="() => deleteAuditors(index)" />
        </div>
      </div> -->
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';

  import { ref, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { detailColumns, STATUS_ENUM } from '../config';
  import { getSalesForecastByBatchCode, saveCsConfirm, computeSalesForecast, getSalesForecastByIds } from '/@/api/business/salesForecast';
  import { getDynamicsTableColumn, formatDateilListToShow, formatDateilListToSave, MODULE_TYPE_ENUM } from '/@/views/business/salesForecast/config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import * as XLSX from 'xlsx';
  import { get, omit } from 'lodash-es';

  import BasicAudit from '/@/components/CustomComponents/src/fc/BasicAudit.vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { VxeBasicTable } from '/@/components/VxeTable';

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { t } = useI18n();
  const emits = defineEmits(['reload']);
  const { createMessage } = useMessage();
  const basicAuditRef = ref<InstanceType<typeof BasicAudit>>();
  const tableRef = ref<VxeGridInstance>();

  const isCanEdit = ref(true);
  const auditors = ref<any[]>(['']);

  const gridOptions = computed<BasicTableProps>(() => ({
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
    maxHeight: '99%',
    proxyConfig: {
      enabled: false,
    },
    editConfig: {
      enabled: isCanEdit.value,
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
    cellClassName: ({ row }) => {
      return row.historyShippedQty ? '' : 'danger-cell';
    },
  }));

  async function init(data: any) {
    auditors.value = [''];
    // isComputed.value = false;
    isCanEdit.value = typeof data.isCanEdit === 'boolean' ? data.isCanEdit : false;
    getTableData(data);
  }

  async function handleSubmit(isStorage = false) {
    // if (!isComputed.value) {
    //   return createMessage.warning(t('dict.SalesForecast.mustBeCalcTip'));
    // }

    const tableData = tableRef.value?.getTableData().fullData || [];

    const api = isStorage ? () => Promise.resolve([]) : saveCsConfirm;

    const auditValue = basicAuditRef?.value?.getValues() ?? {};
    const res = await basicAuditRef?.value?.validateAll();
    if (res?.includes(false)) {
      return;
    }

    const { mainProcess, approverGroupId } = auditValue;
    const params = {
      approverId: approverGroupId,
      mainProcess,
      memberConfigs: Object.entries(omit(auditValue, ['mainProcess', 'approverGroupId'])).map(([key, value]) => ({
        configType: key,
        memberIds: value,
      })),
      list: formatDateilListToSave(tableData, 'computedDatas'),
    };

    changeLoading(true);
    return api(tableData[0].batchCode, params)
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

  // const contentKey = computed(() => {
  //   return isCanEdit.value ? 'covertedDatas' : 'computedDatas';
  // });
  async function getTableData(data: any) {
    let api: Nullable<Promise<any>> = null;
    if (data.batchCode) {
      api = getSalesForecastByBatchCode(MODULE_TYPE_ENUM.待产需求, {
        batchCode: data.batchCode,
        mainProcess: data.mainProcess,
        status: isCanEdit.value ? '' : STATUS_ENUM.已处理,
      });
    } else if (data.selectedIds) {
      api = getSalesForecastByIds(data.selectedIds);
    }

    if (!api) {
      return [];
    }
    changeLoading(true);
    return api
      .then(res => {
        const data = formatDateilListToShow(res.data || [], 'computedDatas');
        if (tableRef.value) {
          tableRef.value.reloadColumn([...detailColumns, ...getDynamicsTableColumn(data, false, 'targetDatas')]);
          tableRef.value.reloadData(data);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  /**
   * 是否已经计算
   */
  // const isComputed = ref<boolean>(false);
  /**
   * 获取计算后的数据
   */
  async function getComputedData() {
    const data = tableRef.value?.getTableData().fullData || [];
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    changeLoading(true);
    computeSalesForecast(data[0].mainProcess, formatDateilListToSave(data, 'covertedDatas'))
      .then(res => {
        if (res.code !== 200) {
          return false;
        }
        const data = formatDateilListToShow(res.data || [], 'computedDatas');
        if (tableRef.value) {
          tableRef.value.reloadColumn([...detailColumns, ...getDynamicsTableColumn(data, false, 'targetDatas')]);
          tableRef.value.reloadData(data);
        }
        // isComputed.value = true;
      })
      .catch(e => {
        console.warn('get computed data e:', e);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function handleExport() {
    // 使用vxeTable导出
    // tableRef.value?.commitProxy('export');

    // 获取基础数据
    const data = tableRef.value!.getTableData().fullData;
    const columns = tableRef.value!.getColumns().slice(1);
    if (data.length === 0 || columns.length === 0) {
      return false;
    }

    // 格式化为导出数据
    const exportData = data.reduce((arr, item) => {
      const obj = {};
      columns.forEach(column => {
        const { field, title } = column;
        if (field.includes('.')) {
          obj[field.split('.')[1]] = get(item, field);
        } else {
          obj[title] = get(item, field);
        }
      });
      arr.push(obj);
      return arr;
    }, []);

    // 将数据导出为`excel`
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, XLSX.utils.json_to_sheet(exportData), 'Sheet1');
    XLSX.writeFile(newWorkbook, `${t('component.excel.exportModalTitle')}_${Date.now()}.xlsx`);
  }
</script>

<style scoped lang="less">
  ::v-deep(.ant-row.ant-form-item) {
    margin-bottom: 0;
  }

  .auditors {
    > * {
      margin-right: 10px;
      margin-top: 10px;
    }
  }

  ::v-deep(.danger-cell) {
    color: #cb2431;
    background-color: #fbb1b1;
  }
</style>
