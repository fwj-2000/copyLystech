<template>
  <BasicPopup
    v-bind="$attrs"
    :title="t('common.detailText')"
    :showOkBtn="isCanEdit"
    :okText="t('common.submitText')"
    :okButtonProps="{ class: 'mr-12px' }"
    destroyOnClose
    class="full-popup"
    @register="registerPopup"
    @ok="handleSubmit">
    <Subtitle :title="t('routes.business-basicInformation-materialRatio')" class="p-4 !pb-0" />

    <div v-if="isAddNew" class="mt-[10px] flex flex-start pr-4">
      <BasicForm class="flex-1" @register="registerForm">
        <template #terminalCustomerPartNumber="{ model, field }">
          <lydc-select
            show-search
            :show-arrow="false"
            :filter-option="false"
            v-model:value="model[field]"
            :options="terminalCustomerPartNumberOptions"
            :not-found-content="null"
            :placeholder="t('dict.SalesShipPatternColumn.terminalCustomerPartNumber')"
            :fieldNames="{
              label: 'terminalCustomerPartNumber',
              value: 'terminalCustomerPartNumber',
            }"
            @search="handleTerminalCustomerPartNumberOptionsSearch" />
        </template>

        <template #formFooter>
          <a-button type="primary" @click="handleAdd">{{ t('common.add1Text') }}</a-button>
          <a-button type="primary" ghost class="ml-2" @click="openModal(true, {})">{{ t('common.batchAdd') }}</a-button>
        </template>
      </BasicForm>
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
        <template #toolbarTools>
          <a-button :title="t('dict.SalesShipPattern.addSameBtn')" @click="() => addSameTerminalCustomerPartNumberData(data[0])">
            <i class="icon-ym icon-ym-btn-add" />
          </a-button>
        </template>

        <template #ratioHeader="{ column }">
          <span>{{ column.title }}</span>
          <i v-if="!isAddNew" class="icon-ym-clock icon-ym float-right mt-[1px] cursor-pointer" @click="handleOpenHistoryModal" />
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
  import type { BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';

  import { ref, computed, toRaw } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { newDetailColumns, editDetailColumns, FORM_TYPE_ENUM, detailTableEditRules, STATUS_ENUM, MATERIA_FORM_ENUM } from '../config';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDebounceFn } from '@vueuse/core';
  import { useModal } from '/@/components/Modal';
  import {
    getSalesShipPatternDetail,
    saveSalesShipPatternDetail,
    getSalesShipPatternDropdownlist,
    getBatchSalesShipPatternDetail,
  } from '/@/api/business/materialRatio';

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
  const formType = ref<`${FORM_TYPE_ENUM}`>(FORM_TYPE_ENUM.详情);
  const deletedList: Array<any> = [];

  const isCanEdit = computed(() => {
    return formType.value !== FORM_TYPE_ENUM.详情;
  });

  const isAddNew = computed(() => {
    return formType.value === FORM_TYPE_ENUM.新增;
  });

  const detailColumns = computed(() => {
    if (isAddNew.value) {
      return newDetailColumns;
    }

    const list = [...newDetailColumns];
    list.splice(1, 1, ...editDetailColumns);
    return list;
  });

  const tableFooterData = ref<Array<Array<{ [key: string]: string | number }>>>([]);
  /**
   * @description 当tableData变化时，更新tableFooterData; 如果不存在tableIndex，则重新计算全部表格数据
   * @param tableIndex 表格索引
   */
  function updateTableFooterData(tableIndex?: number) {
    const isHasTableIndex = typeof tableIndex === 'number';

    const targetTableData = isHasTableIndex ? [tableData.value[tableIndex]].filter(Boolean) : tableData.value;

    if (targetTableData.length === 0) {
      return;
    }

    const sumData = targetTableData.map(table => {
      const currSum = table.reduce((obj, item) => {
        // 禁用不参与计算
        if (item.status === STATUS_ENUM.禁用) {
          return obj;
        }
        obj['shipPatternPercent'] = (obj['shipPatternPercent'] || 0) + Number.parseFloat(item['shipPatternPercent']?.toString() || '0');
        return obj;
      }, {});

      currSum['shipPatternPercent'] = Number.parseFloat((currSum['shipPatternPercent'] || 0).toFixed(2));
      return currSum;
    });

    if (isHasTableIndex) {
      const newFooterData = [...tableFooterData.value];
      newFooterData[tableIndex] = [{ ...sumData[0], seq: t('component.table.summary') }];
      tableFooterData.value = newFooterData;
    } else {
      tableFooterData.value = sumData.map(item => [{ ...item, seq: t('component.table.summary') }]);
    }
  }

  function handleEditClosed(tableIndex: number) {
    updateTableFooterData(tableIndex);
  }

  const gridOptions = computed<BasicTableProps>(() => ({
    showOverflow: true,
    showFooter: true,
    minHeight: 160,
    mouseConfig: {
      area: false, // 是否开启区域选取
      extension: false,
    },
    columns: [
      ...detailColumns.value,
      // 操作行
      {
        title: t('common.action'),
        width: '80',
        field: 'action',
        fixed: 'right',
        visible: isCanEdit.value,
        slots: {
          default: 'action',
        },
      },
    ],
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
    },
    toolbarConfig: {
      enabled: true,
      refresh: false,
      custom: false,
      slots: {
        tools: 'toolbarTools',
      },
    },
    proxyConfig: {
      enabled: false,
    },
    pagerConfig: {
      enabled: false,
    },
  }));

  const [registerForm, { validate }] = useForm({
    schemas: [
      {
        field: 'mainProcess',
        label: t('dict.SalesShipPatternColumn.mainProcessDesc'),
        component: 'ApiSelect',
        // 默认选择模切
        defaultValue: '1',
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
        field: 'terminalCustomerPartNumber',
        label: '',
        component: 'Select',
        slot: 'terminalCustomerPartNumber',
      },
    ],
    labelWidth: 80,
    baseColProps: { span: 6 },
    actionColOptions: { span: 6 },
  });

  async function init(data: { type: `${FORM_TYPE_ENUM}`; terminalCustomerPartNumber?: string; mainProcess?: string }) {
    formType.value = data.type;
    tableData.value = [];
    tableFooterData.value = [];
    deletedList.length = 0;

    handleTerminalCustomerPartNumberOptionsSearch('');
    changeLoading(true);
    if (formType.value !== FORM_TYPE_ENUM.新增 && data.terminalCustomerPartNumber && data.mainProcess) {
      tableData.value.push([
        { terminalCustomerPartNumber: data.terminalCustomerPartNumber, mainProcess: data.mainProcess, mainProcessDesc: '', statusDesc: '' },
      ]);
      await getTableData(data.terminalCustomerPartNumber, data.mainProcess);
    }
    changeLoading(false);
  }

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

    const flag =
      tableFooterData.value?.some(item => {
        if (!Array.isArray(item) || item.length === 0) return false;
        return item.some(obj => {
          if (typeof obj !== 'object' || obj === null) return false;
          return Object.values(obj).some(value => typeof value === 'number' && value !== 100);
        });
      }) ?? false;
    if (flag) {
      createMessage.warning(t('dict.SalesShipPattern.submitTip'));
      return;
    }

    const data: Array<any> = [];
    for (const item of [...toRaw(tableData.value), deletedList]) {
      data.push(
        ...item.map(obj => {
          return {
            ...obj,
            shipPatternPercent: +obj.shipPatternPercent / 100 + '',
          };
        }),
      );
    }

    changeLoading(true);
    saveSalesShipPatternDetail(data[0].mainProcess, data)
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
          closePopup();
          emits('reload');
        }
      })
      .catch(e => {
        console.warn('saveSalesShipPatternDetail e:', e);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleAdd() {
    const { mainProcess, terminalCustomerPartNumber } = await validate();
    if (!mainProcess || !terminalCustomerPartNumber) {
      return createMessage.warning(t('dict.SalesShipPattern.addTip'));
    }
    if (tableData.value.some(item => item[0].terminalCustomerPartNumber === terminalCustomerPartNumber)) {
      return createMessage.warning(t('dict.SalesShipPattern.codeExists'));
    }
    const target = terminalCustomerPartNumberOptions.value.find(item => item.terminalCustomerPartNumber === terminalCustomerPartNumber);

    tableData.value.push([
      {
        mainProcess,
        terminalCustomerPartNumber,
        terminalCustomerProjectCode: target?.terminalCustomerProjectCode || '',
        status: STATUS_ENUM.启用,
        statusDesc: t('common.enableText'),
        shipPattern: MATERIA_FORM_ENUM.卷料,
        shipPatternDesc: t('dict.DieCutShipPattern.R'),
      },
      {
        mainProcess,
        terminalCustomerPartNumber,
        terminalCustomerProjectCode: target?.terminalCustomerProjectCode || '',
        status: STATUS_ENUM.启用,
        statusDesc: t('common.enableText'),
        shipPattern: MATERIA_FORM_ENUM.片料,
        shipPatternDesc: t('dict.DieCutShipPattern.P'),
      },
    ]);
    getTableData(terminalCustomerPartNumber, mainProcess);
  }

  async function handleBatchAdd(data: Array<{ terminalCustomerPartNumber: string; terminalCustomerProjectCode: string }>) {
    const { mainProcess } = await validate();
    if (!mainProcess || data.length === 0) {
      return createMessage.warning(t('dict.SalesShipPattern.addTip'));
    }
    const newCodeList = data.filter(item => tableData.value.every(d => d[0].terminalCustomerPartNumber !== item.terminalCustomerPartNumber));
    if (newCodeList.length === 0) {
      return createMessage.warning(t('dict.SalesShipPattern.batchCodeExists'));
    }
    newCodeList.forEach(item => {
      tableData.value.push([
        {
          mainProcess,
          terminalCustomerPartNumber: item.terminalCustomerPartNumber,
          terminalCustomerProjectCode: item.terminalCustomerProjectCode || '',
          status: STATUS_ENUM.启用,
          statusDesc: t('common.enableText'),
          shipPattern: MATERIA_FORM_ENUM.卷料,
          shipPatternDesc: t('dict.DieCutShipPattern.R'),
        },
        {
          mainProcess,
          terminalCustomerPartNumber: item.terminalCustomerPartNumber,
          terminalCustomerProjectCode: item.terminalCustomerProjectCode || '',
          status: STATUS_ENUM.启用,
          statusDesc: t('common.enableText'),
          shipPattern: MATERIA_FORM_ENUM.片料,
          shipPatternDesc: t('dict.DieCutShipPattern.P'),
        },
      ]);
      getTableData(item.terminalCustomerPartNumber, mainProcess);
    });
  }

  /**
   * @description 获取已存在数据
   * @param terminalCustomerPartNumber 终端客户料号
   * @param mainProcess 主要制程
   */
  async function getTableData(terminalCustomerPartNumber: string, mainProcess: string) {
    const api = isAddNew.value ? getSalesShipPatternDetail : getBatchSalesShipPatternDetail;

    return api(terminalCustomerPartNumber, mainProcess)
      .then(res => {
        const targetIndex = tableData.value.findIndex(item => item[0].terminalCustomerPartNumber === terminalCustomerPartNumber);
        const data = res.data;
        if (targetIndex !== -1 && Array.isArray(data) && data.length) {
          // 对于formatData中的数据，按照其`immediateCustomerId`、`terminalCustomerPartNumber`、`site`属性的值进行分组
          const formatData = data.reduce((acc, cur) => {
            const key = `${cur.immediateCustomerId}-${cur.terminalCustomerPartNumber}-${cur.site}`;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push({
              ...cur,
              shipPatternPercent: Number.parseFloat((+cur.shipPatternPercent * 100).toFixed(2)),
              mainProcess: cur.mainProcess || mainProcess,
              status: cur.status || STATUS_ENUM.启用,
              statusDesc: cur.statusDesc || t('common.enableText'),
            });
            return acc;
          }, {});
          tableData.value.splice(targetIndex, 1, ...(Object.values(formatData) as any[]));
        }
        updateTableFooterData();
      })
      .catch(e => {
        console.warn('getTableData e:', e);
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
          updateTableFooterData(tableIndex);
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
    const { mainProcess, terminalCustomerPartNumber, terminalCustomerProjectCode, immediateCustomerCode, immediateCustomerId, immediateCustomerName } =
      tableData.value[tableIndex][0];
    tableData.value[tableIndex].splice(rowIndex + 1, 0, {
      mainProcess,
      terminalCustomerPartNumber,
      terminalCustomerProjectCode,
      status: STATUS_ENUM.启用,
      statusDesc: t('common.enableText'),
      immediateCustomerCode,
      immediateCustomerId,
      immediateCustomerName,
    });
    updateTableFooterData(tableIndex);
  }

  const terminalCustomerPartNumberOptions = ref<any[]>([]);
  const handleTerminalCustomerPartNumberOptionsSearch = useDebounceFn(async val => {
    const { mainProcess } = await validate();
    const { code, data } = await getSalesShipPatternDropdownlist(val, mainProcess);

    if (code === 200) {
      terminalCustomerPartNumberOptions.value = data;
    }
  }, 300);

  function handleOpenHistoryModal() {
    openHistoryModal(true, tableData.value[0][0] || {});
  }

  /**
   * @description 添加相同终端客户料号的数据
   * @param data
   */
  function addSameTerminalCustomerPartNumberData(data: any) {
    tableData.value.push([
      {
        mainProcess: data.mainProcess,
        mainProcessDesc: data.mainProcessDesc,
        terminalCustomerPartNumber: data.terminalCustomerPartNumber,
        terminalCustomerProjectCode: data.terminalCustomerProjectCode,
        status: STATUS_ENUM.启用,
        statusDesc: t('common.enableText'),
      },
    ]);
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

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
