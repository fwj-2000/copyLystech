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
    :closeFunc="beforeClosePopup"
    @register="registerPopup"
    @ok="() => handleSubmit(false)">
    <template v-if="isCanEdit" #centerToolbar>
      <a-button type="primary" ghost @click="() => handleSubmit(true)" class="mx-0">{{ t('common.temporarySave') }}</a-button>
    </template>

    <Subtitle :title="t('routes.business-salesForecast-confirm')" class="p-4 !pb-0" />

    <!-- <BasicForm v-if="isCanEdit" @register="registerForm">
      <template #startWeek="{ model, field }">
        <WeekPicker v-model:value="model[field]" />
      </template>
      <template #formFooter>
        <a-button type="primary" @click="handleChangeDate">确定</a-button>
      </template>
    </BasicForm> -->

    <div :style="`height: ${vxeTableHeight}`">
      <VxeBasicTable ref="tableRef" v-bind="gridOptions" :tableStyle="{ width: '100%' }" @headerCellDblclick="handleHeaderCellDblclick">
        <template #action="{ row }">
          <i class="icon-ym icon-ym-delete cursor-pointer" @click="() => confirmToDelete(row.id)" />
        </template>
      </VxeBasicTable>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';

  import { ref, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { detailColumns, actionColumns, STATUS_ENUM } from '../config';
  import { getDynamicsTableColumn, formatDateilListToShow, formatDateilListToSave, MODULE_TYPE_ENUM } from '../../config';
  import { getUserInfoList } from '/@/api/permission/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    getSalesForecastByBatchCode,
    getSalesForecastByIds,
    // savePMConfirmPages,
    savePmConfirmAndCalc,
    temporaryStorageJson,
    delSalesForecast,
    getMemberList,
    getUserListByAccountList,
  } from '/@/api/business/salesForecast';
  import { get, set } from 'lodash-es';
  import * as XLSX from 'xlsx';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { VxeBasicTable } from '/@/components/VxeTable';

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { t } = useI18n();
  const emits = defineEmits(['reload']);
  const tableRef = ref<VxeGridInstance>();

  const isCanEdit = ref(true);
  const { createMessage, createConfirm } = useMessage();

  const vxeTableHeight = computed(() => {
    return `calc(100% - ${isCanEdit.value ? 84 : 54}px)`;
  });

  const gridOptions = computed<BasicTableProps>(() => ({
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
    pagerConfig: {
      enabled: false,
    },
    editConfig: {
      enabled: isCanEdit.value,
      trigger: 'dblclick',
      mode: 'row',
    },
    toolbarConfig: {
      // enabled: false,
      refresh: false,
      custom: false,
      buttons: [
        {
          content: t('common.resetFilter'),
          buttonRender: {
            name: 'AButton',
            props: {
              auth: 'btn_edit',
            },
            events: {
              click: () => {
                // 重置筛选
                tableRef.value?.clearFilter();
              },
            },
          },
        },
        {
          content: t('component.excel.exportModalTitle'),
          buttonRender: {
            name: 'AButton',
            props: {
              auth: 'btn_edit',
            },
            events: {
              click: handleExport,
            },
          },
        },
      ],
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
      return row.insidePartNumber ? '' : 'warning-cell';
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: isCanEdit.value, // 是否启用多区域选取功能
    },
    clipConfig: {
      isPaste: isCanEdit.value,
      afterPasteMethod: handleAfterPaster,
    },
    keyboardConfig: {
      isClip: isCanEdit.value, // 是否开启复制粘贴
      isEdit: isCanEdit.value, // 是否开启任意键进入编辑（功能键除外）
      isDel: isCanEdit.value, // 是否开启删除键功能
      isEsc: isCanEdit.value, // 是否开启Esc键关闭编辑功能
    },
    editRules: {
      nextHandlerId: [
        {
          required: true,
          message: t('common.required'),
        },
      ],
    },
  }));

  async function init(data: any) {
    changeLoading(true);
    isCanEdit.value = typeof data.isCanEdit === 'boolean' ? data.isCanEdit : false;
    await getTableData(data);
    changeLoading(false);
  }

  async function getTableData(data: any): Promise<any[]> {
    let api: Promise<any> | null = null;

    if (data.batchCode) {
      api = getSalesForecastByBatchCode(MODULE_TYPE_ENUM.需求确认, {
        batchCode: data.batchCode,
        mainProcess: data.mainProcess,
        status: isCanEdit.value ? '' : STATUS_ENUM.已确认,
      });
    } else if (data.selectedIds) {
      api = getSalesForecastByIds(data.selectedIds);
    }

    if (!api) {
      return [];
    }

    try {
      const res = await api;
      const tableData: any[] = formatDateilListToShow(res.data ?? [], 'covertedDatas');

      // 收集没有`客服人员`数据的`产品内部料号`，用于获取默认的`客服人员(CustomerPerson)`
      const insidePartNumberList = new Set<string>();
      tableData.forEach(item => {
        if (!item.customerPersonId) {
          insidePartNumberList.add(item.insidePartNumber);
        }
      });

      // 异步获取`产品内部料号`对应的`客服人员(CustomerPerson)`
      const memberRes =
        insidePartNumberList.size > 0
          ? await getMemberList(
              Array.from(insidePartNumberList).map(item => ({
                code: item,
                configType: 'CustomerPerson',
              })),
            )
          : { data: {} };

      const finalData = tableData.map((item: { insidePartNumber: string; customerPersonId?: string; customerPerson?: string }) => {
        const tragetMember = memberRes?.data?.[item.insidePartNumber];

        return {
          nextHandlerId: item.customerPersonId ?? tragetMember?.memberId ?? '',
          nextHandler: item.customerPerson ?? tragetMember?.memberName ?? '',
          ...item,
        };
      });

      if (tableRef.value) {
        tableRef.value.reloadColumn([
          ...detailColumns,
          ...getDynamicsTableColumn(finalData, isCanEdit.value, 'targetDatas'),
          ...(isCanEdit.value ? actionColumns : []),
        ]);

        tableRef.value.reloadData(finalData);
      }

      return finalData;
    } catch (e) {
      console.warn('e:', e);
      return [];
    }
  }

  // const [registerForm, { validate }] = useForm({
  //   schemas: [
  //     {
  //       field: 'startWeek',
  //       label: '开始周',
  //       component: 'WeekPicker',
  //       slot: 'startWeek',
  //     },
  //   ],
  //   labelWidth: 80,
  //   baseColProps: { span: 6 },
  //   actionColOptions: { span: 6 },
  // });

  // const startWeekRegx = /^\d{4}-\d{2}-WK\d$/;
  /**
   * @description 调整起始周
   */
  // async function handleChangeDate() {
  //   const data = await validate();
  //   if (!(data.startWeek && startWeekRegx.test(data.startWeek))) {
  //     return createMessage.warning('请选择开始周');
  //   }

  //   const tableData = tableRef.value?.getTableData()?.tableData || [];

  //   if (tableData.length === 0) {
  //     return false;
  //   }

  //   const orginalAmountKeys = Object.keys(tableData[0].amount)
  //     .filter(v => startWeekRegx.test(v))
  //     .sort((a, b) => {
  //       const [yearA, monthA, weekA] = a.split('-');
  //       const [yearB, monthB, weekB] = b.split('-');
  //       return +yearA * 1000 + +monthA * 10 + +weekA.replace('WK', '') - (+yearB * 1000 + +monthB * 10 + +weekB.replace('WK', ''));
  //     });
  //   const weekList = getModifyWeekList(data.startWeek, orginalAmountKeys.length);
  //   const tableDataSource = cloneDeep(tableData);
  //   tableDataSource.forEach((item: any) => {
  //     const newAmount = {};
  //     weekList.forEach((v, i) => {
  //       newAmount[v] = item.amount[orginalAmountKeys[i]];
  //     });
  //     item.amount = newAmount;
  //   });
  //   if (tableRef.value) {
  //     tableRef.value.reloadColumn([...detailColumns, ...getDynamicsTableColumn(tableDataSource, isCanEdit.value)]);
  //     tableRef.value.loadData(tableDataSource);
  //   }
  // }

  /**
   * @description 获取从起始周开始，往后推 len 周的列表
   * @param startWeek 起始周，格式为 `年-月-WK${当前月的第几周}`，如2025年1月第一周，则传`2025-01-WK1`
   * @param len 获取周的数量
   * @return 周列表，如: `['2025-01-WK2', '2025-01-WK3', '2025-01-WK4', '2025-01-WK5', '2025-02-WK1']`
   */
  // function getModifyWeekList(startWeek: string, len: number) {
  //   const result: Array<string> = [];
  //   // 每个季度的第一个月份([1, 4, 7, 10])分为5周，其他月份分为4周
  //   // 当前月份周数用完了，则进入下一个月分，12月的周数用完了，则进入下一个年分

  //   const [yearStr, monthStr, weekStr] = startWeek.split('-');
  //   let year = parseInt(yearStr, 10);
  //   let month = parseInt(monthStr, 10);
  //   let week = parseInt(weekStr.replace('WK', ''), 10);

  //   const weeksInMonth = (month: number): number => {
  //     return [1, 4, 7, 10].includes(month) ? 5 : 4;
  //   };

  //   for (let i = 0; i < len; i++) {
  //     result.push(`${year}-${String(month).padStart(2, '0')}-WK${week}`);
  //     week++;

  //     if (week > weeksInMonth(month)) {
  //       week = 1;
  //       month++;
  //       if (month > 12) {
  //         month = 1;
  //         year++;
  //       }
  //     }
  //   }
  //   return result;
  // }

  /**
   * @description 提交
   * @param isStorage 是否暂存
   */
  async function handleSubmit(isStorage = false) {
    if (!isStorage && (await tableRef.value?.validate(true))) {
      return false;
    }

    const tableData = tableRef.value?.getTableData()?.fullData || [];

    if (tableData.length === 0) {
      return createMessage.warning(t('common.noDataToSave'));
    }

    const formatData = formatDateilListToSave(tableData, 'covertedDatas');
    const api = isStorage ? temporaryStorageJson(tableData[0].batchCode, formatData) : savePmConfirmAndCalc(tableData[0].mainProcess, formatData);
    changeLoading(true);
    return api
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

  /**
   * @description 删除上传数据
   * @param id 删除的id
   */
  function confirmToDelete(id: string) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: () =>
        delSalesForecast(id)
          .then(res => {
            res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
            emits('reload');
            const data = tableRef.value?.getTableData()?.fullData || [];
            tableRef.value?.reloadData(data.filter(item => item.id !== id));
          })
          .catch(e => {
            console.warn('batch delete e:', e);
          }),
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
        let { field, title } = column;
        if (field === 'nextHandlerId') {
          field = 'nextHandler';
        }
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

  function handleHeaderCellDblclick({ column }) {
    // 匹配出不需要双击的字段
    const exIncludes = tableRef.value
      ?.getColumns()
      .filter(item => {
        return !item?.editRender?.enabled;
      })
      .map(item => item.field) as string[];
    if (exIncludes.includes(column.field)) {
      return false;
    }

    const tableData = tableRef.value?.getTableData()?.fullData || [];
    const targetValue = get(tableData[0], column.field);
    if (!targetValue) {
      return false;
    }

    if (column.field === 'nextHandlerId') {
      const value = { nextHandlerId: tableData[0]['nextHandlerId'], nextHandler: tableData[0]['nextHandler'] };
      tableData.forEach(item => {
        Object.assign(item, value);
      });
    } else {
      tableData.forEach(item => {
        set(item, column.field, targetValue);
      });
    }
  }

  function handleAfterPaster({ targetAreas, pasteCells }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
    const pasteCellData = [...pasteCells];
    if (pasteCellData.length === 1 && rows.length > 1) {
      const target = pasteCells[0];
      pasteCellData.length = 0;
      for (let i = 0; i < rows.length; i++) {
        pasteCellData.push(target);
      }
    }

    handleAfterPasterNextHandler(cols, rows);
    return true;
  }

  /**
   * 客服处理人-复制黏贴处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterNextHandler(cols: Array<{ field: string }>, rows: Array<{ nextHandlerId: string; nextHandler: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'nextHandlerId');
    if (targetIndex == -1 || rows.length === 0) return false;

    const { idList, accountList } = rows.reduce(
      (obj: { idList: Array<string>; accountList: Array<string> }, item: { nextHandlerId: string }) => {
        // 如果是纯数字组成，则是id，否则按照accountList计算
        if (item.nextHandlerId && /^\d+$/.test(item.nextHandlerId)) {
          obj.idList.push(item.nextHandlerId);
        } else if (item.nextHandlerId) {
          const account = item.nextHandlerId.split('/').pop() || '';
          account && obj.accountList.push(account);
        }
        return obj;
      },
      { idList: [], accountList: [] },
    );

    Promise.all([
      idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList.filter(Boolean))]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      rows.forEach((row: any) => {
        const target = userList.find(item => item.id === row.nextHandlerId || item.fullName === row.nextHandlerId);
        Object.assign(row, { nextHandlerId: target?.id || '', nextHandler: target?.fullName || '' });
      });
    });
  }
</script>

<style scoped lang="less">
  :deep(.warning-cell) {
    color: #70541c;
    background-color: #fffbe5;
  }
</style>
