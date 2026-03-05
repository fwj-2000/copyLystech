<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { reactive, computed, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenForm } from '/@/adapter/form';
  import { getEditSchema, getEditColumns } from '../config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { useUserStore } from '/@/store/modules/user';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import { saveProductDetail, updateProductDetail } from '/@/api/engineering/detectionData';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { VxeUI } from 'vxe-table';

  const { createMessage } = useMessage();

  const userStore = useUserStore();

  const emit = defineEmits(['register', 'submitSuccess']);

  const { t } = useI18n();
  const state = reactive({
    mode: 'add',
    id: '',
    disabled: false,
  });
  const title = computed(() => (state.mode === ModeTypeEnum.ADD ? t('common.add') : t('common.edit')));

  const [registerPopup, { closePopup: closeDetailPopup, changeLoading: changePopuploading }] = usePopupInner(init);

  async function init(data) {
    state.id = '';
    console.log('🚀 ~ init ~ data:', data);
    state.mode = data.mode;

    if (data.mode === ModeTypeEnum.ADD) {
      executeAdd(data);
    }
    if (data.mode === ModeTypeEnum.EDIT) {
      executeEdit(data);
    }
    if (data.mode === ModeTypeEnum.VIEW) {
      executeView(data);
    }
  }

  const rowData = {
    faiNo: '',
    spc: '',
    detail: '',
    dimension: '',
    tolPlus: '',
    tolMinus: '',
    instrumentName: '',
    resolution: '',
    usl: '',
    lsl: '',
  };

  const editColumnDefs = getEditColumns();
  const editableFields = editColumnDefs.filter(column => column.field && column.field !== 'action');
  const columnFieldPrefix = 'col_';
  const transposeRendererName = 'TransposeCell';

  if (!VxeUI.renderer.get(transposeRendererName)) {
    VxeUI.renderer.add(transposeRendererName, {
      renderTableDefault(_renderOpts, { row, column }) {
        return row[column.field] ?? null;
      },
      renderTableCell(_renderOpts, { row, column }) {
        return row[column.field] ?? null;
      },
      renderTableEdit(renderOpts, params) {
        return renderTransposeEditor(renderOpts, params);
      },
    });
  }

  const qcItems = ref<Array<Record<string, any>>>([createEmptyColumnRecord()]);
  const initialTransposeData = buildTransposeRows(qcItems.value);
  const initialColumns = buildTransposeColumns(qcItems.value.length);

  const [Form, { setValues, getValues, setState }] = useVbenForm({
    showCollapseButton: false,
    submitOnChange: false,
    showDefaultActions: false,
    submitOnEnter: false,
    commonConfig: {
      componentProps: {},
      colon: true,
      formItemClass: 'items-start',
    },
    layout: 'vertical',
    wrapperClass: 'grid grid-cols-4 gap-4',
    schema: getEditSchema(),
  });

  const baseEditConfig = {
    trigger: 'dblclick',
    mode: 'cell' as const,
    enabled: true,
  };
  const baseKeyboardConfig = {
    isClip: true,
    isEdit: true,
    isDel: true,
    isEsc: true,
  };

  const [Grid, { reloadData, setGridOptions }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-basicInformation-detectionData-edit',
      columns: initialColumns,
      toolbarConfig: {
        refresh: false,
      },
      customConfig: {
        allowVisible: false,
      },
      mouseConfig: {
        area: true,
      },
      areaConfig: {
        multiple: true,
      },
      data: initialTransposeData,
      clipConfig: {
        isPaste: true,
      },
      pagerConfig: {
        enabled: false,
      },
      editConfig: baseEditConfig,
      keyboardConfig: baseKeyboardConfig,
      keepSource: true,
      rowConfig: {
        keyField: '__field',
      },
      showIndexColumn: true,
    },
    gridEvents: {
      'edit-closed': handleCellValueSync,
    },
  });

  function handleCellValueSync({ row, column }) {
    const columnIndex = extractColumnIndex(column.field);
    if (columnIndex < 0) return;
    const fieldKey = row.__field;
    if (!fieldKey) return;
    qcItems.value[columnIndex][fieldKey] = row[column.field];
  }

  function handleAddColumns(count = 1) {
    const total = Number(count) || 1;
    for (let i = 0; i < total; i++) {
      qcItems.value.push(createEmptyColumnRecord());
    }
    scheduleGridRefresh();
  }

  function handleColumnAction(type: 'add' | 'copy' | 'delete', field: string) {
    if (!isDynamicColumnField(field) || state.disabled) {
      return;
    }
    const columnIndex = extractColumnIndex(field);
    if (columnIndex < 0) return;
    if (type === 'add') {
      qcItems.value.splice(columnIndex + 1, 0, createEmptyColumnRecord());
    } else if (type === 'copy') {
      const copyData = cloneDeep(qcItems.value[columnIndex]);
      delete copyData.id;
      copyData.uuid = buildUUID();
      qcItems.value.splice(columnIndex + 1, 0, copyData);
    } else if (type === 'delete') {
      if (qcItems.value.length <= 1) {
        createMessage.warning('至少保留一列数据');
        return;
      }
      qcItems.value.splice(columnIndex, 1);
    }
    scheduleGridRefresh();
  }

  function scheduleGridRefresh() {
    requestIdleCallbackAdapter(() => {
      refreshTransposeGrid();
    });
  }

  function refreshTransposeGrid() {
    const columns = buildTransposeColumns(qcItems.value.length);
    const data = buildTransposeRows(qcItems.value);
    setGridOptions({
      columns,
    });
    reloadData(data);
  }

  function setSourceItems(list: Array<Record<string, any>> = []) {
    const source = list.length ? list.map(item => normalizeColumnRecord(item)) : [createEmptyColumnRecord()];
    qcItems.value = source;
    scheduleGridRefresh();
  }

  function createColumnField(index: number) {
    return `${columnFieldPrefix}${index}`;
  }

  function extractColumnIndex(field?: string) {
    if (!field || !field.startsWith(columnFieldPrefix)) return -1;
    const value = Number(field.slice(columnFieldPrefix.length));
    return Number.isNaN(value) ? -1 : value;
  }

  function isDynamicColumnField(field?: string) {
    return extractColumnIndex(field) > -1;
  }

  function getColumnHeaderLabel(field: string) {
    const columnIndex = extractColumnIndex(field);
    if (columnIndex < 0) return '';
    return `${getColumnTitlePrefix()}${columnIndex + 1}`;
  }

  function getColumnTitlePrefix() {
    const columnText = t('common.column');
    return columnText && columnText !== 'common.column' ? columnText : '列';
  }

  function buildTransposeRows(source: Array<Record<string, any>>) {
    return editableFields.map(column => {
      const field = String(column.field);
      const editor = resolveEditor(column);
      const record: Record<string, any> = {
        __field: field,
        label: column.title,
        __editor: editor,
      };
      source.forEach((item, index) => {
        record[createColumnField(index)] = item[field];
      });
      return record;
    });
  }

  function buildTransposeColumns(count: number) {
    const prefix = getColumnTitlePrefix();
    const fieldLabel = t('common.field');
    const baseTitle = fieldLabel && fieldLabel !== 'common.field' ? fieldLabel : '检测项';
    const columns = [
      {
        title: baseTitle,
        field: 'label',
        width: 160,
        fixed: 'left',
        align: 'left',
      },
    ];
    for (let i = 0; i < count; i++) {
      columns.push({
        title: `${prefix}${i + 1}`,
        field: createColumnField(i),
        minWidth: 180,
        editRender: {
          name: transposeRendererName,
        },
        slots: {
          header: 'transposeHeader',
        },
      });
    }
    return columns;
  }

  function resolveEditor(column) {
    if (column.editRender) {
      return {
        name: column.editRender.name,
        props: column.editRender.props,
      };
    }
    return {
      name: 'Input',
      props: {
        placeholder: column.title,
      },
    };
  }

  function normalizeColumnRecord(item: Record<string, any> = {}) {
    const uuid = item?.uuid ?? buildUUID();
    return {
      ...cloneDeep(rowData),
      ...item,
      uuid,
    };
  }

  function createEmptyColumnRecord() {
    return normalizeColumnRecord();
  }

  function executeAdd(data) {
    setDisabled(false);
    setState({
      commonConfig: {
        disabled: false,
      },
    });
    setSourceItems([]);

    const userInfo = userStore.userInfo;

    const organizationName = userInfo.organizeName || '';
    const userName = userInfo.userName || '';
    const userAccount = userInfo.userAccount || '';
    if (!organizationName || !userName || !userAccount) {
      return;
    }
    setValues({
      organizationName: getLastThreeSegments(organizationName),
      userAccount: `${userName}/${userAccount}`,
    });
    console.log({
      organizationName: getLastThreeSegments(organizationName),
      userAccount: `${userName}/${userAccount}`,
    });
  }

  function executeEdit(data) {
    console.log(data, 'datadatadata');
    state.id = data.id;
    setValues(data);
    setDisabled(false);
    setState({
      commonConfig: {
        disabled: false,
      },
    });
    setSourceItems(data.productQcItems || []);
  }

  function executeView(data) {
    setState({
      commonConfig: {
        disabled: true,
      },
    });
    setValues(data);
    setSourceItems(data.productQcItems || []);
    setDisabled(true);
  }

  async function handleSubmit(type) {
    const formValues = await getValues();
    const list = cloneDeep(qcItems.value);

    changePopuploading(true);
    const params = {
      ...formValues,
      productQcItems: list,
    };
    let func = saveProductDetail;

    if (state.id) {
      params.id = state.id;
      func = updateProductDetail;
    }

    func(params)
      .then(({ code, data, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          state.id = data || state.id;
          emit('submitSuccess', data);
          if (type === 'submit') {
            closeDetailPopup();
          }
        }
      })
      .finally(() => {
        changePopuploading(false);
      });
  }

  function getLastThreeSegments(path) {
    const segments = path.split('/').filter(segment => segment !== '');

    if (segments.length <= 3) {
      return segments.join('/');
    }

    return segments.slice(-3).join('/');
  }

  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    setGridOptions({
      editConfig: {
        ...baseEditConfig,
        enabled: !disabled,
      },
      keyboardConfig: {
        ...baseKeyboardConfig,
        isEdit: !disabled,
      },
      clipConfig: {
        isPaste: !disabled,
      },
    });
  }

  function renderTransposeEditor(renderOpts, params) {
    const editor = params.row.__editor;
    const rendererName = editor?.name || 'Input';
    const renderer = VxeUI.renderer.get(rendererName);
    if (renderer?.renderTableEdit) {
      return renderer.renderTableEdit(
        {
          ...renderOpts,
          name: rendererName,
          props: editor?.props,
        },
        params,
      );
    }
    return null;
  }
</script>

<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :okText="t('common.temporarySave')"
    :showCancelBtn="false"
    destroyOnClose
    @ok="handleSubmit"
    :title="title"
    class="full-popup pb-10px">
    <template #centerToolbar>
      <a-space class="mr-12px">
        <a-button v-if="state.mode !== ModeTypeEnum.VIEW" type="primary" ghost @click="handleSubmit('save')">{{ t('common.temporarySave') }}</a-button>
        <a-button v-if="state.mode !== ModeTypeEnum.VIEW" type="primary" @click="handleSubmit('submit')">{{ t('common.submit') }}</a-button>
      </a-space>
    </template>
    <div class="bg-[#ebeef5]">
      <a-card>
        <Subtitle title="基础信息" />
        <Form />
      </a-card>
    </div>
    <div class="bg-[#ebeef5] h-10px w-full"></div>
    <Grid class="grid">
      <template v-if="!state.disabled" #toolbar-actions>
        <Subtitle placement="vxe" title="检测信息" id="material" :defaultValue="2" :extra="{ show: true }" @addColumn="handleAddColumns" />
      </template>
      <template #transposeHeader="{ column }">
        <div v-if="isDynamicColumnField(column.field)" class="transpose-header">
          <span>{{ getColumnHeaderLabel(column.field) }}</span>
          <span v-if="!state.disabled" class="transpose-header-actions">
            <i class="icon-ym icon-ym-btn-add" @click.stop="handleColumnAction('add', column.field)"></i>
            <i class="icon-ym icon-ym-btn-copy" @click.stop="handleColumnAction('copy', column.field)"></i>
            <i class="icon-ym icon-ym-delete" @click.stop="handleColumnAction('delete', column.field)"></i>
          </span>
        </div>
        <span v-else>{{ column.title }}</span>
      </template>
    </Grid>
  </BasicPopup>
</template>

<style scoped lang="less">
  .grid {
    height: calc(100% - 132px);
  }

  :deep(.required) {
    & > label::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ff4d4f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }

  .transpose-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .transpose-header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #909399;
  }

  .transpose-header-actions i {
    cursor: pointer;
    font-size: 14px;
  }

  .transpose-header-actions i:hover {
    color: #ff7b00;
  }
</style>
