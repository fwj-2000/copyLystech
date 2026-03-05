<template>
  <BasicPopup
    v-bind="$attrs"
    :title="t('common.detailText')"
    :showOkBtn="isCanEdit"
    :okText="t('common.submitText')"
    :okButtonProps="{ class: 'ml-12px' }"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    destroyOnClose
    class="full-popup"
    @register="registerPopup"
    @ok="handleSubmit">
    <template #centerToolbar>
      <a-button @click="handleExport" class="my-12px">
        {{ t('component.excel.exportModalTitle') }}
      </a-button>
    </template>

    <Subtitle :title="t('routes.business-salesForecast-requirement')" class="p-4" />

    <BasicForm v-if="isCanEdit" @register="registerForm">
      <template #startWeek="{ model, field, schema }">
        <WeekPicker v-model:value="model[field]" :disabled="schema.componentProps.disabled" />
      </template>
      <template #formFooter>
        <a-button type="primary" :disabled="isProcessed" @click="handleChangeDate"> {{ t('common.adjust') }} </a-button>
        <a-dropdown class="ml-3">
          <template #overlay>
            <a-menu @click="handleConvert">
              <a-menu-item :disabled="isProcessed" :key="DETAIL_PROCESS_ENUM.转化出货比例"> {{ t('routes.business-basicInformation-siteRatio') }} </a-menu-item>
              <a-menu-item :disabled="process !== DETAIL_PROCESS_ENUM.转化出货比例" :key="DETAIL_PROCESS_ENUM.转化片卷料">
                {{ t('dict.SalesForecastColumn.shipPatternPercent') }}
              </a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary" ghost>{{ t('dict.SalesForecast.conversion') }}</a-button>
        </a-dropdown>
        <a-button class="ml-3" @click="reset">{{ t('common.resetText') }}</a-button>
      </template>
    </BasicForm>

    <div :style="`height: ${vxeTableHeight}`">
      <VxeBasicTable ref="tableRef" v-bind="gridOptions" :tableStyle="{ width: '100%' }" />
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';

  import { ref, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { detailColumns, DETAIL_PROCESS_ENUM, STATUS_ENUM } from './config';
  import { formatDateilListToShow, formatDateilListToSave, getDynamicsTableColumn, MODULE_TYPE_ENUM, dateRegExp } from '/@/views/business/salesForecast/config';
  import {
    getSalesForecastByBatchCode,
    convertSiteData,
    convertShipPatternData,
    saveConvertSalesForecastData,
    getSalesForecastByIds,
  } from '/@/api/business/salesForecast';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep, get } from 'lodash-es';
  import Decimal from 'decimal.js';
  import { isObject } from '/@/utils/is';
  import * as XLSX from 'xlsx';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { VxeBasicTable } from '/@/components/VxeTable';
  import { BasicForm, useForm } from '/@/components/Form';
  import WeekPicker from './weekPicker.vue';

  const tableRef = ref<VxeGridInstance>();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { t } = useI18n();
  const emits = defineEmits(['reload']);
  const { createMessage } = useMessage();

  const isCanEdit = ref(true);
  const process = ref<`${DETAIL_PROCESS_ENUM}`>(DETAIL_PROCESS_ENUM.未处理);
  const sourceData: Array<any> = [];

  const vxeTableHeight = computed(() => {
    return `calc(100% - ${isCanEdit.value ? 104 : 54}px)`;
  });

  /**
   * @description 是否已经转化
   */
  const isProcessed = computed(() => {
    return process.value !== DETAIL_PROCESS_ENUM.未处理;
  });

  /**
   * 是否已经转化出货比例
   */
  const isAfterConvertStie = computed(() => {
    return process.value === DETAIL_PROCESS_ENUM.转化出货比例;
  });

  const gridOptions = computed<BasicTableProps>(() => {
    return {
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
      editConfig: {
        enabled: isAfterConvertStie.value,
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
        return isAfterConvertStie.value && !row.sitePercent ? 'danger-cell' : '';
      },
    };
  });

  async function init(data: any) {
    changeLoading(true);
    isCanEdit.value = typeof data.isCanEdit === 'boolean' ? data.isCanEdit : false;
    await getTableData(data);
    changeLoading(false);
  }

  async function handleSubmit() {
    if (process.value !== DETAIL_PROCESS_ENUM.转化片卷料) {
      return createMessage.warning(t('dict.SalesForecast.convertSubmitTip'));
    }

    const data = tableRef.value!.getTableData().fullData;

    changeLoading(true);
    return saveConvertSalesForecastData(data[0].mainProcess, formatDateilListToSave(data, 'covertedDatas'))
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg || t('dict.SalesForecast.convertSuccess'));
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
      api = getSalesForecastByBatchCode(MODULE_TYPE_ENUM.客户需求, {
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

    const res = await api;

    const tableData = isCanEdit.value ? res.data ?? [] : formatDateilListToShow(res.data ?? [], 'covertedDatas');

    if (isCanEdit.value) {
      sourceData.length = 0;
      sourceData.push(...tableData);
    }

    changeProcessValue(DETAIL_PROCESS_ENUM.未处理);

    if (tableRef.value) {
      const params: [any[], boolean, string?] = isCanEdit.value ? [tableData, false] : [tableData, false, 'targetDatas'];

      tableRef.value.reloadColumn([...detailColumns, ...getDynamicsTableColumn(...params)]);
      tableRef.value.reloadData(tableData);
    }

    return tableData;
  }

  const [registerForm, { validate, updateSchema }] = useForm({
    schemas: [
      {
        field: 'startWeek',
        label: t('dict.SalesForecast.startWeek'),
        component: 'WeekPicker',
        slot: 'startWeek',
        componentProps: {
          disabled: false,
        },
      },
      {
        field: 'buffer',
        label: 'Buffer(%)',
        component: 'InputNumber',
        defaultValue: 100,
        componentProps: {
          // precision: 2,
          disabled: false,
          formatter: (value: number) => `${value}%`,
          parser: (value: string) => value.replace('%', ''),
        },
      },
    ],
    labelWidth: 80,
    baseColProps: { span: 6 },
    actionColOptions: { span: 6 },
  });

  /**
   * @description 调整起始周，并且将指定起始周之前的数据，累加到指定的起始周上
   */
  async function handleChangeDate() {
    const data = await validate();
    if (!(data.startWeek && dateRegExp.test(data.startWeek))) {
      return createMessage.warning(t('dict.SalesForecast.startWeekTip1'));
    }

    const tableData = sourceData || [];

    if (tableData.length === 0 || !tableData[0].importDatas) {
      return false;
    }

    // 获取需要修改的周列表
    const orginalAmountKeys = Object.keys(tableData[0].importDatas)
      .filter(v => dateRegExp.test(v))
      .sort((a, b) => {
        const [yearA, monthA, weekA] = a.split('-');
        const [yearB, monthB, weekB] = b.split('-');
        return +yearA * 1000 + +monthA * 10 + +weekA.replace('WK', '') - (+yearB * 1000 + +monthB * 10 + +weekB.replace('WK', ''));
      });
    const formatStartWeekStr = formatStartWeek(data.startWeek);
    const startWeekIndex = orginalAmountKeys.findIndex(v => {
      return formatStartWeek(v) === formatStartWeekStr;
    });

    if (startWeekIndex === -1) {
      return createMessage.warning(t('dict.SalesForecast.startWeekTip2'));
    }

    /** 获取调整之后的周列表 */
    const weekList = getModifyWeekList(data.startWeek, orginalAmountKeys.length - startWeekIndex);
    const tableDataSource = cloneDeep(tableData);
    // 计算比率
    const buffer = typeof +data.buffer === 'number' && !Number.isNaN(+data.buffer) ? Decimal.div(+data.buffer, 100) : 1;
    /** 获取用于累加的周列表 */
    const sumOriginalAmountKey = orginalAmountKeys.slice(0, startWeekIndex + 1);
    tableDataSource.forEach((item: any) => {
      const newAmount = {};
      weekList.forEach((v, i) => {
        if (i === 0) {
          // 对于`orginalAmountKeys`中 0 至 startWeekIndex 的属性项累加
          newAmount[v] = Decimal.mul(
            buffer,
            sumOriginalAmountKey.reduce((sum: any, key) => Decimal.add(sum, item.importDatas[key]), 0),
          );
          return;
        }
        newAmount[v] = Decimal.mul(buffer, item.importDatas[orginalAmountKeys[i + startWeekIndex]]);
      });
      item.importDatas = newAmount;
    });
    if (tableRef.value) {
      tableRef.value.reloadColumn([...detailColumns, ...getDynamicsTableColumn(tableDataSource, isCanEdit.value)]);
      tableRef.value.loadData(tableDataSource);
      createMessage.success(t('dict.SalesForecast.adjustSuccess'));
    }
  }

  /**
   * @description 格式化起始周，对于2025年1月第一周，有可能表示为`2025-01-WK1`或`2025-1-WK1`，该方法将其统一处理为`2025-01-WK1`
   * @param startWeek 起始周，格式为 `年-月-WK${当前月的第几周}`，如2025年1月第一周，则传`2025-01-WK1`或``2025-1-WK1``
   * @returns 格式话之后的数据，将时间统一表示为`YYYY-MM-WK${当前月的第几周}`
   */
  function formatStartWeek(startWeek: string) {
    const [yearStr, monthStr, weekStr] = startWeek.split('-');
    return `${yearStr}-${monthStr.padStart(2, '0')}-${weekStr}`;
  }

  /**
   * @description 获取从起始周开始，往后推 len 周的列表
   * @param startWeek 起始周，格式为 `年-月-WK${当前月的第几周}`，如2025年1月第一周，则传`2025-01-WK1`
   * @param len 获取周的数量
   * @return 周列表，如: `['2025-01-WK2', '2025-01-WK3', '2025-01-WK4', '2025-01-WK5', '2025-02-WK1']`
   */
  function getModifyWeekList(startWeek: string, len: number) {
    const result: Array<string> = [];
    // 每个季度的第一个月份([1, 4, 7, 10])分为5周，其他月份分为4周
    // 当前月份周数用完了，则进入下一个月分，12月的周数用完了，则进入下一个年分

    const [yearStr, monthStr, weekStr] = startWeek.split('-');
    let year = Number.parseInt(yearStr, 10);
    let month = Number.parseInt(monthStr, 10);
    let week = Number.parseInt(weekStr.replace('WK', ''), 10);

    const weeksInMonth = (month: number): number => {
      return [1, 4, 7, 10].includes(month) ? 5 : 4;
    };

    for (let i = 0; i < len; i++) {
      result.push(`${year}-${String(month).padStart(2, '0')}-WK${week}`);
      week++;

      if (week > weeksInMonth(month)) {
        week = 1;
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }
    }
    return result;
  }

  /**
   * @description 调用接口对数据进行转化
   * @param key 转化类型
   */
  function handleConvert({ key }: { key: `${DETAIL_PROCESS_ENUM}` }) {
    const isConvertShipPatternPercent = key === DETAIL_PROCESS_ENUM.转化片卷料;
    let api: any = null;

    if (key === DETAIL_PROCESS_ENUM.转化出货比例) {
      api = convertSiteData;
    } else if (isConvertShipPatternPercent) {
      api = convertShipPatternData;
    }

    if (!api || !tableRef.value) {
      return false;
    }
    const tableData = tableRef.value.getTableData().fullData;
    const list: Array<any> = tableData.map(item => {
      if (isObject(item.importDatas)) {
        item.importDataJson = JSON.stringify(item.importDatas);
      }
      return item;
    });
    if (isConvertShipPatternPercent && list.some(item => !item.sitePercent)) {
      return createMessage.warning(t('dict.SalesForecast.convertCheckTip'));
    }

    const dataList = isConvertShipPatternPercent ? formatShipPatternPercent(formatDateilListToSave(list, 'covertedDatas')) : list;
    changeLoading(true);
    return api(list[0].mainProcess, dataList)
      .then(res => {
        changeProcessValue(key);
        const data = formatDateilListToShow(res.data || [], 'covertedDatas');
        if (tableRef.value) {
          tableRef.value.reloadColumn([...detailColumns, ...getDynamicsTableColumn(data, isCanEdit.value, 'targetDatas')]);
          tableRef.value.loadData(data);
        }
        createMessage.success(t('dict.SalesForecast.convertSuccess'));
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  /**
   * @description 将片卷料转化比例转化为百分比小鼠
   * @param list 需要转化的数据
   */
  function formatShipPatternPercent(list: Array<{ shipPatternPercent: string | number }>) {
    return list.map(item => {
      if (item.shipPatternPercent) {
        item.shipPatternPercent = Decimal.div(item.shipPatternPercent, 100).toNumber();
      }
      return item;
    });
  }

  function changeProcessValue(value: `${DETAIL_PROCESS_ENUM}`) {
    process.value = value;
    updateSchema([
      { field: 'buffer', componentProps: { disabled: isProcessed.value } },
      { field: 'startWeek', componentProps: { disabled: isProcessed.value } },
    ]);
  }

  function reset() {
    if (tableRef.value) {
      tableRef.value.reloadColumn([...detailColumns, ...getDynamicsTableColumn(sourceData, isCanEdit.value)]);
      tableRef.value.loadData([...sourceData]);
    }
    changeProcessValue(DETAIL_PROCESS_ENUM.未处理);
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
  :deep(.ant-row.ant-form-item) {
    margin-bottom: 0;
  }

  :deep(.danger-cell) {
    color: #cb2431;
    background-color: #fbb1b1;
  }
</style>
