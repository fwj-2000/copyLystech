<template>
  <div class="moid-add-popup">
    <div class="h-[40%]">
      <BatchGrid>
        <template #buttons>
          <Subtitle :title="t('common.generateInformation')" class="pb-none" />
          <a-divider type="vertical"></a-divider>
          <div class="warp-btn">
            <a-button type="primary" @click="batchGeneration">{{ t('common.batchGeneration') }}</a-button>
            <a-switch
              v-model:checked="state.moldNoType"
              :checkedChildren="t('dict.MoldApply.newMold')"
              :checkedValue="MOLD_APPLY_TYPE.新模"
              :unCheckedChildren="t('dict.MoldApply.oldMold')"
              :unCheckedValue="MOLD_APPLY_TYPE.旧模" />
            <span>
              <ExclamationCircleFilled />
              {{ t('dict.MoldApply.applyMoldTypeTip') }}
            </span>
          </div>
        </template>
        <template #tools>
          <a-space align="center">
            {{ t('common.addText2') }}：
            <FilteredInput class="!w-120px" v-model:value.number="rowBatch" :placeholder="t('common.inputText')" input-type="number" :min="1" :max="50" />
            <a-button type="primary" ghost @click="debounceOnBatchChange">{{ t('common.add1Text') }}</a-button>
          </a-space>
        </template>
        <template #moldNo="{ row }">
          <a-input v-model:value="row.moldNo" :placeholder="getMoldNoPlaceholder()" />
        </template>
        <template #action="{ rowIndex, row }">
          <div class="flex">
            <TableAction :outside="true" :actions="getBatchTableActions(row, rowIndex)" />
          </div>
        </template>
      </BatchGrid>
    </div>

    <div class="h-[60%]" v-loading="loading">
      <AddGrid>
        <template #buttons>
          <Subtitle :title="t('common.applyInfo')" class="pb-none" />
          <a-divider type="vertical"></a-divider>
          <div class="warp-btn">
            <a-button type="primary" ghost size="mini" @click="handelUploadFn(openUpload)">{{ t('common.uploadDrawingText') }}</a-button>
          </div>
          <span>
            <ExclamationCircleFilled />
            {{ t('dict.MoldApply.uploadFileNameTip') }}
          </span>
        </template>
        <template #tools> </template>
        <template #moldNo="{ row }">
          <a-input v-model:value="row.moldNo" :placeholder="getMoldNoPlaceholder(false)" />
        </template>
        <template #moldDrawings="{ row }">
          <FileListCell v-if="row.moldDrawings?.length" :list="row.moldDrawings" />
          <span v-else>{{ t('common.pendingUpload') }}</span>
        </template>
        <template #action="{ rowIndex, row }">
          <div class="flex">
            <TableAction :actions="getTableActions(row, rowIndex)" />
          </div>
        </template>
      </AddGrid>
    </div>
    <UploadModal v-bind="uploadState" @register="registerUpload" @success="updateMoldsDrawing" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, watch, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { UploadModal } from '/@/components/Upload';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { checkmoldno, getCostcenterlist } from '/@/api/engineering/mould';
  import { MODULE_TEMPLATE, ADD_COLUMNS, BATCH_COLUMNS, toUpperAndRemoveSpaces, validateMoldCode, MOLD_APPLY_TYPE, getAddEeditRules } from './config';
  import { buildBitUUID } from '/@/utils/uuid';
  import { getFactoryList } from '/@/api/basicData/factory';
  import { FilteredInput } from '/@/components/FilteredInput';
  import { getProductType } from '/@/api/engineering/pcc';
  import { useDebounceFn } from '@vueuse/core';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { handleAfterPaster } from './handlePaster';
  import { uploadfiles } from '/@/api/basic/common';
  import FileListCell from '../../components/fileListCell.vue';
  import { isEmpty } from '/@/utils/is';
  import { ExclamationCircleFilled } from '@ant-design/icons-vue';
  import { deleteCellValueName } from '/@/adapter/delete-value-event';
  import { beforeFileUpload } from '/@/views/engineering/mouldBusiness/components/config';
  import { isDisableEdit } from '/@/views/engineering/mouldBusiness/components/config';

  const props = defineProps({
    dataSource: {
      type: Array,
    },
  });

  const { t } = useI18n();

  interface State {
    title: string;
    mouldNo: string;
    id: string;
    orgId: string;
    processRouteItem: any;
    bindMaterialList: any[];
    tableData: any;
    tableBatchData: any;
    fileList: any[];
    costcenterlist: [];
    factoryList: [];
    productTypelist: any[];
    productTypeBatchlist: any[];
    productTypeApplylist: any[];
    innermaterialnumberList: [];
    // 是否新模具
    moldNoType: `${MOLD_APPLY_TYPE}`;
  }

  const state = reactive<State>({
    mouldNo: '',
    title: '',
    id: '',
    orgId: '',
    processRouteItem: {},
    bindMaterialList: [],
    tableData: [],
    tableBatchData: [{ ...MODULE_TEMPLATE, id: buildBitUUID() }],
    fileList: [],
    costcenterlist: [],
    factoryList: [],
    productTypelist: <any>[],
    productTypeBatchlist: <any>[],
    productTypeApplylist: <any>[],
    innermaterialnumberList: [],
    moldNoType: MOLD_APPLY_TYPE.新模,
  });

  const uploadState = reactive({
    title: t('common.uploadMoldDrawings'),
    param: {},
    mutiple: true,
    // api: uploadfile,
    api: (form: FormData) => {
      const fileForm = new FormData();
      form.getAll('file').forEach(file => {
        fileForm.append('fileList', file);
      });
      return uploadfiles(fileForm);
    },
    beforeUpload: beforeFileUpload,
  });

  const row = ref(1);
  const rowBatch = ref(1);

  const { createMessage, createConfirm } = useMessage();
  const [registerUpload, { openModal: openUpload }] = useModal();

  let newCols = [BATCH_COLUMNS, ADD_COLUMNS].map(a => {
    let cols = a.map(x => {
      if (x.editRender && x.editRender.props && x.editRender.props.placeholder == undefined) {
        if (['Select', 'Date'].some(a => x.editRender.name.includes(a))) {
          x.editRender.props.placeholder = t('common.selectPlaceholder');
        } else {
          x.editRender.props.placeholder = t('common.inputPlaceholder');
        }
      }
      return x;
    });
    cols.push({
      title: t('common.action'),
      field: 'action',
      headerAlign: 'center',
      width: 80,
      slots: { default: 'action' },
      fixed: 'right',
    });
    return cols;
  });
  const batchColumn = newCols[0];
  const addColumn = newCols[1];
  const [BatchGrid, gridApiBatch] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldBusiness-apply-batchadd',
      showIndexColumn: true,
      data: state.tableBatchData,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      columns: batchColumn,
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        custom: true,
        slots: {
          buttons: 'buttons',
          tools: 'tools',
        },
      },
      customConfig: {
        allowVisible: false,
      },
      clipConfig: {
        isPaste: true,
        beforePasteMethod: ({ targetAreas }) => {
          const { cols, rows } = targetAreas[0];
          for (const row of rows) {
            for (const col of cols) {
              if (isDisableEdit({ row, column: col })) {
                createMessage.warning(t('common.noPastingTip'));
                return false;
              }
            }
          }
          return true;
        },
        afterPasteMethod: handleAfterPaster,
      },
      keyboardConfig: {
        delMethod: ({ row, column }) => {
          const { field, editRender } = column;
          // 判断是否禁止编辑，如果禁止编辑，则不执行删除
          if (editRender?.props?.disabled || (typeof editRender?.props?.dynamicDisabled === 'function' && editRender?.props?.dynamicDisabled(row))) {
            return false;
          }
          row[field] = null;
        },
      },
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
    },
    gridEvents: {
      headerCellDblclick: batchHeaderCellDblclick,
      // @ts-ignore
      'cell-delete-value': ({ cellAreas }) => {
        const { cols, rows } = cellAreas[0];
        deleteCellValueName({ cellAreas: [{ cols, rows }] });
        handleAfterPaster({
          currentAreas: [{ cols, rows }],
          pasteCells: new Array(rows.length).fill(new Array(cols.length).fill('')),
          $grid: gridApiAdd,
        });
      },
    },
  });
  const { insertNextAt: insertTableBatchDataRecord, remove: deleteTableBatchDataRecord } = gridApiBatch;

  const [AddGrid, gridApiAdd] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldBusiness-apply-add',
      showIndexColumn: true,
      data: state.tableData,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      columns: addColumn,
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        custom: true,
        slots: {
          buttons: 'buttons',
          tools: 'tools',
        },
      },
      customConfig: {
        allowVisible: false,
      },
      clipConfig: {
        isPaste: true,
        beforePasteMethod: ({ targetAreas }) => {
          const { cols, rows } = targetAreas[0];
          for (const row of rows) {
            for (const col of cols) {
              if (isDisableEdit({ row, column: col })) {
                createMessage.warning(t('common.noPastingTip'));
                return false;
              }
            }
          }
          return true;
        },
        afterPasteMethod: handleAfterPaster,
      },
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
      keyboardConfig: {
        delMethod: ({ row, column }) => {
          const { field, editRender } = column;
          // 判断是否禁止编辑，如果禁止编辑，则不执行删除
          if (editRender?.props?.disabled || (typeof editRender?.props?.dynamicDisabled === 'function' && editRender?.props?.dynamicDisabled(row))) {
            return false;
          }
          row[field] = null;
        },
      },
      editRules: getAddEeditRules(state),
    },
    gridEvents: {
      headerCellDblclick: headerCellDblclick,
      // @ts-ignore
      'cell-delete-value': ({ cellAreas }) => {
        const { cols, rows } = cellAreas[0];
        deleteCellValueName({ cellAreas: [{ cols, rows }] });
        handleAfterPaster({
          currentAreas: [{ cols, rows }],
          pasteCells: new Array(rows.length).fill(new Array(cols.length).fill('')),
          $grid: gridApiAdd,
        });
      },
    },
  });
  const {
    getDataSource,
    reloadData: setTableData,
    reloadData: updateTableData,
    getSelectRowKeys: getSelectRowKeys,
    getSelectRows,
    clearSelectedRowKeys,
    insertNextAt: insertTableDataRecord,
    remove: deleteTableDataRecord,
    validate,
  } = gridApiAdd;
  function batchHeaderCellDblclick({ column }) {
    if (column?.editRender?.props?.disabled) {
      return false;
    }

    const tableData = gridApiBatch.getDataSource();
    const targetValue = tableData[0][column.field];
    if (isEmpty(targetValue)) {
      return false;
    }
    // tableData.forEach(item => {
    //   item[column.field] = targetValue;
    // });
    const rows = tableData.slice(1);
    const nameFile = column.editRender.cacheField;
    const targetName = tableData[0][nameFile];
    rows.forEach(item => {
      if (typeof column.editRender?.props?.dynamicDisabled === 'function' && column.editRender.props.dynamicDisabled(item)) {
        return false;
      }
      item[column.field] = targetValue;
      if (nameFile) {
        item[nameFile] = targetName;
      }
    });
    if (column.field !== 'moldPurchaseId' && column.field !== 'salespersonId') {
      handleAfterPaster({ currentAreas: [{ cols: [column], rows }], $grid: gridApiBatch, pasteCells: Array(rows.length).fill([targetValue]) });
    }
  }

  function headerCellDblclick({ column }) {
    if (column?.editRender?.props?.disabled) {
      return false;
    }

    const tableData = gridApiAdd.getDataSource();
    const targetValue = tableData[0][column.field];
    if (!targetValue) {
      return false;
    }
    const rows = tableData.slice(1);
    const nameFile = column.editRender.cacheField;
    const targetName = tableData[0][nameFile];
    rows.forEach(item => {
      if (typeof column.editRender?.props?.dynamicDisabled === 'function' && column.editRender.props.dynamicDisabled(item)) {
        return false;
      }

      item[column.field] = targetValue;
      if (nameFile) {
        item[nameFile] = targetName;
      }
    });
    if (column.field !== 'moldPurchaseId' && column.field !== 'salespersonId') {
      handleAfterPaster({ currentAreas: [{ cols: [column], rows }], $grid: gridApiAdd, pasteCells: Array(rows.length).fill([targetValue]) });
    }
  }

  watch(
    () => props.dataSource,
    newVal => {
      state.tableData = newVal;
      setTableData(state.tableData);
    },
  );
  const handelUploadFn = openFn => {
    if (!getSelectRowKeys().length) {
      return createMessage.warning(t('common.pleaseSelectMold'));
    }
    openFn(true, {});
  };
  const updateMoldsDrawing = (_id: string, { data }: { data: Array<any> }) => {
    const list = data.map(item => ({
      ...item,
      fileName: item.originFileName,
      filePath: item.fullPath,
    }));
    if (data) {
      getSelectRows().forEach(o => {
        o.moldDrawings = list;
      });
      state.fileList = [];
      clearSelectedRowKeys();
    }
  };
  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleAddItem.bind(null, insertTableDataRecord, record, index),
      },
      {
        icon: 'ym-diecut ym-diecut-file-copy',
        onClick: handleCopyItem.bind(null, insertTableDataRecord, record, index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteItem.bind(null, deleteTableDataRecord, record, index),
      },
    ];
  }
  function getBatchTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleAddItem.bind(null, insertTableBatchDataRecord, record, index),
      },
      {
        icon: 'ym-diecut ym-diecut-file-copy',
        onClick: handleCopyItem.bind(null, insertTableBatchDataRecord, record, index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteItem.bind(null, deleteTableBatchDataRecord, record, index),
      },
    ];
  }

  async function batchGeneration() {
    const arr: any[] = splitMouldNoFn();
    if (arr.length == 0) {
      createMessage.warning(t(['common.batchGeneration', 'dict.CommonCol.moldNo', 'common.notValidate']));
      return;
    }
    if (state.moldNoType === MOLD_APPLY_TYPE.新模) {
      // 只有新模需要校验模具编号是否已存在
      const flag = await checkMoldnoFn(arr.map(x => x.moldNo));
      if (!flag) {
        return;
      }
    }
    state.tableData = [];
    addTableRowsFn(arr);
  }

  // 使用示例
  // const mouldNumber = 'AF-PAAB001ABC-AB120';
  // const mouldNumbers = generateMouldNumbers(mouldNumber);
  // console.log(mouldNumbers); // 输出: ["AF-PAAB001A-AB120", "AF-PAAB001B-AB120", "AF-PAAB001C-AB120"]
  function splitMouldNoFn() {
    state.tableBatchData = gridApiBatch.getDataSource();
    const batchMolds = state.tableBatchData?.map(x => x);
    let molds = [];
    if (batchMolds && batchMolds.length == 0) {
      return molds;
    }

    const isNewMold = state.moldNoType === MOLD_APPLY_TYPE.新模;
    const middleSectionMinLength = isNewMold ? 8 : 7;
    const extractedCharsStart = isNewMold ? 7 : 6;

    batchMolds.forEach((mold: any) => {
      let mouldNumber: string = mold.moldNo;
      if (typeof mouldNumber !== 'string' || mouldNumber === '') {
        return;
      }
      // 将字符串转换为大写并去除空格
      mouldNumber = toUpperAndRemoveSpaces(mouldNumber);
      const firstDashIndex = mouldNumber.indexOf('-');
      const secondDashIndex = mouldNumber.indexOf('-', firstDashIndex + 1);
      if (firstDashIndex === -1 || secondDashIndex === -1) {
        return;
      }
      const middleSection = mouldNumber.substring(firstDashIndex + 1, secondDashIndex);
      if (middleSection.length < middleSectionMinLength) {
        return;
      }
      // 提取中间部分的所有字符，并去重
      const extractedChars = [...new Set(middleSection.substring(extractedCharsStart))].join('');

      // 生成模具编号
      const mouldNumbers: any = [];
      for (let i = 0; i < extractedChars.length; i++) {
        const curMold =
          mouldNumber.substring(0, firstDashIndex + 1) +
          middleSection.substring(0, extractedCharsStart) +
          extractedChars[i] +
          mouldNumber.substring(secondDashIndex);
        // 符合模具编号规则才添加到数组中
        if (validateMoldCode(curMold, isNewMold)) {
          mouldNumbers.push(curMold);
        }
      }
      const curMolds = mouldNumbers.map(curNo => {
        return { ...mold, moldNo: curNo, copyData: { ...(mold.copyData || {}) } };
      });
      molds = molds.concat(curMolds);
    });
    return molds;
  }
  async function checkMoldnoFn(moldNoList: string[]) {
    const { code, msg } = await checkmoldno(moldNoList);
    try {
      if (code === 200) {
        return true;
      } else {
        createMessage.error(msg);
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  const debounceOnBatchChange = useDebounceFn(value => {
    addBatchTableRowsFn(value);
  }, 200);

  function addBatchTableRowsFn(arr: any = []) {
    let lens = 0;
    if (arr && arr.length) {
      lens = arr.length;
    } else {
      lens = rowBatch.value;
    }
    const data: any = [];
    for (let i = 0; i < lens; i++) {
      const obj = { ...MODULE_TEMPLATE, id: buildBitUUID() };
      if (arr.length) {
        obj.moldNo = arr[i];
      }
      data.push(obj);
    }
    state.tableBatchData = gridApiBatch.getDataSource();
    state.tableBatchData.push(...data);
    gridApiBatch.reloadData(state.tableBatchData);
  }
  function addTableRowsFn(arr: any = []) {
    let lens = 0;
    if (arr && arr.length) {
      lens = arr.length;
    } else {
      lens = row.value;
    }
    const data: any = [];
    for (let i = 0; i < lens; i++) {
      const obj = { ...MODULE_TEMPLATE, ...arr[i], id: buildBitUUID() };
      data.push(obj);
    }
    state.tableData = gridApiAdd.getDataSource();
    state.tableData = data;
    gridApiAdd.reloadData(state.tableData); // 直接追加到原先的数据
  }
  const handleAddItem = (insertTableDataRecord, _record, _index) => {
    insertTableDataRecord({ ...MODULE_TEMPLATE, id: buildBitUUID() }, -1);
  };

  const handleCopyItem = (insertTableDataRecord, record, _index) => {
    insertTableDataRecord({ ...record, copyData: { ...(record.copyData || {}) }, id: buildBitUUID() }, -1);
  };

  const handleDeleteItem = (deleteTableDataRecord, record, _index) => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () => {
        deleteTableDataRecord(record);
        createMessage.success(t('common.delSuccess'));
      },
    });
  };
  async function validateAddData() {
    const errMap = await validate(true);
    if (errMap) {
      let errKey = Object.getOwnPropertyNames(errMap)[0];
      const title = errMap[errKey][0].column.title;
      createMessage.warning(t('common.improveData', [title]));
      return false;
    }
    return true;
  }
  function init() {
    selectListInitFn();
  }
  function selectListInitFn() {
    Promise.all([getCostcenterlist({}), getFactoryList(), getProductType({})])
      .then(res => {
        state.costcenterlist = res[0].data;
        state.factoryList = res[1].data;
        state.productTypelist = res[2].data;
        state.productTypeBatchlist = res[2].data; //初始化取全部数据做下来，后面联动了再筛选
        state.productTypeApplylist = res[2].data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  function getMoldNoPlaceholder(isTemplate = true) {
    if (state.moldNoType === MOLD_APPLY_TYPE.新模) {
      return isTemplate ? t('common.example') + ': CF-JFDA114ABCD-AD001' : t('common.example') + ': CF-ASDQ111A-AS001';
    } else {
      return isTemplate ? t('common.example') + ': AF-BAZ125ABCD-AA001' : t('common.example') + ': AF-BAZ125A-AA001';
    }
  }

  onMounted(() => {
    init();
  });

  /** 获取提交数据 */
  function getSubmitData() {
    return {
      tableData: getDataSource(),
      moldNoType: state.moldNoType,
    };
  }

  const loading = ref(false);
  function setLoading(val: boolean) {
    loading.value = val;
  }

  defineExpose({
    insertTableDataRecord,
    getDataSource: getSubmitData,
    setTableData,
    updateTableData,
    getSelectRowKeys,
    deleteTableDataRecord,
    clearSelectedRowKeys,
    setLoading,
    validateAddData,
  });
</script>

<style lang="less" scoped>
  div.pb-none {
    padding-bottom: 0;
  }

  .moid-add-popup {
    height: 100%;
    width: 100%;
    padding-bottom: 10px;
  }

  .warp {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;
    padding: 0 10px;
    box-sizing: border-box;

    &-btn {
      display: flex;
      align-items: center;
    }

    &-left {
      flex: 1;
      display: flex;
      align-items: baseline;
      padding: 0 12px;
      min-width: 400px;
      flex-wrap: nowrap;
    }
  }

  .table-box {
    height: 100%;
    background-color: rgb(88 105 132);
  }

  :deep(.table-required) {
    & > span:first-child::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ed6f6f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
</style>
