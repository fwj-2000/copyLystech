<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.show.submit"
    :okText="t('common.submit')"
    :okbuttonProps="{ class: 'my-12px' }"
    :cancelButtonProps="{ class: 'my-12px,mr-12px' }"
    :title="title"
    @ok="() => handleSave(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button v-if="state.show.submit" class="ml-12px mr-0px" @click="handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop p-10px">
      <!-- <div class="lydc-content-wrapper-search-box pt-8px mb-16px">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicForm @register="registerForm" />
      </div> -->
      <Subtitle :title="t('common.applyInfo')" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }">
        <template #extra>
          <AddCustomRows @submit="addColumn" />
        </template>
      </Subtitle>
      <Grid>
        <template #action="{ row }">
          <TableAction :outside="true" :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { formatToDate } from '/@/utils/dateUtil';
  import { getunitList } from '/@/api/common/constant';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { reactive, toRefs, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { selectMultiple } from '/@/api/business/quota';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { statusOptions, STATUS_ENUM } from '../configVxe';
  import { TableAction, ActionItem } from '/@/components/Table';
  // import dayjs from 'dayjs';
  // import { useUserStore } from '/@/store/modules/user';
  import { cloneDeep, pick } from 'lodash-es';
  // import { BasicForm, useForm } from '/@/components/Form';
  import {
    createSampleMaterialApply,
    getInnerMaterialNumbers,
    getSpaceList,
    getFactoryList,
    getApplyDatasByApplyNumber,
    updateSampleMaterialApply,
    batchDelete,
  } from '/@/api/engineering/sample';
  import {
    /** schemas, */ getEditTableColumn,
    editRules,
    handleInnerPartNumberItem,
    computeApplyArea,
    computeProductArea,
    getRelatedPersonnel,
  } from './configVxe';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { pastePartNumberFactorys } from '/@/utils/pasterPartNumberFactorys';

  const emits = defineEmits(['register', 'reload']);

  interface State {
    type: 'add' | 'edit' | 'view';
    systemId: string;
    show: {
      submit: boolean;
    };
    title: string;
    parentId: string;
    base: any;
    line: number;
    validate: string;
    initFields: any;
    applyNumber: string;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    type: 'add',
    show: {
      submit: true,
    },
    systemId: '',
    title: t('common.addText'),
    parentId: '',
    base: {},
    line: 1,
    validate: '',
    initFields: {
      innerMaterialNumber: '',
      terminalCustomerPartNumber: '',
      projectPhase: '',
      factory: '',
      teakQty: '',
      qty: 1,
      measurementUnitId: '',
    },
    applyNumber: '',
  });
  const { title } = toRefs(state);
  // 可编辑状态列表
  const editStatusList = [STATUS_ENUM.驳回, STATUS_ENUM.撤回, STATUS_ENUM.暂存];
  // const userStore = useUserStore();
  const { createMessage, createConfirm } = useMessage();

  // const [registerForm, { /** getFieldsValue, */ setFieldsValue }] = useForm({
  //   baseColProps: {
  //     span: 7,
  //   },
  //   layout: 'horizontal',
  //   i18nConfig: {
  //     moduleCode: 'QuantitativeApplyColumn',
  //     transferRange: ['label'],
  //     // @ts-ignore
  //     en_US: {
  //       labelWidth: 200,
  //     },
  //   },
  //   // @ts-ignore
  //   schemas,
  // });

  const gridOptions: VxeGridProps = {
    id: 'engineering-sampleApply-editPop-Apply',
    columns: getEditTableColumn() as any,
    height: 'auto',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      beforeEditMethod: ({ row }) => {
        return state.type !== 'view' && (editStatusList.includes(row.applyStatus) || !row.applyStatus);
      },
    },
    editRules,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    data: [state.initFields],
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      // @ts-ignore
      afterPasteMethod: handleAfterPaster,
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'SampleApplyColumn',
    },
    pagerConfig: {
      enabled: false,
    },
    // keyboardConfig: {
    //   delMethod: ({ row, column }) => {
    //     handleAfterPasterApplyArea([column], [row]);
    //     handleAfterPasterProductArea([column], [row]);
    //   }
    // }
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      // @ts-ignore
      'cell-delete-value': ({ row, column }) => {
        handleAfterPasterApplyArea([column], [row]);
        handleAfterPasterProductArea([column], [row]);
        // 采购处理
        handleAfterPasterUser([column], [row], { id: 'purchaseUserId', name: 'purchaseUserName' });
        // PD处理
        handleAfterPasterUser([column], [row], { id: 'personEngineeringId', name: 'personEngineeringName' });
      },
    },
  });

  const [registerPopup, { closePopup, /** changeOkLoading, */ changeLoading }] = usePopupInner(init);

  async function init(data) {
    state.systemId = data.id;
    state.title = data.title || state.title;
    state.type = data.type || 'add';
    state.applyNumber = data.applyNumber || '';
    state.show.submit = state.type !== 'view';
    nextTick(() => {
      // setFieldsValue({
      //   applyUserName: `${userStore.getUserInfo.userName}/${userStore.getUserInfo.userAccount}`,
      //   applyDateTime: dayjs(new Date()).format('YYYY/MM/DD'),
      // });
      Promise.all([initMeasurementUnitList(), initApplyShippingSpaceList() /** initFactoryList() */]).then(res => {
        const columns = getEditTableColumn();
        const list = res.filter(Boolean);
        list.length > 0 && list.forEach(item => item && columns.splice(item.index, 1, item.column as any));

        // 如果不是`新增(add)`，显示状态
        if (state.type !== 'add') {
          columns.splice(1, 0, {
            title: '状态',
            field: 'applyStatus',
            i18nField: 'CommonCol.status',
            width: 160,
            cellRender: {
              name: 'Tag',
              options: statusOptions,
            },
          } as any);
        }

        if (state.type === 'view') {
          columns.pop();
        }

        gridApi.reloadColumn(columns);
      });
    });
    getDetailList();
  }

  function getTableActions(row): ActionItem[] {
    const list: ActionItem[] = [
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
    return state.type === 'view' ? [] : state.type === 'edit' ? list.slice(1) : list;
  }
  // 删除数据
  function handleDelete(row: any) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: async () => {
        //未暂存：直接本地删除
        if (!row?.id) {
          gridApi.grid.remove(row);
          return Promise.resolve();
        }
        //已暂存：先调后端删除，再移除行
        try {
          const { code, msg } = await batchDelete([row.id]);
          if (code === 200) {
            createMessage.success(msg || t('sys.api.operationSuccess'));
            gridApi.grid.remove(row);
          }
        } catch (e) {
          createMessage.error(t('sys.api.operationFailed'));
        }

        return Promise.resolve();
      },
    });
  }

  // 增加列
  function addColumn(line) {
    const list = getDataSource();
    for (let i = 0; i < line; i++) {
      list.push({
        _X_ROW_KEY: buildUUID(),
        ...state.initFields,
      });
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
  function getDataSource() {
    return cloneDeep(gridApi.grid.getFullData());
  }

  /**
   * 获取详情
   */
  async function getDetailList() {
    if (!state.applyNumber) {
      state.type !== 'add' && closePopup();
      return Promise.resolve();
    }

    changeLoading(true);
    return getApplyDatasByApplyNumber(state.applyNumber)
      .then(res => {
        const data = formatData(res.data || []);
        // 如果不存在可编辑数据，改为详情显示
        if (data.every((item: any) => !editStatusList.includes(item.applyStatus))) {
          // 改状态及标题
          state.type = 'view';
          state.title = t('common.detailText');
          // 不可提交
          state.show.submit = false;
        }

        nextTick(() => gridApi.grid.reloadData(data || []));
      })
      .catch(() => {})
      .finally(() => {
        changeLoading(false);
      });
  }

  function formatData(data: Array<any>) {
    return data.map((item: any) => ({
      ...item,
      requestArrivalDate: formatToDate(item.requestArrivalDate),
      applyShippingSpaceName: [item.applyShippingSpaceCode, item.applyShippingSpaceName].filter(Boolean).join('/'),
    }));
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .slice(1, -1)
      .forEach((el: any) => {
        if (!el.disabled) {
          fields.push(el.field);
        }
      });
    return fields.concat(['factoryCode', 'factoryName', 'purchaseUserName', 'personEngineeringName', 'measurementUnit', 'id']);
  }
  async function handleSave(isSubmit = false) {
    if (isSubmit && (await gridApi.grid.validate(true))) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    // 提取出提交字段
    const listField: any = getEnableCols();
    const list = gridApi.grid
      .getFullData()
      .filter(item => !item.applyStatus || editStatusList.includes(item.applyStatus))
      .map(el => pick(el, listField));

    const api = state.type === 'add' ? createSampleMaterialApply : updateSampleMaterialApply;

    changeLoading(true);
    api(list, isSubmit)
      .then(res => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        if (state.type === 'add' && !isSubmit) {
          const list = res?.data || [];
          Array.isArray(list) && list.length > 0 && gridApi.grid.reloadData(formatData(list));
          state.type = 'edit';
          state.title = t('common.editText');
        }
        isSubmit && closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleAfterPaster({ targetAreas, pasteCells }) {
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

    // 产品内部料号复制处理
    await handleAfterPasterInsidePartNumber(cols, rows, pasteCellData);

    // 材料八码复制处理
    handleAfterPasterInnerMaterialNumber(cols, rows);

    // 申请仓位复制处理
    handleAfterPasterApplyShippingSpaceId(cols, rows, pasteCellData);

    // 计量单位复制处理
    handleAfterPasterMeasurementUnitId(cols, rows, pasteCellData);

    // 工厂复制处理
    pastePartNumberFactorys({
      cols,
      rows,
      pasteCells: pasteCellData,
      fields: {
        partNumberField: 'insidePartNumber',
        factoryField: 'factoryId',
        factoryNameField: 'factoryName',
        factoryValueField: 'Id',
        factoryNameFormat: ['Code', '/', 'Name'],
      },
      afterPaste({ row, factoryDetail }) {
        getRelatedPersonnel(row).then(res => {
          gridApi.grid.setRow(row, { ...res, factoryCode: factoryDetail.Code });
        });
      },
    });

    // 产品面积处理
    handleAfterPasterProductArea(cols, rows);

    // 申请面积处理
    handleAfterPasterApplyArea(cols, rows);

    // 采购处理
    handleAfterPasterUser(cols, rows, { id: 'purchaseUserId', name: 'purchaseUserName' });

    // PD处理
    handleAfterPasterUser(cols, rows, { id: 'personEngineeringId', name: 'personEngineeringName' });

    return true;
  }

  /**
   * 产品内部料复制处理
   * @param cols
   * @param rows
   * @param pasteCells
   */
  async function handleAfterPasterInsidePartNumber(cols: Array<{ field: string }>, rows: Array<{ insidePartNumber: string }>, pasteCells: any) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'insidePartNumber');
    if (targetIndex == -1) return false;

    // 处理请求参数
    const list = pasteCells.map((item: any) => item[targetIndex]);
    const chunks = splitArrayIntoChunks(list, 1000);

    const promiseList: Array<Promise<any>> = [];
    // 收集请求
    chunks.forEach(item => {
      promiseList.push(
        selectMultiple({
          pageSize: 1000,
          InsidePartNumbers: item,
        }),
      );
    });
    // 执行请求并且赋值
    return Promise.all(promiseList).then(res => {
      const data = res.reduce((prev, cur) => {
        return prev.concat(cur.data.list);
      }, []);

      const dataList = rows.map((item: any) => {
        const dataItem = data.find((el: any) => el.InsidePartNumber === item.insidePartNumber);
        return Object.assign(item, dataItem ? handleInnerPartNumberItem(dataItem) : {});
      });
      if (dataList.length == 0) return false;
      nextTick(() => {
        gridApi.grid.setRow(dataList);
        // 产品内部料号发生改变时重新获取材料内部料号对应的采购人员及原厂商型号
        handleAfterPasterInnerMaterialNumber([gridApi.grid.getColumns().find(item => item.field === 'innerMaterialNumber') || {}] as any[], dataList);
      });
    });
  }

  /**
   * 材料内部料号复制处理
   * @param cols
   * @param rows
   * @param pasteCells
   */
  function handleAfterPasterInnerMaterialNumber(
    cols: Array<{ field: string }>,
    rows: Array<{ innerMaterialNumber: string; factoryId?: string; insidePartNumber?: string }>,
  ) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'innerMaterialNumber');
    if (targetIndex == -1) return false;

    const params = rows.reduce((list: Array<any>, item) => {
      if (item.innerMaterialNumber) {
        list.push({
          factoryId: item.factoryId,
          insidePartNumber: item.insidePartNumber,
          innerMaterialNumber: item.innerMaterialNumber,
        });
      }
      return list;
    }, []);

    params.length > 0 &&
      getInnerMaterialNumbers(params).then(res => {
        const dataList = rows.map((item: any) => {
          const dataItem = (res.data || []).find((el: any) => el.innerMaterialNumber === item.innerMaterialNumber);
          return Object.assign(item, {
            // innerExternalNumber: dataItem?.originalModelNumber || dataItem?.innerExternalNumber || item?.innerExternalNumber || '',
            purchaseUserId: dataItem?.MaterialsPersonId || '',
            purchaseUserName: dataItem?.MaterialsPersonName || '',
          });
        });
        if (dataList.length == 0) return false;
        nextTick(() => {
          gridApi.grid.setRow(dataList);
        });
      });
  }

  /**
   * 申请仓位复制处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterApplyShippingSpaceId(
    cols: Array<{ field: string }>,
    rows: Array<{ applyShippingSpaceId: string; factoryId: string }>,
    pasteCells: string[][],
  ) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'applyShippingSpaceId');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      const target = applyShippingSpaceList.find(
        unit =>
          (unit.shippingSpaceName === targetValue || unit.id === targetValue || unit.fullName === targetValue) &&
          (!item.factoryId || unit.factoryId === item.factoryId),
      );
      return Object.assign(item, {
        applyShippingSpaceId: target?.id || '',
        applyShippingSpaceName: target?.fullName || '',
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /**
   * 计量单位复制处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterMeasurementUnitId(cols: Array<{ field: string }>, rows: Array<{ measurementUnitId: string }>, pasteCells: string[][]) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'measurementUnitId');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      const target = measurementUnitList.find(unit => unit.Name === targetValue || unit.Id === targetValue);
      return Object.assign(item, {
        measurementUnitId: target?.Id || '',
        measurementUnit: target?.Name || '',
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /**
   * 工厂复制处理
   * @param cols
   * @param rows
   * @param pasteCells
   */
  // function handleAfterPasterFactoryId(cols: Array<{ field: string }>, rows: Array<{ factoryId: string }>, pasteCells: string[][]) {
  //   const targetIndex = cols.findIndex((item: any) => item.field === 'factoryId');
  //   if (targetIndex == -1) return false;

  //   const dataList = rows.map((item, index) => {
  //     const targetValue = pasteCells?.[index]?.[targetIndex] || '';
  //     const target = factoryList.find(unit => unit.Name === targetValue || unit.Id === targetValue);
  //     return Object.assign(item, {
  //       factoryId: target?.Id || '',
  //       factoryName: target?.Name || '',
  //       factoryCode: target?.Code || '',
  //     });
  //   });
  //   if (dataList.length == 0) return false;
  //   nextTick(() => {
  //     gridApi.grid.setRow(dataList);
  //   });
  // }

  /**
   * 复制黏贴后产品面积计算
   * @param rows 粘贴的数据
   */
  function handleAfterPasterProductArea(cols: Array<{ field: string }>, rows: Array<{ productSizeLong: number; productSizeWide: number }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'productSizeLong' || item.field === 'productSizeWide');
    if (targetIndex == -1) return false;

    const dataList = rows.map(item => {
      return Object.assign(item, {
        productArea: computeProductArea(item),
      });
    });
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /**
   * 复制黏贴后申请面积计算
   * @param rows 粘贴的数据
   */
  function handleAfterPasterApplyArea(cols: Array<{ field: string }>, rows: Array<{ applySizeWide: number; applySizeLong: number; qty: number }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'applySizeWide' || item.field === 'applySizeLong' || item.field === 'qty');
    if (targetIndex == -1) return false;

    const dataList = rows.map(item => {
      return Object.assign(item, {
        applyArea: computeApplyArea(item),
      });
    });
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /**
   * 复制黏贴用户处理
   * @param cols 复制的列配置
   * @param rows 复制的行内容
   * @param fieldConfig 赋值字段配置
   */
  function handleAfterPasterUser(cols: Array<{ field: string }>, rows: Array<any>, fieldConfig: { id: string; name: string }) {
    const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
    if (targetIndex == -1 || rows.length === 0) return false;

    const { idList, accountList } = rows.reduce<{ idList: Array<string>; accountList: Array<string> }>(
      (obj, item: { [key: string]: string }) => {
        const value = item[fieldConfig.id] || '';
        // 如果是纯数字组成，则是id，否则按照accountList计算
        if (value && /^\d+$/.test(value)) {
          obj.idList.push(value);
        } else if (value) {
          const account = value.split('/').pop() || '';
          account && obj.accountList.push(account);
        }
        return obj;
      },
      { idList: [], accountList: [] },
    );

    Promise.all([
      idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList)]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      rows.forEach((row: any) => {
        const target = userList.find(item => item.id === row[fieldConfig.id] || item.fullName === row[fieldConfig.id]);
        Object.assign(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }

  const measurementUnitList: Array<any> = [];
  const measurementUnitColumn = {
    title: '数量单位',
    field: 'measurementUnitId',
    width: 200,
    i18nField: 'measurementUnit',
    editRender: {
      name: 'ASelect',
      cacheField: 'measurementUnit',
      props: {
        options: [] as Array<{ label: string; value: string }>,
        showSearch: true,
        allowClear: true,
        filterOption: (inputValue: string, option: any) => option.label.includes(inputValue),
      },
    },
  };
  async function initMeasurementUnitList() {
    if (measurementUnitList.length === 0) {
      await getunitList('').then(res => {
        measurementUnitList.push(...res.data);
      });
    }

    // 将`数量单位`默认值设置为`卷`
    const targetUnit = measurementUnitList.find(el => el.Code === 'ROLL');
    gridApi.grid.getFullData().forEach(el => {
      el.measurementUnitId = targetUnit?.Id;
    });
    if (targetUnit) {
      const fullData = gridApi.grid.getFullData();
      fullData.forEach(el => {
        el.measurementUnitId = targetUnit?.Id;
        el.measurementUnit = targetUnit?.Name;
      });
      gridApi.grid.setRow(fullData);
      state.initFields.measurementUnitId = targetUnit?.Id;
      state.initFields.measurementUnit = targetUnit?.Name;
    }

    const columns = getEditTableColumn();
    const targetIndex = columns.findIndex(el => el.field === 'measurementUnitId');
    if (targetIndex !== -1) {
      measurementUnitColumn.editRender.props.options = measurementUnitList.map(item => ({ label: item.Name, value: item.Id }));
      return { index: targetIndex, column: measurementUnitColumn as any };
    }
  }

  const applyShippingSpaceList: Array<any> = [];
  // const applyShippingSpaceColumn = {
  //   title: '申请仓位',
  //   field: 'applyShippingSpaceId',
  //   width: 200,
  //   i18nField: 'applyShippingSpaceName',
  //   editRender: {
  //     name: 'ASelect',
  //     cacheField: 'applyShippingSpaceName',
  //     props: {
  //       options: [] as Array<{ label: string; value: string }>,
  //       showSearch: true,
  //       allowClear: true,
  //       filterOption: (inputValue: string, option: any) => option.label.includes(inputValue),
  //     },
  //   },
  // };
  async function initApplyShippingSpaceList() {
    if (applyShippingSpaceList.length === 0) {
      await getSpaceList({}).then(res => {
        applyShippingSpaceList.push(
          ...(Array.isArray(res.data) ? res.data : []).map(item => {
            return {
              ...item,
              fullName: [item.shippingSpaceCode, item.shippingSpaceName].filter(Boolean).join('/'),
            };
          }),
        );
      });
    }

    // const columns = getEditTableColumn();
    // const targetIndex = columns.findIndex(el => el.field === 'applyShippingSpaceId');
    // if (targetIndex !== -1) {
    //   applyShippingSpaceColumn.editRender.props.options = applyShippingSpaceList.map(item => ({ label: item.shippingSpaceName, value: item.id }));
    //   return { index: targetIndex, column: applyShippingSpaceColumn as any };
    // }
  }

  // const factoryList: Array<any> = [];
  // const factoryColumn = {
  //   title: '工厂',
  //   field: 'factoryId',
  //   i18nField: 'factoryName',
  //   width: 240,
  //   editRender: {
  //     name: 'ASelect',
  //     cacheField: 'factoryName',
  //     props: {
  //       options: [] as Array<{ label: string; value: string }>,
  //       showSearch: true,
  //       allowClear: true,
  //       filterOption: (inputValue: string, option: any) => option.label.includes(inputValue),
  //       onChange: (_, data, params) => {
  //         gridApi.grid.setRow(params.row, { factoryName: data.label || '', factoryCode: data.Code || '' });
  //       },
  //     },
  //   },
  // };
  // async function initFactoryList() {
  //   if (factoryList.length === 0) {
  //     await getFactoryList().then(res => {
  //       factoryList.push(...res.data);
  //     });
  //   }

  //   // const columns = getEditTableColumn();
  //   // const targetIndex = columns.findIndex(el => el.field === 'factoryId');
  //   // if (targetIndex !== -1) {
  //   //   factoryColumn.editRender.props.options = factoryList.map(item => ({ ...item, label: item.Name, value: item.Id }));
  //   //   return { index: targetIndex, column: factoryColumn as any };
  //   // }
  // }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
