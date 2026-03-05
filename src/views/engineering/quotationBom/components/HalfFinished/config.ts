import type { Ref } from 'vue';
import type { MathType } from 'mathjs';

import { getSemiFinishedProductsList } from '/@/api/engineering/semifinishedproducts';
import { add, bignumber, format, multiply, divide, subtract, compare } from 'mathjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { getMaterialPriceList } from '/@/api/engineering/quotatios';

const { t } = useI18n();

/** 生产类型枚举 */
export enum PRODUCTION_TYPE_ENUM {
  委外 = 'Delegate',
  外购 = 'Outsourcing',
  自制 = 'Self',
}

/** 获取编辑表格列配置 */
export function getColumn(data: Readonly<{ factory: string }>, processDepletion: Ref<MathType>): Array<any> {
  return [
    // 半成品料号
    {
      field: 'halfFinishedPart',
      title: t('dict.SemiFinishedProductsColumn.semiFinishedProductsPartNumber'),
      width: 200,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        dblClickHead: false,
        props: {
          api: (params: any) => getSemiFinishedProductsList({ ...params, factory: data?.factory || '' }),
          // api: (params: any) => getSemiFinishedProductsList({ ...params }),
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'semiFinishedProductsPartNumber',
          },
          resultField: 'data',
          labelField: 'semiFinishedProductsPartNumber',
          valueField: 'semiFinishedProductsPartNumber',
          filterOption: false,
          immediate: true,
          onChange: (_value: string, option: any, params: any) => handleHalfFinishedPartChange(option, params),
        },
      },
    },
    // 生产类型
    {
      field: 'productionTypeName',
      title: t('dict.CommonCol.produceTypeName'),
      width: 120,
    },
    // 描述
    {
      field: 'halfFinishedPartDesc',
      title: t('dict.CommonCol.depiction'),
      width: 200,
    },
    // 用量倍数
    {
      field: 'materialDosage',
      title: t('dict.PCCColumn.useQtyMultiple'),
      width: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          onChange: (_value: number, { row }) => calculateUseQty(row, processDepletion),
        },
      },
    },
    // 用量/KPCS
    {
      field: 'useQty',
      title: t('dict.PCCColumn.useQty'),
      width: 120,
    },
    // 制程损耗
    {
      field: 'processDepletion',
      title: t('dict.QuotationColumn.singleProcessLosses'),
      width: 120,
      formatter: ({ cellValue }) => (Number.isNaN(+cellValue) ? '' : ((+cellValue || 0) * 100).toFixed(2) + '%'),
    },
    // 有无价格
    {
      field: 'hasPrice',
      title: t('dict.QuotationColumn.hasPrice'),
      width: 120,
      formatter: ({ cellValue, row }) => {
        if (row.hasPriceName) return row.hasPriceName;

        if (typeof cellValue === 'boolean') {
          return cellValue ? t('dict.NewsStatusEnum.Have') : t('dict.NewsStatusEnum.Nothing');
        }

        return cellValue;
      },
    },
    // 开发采购
    {
      field: 'purchaserId',
      title: t('dict.PriceInquiryColumn.purchaserId'),
      width: 200,
      editRender: {
        name: 'CustomUserSelect',
        props: {
          dynamicDisabled: (row: any) => {
            // 自制的半成品采购栏置灰，不允许编辑
            return row.productionType === PRODUCTION_TYPE_ENUM.自制;
          },
        },
      },
    },
    // 半成品成本
    {
      field: 'cost',
      title: t('dict.Quotation.halfFinishedPartCost'),
      width: 120,
    },
    // 半成品单价
    {
      field: 'price',
      title: t('dict.Quotation.halfFinishedPartPrice'),
      width: 120,
    },
    // 单位
    {
      field: 'purchaseUnit',
      title: t('dict.PCCColumn.unit'),
      width: 120,
    },
    // 图纸
    {
      field: 'drawingFile',
      title: t('dict.CommonCol.prjDrawingsName'),
      width: 120,
      slots: { default: 'drawingFile' },
    },
    // 备注
    {
      field: 'remarks',
      title: t('dict.CommonCol.remark'),
      width: 300,
      editRender: { name: 'Input' },
    },
    // 操作
    {
      field: 'action',
      slots: { default: 'action' },
      width: 'auto',
      title: t('common.action'),
      fixed: 'right',
    },
  ];
}

/**
 * 半成品料号改变处理
 * @param option 变化的选项
 * @param param row: 当前行数据, $grid: 当前表格实例
 */
export async function handleHalfFinishedPartChange(option: any, { row, $grid }) {
  $grid.setRow(row, {
    productionType: option?.productionType || '',
    productionTypeName: option?.productionTypeName || '',
    halfFinishedPartDesc: option?.semiFinishedProductsDesc || '',
    drawingFile: [],
    hasPrice: false,
    hasPriceName: t('dict.NewsStatusEnum.Nothing'),
    cost: '',
    price: '',
  });

  // 清空临时赋值
  if (row.purchaserName === '/') {
    $grid.setRow(row, {
      purchaserName: '',
    });
  }

  if (option?.productionType === PRODUCTION_TYPE_ENUM.自制) {
    // 当类型为`自制`时，清空采购
    $grid.setRow(row, {
      purchaserId: '',
      purchaserName: '/',
    });
  }

  if (!row.halfFinishedPart) {
    return false;
  }

  getMaterialPriceList({
    status: 1,
    insideCode: row.halfFinishedPart || '',
  }).then(res => {
    if (!Array.isArray(res?.data) || res?.data?.length === 0) {
      return;
    }
    row.hasPrice = true;
    row.hasPriceName = t('dict.NewsStatusEnum.Have');
  });
}

/**
 * 计算`成本小计`
 * @param grid
 * @param sumCostShadow
 * @param list
 */
export function calculateSum(grid: any, sumCostShadow: Ref<number | string>, list = []) {
  const data = grid.getFullData?.() || list;
  let mathSum = bignumber(0);
  data.forEach((item: any) => {
    mathSum = add(mathSum, bignumber(item.cost || 0));
  });
  sumCostShadow.value = format(mathSum, { notation: 'fixed', precision: 6 });
}

/**
 * 计算`用量(useQty)`，用量  = 用量倍数 * 1000 / (1 - 制程损耗)
 * @param row 行数据
 * @param processDepletion 制程损耗
 */
export function calculateUseQty(row: any, processDepletion: Ref<MathType>) {
  // 如果制程损耗大于等于`1`，或者小于`0`，则不计算
  // 或者不存在`用量倍数`，也不进行计算
  if (compare(processDepletion.value, bignumber(1)) === 0 || compare(processDepletion.value, bignumber(0)) === -1 || !row.materialDosage) {
    row.useQty = '0';
    return;
  }
  // 用量  = 用量倍数 * 1000 / (1 - 制程损耗)
  row.useQty = format(divide(multiply(bignumber(row.materialDosage), bignumber(1000)), subtract(bignumber(1), processDepletion.value)), {
    notation: 'fixed',
    precision: 6,
  });
}
