<template>
  <div class="warp">
    <div class="warp-left"> </div>
    <div class="warp-right" v-if="state.showAddBtn && state.openModel !== 'view'">
      {{ t('common.addText2') }}：
      <FilteredInput class="!w-120px" v-model:value.number="row" :placeholder="t('common.inputPlaceholder')" input-type="number" :min="1" :max="50" />
      <a-button class="!ml-14px" @click="debounceOnChange">{{ t('common.add1Text') }}</a-button>
    </div>
  </div>
  <BasicTable @register="registerTable" :bodyCell="'#bodyCell'" :data-source="state.tableData">
    <template v-for="item in state.columns" #[`${item.dataIndex}Title`]>
      <span :class="{ isRequired: item.isRequired }">{{ item.name }}</span>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.cpmType === 'upload'">
        <a v-if="column.cpmSetting.disabled" @click="handleFileDownload(record)"> {{ record['attachmentName'] || '/' }} </a>
        <div v-else>
          <BasicUpload
            v-if="!record['attachmentId']"
            :value="state.fileList"
            :maxSize="20"
            :maxNumber="1"
            @change="handleChange(index, $event)"
            :api="uploadfile"
            :showPreviewNumber="false"
            :emptyHidePreview="true"
            :helpText="t('dict.PurchaseQuotationColumn.UploadAttachment')">
            <template #button="{ openUploadModal, disabled }">
              <a-button class="!ml-14px" size="mini" :disabled="disabled" @click="handelUploadFn(openUploadModal)"
                ><upload-outlined></upload-outlined>{{ t('component.upload.uploadFile') }}</a-button
              >
            </template>
          </BasicUpload>
          <div class="upload-item text-ellipsis" v-else>
            <a-tooltip>
              <template #title>{{ record['attachmentName'] }}</template>
              <span class="text-ellipsis pr-20px"> {{ record['attachmentName'] || '/' }}</span>
            </a-tooltip>
            <i class="ym-custom ym-custom-close" @click="delUploadFileFn(index)"></i>
          </div>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'provinceCityIds'">
        <lydc-area-select
          v-model:value="record[column.dataIndex]"
          allowClear
          @change="(val, data) => handleAreaSelect(val, data, index)"
          :placeholder="t('component.lydc.areaSelect.modalTitle')"></lydc-area-select>
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
        <TableAction outside :actions="getTableActions(record, index)" />
      </template>
      <template v-else>
        <FilteredInput v-model:value="record[column.dataIndex]" :input-type="column.inputType" allowClear v-bind="column.cpmSetting" v-if="column.isEdit" />
      </template>
    </template>
  </BasicTable>
</template>
<script setup lang="ts">
  import { reactive, watch, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { buildBitUUID } from '/@/utils/uuid';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { FilteredInput } from '/@/components/FilteredInput';
  import { useDebounceFn } from '@vueuse/core';
  import { BasicUpload } from '/@/components/Upload';
  import { uploadfile } from '/@/api/engineering/mould';
  import { InitParams } from './type';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash-es';
  import { downloadByUrl } from '/@/utils/file/download';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
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
  });

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
    rowKey: 'id',
    isCanResizeParent: false,
    canResize: false, //自适应高度
    formConfig: {
      labelWidth: 100,
      autoAdvancedLine: 0, //自动展开行
      showAdvancedButton: false,
      showResetButton: false,
    },
    striped: true,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    indexColumnProps: {
      align: 'left',
      width: '40px',
    },
    pagination: false,
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
  const handleAreaSelect = (val, data, i) => {
    const cityName = data.reduce((pre, cur) => {
      return pre + cur.fullName + '/';
    }, '');
    updateTableData(i, 'provinceCityName', cityName);
  };

  const debounceOnChange = useDebounceFn(value => {
    addTableRowsFn(value);
  }, 200);

  const delUploadFileFn = i => {
    updateTableData(i, 'attachmentId', '');
    updateTableData(i, 'attachmentName', '');
  };
  const handleChange = (i = 0, file: Array<any> = []) => {
    if (file && file.length) {
      const uploadItem = file[0];
      updateTableData(i, 'attachmentId', uploadItem.Id);
      updateTableData(i, 'attachmentName', uploadItem.OriginFileName);
      state.fileList = [];
    }
  };

  const handelUploadFn = openFn => {
    openFn();
  };

  async function handleFileDownload(record) {
    if (!record['attachmentName']) return;
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
    state.title = title;
    state.template = template;
    state.columns = columns;
    state.showAddBtn = showAddBtn ?? true;
    state.showActions = showActions ?? true;
    state.openModel = openModel === undefined ? '' : openModel;
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
            width: '90px',
            title: t('common.action'),
            dataIndex: 'action', //字段
            fixed: 'right', //显示在右边
          },
        });
      }
    }

    if (tableData && tableData.length) {
      state.tableData = cloneDeep(tableData);
    } else {
      state.tableData = [{ ...state.template, id: buildBitUUID() }];
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
    if (validateArr.length) {
      createMessage.warning(`【${state.title}】中的 ${validateArr[0].name} 不能为空`);
      return false;
    }
    return state.tableData;
  }

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
    setColumns,
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

    &-right {
      display: flex;
      align-items: center;
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
