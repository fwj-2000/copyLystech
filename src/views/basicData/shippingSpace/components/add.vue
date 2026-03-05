<template>
  <BasicPopup
    v-bind="$attrs"
    :showOkBtn="hasBtnP('btn_edit')"
    @register="registerPopup"
    @ok="handleSubmit"
    :okText="t('common.saveText')"
    destroyOnClose
    :cancelText="t('common.cancelText')"
    :title="getTitle"
    class="full-popup">
    <template #insertToolbar>
      <div v-if="state.type == 'add'">
        <a-divider type="vertical" class="ml-10px"></a-divider>
      </div>
    </template>
    <div class="h-full p-10px">
      <Grid>
        <template #buttons>
          <BasicForm v-if="state.type == 'add'" class="flex-1" @register="registerForm" />
        </template>
        <template #toolbarTools>
          <AddCustomRows v-if="state.type == 'add'" @submit="handleAddColumn" />
        </template>
        <template #action="{ row, rowIndex }">
          <TableAction outside :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { computed, reactive, nextTick, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { add, update, getDetailById } from '/@/api/business/shippingspace';
  import { columnsOps, mainCoulumn, filterFactory, filterSapFactory, handleFactoryCode, handleSapFactoryCode } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';
  import { shippingSpaceTypeOpiotns, shippingSpaceAttributionOptions } from '../config';

  const { hasBtnP } = usePermission();
  interface State {
    id: string;
    type: 'add' | 'edit';
    dataSource: any[];
  }

  const state = reactive<State>({
    id: '',
    type: 'add',
    dataSource: [],
  });

  const emit = defineEmits(['register', 'reload']);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const currentMainProcess = ref(1);

  const getTitle = computed(() => {
    return state.type == 'add' ? t('common.add') : t('common.editText');
  });

  const [registerForm, { validate, setFieldsValue }] = useForm({
    schemas: [
      {
        field: 'mainProcess',
        label: t('dict.SalesShipPatternColumn.mainProcessDesc'),
        component: 'ApiSelect',
        // 默认选择模切
        defaultValue: 1,
        componentProps: {
          api: () => baseStore.getDictionaryData('MainProcess'),
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          // placeholder: '主要制程',
          style: 'width: 100%',
          allowClear: false,
          onChange: handleMainProcessChange,
        },
        // rules: [{ required: true, message: t('dict.CommonCol.enterRequiredFields'), trigger: 'blur' }],
      },
    ],
    labelWidth: 80,
    baseColProps: { span: 6 },
    actionColOptions: { span: 6 },
  });

  // 定义 gridOptions
  const gridOptions: VxeGridProps = {
    id: 'basicData-shippingSpace-edit',
    columns: mainCoulumn as any,
    height: 'auto',
    proxyConfig: {
      enabled: false,
    },
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules: {
      isCalcWithMRP: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
      sapFactoryCode: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
      factoryCode: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
      shippingSpaceCode: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
      shippingSpaceName: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
      type: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
      attribution: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
    },
    toolbarConfig: {
      enabled: true,
      refresh: false,
      custom: false,
      slots: {
        tools: 'toolbarTools',
        buttons: 'buttons',
      },
    },
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'ShippingSpaceColumn',
    },
    showIndexColumn: true,
    pagerConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
      beforePasteMethod: ({ targetAreas }) => {
        // 粘帖前的校验处理
        if (targetAreas.length === 0) {
          return false;
        }
        const { cols } = targetAreas[0];

        for (const col of cols) {
          if (
            // 不是可编辑单元格，禁止粘帖，判断`col.editRender.enabled === false`是因为在配置`editRender.name`的情况下，可以开启编辑，但是此时`col.editRender.enabled`可能为`undefined`
            !col.editRender ||
            col.editRender.enabled === false ||
            col.editRender.props?.disabled === true
          ) {
            createMessage.warning(t('common.noPastingTip'));
            return false;
          }
        }

        return true;
      },
    },
  };

  const [registerPopup, { changeLoading, changeOkLoading, closePopup }] = usePopupInner(init);
  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions,
  });

  function handleAddColumn(num = 1, index = -1) {
    const list: Array<any> = [];
    for (let i = 0; i < num; i++) {
      list.push({
        ...cloneDeep(columnsOps),
        mainProcess: currentMainProcess.value,
        isCalcWithMRP: 1,
      });
    }

    nextTick(() => {
      const originList = gridApi.getDataSource();
      if (index === -1) {
        originList.push(...list);
        gridApi.grid.reloadData(originList);
      } else if (index > -1) {
        originList.splice(index + 1, 0, ...list);
        gridApi.grid.reloadData(originList);
      }
    });
  }

  function getTableActions(row: any, index: number): ActionItem[] {
    const list: ActionItem[] = [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        tooltip: t('common.add1Text'),
        onClick: handleAddColumn.bind(null, 1, index),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copy'),
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
    return state.type === 'add' ? list : [];
  }

  function handleCopy(row: any) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    if (item.id) {
      delete item.id;
    }
    const list = gridApi.getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }

  function handleDelete(row: any) {
    gridApi.grid.remove(row);
  }

  function handleMainProcessChange(value: any) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.ShippingSpace.changeMainProcessTip'),
      onOk: async () => {
        currentMainProcess.value = value;
        await gridApi.reloadData([]);
        handleAddColumn();
      },
      onCancel: () => {
        setFieldsValue({
          mainProcess: currentMainProcess.value,
        });
      },
    });
  }

  function init(data) {
    state.id = data.id;
    state.type = data.type;
    //更新
    if (state.type == 'edit') {
      changeLoading(true);
      getDetailById(state.id).then(res => {
        const data = res.data;
        const row = {
          _X_ROW_KEY: buildUUID(),
          ...cloneDeep(data),
        };
        gridApi.grid.reloadData([row]);
        changeLoading(false);
      });
    }
    if (data.type == 'add') {
      handleAddColumn();
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

    // 工厂 黏贴处理
    handleAfterPasterFactory(cols, rows);

    // Sap工厂 黏贴处理
    handleAfterPasterSapFactory(cols, rows);

    // 仓位类型 粘帖处理
    handleAfterPasterByDict(cols, rows, { id: 'type', name: 'typeName', value: 'enCode', label: 'fullName' }, shippingSpaceTypeOpiotns);

    // 仓位归属 粘帖处理
    handleAfterPasterByDict(cols, rows, { id: 'attribution', name: 'attributionName', value: 'enCode', label: 'fullName' }, shippingSpaceAttributionOptions);

    return true;
  }

  /**
   * 工厂 粘帖处理
   */
  async function handleAfterPasterFactory(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'factoryCode');
    if (targetIndex == -1 || rows.length === 0) return false;

    const { data: options } = await filterFactory({ mainProcess: currentMainProcess.value });
    rows.forEach(row => {
      const target = options.find(option => option.Code === row.factoryCode);
      if (target) {
        handleFactoryCode(target, row);
      } else {
        createMessage.warn(t('dict.CommonCol.dataDoesNotExist'));
        row.factoryCode = '';
        handleFactoryCode({}, row);
      }
    });
  }

  /**
   * SAP工厂 粘帖处理
   */
  async function handleAfterPasterSapFactory(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'sapFactoryCode');
    if (targetIndex == -1 || rows.length === 0) return false;

    rows.forEach(async row => {
      const { data: options } = await filterSapFactory({ factoryCode: row.factoryCode });
      const target = options.find(option => option.code === row.sapFactoryCode);
      if (target) {
        handleSapFactoryCode(target, row);
      } else {
        createMessage.warn(t('dict.CommonCol.dataDoesNotExist'));
        row.sapFactoryCode = '';
        handleSapFactoryCode({}, row);
      }
    });
  }

  /**
   * 复制字典中的内容
   * @param cols
   * @param rows
   * @param fieldConfig
   * @param dcit
   */
  function handleAfterPasterByDict(
    cols: Array<{ field: string }>,
    rows: Array<any>,
    fieldConfig: { id: string; name: string; value: string; label: string },
    dictList: Array<any>,
  ) {
    const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
    if (targetIndex == -1 || rows.length === 0) return false;

    rows.forEach((row: any) => {
      const value = row[fieldConfig.id] || '';
      const target = dictList.find(item => `${item[fieldConfig.value]}` === `${value}` || `${item[fieldConfig.label]}` === `${value}`);
      Object.assign(row, { [fieldConfig.id]: target?.[fieldConfig.value] || '', [fieldConfig.name]: target?.[fieldConfig.label] || '' });
    });
  }

  //提交
  async function handleSubmit() {
    if ((state.type == 'add' && !(await validate())) || (await gridApi.grid.validate(true))) {
      createMessage.warn(t('dict.CommonCol.enterRequiredFields'));
      return false;
    }

    changeOkLoading(true);
    // 校验填写完整
    // let validate = true;
    // state.tempList.forEach(el => {
    //   for (let k in columnsOps) {
    //     if (k != 'remarks') {
    //       if(!el[k]){
    //         changeOkLoading(false);
    //         validate = false;
    //         return message.error('请填写完整信息~');
    //       }
    //     }
    //   }
    // });
    // if (!validate) return;
    let query;
    let formMethod;
    const { id } = state;
    if (id) {
      formMethod = update;
      query = {
        id: id,
        ...gridApi.getDataSource()[0],
      };
    } else {
      formMethod = add;
      query = gridApi.getDataSource();
      if (query.length === 0) {
        createMessage.warn(t('dict.CommonCol.dataDoesNotExist'));
        return false;
      }
    }
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closePopup();
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  :deep(.vxe-toolbar) {
    align-items: center;
  }
</style>
