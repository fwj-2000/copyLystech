<script setup lang="ts">
  import { reactive } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getProcessColumns, calculateSum } from '/@/views/engineering/quotationBom/components/config';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { cloneDeep, get, reject } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { TableAction } from '/@/components/Table';
  import { useBaseStore } from '/@/store/modules/base';
  import { isEmpty, isFunction, isNullOrUnDef } from '/@/utils/is';
  import { getLaborRateList, getProcessAllList } from '/@/api/engineering/quotatios';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { isError } from 'lodash-es';
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { expandPasteCells } from '../config';

  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  const props = defineProps({
    wageRate: {
      type: Object,
      default: {},
    },
  });

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();

  const rowData = {
    productionType: 1,
    productionTypeName: '',
    processCode: null,
    capacity: null,
    yield: null,
    numberOfUsers: 1,
    periodOfDepreciation: 1,
    periodOfDepreciationName: '',
    fpy: '',
    equipmentLaborRate: '',
    utilizationRate: '',
    laborCost: '',
    theoreticalManufacturingCost: '',
    // actualManufacturingCost: '',
    fixedEquipmentRate: '',
    dynamicEquipmentRate: '',
  };

  const pasterDependencies = {
    productTypeList: [],
    laborRateTypeList: [],
    processCodeList: [],
  };

  const sum = reactive({
    seq: '合计',
    yield: '100%',
  });

  const sumCost = ref(0);

  const gridOptions = {
    id: 'engineering-quotationBom-makeQuotation-edit-process',
    showIndexColumn: true,
    columns: handleColumn(getProcessColumns(props, sumCost)),
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    scrollY: {
      enabled: true,
      gt: 0,
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
    minHeight: 300,
    data: [],
    footerData: [sum],
    clipConfig: {
      isPaste: true,
      // afterPasteMethod: handleAfterPaster,
      beforePasteMethod: handleBeforePaster,
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  function handleColumn(columns) {
    const hasPermission = hasBtnP('price-process');
    if (hasPermission) {
      return columns;
    }
    const filterArray = [
      'equipmentLaborRate',
      'laborCost',
      'theoreticalManufacturingCost',
      'actualManufacturingCost',
      'fixedEquipmentRate',
      'dynamicEquipmentRate',
    ];
    // 没有权限只展示部分列
    return reject(columns, item => filterArray.includes(item.field));
  }

  function handleChangeTable(type, row) {
    const fullData = gridApi.getDataSource();
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);

    if (type === 'addBaseIndex') {
      // 新增
      const data = cloneDeep(fullData);
      data.splice(findIndex + 1, 0, { ...rowData, uuid: buildUUID() });
      gridApi.reloadData(data);
    } else if (type === 'copy') {
      // 复制
      const data = cloneDeep(fullData);
      const copyData = cloneDeep(fullData[findIndex]);
      delete copyData.id;
      data.splice(findIndex + 1, 0, { ...copyData, uuid: buildUUID() });
      gridApi.reloadData(data);
    } else if (type === 'delete') {
      // 删除
      const data = cloneDeep(fullData);
      data.splice(findIndex, 1);
      gridApi.reloadData(data);
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
        auth: 'btn_detail',
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

  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    // function handleBeforePaster(...rest) {
    const editRules = getProcessRules();
    const { cols, rows } = targetAreas[0];
    expandPasteCells(pasteCells, rows);
    // 校验数据
    pasteCells.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const col = cols[colIndex];
        const originRow = rows[rowIndex];

        const { field } = col;
        const rule = editRules[field];
        const { validator } = rule[0];
        const result = validator({ col, cell, row: originRow, $grid });

        if (isError(result)) {
          createMessage.warning(result?.message);
        }
        // 校验数据通过
        setTimeout(() => {}, 3000);
      });
    });
    return false;
  }

  async function getPasterValidateData(pasterDependencies) {
    const { productTypeList, laborRateTypeList, processCodeList } = pasterDependencies;
    if (isEmpty(productTypeList)) {
      pasterDependencies.productTypeList = await baseStore.getDictionaryData('Process.ProduceType', true);
    }
    if (isEmpty(laborRateTypeList)) {
      pasterDependencies.laborRateTypeList = await baseStore.getDictionaryData('LaborRateTypeEnum', true);
    }
    if (isEmpty(processCodeList)) {
      const { code, data } = await getProcessAllList({ mainProcess: 1 });
      if (code == 200) {
        pasterDependencies.processCodeList = data;
      }
    }
  }

  function genFormatVal(target, nameFormat: any[], fieldNames = {}) {
    let label = '';
    if (nameFormat && nameFormat.length > 0) {
      nameFormat.forEach((item, index) => {
        if (index % 2 === 0) {
          label += get(target, [item]) || '';
        } else {
          label += item;
        }
      });
    } else {
      label = get(target, fieldNames.label || 'name');
    }

    return label;
  }

  function getProcessRules(): any {
    return {
      productionType: [
        {
          validator: ({ col, cell, row, $grid }) => {
            const { productTypeList } = pasterDependencies;
            if (isNullOrUnDef(cell)) {
              return new Error('请选择产品类型');
            }
            const {
              editRender: {
                props: { fieldNames, onChange },
              },
            } = col;
            const target = productTypeList.find(o => genFormatVal(o, [], fieldNames) === cell);
            if (!target) {
              return new Error('请选择正确的产品类型');
            }
            if (isFunction(onChange)) {
              onChange(target[fieldNames['value']], target, { row, $grid });
            }
            return false;
          },
        },
      ],
      processCode: [
        {
          validator: ({ col, cell, row, $grid }) => {
            const { processCodeList } = pasterDependencies;
            if (isNullOrUnDef(cell)) {
              return new Error('请选择工序');
            }
            const {
              editRender: {
                props: { fieldNames, onChange, nameFormat },
              },
            } = col;
            const target = processCodeList.find(o => genFormatVal(o, nameFormat, fieldNames) === cell);
            if (!target) {
              return new Error('请选择正确的工序');
            }
            if (isFunction(onChange)) {
              onChange(target[fieldNames['value']], target, { row, $grid }, cell);
            }
            return false;
          },
        },
      ],
      capacity: [
        {
          validator: ({ col, cell, row, $grid }) => {
            if (isNullOrUnDef(cell)) {
              return new Error('请选择产能');
            }
            if (cell <= 0) {
              return new Error('请选择正确的产能');
            }
            const {
              editRender: {
                props: { fieldNames, onChange, nameFormat },
              },
            } = col;
            row.capacity = cell;
            if (isFunction(onChange)) {
              onChange(cell, { row, $grid });
            }
            return true;
          },
        },
      ],
      yield: [
        {
          validator: ({ col, cell, row, $grid }) => {
            if (isNullOrUnDef(cell)) {
              return new Error('请选择制程良率');
            }
            if (cell > 100 || cell < 0) {
              return new Error('请选择正确的制程良率');
            }
            const {
              editRender: {
                props: { onChange },
              },
            } = col;
            row.yield = cell;
            if (isFunction(onChange)) {
              onChange(cell, { row, $grid });
            }
            return true;
          },
        },
      ],
      numberOfUsers: [
        {
          validator: ({ col, cell, row, $grid }) => {
            if (isNullOrUnDef(cell)) {
              return new Error('请选择使用人数');
            }
            if (cell <= 0) {
              return new Error('请选择正确的使用人数');
            }
            const {
              editRender: {
                props: { onChange },
              },
            } = col;
            row.numberOfUsers = cell;
            if (isFunction(onChange)) {
              onChange(cell, { row, $grid });
            }
            // row.numberOfUsers = cell;
            return true;
          },
        },
      ],
      periodOfDepreciation: [
        {
          validator: ({ col, cell, row }) => {
            const { laborRateTypeList } = pasterDependencies;
            if (isNullOrUnDef(cell)) {
              return new Error('请选择折旧年限');
            }
            const {
              editRender: {
                props: { fieldNames, onChange, nameFormat },
              },
            } = col;
            const target = laborRateTypeList.find(o => genFormatVal(o, nameFormat, fieldNames) === cell);
            if (!target) {
              return new Error('请选择正确的折旧年限');
            }
            if (isFunction(onChange)) {
              onChange(target[fieldNames['value']], target, { row }, cell);
            }
            return false;
          },
        },
      ],
    };
  }

  async function handleAddRows(rowCount) {
    const rows = [];
    const rowData = await initRow();
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      gridApi.insertAt(rows, -1);
    });
  }

  // onMounted(async () => {

  // });
  async function initData() {
    const { reloadData } = gridApi;
    await getPasterValidateData(pasterDependencies);
    const { productTypeList, laborRateTypeList } = pasterDependencies;
    rowData.productionTypeName = productTypeList[0].fullName;
    rowData.productionType = productTypeList[0].enCode;
    rowData.periodOfDepreciationName = laborRateTypeList[0].fullName;
    rowData.periodOfDepreciation = laborRateTypeList[0].enCode;
    // const { data: IoILaborRateOutputsList } = await getLaborRateByProcessCode('101', laborRateTypeList[0].enCode, { })
    // const { laborRateDetailedOutputs: laborRateList } = IoILaborRateOutputsList[0]
    // const laborRate = laborRateList.find(item => item.laborRateType === laborRateTypeList[0].enCode);
    // console.log("🚀 ~ initData ~ laborRate: ", laborRate);

    // const { data: firstLaborRateOutputsList } = await getLaborRateList({ workingProcedure: '101' });
    const p1 = getLaborRateList({ workingProcedure: '101' });
    const p2 = getLaborRateList({ workingProcedure: '401' });
    const p3 = getLaborRateList({ workingProcedure: '501' });

    Promise.all([p1, p2, p3]).then(([r1, r2, r3]) => {
      const { data: firstLaborRateOutputsList } = r1;
      const firstLaborRateList = firstLaborRateOutputsList[0].laborRateDetailedOutputs;
      const firstLaborRate = firstLaborRateList.find(item => item.laborRateType === laborRateTypeList[0].enCode);

      let r2HasNotData,
        r3HasNotData = false;

      let secondLaborRateList, secondLaborRate, thirdLaborRateList, thirdLaborRate;

      secondLaborRateList = r2[0]?.laborRateDetailedOutputs;
      if (!secondLaborRateList || isEmpty(secondLaborRateList)) {
        r2HasNotData = true;
      } else {
        secondLaborRate = secondLaborRateList.find(item => item.laborRateType === laborRateTypeList[0].enCode);
      }

      // if(isEmpty(r2)){
      // 	r2HasNotData = true;
      // }else {
      //
      // }

      thirdLaborRateList = r3[0]?.laborRateDetailedOutputs;
      if (!thirdLaborRateList || isEmpty(thirdLaborRateList)) {
        r3HasNotData = true;
      } else {
        // thirdLaborRateList = r3[0].laborRateDetailedOutputs;
        thirdLaborRate = thirdLaborRateList.find(item => item.laborRateType === laborRateTypeList[0].enCode);
      }

      reloadData([
        {
          ...cloneDeep(rowData),
          equipmentLaborRate: firstLaborRate?.laborRate,
          fixedEquipmentRate: firstLaborRate?.fixedCost,
          dynamicEquipmentRate: firstLaborRate?.changeCost,
          processCode: '101',
          processCodeName: `101(${t('common.materialPreparation')})`,
        },
        {
          ...cloneDeep(rowData),
        },
        {
          ...cloneDeep(rowData),
          equipmentLaborRate: r2HasNotData ? 0 : secondLaborRate?.laborRate,
          fixedEquipmentRate: r2HasNotData ? 0 : secondLaborRate?.fixedCost,
          dynamicEquipmentRate: r2HasNotData ? 0 : secondLaborRate?.changeCost,
          processCode: '401',
          processCodeName: `401(${t('common.ordinaryEnvironmentCleaning')})`,
        },
        {
          ...cloneDeep(rowData),
          equipmentLaborRate: r3HasNotData ? 0 : thirdLaborRate?.laborRate,
          fixedEquipmentRate: r3HasNotData ? 0 : thirdLaborRate?.fixedCost,
          dynamicEquipmentRate: r3HasNotData ? 0 : thirdLaborRate?.changeCost,
          processCode: '501',
          processCodeName: `501(${t('common.manualPackaging')})`,
        },
      ]);
    });
  }

  async function initRow() {
    await getPasterValidateData(pasterDependencies);
    const { productTypeList, laborRateTypeList } = pasterDependencies;
    rowData.productionTypeName = productTypeList[0].fullName;
    rowData.productionType = productTypeList[0].enCode;
    rowData.periodOfDepreciationName = laborRateTypeList[0].fullName;
    rowData.periodOfDepreciation = laborRateTypeList[0].enCode;
    return rowData;
  }

  const state = reactive({
    disabled: false,
  });
  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    if (disabled) {
      const columns = handleColumn(getProcessColumns(props, sumCost));
      columns.pop();
      gridApi.setGridOptions({
        columns,
      });
    }
  }

  function reloadData(dataList: Array<any>) {
    gridApi.reloadData(dataList).then(() => {
      // 如果不存在还原直通率，手动计算当前还原直通率
      const row = gridApi.getDataSource()?.[0];
      row &&
        gridApi
          .getColumns()
          .find(col => col.field === 'yield')
          ?.editRender?.props?.onChange(null, { row, $grid: gridApi.grid });
    });
  }

  defineExpose({
    processGridApi: gridApi,
    getDataSource: gridApi.getDataSource,
    reloadData,
    initData,
    calculateSum: calculateSum.bind(null, gridApi, sumCost),
    setDisabled,
  });
</script>
<template>
  <a-card>
    <Grid>
      <template #toolbar-actions>
        <Subtitle title="工艺流程" class="mt-8px" id="process" :extra="{ show: true, hideAdd: true }">
          <template #afterTitle>
            <a-space v-if="hasBtnP('price-process')">
              <a-divider id="process" type="vertical" class="ml-10px"></a-divider>
              <div
                >成本小计/KPCS:<span style="color: #ff7b00" class="ml-10px">{{ sumCost }}</span></div
              >
            </a-space>
          </template>
        </Subtitle>
      </template>

      <template #toolbar-tools>
        <AddCustomRows v-if="!state.disabled" @submit="handleAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </a-card>
</template>
