<template>
  <div class="material">
    <a-space>
      <Subtitle :title="t('common.packageMetaria')" id="packaging" />
      <div class="flex">
        <lydc-input-number placeholder="" v-model:value="state.packageSpecQty" />
        {{ state.shipPattern == 'R' ? t('dict.PCCColumn.PCSVolume') : t('dict.PCCColumn.PCSStrip') }}
      </div>
    </a-space>
    <a-space>
      <a-button v-show="showAddBtn" type="primary" ghost @click="initCustomTableList">{{ t('common.addRole') }}</a-button>
      <AddCustomRows v-if="state.mode == 'edit'" :defaultValue="2" @submit="handleBaseChange('add', { rows: $event })" />
    </a-space>
  </div>
  <div v-show="shipPattern == 'R'">
    <BasicTable @register="registerCustomEditTable">
      <!-- <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction :actions="customGetPackageActions(index, record)" />
        </template>
      </template> -->
    </BasicTable>
  </div>
  <BasicTable @register="registerBaseEditTable">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'action'">
        <TableAction :actions="baseGetPackageActions(index, record)" />
      </template>
    </template>
  </BasicTable>
</template>
<script setup lang="ts">
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { ActionItem, BasicColumn, TableAction, useTable } from '/@/components/Table';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { basePackageRowData, calcUseQty, customPackageRowData } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { buildUUID } from '/@/utils/uuid';
  import { reactive, ref, toRaw, toRefs } from 'vue';
  import { isEmpty } from '/@/utils/is';
  import { getMaterialAreaChildren, getMaterialSearchByShortCode, getPCCPackingTypeList } from '/@/api/engineering/pcc';
  import { getMaterialCodeList, getUnitListByKeyword } from '/@/api/finance/materialPrice';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
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
  }>({
    packageSpecQty: '', // 包规数量
    shipPattern: 'R',
    source: 'PCC',
    deleteApi: null,
    mode: 'edit',
  });
  const { shipPattern } = toRefs(state);
  const showAddBtn = ref(false); // 是否显示添加卷芯按钮

  const { createMessage } = useMessage();

  const [
    registerCustomEditTable,
    {
      setTableData: customSetTableData,
      setProps: customSetTableProps,
      getDataSource: customGetDataSource,
      updateTableDataRecord: customUpdateTableDataRecord,
      insertTableDataRecord: customInsertTableDataRecord,
      deleteTableDataRecord: customDeleteTableDataRecord,
    },
  ] = useTable({
    columns: customGetPackageColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    isCanResizeParent: true,
    canResize: false,
    rowKey: 'uuid',
    // actionColumn: {
    //   width: 120,
    //   title: "操作",
    //   dataIndex: "action"
    // }
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
  });

  const [
    registerBaseEditTable,
    {
      setTableData: baseSetTableData,
      setProps: baseSetTableProps,
      getDataSource: baseGetDataSource,
      updateTableDataRecord: baseUpdateTableDataRecord,
      insertTableDataRecord: baseInsertTableDataRecord,
      deleteTableDataRecord: baseDeleteTableDataRecord,
    },
  ] = useTable({
    columns: baseGetPackageColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    isCanResizeParent: true,
    canResize: false,
    rowKey: 'uuid',
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });

  // 添加包材初始值
  function initBaseTableList() {
    if (shipPattern.value == 'R') {
      baseSetTableData([
        {
          ...basePackageRowData,
          type: 'PEBag',
          unit: 'PCS/袋',
          useQtyMultiple: 1,
          uuid: buildUUID(),
        },
        {
          ...basePackageRowData,
          type: 'PaperCarton',
          packQty: '',
          unit: 'PCS/箱',
          useQtyMultiple: 1,
          uuid: buildUUID(),
        },
        {
          ...basePackageRowData,
          type: 'Baffle',
          packQty: '',
          unit: 'PCS/个',
          useQtyMultiple: 2,
          uuid: buildUUID(),
        },
      ]);
    } else {
      baseSetTableData([
        {
          ...basePackageRowData,
          type: 'PEBag',
          unit: 'PCS/袋',
          useQtyMultiple: 1,
          uuid: buildUUID(),
        },
        {
          ...basePackageRowData,
          type: 'PaperCarton',
          packQty: '',
          unit: 'PCS/箱',
        },
      ]);
    }
  }
  // 添加卷芯初始值
  function initCustomTableList() {
    showAddBtn.value = false;
    customSetTableData([{ ...customPackageRowData }]);
  }

  // 处理校验样式
  function handleClassName() {
    return state.source === 'quanlity' ? '' : 'table-required';
  }
  // 卷芯表头配置
  function customGetPackageColumns(): BasicColumn[] {
    return [
      {
        title: '类型',
        dataIndex: 'type',
        editRow: true,
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: getMaterialAreaChildren,
          params: {
            enCode: 'PackagingMaterials',
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          onChange: (e, data, record) => {
            const { editValueRefs } = record;
            getPCCPackingTypeList({
              shipPattern: state.shipPattern,
              typeCode: e,
            }).then(({ code, data }) => {
              if (code == 200) {
                console.log(data);
                if (!data[0]) return createMessage.warning('该类型中无单位和倍数数据');
                const { useQtyMultiple, unit } = data[0];
                editValueRefs.unit = unit;
                editValueRefs.useQtyMultiple = useQtyMultiple;
              }
            });
          },
          filterOption: false,
          notFoundContent: null,
        },
        width: 100,
      },
      {
        title: '包装数量',
        dataIndex: 'packQty',
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          onChange: (packQty, data, record) => {
            const { editValueRefs, useQtyMultiple } = record;
            editValueRefs.useQty = calcUseQty(packQty, useQtyMultiple);
          },
        },
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        editRow: true,
        editDynamicDisabled: true,
        editComponentProps: {
          placeholder: t('common.autoCarry'),
          disabled: true,
        },
        width: 100,
      },
      {
        title: '材料八码',
        dataIndex: 'eightCode',
        editRow: true,
        editComponent: 'Input',
        editComponentProps: {
          onChange: (eightCode, data, record) => {
            const { editValueRefs } = record;
            editValueRefs.originPartNumber = '';
            editValueRefs.partNumber = '';
          },
        },
        width: 100,
      },
      {
        title: '宽度(MM)',
        dataIndex: 'width',
        editRow: true,
        width: 100,
        editComponent: 'InputNumber',
        editComponentProps: {
          min: 0,
          onChange: (width, data, record) => {
            const { editValueRefs } = record;
            editValueRefs.originPartNumber = '';
            editValueRefs.partNumber = '';
          },
        },
      },
      {
        title: '查询结果',
        dataIndex: 'originPartNumber',
        editRow: true,
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: getMaterialSearchByShortCode,
          originParams: {
            shortMaterialCode: 'record.eightCode',
            materialWidth: 'record.width',
            toleranceNegative: 1,
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          onChange: (materialCode, data, record) => {
            if (!data) return;
            const [startCode, eightCode, calcWidth] = materialCode.split('-');
            const index = customGetDataSource().findIndex(item => item.uuid === record.uuid);
            const { materialDesc, materialName, purchaseUnit, materialColor, width } = data;
            const { editValueRefs } = record;
            editValueRefs.description = materialDesc || materialName || null;
            editValueRefs.packUnit = purchaseUnit;
            if (!record.width) {
              createMessage.warning('请输入宽度');
            }
            editValueRefs.eightCode = eightCode;
            // 料号带出的宽度 - 输入的宽度 需要在-1~3范围内 直接用
            // 输入 500 查询100-xxx-504 504 - 500 > 3 转600
            // 输入 498 查询100-xxx-500 500 - 498 < 3 保留
            const retNum = Number(calcWidth) - editValueRefs.width;
            if (retNum > 3) {
              editValueRefs.partNumber = `600-${eightCode}-${editValueRefs.width?.toString()?.padStart(4, 0)}`;
            } else {
              editValueRefs.partNumber = materialCode;
            }
          },
          resultField: 'data',
          labelField: 'materialCode',
          valueField: 'materialCode',
          immediate: true,
        },
      },
      {
        title: '材料料号',
        dataIndex: 'partNumber',
        editComponent: 'Input',
        editRow: true,
        width: 220,
      },
      {
        title: '描述',
        dataIndex: 'description',
        editRow: true,
        editComponentProps: {
          placeholder: t('common.autoCarry'),
        },
        width: 200,
      },
      {
        title: '用量倍数',
        dataIndex: 'useQtyMultiple',
        editComponent: 'InputNumber',
        editComponentProps: {
          onChange: (useQtyMultiple, data, record) => {
            const { editValueRefs, packQty } = record;
            editValueRefs.useQty = calcUseQty(packQty, useQtyMultiple);
          },
        },
        editRow: true,
        width: 100,
      },
      {
        title: '用量/KPCS',
        dataIndex: 'useQty',
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: t('common.systemCalculation'),
        },
        editRow: true,
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'packUnit',
        editRow: true,
        editComponentProps: {
          api: getUnitListByKeyword,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
        },
        editComponent: 'ApiSelect',
        width: 200,
      },
    ];
  }
  // 基础表头配置
  function baseGetPackageColumns(): BasicColumn[] {
    const _className = handleClassName();
    return [
      {
        title: '类型',
        dataIndex: 'type',
        editRow: true,
        editComponent: 'ApiSelect',
        className: _className,
        editComponentProps: {
          api: getMaterialAreaChildren,
          params: {
            enCode: 'PackagingMaterials',
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          onChange: (e, data, record) => {
            const { editValueRefs } = record;
            getPCCPackingTypeList({
              shipPattern: state.shipPattern,
              typeCode: e,
            }).then(({ code, data }) => {
              if (code == 200) {
                if (!data[0]) return createMessage.warning('请先配置包装类型');
                const { useQtyMultiple, unit } = data[0];
                editValueRefs.unit = unit;
                editValueRefs.useQtyMultiple = useQtyMultiple;
              }
            });
          },
          filterOption: false,
          notFoundContent: null,
        },
        width: 100,
      },
      {
        title: '包装数量',
        dataIndex: 'packQty',
        className: _className,
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          onChange: (packQty, data, record) => {
            const { editValueRefs, useQtyMultiple } = record;
            editValueRefs.useQty = calcUseQty(packQty, useQtyMultiple);
          },
        },
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        editRow: true,
        editDynamicDisabled: true,
        className: _className,
        editComponentProps: {
          placeholder: t('common.autoCarry'),
          disabled: true,
        },
        width: 100,
      },
      {
        title: '包材料号',
        dataIndex: 'partNumber',
        editComponent: 'ApiSelect',
        className: _className,
        editComponentProps: {
          api: getMaterialCodeList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'materialCode',
          valueField: 'materialCode',
          immediate: true,
          onChange: (_, data, record) => {
            if (!data) return;
            const { materialDesc, materialType, purchaseUnit } = data;
            const { editValueRefs } = record;
            editValueRefs.description = materialDesc;
            // editValueRefs.type = materialType;
            // editValueRefs.unit = purchaseUnit;
          },
        },
        editRow: true,
        width: 180,
      },
      {
        title: '描述',
        dataIndex: 'description',
        className: _className,
        editRow: true,
        editComponentProps: {
          placeholder: t('common.autoCarry'),
        },
        width: 200,
      },
      {
        title: '用量倍数',
        dataIndex: 'useQtyMultiple',
        editComponent: 'InputNumber',
        className: _className,
        editComponentProps: {
          onChange: (useQtyMultiple, data, record) => {
            const { editValueRefs, packQty } = record;
            editValueRefs.useQty = calcUseQty(packQty, useQtyMultiple);
          },
        },
        editRow: true,
        width: 100,
      },
      {
        title: '用量/KPCS',
        dataIndex: 'useQty',
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: t('common.systemCalculation'),
        },
        editRow: true,
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'packUnit',
        className: _className,
        editRow: true,
        editComponentProps: {
          api: getUnitListByKeyword,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          // preciseParam: 'materialWidth',
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
        },
        editComponent: 'ApiSelect',
        width: 200,
      },
    ];
  }
  // 卷芯操作栏配置
  function baseGetPackageActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleBaseChange.bind(null, 'addBaseIndex', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleBaseChange.bind(null, 'copy', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleBaseChange.bind(null, 'delete', record),
        },
      },
    ];
  }
  // 基础操作栏配置
  function customGetPackageActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleCustomChange.bind(null, 'addBaseIndex', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCustomChange.bind(null, 'copy', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleCustomChange.bind(null, 'delete', record),
        },
      },
    ];
  }
  // 基础表增删改查
  async function handleBaseChange(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    switch (type) {
      case 'add':
        // 当前基础表没有数据时，设置默认值
        if (!baseGetDataSource().length) {
          return initBaseTableList();
        }
        const dataList: any = [];
        for (let i = 0; i < data.rows; i++) {
          dataList.push({
            ...basePackageRowData,
            uuid: buildUUID(),
          });
        }
        baseInsertTableDataRecord(dataList);
        break;
      case 'addBaseIndex':
        baseInsertTableDataRecord(
          {
            ...basePackageRowData,
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      case 'copy':
        const copyData = cloneDeep(baseGetDataSource()[data.index]);
        baseInsertTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      case 'delete':
        const { uuid, id } = data;
        if (id && state.source == 'quanlity' && state.deleteApi) {
          await state.deleteApi(data.id);
        }
        baseDeleteTableDataRecord(uuid);
        break;
      case 'update':
        // updateMaterialTableDataRecord(data);
        break;
    }
  }
  // 卷芯增删改查
  async function handleCustomChange(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    switch (type) {
      case 'add':
        const dataList: any = [];
        for (let i = 0; i < data.rows; i++) {
          dataList.push({
            ...customPackageRowData,
            uuid: buildUUID(),
          });
        }
        customInsertTableDataRecord(dataList);
        break;
      case 'addBaseIndex':
        customInsertTableDataRecord(
          {
            ...customPackageRowData,
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      case 'copy':
        const copyData = cloneDeep(baseGetDataSource()[data.index]);
        customInsertTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      case 'delete':
        if (data.id && state.source == 'quanlity' && state.deleteApi) {
          await state.deleteApi(data.id);
        }
        customDeleteTableDataRecord(data.uuid);
        break;
      case 'update':
        // updateMaterialTableDataRecord(data);
        break;
    }
  }

  // 获取表格数据
  function getDataSource() {
    if (state.shipPattern == 'R') {
      // custom base
      const data = {
        packingMaterialFixedList: baseGetDataSource(),
        packingMaterialCustomList: customGetDataSource(),
        packSpecQtyR: state.packageSpecQty,
      };
      return data;
    }
    // base
    const data = {
      packingMaterialFixedList: baseGetDataSource(),
      packingMaterialCustomList: [],
      packSpecQtyPN: state.packageSpecQty,
    };
    return data;
  }

  function initCommon(data) {
    const { source, shipPattern, mode, deleteApi } = data;
    state.source = source;
    state.shipPattern = shipPattern;
    state.deleteApi = deleteApi;
    state.mode = mode || 'edit'; // 默认为编辑模式
  }

  // 初始化数据
  function init(data: PackageConfig) {
    const { dataSource, source, shipPattern } = data;
    initCommon(data);
    // 当前表格为空值，且来源为非量试，则初始化数据
    if (!dataSource || isEmpty(dataSource)) {
      if (source == 'quanlity') {
        showAddBtn.value = shipPattern == 'R'; // 当出货形态为R时，显示添加卷芯按钮
      } else {
        initBaseTableList();
        initCustomTableList();
      }
    }
  }

  // 设置表格数据
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
    initCommon(config);
    const isEdit = config.mode == 'edit';
    const editMode = {
      onEdit: isEdit,
      editable: isEdit,
    };
    baseSetTableProps({
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action',
        ifShow: isEdit,
      },
    });
    if (packageSpecQty) {
      state.packageSpecQty = packageSpecQty;
    }
    // 通用包材处理
    if (!isEmpty(packingMaterialCustomList)) {
      customSetTableData(
        packingMaterialCustomList.map(item => ({
          ...item,
          ...editMode,
          uuid: item.id || buildUUID(),
          disabled: {
            type: true,
            unit: true,
            partNumber: true,
            useQty: true,
          },
        })),
      );
    } else {
      if (config.source == 'quanlity') {
        showAddBtn.value = config.shipPattern == 'R'; // 当出货形态为R时，显示添加卷芯按钮
        customSetTableData([]);
      }
    }
    if (!isEmpty(packingMaterialFixedList)) {
      baseSetTableData(
        packingMaterialFixedList.map(item => ({
          ...item,
          ...editMode,
          uuid: item.id || buildUUID(),
          disabled: {
            unit: true,
            useQty: true,
          },
        })),
      );
    } else {
      if (config.source == 'quanlity') {
        baseSetTableData([]);
      }
    }
  }

  defineExpose({
    init,
    getDataSource,
    setTableData,
  });
</script>

<style lang="less" scoped>
  .material {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    :deep(.lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
      margin-bottom: 0;
    }

    :deep(.subtitle-container .title) {
      width: max-content;
    }

    :deep(.basic-content-wrap div) {
      width: max-content;
    }

    :deep(.ant-input-number-input) {
      min-width: 70px;
      width: 100px;
    }
  }
</style>
