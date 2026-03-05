<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { cloneDeep, isError, without } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { getBaseRules, getCustomRules, getPccPackageColumn, getPccPackageCustomColumn } from '/@/views/engineering/PCCBeta/components/PccPackage/config';
  import { reactive, ref, toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { basePackageRowData, customPackageRowData } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { getMaterialAreaChildren, getMaterialQueryByMaterialCode } from '/@/api/engineering/pcc';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';

  const { createMessage } = useMessage();
  const { t } = useI18n();
  /**
   *  提示： 该文件内的使用字段，在其他模块中使用时，需要自行映射
   *  若是有字段变动，记得通知相关人员
   * */
  type PackageAction = 'view' | 'edit';
  type PackageSource = 'quanlity' | 'PCC'; // 来源：quanlity(量试工程)、PCC(pcc)
  type PackageShipPattern = 'R' | 'P'; // 出货形态：R(卷)、P(条)
  interface PackageConfig {
    mode: PackageAction;
    source: PackageSource;
    shipPattern: PackageShipPattern;
    deleteApi?: null | Function;
    dataSource?: any[];
  }

  interface PackageState {
    packageSpecQty: string;
    packingMaterialFixedList: any[];
    packingMaterialCustomList: any[];
    config: PackageConfig;
  }

  const state = reactive<{
    packageSpecQty: string;
    source: PackageSource;
    shipPattern: PackageShipPattern;
    deleteApi: null | Function;
    mode: PackageAction;
    disabled: boolean;
  }>({
    packageSpecQty: '', // 包规数量
    shipPattern: 'R',
    source: 'PCC',
    deleteApi: null,
    mode: 'edit',
    disabled: false,
  });

  const { shipPattern } = toRefs(state);
  const showAddBtn = ref(false); // 是否显示添加卷芯按钮

  const rowData = {
    type: '',
    packQty: '',
    unit: '',
    partNumber: '',
    description: '',
    useQtyMultiple: 1,
    useQty: '',
    packUnit: 'PCS',
  };

  const customGridOptions = {
    id: 'engineering-PCCBeta-PCCDetail-package-custom',
    columns: getPccPackageCustomColumn(),
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    maxHeight: '535px',
    minHeight: '180px',
    height: '',
    toolbarConfig: {
      refresh: false,
    },
    customConfig: {
      allowVisible: false,
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    pagerConfig: {
      enabled: false,
      pageSize: 1000,
    },
    keyboardConfig: {
      isClip: true, // 是否开启复制粘贴
      isEdit: true, // 是否开启任意键进入编辑（功能键除外）
      isDel: true, // 是否开启删除键功能
      isEsc: true, // 是否开启Esc键关闭编辑功能
    },
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'uuid',
    },
    // editRules: getProcessRules(),
    data: [cloneDeep(rowData)],
    clipConfig: {
      // isPaste: false,
      isPaste: true,
      // afterPasteMethod: handleAfterPaster,
      excludeFields: ['originPartNumber', 'packUnit'],
      beforePasteMethod: handleCustomBeforePaster,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
    position: 'modal',
    dblClickHeadConfig: {
      excludeFields: ['eightCode', 'width', 'originPartNumber', 'description', 'useQty', 'unit'],
    },
  };

  const basicGridOptions = {
    id: 'engineering-PCCBeta-PCCDetail-package-basic',
    columns: getPccPackageColumn(),
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    maxHeight: '535px',
    minHeight: '220px',
    toolbarConfig: {
      refresh: false,
    },
    customConfig: {
      allowVisible: false,
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    pagerConfig: {
      enabled: false,
      pageSize: 1000,
    },
    keyboardConfig: {
      isClip: true, // 是否开启复制粘贴
      isEdit: true, // 是否开启任意键进入编辑（功能键除外）
      isDel: true, // 是否开启删除键功能
      isEsc: true, // 是否开启Esc键关闭编辑功能
    },
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'uuid',
    },
    // editRules: getProcessRules(),
    height: '',
    data: [cloneDeep(rowData)],
    clipConfig: {
      // isPaste: false,
      isPaste: true,
      // afterPasteMethod: handleAfterPaster,
      beforePasteMethod: handleBaseBeforePaster,
      excludeFields: ['packUnit'],
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
    position: 'modal',
    dblClickHeadConfig: {
      excludeFields: ['type', 'partNumber', 'description', 'originPartNumber', 'useQty', 'packUnit'],
    },
  };

  const [
    BasicGrid,
    {
      reloadData: basicReloadData,
      loadData: basicLoadData,
      insertAt: basicInsertAt,
      remove: basicRemove,
      getDataSource: basicGetDataSource,
      setGridOptions: basicSetGridOptions,
      getColumns: basicGetColumns,
    },
  ] = useVbenVxeGrid({
    gridOptions: basicGridOptions,
    gridEvents: {
      editClosed: ({ row, column }) => {
        console.log('🚀 ~ row, column:', row, column);
      },
    },
  });
  const [
    CustomGrid,
    {
      reloadData: customReloadData,
      getDataSource: customGetDataSource,
      setGridOptions: customSetGridOptions,
      getColumns: customGetColumns,
      insertAt: customInsertAt,
    },
  ] = useVbenVxeGrid({
    gridOptions: customGridOptions,
    gridEvents: {
      editClosed: ({ row, column }) => {
        console.log('🚀 ~ row, column:', row, column);
      },
    },
  });

  function handleChangeTable(type, row) {
    const fullData = basicGetDataSource();
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    if (type === 'addBaseIndex') {
      // 新增
      const data = cloneDeep(fullData);
      data.splice(findIndex + 1, 0, { ...rowData, uuid: buildUUID() });
      basicLoadData(data);
    } else if (type === 'copy') {
      // 复制
      const data = cloneDeep(fullData);
      const copyData = cloneDeep(fullData[findIndex]);
      delete copyData.id;
      data.splice(findIndex + 1, 0, { ...copyData, uuid: buildUUID() });
      basicLoadData(data);
    } else if (type === 'delete') {
      // 删除
      const data = cloneDeep(fullData);
      data.splice(findIndex, 1);
      basicLoadData(data);
      // basicRemove(data);
    }
  }

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        // auth: 'btn_upload_pic',
        // tooltip: t('common.uploadDrawingText'),
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy',
        // auth: 'btn_detail',
        // tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: handleChangeTable.bind(null, 'copy', row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', row),
        },
        // tooltip: t('common.deleted'),
      },
    ];
  }

  function handleCustomChangeTable(type, row) {
    const fullData = customGetDataSource();
    if (!fullData || !fullData.length) return;

    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    if (findIndex === -1) return;

    const data = cloneDeep(fullData);
    const actions: Record<string, () => void> = {
      addBaseIndex: () => data.splice(findIndex + 1, 0, { ...rowData, uuid: buildUUID() }),
      copy: () => {
        const copyData = cloneDeep(fullData[findIndex]);
        delete copyData.id;
        data.splice(findIndex + 1, 0, { ...copyData, uuid: buildUUID() });
      },
      delete: () => {
        data.splice(findIndex, 1);
        if (data.length === 0) showAddBtn.value = true; // 删除后如果没有数据，显示添加按钮
      },
    };

    actions[type]?.();
    customReloadData(data);
  }

  function getCustomTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleCustomChangeTable.bind(null, 'addBaseIndex', row),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCustomChangeTable.bind(null, 'copy', row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          onOk: handleCustomChangeTable.bind(null, 'delete', row),
        },
      },
    ];
  }

  function findTarget(field, value, list = []) {
    return list.find(item => item[field] === value)?.fullName;
  }

  // 添加包材初始值
  async function initBaseTableList(clearTable) {
    const { data } = await getMaterialAreaChildren({
      enCode: 'PackagingMaterials',
    });
    const rollBasicData = [
      {
        ...basePackageRowData,
        type: 'PEBag',
        typeName: findTarget('enCode', 'PEBag', data),
        unit: 'PCS/袋',
        useQtyMultiple: 1,
        uuid: buildUUID(),
      },
      {
        ...basePackageRowData,
        type: 'PaperCarton',
        typeName: findTarget('enCode', 'PaperCarton', data),
        packQty: '',
        unit: 'PCS/箱',
        useQtyMultiple: 1,
        uuid: buildUUID(),
      },
      {
        ...basePackageRowData,
        type: 'Baffle',
        typeName: findTarget('enCode', 'Baffle', data),
        packQty: '',
        unit: 'PCS/个',
        useQtyMultiple: 2,
        uuid: buildUUID(),
      },
    ];
    const pcsBasicData = [
      {
        ...basePackageRowData,
        type: 'PEBag',
        typeName: findTarget('enCode', 'PEBag', data),
        unit: 'PCS/袋',
        useQtyMultiple: 1,
        uuid: buildUUID(),
      },
      {
        ...basePackageRowData,
        type: 'PaperCarton',
        typeName: findTarget('enCode', 'PaperCarton', data),
        packQty: '',
        unit: 'PCS/箱',
      },
    ];
    console.log('🚀 ~ initBaseTableList ~ data: ', data);
    if (shipPattern.value == 'R') {
      basicReloadData(clearTable ? [] : rollBasicData);
    } else {
      basicReloadData(clearTable ? [] : pcsBasicData);
    }

    // if (!state.disabled) {
    //   const baseColumn = getPccPackageColumn();
    //   if (baseColumn.findLastIndex(item => item.field === 'action') !== -1) return;
    //   baseColumn.push({
    //     field: 'action',
    //     title: t('common.action'),
    //     width: 100,
    //     slots: { default: 'action' },
    //     fixed: 'right',
    //   });
    //   basicSetGridOptions({
    //     columns: baseColumn,
    //   });
    // }
  }

  // 添加卷芯初始值
  function initCustomTableList(clearTable) {
    showAddBtn.value = false;
    customReloadData([{ ...customPackageRowData }]);
  }

  function initCommon(data) {
    const { source, shipPattern, mode, deleteApi } = data;
    state.source = source;
    state.shipPattern = shipPattern;
    state.deleteApi = deleteApi;
    state.mode = mode || 'edit'; // 默认为编辑模式
  }

  function setTableData({
    packingMaterialCustomList = [],
    packingMaterialFixedList = [],
    packageSpecQty = '',
    config = {
      mode: 'view',
      shipPattern: 'P',
      source: 'PCC',
      deleteApi: null,
    },
  }: PackageState) {
    console.log(packingMaterialCustomList, 'packingMaterialCustomList');
    console.log(packingMaterialFixedList, 'packingMaterialFixedList');
    console.log(packageSpecQty, 'packageSpecQty');
    console.log(config, 'config');

    initCommon(config);
    state.packageSpecQty = packageSpecQty || ''; // 切换bom时，需要初始化包材规格数量

    const normalizeWithUuid = (list: any[]) => list.map(item => ({ ...item, uuid: item.id || buildUUID() }));

    const hasCustom = !isEmpty(packingMaterialCustomList);
    customReloadData(hasCustom ? normalizeWithUuid(packingMaterialCustomList) : []);
    showAddBtn.value = !hasCustom && config.shipPattern == 'R';

    if (isEmpty(packingMaterialFixedList)) {
      basicReloadData([]);
    } else {
      basicReloadData(
        normalizeWithUuid(packingMaterialFixedList).map(item => ({
          ...item,
          disabled: { unit: true, useQty: true },
        })),
      );
    }
  }

  function init(data: PackageConfig, clearTable = false) {
    console.log('🚀 ~ init ~ data------------: ', data);
    const { dataSource, source, shipPattern } = data;
    initCommon(data);
    // 当前表格为空值，且来源为非量试，则初始化数据
    if (!dataSource || isEmpty(dataSource)) {
      if (source == 'quanlity') {
        showAddBtn.value = shipPattern == 'R'; // 当出货形态为R时，显示添加卷芯按钮
      } else {
        initBaseTableList(clearTable);
        initCustomTableList(clearTable);
      }
    }
  }

  // 获取表格数据
  function getDataSource() {
    if (state.shipPattern == 'R') {
      // custom base
      const data = {
        packingMaterialFixedList: basicGetDataSource(),
        packingMaterialCustomList: customGetDataSource(),
        packSpecQtyR: state.packageSpecQty,
      };
      return data;
    }
    // base
    const data = {
      packingMaterialFixedList: basicGetDataSource(),
      packingMaterialCustomList: [],
      packSpecQtyPN: state.packageSpecQty,
    };
    return data;
  }

  async function handleCustomBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getCustomRules();
      const { cols, rows } = targetAreas[0];

      const materialFnList = {};
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        without(row, '').forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          console.log('🚀 ~  ~ field: ', field);
          const rule = editRules[field];
          const { validator } = rule[0];
          if (field === 'originPartNumber') {
            // setLoading(true);
            materialFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
            return null;
          }
          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return false;
          if (isError(result)) {
            createMessage.warning(result?.message);
          }
          // 校验数据通过
        });
      });
      // 重新执行粘贴的料号逻辑
      console.log('🚀 ~ handleCustomBeforePaster ~ materialFnList: ', materialFnList);
      if (!isEmpty(materialFnList)) {
        getMaterialQueryByMaterialCode(Object.keys(materialFnList)).then(({ data }) => {
          data.forEach(item => {
            // 执行校验函数
            materialFnList[item['materialCode']]?.(item);
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  async function handleBaseBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getBaseRules();
      console.log('🚀 ~ handleBaseBeforePaster ~ editRules: ', editRules);
      const { cols, rows } = targetAreas[0];

      const typeFnList = {};
      const unitFnList = {};
      const materialFnList = {};
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        without(row, '').forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          console.log('🚀 ~  ~ field: ', field);
          const rule = editRules[field];
          console.log('🚀 ~  ~ rule: ', rule);
          const { validator } = rule[0];
          if (field === 'originPartNumber') {
            materialFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
            return null;
          }
          if (field === 'partNumber') {
            materialFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
            return null;
          }
          if (field === 'type') {
            typeFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
            return null;
          }
          if (field === 'packUnit') {
            unitFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
            return null;
          }
          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return false;
          if (isError(result)) {
            createMessage.warning(result?.message);
          }
          // 校验数据通过
        });
      });
      // 重新执行粘贴的料号逻辑
      if (!isEmpty(typeFnList)) {
        const { data } = await getMaterialAreaChildren({ enCode: 'PackagingMaterials' });
        data.forEach(item => {
          // 执行校验函数
          typeFnList[item['fullName']]?.(item);
        });
      }
      if (!isEmpty(unitFnList)) {
        const { data } = await getUnitListByKeyword({});
        data.forEach(item => {
          // 执行校验函数
          unitFnList[item['Name']]?.(item);
        });
      }
      // 重新执行粘贴的料号逻辑
      console.log('🚀 ~ handleBaseBeforePaster ~ materialFnList: ', materialFnList);
      if (!isEmpty(materialFnList)) {
        getMaterialQueryByMaterialCode(Object.keys(materialFnList)).then(({ data }) => {
          data.forEach(item => {
            // 执行校验函数
            materialFnList[item['materialCode']]?.(item);
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  function handleAddRows(rowCount) {
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      basicInsertAt(rows, -1);
    });
  }

  function handleCustomAddRows(rowCount) {
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      customInsertAt(rows, -1);
    });
  }

  // 添加校验规则--卷芯
  function validateCustomPackage() {
    const customData = customGetDataSource();
    return new Promise((resolve, reject) => {
      for (let i = 0; i < customData.length; i++) {
        if (!customData[i].type) {
          reject(new Error(t('dict.PCCColumn.selectPackagingMaterialRowType', [i + 1])));
          return;
        }
        if (!customData[i].packQty) {
          reject(new Error(t('dict.PCCColumn.selectPackagingQty', [i + 1])));
          return;
        }
        if (!customData[i].unit) {
          reject(new Error(t('dict.PCCColumn.selectPackagingUnit', [i + 1])));
          return;
        }
        if (!customData[i].description) {
          reject(new Error(t('dict.PCCColumn.selectPackageDesc', [i + 1])));
          return;
        }
        if (!customData[i].preparationMaterials) {
          reject(new Error(t('dict.PCCColumn.selectPackageUsageMult', [i + 1])));
          return;
        }
        if (!customData[i].packUnit) {
          reject(new Error(t('dict.PCCColumn.selectPackageUnit', [i + 1])));
          return;
        }
      }
      resolve(true);
    });
  }

  // 添加校验规则--基础
  function validateBasePackage() {
    const baseData = basicGetDataSource();
    return new Promise((resolve, reject) => {
      for (let i = 0; i < baseData.length; i++) {
        if (!baseData[i].type) {
          reject(new Error(t('dict.PCCColumn.selectPackagingMaterialRowType', [i + 1])));
          return;
        }
        // if (baseData[i].type == 'CoreRoll') {
        //   reject(new Error(t('validate.package.2', [i + 1])));
        //   return;
        // }
        if (!baseData[i].packQty) {
          reject(new Error(t('dict.PCCColumn.selectPackagingQty', [i + 1])));
          return;
        }
        if (!baseData[i].unit) {
          reject(new Error(t('dict.PCCColumn.selectPackagingUnit', [i + 1])));
          return;
        }
        if (!baseData[i].description) {
          reject(new Error(t('dict.PCCColumn.selectPackageDesc', [i + 1])));
          return;
        }
        if (!baseData[i].useQtyMultiple) {
          reject(new Error(t('dict.PCCColumn.selectPackageUsageMult', [i + 1])));
          return;
        }
        if (!baseData[i].packUnit) {
          reject(new Error(t('dict.PCCColumn.selectPackageUnit', [i + 1])));
          return;
        }
      }
      resolve(true);
    });
  }

  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    if (disabled) {
      // 设置基本
      const basicColumn = getPccPackageColumn();
      basicColumn.pop();
      basicSetGridOptions({
        columns: basicColumn,
        editConfig: {
          enabled: false,
        },
        keyboardConfig: {
          isEdit: false,
          isPaste: false,
        },
      });
      // 设置Custom
      const customColumn = getPccPackageCustomColumn();
      customSetGridOptions({
        columns: customColumn,
        editConfig: {
          enabled: false,
        },
        keyboardConfig: {
          isEdit: false,
          isPaste: false,
        },
      });
    }
  }

  defineExpose({
    setTableData,
    init,
    getDataSource,
    setDisabled,
    validateBasePackage,
    validateCustomPackage,
  });
</script>
<template>
  <a-card id="packaging">
    <CustomGrid class="mb-8px" v-show="shipPattern == 'R'">
      <template #toolbar-actions>
        <Subtitle :title="t('common.packageMetaria')">
          <template #afterTitle>
            <div v-show="state.mode === 'edit' && shipPattern === 'R'">
              <div class="flex">
                <lydc-input-number placeholder="" v-model:value="state.packageSpecQty" />
                <div class="ml-8px font-normal">{{ state.shipPattern == 'R' ? t('dict.PCCColumn.PCSVolume') : t('dict.PCCColumn.PCSStrip') }}</div>
              </div>
            </div>
            <div v-show="!(state.mode === 'edit' && shipPattern === 'R')">
              <div class="flex">
                {{ state.packageSpecQty }}
                <div class="ml-8px font-normal">{{ state.shipPattern == 'R' ? t('dict.PCCColumn.PCSVolume') : t('dict.PCCColumn.PCSStrip') }}</div>
              </div>
            </div>
          </template>
        </Subtitle>
      </template>
      <template #toolbar-tools>
        <AddCustomRows v-if="state.mode.includes('edit')" :defaultValue="1" @submit="handleCustomAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getCustomTableActions(row)" />
      </template>
    </CustomGrid>
    <BasicGrid class="min-h-220px max-h-535px h-full">
      <template #toolbar-actions>
        <template v-if="state.shipPattern !== 'R'">
          <Subtitle :title="t('common.packageMetaria')">
            <template #afterTitle>
              <div class="flex" v-show="state.mode.includes('edit')">
                <lydc-input-number placeholder="" v-model:value="state.packageSpecQty" />
                <div class="ml-8px font-normal">{{ state.shipPattern == 'R' ? t('dict.PCCColumn.PCSVolume') : t('dict.PCCColumn.PCSStrip') }}</div>
              </div>
              <div class="flex" v-show="!state.mode.includes('edit')">
                <!--                <lydc-input-number placeholder="" v-model:value="" />-->
                <div>{{ state.packageSpecQty }}</div>
                <div class="ml-8px font-normal">{{ state.shipPattern == 'R' ? t('dict.PCCColumn.PCSVolume') : t('dict.PCCColumn.PCSStrip') }}</div>
              </div>
            </template>
          </Subtitle>
        </template>
      </template>
      <template #toolbar-tools>
        <AddCustomRows v-if="state.mode.includes('edit')" :defaultValue="1" @submit="handleAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </BasicGrid>
  </a-card>
</template>

<style scoped lang="less">
  :deep(.lydc-subtitle-container) {
    padding-bottom: 0;
  }

  :deep(.vxe-grid--table-container) {
    padding-left: 12px;
    padding-right: 12px;
  }
</style>
