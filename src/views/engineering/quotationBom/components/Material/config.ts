import { useI18n } from '/@/hooks/web/useI18n';
import { getMaterialSearchByShortCode } from '/@/api/engineering/pcc';
import { getMaterialPriceList } from '/@/api/engineering/quotatios';
import { isComputableArray, isEmpty, isString, isNullOrUnDef } from '/@/utils/is';
import { useMessage } from '/@/hooks/web/useMessage';
import { bignumber, chain, format, subtract, add, floor, multiply, divide, dotDivide, isNaN as mathIsNaN } from 'mathjs';
import { nextTick, type Ref } from 'vue';
import type { VxeGridPropTypes, VxeTableDefines } from 'vxe-table';
import autoSelectInsidePartNumber from './autoSelectInsidePartNumber';

const { t } = useI18n();
const { createMessage } = useMessage();

type PrefixConfig = {
  content: string;
};

type MaterialColumn = Omit<VxeTableDefines.ColumnOptions<any>, 'children'> & {
  prefixConfig?: PrefixConfig;
  children?: MaterialColumn[];
};

// 材料列
// { currentData, formValues }
export function getMaterialColumns(props: any, sumCost: Ref<number>): VxeGridPropTypes.Columns {
  // 如果是编辑，那么新增的时候需要将某些ApiSelect设置默认
  const columns: MaterialColumn[] = [
    {
      title: t('common.metaria'), // 材料
      field: 'material',
      align: 'center',
      children: [
        {
          title: t('dict.PCCColumn.eightCode'), // 八码
          field: 'eightCode',
          width: 120,
          editRender: {
            name: 'Input',
            props: {
              placeholder: t('dict.PCCColumn.eightCode'),
              dynamicDisabled: (row: any) => {
                if (row.materialTypeFromManufacturer) {
                  return true;
                }
                return false;
              },
              onChange: async (_: any, { row, $grid }: any) => {
                // // 如果是粘贴，那么不需要清空料号，需要执行请求，再执行料号查询时间
                autoSelectInsidePartNumber(
                  {
                    row,
                    props,
                    $grid,
                    sumCost,
                    handleSearchValChange,
                  },
                  'originInsideCode',
                );
              },
            },
          },
        },
        {
          title: t('dict.QuantitativePlanColumn.width'), // 单个宽度
          field: 'singleWidth',
          width: 120,
          editRender: {
            name: 'InputNumber',
            props: {
              placeholder: t('dict.QuantitativePlanColumn.width'),
              onChange: async (singleWidth: number, { row, $grid }: any) => {
                // 重新计算价格
                const { wholePrice, wholeWidth, wholeLength, singleStepDistance, singleModulus, singleProcessLosses, wholeUnit, materialDosage } = row;

                autoSelectInsidePartNumber(
                  {
                    row,
                    props,
                    $grid,
                    sumCost,
                    handleSearchValChange,
                  },
                  'originInsideCode',
                );

                row.cost = calculateCostCenterPrice(
                  wholePrice,
                  wholeWidth,
                  singleWidth,
                  wholeLength,
                  singleStepDistance,
                  singleModulus,
                  singleProcessLosses,
                  wholeUnit,
                  materialDosage,
                );
                // 计算用量(【宽度】、步距、模数)
                const useQty = calculateUseQty(singleWidth, singleStepDistance, singleModulus, materialDosage);
                row.singleUseQty = useQty;
                // 计算材料利用率
                const utilizationRate = calculateUseWidthRate({ singleWidth, wholeWidth });
                row.utilizationRate = utilizationRate;
                // 计算材料成本小计
                await nextTick();
                calculateSum($grid, sumCost);
                // if (!isNullOrUnDef(row.originInsideCode)) {
                // row.insideCode = buildInsideCode(row.originInsideCode, singleWidth);
                // }
              },
            },
          },
        },
        {
          // title: t('dict.PCCColumn.originPartNumber'), // 查询结果
          title: t('dict.QuotationColumn.materialNumber'), // 查询结果
          field: 'originInsideCode',
          width: 220,
          formatter: 'ApiSelect',
          editRender: {
            name: 'ApiSelect',
            props: {
              api: async (params: any) => {
                const { materialWidth, shortMaterialCode } = params;
                // 材料八码没有8位不请求数据
                // if (shortMaterialCode.length !== 8) return null;
                if (!(materialWidth && shortMaterialCode)) return null;
                return getMaterialSearchByShortCode(params);
              },
              showSearch: true,
              apiSearch: {
                show: true,
                searchName: 'keyword',
              },
              resultField: 'data',
              singleDefaultFirst: true,
              allowClear: true,
              labelField: 'materialCode',
              valueField: 'materialCode',
              params: {
                toleranceNegative: 0,
              },
              rowParams: {
                shortMaterialCode: 'eightCode',
                materialWidth: 'singleWidth',
              },
              filterOption: false,
              notFoundContent: null,
              immediate: true,
              placeholder: '请选择查询结果',
              dynamicDisabled: (row: any) => {
                if (row.materialTypeFromManufacturer) {
                  return true;
                }
                return false;
              },
              beforeFetch: async params => {
                params.terminalCustomerCode = props?.currentData?.terminalCustomerCode || '';
                params.productLineCode = props?.currentData?.productLineCode || '';
                // params.factory = props?.formValues?.factory || '';
                const values = await props?.formValues;
                params.factory = values?.factoryName.split('/')[0];
                return params;
              },
              afterFetch: (res: any) => {
                if (!res) {
                  return res;
                }
                const list = Array.isArray(res?.data) ? res?.data : [];
                res.data = list.map((item: any) => {
                  return {
                    ...item,
                    desc: getOriginPartNumberDesc(item),
                  };
                });
              },
              nameFormat: ['materialCode', '', 'desc'],
              onChange: handleSearchValChange.bind(null, props),
            },
          },
        },
        {
          title: t('dict.QuantitativePlanColumn.materialDesc'), // 描述
          field: 'materialDescription',
          width: 200,
          editRender: {
            name: 'Input',
            props: {
              placeholder: t('dict.QuantitativePlanColumn.materialDesc'),
            },
          },
        },
        // 新材料厂商型号
        {
          title: t('dict.PriceInquiryColumn.materialTypeFromManufacturer'), // 新材料厂商型号
          field: 'materialTypeFromManufacturer',
          width: 200,
          editRender: {
            name: 'Input',
            props: {
              dynamicDisabled: (row: any) => {
                if (row.insideCode || row.eightCode) {
                  return true;
                }
                return false;
              },
              placeholder: t('dict.PriceInquiryColumn.materialTypeFromManufacturer'),
            },
          },
        },
      ],
    },
    {
      title: t('dict.QuotationColumn.singleStepDistance'), // 单个规格
      align: 'center',
      field: 'single',
      children: [
        {
          title: `${t('common.step')}(MM)`, // 步距
          width: 140,
          field: 'singleStepDistance',
          editRender: {
            name: 'InputNumber',
            props: {
              placeholder: t('dict.QuantitativePlanColumn.width'),
              onChange: async (singleStepDistance: number, { row, $grid }: any) => {
                // 重新计算价格
                const { wholePrice, wholeWidth, singleWidth, wholeLength, singleModulus, singleProcessLosses, wholeUnit, materialDosage } = row;
                row.cost = calculateCostCenterPrice(
                  wholePrice,
                  wholeWidth,
                  singleWidth,
                  wholeLength,
                  singleStepDistance,
                  singleModulus,
                  singleProcessLosses,
                  wholeUnit,
                  materialDosage,
                );
                // 计算用量(宽度、【步距】、模数)
                const useQty = calculateUseQty(singleWidth, singleStepDistance, singleModulus, materialDosage);
                row.singleUseQty = useQty;
                // 计算成本小计
                await nextTick();
                calculateSum($grid, sumCost);
              },
            },
          },
        },
        {
          title: t('dict.QuotationColumn.singleModulus'), // 模数
          width: 100,
          field: 'singleModulus',
          editRender: {
            name: 'InputNumber',
            props: {
              placeholder: t('dict.QuotationColumn.singleModulus'),
              onChange: async (singleModulus: number, { row, $grid }: any) => {
                // 重新计算价格
                const { wholePrice, wholeWidth, singleWidth, wholeLength, singleStepDistance, singleProcessLosses, wholeUnit, materialDosage } = row;
                row.cost = calculateCostCenterPrice(
                  wholePrice,
                  wholeWidth,
                  singleWidth,
                  wholeLength,
                  singleStepDistance,
                  singleModulus,
                  singleProcessLosses,
                  wholeUnit,
                  materialDosage,
                );
                // 计算用量(宽度、步距、【模数】)
                const useQty = calculateUseQty(singleWidth, singleStepDistance, singleModulus, materialDosage);
                row.singleUseQty = useQty;
                // console.log(row)
                // 计算成本小计
                await nextTick();
                calculateSum($grid, sumCost);
              },
            },
          },
        },
        {
          title: t('dict.PCCColumn.useQtyMultiple'), // 用量倍数
          field: 'materialDosage',
          width: 120,
          editRender: {
            name: 'InputNumber',
            props: {
              onChange: async (materialDosage: number, { row, $grid }: any) => {
                // 重新计算价格
                const { wholePrice, wholeWidth, singleWidth, wholeLength, singleStepDistance, singleProcessLosses, wholeUnit, singleModulus } = row;
                row.cost = calculateCostCenterPrice(
                  wholePrice,
                  wholeWidth,
                  singleWidth,
                  wholeLength,
                  singleStepDistance,
                  singleModulus,
                  singleProcessLosses,
                  wholeUnit,
                  materialDosage,
                );
                // 计算用量(宽度、步距、【模数】)
                const useQty = calculateUseQty(singleWidth, singleStepDistance, singleModulus, materialDosage);
                row.singleUseQty = useQty;
                // console.log(row)
                // 计算成本小计
                await nextTick();
                calculateSum($grid, sumCost);
              },
            },
          },
        },
        {
          title: t('dict.QuotationColumn.singleUseQty'), // 用量
          width: 100,
          field: 'singleUseQty',
          titlePrefix: {
            content: t('dict.QuotationColumn.singleUseQtyTip'),
          },
        },
        {
          title: t('dict.QuotationColumn.singleProcessLosses'), // 制程损耗
          width: 140,
          titlePrefix: {
            content: t('dict.QuotationColumn.singleProcessLossesTip'),
          },
          field: 'singleProcessLosses',
          // editRender: {
          //   name: 'InputNumber',
          //   props: {
          //     placeholder: t('dict.QuotationColumn.singleProcessLosses'),
          //   },
          // },
        },
      ],
    },
    {
      title: t('common.unitPriceOfMaterials'), //材料单价
      align: 'center',
      field: 'unitPriceOfMaterials',
      children: [
        {
          title: t('dict.MaterialDevelopImport.purchaseUserName'), // 开发采购
          width: 200,
          field: 'purchaserId',
          editRender: {
            name: 'CustomUserSelect',
            props: {
              dynamicDisabled: (row: any) => {
                return row.hasPrice;
              },
              placeholder: t('dict.MaterialDevelopImport.purchaseUserName'),
            },
          },
        },
        {
          title: t('dict.QuotationColumn.hasPrice'), // 有无价格
          width: 120,
          field: 'hasPriceName',
        },
        {
          title: t('common.materialCost'), // 成本中心价 单个规格
          width: 120,
          field: 'cost',
          titlePrefix: {
            content: `${t('dict.QuotationColumn.costCenterPrice1')}\n${t('dict.QuotationColumn.costCenterPrice2')}`,
          },
          formatter: ({ cellValue, row }: any) => {
            // 存在价格，则展示价格；不存在价格统一置为空
            return row.hasPrice ? cellValue : '';
          },
        },
      ],
    },
    {
      title: t('dict.QuotationColumn.wholeWidth'), //整支料规格
      align: 'center',
      field: 'wholeWidthParent',
      children: [
        {
          title: t('dict.QuotationColumn.wholeWidth1'), // 宽幅
          width: 100,
          field: 'wholeWidth',
          titlePrefix: {
            content: t('dict.QuotationColumn.wholeWidthTip'),
          },
          prefixConfig: {
            content: t('dict.QuotationColumn.wholeWidthTip'),
          },
          editRender: {
            name: 'InputNumber',
            props: {
              dynamicDisabled: (row: any) => {
                if (isNullOrUnDef(row.materialTypeFromManufacturer)) {
                  return true;
                }
                return false;
              },
              placeholder: t('dict.QuotationColumn.wholeWidth1'),
            },
          },
        },
        {
          title: t('dict.QuantitativePlanColumn.Length'), // 长度
          width: 100,
          field: 'wholeLength',
          titlePrefix: {
            content: t('dict.QuotationColumn.wholeWidthTip'),
          },
          prefixConfig: {
            content: t('dict.QuotationColumn.wholeWidthTip'),
          },
          editRender: {
            name: 'InputNumber',
            props: {
              dynamicDisabled: (row: any) => {
                if (isNullOrUnDef(row.materialTypeFromManufacturer) || row.materialTypeFromManufacturer == '') {
                  return true;
                }
                return false;
              },
              placeholder: t('dict.QuantitativePlanColumn.Length'),
            },
          },
        },
        {
          title: t('common.unitPriceOfMaterials'), // 成本中心价 整只料规格
          width: 100,
          field: 'wholePrice',
          titlePrefix: {
            content: t('dict.QuotationColumn.wholeWidthTip'),
          },
          prefixConfig: {
            content: t('dict.QuotationColumn.wholeWidthTip'),
          },
        },
        {
          title: t('dict.PriceInquiryColumn.purchasingUnit'), // 采购单位
          width: 100,
          field: 'wholeUnit',
          titlePrefix: {
            content: t('dict.QuotationColumn.wholeWidthTip'),
          },
          prefixConfig: {
            content: t('dict.QuotationColumn.wholeWidthTip'),
          },
        },
        {
          title: t('dict.QuotationColumn.utilizationRate'), // 材料利用率
          width: 100,
          field: 'utilizationRate',
        },
      ],
    },
    {
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      title: '操作',
      fixed: 'right',
    },
  ];
  return columns as VxeGridPropTypes.Columns;
}

async function handleSearchValChange(props: any, originInsideCode: string, data: any, params: any, sumCost: Ref<number>) {
  const { row, $grid } = params;

  const { eightCode, singleWidth, singleStepDistance, singleModulus, singleProcessLosses } = row;

  if (!originInsideCode) {
    Object.assign(row, {
      insideCode: '',
      wholeLength: '',
      wholeWidth: '',
      wholeThickness: '',
      materialDescription: '',
      hasPriceName: '无',
      hasPrice: 0,
      cost: null,
    });
    return;
  }
  // 必须有八码和宽度才会触发下面的逻辑
  if (!(eightCode && singleWidth)) {
    return;
  }
  // 材料数据显示
  Object.assign(row, {
    wholeLength: data.materialLength,
    wholeWidth: data.materialWidth,
    // wholeThickness: data.materialThickness,
    materialDescription: data.materialDesc,
  });
  // 整支宽度改变，触发计算材料利用率
  // 计算材料利用率
  const utilizationRate = calculateUseWidthRate({ singleWidth, wholeWidth: data.materialWidth });
  row.utilizationRate = utilizationRate;
  // row.insideCode = buildInsideCode(originInsideCode, singleWidth);
  row.insideCode = originInsideCode;
  row.originInsideCode = originInsideCode;
  const formatValues = (await getHasPrice(props.currentData, props.formValues, row)) as any;
  if (isEmpty(formatValues)) {
    // 没有价格 取消采购人员禁用
  } else {
    // 有价格
    Object.assign(row, formatValues);
  }

  const { wholePrice } = formatValues;
  const { wholeWidth, wholeLength, wholeUnit, materialDosage } = row;

  // 计算成本中心价
  row.cost = calculateCostCenterPrice(
    wholePrice,
    wholeWidth,
    singleWidth,
    wholeLength,
    singleStepDistance,
    singleModulus,
    singleProcessLosses,
    wholeUnit,
    materialDosage,
  );
  await nextTick();
  // 计算成本小计
  if (!sumCost) return;
  calculateSum($grid, sumCost);
  // if (data) {
  //   row.productionType = productionType;
  //   row.productionTypeName = data.fullName;
  // } else {
  //   row.productionType = null;
  //   row.productionTypeName = '';
  // }
}

/**
 * @param currentData -当前列表行数据
 * @param formValues 用户填写的form表单数据
 * @param row 当前行数据
 * @returns Promise
 */
function getHasPrice(currentData: any, formValues: any, row: any) {
  return new Promise(async resolve => {
    const { terminalCustomerCode, productLineCode } = currentData;
    const { originInsideCode, materialTypeFromManufacturer } = row;
    const { data } = await getMaterialPriceList({
      terminalCustomerCode,
      productLineCode,
      status: 1,
      insideCode: originInsideCode || '',
      materialTypeFromManufacturer: materialTypeFromManufacturer || '',
    });
    // 查询结果为[]，则没有查询到价格
    if (isEmpty(data)) {
      row.hasPrice = 0;
      row.hasPriceName = '无';
      createMessage.warning('没有查询到价格');
      resolve({});
      return;
    }
    const price = data[0];
    const values = await formValues;
    const formatRow = handleIsBondedPrice(values.isBonded, price) as any;
    if (isEmpty(data)) {
      // 无价格 清空采购人
      formatRow['hasPrice'] = 0;
      formatRow['hasPriceName'] = '无';
      delete formatRow.purchaserId;
      delete formatRow.purchaserName;
    }
    resolve(formatRow);
  });
}

/**
 * 处理是否有价格, 格式化行数据
 * @param {0 | 1} isBonded - 是否保税
 * @param {any} data - 行数据
 * @returns {object} - 格式化后的行数据
 */
function handleIsBondedPrice(isBonded: 0 | 1, data: any) {
  const formatRow: any = {};
  Object.assign(formatRow, {
    hasPrice: 1,
    hasPriceName: '有',
    purchaserName: data.developmentPurchaserName || '', // 开发采购
    purchaserId: data.developmentPurchaserId, // 开发采购
    wholeUnit: data.purchasingUnit,
  });
  // 根据保税判断成本中心价
  if (isBonded) {
    formatRow['wholePrice'] = data.bondedPricePriceUnit; // 保税
  } else {
    formatRow['wholePrice'] = data.generalTradePricePriceUnit; // 非保税
  }

  return formatRow;
}

/**
 * 计算用量: (宽度 * 步距) / 模数 * 用量倍数 --> 单位转换 /1000000
 * @param {number} width - 宽度
 * @param {number} stepDistance - 步距
 * @param {number} modulus - 模数
 * @param {number} materialDosage - 用量倍数
 */
export function calculateUseQty(width: number, stepDistance: number, modulus: number, materialDosage: number) {
  if (width && stepDistance && modulus) {
    const mathWidth = bignumber(width);
    const mathStepDistance = bignumber(stepDistance);
    const mathModulus = bignumber(modulus);
    const mathMaterialDosage = Number.isNaN(materialDosage) ? 0 : bignumber(materialDosage);
    // 计算用量
    const useQty = chain(mathWidth).multiply(mathStepDistance).multiply(mathMaterialDosage).divide(mathModulus).divide(bignumber(1000000)).done();
    return format(useQty, { notation: 'fixed', precision: 6 });
  }
  return null;
}

/**
 * 使用: init数据 add数据 watch processYield数据
 * 计算制程损耗: 1-工序还原直通率
 * @param {number} processYield - 工序还原直通率
 */
// function calculateProcessLosses(processYield: number) {
//   if (processYield) {
//     const mathProcessYield = bignumber(processYield);
//     // 计算制程损耗
//     const processLosses = chain(bignumber(1)).subtract(mathProcessYield).done();
//     return format(processLosses, { notation: 'fixed', precision: 2 });
//   }
//   return null;
// }

/**
 * 计算成本中心价: (整支采购单价/(向下取整(整支材料宽度 / 录入原材料宽度)))
 * *(整支材料长度/步距)*模数*(1-制程损耗)
 * @param {number} wholePrice - 整只采购单价
 * @param {number} wholeWidth - 整只材料宽度
 * @param {number} singleWidth - 录入原材料宽度
 * @param {number} wholeLength - 整只材料长度
 * @param {number} singleStepDistance - 步距
 * @param {number} singleModulus - 模数
 * @param {number} processLosses - 制程损耗
 * @param {number} materialDosage - 用量倍数
 */
export function calculateCostCenterPrice(
  wholePrice: number,
  wholeWidth: number,
  singleWidth: number,
  wholeLength: number,
  singleStepDistance: number,
  singleModulus: number,
  processLosses: number | string,
  wholeUnit: string,
  materialDosage: number,
) {
  // 如果单价不是M2并且不是PCS 返回空，让用户重新报价
  if (wholeUnit !== 'M2' && wholeUnit !== 'PCS') {
    return null;
  }
  if (isString(processLosses)) {
    processLosses = Number(processLosses.replaceAll('%', ''));
  }
  const computable = isComputableArray([wholePrice, wholeWidth, wholeLength, wholeLength, singleStepDistance, singleModulus, processLosses]);
  if (!computable) return 0;
  const mathWholePrice = bignumber(wholePrice);
  const mathWholeWidth = bignumber(wholeWidth);
  const mathSingleWidth = bignumber(singleWidth);
  const mathWholeLength = bignumber(wholeLength);
  const mathSingleStepDistance = bignumber(singleStepDistance);
  const mathSingleModulus = bignumber(singleModulus);
  const mathProcessLosses = bignumber(processLosses);

  // (整支采购价格*（整支宽度/1000）*整支长度) / (INT(整支宽度 / 单个宽度) * (整支长度 / 单个步距) * 单个模数 * (1 - 单个制程损耗)) * 用量倍数.
  // 整支宽度/1000*整支长度
  // const countPerWidth = floor(divide(mathWholeWidth, mathSingleWidth));
  const countPerWidth = chain(mathWholeWidth).divide(mathSingleWidth).floor().done();

  const stepsPerLength = divide(mathWholeLength, mathSingleStepDistance);

  const denominatorPart = subtract(1, divide(mathProcessLosses, 100));
  const denominator = multiply(bignumber(countPerWidth), bignumber(stepsPerLength), mathSingleModulus, bignumber(denominatorPart));
  let numerator;
  if (wholeUnit === 'PCS') {
    numerator = mathWholePrice;
  } else if (wholeUnit === 'M2') {
    numerator = multiply(
      mathWholePrice,
      divide(wholeWidth, 1000), // 宽度从mm转换为m
      wholeLength,
    );
  } else {
    return null;
  }

  const costCenterPrice = multiply(bignumber(divide(numerator, denominator)), bignumber(materialDosage));

  if (mathIsNaN(costCenterPrice) || Number.isNaN(costCenterPrice.e)) {
    return 0;
  }

  return format(costCenterPrice, { notation: 'fixed', precision: 6 });
}

/**
 * 计算材料利用率： ( 原材整支宽度 / 使用宽度) 取小数位取整*使用宽度/ 原材整支宽度\
 * @param {number} singleWidth - 录入原材料宽度
 * @param {number} wholeWidth - 整只材料宽度
 * @returns {number} - 材料利用率
 */

function calculateUseWidthRate({ singleWidth, wholeWidth }: { singleWidth: number; wholeWidth: number }) {
  if (!(singleWidth && wholeWidth)) return null;
  const mathSingleWidth = bignumber(singleWidth);
  const mathWholeWidth = bignumber(wholeWidth);
  const useWidthRate = chain(floor(dotDivide(mathWholeWidth, mathSingleWidth)))
    .multiply(mathSingleWidth)
    .divide(mathWholeWidth)
    .multiply(bignumber(100))
    .done();
  return format(useWidthRate, { notation: 'fixed', precision: 2 }) + '%';
}

// 计算材料成本
export function calculateSum(grid: any, sumCostShadow: Ref<number | string>, list: any[] = []) {
  const data = grid.getFullData?.() || list;
  let mathSum = bignumber(0);
  data.forEach((item: any) => {
    // sum = sum + item.cost
    // mathSum.add(bignumber(item.cost || 0))
    mathSum = add(mathSum, bignumber(item.cost || 0));
  });
  const sum = mathSum;
  sumCostShadow.value = format(sum, { notation: 'fixed', precision: 6 });
}

/**
 * 格式化材料查询结果的说明，`altMaterial`代表是否为替代料，`hasPrice`代表为是否存在价格
 * @param option
 */
export function getOriginPartNumberDesc(option: { altMaterial: 0 | 1; priority: number; hasPrice: boolean }) {
  let desc = '';
  if (option.altMaterial) {
    desc += `(${[t('dict.CommonCol.alternativeMaterials'), option.priority !== undefined && option.priority !== null ? option.priority.toString() : '']
      .filter(Boolean)
      .join(': ')})`;
  }
  if (option.hasPrice) {
    desc += `(${t('dict.CommonCol.hasPrice')})`;
  }
  return desc;
}
