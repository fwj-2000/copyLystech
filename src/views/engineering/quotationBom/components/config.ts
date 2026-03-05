import { FormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';
import { getBaseDataWagerateList } from '/@/api/finance/wageRate';
import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
import { useBaseStore } from '/@/store/modules/base';
import { getLaborRateList, getProcessAllList } from '/@/api/engineering/quotatios';
import { nextTick } from 'vue';
import { isNullOrUnDef } from '/@/utils/is';
import { add, bignumber, divide, format, multiply } from 'mathjs';
import { useQuotaStore } from '/@/views/engineering/quotationBom/store/index';
import { cloneDeep } from 'lodash-es';
import { calculateLaborCost } from '/@/views/engineering/quotationBom/components/Process/buildProcessLaborCost';
import { calculateTheoreticalManufacturingCost } from '/@/views/engineering/quotationBom/components/Process/buildTheoreticalManufacturingCost';
import { calculateActualManufacturingCost } from '/@/views/engineering/quotationBom/components/Process/buildActualManufacturingCost';
import { useI18n } from '/@/hooks/web/useI18n';

const baseStore = useBaseStore();
const quotaStore = useQuotaStore();

const { t } = useI18n();

export function getBaseFormSchema(): FormSchema[] {
  return [
    {
      fieldName: 'qrApplyCode',
      label: '报价需求单号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'terminalCustomerProjectCode',
      label: '终端项目代码',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '请输入终端项目代码',
      },
    },
    {
      fieldName: 'insidePartNumber',
      label: '产品内部料号',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '请输入产品内部料号',
      },
    },
    {
      fieldName: 'insidePartNumberOld',
      label: '旧版成品编码',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '旧版成品编码',
      },
    },
    {
      fieldName: 'productDesc',
      label: '产品描述',
      component: 'Input',
      // wrapperClass: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3',
      formItemClass: 'col-span-16',
      componentProps: {
        placeholder: '请输入产品描述',
        disabled: true,
      },
    },
    {
      fieldName: 'factoryName',
      label: '工厂',
      // @ts-ignore
      i18nField: 'factory',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '请输入工厂',
      },
    },
    {
      fieldName: 'purposeName',
      label: '报价用途',
      // @ts-ignore
      i18nField: 'purpose',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '请输入报价用途',
      },
    },
    {
      fieldName: 'isBonded',
      label: '是否保税',
      component: 'Select',
      componentProps: {
        disabled: true,
        placeholder: '选择是否保税',
        options: [
          {
            label: t('dict.Bool.1'),
            value: 1,
          },
          {
            label: t('dict.Bool.2'),
            value: 0,
          },
        ],
        fieldNames: {
          label: 'label',
          value: 'value',
        },
      },
    },
    {
      fieldName: 'productSpec',
      label: '产品规格(长*宽*厚)MM',
      component: 'Input',
      formItemClass: 'col-span-16',
      componentProps: {
        placeholder: '示例: 10*10*0.1',
      },
    },
    {
      fieldName: 'moq',
      label: 'MOQ(KPCS)',
      component: 'Input',
      componentProps: {
        placeholder: '',
        defaultValue: '100',
      },
    },
    {
      fieldName: 'wageRateName',
      label: '工资率',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'costUnit',
      label: '成本单位',
      component: 'ApiSelect',
      defaultValue: 'PCS',
      componentProps: {
        disabled: true,
        api: getUnitListByKeyword,
        placeholder: '请选择成本单位',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Name', '(', 'Code', ')'],
      },
    },
    {
      fieldName: 'currency',
      label: '币别',
      defaultValue: 'RMB',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '项目总量(w)',
      fieldName: 'totalQty',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '备注',
      fieldName: 'remark',
      i18nField: 'CommonCol.remark',
      formItemClass: 'col-span-16',
      component: 'Textarea',
      componentProps: {
        rows: 1,
        autoSize: true,
      },
    },
  ];
}

export async function getLaborRateByProcessCode(processCode, periodOfDepreciation, row) {
  if (isNullOrUnDef(processCode) || isNullOrUnDef(periodOfDepreciation)) return;
  const { code, data } = await getLaborRateList({ workingProcedure: processCode });
  if (code == 200 && data.length > 0) {
    const laborRateList = data[0].laborRateDetailedOutputs;
    const laborRate = laborRateList.find(item => item.laborRateType === periodOfDepreciation);
    row.equipmentLaborRate = laborRate?.subtotals;
    row.fixedEquipmentRate = laborRate?.fixedCost;
    row.dynamicEquipmentRate = laborRate?.changeCost;
  } else {
    row.equipmentLaborRate = 0;
    row.fixedEquipmentRate = 0;
    row.dynamicEquipmentRate = 0;
  }
}

function getUtilizationRate(processCode, row) {
  if (isNullOrUnDef(processCode)) return;
  if (processCode.startsWith('4') || processCode.startsWith('5')) {
    row.utilizationRate = 1;
    row.utilizationRateName = '100%';
  } else {
    row.utilizationRate = 0.9;
    row.utilizationRateName = '90%';
  }
}

// 工艺流程列
export function getProcessColumns(props, sumCost): any {
  // 如果是编辑，那么新增的时候需要将某些ApiSelect设置默认
  return [
    {
      title: '生产类型',
      field: 'productionType',
      width: 120,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('Process.ProduceType', true),
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
          autofocus: true,
          immediate: true,
          placeholder: '请选择生产类型',
          onChange: (productionType, data, params) => {
            const { row } = params;
            if (data) {
              row.productionType = productionType;
              row.productionTypeName = data.fullName;
            } else {
              row.productionType = null;
              row.productionTypeName = '';
            }
          },
        },
      },
    },
    {
      title: '工序',
      field: 'processCode',
      minWidth: 180,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        dblClickHead: false,
        props: {
          api: getProcessAllList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          beforeFetch: params => {
            params.mainProcess = 1;
            return params;
          },
          fieldNames: {
            value: 'code',
          },
          filterOption: false,
          resultField: 'data',
          nameFormat: ['code', '(', 'name', ')'],
          immediate: true,
          placeholder: '请选择工序',
          onChange: async (processCode, option, params, pasterCell) => {
            const { row, $grid } = params;
            row.processCode = processCode;
            if (pasterCell) {
              row.processCodeName = pasterCell;
            }
            // 获取变动、固定制费
            getLaborRateByProcessCode(processCode, row.periodOfDepreciation, row);
            // 获取还原直通率
            getUtilizationRate(processCode, row);
            // 计算理论制造费用
            row.theoreticalManufacturingCost = calculateTheoreticalManufacturingCost({
              ...row,
            });
            // 计算实际制造费用
            calculateActualManufacturingCost(row, $grid);
            await nextTick();
            // 触发计算成本小计
            calculateSum($grid, sumCost);
          },
        },
      },
    },
    {
      title: '产能(K/H)',
      field: 'capacity',
      minWidth: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: '请输入产能(K/H)',
          onChange: async (capacity, { row, $grid }) => {
            // 计算人工成本
            row.laborCost = calculateLaborCost({ wage: props?.wageRate?.total, ...row, capacity });
            // 计算理论制造费用
            row.theoreticalManufacturingCost = calculateTheoreticalManufacturingCost({
              ...row,
            });
            // 计算实际制造费用
            calculateActualManufacturingCost(row, $grid);
            await nextTick();
            // 触发计算成本小计
            calculateSum($grid, sumCost);
          },
        },
      },
    },
    {
      title: '制程良率',
      field: 'yield',
      minWidth: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: '请输入制程良率',
          rate: true,
          onChange: async (yieldVal, params) => {
            const { $grid, row } = params;
            const { fullData: datalist, footerData } = $grid.getTableData();
            let cumulativeProduct = bignumber(1);

            for (let i = datalist.length - 1; i >= 0; i--) {
              const item = datalist[i];
              const yieldValue = bignumber(item.yield) || bignumber(1);

              // 累积计算直通率（包含当前工序）
              cumulativeProduct = multiply(cumulativeProduct, divide(yieldValue, bignumber(100)));

              // 计算结果并格式化
              datalist[i].fpy = multiply(cumulativeProduct, bignumber(100)).toNumber().toFixed(2);
            }
            const sumYield = updateYieldSum(datalist);
            footerData[0].yield = sumYield;
            // 计算实际制造费用
            calculateActualManufacturingCost(row, $grid);
            // 触发材料计算制程损耗（仅依赖第一道工序的还原直通率）
            quotaStore.setFirstProcessFpy(datalist?.[0]?.fpy);
            await nextTick();
            // 触发计算成本小计
            calculateSum($grid, sumCost);
          },
        },
      },
    },
    {
      title: '使用人数(个)',
      field: 'numberOfUsers',
      minWidth: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: '请输入使用人数',
          precision: 1,
          step: 0.1,
          onChange: async (numberOfUsers, { row, $grid }) => {
            // 计算人工成本
            row.laborCost = calculateLaborCost({ wage: props?.wageRate?.total, ...row, numberOfUsers });
            // 计算理论制造费用
            row.theoreticalManufacturingCost = calculateTheoreticalManufacturingCost({
              ...row,
            });
            // 计算实际制造费用
            calculateActualManufacturingCost(row, $grid);
            await nextTick();
            // 触发计算成本小计
            calculateSum($grid, sumCost);
          },
        },
      },
    },
    {
      title: '折旧年限',
      field: 'periodOfDepreciation',
      minWidth: 100,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          disabled: true,
          api: () => baseStore.getDictionaryData('LaborRateTypeEnum', true),
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
          immediate: true,
          placeholder: '请选择生产类型',
          onChange: (_, data, params) => {
            const { row } = params;
            if (data) {
              row.periodOfDepreciationName = data.fullName;
            } else {
              row.periodOfDepreciationName = '';
            }
          },
        },
      },
    },
    {
      title: '还原直通率',
      field: 'fpy',
      titleHelp: {
        content: '当前行还原直通率=当前行到数据最底部制程良率累乘',
      },
      minWidth: 120,
      formatter: ({ cellValue, column }) => {
        column.copyData = cellValue + '%';
        return cellValue + '%';
      },
      // editRender: {
      // 	name: 'InputNumber',
      // 	props: {
      // 		placeholder: '系统计算',
      // 		rate: true,
      // 	},
      // },
    },
    {
      title: '设备工费率/H',
      field: 'equipmentLaborRate',
      titleHelp: {
        content: '工费率率表带出',
      },
      minWidth: 130,
    },
    {
      title: '稼动率',
      field: 'utilizationRateName',
      titleHelp: {
        content: '人工操作或人工包装取100，否则则为90',
      },
      minWidth: 120,
    },
    {
      title: '人工成本',
      field: 'laborCost',
      titleHelp: {
        content: '工资率/产能*人数',
      },
      minWidth: 120,
    },
    {
      title: '理论制造费用',
      field: 'theoreticalManufacturingCost',
      titleHelp: {
        content: '((设备工费率/产能)+人工成本)/稼动率',
      },
      minWidth: 140,
    },
    {
      title: '实际制造费用',
      field: 'actualManufacturingCost',
      titleHelp: {
        content: '当前行实际制造费用=(当前实际制造费用到第一条实际制造费用累加+理论制造成本)*(1-制程良率)/制程良率 + 人工成本',
      },
      visible: true,
      minWidth: 140,
    },
    {
      title: '设备固定制费/H',
      field: 'fixedEquipmentRate',
      titleHelp: {
        content: '工序编码带出',
      },
      minWidth: 140,
    },
    {
      title: '设备变动制费/H',
      field: 'dynamicEquipmentRate',
      titleHelp: {
        content: '工序编码带出',
      },
      minWidth: 140,
    },
    {
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      title: '操作',
      fixed: 'right',
    },
  ];
}

function updateYieldSum(list = []) {
  // console.log(list);
  // const reduce = list.reduce((pre, next) => {
  //   pre = add(subtract(bignumber(100), bignumber(next.yield || 100)), pre);
  //   return pre;
  // }, bignumber(0));
  // return subtract(bignumber(100), reduce).toNumber().toFixed(2) + '%';
  return (list[0].fpy || 0) + '%';
}

export async function calculateSum(grid, sumCostShadow, list = []) {
  const data = grid.getFullData?.() || list;
  let mathSum = bignumber(0);
  data.forEach(item => {
    // sum = sum + item.cost
    // mathSum.add(bignumber(item.cost || 0))
    mathSum = add(mathSum, bignumber(item.actualManufacturingCost || 0));
  });
  const sum = mathSum;
  sumCostShadow.value = format(sum, { notation: 'fixed', precision: 6 });
}

/**
 * 如果复制内容`pasteCells`的数据的行数，小于黏贴行数`rows.length`，则复制`pasteCells`当前的内容平铺，将`pasteCells`行数扩展至和`rows.length`一致
 * @param pasteCells
 * @param rows
 */
export function expandPasteCells(pasteCells: Array<Array<string>>, rows: Array<any>) {
  const pasteCellsLength = pasteCells.length;
  const rowsLength = rows.length;
  // 实现内容平铺扩展逻辑
  if (pasteCellsLength < rowsLength) {
    const extendedPasteCells: Array<Array<string>> = [];
    // 循环填充粘贴内容直到与目标行数一致
    for (let i = 0; i < rowsLength; i++) {
      // 使用模运算确保内容循环平铺，当i超过pasteCells长度时，重新从0开始
      const originalRowIndex = i % pasteCellsLength;
      // 创建新数组并复制原始数据，避免引用问题
      extendedPasteCells.push([...pasteCells[originalRowIndex]]);
    }
    pasteCells.length = 0;
    pasteCells.push(...extendedPasteCells);
  }
}
