<script lang="ts" setup>
  import { useVbenForm } from '/@/adapter/form';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { dateUtil } from '/@/utils/dateUtil';
  import { isEmpty, isExist, isNullOrUnDef, isObject } from '/@/utils/is';
  import { get, cloneDeep } from 'lodash-es';
  import { onMounted, reactive, toRefs, ref, nextTick, watch } from 'vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { ActionItem, TableAction } from '/@/components/Table';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';

  import { getSchema as getCommonSchema, getDDSchema, getColumns as getInsColumns, getImportColumns } from '../detectionData/config';
  import { getColumns as getDDColumns } from '../detectionData/config';

  import ImportModal from '../inspectRecord/ImportModal.vue';
  import RemarkModal from '../inspectData/RemarkModal.vue';
  import DetailPopup from '../detectionData/components/DetailPopup.vue';
  import { ImportModal as DDImportModal } from '/@/components/ImportModal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { PreviewModal } from '/@/components/Upload';
  import { thousandsFormat } from '/@/utils/lydc';

  import {
    downloadInspectImportTemplate,
    importInspectData,
    getInspectDataList,
    getInspectDataAnalysis,
    getQcOperationList,
    setRemark,
    getProductList,
    getProductDetail,
    deleteProductDetail,
    updateProductDetail,
    importPreview,
    importTaskSave,
    downloadImportTemplate,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
    changeStatus,
  } from '/@/api/engineering/detectionData';

  import { registerMouseEvent, handleUnpack } from '/@/views/engineering/quotationBom/utils';

  const { t } = useI18n();
  const { createConfirm, createMessage } = useMessage();
  const { hasBtnP } = usePermission();

  defineOptions({ name: 'engineering-basicInformation-inspect-merged' });

  const state = reactive({
    activeTab: 'detectionData',
    inspectLoading: false,
    inspectDefaultColumns: [],
    inspectDataLoading: false,
    inspectDataDefaultColumns: [],
    ddLoading: false,
    isPack: true,
    loadingBom: false,
    codeList: [],
    activeId: '',
    ddMouseRegistered: false,
    finalProductCode: '',
    tempProductCode: '',
    ddColumnFields: [] as string[],
    checkList: ['hasRecord', 'hasAvg', 'hasTolAvg'],
    versionList: [],
    currentVersion: null,
  });

  let avgArgsBack = ['hasRecord', 'hasAvg', 'hasTolAvg'];

  const { isPack, loadingBom, codeList, activeId, hasRecord, hasAvg, hasTolAvg } = toRefs(state);

  const FIXED_OPERATION_ID = '0';
  const OPERATION_ZERO_BG = 'rgb(255, 242, 229)';
  const FIXED_SEQ_VALUES = ['DIMENSION', 'TOLERANCE +', 'TOLERANCE -'];

  const inspectMergeFields = ['operationTime', 'operation'];
  const inspectSpanMap = ref<Record<string, Record<number, { rowspan: number; colspan: number }>>>({});
  const inspectSpanMethod = ({ column, rowIndex }) => {
    const field = column.field;
    if (!field || !inspectMergeFields.includes(field)) {
      return { rowspan: 1, colspan: 1 };
    }
    return inspectSpanMap.value[field]?.[rowIndex] || { rowspan: 1, colspan: 1 };
  };

  const ddMergeFields = ['creatorUserName', 'creatorTime'];
  const ddSpanMethod = ({ row, column }) => {
    const rowField = row?.__field;
    const field = column.field;
    if (!rowField || !field || !ddMergeFields.includes(rowField)) {
      return { rowspan: 1, colspan: 1 };
    }
    if (field === 'col0') return { rowspan: 1, colspan: 1 };
    const columnFields = state.ddColumnFields || [];
    const colIndex = columnFields.indexOf(field);
    if (colIndex === -1) return { rowspan: 1, colspan: 1 };
    if (colIndex > 0) {
      const prevField = columnFields[colIndex - 1];
      if (row[prevField] === row[field]) {
        return { rowspan: 0, colspan: 0 };
      }
    }
    let colspan = 1;
    for (let i = colIndex + 1; i < columnFields.length; i++) {
      const nextField = columnFields[i];
      if (row[nextField] === row[field]) {
        colspan++;
      } else {
        break;
      }
    }
    return { rowspan: 1, colspan };
  };

  const inspectDataMergeFields = ['operationTime', 'operation', 'remark', 'creatorTime', 'creatorUserName'];
  const inspectDataSpanMethod = ({ row, column, rowIndex, visibleData }) => {
    const field = column.field;
    const data = visibleData || [];
    if (!field || !inspectDataMergeFields.includes(field)) {
      return { rowspan: 1, colspan: 1 };
    }
    const operationId = row?.operationid;
    if (!operationId || String(operationId).length <= 10) {
      return { rowspan: 1, colspan: 1 };
    }
    const prevRow = data[rowIndex - 1];
    if (prevRow && prevRow.operationid === operationId && prevRow[field] === row[field]) {
      return { rowspan: 0, colspan: 0 };
    }
    let rowspan = 1;
    for (let index = rowIndex + 1; index < data.length; index++) {
      const nextRow = data[index];
      if (!nextRow || nextRow.operationid !== operationId || nextRow[field] !== row[field]) {
        break;
      }
      rowspan++;
    }
    return { rowspan, colspan: 1 };
  };

  function buildInspectSpan(list: Record<string, any>[]) {
    const spanMap: Record<string, Record<number, { rowspan: number; colspan: number }>> = {};
    inspectMergeFields.forEach(field => (spanMap[field] = {}));
    if (!Array.isArray(list) || list.length === 0) {
      inspectSpanMap.value = spanMap;
      return;
    }
    inspectMergeFields.forEach(field => {
      let start = 0;
      const len = list.length;
      while (start < len) {
        let end = start + 1;
        while (end < len && list[end]?.productCode === list[start]?.productCode && list[end]?.[field] === list[start]?.[field]) {
          end++;
        }
        const span = end - start;
        spanMap[field][start] = { rowspan: span, colspan: 1 };
        for (let i = start + 1; i < end; i++) {
          spanMap[field][i] = { rowspan: 0, colspan: 0 };
        }
        start = end;
      }
    });
    inspectSpanMap.value = spanMap;
  }

  function isOperationZeroRow(row: Record<string, any> = {}) {
    return String(row?.operationid ?? '') === FIXED_OPERATION_ID;
  }

  function isFixedInspectRow(row: Record<string, any> = {}) {
    // const seqValue = row?.['seqNo|FAI#'] ?? '';
    return isOperationZeroRow(row);
  }

  function sortInspectList(list: Record<string, any>[]) {
    if (!Array.isArray(list)) return [];
    const fixedRows: Record<string, any>[] = [];
    const normalRows: Record<string, any>[] = [];
    list.forEach(item => {
      if (isFixedInspectRow(item)) {
        fixedRows.push(item);
      } else {
        normalRows.push(item);
      }
    });
    return [...fixedRows, ...normalRows];
  }

  async function getFormValuesWithPercent() {
    const values = cloneDeep(await formApi.getValues());
    if (!isNullOrUnDef(values?.worningThreshold)) {
      values.worningThreshold = Number(values.worningThreshold) / 100;
    }
    return values;
  }

  const [DDForm, ddFormApi] = useVbenForm({
    collapsed: true,
    // showCollapseButton: true,
    submitOnChange: false,
    submitOnEnter: true,
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    submitButtonOptions: {
      content: '查询',
    },
    handleReset: async () => {
      await ddFormApi.setValues({
        time: [],
        productCode: '',
        remark: '',
      });
      triggerFetchByTab();
    },
    handleSubmit: triggerFetchByTab,
    wrapperClass: 'grid grid-cols-5 gap-4',
    schema: getDDSchema(),
  });

  const [Form, formApi] = useVbenForm({
    collapsed: true,
    // showCollapseButton: true,
    submitOnChange: false,
    submitOnEnter: true,
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    submitButtonOptions: {
      content: '查询',
    },
    handleReset: async () => {
      await formApi.setValues({
        time: [],
        productCode: '',
        remark: '',
      });
      triggerFetchByTab();
    },
    handleSubmit: async () => {
      await fetchproductList(state.tempProductCode || state.finalProductCode);
      state.finalProductCode = state.tempProductCode || state.finalProductCode;
      state.activeId = state.tempProductCode || state.activeId;

      triggerFetchByTab();
    },
    wrapperClass: 'grid grid-cols-5 gap-4',
    schema: getCommonSchema(state),
  });

  const [registerInspectImportModal, { openModal: openInspectImportModal }] = useModal();
  const [registerRemarkModal, { openModal: openRemarkModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerDDImportPop, { openPopup: openDDImportPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const bomContent = ref<HTMLElement | null>(null);
  const mainContent = ref<HTMLElement | null>(null);
  const divider = ref(null);
  const container = ref(null);
  const filePreviewRef = ref<any | null>(null);
  const bomClickTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  const [InspectGrid, $inspectGrid] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-basicInformation-inspect',
      columns: getInsColumns().filter((c: any) => c.field !== 'id'),
      scrollX: { enabled: false },
      scrollY: { enabled: false },
      spanMethod: inspectDataSpanMethod,
      rowConfig: { height: 32 },
      rowClassName: ({ row }) => {
        const classes: string[] = [];
        if (isFixedInspectRow(row)) classes.push('inspect-grid__fixed-row');
        if (isOperationZeroRow(row)) classes.push('inspect-grid__op-zero');
        return classes.join(' ');
      },
      rowStyle: ({ row, rowIndex }) => {
        const baseStyle = isOperationZeroRow(row) ? { background: OPERATION_ZERO_BG } : {};
        if (!isFixedInspectRow(row)) return baseStyle;
        return {
          ...baseStyle,
          position: 'sticky',
          top: `calc(var(--inspect-fixed-row-height, 40px) * ${rowIndex})`,
          zIndex: 5,
        };
      },
      cellStyle: ({ row }) => {
        if (!isFixedInspectRow(row)) return {};
        return {
          height: '25px',
          lineHeight: '25px',
        };
      },
      menuConfig: {
        body: {
          options: [
            [
              { code: 'enabled', name: '启用' },
              { code: 'disabled', name: '禁用' },
              { code: 'download', name: '查看图片' },
            ],
          ],
        },
      },
      clipConfig: {
        isPaste: false, // 是否启用粘贴功能
        copyMethod: handleRecallCopyMethod,
      },
    },
    gridEvents: {
      menuClick: handleInspectCellKeydown,
    },
  });
  const [InspectEmptyGrid] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-basicInformation-inspect-empty',
      columns: getInsColumns().filter((c: any) => c.field !== 'id'),
    },
  });

  const { setGridOptions: setInspectGridOptions, getFetchParams: getInspectFetchParams, recalculate: recalcInspect } = $inspectGrid;

  const [InspectDataGrid, $inspectDataGrid] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-basicInformation-inspectData',
      columns: getInsColumns().filter((c: any) => c.field !== 'id'),
      scrollX: { enabled: false },
      scrollY: { enabled: false },
      spanMethod: inspectDataSpanMethod,
      // spanMethod(data) {
      //   const { row, $rowIndex: rowIndex, column, visibleData } = data;
      //   const spanFields = [
      //     'remark',
      //     'creatorUserName',
      //     'operationTime',
      //     'operation',
      //     // 'creatorTime',
      //   ];
      //   const diffField = 'id';
      //   const cellValue = row[diffField];

      //   if (cellValue && spanFields.includes(column.field)) {
      //     const prevRow = visibleData[rowIndex - 1];

      //     // 如果上一行存在且相同，则合并到首行
      //     if (prevRow && prevRow[diffField] === cellValue) {
      //       return { rowspan: 0, colspan: 0 };
      //     }

      //     // 计算连续相同值的行数
      //     let countRowspan = 1;
      //     while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
      //       countRowspan++;
      //     }

      //     if (countRowspan > 1) {
      //       return { rowspan: countRowspan, colspan: 1 };
      //     }
      //   }
      // }
    },
  });
  const { setGridOptions: setInspectDataGridOptions, getFetchParams: getInspectDataFetchParams, recalculate: recalcInspectData } = $inspectDataGrid;

  const [DDGrid, $ddGrid] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-basicInformation-detectionData',
      columns: getDDColumns(),
      spanMethod: ddSpanMethod,
      rowConfig: { height: 32 },
    },
    gridEvents: {
      pageChange: () => fetchDDData(),
      headerCellDblclick: handleDel,
    },
  });
  const { getFetchParams: getDDFetchParams, setLoading: setDDLoading, setGridOptions: setDDGridOptions } = $ddGrid;

  // 22222222222222222222222
  async function fetchInspect() {
    if (state.finalProductCode && state.finalProductCode !== state.activeId) {
      await fetchproductList(state.finalProductCode);
      // const { productId } = await formApi.getValues()
      // if(productId) {
      //   state.currentVersion = productId
      // }
    }
    state.inspectLoading = true;
    setInspectGridOptions({ columns: [], data: [] });
    const params = await getInspectFetchParams();
    const formValues = await getFormValuesWithPercent();
    // state.finalProductCode = formValues.productId || '';
    // if (!state.finalProductCode) return (state.inspectLoading = false);
    const porductId = formValues.productId || '';
    if (!porductId) return (state.inspectLoading = false);
    const { time } = formValues;
    if (isExist(time) && time.length === 2) {
      formValues.operationTimeStart = dateUtil(time[0]).startOf('day').valueOf();
      formValues.operationTimeEnd = dateUtil(time[1]).endOf('day').valueOf();
    }
    state.inspectDefaultColumns = [];
    const args = {};
    state.checkList.forEach(item => {
      args[item] = '1';
    });

    if (!state.checkList.includes('hasRecord')) {
      delete formValues.worningThreshold;
    }
    getInspectDataAnalysis({
      ...params,
      ...formValues,
      ...args,
    }).then(({ code, data }) => {
      if (code === 200) {
        let list = data?.list || [];
        if (isEmpty(list)) {
          setInspectGridOptions({ columns: getInsColumns().filter((c: any) => c.field !== 'id') });
          buildInspectSpan([]);
          state.inspectLoading = false;
          return;
        }
        const headers = Object.keys(list[0]).filter(key => key !== 'id');
        const columns = headers
          .map(item => {
            const target: any = { title: item, field: item, width: 60 };
            if (item !== 'id' && item !== 'operationTime' && item !== 'operation' && item !== 'seqNo|FAI#') {
              target.slots = { default: `inspect_default_${item}` };
            }
            if (item === 'productCode') target.title = '产品内部料号';
            else if (item === 'id') {
              target.title = 'ID';
              target.fixed = 'left';
            } else if (item === 'seqNo|FAI#') {
              // target.width = 100;
              delete target.width;
              target.minWidth = '';
            } else if (item === 'operationTime') {
              target.title = '调试日期';
              target.fixed = 'left';
              target.width = 120;
              // target.minWidth = '';
              delete target.width;
            } else if (item === 'operation') {
              target.title = '调试内容';
              target.width = 150;
              // target.minWidth = '';
              delete target.width;
              target.fixed = 'left';
            } else if (item === 'creatorUserName') {
              target.title = '创建人';
              // target.width = 220;
              delete target.width;
              target.minWidth = '';
            } else if (item === 'creatorTime') {
              target.title = '创建时间';
              // target.width = 160;
              delete target.width;
              target.minWidth = '';
            }
            // else if (item === 'FAI#') target.title = '检测类别';
            return target;
          })
          .filter(item => item.field !== 'operationid');
        state.inspectDefaultColumns = headers.filter(item => item !== 'operationid' && item !== 'operation' && item !== 'seqNo|FAI#');
        let sortedList = sortInspectList(list);
        if (isEmpty(state.inspectDefaultColumns)) {
          state.inspectDefaultColumns = columns;
          sortedList = [];
        }
        buildInspectSpan(sortedList);
        state.inspectLoading = false;
        nextTick(() => {
          setInspectGridOptions({
            columns,
            data: sortedList,
            // spanMethod: inspectSpanMethod,
            pagerConfig: {
              total: data.pagination.total || 0,
              pageSize: data.pagination.pageSize || 1,
              page: data.pagination.currentPage || 1,
            },
          });
          recalcInspect();
        });
      } else {
        state.inspectLoading = false;
      }
    });
  }

  // 3333333333333333333
  async function fetchInspectData() {
    state.inspectDataLoading = true;
    setInspectDataGridOptions({ columns: [], data: [] });
    const params = await getInspectDataFetchParams();
    const formValues = await getFormValuesWithPercent();
    state.finalProductCode = formValues.productCode || '';
    if (!state.finalProductCode) return (state.inspectDataLoading = false);
    const { time } = formValues;
    if (isExist(time) && time.length === 2) {
      formValues.operationTimeStart = dateUtil(time[0]).startOf('day').valueOf();
      formValues.operationTimeEnd = dateUtil(time[1]).endOf('day').valueOf();
    }
    state.inspectDataDefaultColumns = [];
    getInspectDataAnalysis({
      ...params,
      ...formValues,
      hasRecord: state.hasRecord,
      hasAvg: state.hasAvg,
      hasTolAvg: state.hasTolAvg,
    }).then(({ code, data }) => {
      if (code === 200) {
        let list = data?.list || [];
        if (isEmpty(list)) {
          state.inspectDataLoading = false;
          setInspectDataGridOptions({ columns: getInsColumns().filter((c: any) => c.field !== 'id' && c.field !== 'operationid') });
          return;
        }
        const headers = Object.keys(list[0]).filter(key => key !== 'id');
        const columns = headers
          .map(item => {
            const target: any = { title: item, field: item, width: 60 };
            if (item !== 'id' && item !== 'operationTime' && item !== 'operation' && item !== 'seqNo|FAI#') {
              target.slots = { default: `inspectData_default_${item}` };
            }
            if (item === 'id') {
              target.title = 'ID';
              target.fixed = 'left';
            } else if (item === 'operationTime') {
              target.title = '调试日期';
              target.fixed = 'left';
              target.width = 120;
            } else if (item === 'seqNo|FAI#') {
              // target.fixed = 'left';
              target.width = 100;
            } else if (item === 'operation') {
              target.title = '调试内容';
              target.width = 150;
              target.fixed = 'left';
            } else if (item === 'creatorUserName') {
              target.title = '创建人';
              target.width = 220;
            } else if (item === 'creatorTime') {
              target.title = '创建时间';
              target.width = 160;
            }
            // else if (item === 'FAI#') target.title = '检测类别';
            return target;
          })
          .filter(item => item.field !== 'operationid');
        state.inspectDataDefaultColumns = headers.filter(item => item !== 'id' && item !== 'operation');
        if (isEmpty(state.inspectDataDefaultColumns)) {
          state.inspectDataDefaultColumns = columns;
          list = [];
        }
        state.inspectDataLoading = false;
        nextTick(() => {
          setInspectDataGridOptions({
            columns,
            data: list,
            pagerConfig: {
              total: data.pagination.total || 0,
              pageSize: data.pagination.pageSize || 1,
              page: data.pagination.currentPage || 1,
            },
          });
          recalcInspectData();
        });
      } else {
        state.inspectDataLoading = false;
      }
    });
  }

  function handleRemark(row) {
    openRemarkModal(true, { api: setRemark, ids: row.operationid, remark: row?.remark || null });
  }

  // function handleInspectCellKeydown({ row, column, $event }) {
  function handleInspectCellKeydown({ menu, column, row }) {
    const { code } = menu;
    const { field } = column;
    const data = row[field];
    if (code === 'enabled') {
      if (row['seqNo|FAI#'] === '平均值偏差' || row['seqNo|FAI#'] === '实测平均值') return createMessage.warning('当前数据不可启用');
      if (isNullOrUnDef(data?.id)) return createMessage.warning('当前数据不可启用');
      // 启用
      changeStatus({
        id: data.id,
        enabledMark: 1,
      }).then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          triggerFetchByTab();
        }
      });
    } else if (code === 'disabled') {
      if (row['seqNo|FAI#'] === '平均值偏差' || row['seqNo|FAI#'] === '实测平均值') return createMessage.warning('当前数据不可禁用');
      if (isNullOrUnDef(data?.id)) return createMessage.warning('当前数据不可禁用');
      // 禁用
      changeStatus({
        id: data.id,
        enabledMark: 0,
      }).then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          triggerFetchByTab();
        }
      });
    } else if (code === 'download') {
      if (!data.imgPath) return createMessage.warning('当前单元格无数据');
      const params = {
        url: data.imgPath,
        name: data.imgPath.split('/').pop(),
        previewType: 'localPreview',
        noCache: false,
        isCopy: 0,
        version: 2,
      };
      filePreviewRef.value?.init(params);
    }
  }

  function handleDownloadTemp() {
    let _params: any = '';
    downloadInspectImportTemplate(_params).then(res => {
      downloadByUrl({ url: res?.data?.url });
    });
  }

  const customRequest = async info => {
    const params = { file: info.file, fileName: info.file.name };
    importInspectData(params).then(() => {});
  };

  function reloadDDData(list) {
    const colFields = Array.isArray(list) ? list.map((_, index) => `col${index + 1}`) : [];
    state.ddColumnFields = colFields;
    const cols = getDDColumns().filter(item => item.field !== 'checkbox' && item.field !== 'faiNo');
    const buildlist = cols.map(column => {
      const item: any = { col0: column.title, __field: column.field };
      list.forEach((row, index) => {
        if (column.field === 'isEnabled') item[`col${index + 1}`] = row[column.field] == 1 ? '启用' : '禁用';
        else if (column.field === 'creatorTime') item[`col${index + 1}`] = dateUtil(row[column.field]).format('YYYY-MM-DD HH:mm:ss');
        else item[`col${index + 1}`] = row[column.field];
      });
      return item;
    });
    const buildColumns: any[] = [{ field: 'col0', fixed: 'left', minWidth: '', width: 100 }];
    list.forEach((item, index) => {
      buildColumns.push({ field: `col${index + 1}`, title: item.faiNo, minWidth: '', width: 100, slots: { header: 'headerSlot' } });
    });
    setDDGridOptions({ columns: buildColumns, data: buildlist });
  }

  async function fetchDDData(id?) {
    setDDGridOptions({
      pagerConfig: {},
    });
    const params = await getDDFetchParams();
    const formValues = cloneDeep(await ddFormApi.getValues());
    if (!formValues.productCode) state.activeId = '';
    state.finalProductCode = formValues.productCode || '';
    const { time } = formValues;
    if (isExist(time) && time.length === 2) {
      formValues.creatorTimeStart = dateUtil(time[0]).startOf('day').valueOf();
      formValues.creatorTimeEnd = dateUtil(time[1]).endOf('day').valueOf();
    }
    delete formValues.time;
    setDDLoading(true);
    state.loadingBom = true;
    getProductList({ ...params, ...formValues }).then(({ code, data }) => {
      state.loadingBom = false;
      if (code !== 200) {
        createMessage.error('获取列表数据失败');
        reloadDDData([]);
        return;
      }
      const bomList = (data.list || []).map(item => ({ ...item, id: item.productCode, code: item.productCode }));
      if (isEmpty(bomList)) return setDDLoading(false);
      setDDGridOptions({
        pagerConfig: {
          total: data.pagination.total || 0,
          pageSize: data.pagination.pageSize || 1,
          page: data.pagination.currentPage || 1,
        },
      });
      state.codeList = bomList;
      if (!state.activeId) {
        state.activeId = bomList[0]?.id || '';
      }
      // if(state.finalProductCode){
      //   state.activeId = state.finalProductCode
      // }
      let versionList;
      if (!isObject(id) && isExist(id)) {
        state.activeId = id;
        const index = state.codeList.findIndex(item => item.id === id);
        versionList = get(data, `list.${index}.versionItems`, []);
      } else {
        versionList = get(data, 'list.0.versionItems', []);
      }
      state.versionList = versionList;
      state.currentVersion = versionList[0]?.id;
      getProductDetailList();
    });
  }

  function fetchproductList(productCode) {
    return new Promise(res => {
      return getProductList({
        productCode,
      }).then(async ({ code, data }) => {
        if (code === 200) {
          const bomList = (data.list || []).map(item => ({ ...item, id: item.productCode, code: item.productCode }));
          const { productId } = await formApi.getValues();
          if (productId) state.currentVersion = productId;
          const versionList = bomList[0].versionItems;
          state.versionList = versionList;
          res({});
        }
      });
    });
  }

  function getProductDetailList(productId?) {
    setDDLoading(true);
    return new Promise(res => {
      getProductDetail({
        productId: isExist(productId) ? productId : state.currentVersion,
      }).then(({ code, data }) => {
        if (code === 200) {
          requestAnimationFrame(() => {
            reloadDDData(data.list);
            setDDLoading(false);
            res({});
          });
        }
      });
    });
  }

  function successReload(id) {
    fetchDDData(id);
  }

  function handleAdd() {
    openDetail(true, { mode: 1 });
  }

  function handlePreview(column) {
    const target = state.codeList.find(item => item.id === state.activeId);
    openDetail(true, { mode: 3, ...target });
  }

  function handleEdit(column) {
    const target = state.codeList.find(item => item.id === state.activeId);
    openDetail(true, { mode: 2, ...target });
  }

  function getTableActions(row, rowIndex): ActionItem[] {
    return [
      { icon: 'icon-ym icon-ym-edit', onClick: handleEdit.bind(null, row) },
      { icon: 'icon-ym icon-ym-btn-preview', onClick: handlePreview.bind(null, row) },
    ];
  }

  function handleDel({ column, columnIndex }) {
    const prodctLen = $ddGrid.grid.getColumns().length;
    const delMsg = prodctLen <= 2 ? '此操作将永久删除该列检测数据, 是否继续？' : '此操作将永久删除该料号， 是否继续？';
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: delMsg,
      onOk: async () => {
        try {
          setDDLoading(true);
          state.loadingBom = true;
          if (prodctLen <= 2) {
            deleteProductDetail(state.activeId).then(({ code, msg }) => {
              if (code === 200) {
                createMessage.success(msg);
                fetchDDData();
              }
            });
          } else {
            const target: any = state.codeList.find(item => item.id === state.activeId) || {};
            if (target) {
              target.productQcItems.splice(columnIndex - 1, 1);
              const params = { id: target.id, productCode: target.productCode, remark: target.remark, productQcItems: target.productQcItems };
              updateProductDetail(params).then(({ code, msg }) => {
                if (code === 200) {
                  createMessage.success(msg);
                  successReload(state.activeId);
                }
              });
            }
          }
          setDDLoading(false);
          state.loadingBom = false;
        } catch (e) {
          setDDLoading(false);
          state.loadingBom = false;
        }
      },
    });
  }

  function handleRecallCopyMethod({ row, column, rowIndex, columnIndex }) {
    const target = row[column.field];
    if (isObject(target)) {
      return target.val;
    } else {
      return target;
    }
    // const target = state.codeList.find(item => item.id === state.activeId);
    // if (target) {
    //   const productQcItems = target.productQcItems || [];
    //   const item = productQcItems[columnIndex - 1] || {};
    //   return item.checkResult || '';
    // }
    // return '';
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  const batchImportFile = () => {
    openDDImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importTaskSave,
      templateApi: downloadImportTemplate,
      previewColumn: getImportColumns().filter(
        item => item.field !== 'checkbox' && item.field !== 'creatorUserName' && item.field !== 'isEnabled' && item.field !== 'creatorTime',
      ),
      excludeFields: ['ApplyCode', 'Status', 'HandlerName', 'currentNodeName', 'nodeDetail', 'ApplyUserName', 'ApplyDate'],
      usePolling: true,
      pollingParams: {
        interval: 4000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: { importSave: { isoperation: hasBtnP('btn_review') ? 1 : 0 } },
      i18nConfig: { moduleCode: 'QuotationRequirementsColumn' },
    });
  };

  const handleExport = async () => {
    openExportModal(true, {} as any);
  };

  function handleBomClick(item) {
    state.activeId = item.id || '';

    state.versionList = item.versionItems;
    state.currentVersion = item.versionItems[0].id;
    getProductDetailList();
  }

  async function handleBomDbClick(item) {
    // 如果料号相同，则不切换版本，如果料号不同，则切换版本
    if (item.productCode !== state.activeId) {
      state.activeId = item.id;
      state.versionList = item.versionItems;
      state.currentVersion = item.versionItems[0].id;
      await getProductDetailList();
    }
    state.finalProductCode = item.productCode;
    state.activeTab = 'inspect';
    await nextTick();
    await formApi.setValues({
      productId: state.currentVersion,
    });
    triggerFetchByTab();
  }

  function handleBomItemClick(item) {
    if (bomClickTimer.value) clearTimeout(bomClickTimer.value);
    bomClickTimer.value = setTimeout(() => {
      handleBomClick(item);
      bomClickTimer.value = null;
    }, 200);
  }

  function handleBomItemDbClick(item) {
    if (bomClickTimer.value) {
      clearTimeout(bomClickTimer.value);
      bomClickTimer.value = null;
    }
    handleBomDbClick(item);
  }

  function triggerFetchByTab() {
    if (state.activeTab === 'inspect') fetchInspect();
    else if (state.activeTab === 'inspectData') fetchInspectData();
    else fetchDDData();
  }

  watch(
    () => state.activeTab,
    async val => {
      if (val === 'detectionData') {
        await nextTick();
        requestAnimationFrame(() => {
          if (!state.ddMouseRegistered && divider.value && container.value && bomContent.value && mainContent.value) {
            registerMouseEvent(state as any, divider, container, bomContent, mainContent);
            state.ddMouseRegistered = true;
          }
          requestAnimationFrame(() => {
            if (state.finalProductCode) {
              state.activeId = state.finalProductCode;
            }
          });
        });
      } else if (val === 'inspect') {
        fetchInspect();
      } else if (val === 'inspectData') {
        fetchInspectData();
      }
    },
  );

  onMounted(async () => {
    if (state.activeTab === 'detectionData') {
      await nextTick();
      requestAnimationFrame(() => {
        if (!state.ddMouseRegistered && divider.value && container.value && bomContent.value && mainContent.value) {
          registerMouseEvent(state as any, divider, container, bomContent, mainContent);
          state.ddMouseRegistered = true;
        }
        requestAnimationFrame(() => {
          fetchDDData();
        });
      });
    } else if (state.activeTab === 'inspect') {
      fetchInspect();
    } else if (state.activeTab === 'inspectData') {
      fetchInspectData();
    } else {
      triggerFetchByTab();
    }
  });

  async function handleInspectImport() {
    openInspectImportModal(true, {
      productCode: state.activeId,
      versionList: state.versionList,
      currentVersion: state.currentVersion,
    });
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs class="h-full" v-model:activeKey="state.activeTab">
          <a-tab-pane class="h-full" key="detectionData" tab="产品测试标准">
            <DDForm class="relative overflow-x-hidden p-10px pb-10px vxe-form page" />
            <div class="bg-bar"></div>
            <div ref="container" class="container-box">
              <div ref="bomContent" class="bom-content">
                <div class="drag-box"><div ref="divider" class="drag-ctrl"></div></div>
                <div class="flex flex-col">
                  <div class="w-full h-44px title flex flex-row-reverse justify-between">
                    <div class="cursor-pointer" @click="() => (state.isPack = handleUnpack(bomContent, mainContent, isPack))">
                      <i :class="['icon-ym icon-ym-nav-prev icon-color', isPack ? '' : 'rotate-90']" />
                    </div>
                    <Subtitle title="产品内部料号" :class="[isPack ? 'opacity-100' : 'opacity-0', 'duration-300 ease-out pb-0']" />
                  </div>
                </div>
                <a-spin class="loading-bom" :spinning="loadingBom">
                  <div class="bom-list h-full">
                    <div
                      v-for="item in codeList"
                      :key="item.id"
                      @click="handleBomItemClick(item)"
                      @dblclick="handleBomItemDbClick(item)"
                      :class="['bom-item', item.id === activeId ? 'active' : '']">
                      <div class="bom-item-content cursor-pointer"
                        ><div class="bom-item-content-title">{{ item.code }}</div></div
                      >
                    </div>
                  </div>
                </a-spin>
              </div>
              <div ref="mainContent" class="main-content">
                <DDGrid>
                  <template #toolbar-tools>
                    <div class="current-product current-space">
                      <lydc-select
                        v-model:value="state.currentVersion"
                        placeholder="版本"
                        size="small"
                        style="width: '70px'"
                        :options="state.versionList"
                        :fieldNames="{
                          label: 'version',
                          value: 'id',
                        }"
                        @change="
                          e => {
                            // 重新请求产品
                            getProductDetailList(e);
                          }
                        ">
                      </lydc-select>
                    </div>
                  </template>
                  <template #toolbar-actions>
                    <a-space>
                      <a-button type="primary" @click="handleAdd"> {{ t('common.add') }} </a-button>
                      <vShowDropdown>
                        <template #overlay>
                          <button @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }}</button>
                          <button @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }}</button>
                        </template>
                        <a-button>{{ t('common.batchImportOrExport') }}</a-button>
                      </vShowDropdown>
                    </a-space>
                  </template>
                  <template #headerSlot="{ column }">
                    <div class="flex flex-row justify-between items-center px-8px">
                      <div>{{ column.title }}</div>
                      <!-- <i @click="handleEdit(column)" class="icon-ym icon-ym-edit cursor-pointer" style="color: #333" /> -->
                    </div>
                  </template>
                  <template #action="{ row, rowIndex }">
                    <TableAction outside :actions="getTableActions(row, rowIndex)" />
                  </template>
                </DDGrid>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="inspect" tab="数据分析">
            <Form class="relative overflow-x-hidden p-10px pb-10px vxe-form page" />
            <div class="bg-bar"></div>
            <a-spin class="h-full w-full flex-center" :spinning="state.inspectLoading">
              <InspectGrid class="h-full inspect-grid" v-if="state.inspectDefaultColumns.length > 0">
                <template v-if="state.finalProductCode" #toolbar-tools>
                  <a-space class="current-space flex">
                    <div class="current-product">当前产品: {{ state.finalProductCode }}</div>
                    <lydc-select
                      v-model:value="state.currentVersion"
                      placeholder="版本"
                      size="small"
                      style="width: '70px'"
                      :options="state.versionList"
                      :fieldNames="{
                        label: 'version',
                        value: 'id',
                      }"
                      @change="
                        async (e, data) => {
                          state.tempProductCode = data.productCode;
                          await formApi.setValues({
                            productId: e,
                          });
                          triggerFetchByTab();
                        }
                      ">
                    </lydc-select>
                  </a-space>
                </template>
                <template #toolbar-actions>
                  <a-space>
                    <a-button @click="handleInspectImport"> 导入 </a-button>
                    <a-checkbox-group
                      v-model:value="state.checkList"
                      @change="
                        async e => {
                          if (e.length === 0) {
                            state.checkList = avgArgsBack;
                            return createMessage.warning('数据必须保留一项');
                          }
                          if (!e.includes('hasRecord')) {
                            await formApi.removeSchemaByFields(['worningThreshold']);
                          } else {
                            await formApi.setState({
                              schema: getCommonSchema(),
                            });
                            await formApi.setValues({
                              worningThreshold: 5,
                            });
                          }
                          avgArgsBack = state.checkList;
                          triggerFetchByTab();
                        }
                      ">
                      <a-checkbox value="hasRecord">实测数据</a-checkbox>
                      <a-checkbox value="hasAvg">实测平均值</a-checkbox>
                      <a-checkbox value="hasTolAvg">平均值偏差</a-checkbox>
                    </a-checkbox-group>
                    <a-tooltip title="超出偏差告警阈值的实测数据">
                      <div class="color-toolTip-box">
                        <div class="color-content" style="background: rgb(255 204 199)"></div>
                      </div>
                    </a-tooltip>
                    <a-tooltip title="不参与(禁用)平均值计算的实测数据">
                      <div class="color-toolTip-box">
                        <div class="color-content" style="background: #d9d9d9"></div>
                      </div>
                    </a-tooltip>
                    <a-tooltip title="平均值偏差 在公差范围外，(超出上限TOLERANCE +或超出下限TOLERANCE -)">
                      <div class="color-toolTip-box">
                        <div class="color-content" style="background: rgb(149 222 100 / 70%)"></div>
                      </div>
                    </a-tooltip>
                    <a-tooltip title="平均值偏差 在公差范围内，(在上限TOLERANCE +和TOLERANCE -范围之内)">
                      <div class="color-toolTip-box">
                        <div class="color-content" style="background: rgb(255 214 102 / 70%)"></div>
                      </div>
                    </a-tooltip>
                    <a-tooltip title="实测平均值高亮行">
                      <div class="color-toolTip-box">
                        <div class="color-content" style="background: rgb(24 144 255 / 60%)"></div>
                      </div>
                    </a-tooltip>
                    <a-tooltip title="标准数据区域">
                      <div class="color-toolTip-box">
                        <div class="color-content" style="background: rgb(255 242 229 / 60%)"></div>
                      </div>
                    </a-tooltip>
                  </a-space>
                </template>
                <template v-for="item in (state.inspectDefaultColumns as string[])" #[`inspect_default_${item}`]="{ row, column }">
                  <!-- <template v-if="column.field === 'remark'">
                    <template v-if="!row['seqNo|FAI#'].includes('平均值') && !isNaN(parseInt(row['seqNo|FAI#']))">
                      <button type="link" @click="handleRemark(row)">{{ row.remark || '/' }}</button>
                    </template>
                  </template> -->
                  <template v-if="column.field === 'creatorUserName'">
                    <div> {{ row[column.field] }}</div>
                  </template>
                  <template v-else-if="column.field === 'creatorTime'">
                    <div> {{ row[column.field] ? dateUtil(row[column.field]).format('YYYY-MM-DD HH:mm:ss') : '' }}</div>
                  </template>
                  <template v-else>
                    <template v-if="column.field === 'remark'">
                      <template v-if="row.operationid !== '0'">
                        <button type="link" @click="handleRemark(row)">{{ row.remark || '/' }}</button>
                      </template>
                    </template>
                    <template v-else>
                      <template v-if="row['seqNo|FAI#'] === '平均值偏差'">
                        <div v-if="row[column.field]?.ok == 1" class="h-full w-full flex-center" style="background: rgb(149 222 100 / 70%)">{{
                          thousandsFormat(row[column.field]?.val)
                        }}</div>
                        <!--                        <div v-if="row[column.field]?.ok == -1" class="h-full w-full flex-center" style="background: rgb(245 34 45 / 70%)">{{-->
                        <!--                          thousandsFormat(row[column.field]?.val)-->
                        <!--                        }}</div>-->
                        <div v-if="row[column.field]?.ok == 0" class="h-full w-full flex-center" style="background: rgb(255 214 102 / 70%)">{{
                          thousandsFormat(row[column.field]?.val)
                        }}</div>
                      </template>
                      <!-- rgba(24, 144, 255, 1) -->
                      <!-- 显示蓝色 -->
                      <template v-else-if="row['seqNo|FAI#'] === '实测平均值'">
                        <!-- <template v-if="column.field === 'remark'">
                        <div> {{ row.remark ?? '/' }}</div>
                      </template> -->
                        <div class="h-full w-full flex-center" style="background: rgb(24 144 255 / 60%)">{{ row[column.field]?.val }}</div>
                      </template>
                      <!-- 显示原来的数据 -->
                      <template v-else-if="isNaN(parseInt(row['seqNo|FAI#']))">
                        <div>{{ thousandsFormat(row[column.field]) }}</div>
                      </template>

                      <template v-else>
                        <div
                          @dblclick="handleInspectCellKeydown({ menu: { code: 'download' }, column, row })"
                          :class="['h-full', 'w-full', 'flex-center', row[column.field]?.imgPath ? 'underline' : '']"
                          :style="row[column.field]?.ok == 0 ? 'background:#d9d9d9' : row[column.field]?.ok == -1 ? 'background: rgb(255 204 199 / 100%)' : ''"
                          >{{ thousandsFormat(row[column.field]?.val) }}</div
                        >
                      </template>
                    </template>
                  </template>
                  <!-- 则需要变黄色绿色 -->

                  <!-- {{ row['seqNo|FAI#'] }}-- -->
                  <!-- <template v-if="!isNaN(parseInt(row['seqNo|FAI#']))"> -->
                  <!-- <template v-if="row['operationTime']">
                    <template v-if="!row['seqNo|FAI#'].includes('平均值')">
                      <div :key="row[column.field]?.val || item">{{ row[column.field]?.val || '' }}</div>
                    </template>
                    <template v-else>
                      <div class="h-full w-full flex-center" :key="item" style="background: rgb(255 237 189 / 100%)">{{
                        item === 'creatorTime' ? dateUtil(row[column.field]).format('YYYY-MM-DD HH:mm:ss') : row[column.field]?.val ?? ''
                      }}</div>
                    </template>
                  </template>
                  <template v-else>
                    <div>{{ row[column.field] }}</div>
                  </template> -->
                </template>
              </InspectGrid>
              <InspectEmptyGrid v-else />
            </a-spin>
          </a-tab-pane>
          <!-- <a-tab-pane key="inspectData" tab="数据分析">
            <a-spin class="h-full w-full flex-center" :spinning="state.inspectDataLoading">
              <InspectDataGrid class="h-full" v-if="state.inspectDataDefaultColumns.length > 0">
                <template #toolbar-tools>
                  <div class="current-product">当前产品: {{ state.finalProductCode }}</div>
                </template>
                <template #toolbar-actions>
                  <a-space>
                    <a-switch
                      v-model:checked="state.hasRecord"
                      checked-children="显示记录"
                      un-checked-children="不显示记录"
                      checkedValue="1"
                      unCheckedValue="0" />
                    <a-switch v-model:checked="state.hasAvg" checked-children="平均值" un-checked-children="平均值" checkedValue="1" unCheckedValue="0" />
                    <a-switch
                      v-model:checked="state.hasTolAvg"
                      checked-children="偏差平均值"
                      un-checked-children="偏差平均值"
                      checkedValue="1"
                      unCheckedValue="0" />
                  </a-space>
                </template>
                <template v-for="item in (state.inspectDataDefaultColumns as string[])" #[`inspectData_default_${item}`]="{ row, column }">
                  <template v-if="row.operationid.length > 10">
                    <div v-if="column.field === 'remark'">
                      <button type="link" @click="handleRemark(row)">{{ row.remark || '/' }}</button>
                    </div>
                    <div v-else-if="column.field === 'creatorUserName'">
                      <div>{{ row[column.field] }}</div>
                    </div>
                    <div v-else-if="column.field === 'creatorTime'">
                      <div>{{ dateUtil(row[column.field]).format('YYYY-MM-DD HH:mm:ss') }}</div>
                    </div>
                    <template v-else>
                      <div :key="item" class="h-full w-full flex-center" v-if="row[column.field]?.ok == 1" style="background: rgb(149 222 100 / 70%)">{{
                        row[column.field]?.val
                      }}</div>
                      <div :key="item" class="h-full w-full flex-center" v-if="row[column.field]?.ok == 0" style="background: rgb(255 214 102 / 70%)">{{
                        row[column.field]?.val
                      }}</div>
                    </template>
                    <template>
                    </template>
                  </template>
                  <template v-else>
                    <div :key="item">{{ row[column.field] }}</div>
                  </template>
                </template>
              </InspectDataGrid>
            </a-spin>
          </a-tab-pane> -->
        </a-tabs>
      </div>
    </div>
    <ImportModal @register="registerInspectImportModal" @reload="fetchInspect" />
    <RemarkModal @register="registerRemarkModal" @reload="triggerFetchByTab" />
    <DetailPopup @register="registerDetail" @reload="successReload" />
    <DDImportModal @register="registerDDImportPop" @refresh="fetchDDData" />
    <ExportModal @register="registerExportModal" />
    <PreviewModal ref="filePreviewRef" />
  </div>
</template>

<style scoped lang="less" src="../detectionData/style.less" />

<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.ant-spin-nested-loading) {
    height: calc(100% - 54px);
    background: rgb(250 250 250 / 100%);
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.vxe-table--render-default.size--small .vxe-body--column.is--padding .vxe-cell) {
    padding: 0;
    width: 100%;
  }

  :deep(.vxe-cell--wrapper) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .bg-bar {
    width: 100%;
    height: 12px;
    background-color: #ebeef5;
  }

  .bom-item {
    height: 38px;
    display: flex;
    align-items: center;
    padding: 8px 8px 8px 24px;
    font-size: 14px;
    overflow: hidden;
  }

  .bom-item .bom-item-content {
    flex: 1 1 auto;
    min-width: 0;
  }

  .bom-item .bom-item-content-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bom-item.active {
    background: rgb(255 123 0 / 6%);
    color: rgb(255 123 0 / 100%);
    border-right: 1px solid rgb(255 123 0 / 100%);
  }

  .current-product {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
    width: max-content;
  }

  // .current-space {
  //   :deep(.ant-select) {
  //     width: 70px;
  //   }
  //   :deep(.ant-select-selector){
  //     width: 70px;
  //   }
  // }

  :deep(.current-space .ant-select) {
    width: 70px !important;
  }

  .bom-list {
    overflow: auto;
    -ms-overflow-style: none; /* IE/Edge */
    scrollbar-width: none; /* Firefox */
  }

  .bom-list::-webkit-scrollbar {
    display: none;
  }

  .inspect-grid {
    --inspect-fixed-row-height: 25px;
  }

  :deep(.inspect-grid .inspect-grid__fixed-row) {
    box-shadow: inset 0 -1px 0 0 #ebeef5;
  }

  :deep(.inspect-grid .inspect-grid__fixed-row .vxe-cell) {
    height: 25px !important;
    line-height: 25px !important;
  }

  .color-toolTip-box {
    width: 26px;
    height: 26px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgb(217 217 217);
    border-radius: 6px;
    transition: ease all 0.2s;
    cursor: pointer;
  }

  .color-toolTip-box:hover {
    border-color: rgb(255 123 0);
  }

  .color-content {
    width: 16px;
    height: 16px;
    border-radius: 3px;
  }
</style>
