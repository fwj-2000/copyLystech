<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submitText')"
    :title="pageInfo.title"
    @ok="handleSave"
    class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <Subtitle :title="t('common.semifinishedproductsInfo')" class="mt-8px" :extra="{ show: isAddNewItem, hideAdd: true }">
        <template #extra>
          <div class="mr-3 flex">
            <span>{{ t('dict.MainProcess') }}: </span>
            <LydcSelect class="mr-3" :value="mainProcess" :options="mainProcessList" @change="handleMainProce" style="width: 150px" />
            <AddCustomRows @submit="addColumn" style="display: inline-flex" />
          </div>
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
  import { reactive, nextTick, computed } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, pick } from 'lodash-es';
  import { getEditTableColumn, editRules, handleInsidePartNumberChange, handleVersionOrConfigChange } from './detailConfig';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { DETAIL_PAGE_TYPE_ENUM, productionTypeOptions } from '../config';
  import { create, modify, upgradeVersion, getDetailByIds } from '/@/api/engineering/semifinishedproducts';
  import { getSubclassCodeList } from '/@/api/purchase/materialBase';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import useState from './useState';
  interface State {
    type: string;
    initFields: any;
  }

  const { mainProcess, mainProcessList, handleMainProcessChange, setMainProcess, validateMainProcess } = useState();
  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  const state = reactive<State>({
    type: DETAIL_PAGE_TYPE_ENUM.新增,
    initFields: {
      insidePartNumber: '',
      semiFinishedProductsPartNumber: '',
      sku: '',
      version: '',
      config: '',
      materialTypeCode: '',
      materialTypeName: '',
      semiFinishedProductsDesc: '',
      productionType: '',
      remarks: '',
    },
  });
  // 可编辑状态列表
  const { createMessage, createConfirm } = useMessage();

  const gridOptions: VxeGridProps = {
    id: 'engineering-basicInformation-semifinishedproducts-edit',
    showIndexColumn: true,
    columns: getEditTableColumn(mainProcess) as any,
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
    data: [state.initFields],
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
      moduleCode: 'SemiFinishedProductsColumn',
    },
    pagerConfig: {
      enabled: false,
    },
    position: 'modal',
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      // @ts-ignore
      'cell-delete-value': ({ row, column }) => {
        handleAfterPasterMaterialTypeCode([column], [row]);
        handleAfterPasterInsidePartNumber([column], [row]);
        handleAfterPasteVersionAndConfig([column], [row]);
      },
    },
  });

  const [registerPopup, { closePopup, /** changeOkLoading, */ changeLoading }] = usePopupInner(init);

  async function init(data: { type: string; ids?: Array<string> }) {
    state.type = data.type;

    nextTick(() => {
      gridApi.reloadColumn(pageInfo.value.columns);
      if (state.type === DETAIL_PAGE_TYPE_ENUM.新增) {
        // 主要制程默认为`模切`
        setMainProcess(1);
        return false;
      }

      if (!Array.isArray(data.ids) || data.ids.length == 0) {
        closePopup();
        return false;
      }

      getTableData(data.ids);
    });
  }

  // 更换制程的变动
  function handleMainProce(e) {
    const list = gridApi.getDataSource();
    handleMainProcessChange(e, {
      onOk: () => {
        // 清空工厂
        list.forEach(item => {
          item.factoryList = '';
          item.factoryNames = '';
        });
        gridApi.grid.reloadData(list);
      },
      beforeMsg: () => {
        const hasFactory = list.some(item => item.factoryList);
        return hasFactory;
      },
    });
  }

  /**
   * 根据`state.type`确定展示的页面信息
   */
  const pageInfo = computed(() => {
    const columns = getEditTableColumn(mainProcess);
    if (state.type == DETAIL_PAGE_TYPE_ENUM.新增) {
      return {
        title: t('common.add2Text'),
        saveFn: handleSaveInAdd,
        columns,
      };
    } else if (state.type == DETAIL_PAGE_TYPE_ENUM.升版) {
      const excludeFields = ['insidePartNumber', 'action'];
      return {
        title: t('common.upgrade'),
        saveFn: handleSaveInUpgrade,
        // 升版时，不显示`产品内部料号（insidePartNumber）`
        columns: columns.filter(item => !excludeFields.includes(item.field)),
      };
    } else if (state.type == DETAIL_PAGE_TYPE_ENUM.修改) {
      // 修改时，只显示`序号(seq)`、`半成品料号(semiFinishedProductsPartNumber)`、`物料类型(materialTypeCode)`、`半成品描述(semiFinishedProductsDesc)`、`备注(remarks)`、`操作列(action)`
      const tableFieldList = ['semiFinishedProductsPartNumber', 'materialTypeCode', 'semiFinishedProductsDesc', 'oldPartNumber', 'remarks'];
      return {
        title: t('common.modify'),
        saveFn: handleSaveInModify,
        columns: columns.filter(item => tableFieldList.includes(item.field)),
      };
    }
    return { title: '', saveFn: () => Promise.resolve(), columns };
  });

  /** 是否为新增 */
  const isAddNewItem = computed(() => {
    return state.type == DETAIL_PAGE_TYPE_ENUM.新增;
  });

  function getTableData(ids: Array<string>) {
    changeLoading(true);
    getDetailByIds(ids)
      .then(res => {
        gridApi.grid.reloadData(res.data);
      })
      .finally(() => {
        changeLoading(false);
      });
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

    return isAddNewItem.value ? list : list.slice(2);
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

  function getDataSource() {
    return cloneDeep(gridApi.grid.getFullData());
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    const excludeFields: Array<string> = ['sku', 'semiFinishedProductsPartNumber'];
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .filter(el => el.field !== 'action')
      .forEach((el: any) => {
        if (!el.disabled && !excludeFields.includes(el.field)) {
          fields.push(el.field);
        }
      });
    return fields.concat(['id']);
  }
  async function handleSave() {
    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    changeLoading(true);
    return pageInfo.value
      .saveFn()
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  /**
   * `新增`的保存
   */
  async function handleSaveInAdd() {
    const formData = await validateMainProcess();
    if (!formData) throw new Error('请选择主要制程');
    const listField: any = getEnableCols();
    const list = gridApi.getDataSource().map(el => pick(el, listField));

    return create(formData.mainProcess, list);
  }

  /**
   * `升版`的保存
   */
  async function handleSaveInUpgrade() {
    const { getTableData, isUpdateByRow, setEditRow } = gridApi.grid;
    const tableData = getTableData().tableData;

    // 检测每一条数据的`版本`或者`Config`字段发生了改变
    const illegalRecord = tableData.find(item => {
      return !isUpdateByRow(item, 'version') && !isUpdateByRow(item, 'config');
    });
    if (illegalRecord) {
      createMessage.warning(t('dict.semifinishedproducts.upgradeCheckTip', [illegalRecord.semiFinishedProductsPartNumber]));
      setEditRow(illegalRecord);
      throw new Error(t('dict.semifinishedproducts.upgradeCheckTip', [illegalRecord.semiFinishedProductsPartNumber]));
    }

    const listField: any = getEnableCols();
    const list = tableData.map(el => pick(el, listField));

    return upgradeVersion(list);
  }

  /**
   * `修改`的保存
   */
  async function handleSaveInModify() {
    const listField: any = getEnableCols();
    const list = gridApi.getDataSource().map(el => pick(el, listField));

    return modify(list);
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

    // 产品内部料号 赋值黏贴处理
    handleAfterPasterInsidePartNumber(cols, rows);

    // 生产类型 复制黏贴处理
    handleAfterPasteProductionType(cols, rows, pasteCellData);

    // 版本、Config复制黏贴处理
    handleAfterPasteVersionAndConfig(cols, rows);

    // 物料类型 复制黏贴处理
    handleAfterPasterMaterialTypeCode(cols, rows);

    handleAfterPasteShippatern(cols, rows);
    handleAfterPasterFactory(cols, rows);

    return true;
  }

  /**
   * 产品内部料号 复制黏贴处理
   * @param cols
   * @param rows
   * @param pasteCells
   */
  function handleAfterPasterInsidePartNumber(cols: Array<{ field: string }>, rows: Array<{ insidePartNumber: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'insidePartNumber');
    if (targetIndex == -1) return false;

    rows.forEach(row => {
      handleInsidePartNumberChange({ row, $grid: gridApi.grid });
    });
  }

  /**
   * 生产类型 复制黏贴处理
   * @param cols
   * @param rows
   */
  function handleAfterPasteProductionType(cols: Array<{ field: string }>, rows: Array<{ applyShippingSpaceId: string }>, pasteCells: string[][]) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'productionType');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      const target = productionTypeOptions.find(unit => unit.enCode === targetValue || unit.fullName === targetValue);
      return Object.assign(item, {
        productionType: target?.enCode || '',
        productionTypeName: target?.fullName || '',
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /**
   * 出货类型 复制黏贴处理
   * @param cols
   * @param rows
   */
  function handleAfterPasteShippatern(cols: Array<{ field: string }>, rows: Array<{ shipPattern: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'shipPattern');
    if (targetIndex == -1) return false;

    const tableData = gridApi.getDataSource();
    // 判断当前表格是否存在相同物料类型，如果存在，则将其对应的值复制过来
    rows.forEach((row: any) => {
      const targetValue = row.shipPattern || '';
      if (!targetValue) {
        row.shipPatternName = '';
        return;
      }
      const target = tableData.find(item => item._X_ROW_KEY !== row._X_ROW_KEY && item.shipPatternName === targetValue);
      if (target) {
        row.shipPattern = target.shipPattern;
        row.shipPatternName = target.shipPatternName;
      } else {
        getSubclassCodeList({ keyword: targetValue }).then(res => {
          const target = Array.isArray(res.data) && res.data.length ? res.data[0] : {};
          row.shipPattern = target.Code;
          row.shipPatternName = target.Name;
        });
      }
    });
  }

  /**
   * 版本、Config复制黏贴处理
   * @param cols
   * @param rows
   */
  function handleAfterPasteVersionAndConfig(cols: Array<{ field: string }>, rows: Array<{ insidePartNumber: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'version' || item.field === 'config');
    if (targetIndex == -1) return false;

    rows.forEach(row => {
      handleVersionOrConfigChange({ row, $grid: gridApi.grid });
    });
  }

  /**
   * 物料类型 复制黏贴处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterMaterialTypeCode(cols: Array<{ field: string }>, rows: Array<{ insidePartNumber: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'materialTypeCode');
    if (targetIndex == -1) return false;

    const tableData = gridApi.getDataSource();

    // 判断当前表格是否存在相同物料类型，如果存在，则将其对应的值复制过来
    rows.forEach((row: any) => {
      const targetValue = row.materialTypeCode || '';
      if (!targetValue) {
        row.materialTypeName = '';
        return;
      }
      const target = tableData.find(item => item._X_ROW_KEY !== row._X_ROW_KEY && item.materialTypeName === targetValue);
      if (target) {
        row.materialTypeName = target.materialTypeName;
        row.materialTypeCode = target.materialTypeCode;
      } else {
        getSubclassCodeList({ keyword: targetValue }).then(res => {
          const target = Array.isArray(res.data) && res.data.length ? res.data[0] : {};
          row.materialTypeName = target.fullName;
          row.materialTypeCode = target.enCode;
        });
      }
    });
  }
  /**
   * 工厂 复制黏贴处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterFactory(cols: Array<{ field: string }>, rows: Array<{ factoryList: string }>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'factoryList');
    if (targetIndex == -1) return false;

    const tableData = gridApi.getDataSource();

    // 判断当前表格是否存在相同工厂，如果存在，则将其对应的值复制过来
    // TODO: factoryNames为临时处理，不规范
    const cacheField = 'factoryNames';
    rows.forEach((row: any) => {
      const targetValue = row.factoryList || [];
      if (!targetValue) {
        row.factoryNames = [];
        return;
      }
      const target = tableData.find(item => item._X_ROW_KEY !== row._X_ROW_KEY && item[cacheField] === targetValue);
      if (target) {
        row.factoryNames = target.factoryNames;
        row.factoryList = target.factoryList;
      }
      // else {
      //   getPartNumberFactoryList({ factorys: targetValue }).then(res => {
      //     const target = Array.isArray(res.data) && res.data.length ? res.data[0] : {};
      //     row.factoryNames = target.fullName;
      //     row.factoryList = target.enCode;
      //   });
      // }
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
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
