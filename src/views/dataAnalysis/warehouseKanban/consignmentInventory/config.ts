import {
  commonMiniTextOption,
  commonTextOption,
  commonMediumTextOption,
  commonLargeTextOption,
  commonMediumFormatValueOptionShowZero as ShowZeroType,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption, EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import dayjs from 'dayjs';

import { commonOrgCodeSelectFormOptions } from '/@/views/dataAnalysis/warehouseKanban/config';

export const formOptions: TFormItemOption[] = [
  commonOrgCodeSelectFormOptions,
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'day'),
    key: 'timeDate',
    getParam: value => ({
      timeDate: value.format('YYYY-MM-DD'),
    }),
  },
];
const commonMediumFormatValueOptionShowZero: Partial<BaseVxeTableTypes.Column> = {
  ...ShowZeroType,
  width: 70,
};
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return [
    { ...commonMediumTextOption, title: '日期', field: 'timeDateStr' },
    { ...commonMiniTextOption, title: '厂区', field: 'factory' },
    // { ...commonMiniTextOption, title: '厂区代码', field: 'sbuCode' },
    { ...commonMiniTextOption, title: '工厂代码', field: 'werks' },
    { ...commonTextOption, title: '物料编号', field: 'matNr' },
    { ...commonLargeTextOption, title: '物料描述', field: 'makTx' },
    {
      ...commonMediumFormatValueOptionShowZero,
      title: '非限制使用的估价库存',
      field: 'labSt',
    },
    { ...commonTextOption, title: '基本计量单位', field: 'meins' },
    { ...commonMediumFormatValueOptionShowZero, title: '在途库存', field: 'traMe' },
    { ...commonMiniTextOption, title: '物料组', field: 'matKl' },
    { ...commonMiniTextOption, title: '物料类型', field: 'mtArt' },
    { ...commonMediumFormatValueOptionShowZero, title: '在检库存', field: 'insMe' },
    { ...commonMediumFormatValueOptionShowZero, title: '已冻结的库存', field: 'spEme' },
    { ...commonTextOption, title: '返回冻结的库存', field: 'retMe' },
    { ...commonMiniTextOption, title: '库存地点', field: 'lgOrt' },
    { ...commonLargeTextOption, title: '仓储地点的描述', field: 'lgObe' },
    { ...commonMiniTextOption, title: '批次号', field: 'charg' },
    { ...commonTextOption, title: '特殊库存标识', field: 'sobKz' },
    { ...commonTextOption, title: '特殊库存编号', field: 'ssNum' },
    { ...commonMediumTextOption, title: '供应商或债权人的账号', field: 'liFnR' },
    { ...commonMediumFormatValueOptionShowZero, title: '单价', field: 'fPrice' },
    { ...commonMediumFormatValueOptionShowZero, title: '金额', field: 'fValue' },
  ];
};
