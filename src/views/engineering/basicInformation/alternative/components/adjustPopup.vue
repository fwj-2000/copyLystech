<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="t('common.adjust')"
    @ok="handleSave"
    class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <BasicForm @register="registerAuditForm" class="audit-form" />

      <Subtitle :title="t('dict.altMaterial.alternativeInfo')" class="mt-8px pb-0px" />
      <Grid>
        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { reactive, nextTick } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, pick } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getEditTableColumn } from './adjustPopupConfig';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { checkPriority, enableStatusOptions } from '../config';
  import { save } from '/@/api/engineering/alternative';

  import { TableAction, ActionItem } from '/@/components/Table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';

  interface State {
    initFields: any;
  }

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  const state = reactive<State>({
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

  const gridOptions: VxeGridProps = {
    columns: getEditTableColumn() as any,
    height: 'auto',
    keepSource: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules: {
      priority: [
        {
          validator: ({ row }) => {
            return checkPriority(row, gridApi.getDataSource()) ? Promise.reject(new Error(t('dict.altMaterial.priorityDuplication'))) : Promise.resolve();
          },
        },
      ],
      updateRemark: [{ required: true, message: t('common.required') }],
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
        /** 是否启用 删除处理 */
        handleAfterPasterEnable([column], [row]);
      },
    },
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init(_data: any) {
    nextTick(() => {
      setAuditFieldsValue({ review: '' });
      if (Array.isArray(_data.data) && _data.data.length > 0) {
        gridApi.reloadData(cloneDeep(_data.data).map(item => ({ ...item, updateRemark: '' })));
        setAuditFormData(_data.data);
      }
    });
  }

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
    list.splice(index === -1 ? -1 : index + 1, 0, ...addList);
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
    // const fields: Array<string> = [];
    // gridApi.grid
    //   .getColumns()
    //   .slice(1, -1)
    //   .forEach((el: any) => {
    //     if (!el.disabled) {
    //       fields.push(el.field);
    //     }
    //   });
    // return fields.concat(['id']);
    return ['id', 'priority', 'enable', 'updateRemark'];
  }
  async function handleSave() {
    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }
    const auditFormData = await validateAduitForm();
    if (!auditFormData) {
      return false;
    }

    const listField: any = getEnableCols();
    const tableData = gridApi.getDataSource();
    const list = tableData.map(el => pick(el, listField));

    // 是否为新增调整数据，判断进入调整界面的数据状态是否为`已处理(3)`，如果是，为新增调整，该值为true；否则，该值为false
    const isUpgrade = tableData.every(el => +el.status === 3);

    changeLoading(true);
    return save({ reviewJson: [{ node: 'Review', handlerId: auditFormData.review }], list, saveAndCommit: true, isUpgrade })
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

    /** `是否启用`复制黏贴处理 */
    handleAfterPasterEnable(cols, rows);

    return true;
  }

  /**
   * `是否启用`复制黏贴处理
   */
  function handleAfterPasterEnable(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'enable');
    if (targetIndex == -1) return false;

    rows.forEach(row => {
      const targetValue = row.enable;
      const target = enableStatusOptions.find(item => item.label === targetValue || item.value === targetValue);
      if (target) {
        row.enable = target.value;
      } else {
        row.enable = '';
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
