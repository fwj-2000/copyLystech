import { getMaterialCodeList } from '/@/api/finance/materialPrice';
import { useI18n } from '/@/hooks/web/useI18n';
import { getMaterialPriceList } from '/@/api/engineering/quotatios';
import { isEmpty } from '/@/utils/is';
import { useMessage } from '/@/hooks/web/useMessage';
import { add, bignumber, chain, divide, format } from 'mathjs';

const { createMessage } = useMessage();
const { t } = useI18n();

let sumCostShadow: any = {};

export function getSiliconeColumns(props, sumCost) {
  sumCostShadow = sumCost;
  return [
    {
      title: t('dict.QuotationColumn.insideCode'), // 料号
      field: 'insideCode',
      width: 220,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        dblClickHead: false,
        props: {
          placeholder: t('dict.QuotationColumn.insideCode'),
          api: getMaterialCodeList,
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
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          dynamicDisabled: row => {
            if (row.materialTypeFromManufacturer) {
              return true;
            }
            return false;
          },
          onChange: async (insideCode, data, { row, $grid }) => {
            if (insideCode && data) {
              row.insideCode = insideCode;
              Object.assign(row, {
                materialDescription: data.materialDesc,
                purchasingUnit: '',
                purchaserId: data.developmentPurchaserId,
                purchaserName: data.developmentPurchaserName || '',
              });
              const formatValues = (await getHasPrice(props.currentData, props.formValues, row)) as any;
              if (isEmpty(formatValues)) {
                // 没有价格 取消采购人员禁用
              } else {
                // 有价格
                Object.assign(row, formatValues);
                // 当有价格触发计算价格
                row.cost = calculatePrice({ price: row.price, useQty: row.useQty, defectRate: row.defectRate });
                calculateSum($grid);
              }
            }
          },
        },
      },
    },
    {
      title: t('dict.PriceInquiryColumn.materialTypeFromManufacturer'), // 新材料厂商型号
      field: 'materialTypeFromManufacturer',
      width: 160,
      editRender: {
        name: 'Input',
        dblClickHead: false,
        props: {
          placeholder: t('dict.PriceInquiryColumn.materialTypeFromManufacturer'),
          dynamicDisabled: row => {
            if (row.insideCode) {
              return true;
            }
            return false;
          },
        },
      },
    },
    {
      title: t('dict.PriceInquiryColumn.materialDescription'), // 描述
      field: 'materialDescription',
      width: 220,
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.PriceInquiryColumn.materialDescription'),
        },
      },
    },
    {
      title: t('dict.QuotationColumn.useQtyOfG'), // 用量
      field: 'useQty',
      width: 100,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('dict.QuotationColumn.useQtyOfG'),
          onChange: (useQty, { row, $grid }) => {
            row.useQty = useQty;
            // 用量变化，触发计算价格
            row.cost = calculatePrice({ price: row.price, useQty, defectRate: row.defectRate });
            calculateSum($grid);
          },
        },
      },
    },
    {
      title: t('dict.QuotationColumn.singleProcessLosses'), // 不良率 显示标题改为`制程损耗`
      field: 'defectRate',
      width: 140,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('dict.QuotationColumn.singleProcessLosses'),
          rate: true,
          onChange: (defectRate, { row, $grid }) => {
            row.defectRate = defectRate;
            // 制程损耗变化，重新计算价格
            row.cost = calculatePrice({ price: row.price, useQty: row.useQty, defectRate });
            calculateSum($grid);
          },
        },
      },
    },
    {
      title: t('dict.MaterialDevelopImport.purchaseUserName'), // 开发采购
      width: 200,
      field: 'purchaserId',
      editRender: {
        name: 'CustomUserSelect',
        props: {
          dynamicDisabled: row => {
            return row.hasPrice;
          },
          placeholder: t('dict.MaterialDevelopImport.purchaseUserName'),
        },
      },
    },
    {
      title: t('dict.PriceInquiryColumn.purchasingUnit'), // 采购单位
      field: 'purchasingUnit',
      width: 180,
    },
    {
      title: t('dict.QuotationColumn.hasPrice'), // 是否有价格
      field: 'hasPriceName',
      width: 140,
    },
    {
      title: t('common.unitPriceOfMaterials'), // 成本中心价 标题改为`材料单价`
      field: 'price',
      width: 140,
    },
    {
      title: t('common.materialCost'), // 成本中心价费用分摊 标题改为`材料成本`
      field: 'cost',
      width: 140,
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

/**
 * @param currentData -当前列表行数据
 * @param formValues 用户填写的form表单数据
 * @param row 当前行数据
 * @returns Promise
 */
function getHasPrice(currentData: any, formValues: any, row: any) {
  return new Promise(async resolve => {
    const { terminalCustomerCode, productLineCode } = currentData;
    const { insideCode } = row;
    const { data } = await getMaterialPriceList({
      terminalCustomerCode,
      productLineCode,
      status: 1,
      insideCode: insideCode || '',
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
  const formatRow = {};
  Object.assign(formatRow, {
    hasPrice: 1,
    hasPriceName: '有',
    purchaserName: data.developmentPurchaserName || '', // 开发采购
    purchaserId: data.developmentPurchaserId, // 开发采购
    // materialTypeFromManufacturer: data.materialTypeFromManufacturer, // 新材料厂商型号
    purchasingUnit: data?.purchasingUnit || '', // 采购单位
  });
  // 根据保税判断成本中心价
  if (isBonded) {
    formatRow['price'] = data.bondedPricePriceUnit; // 保税
  } else {
    formatRow['price'] = data.generalTradePricePriceUnit; // 非保税
  }

  return formatRow;
}
// (价格 * 1000 * 用量)  /  (1 - (制程损耗 / 100))
export function calculatePrice({ price, useQty, defectRate }: { price: number; useQty: number; defectRate: number }) {
  if (price && useQty && defectRate) {
    const mathPrice = bignumber(price);
    const mathUseQty = bignumber(useQty);
    const mathDefectRate = bignumber(defectRate);
    // 制程损耗小数
    const mathDefectRater = divide(mathDefectRate, bignumber(100));
    // 分子
    const molecule = chain(mathPrice).multiply(bignumber(1000)).multiply(mathUseQty).done();
    // 分母
    const denominator = chain(bignumber(1)).subtract(mathDefectRater).done();
    const cost = chain(molecule).divide(denominator).done();
    return format(cost, { notation: 'fixed', precision: 6 });
  }
}

export function calculateSum(grid) {
  const data = grid.getFullData();
  let mathSum = bignumber(0);
  data.forEach(item => {
    mathSum = add(mathSum, bignumber(item.cost || 0));
  });
  const sum = mathSum;
  sumCostShadow.value = format(sum, { notation: 'fixed', precision: 6 });
}
