<template>
  <BasicPopup
    v-bind="$attrs"
    :title="t('common.detailText')"
    :showOkBtn="isCanEdit"
    :okText="t('common.submitText')"
    :okButtonProps="{ class: 'my-12px mr-12px' }"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'my-12px' }"
    destroyOnClose
    class="full-popup"
    @register="registerPopup"
    @ok="handleSubmit">
    <Subtitle :title="t('routes.business-basicInformation-siteRatio')" :extra="{ show: true, hideAdd: true }" class="p-4 !pb-0">
      <template v-if="isEdit" #extra>
        <a-range-picker :value="currentSelectedMonthRange" picker="month" :allowClear="false" @change="changeCurrentSelectedMonthRange" />
        <a-button type="primary" ghost class="ml-2" @click="viewAll">{{ t('dict.SalesSiteColumn.viewAll') }}</a-button>
      </template>
    </Subtitle>

    <div v-if="isAddNew" class="mt-[10px] flex flex-start pr-4">
      <BasicForm class="flex-1" @register="registerForm">
        <template #terminalCustomerProjectCode="{ model, field }">
          <lydc-select
            show-search
            :show-arrow="false"
            :filter-option="false"
            v-model:value="model[field]"
            :options="TerminalCustomerProjectCodeOptions"
            :not-found-content="null"
            :placeholder="t('dict.SalesSiteColumn.terminalCustomerProjectCode')"
            :fieldNames="{
              label: 'terminalCustomerProjectCode',
              value: 'terminalCustomerProjectCode',
            }"
            @search="handleTerminalCustomerProjectCodeOptionsSearch" />
        </template>

        <template #formFooter>
          <a-button type="primary" @click="handleAdd">{{ t('common.add1Text') }}</a-button>
          <a-button type="primary" ghost class="ml-2" @click="openModal(true, {})">{{ t('common.batchAdd') }}</a-button>
        </template>
      </BasicForm>

      <a-range-picker :value="currentSelectedMonthRange" picker="month" :allowClear="false" @change="changeCurrentSelectedMonthRange" />
    </div>

    <div v-if="tableData.length > 0" class="scroll-table">
      <VxeBasicTable
        v-for="(data, tableIndex) in tableData"
        :key="tableIndex"
        ref="tableRef"
        v-bind="gridOptions"
        :tableStyle="{ width: '100%' }"
        class="h-max"
        :data="data"
        :footerData="tableFooterData[tableIndex] || [{ seq: t('component.table.summary') }]"
        @edit-closed="() => handleEditClosed(tableIndex)">
        <template #ratioHeader="{ column }">
          <span>{{ column.title }}</span>
          <i
            v-if="!isAddNew"
            class="icon-ym-clock icon-ym float-right mt-[1px] cursor-pointer"
            @click="() => openHistoryModal(true, { terminalCustomerProjectCode: data[0].terminalCustomerProjectCode, yearMonth: column.title })" />
        </template>

        <template #action="{ rowIndex }">
          <i class="icon-ym icon-ym-btn-add cursor-pointer mr-2" @click="() => addData(tableIndex, rowIndex)" />
          <i class="icon-ym icon-ym-delete cursor-pointer" @click="() => confirmToDelete(tableIndex, rowIndex)" />
        </template>
      </VxeBasicTable>
    </div>
    <lydc-empty v-else />

    <BatchAddModal @register="registerAddModal" @reload="handleBatchAdd" />
    <HistoryModal @register="registerHistoryModal" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { VxeGridInstance } from '/@/components/VxeTable';
  import type { Dayjs } from 'dayjs';

  import { ref, computed, toRaw, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { newDetailColumns, allDetailColumns, getDynamicsTableColumn, FORM_TYPE_ENUM, detailTableEditRules, STATUS_ENUM } from '../config';
  import { MAIN_PROCESS_ENUM } from '/@/views/business/salesForecast/config';
  import { useBaseStore } from '/@/store/modules/base';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDebounceFn } from '@vueuse/core';
  import { useModal } from '/@/components/Modal';
  import { getSalesSiteCreateDetail, getSalesSiteDetail, saveSalesSiteDetail, getSalesSiteDropdownlist } from '/@/api/business/siteRatio';
  import { get } from 'lodash-es';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { VxeBasicTable } from '/@/components/VxeTable';
  import { BasicForm, useForm } from '/@/components/Form';
  import BatchAddModal from './batchAddModal.vue';
  import HistoryModal from './historyModal.vue';

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const { createConfirm, createMessage } = useMessage();
  const tableRef = ref<Array<VxeGridInstance>>();
  const [registerAddModal, { openModal }] = useModal();
  const [registerHistoryModal, { openModal: openHistoryModal }] = useModal();
  const emits = defineEmits(['reload']);

  const tableData = ref<any[][]>([[{}]]);
  const currentSelectedMonthRange = ref<[Dayjs, Dayjs]>();
  const formType = ref<`${FORM_TYPE_ENUM}`>(FORM_TYPE_ENUM.详情);
  const deletedList: Array<any> = [];

  const isCanEdit = computed(() => {
    return formType.value !== FORM_TYPE_ENUM.详情;
  });

  const isEdit = computed(() => {
    return formType.value === FORM_TYPE_ENUM.编辑;
  });

  const isAddNew = computed(() => {
    return formType.value === FORM_TYPE_ENUM.新增;
  });

  const dynamicsTableColumn = computed(() => {
    return getDynamicsTableColumn(currentSelectedMonthRange.value, isCanEdit.value);
  });
  // 列变化时，触发全部合计计算
  watch(
    () => dynamicsTableColumn.value,
    () => updateTableFooterData({}),
  );

  const detailColumns = computed(() => {
    return isAddNew.value ? newDetailColumns : allDetailColumns;
  });

  const tableFooterData = ref<Array<Array<{ [key: string]: string | number }>>>([]);
  /**
   * @description 当tableData变化时，更新tableFooterData; 如果不存在tableIndex，则重新计算全部表格数据，如果不存在columnIndex，则重新计算当前行数据
   * @param param0 tableIndex: 表格索引；columnIndex: 列索引
   */
  function updateTableFooterData({ tableIndex, columnIndex }: { tableIndex?: number; columnIndex?: number }) {
    const isHasTableIndex = typeof tableIndex === 'number';
    const isHasColumnIndex = typeof columnIndex === 'number';

    if (isHasColumnIndex && columnIndex - detailColumns.value.length < 0) {
      return;
    }

    const targetTableData = isHasTableIndex ? [tableData.value[tableIndex]].filter(Boolean) : tableData.value;
    const targetTableColumn = isHasColumnIndex ? [dynamicsTableColumn.value[columnIndex - detailColumns.value.length]] : dynamicsTableColumn.value;

    if (targetTableData.length === 0) {
      return;
    }

    const sumData = targetTableData.map(table => {
      const currSum = table.reduce((obj, item) => {
        // 禁用不参与计算
        if (item.status === STATUS_ENUM.禁用) {
          return obj;
        }
        targetTableColumn.forEach(({ field }) => {
          if (field) {
            obj[field] = (obj[field] || 0) + Number.parseFloat(get(item, field)?.toString() || '0');
          }
        });
        return obj;
      }, {});

      // 格式化每个字段的数值，保留两位小数并进行四舍五入
      return Object.keys(currSum).reduce((formattedObj, key) => {
        formattedObj[key] = Number.parseFloat(currSum[key].toFixed(2));
        return formattedObj;
      }, {} as { [key: string]: number });
    });

    if (isHasTableIndex && isHasColumnIndex) {
      const newFooterData = [...tableFooterData.value];
      const oldData = tableFooterData.value[tableIndex]?.[0] || {};
      newFooterData.splice(tableIndex, 1, [{ ...oldData, ...sumData[0] }]);
      tableFooterData.value = newFooterData;
    } else if (isHasTableIndex) {
      const newFooterData = [...tableFooterData.value];
      newFooterData[tableIndex] = [{ ...sumData[0], seq: t('component.table.summary') }];
      tableFooterData.value = newFooterData;
    } else if (isHasColumnIndex) {
      tableFooterData.value = tableFooterData.value.map((item, index) => {
        return [{ ...item[0], ...sumData[index] }];
      });
    } else {
      tableFooterData.value = sumData.map(sum => [{ ...sum, seq: t('component.table.summary') }]);
    }
  }

  function handleEditClosed(tableIndex: number) {
    updateTableFooterData({ tableIndex });
  }

  const gridOptions = computed<any>(() => ({
    showOverflow: true,
    showFooter: true,
    minHeight: 220,
    maxHeight: 500,
    columns: [
      ...detailColumns.value,
      ...dynamicsTableColumn.value,
      // 操作行
      {
        title: t('common.action'),
        width: '80',
        fixed: 'right',
        visible: isCanEdit.value,
        slots: {
          default: 'action',
        },
      },
    ],
    pagerConfig: {
      enabled: false,
    },
    editRules: detailTableEditRules,
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
      showStatus: true,
      // beforeEditMethod: ({ column, row }) => {
      //   // 当前列不是状态列，并且当前行状态为禁用，则不允许编辑
      //   return !(row.id && column.field === 'site');
      // }
    },
    toolbarConfig: {
      enabled: false,
    },
    proxyConfig: {
      enabled: false,
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: isCanEdit.value, // 是否启用多区域选取功能
    },
    clipConfig: {
      isPaste: isCanEdit.value,
      afterPasteMethod: updateTableFooterData,
    },
    keyboardConfig: {
      isClip: isCanEdit.value, // 是否开启复制粘贴
      isEdit: isCanEdit.value, // 是否开启任意键进入编辑（功能键除外）
      isDel: isCanEdit.value, // 是否开启删除键功能
      isEsc: isCanEdit.value, // 是否开启Esc键关闭编辑功能
    },
  }));

  const [registerForm, { validate }] = useForm({
    schemas: [
      {
        field: 'mainProcess',
        label: t('dict.SalesSiteColumn.mainProcessDesc'),
        component: 'ApiSelect',
        // 默认选择模切
        defaultValue: MAIN_PROCESS_ENUM.模切,
        componentProps: {
          api: () => baseStore.getDictionaryData('MainProcess'),
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          // placeholder: '主要制程',
          style: 'width: 100%',
        },
      },
      {
        field: 'terminalCustomerProjectCode',
        label: '',
        component: 'Select',
        slot: 'terminalCustomerProjectCode',
      },
    ],
    labelWidth: 80,
    baseColProps: { span: 6 },
    actionColOptions: { span: 6 },
  });

  async function init(data: { type: `${FORM_TYPE_ENUM}`; terminalCustomerProjectCode?: string; mainProcess?: string }) {
    currentSelectedMonthRange.value = [dayjs(), dayjs().add(11, 'month')];
    formType.value = data.type;
    tableData.value = [];
    tableFooterData.value = [];
    deletedList.length = 0;

    if (formType.value !== FORM_TYPE_ENUM.新增 && data.terminalCustomerProjectCode && data.mainProcess) {
      tableData.value.push([{ terminalCustomerProjectCode: data.terminalCustomerProjectCode, mainProcess: data.mainProcess }]);
      getTableData(data.terminalCustomerProjectCode, data.mainProcess);
    }

    handleTerminalCustomerProjectCodeOptionsSearch('');
  }

  /**
   * @description 检查出货比例之和是否为100%
   */

  function checkRatioSum() {
    const flag =
      tableFooterData.value?.some((item /** index */) => {
        if (!Array.isArray(item) || item.length === 0) return false;
        return item.some(obj => {
          if (typeof obj !== 'object' || obj === null) return false;
          for (const [, /** key */ value] of Object.entries(obj)) {
            if (typeof value === 'number' && value !== 100 && value !== 0) {
              // return checkColumnIsNotEmpty(key, index);
              return true;
            }
          }
          return false;
        });
      }) ?? false;
    if (flag) {
      createMessage.warning(t('dict.SalesSiteColumn.checkRatioSumTip'));
      return false;
    }
    return true;
  }

  /**
   * @description 根据指定的列字段名，从tableData中获取对应的列数据，并检查每一行对应该列是否不存在值或者当前的`status`为禁用状态
   * @param columnField 列字段名
   * @param index 索引
   */
  // function checkColumnIsNotEmpty(columnField: string, index: number) {
  //   return !Array.isArray(tableData.value[index])
  //           ? false
  //           : tableData.value[index].some(row => {
  //               const value = get(row, columnField);
  //               if (typeof row !== 'object' || row === null) return false;
  //               if (value !== undefined && value !== null && row.status !== STATUS_ENUM.禁用) {
  //                 return true;
  //               }
  //               return false;
  //             });
  // }

  /**
   * @description 提交
   */

  async function handleSubmit() {
    if (!tableRef.value) {
      return;
    }
    for (const item of tableRef.value) {
      if (await item.validate(true)) {
        createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
        return;
      }
    }

    if (!checkRatioSum()) {
      return;
    }

    const data: Array<any> = [];
    for (const item of [...toRaw(tableData.value), deletedList]) {
      data.push(
        ...item.map(obj => {
          const importDatas = {};
          for (const [key, value] of Object.entries<string | number>(obj.importDatas)) {
            importDatas[key] = +value / 100;
          }
          return {
            ...obj,
            importDatas,
          };
        }),
      );
    }

    changeLoading(true);
    saveSalesSiteDetail(data)
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
          closePopup();
          emits('reload');
        }
      })
      .catch(e => {
        console.warn('saveSalesSiteDetail e:', e);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleAdd() {
    const { mainProcess, terminalCustomerProjectCode } = await validate();
    if (!mainProcess || !terminalCustomerProjectCode) {
      return createMessage.warning(t('dict.SalesSiteColumn.addTip'));
    }
    if (tableData.value.some(item => item[0].terminalCustomerProjectCode === terminalCustomerProjectCode)) {
      return createMessage.warning(t('dict.SalesSiteColumn.codeExistsTip'));
    }
    tableData.value.push([{ mainProcess, terminalCustomerProjectCode, status: STATUS_ENUM.启用, statusDesc: t('common.enableText') }]);
    getTableData(terminalCustomerProjectCode, mainProcess);
  }

  async function handleBatchAdd(data: Array<{ terminalCustomerProjectCode: string }>) {
    const { mainProcess } = await validate();
    if (!mainProcess || data.length === 0) {
      return createMessage.warning(t('dict.SalesSiteColumn.addTip'));
    }
    const newCodeList = data.filter(item => tableData.value.every(d => d[0].terminalCustomerProjectCode !== item.terminalCustomerProjectCode));
    if (newCodeList.length === 0) {
      return createMessage.warning(t('dict.SalesSiteColumn.batchCodeExistsTip'));
    }
    newCodeList.forEach(item => {
      tableData.value.push([
        { mainProcess, terminalCustomerProjectCode: item.terminalCustomerProjectCode, status: STATUS_ENUM.启用, statusDesc: t('common.enableText') },
      ]);
      getTableData(item.terminalCustomerProjectCode, mainProcess);
    });
  }

  /**
   * @description 获取已存在数据
   * @param terminalCustomerProjectCode 终端项目代码
   * @param mainProcess 主要制程
   */
  async function getTableData(terminalCustomerProjectCode: string, mainProcess: string) {
    // const api = isAddNew.value ? getSalesSiteCreateDetail : getSalesSiteDetail;

    changeLoading(true);
    return getSalesSiteDetail(terminalCustomerProjectCode, mainProcess)
      .then(res => {
        const targetIndex = tableData.value.findIndex(item => item[0].terminalCustomerProjectCode === terminalCustomerProjectCode);
        const data = res.data;
        if (targetIndex !== -1 && Array.isArray(data) && data.length) {
          tableData.value[targetIndex] = data.map((item: any) => {
            return {
              ...item,
              mainProcess: item.mainProcess || mainProcess,
              status: item.status || STATUS_ENUM.启用,
              statusDesc: t('common.enableText'),
              // 将接口返回的百分比数据乘以100，并保留两位小数，用于展示，如：0.1411 * 100 = 14.11
              importDatas: Object.keys(item.importDatas || {}).reduce((sum, key) => {
                return {
                  ...sum,
                  [key]: Number.parseFloat((+item.importDatas[key] * 100).toFixed(2)),
                };
              }, {}),
            };
          });
        }
        updateTableFooterData({ tableIndex: targetIndex });
      })
      .catch(e => {
        console.warn('e:', e);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  /**
   * @description 删除上传数据
   * @param tableIndex 表格索引
   * @param rowIndx 行索引
   */
  function confirmToDelete(tableIndex: number, rowIndx: number) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: () => {
        const list = tableData.value[tableIndex].splice(rowIndx, 1);
        if (tableData.value[tableIndex].length === 0) {
          tableData.value.splice(tableIndex, 1);
          tableFooterData.value.splice(tableIndex, 1);
        } else {
          updateTableFooterData({ tableIndex });
        }
        for (const item of list) {
          item.id &&
            deletedList.push({
              ...item,
              deleteMark: 1,
            });
        }
        return Promise.resolve();
      },
    });
  }

  /**
   * @description 添加数据
   * @param tableIndex 表格索引
   * @param rowIndx 行索引
   */
  function addData(tableIndex: number, rowIndex: number) {
    const { mainProcessDesc, mainProcess, terminalCustomerProjectCode } = tableData.value[tableIndex][0];
    tableData.value[tableIndex].splice(rowIndex + 1, 0, {
      mainProcess,
      mainProcessDesc,
      terminalCustomerProjectCode,
      status: STATUS_ENUM.启用,
      statusDesc: t('common.enableText'),
    });
    updateTableFooterData({ tableIndex });
  }

  const TerminalCustomerProjectCodeOptions = ref<any[]>([]);
  const handleTerminalCustomerProjectCodeOptionsSearch = useDebounceFn(async val => {
    const { mainProcess } = await validate();
    const { code, data } = await getSalesSiteDropdownlist(val, mainProcess);

    if (code === 200) {
      TerminalCustomerProjectCodeOptions.value = data;
    }
  }, 300);

  /**
   * @description 从`tableData.value`(类型为: Array<Array<{ importDatas: { [key: string]: number | string } }>>)中，获取所有`importDatas`中所有的key(格式为`YYYY-MM`)，并按照时间排序，获取其中最早和最晚的key
   */
  function viewAll() {
    const allKeys: string[] = [];

    tableData.value.forEach(table => {
      table.forEach(row => {
        const importDatas = row.importDatas || {};
        Object.keys(importDatas).forEach(key => {
          allKeys.push(key);
        });
      });
    });

    const sortedKeys = allKeys.map(key => ({ key, date: dayjs(key, 'YYYY-MM').tz() })).sort((a, b) => a.date.diff(b.date));

    // 获取最早和最晚的键
    const earliestKey = sortedKeys.length > 0 ? sortedKeys[0].key : null;
    const latestKey = sortedKeys.length > 0 ? sortedKeys[sortedKeys.length - 1].key : null;

    earliestKey && latestKey && changeCurrentSelectedMonthRange([dayjs(earliestKey).tz(), dayjs(latestKey).tz()]);
  }

  /**
   * @description 切换月份，切换之前先校验当前比例之和是否为 `100%`
   * @param startDate 开始日期
   * @param endDate 结束日期
   */
  function changeCurrentSelectedMonthRange([startDate, endDate]: [Dayjs, Dayjs]) {
    if (checkRatioSum()) {
      currentSelectedMonthRange.value = [startDate, endDate];
    }
  }
</script>

<style scoped lang="less">
  ::v-deep(.ant-form .ant-row.ant-form-item) {
    margin-bottom: 0;
  }

  .scroll-table {
    height: calc(100% - 86px);
    overflow: hidden auto;

    /* Firefox */
    scrollbar-width: none;

    /* Chrome, Safari 和 Opera */
    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
