<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="isCanEdit"
    :okText="t('common.submit')"
    :title="state.title"
    @ok="handleSave"
    class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <BasicForm v-if="isCanEdit" @register="registerAuditForm" class="audit-form" />

      <Subtitle :title="t('dict.altMaterial.alternativeInfo')" class="mt-8px pb-0px" :extra="{ show: true, hideAdd: true }">
        <template v-if="isCanEdit" #extra>
          <BasicForm @register="registerForm" class="basic-form" />
          <AddCustomRows v-if="isAdd" @submit="addColumn" style="display: inline-flex" />
        </template>
      </Subtitle>
      <Grid style="height: calc(100% - 120px)">
        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { reactive, nextTick, computed, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, pick } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getEditTableColumn } from './addPopupConfig';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { useBaseStore } from '/@/store/modules/base';
  import { checkPriority, checkSameTableData } from '../config';
  import { getFactoryList } from '/@/api/customerSerivce/index';
  import { handleMaterialCodeChange } from './addPopupConfig';
  import { getShortMaterialCodeList } from '/@/api/structure/materialCode';
  import { save } from '/@/api/engineering/alternative';

  import { TableAction, ActionItem } from '/@/components/Table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { AddCustomRows } from '/@/components/AddCustomRows';

  interface State {
    title: string;
    initFields: any;
  }

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const emits = defineEmits(['register', 'reload']);

  const currentMainprocess = ref<number | string>(1);

  const state = reactive<State>({
    title: t('common.add2Text'),
    initFields: {
      insidePartNumber: '',
      semiFinishedProductsPartNumber: '',
      sku: '',
      version: '',
      config: '',
      materialTypeCode: '',
      semiFinishedProductsDesc: '',
      productionType: '',
      remarks: '',
    },
  });
  // 可编辑状态列表
  const { createMessage, createConfirm } = useMessage();

  const columns = getEditTableColumn(currentMainprocess);
  const gridOptions: VxeGridProps = {
    columns: columns as any,
    height: 'auto',
    keepSource: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules: {
      priority: [
        { required: true, message: t('common.required') },
        {
          validator: ({ row }) => {
            const sameItem = checkPriority(row, gridApi.getDataSource());
            return sameItem ? Promise.reject(new Error(sameItem.checkMessage)) : Promise.resolve();
          },
        },
      ],
      factory: [
        { required: true, message: t('common.required') },
        {
          validator: ({ row }) => {
            const sameItem = checkSameTableData(row, gridApi.getDataSource());
            return sameItem ? Promise.reject(new Error(sameItem.checkMessage)) : Promise.resolve();
          },
        },
      ],
      orgCode: [
        { required: true, message: t('common.required') },
        {
          validator({ row }) {
            // 一条数据，`替代料八码`和`被替代料八码`，不能相同
            if (row.orgCode === row.altCode) {
              return Promise.reject(new Error(t('dict.AltMaterial.orgCodeEqualAltCodeTip')));
            }

            // 检测是否存在相同的`工厂(factory)`、`被替代料八码(orgCode)`、`替代料八码(altCode)`的数据
            const sameItem = checkSameTableData(row, gridApi.getDataSource());
            return sameItem ? Promise.reject(new Error(sameItem.checkMessage)) : Promise.resolve();
          },
        },
      ],
      altCode: [
        { required: true, message: t('common.required') },
        {
          validator({ row }) {
            // 一条数据，`替代料八码`和`被替代料八码`，不能相同
            if (row.orgCode === row.altCode) {
              return Promise.reject(new Error(t('dict.AltMaterial.orgCodeEqualAltCodeTip')));
            }

            // 检测是否存在相同的`工厂(factory)`、`被替代料八码(orgCode)`、`替代料八码(altCode)`的数据
            const sameItem = checkSameTableData(row, gridApi.getDataSource());
            return sameItem ? Promise.reject(new Error(sameItem.checkMessage)) : Promise.resolve();
          },
        },
      ],
    },
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    data: [{ ...state.initFields }],
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'AltMaterialColumn',
    },
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      // @ts-ignore
      'cell-delete-value': ({ row, column }) => {
        /** 工厂 删除处理 */
        handleAfterPasterFactory([column], [row]);
        /** 被替代料 - 材料八码删除处理 */
        handleAfterPasterMaterialCode([column], [row], 'orgCode');
        /** 替代料 - 材料八码删除处理 */
        handleAfterPasterMaterialCode([column], [row], 'altCode');
      },
    },
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init(_data: any) {
    nextTick(() => {
      setFieldsValue({ mainProcess: currentMainprocess.value });
      setAuditFieldsValue({ review: '' });
      state.title = t('common.add2Text');
      gridApi.setGridOptions({ editConfig: { enabled: true } });
      gridApi.reloadColumn(columns);

      if (Array.isArray(_data.data) && _data.data.length > 0) {
        let list: Array<any> = [];
        if (_data.type === 'copyAdd') {
          list = cloneDeep(_data.data).map(item => {
            delete item.id;
            delete item.status;
            delete item.enable;
            return item;
          });
        } else if (_data.type === 'edit') {
          list = cloneDeep(_data.data);
          state.title = t('common.editText');
          currentMainprocess.value = _data.data[0].mainProcess || 1;
          setFieldsValue({ mainProcess: currentMainprocess.value });
          gridApi.reloadColumn(columns.slice(0, -1));
        }

        checkIsCanEdit(list);
        setAuditFormData(list);

        setTimeout(() => {
          gridApi.reloadData(list);
        });
      }
    });
  }

  function checkIsCanEdit(data: Array<any>) {
    // `撤回(4)`、`驳回(5)`可编辑
    const isCanEditStatusList = [4, 5];
    if (data.every(item => item.status && !isCanEditStatusList.includes(+item.status))) {
      state.title = t('common.detailText');
      gridApi.setGridOptions({ editConfig: { enabled: false } });
      gridApi.reloadColumn(columns.slice(0, -1));
      return true;
    }
    return false;
  }

  const isCanEdit = computed(() => {
    return state.title !== t('common.detailText');
  });

  const isAdd = computed(() => {
    return state.title === t('common.add2Text');
  });

  function setAuditFormData(data: Array<any>) {
    try {
      const target = data[0];
      const reviewJson = JSON.parse(target.reviewJson);
      setAuditFieldsValue({ review: reviewJson?.[0]?.handlerId || '' });
    } catch (error) {
      setAuditFieldsValue({ review: '' });
    }
  }

  function getTableActions(row: any, rowIndex: number): ActionItem[] {
    const list: ActionItem[] = [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: addColumn.bind(null, 1, rowIndex),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];

    return list;
  }
  // 删除数据
  function handleDelete(row: any) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () => {
        gridApi.grid.remove(row);
        return Promise.resolve();
      },
    });
  }
  // 增加列
  function addColumn(line, index = -1) {
    const list = getDataSource();
    const addList: Array<any> = [];
    for (let i = 0; i < line; i++) {
      addList.push({
        _X_ROW_KEY: buildUUID(),
        ...state.initFields,
      });
    }
    if (index === -1) {
      list.push(...addList);
    } else {
      list.splice(index + 1, 0, ...addList);
    }
    gridApi.grid.reloadData(list);
  }
  function handleCopy(row: any) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }

  const [registerForm, { setFieldsValue, validate }] = useForm({
    baseColProps: {
      span: 24,
    },
    layout: 'horizontal',
    // @ts-ignore
    schemas: [
      {
        field: 'mainProcess',
        label: t('dict.CommonCol.mainProcess'),
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('MainProcess', true),
          showSearch: true,
          placeholder: '',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          immediate: true,
          allowClear: false,
          onChange: (value: number) => {
            currentMainprocess.value = value;
          },
        },
      },
    ],
  });

  const [registerAuditForm, { validate: validateAduitForm, setFieldsValue: setAuditFieldsValue }] = useForm({
    baseColProps: {
      span: 24,
    },
    layout: 'horizontal',
    // @ts-ignore
    schemas: [
      {
        field: 'review',
        label: t('common.approver'),
        component: 'CustomUserSelect',
        componentProps: {
          immediate: true,
        },
        required: true,
      },
    ],
  });

  function getDataSource() {
    return cloneDeep(gridApi.grid.getFullData());
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    const excludeFields = ['checkMessage'];
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .slice(1, -1)
      .forEach((el: any) => {
        if (!el.disabled && !excludeFields.includes(el.field)) {
          fields.push(el.field);
        }
      });
    return fields.concat(['orgSupplierName', 'orgTypeName', 'altSupplierName', 'altTypeName', 'id', 'enable']);
  }
  async function handleSave() {
    if (await gridApi.grid.validate(true)) {
      // return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
      return false;
    }
    const formData = await validate();

    const auditFormData = await validateAduitForm();

    if (!auditFormData) {
      return false;
    }

    const listField: any = getEnableCols();
    const list = gridApi.getDataSource().map(el => pick(el, listField));

    changeLoading(true);
    return save({ ...formData, reviewJson: [{ node: 'Review', handlerId: auditFormData.review }], list, saveAndCommit: true, isUpgrade: false })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
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

    /** 工厂复制黏贴处理 */
    handleAfterPasterFactory(cols, rows);

    /** 被替代料 - 材料八码复制处理 */
    handleAfterPasterMaterialCode(cols, rows, 'orgCode');

    /** 替代料 - 材料八码复制处理 */
    handleAfterPasterMaterialCode(cols, rows, 'altCode');

    return true;
  }

  /**
   * 工厂复制处理
   * @param cols
   * @param rows
   * @param pasteCells
   */
  async function handleAfterPasterFactory(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'factory');
    if (targetIndex == -1) return false;

    const tableData = gridApi.getDataSource();

    const needToGetInfoByApi: Array<any> = [];

    // 判断当前表格是否存在相同工厂信息，如果存在，则将其对应的工厂值复制过来
    rows.forEach((row: any) => {
      const targetValue = row.factory || '';
      if (!targetValue) {
        row.factoryName = '';
        return;
      }
      const target = tableData.find(item => item._X_ROW_KEY !== row._X_ROW_KEY && (item.factory === targetValue || item.factoryName === targetValue));
      if (target) {
        row.factory = target.factory;
        row.factoryName = target.factoryName;
        return;
      }
      needToGetInfoByApi.push(row);
    });

    if (needToGetInfoByApi.length === 0) {
      return false;
    }

    await getFactoryList({ mainProcess: currentMainprocess.value || '' }).then(res => {
      const dataList = res.data;
      needToGetInfoByApi.forEach(row => {
        const targetValue = row.factory || '';
        const target = dataList.find(item => item.Code === targetValue || item.Name === targetValue);
        if (target) {
          row.factory = target.Code;
          row.factoryName = target.Name;
        }
      });
    });
  }

  /**
   * 材料八码 复制黏贴处理
   * @param cols
   * @param rows
   * @param field
   */
  function handleAfterPasterMaterialCode(cols: Array<{ field: string }>, rows: Array<any>, field: 'orgCode' | 'altCode') {
    const targetIndex = cols.findIndex((item: any) => item.field === field);
    if (targetIndex == -1) return false;

    const tableData = gridApi.getDataSource();

    // 判断当前表格是否存在相同工厂信息，如果存在，则将其对应的工厂值复制过来
    rows.forEach((row: any) => {
      const targetValue = row[field] || '';
      if (!targetValue) {
        handleMaterialCodeChange(field, null, row);
        return;
      }
      const target = tableData.find(item => item._X_ROW_KEY !== row._X_ROW_KEY && item[field] === targetValue);
      if (target) {
        handleMaterialCodeChange(field, null, row);
        if (field === 'orgCode') {
          row.orgSupplier = target.orgSupplier;
          row.orgSupplierName = target.orgSupplierName;
          row.orgType = target.orgType;
          row.orgTypeName = target.orgTypeName;
          row.orgDesc = target.orgDesc;
        } else {
          row.altSupplier = target.altSupplier;
          row.altSupplierName = target.altSupplierName;
          row.altType = target.altType;
          row.altTypeName = target.altTypeName;
          row.altDesc = target.altDesc;
        }
      } else {
        getShortMaterialCodeList({ shortMaterialCode: targetValue }).then(res => {
          Array.isArray(res.data) && res.data.length > 0 ? handleMaterialCodeChange(field, res.data[0], row) : handleMaterialCodeChange(field, null, row);
        });
      }
    });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.basic-content-wrap) {
    display: inline-flex;
  }

  :deep(div.lydc-subtitle-container) {
    padding-bottom: 0;
  }

  :deep(div.vxe-grid--layout-body-wrapper) {
    padding: 0;
  }

  :deep(.audit-form) {
    width: 300px;

    div.ant-form-item-label {
      width: max-content !important;
    }
  }

  .basic-form {
    display: inline-block;
    width: 200px;
    margin-right: 8px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
