import { useI18n } from '/@/hooks/web/useI18n';
// import { formatDecimal } from '/@/utils/lydc';
// import { h } from 'vue';
import Decimal from 'decimal.js';

const { t } = useI18n();

export function getEditTableColumn() {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          disabled: true,
        },
      },
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          disabled: true,
        },
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          disabled: true,
        },
      },
    },
    {
      title: '带衬背数量(PCS)',
      field: 'backProductQty',
      width: 180,
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          onChange: (_: number, { row }) => {
            changeBackProductWeight(row);
          },
        },
      },
    },
    {
      title: '带衬背总重量(G)',
      field: 'backProductTotalWeight',
      width: 180,
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          step: 0.001,
          precision: 3,
          onChange: (_: number, { row }) => {
            changeBackProductWeight(row);
          },
        },
      },
    },
    {
      title: '带衬背单重(KG)',
      field: 'backProductWeight',
      width: 180,
      formatter: ({ cellValue }) => convertScientificNumber(cellValue),
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          disabled: true,
        },
      },
    },
    {
      title: '纯产品数量(PCS)',
      field: 'productQty',
      width: 180,
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          onChange: (_: number, { row }) => {
            changeProductWeight(row);
          },
        },
      },
    },
    {
      title: '纯产品总重量(G)',
      field: 'productTotalWeight',
      width: 180,
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          step: 0.001,
          precision: 3,
          onChange: (_: number, { row }) => {
            changeProductWeight(row);
          },
        },
      },
    },
    {
      title: '纯产品单重(KG)',
      field: 'productWeight',
      width: 180,
      formatter: ({ cellValue }) => convertScientificNumber(cellValue),
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          disabled: true,
        },
      },
    },
    {
      title: '废料单重(KG)',
      field: 'wasteWeight',
      width: 180,
      formatter: ({ cellValue }) => convertScientificNumber(cellValue),
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          disabled: true,
        },
      },
    },
    {
      title: '图片',
      field: 'imageCounter',
      i18nField: 'CommonCol.img',
      width: 180,
      titleSuffix: {
        content: t('dict.FilingsApply.imageRulesTip') + '\n\n' + t('dict.FilingsApply.imageExampleTip'),
      },
      slots: {
        // default: ({ row }) => {
        //   const count = ['productWeightPicture', 'backProductWeightPicture', 'productPicture'].reduce((sum, key) => {
        //     if (row[key]) {
        //       sum++;
        //     }
        //     return sum;
        //   }, 0);
        //   row.imageCounter = count;
        //   return h(
        //     'span',
        //     {
        //       style: {
        //         color: count > 0 ? '#ff7b00' : '#1A1A1A',
        //       },
        //     },
        //     count > 0 ? `${t('component.upload.uploaded')}(${count})` : t('common.pendingUpload'),
        //   );
        // },
        default: 'imageCounter',
      },
    },
    {
      title: '备注(生产备案数据)',
      field: 'produceRmk',
      width: 240,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: t('common.action'),
      width: 100,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

export const editRules = {
  backProductQty: [{ required: true, message: t('common.required') }],
  backProductTotalWeight: [{ required: true, message: t('common.required') }],
  productQty: [{ required: true, message: t('common.required') }],
  productTotalWeight: [{ required: true, message: t('common.required') }],
  productWeight: [
    {
      validator: ({ row }) => {
        // 纯产品单重不能大于带衬背单重
        if (row.productWeight > row.backProductWeight) {
          return Promise.reject(new Error(t('dict.FilingsApply.wasteWeightCheckTip')));
        }
        return Promise.resolve();
      },
    },
  ],
};

/**
 * 计算并更改带衬背单重
 * @param row
 */
export function changeBackProductWeight(row: any) {
  const { backProductTotalWeight, backProductQty } = row;
  // row.backProductWeight = backProductQty !== 0 ? formatDecimal((backProductTotalWeight || 0) / backProductQty / 1000, 7) : 0;
  row.backProductWeight = backProductQty === 0 ? 0 : new Decimal(backProductTotalWeight || 0).div(backProductQty).div(1000).toDecimalPlaces(7).toNumber();
  changeWasteWeight(row);
}

/**
 * 计算并更改纯产品单重
 * @param row
 */
export function changeProductWeight(row: any) {
  const { productTotalWeight, productQty } = row;
  // row.productWeight = productQty !== 0 ? formatDecimal((productTotalWeight || 0) / productQty / 1000, 7) : 0;
  row.productWeight = productQty === 0 ? 0 : new Decimal(productTotalWeight || 0).div(productQty).div(1000).toDecimalPlaces(7).toNumber();
  changeWasteWeight(row);
}

/**
 * 计算并更改纯废料单重
 * @param row
 */
export function changeWasteWeight(row: any) {
  const { backProductWeight, productWeight } = row;
  // row.wasteWeight = formatDecimal(backProductWeight - productWeight, 7);
  row.wasteWeight = new Decimal(backProductWeight || 0)
    .minus(productWeight || 0)
    .toDecimalPlaces(7)
    .toNumber();
}

/**
 * 将科学计数法的小数转换为普通小数
 * @param num
 */
export function convertScientificNumber(num: number | string | undefined): string {
  if (num === undefined) {
    return '';
  }

  const number = typeof num === 'string' ? Number(num) : num;

  // 处理科学计数法并转换为普通字符串
  let str = number.toLocaleString('fullwide', {
    useGrouping: false,
    maximumFractionDigits: 20,
  });

  // 处理仍可能存在的科学计数法（如极小/极大数）
  if (str.includes('e')) {
    const [m, e] = str.split('e');
    const exponent = Number.parseInt(e, 10);
    const [intPart, decPart = ''] = m.split('.');
    const digits = intPart + (decPart || '');

    if (exponent > 0) {
      str = digits.padEnd(exponent + 1, '0');
    } else {
      str = '0.' + digits.padStart(Math.abs(exponent) + digits.length - 1, '0');
    }
  }

  // 拆分整数和小数部分
  let [integer, decimal = ''] = str.split('.');
  decimal = decimal.substring(0, 7); // 保留最多7位小数

  // 拼接最终结果
  return decimal ? `${integer}.${decimal}` : integer;
}
