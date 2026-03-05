<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="false"
    :okText="t('common.submit')"
    :title="t('views.filings.demand')"
    @ok="() => handleSave(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button class="ml-12px" @click="handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop p-10px">
      <Subtitle :title="t('views.filings.demand')" class="mt-8px" :extra="{ show: true, hideAdd: true }">
        <template #afterTitle>
          <a-button type="primary" ghost @click="handleBatchDel">{{ t('common.batchDelText') }}</a-button>
        </template>
        <template v-if="state.canAddData" #extra>
          <AddCustomRows @submit="addColumn" style="display: inline-flex" />
        </template>
      </Subtitle>
      <Grid>
        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { reactive, nextTick, h } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, pick } from 'lodash-es';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { getEditTableColumn, editRules, handleInsidePartNumberChange, shipmentList, getDict, langList, getPersonByFactory } from './ApplyPopConfig';
  import { createApply, save, getDetailByIds, temporaryStorage } from '/@/api/customerSerivce/customsAffairsApply';
  import { getinnermaterialnumberlist } from '/@/api/customerSerivce/index';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { getHarhorsByNamesOrIds } from '/@/api/basicData/harhor';
  import { pastePartNumberFactorys } from '/@/utils/pasterPartNumberFactorys';
  import { SOURCE_TYPE_ENUM } from '../config';
  import { handleDblClickHead } from '/@/adapter/paster-event';

  import { TableAction, ActionItem } from '/@/components/Table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { AddCustomRows } from '/@/components/AddCustomRows';

  interface State {
    /** 原始数据列表 */
    list: Array<any>;
    /** 是否可以新增数据 */
    canAddData: boolean;
    /** 初始字段及默认值 */
    initFields: any;
  }

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  const state = reactive<State>({
    list: [],
    canAddData: true,
    initFields: {
      insidePartNumber: '',
      factory: '',
      sellCorporation: '',
      filingsLanguage: '',
      prot: '',
      protName: '',
      shipmentType: '',
      pdPersonId: '',
      immediateCustomerPartNumber: '',
      terminalCustomerPartNumber: '',
      immediateCustomerName: '',
      sourceType: SOURCE_TYPE_ENUM.自建,
      sourceTypeName: t('dict.CustomsAffairsSourceType.SelfCreate'),
    },
  });
  // 可编辑状态列表
  const { createMessage, createConfirm } = useMessage();

  const gridOptions: any = {
    id: 'customerService-filings-demand-editPop',
    columns: getEditTableColumn() as any,
    height: 'auto',
    keepSource: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules,
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
      // @ts-ignore
      afterPasteMethod: handleAfterPaster,
      beforePasteMethod: ({ targetAreas }) => {
        // 粘帖前的校验处理
        if (targetAreas.length === 0) {
          return false;
        }
        const { cols, rows } = targetAreas[0];

        for (const col of cols) {
          let disabled = col.editRender?.props?.disabled;
          if (typeof col.editRender?.props?.dynamicDisabled === 'function') {
            if (rows.some(row => col.editRender.props!.dynamicDisabled(row))) {
              disabled = true;
            }
          }

          if (
            // 不是可编辑单元格，禁止粘帖，判断`col.editRender.enabled === false`是因为在配置`editRender.name`的情况下，可以开启编辑，但是此时`col.editRender.enabled`可能为`undefined`
            !col.editRender ||
            col.editRender.enabled === false ||
            disabled === true
          ) {
            createMessage.warning(t('common.noPastingTip'));
            return false;
          }
        }

        return true;
      },
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'CAApplyColumn',
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
        handleAfterPasterInsidePartNumber([column], [row]);
        handleAfterPasterUser([column], [row], { id: 'pdPersonId', name: 'pdPersonName' });
      },
      'header-cell-dblclick': ({ column }) => {
        const excludeFields = ['seq', 'action', 'immediateCustomerPartNumber', 'terminalCustomerPartNumber', 'immediateCustomerName'];

        const tableData = gridApi.getDataSource();

        if (excludeFields.includes(column.field)) return;
        if (tableData.length <= 1) return;

        handleDblClickHead({ column, config: {} }, gridApi);

        const copyValue = tableData[0][column.field] || '';
        tableData.forEach((el: any, index: number) => {
          if (index === 0) {
            return false;
          }
          el[column.field] = copyValue;
        });
        handleAfterPaster({ targetAreas: [{ cols: [column], rows: tableData.slice(1) }], pasteCells: [copyValue] });
      },
    },
  });

  const [registerPopup, { closePopup, /** changeOkLoading, */ changeLoading }] = usePopupInner(init);

  async function init(data: { list?: Array<any>; canAddData?: boolean }) {
    state.canAddData = typeof data.canAddData === 'boolean' ? data.canAddData : true;

    if (shipmentList.length === 0) {
      changeLoading(true);
      await getDict().finally(() => {
        gridApi.reloadColumn(getEditTableColumn());
        if (!data.list || !data.list.length) {
          changeLoading(false);
        }
      });
    }

    state.list.length = 0;
    return nextTick(() => {
      if (data.list && data.list.length > 0) {
        getTableData(data.list);
        // state.list = data.list;
      }
    });
  }

  function getTableData(list: Array<any>) {
    changeLoading(true);
    getDetailByIds(list)
      .then(res => {
        gridApi.grid.reloadData(res.data);
        state.list = list;
      })
      .finally(() => {
        changeLoading(false);
      });
    // gridApi.grid.reloadData(list);
    // state.list = list;
  }

  function getTableActions(row: any, rowIndex: number): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        ifShow: state.canAddData,
        onClick: addColumn.bind(null, 1, rowIndex),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        ifShow: state.canAddData,
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];
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

  /**
   * 批量删除
   */
  function handleBatchDel() {
    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      return createMessage.warn(t('common.selectDataToDelete'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.sureToDeleteText'),
      onOk: () => {
        return gridApi.remove(rows);
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
    delete item.id;
    item._X_ROW_KEY = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }

  function getDataSource() {
    return cloneDeep(gridApi.grid.getFullData());
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    // const excludeFields: Array<string> = ['sku', 'semiFinishedProductsPartNumber'];
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .slice(1, -1)
      .forEach((el: any) => {
        if (!el.disabled) {
          fields.push(el.field);
        }
      });
    return fields.concat(['id']);
  }

  /**
   * 保存
   * @param isSubmit 是否提交
   */
  async function handleSave(isSubmit = false) {
    if (isSubmit && (await gridApi.grid.validate(true))) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    const rows = gridApi.getDataSource();
    // 如果是`提交`，则校验是否所有数据都存在 `直接客户料号(immediateCustomerPartNumber)`，如果不存在则提示用户有部分数据没有，是否继续提交
    if (isSubmit && !(await validateImmediateCustomerPartNumber(rows))) {
      return false;
    }

    const listField: any = getEnableCols();
    const list = rows.map(el => pick(el, listField));

    changeLoading(true);
    // 根据`isSubmit`区分是否调用提交接口，如果不是则调用暂存接口
    // 如果是提交操作，再根据`state.list.length > 0`，区分调用提交接口
    let api;
    if (isSubmit) {
      api = state.list.length > 0 ? createApply(list) : save(list);
    } else {
      api = temporaryStorage(list);
    }
    return api
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        isSubmit && closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  /**
   * 校验是否所有数据都存在 `直接客户料号(immediateCustomerPartNumber)`，如果不存在则提示用户: xxx料号没有维护直接客户料号，是否继续提交？
   * @param rows
   */
  async function validateImmediateCustomerPartNumber(rows: Array<any>) {
    return new Promise(resolve => {
      const missingDataList = rows.reduce<Array<string>>((pre, cur) => {
        cur.immediateCustomerPartNumber || pre.push(cur.insidePartNumber);
        return pre;
      }, []);
      if (missingDataList.length > 0) {
        createConfirm({
          iconType: 'warning',
          title: t('common.tipTitle'),
          content: h('div', {}, [...missingDataList.map(item => h('div', {}, item)), h('div', { class: 'mt-10px' }, t('dict.CAApply.missPartNumberConfirm'))]),
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      } else {
        resolve(true);
      }
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

    // 产品内部料号 赋值黏贴处理
    await handleAfterPasterInsidePartNumber(cols, rows);

    // 用户复制黏贴处理
    handleAfterPasterUser(cols, rows, { id: 'pdPersonId', name: 'pdPersonName' });

    // `下一节点(关务)`人 复制黏贴处理
    handleAfterPasterUser(cols, rows, { id: 'customsPersonId', name: 'customsPersonName' });

    // 语言复制粘帖处理
    handleAfterPasterByDict(cols, rows, { id: 'filingsLanguage', name: 'filingsLanguageName', value: 'enCode', label: 'fullName' }, langList);

    // 出货方式复制粘帖处理
    handleAfterPasterByDict(cols, rows, { id: 'shipmentType', name: 'shipmentTypeName', value: 'enCode', label: 'fullName' }, shipmentList);

    // // 工厂复制粘帖处理
    // handleAfterPasterByDict(cols, rows, { id: 'factory', name: 'factoryName', value: 'Code', label: 'Name' }, factoryList);
    pastePartNumberFactorys({
      cols,
      rows,
      pasteCells,
      fields: {
        partNumberField: 'insidePartNumber',
        factoryField: 'factory',
        factoryNameField: 'factoryName',
        factoryValueField: 'Code',
        factoryLabelField: 'Name',
      },
      afterPaste({ row, factoryDetail }) {
        Array.isArray(factoryDetail.Members) && Object.assign(row, getPersonByFactory(factoryDetail.Members));
      },
    });

    // 口岸复制黏贴处理
    handleAfterPasterPort(cols, rows);

    return true;
  }

  /**
   * 产品内部料号 复制黏贴处理
   * @param cols
   * @param rows
   */
  async function handleAfterPasterInsidePartNumber(cols: Array<{ field: string }>, rows: Array<{ insidePartNumber: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'insidePartNumber');
    if (targetIndex == -1) return false;

    const isUpdateByFactory = cols.every(col => col.field !== 'factory');

    // 处理请求参数
    const taskList = rows.map(async (row: any) => {
      if (row?.insidePartNumber) {
        return getinnermaterialnumberlist({ InnerMaterialNumber: row.insidePartNumber }).then(res => {
          const target = res?.data?.[0];
          target && handleInsidePartNumberChange(target, { row, $grid: gridApi.grid }, isUpdateByFactory);
        });
      } else {
        return handleInsidePartNumberChange({}, { row, $grid: gridApi.grid }, isUpdateByFactory);
      }
    });

    return Promise.all(taskList);
  }

  /**
   * 复制黏贴用户处理
   * @param cols 复制的列配置
   * @param rows 复制的行内容
   * @param pasteCellData 复制的内容
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

  /**
   * 口岸复制黏贴处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterPort(cols: Array<{ field: string }>, rows: Array<{ prot: string; protName?: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'prot');
    if (targetIndex == -1) return false;

    const { idList, nameList } = rows.reduce<{ idList: Array<string>; nameList: Array<string> }>(
      (obj, item: { [key: string]: string }) => {
        const value = item.prot || '';
        // 如果是纯数字组成，则是id，否则按照accountList计算
        if (value && /^\d+$/.test(value)) {
          obj.idList.push(value);
        } else if (value) {
          const account = value.split('/').pop() || '';
          account && obj.nameList.push(account);
        }
        return obj;
      },
      { idList: [], nameList: [] },
    );

    getHarhorsByNamesOrIds({ harhorNames: [...new Set(nameList)], harhorIds: [...new Set(idList)] })
      .then(res => {
        const list = Array.isArray(res?.data) ? res.data : [];
        rows.forEach(row => {
          const target = list.find((item: any) => item.Id === row.prot || item.Name === row.prot);
          row.prot = target?.Id || '';
          row.protName = target?.Name || '';
        });
      })
      .catch(() => {
        rows.forEach(row => {
          row.prot = '';
          row.protName = '';
        });
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
