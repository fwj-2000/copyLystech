import { getMaterialCodeList } from '/@/api/finance/materialPrice';
import { useI18n } from '/@/hooks/web/useI18n';
import { getMaterialPriceList } from '/@/api/engineering/quotatios';
import { isEmpty } from '/@/utils/is';
import { useMessage } from '/@/hooks/web/useMessage';
import { add, bignumber, chain, format } from 'mathjs';
import { nextTick, type Ref } from 'vue';
import type { VxeGridPropTypes } from 'vxe-table';

const { createMessage } = useMessage();
const { t } = useI18n();

export function getBomPackageColumns(props: any, sumCost: Ref<number>): VxeGridPropTypes.Columns {
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
          onChange: async (insideCode, data, { row, $grid }) => {
            if (insideCode && data) {
              row.insideCode = insideCode;
              Object.assign(row, {
                materialDescription: data.materialDesc,
                purchasingUnit: data.purchaseUnit,
                purchaserId: data.developmentPurchaserId,
                purchaserName: data.developmentPurchaserName || '',
              });
              const formatValues = await getHasPrice(props.currentData, props.formValues, row);
              if (!isEmpty(formatValues)) {
                // 有价格
                Object.assign(row, formatValues);
                // 当有价格触发计算价格
                row.cost = calculatePrice({ price: row.price, packQty: row.packQty });
                // 计算价格小计
                await nextTick();
                calculateSum($grid, sumCost);
              }
            }
          },
        },
      },
    },
    {
      title: t('dict.QuantitativePlanColumn.materialDesc'), // 描述
      field: 'materialDescription',
      minWidth: 230,
    },
    {
      title: t('dict.QuotationColumn.packQty'), // 包装数量(KPCS/个)
      field: 'packQty',
      width: 160,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('dict.QuotationColumn.packQty'),
          onChange: async (packQty, { row, $grid }) => {
            row.packQty = packQty;
            row.cost = calculatePrice({ price: row.price, packQty });
            // 计算价格小计
            await nextTick();
            calculateSum($grid, sumCost);
          },
        },
      },
    },
    {
      title: t('dict.MaterialDevelopImport.purchaseUserName'), // 开发采购
      field: 'purchaserId',
      width: 270,
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
      title: t('dict.PriceInquiryColumn.purchasingUnit'), // 采购单位
      width: 110,
      field: 'purchasingUnit',
    },
    {
      title: t('dict.QuotationColumn.hasPrice'), // 有无价格
      width: 110,
      field: 'hasPriceName',
    },
    {
      title: t('common.unitPriceOfMaterials'), // 成本中心价 标题改为`材料单价`
      width: 110,
      field: 'price',
    },
    {
      title: t('common.materialCost'), // 成本中心价费用分摊 标题改为`材料成本`
      width: 110,
      field: 'cost',
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
async function getHasPrice(currentData: any, formValues: any, row: any): Promise<Record<string, any>> {
  const { terminalCustomerCode, productLineCode } = currentData;
  const { insideCode } = row;

  const { data } = await getMaterialPriceList({
    terminalCustomerCode,
    productLineCode,
    status: 1,
    insideCode: insideCode ?? '',
  });

  if (isEmpty(data)) {
    row.hasPrice = 0;
    row.hasPriceName = '无';
    createMessage.warning('没有查询到价格');
    return {};
  }

  const price = data[0];
  const values = await formValues;
  const formatRow = handleIsBondedPrice(values.isBonded, price) as Record<string, any>;

  return formatRow;
}

/**
 * 处理是否有价格, 格式化行数据
 * @param {0 | 1} isBonded - 是否保税
 * @param {any} data - 行数据
 * @returns {object} - 格式化后的行数据
 */
function handleIsBondedPrice(isBonded: 0 | 1, data: any) {
  const formatRow: Record<string, any> = {
    hasPrice: 1,
    hasPriceName: '有',
    purchaserName: data.developmentPurchaserName || '', // 开发采购
    purchaserId: data.developmentPurchaserId, // 开发采购
    materialTypeFromManufacturer: data.materialTypeFromManufacturer, // 新材料厂商型号
  };

  // 根据保税判断成本中心价
  if (isBonded) {
    formatRow.price = data.bondedPricePriceUnit; // 保税
  } else {
    formatRow.price = data.generalTradePricePriceUnit; // 非保税
  }

  return formatRow;
}

// 价格 / 包装数量
export function calculatePrice({ price, packQty }: { price: number; packQty: number }) {
  if (price && packQty) {
    const mathPrice = bignumber(price);
    const mathPackQty = bignumber(packQty);
    const cost = chain(mathPrice).divide(mathPackQty).done();
    return format(cost, { notation: 'fixed', precision: 6 });
  }
  return '0.000000';
}

// 计算包材成本
export function calculateSum(grid: any, sumCostShadow: Ref<string | number>, list: any[] = []) {
  const data = grid?.getFullData?.() || list;
  let mathSum = bignumber(0);
  data.forEach((item: any) => {
    mathSum = add(mathSum, bignumber(item.cost || 0));
  });
  sumCostShadow.value = format(mathSum, { notation: 'fixed', precision: 6 });
}
