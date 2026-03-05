import type { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import type { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import dayjs from 'dayjs';
import { commonMediumTextOption, commonMediumValueOption, commonDateOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { EFilterSlot } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { DATE_RANGE_ENUM } from '../config';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'Factory',
      title: '厂区',

      className: 'bg-white',
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
    },
    {
      ...commonDateOption,
      field: 'EtlDate',
      title: '截止日期',
    },
    {
      ...commonDateOption,
      field: 'Iat2a',
      title: '订单下达日期',
    },
    {
      ...commonDateOption,
      field: 'ZiDate',
      title: '首次领料日期',
    },
    {
      ...commonMediumTextOption,
      field: 'aufnr',
      title: '工单号',
    },
    {
      ...commonMediumTextOption,
      field: 'matnr',
      title: '产品料号',

      width: 200,
    },
    {
      ...commonMediumTextOption,
      field: 'stats',
      title: '工单状态',
    },
    {
      ...commonMediumTextOption,
      field: 'Auart',
      title: '工单类型',
    },
    {
      ...commonMediumTextOption,
      field: 'dispo',
      title: 'MRP控制者',
    },
    {
      ...commonMediumValueOption,
      field: 'AuartNum',
      title: '工单数量',
      formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
      exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 0),
    },
    {
      ...commonMediumValueOption,
      field: 'ZaiZhiDay',
      title: '在制天数',
    },
    {
      ...commonMediumValueOption,
      field: 'JieCunMoney',
      title: '结存金额',
      formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 2, true),
      exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 2),
    },
  ];

  return columns;
};

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.DATE_PICKER,
    key: 'startDay',
    default: dayjs(),
    getParam: value => {
      return { date: dayjs(value).format('YYYY-MM-DD') };
    },
  },
  {
    type: EFormItemType.SELECT,
    key: 'type',
    default: DATE_RANGE_ENUM['7天以内'],
    attrs: {
      style: 'width: 120px',
    },
    options: Object.keys(DATE_RANGE_ENUM).map(key => {
      return {
        text: key,
        value: DATE_RANGE_ENUM[key],
      };
    }),
    getParam: value => {
      const [startDay, endDay] = value.split(',');
      return { type: value, startDay, endDay: endDay || '' };
    },
  },
];
