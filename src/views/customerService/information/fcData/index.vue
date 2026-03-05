<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content vxe-table bg-white">
        <Grid>
          <template #toolbar-actions>
            <!-- <a-button v-auth="'btn_add'" type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()">{{ t('common.add') }} </a-button> -->
            <a-button v-auth="'btn_edit'" type="primary" @click="handleFCChange">{{ t('common.FCupdate') }} </a-button>
            <a-button v-auth="'btn_push3.8'" type="primary" ghost @click="handleSendDataTo3_8">{{ t('common.push3.8') }} </a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button type="primary" ghost v-auth="'btn_productCategory'" @click="handleProductCategory"
              >{{ t('dict.FcDataColumn.productCategory') }}
            </a-button>
            <a-button type="primary" ghost v-auth="'btn_stop'" danger @click="handleStop">{{ t('common.stopText') }} </a-button>
            <a-button type="primary" ghost v-auth="'btn_priceExport'" @click="batchImportOrExport({ key: 'priceExport' })"
              >{{ t('dict.CommonCol.priceExport') }}
            </a-button>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="refreshTable" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload"></ImportModal>
    <ProductCategoryInfo @register="registerProductCategory" @reload="refreshTable"></ProductCategoryInfo>
    <changePopup @register="registerChangePopup" @reload="refreshTable"></changePopup>
    <StopModal @register="registerStopModal" @reload="reload"></StopModal>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import {
    getFcData,
    deleteFcData,
    exportFcDataExcel,
    importPreview,
    importSave,
    templateDownload,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
    isImported,
    fcStop,
    SendDataTo3_8,
  } from '/@/api/customerSerivce/fcData';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { isFunction } from 'lodash-es';
  import changePopup from './components/changePopup.vue';
  import add from './components/add.vue';
  import { columns, importColumns, getWeekTitle } from './components/config';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from '/@/components/CustomComponents/src/fc/ImportModal.vue';
  import ProductCategoryInfo from './components/productCategoryModal.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { StopModal } from '/@/components/CustomComponents';
  import { useBaseStore } from '/@/store/modules/base';
  dayjs.extend(isoWeek);
  const { hasBtnP } = usePermission();
  const baseStore = useBaseStore();

  const { t } = useI18n();

  defineOptions({ name: 'customerService-information-fcData' });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openPopup: openImportPopup }] = usePopup();
  const [registerProductCategory, { openModal: openProductCategory }] = useModal();
  const [registerChangePopup, { openPopup: openChangePopup }] = usePopup();
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  const searchFormSchema = [
    {
      fieldName: 'searchDate',
      label: '',
      component: 'WeekPicker',
      componentProps: {
        placeholder: t('dict.FcDataColumn.searchDate'),
        // valueFormat: 'YYYY-ww',
      },
      // rules: [{ required: true, trigger: 'blur', message: '必填' }],
      // colProps: { span: 4 },
    },
    {
      fieldName: 'factoryArea',
      label: '',
      i18nField: 'factoryAreaName',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        // placeholder: '请输入产地',
      },
      // colProps: { span: 4 },
    },
    {
      fieldName: 'innerMaterialNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        // placeholder: '请输入内部编号',
      },
    },
    {
      fieldName: 'customerPerson',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        // placeholder: '客服',
      },
    },
    {
      fieldName: 'push3_8',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('YesOrNo', true),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        placeholder: '是否推送3.8',
        allowClear: true,
      },
    },
    {
      fieldName: 'rePush3_8',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('YesOrNo', true),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        placeholder: '是否补推3.8',
        allowClear: true,
      },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: searchFormSchema,
      handleSubmit: reloadTable,
      handleReset: reset,
      i18nConfig: {
        moduleCode: 'FcDataColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'customerService-information-fcData',
      columns: [],
      api: getFcData,
      footerCellClassName: 'vxe-foot-data-cell',
      proxyConfig: {
        autoLoad: false,
        response: {
          result: 'data.pageData.list',
          total: 'data.pageData.pagination.total',
        },
      } as any,
      afterFetch: result => {
        if (!result || !result.summaryData) {
          gridApi.setState({
            gridOptions: {
              footerData: [],
            },
          });
          return;
        }
        const { summaryData } = result;
        // 设置表尾数据
        const footerData = columns.reduce((pre, cur) => {
          const { field, formatter } = cur;
          if (isFunction(formatter)) {
            return {
              ...pre,
              [field]: formatter({ cellValue: summaryData[field] }),
            };
          }
          return {
            ...pre,
            [field]: summaryData[field],
          };
        }, {});
        gridApi.setState({
          gridOptions: {
            footerData: [footerData],
          },
        });
      },
      beforeFetch: params => {
        const { searchDate } = params;
        // if (searchDate.includes('WK')) return params;
        // const year = searchDate.split('-')[0];
        // const week = searchDate.split('-')[1];
        // params.searchDate = `${year}WK${week}`;
        // return params;
        const weeksDayjs = dayjs(searchDate);
        return {
          ...params,
          searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
      },
      i18nConfig: {
        // moduleCode: 'FcDataColumn',
      },
      showIndexColumn: true,
    },
  });

  const {
    query: reload,
    clearSelectedRowKeys,
    getSelectRows,
    getFetchParams,
    getFromValue: getFieldsValue,
    setState,
    setLatestSubmissionValues,
    setFieldValue,
    resetForm,
  } = gridApi;

  async function reset() {
    await resetForm();
    // const fields = await getFieldsValue();
    // const thursday = getTargetThursday();
    const now = dateUtil();
    setFieldValue('searchDate', now);
    reloadTable();
  }

  async function reloadTable() {
    const fields = await getFieldsValue();
    setLatestSubmissionValues(fields);
    if (!fields.searchDate) return reload();
    // const data = fields.searchDate.split('-');
    const weeksDayjs = dayjs(fields.searchDate);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    const data = yearWeekFormat.split('WK');
    // 修改列名
    const year = Number.parseInt(data[0], 10);
    const week = Number.parseInt(data[1], 10);
    // 使用 dayjs 根据年份和周数获取该周的第一天
    const date = dayjs().year(year).isoWeek(week).startOf('isoWeek');
    let nowColumns = columns.map(item => {
      if (item.field.startsWith('quantity') || item.field.startsWith('totalPrice')) {
        const idx = item.field.replace('quantity', '').replace('totalPrice', '');
        return {
          ...item,
          title: getWeekTitle(date, Number.parseInt(idx, 10) - 1),
        };
      }
      return item;
    });
    setState({
      gridOptions: {
        columns: nowColumns,
      },
    });
    //刷新表格数据
    reload();
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  async function addOrUpdateHandle(record = '') {
    const { searchDate } = await getFieldsValue();
    if (!searchDate) {
      return message.warning(t('dict.FcDataColumn.selectSearchDateTip'));
    }
    reloadTable(); //刷新一次表格 刷新表格的表头
    // const year = searchDate.split('-')[0];
    // const week = searchDate.split('-')[1];
    const weeksDayjs = dayjs(searchDate);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    const year = yearWeekFormat.split('WK')[0];
    const week = yearWeekFormat.split('WK')[1];
    openFormModal(true, { record, searchDate: `${year}WK${week}` });
  }

  // 产品类别弹窗
  function handleProductCategory(row) {
    openProductCategory(true, {});
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteFcData(record.dataId).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  // 终止
  function handleStop() {
    const selectedRows = getSelectRows();
    if (!selectedRows || selectedRows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    if (selectedRows.some(item => [-1, 3, 6].includes(item.auditStatus))) {
      return message.warning(t('只有在途数据才能进行终止'));
    }
    const idList = selectedRows.map(item => item.dataId);
    openStopModal(true, {
      idList,
      api: fcStop,
      beforeFetch: params => {
        return {
          dataIds: idList,
          remark: params.remark,
        };
      },
    });
  }

  // 推送3.8
  function handleSendDataTo3_8() {
    const selectedRows = getSelectRows();
    if (!selectedRows || selectedRows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    const params = selectedRows.map(item => {
      return {
        dataId: item.dataId,
        factory: item.factory,
        factoryArea: item.factoryArea,
        project: item.project,
        innerMaterialNumber: item.innerMaterialNumber,
        currentWeek: item.currentWeek,
        currentYear: item.currentYear,
      };
    });
    SendDataTo3_8(params).then(res => {
      createMessage.success(res.msg);
      refreshTable();
    });
  }

  // FC变更
  function handleFCChange() {
    const selectedRows = getSelectRows();
    if (selectedRows.length === 0) {
      return message.warning(t('common.selectText'));
    }
    if (selectedRows.some(item => item.auditStatus != 3)) {
      return message.warning(t('只有已完成的数据才能进行变更'));
    }
    openChangePopup(true, {
      records: selectedRows,
    });
  }

  function batchImportOrExport({ key }) {
    //改成if else，参数 加了priceExport，根据key判断是导入还是导出还是价格导出
    if (key == 'import') {
      return handleImport();
    } else if (key === 'priceExport') {
      return handleExport(true);
    } else {
      handleExport();
    }
  }

  //导入
  async function handleImport() {
    const { searchDate } = await getFieldsValue();
    if (!searchDate) {
      return message.warning(t('dict.FcDataColumn.selectSearchDateTip'));
    }
    // const year = searchDate.split('-')[0];
    // const week = searchDate.split('-')[1];
    const weeksDayjs = dayjs(searchDate);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    const year = yearWeekFormat.split('WK')[0];
    const week = yearWeekFormat.split('WK')[1];
    const queryData = { searchDate: `${year}WK${week}` };
    // 如果选择的周数早于上周，则不允许导入，只允许导入上周及以后的周数
    // const selectedWeekEnd = weeksDayjs.endOf('week');
    // const lastWeekEnd = dayjs().subtract(1, 'week').endOf('week');

    // if (selectedWeekEnd.isBefore(lastWeekEnd)) {
    //   return message.warning(t('不允许导入上周之前的数据'));
    // }
    isImported(queryData).then(res => {
      if (res.code == 200) {
        if (res.data) {
          createConfirm({
            iconType: 'warning',
            title: t('common.tipTitle'),
            content: t('dict.FcDataColumn.importTip'),
            onOk: async () => {
              openImportFun(searchDate);
            },
          });
        } else {
          openImportFun(searchDate);
        }
      } else {
        createMessage.error(res.msg);
      }
    });
  }

  function openImportFun(searchDate) {
    reloadTable(); //刷新一次表格 刷新表格的表头
    // const year = searchDate.split('-')[0];
    // const week = searchDate.split('-')[1];
    const weeksDayjs = dayjs(searchDate);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    const year = yearWeekFormat.split('WK')[0];
    const week = yearWeekFormat.split('WK')[1];
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: templateDownload,
      previewColumn: importColumns,
      excludeFields: ['batchNumber', 'auditStatus', 'push3_8', 'rePush3_8', 'currentProcessorName', 'currentNode'],
      usePolling: true,
      pollingParams: {
        interval: 5000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: {
        importSave: {
          searchDate: `${year}WK${week}`,
        },
      },
    });
  }

  //导出
  async function handleExport(priceExport = false) {
    const { searchDate } = await getFieldsValue();
    if (!searchDate) {
      return message.warning(t('dict.FcDataColumn.selectSearchDateTip'));
    }
    // let searchDateValue = searchDate;
    // if (searchDateValue && !searchDate.includes('WK')) {
    //   const year = searchDate.split('-')[0];
    //   const week = searchDate.split('-')[1];
    //   searchDateValue = `${year}WK${week}`;
    // }
    const weeksDayjs = dayjs(searchDate);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    let searchDateValue = yearWeekFormat;
    if (searchDateValue && !yearWeekFormat.includes('WK')) {
      const year = yearWeekFormat.split('WK')[0];
      const week = yearWeekFormat.split('WK')[1];
      searchDateValue = `${year}WK${week}`;
    }

    let params: any = {
      ...getFetchParams(),
      searchDate: searchDateValue,
    };
    priceExport && (params.exportType = 2);
    openExportModal(true, {
      api: exportFcDataExcel,
      listQuery: params,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  // function getTargetThursday() {
  // const now = dateUtil();
  // const currentIsoWeekday = now.isoWeekday(); // 1-7 (周一到周日)
  // let isInRange = false;
  // if (currentIsoWeekday === 4) {
  //   // 周四
  //   const cutoff = now.set('hour', 8).set('minute', 30).set('second', 0);
  //   if (now.isAfter(cutoff)) {
  //     isInRange = true;
  //   }
  // } else if (currentIsoWeekday === 5 || currentIsoWeekday === 6) {
  //   // 周五、周六
  //   isInRange = true;
  // } else if (currentIsoWeekday === 7) {
  //   // 周日
  //   const endOfSunday = now.endOf('day');
  //   if (now.isBefore(endOfSunday) || now.isSame(endOfSunday)) {
  //     isInRange = true;
  //   }
  // }
  // 获取当前周的周四
  // let thursday = now.isoWeekday(4);
  // 如果不在范围内，取上周四
  // if (!isInRange) {
  //   thursday = thursday.subtract(7, 'day');
  // }
  // return thursday;
  // }

  function refreshTable() {
    reload();
    clearSelectedRowKeys();
  }

  onMounted(async () => {
    // const thursday = getTargetThursday();
    // setFieldValue('searchDate', thursday.format('YYYY-ww'));
    const now = dateUtil();
    setFieldValue('searchDate', now);
    reloadTable();
  });
</script>

<style lang="less" scoped>
  :deep(.vxe-table) {
    .vxe-foot-data-cell {
      font-weight: bold;
      color: #000;
      text-align: right;
      background-color: rgb(255 123 0 / 20%);
    }
  }
</style>
