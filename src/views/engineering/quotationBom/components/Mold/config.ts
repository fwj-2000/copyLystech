/*
 * @Author: wenzhenjin
 * @Date: 2025-05-14 14:32:24
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-21 17:00:37
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\components\Mold\config.ts
 */
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { add, bignumber, chain, format } from 'mathjs';
const { t } = useI18n();
const baseStore = useBaseStore();
export function getMoldColumns(sumCost) {
  return [
    { type: 'seq', field: 'index', width: 50 },
    {
      title: t('dict.QuotationColumn.moldType'), // 模夹治具类型
      field: 'moldType',
      // width: 120,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'moldTypeName',
        dblClickHead: false,
        props: {
          placeholder: t('dict.QuotationColumn.moldType'),
          api: () => baseStore.getDictionaryData('MoldApply.MoldType', true),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: '',
          },
          filterOption: (val, option) => {
            return (option.label || option.fullName).includes(val);
          },
          onChange: (e, data, { row }) => {
            if (e && data) {
              row.moldType = e;
              row.moldTypeName = data.label;
            }
          },
        },
      },
    },
    {
      title: t('dict.QuotationColumn.price'), // 价格
      field: 'price',
      // width: 150,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('dict.QuotationColumn.price'),
          onChange: (price, { row, $grid }) => {
            row.cost = calculateMoldCost({ price, moldLifespan: row.moldLifespan });
            // 触发计算成本小计
            calculateSum($grid, sumCost);
          },
        },
      },
    },
    {
      title: t('dict.QuotationColumn.moldLifespan'), // 寿命
      field: 'moldLifespan',
      // width: 150,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('dict.QuotationColumn.moldLifespan'),
          onChange: (moldLifespan, { row, $grid }) => {
            row.cost = calculateMoldCost({ price: row.price, moldLifespan });
            // 触发计算成本小计
            calculateSum($grid, sumCost);
          },
        },
      },
    },
    {
      title: t('dict.QuotationColumn.mouldCost'), // 模具费用
      field: 'cost',
      // width: 150,
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

function calculateMoldCost({ price, moldLifespan }) {
  if (price && moldLifespan) {
    const mathPrice = bignumber(price);
    const mathMoldLifespan = bignumber(moldLifespan);

    const result = chain(mathPrice).divide(mathMoldLifespan).done();

    return format(result, { notation: 'fixed', precision: 6 });
  }
}

// 计算材料成本
export function calculateSum(grid, sumCostShadow, list = []) {
  const data = grid.getFullData?.() || list;
  let mathSum = bignumber(0);
  data.forEach(item => {
    // sum = sum + item.cost
    // mathSum.add(bignumber(item.cost || 0))
    mathSum = add(mathSum, bignumber(item.cost || 0));
  });
  const sum = mathSum;
  sumCostShadow.value = format(sum, { notation: 'fixed', precision: 6 });
}
