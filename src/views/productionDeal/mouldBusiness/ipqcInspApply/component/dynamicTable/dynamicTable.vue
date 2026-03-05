<template>
  <div class="warp">
    <div class="warp-left"> </div>
    <div class="warp-right" v-if="state.showAddBtn && state.openModel !== 'view'">
      {{ t('common.addText2') }}：
      <FilteredInput class="!w-120px" v-model:value.number="row" :placeholder="t('common.inputTextPrefix')" input-type="number" :min="1" :max="50" />
      <a-button class="!ml-14px" @click="debounceOnChange">{{ t('common.addText') }}</a-button>
    </div>
  </div>
  <BasicTable @register="registerTable" :bodyCell="'#bodyCell'" :data-source="state.tableData">
    <template v-for="item in state.columns" #[`${item.dataIndex}Title`]>
      <span :class="item.isRequired ? 'isRequired' : ''">{{ formatLabel(item) }}</span>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.cpmType === 'upload'">
        <a v-if="column.cpmSetting.disabled" @click="handleFileDownload(record)"> {{ record['attachmentName'] || '/' }} </a>
        <div v-else>
          <a-button v-if="!record['attachmentId']" type="primary" ghost size="mini" @click="handelUploadFn(index)">{{
            t('common.uploadDrawingText')
          }}</a-button>

          <div class="upload-item text-ellipsis" v-else>
            <a-tooltip>
              <a-tooltip placement="top" :title="record.attachmentName" class="text-ellipsis" v-if="record['attachmentName']">
                <a
                  class="table-a"
                  @click="
                    () => {
                      filePreviewRef.init({
                        name: record.attachmentName,
                        Id: record.attachmentId,
                        previewType: 'localPreview',
                        noCache: false,
                        isCopy: 0,
                      });
                    }
                  "
                  >{{ record['attachmentName'] }}</a
                >
              </a-tooltip>
            </a-tooltip>
            <i class="ym-custom ym-custom-close" @click="delUploadFileFn(index)"></i>
          </div>
        </div>
      </template>
      <template v-else-if="column.cpmType === 'DatePicker'">
        <lydc-date-picker v-model:value="record[column.dataIndex]" v-bind="column.cpmSetting" />
      </template>
      <template v-else-if="column.cpmType === 'CustomUserSelect'">
        <lydc-custom-user-select v-model:value="record[column.dataIndex]" v-bind="column.cpmSetting"> </lydc-custom-user-select>
      </template>
      <template v-else-if="column.cpmType === 'ApiSelect'">
        <ApiSelect v-model:value="record[column.dataIndex]" v-bind="column.cpmSetting" />
      </template>
      <template v-else-if="column.dataIndex === 'action' && state.showActions">
        <TableAction :actions="getTableActions(record, index)" />
      </template>
      <template v-else>
        <FilteredInput v-model:value="record[column.dataIndex]" :input-type="column.inputType" allowClear v-bind="column.cpmSetting" v-if="column.isEdit" />
      </template>
    </template>
  </BasicTable>
  <UploadModal v-bind="uploadState" @register="registerUpload" @success="updateMoldsDrawing" />
  <Preview ref="filePreviewRef" />
</template>
<script setup lang="ts">
  import { reactive, onMounted, watch, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { EXTERNALS_MODULE_TEMPLATE } from './config';
  import { buildBitUUID } from '/@/utils/uuid';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { FilteredInput } from '/@/components/FilteredInput';
  import { useDebounceFn } from '@vueuse/core';
  import { uploadfile } from '/@/api/engineering/mould';
  import { InitParams, opreaMap } from './type';
  import { cloneDeep } from 'lodash-es';
  import { downloadByUrl } from '/@/utils/file/download';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import { getlistbycheckprojectname } from '/@/api/productionDeal/ipqc';
  import { useModal } from '/@/components/Modal';
  import { UploadModal } from '/@/components/Upload';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';

  const filePreviewRef = ref<ModalComponent | null>(null);

  const props = defineProps({
    dataSource: {
      type: Array,
    },
  });

  const { t } = useI18n();
  const row = ref();
  interface State {
    showAddBtn: boolean | undefined;
    showActions: boolean | undefined;
    openModel: string;
    template: any;
    columns: any;
    title: string;
    id: string;
    tableData: any;
    fileList: any[];
    currentIndex: number;
  }

  const state = reactive<State>({
    showAddBtn: true,
    showActions: true,
    openModel: 'add',
    template: [],
    columns: [],
    title: '',
    id: '',
    tableData: [],
    fileList: [],
    currentIndex: 0,
  });

  const uploadState = reactive({
    title: t('common.upFiles'),
    param: {},
    mutiple: false,
    api: uploadfile,
  });
  const [registerUpload, { openModal: openUpload }] = useModal();
  const { createMessage, createConfirm } = useMessage();

  const [
    registerTable,
    {
      setProps,
      insertTableDataRecord,
      getDataSource,
      setTableData,
      updateTableData,
      getSelectRowKeys,
      deleteTableDataRecord,
      clearSelectedRowKeys,
      setLoading,
      setColumns,
    },
  ] = useTable({
    title: '',
    // columns: ADD_COLUMNS,
    rowKey: 'id',
    isCanResizeParent: false,
    canResize: false, //自适应高度
    formConfig: {
      labelWidth: 100,
      // schemas: dimensions_schemas,
      autoAdvancedLine: 0, //自动展开行
      showAdvancedButton: false,
      showResetButton: false,
    },
    striped: true,
    useSearchForm: false, //使用搜索表单
    showTableSetting: false, //刷新按钮,默认打开
    showIndexColumn: true, //显示序号
    pagination: false,
    // actionColumn: state.showActions
    //   ? {
    //       width: 90,
    //       title: '操作',
    //       dataIndex: 'action', //字段
    //       fixed: 'right', //显示在右边
    //     }
    //   : null,
  });

  watch(
    () => props.dataSource,
    newVal => {
      if (!newVal?.length) return;
      state.tableData = newVal;
      setTableData(state.tableData);
    },
  );

  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleAddItem.bind(null, record, index),
      },
      {
        icon: 'ym-diecut ym-diecut-file-copy',
        onClick: handleCopyItem.bind(null, record, index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteItem.bind(null, record, index),
        disabled: state.tableData.length <= 1,
      },
    ];
  }

  const debounceOnChange = useDebounceFn(value => {
    addTableRowsFn(value);
  }, 200);

  const delUploadFileFn = i => {
    updateTableData(i, 'attachmentId', '');
    updateTableData(i, 'attachmentName', '');
  };
  const updateMoldsDrawing = (id, data) => {
    console.log(data, 'data');
    if (data) {
      updateTableData(state.currentIndex, 'attachmentId', data.data.Id);
      updateTableData(state.currentIndex, 'attachmentName', data.data.OriginFileName);
      state.fileList = [];
    }
  };

  function handelUploadFn(index) {
    state.currentIndex = index;
    openUpload(true, {});
  }

  async function handleFileDownload(record) {
    if (!record['attachmentName']) return;
    console.log(record);
    const { data, code } = await fileDownload(record.attachmentId);
    if (code === 200) {
      downloadByUrl({ url: data.url, fileName: data.name });
    }
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
      const obj = { ...state.template, id: buildBitUUID() };
      if (arr.length) {
        obj.moldNo = arr[i];
      }
      data.push(obj);
    }

    state.tableData = state.tableData.concat(data);
    setTableData(state.tableData);
  }

  const handleAddItem = (record, index) => {
    insertTableDataRecord({ ...state.template, id: buildBitUUID() }, index + 1);
  };

  const handleCopyItem = (record, index) => {
    insertTableDataRecord({ ...record, id: buildBitUUID() }, index + 1);
  };

  const handleDeleteItem = (record, index) => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () => {
        deleteTableDataRecord(record.id);
        createMessage.success(t('common.delSuccess'));
      },
    });
  };

  function init({ title, columns, template, showAddBtn, showActions, tableData, openModel }: InitParams) {
    console.log({ columns, template, showAddBtn, showActions, tableData });
    state.title = title;
    state.template = template;
    state.columns = columns;
    state.showAddBtn = showAddBtn === undefined ? true : false;
    state.showActions = showActions === undefined ? true : false;
    state.openModel = openModel === undefined ? '' : openModel;
    console.log(openModel, 'openModel');
    if (openModel === 'view') {
      columns = columns.map(item => {
        item.cpmSetting.disabled = true;
        return item;
      });
      setProps({
        actionColumn: null,
      });
    } else {
      columns = columns.map(item => {
        item.cpmSetting.disabled = false;
        return item;
      });
      if (state.showActions) {
        setProps({
          actionColumn: {
            width: 90,
            title: '操作',
            dataIndex: 'action', //字段
            fixed: 'right', //显示在右边
          },
        });
      }
    }

    if (tableData && tableData.length) {
      state.tableData = cloneDeep(tableData);
    } else {
      if (title === '外观') {
        state.template = template || EXTERNALS_MODULE_TEMPLATE;
        getlistbycheckprojectname('模具外观').then(res => {
          res.data.forEach(item => {
            state.template.checkCode = item.Code;
            state.tableData.push({ ...state.template, id: buildBitUUID() });
          });
        });
      } else if (title === '包规') {
        getlistbycheckprojectname('模具包规').then(res => {
          res.data.forEach(item => {
            state.template.checkCode = item.Code;
            state.tableData.push({ ...state.template, id: buildBitUUID() });
          });
        });
      } else {
        state.tableData = [{ ...state.template, id: buildBitUUID() }];
      }
    }
    setColumns(columns);
  }
  function validateTableForm() {
    let errorArr: any = [];
    const _columns = state.columns;
    for (let index = 0; index < state.tableData.length; index++) {
      const element = state.tableData[index];
      errorArr = _columns.filter(o => {
        return !element[o.dataIndex] && o.isRequired;
      });
      if (errorArr.length) return errorArr;
    }
    return errorArr;
  }

  async function validateFn(type = 1) {
    const validateArr = await validateTableForm();
    if (validateArr.length && type) {
      const currentTitle = validateArr[0].title || validateArr[0].name;
      const i18nField = opreaMap[state.title] ? `common.${opreaMap[state.title]}` : state.title;
      createMessage.warning(`【${t(i18nField)}】->${currentTitle} ${t('sys.validate.textRequiredSuffix')}`);
      return false;
    }
    // return Promise.resolve(state.tableData);
    return state.tableData;
  }

  function formatLabel(item: any) {
    const label = t(`dict.CommonCol.${item.dataIndex}`);
    console.log(label, 'label');
    if (label && label.includes('dict.CommonCol.')) {
      console.log(item.name, 'label');
      return item.name;
    }
    return label || item.name;
  }
  onMounted(() => {
    // selectListInitFn();
  });

  defineExpose({
    validateFn,
    insertTableDataRecord,
    getDataSource,
    setTableData,
    updateTableData,
    getSelectRowKeys,
    deleteTableDataRecord,
    clearSelectedRowKeys,
    setLoading,
    init,
  });
</script>

<style lang="less" scoped>
  .warp {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;
    position: relative;
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 10px;

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

  .upload-item {
    border: 1px solid #dbdbdb;
    background: #fff;
    text-align: center;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    padding: 0 30px;
    position: relative;
  }

  .icon-ym-btn-add {
    color: #333;
    font-weight: 600;
    margin: 4px 0 0 10px;
    font-size: 12px;
  }

  .ym-custom-close {
    position: absolute;
    right: 10px;
    font-size: 18px;
    color: #666;
    cursor: pointer;
  }

  .isRequired::after {
    color: red;
    content: '*';
    margin-left: 4px;
  }
</style>
