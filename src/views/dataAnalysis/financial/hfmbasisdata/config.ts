import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonSeqOption,
  commonMiniTextOption,
  commonTextOption,
  commonMediumTextOption,
  commonValueOption,
  commonMiniValueOption,
  commonMediumValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import dayjs from 'dayjs';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { getDateDim } from '/@/views/dataAnalysis/utils';

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().tz().subtract(1, 'week'),
    key: 'week',
    pickerKey: 'dimension',
    attrs: {
      picker: 'week',
    },
    getParam: value => {
      return { week: getDateDim(value) };
    },
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    commonSeqOption,
    {
      ...commonMiniTextOption,
      field: 'factory',
      title: '厂区',
    },
    {
      ...commonTextOption,
      field: 'bukrs',
      title: '业务范围',
    },
    {
      ...commonTextOption,
      width: 50,
      field: 'year',
      title: '年',
    },
    {
      ...commonTextOption,
      width: 50,
      field: 'week',
      title: '周',
    },
    {
      ...commonTextOption,
      field: 'account',
      title: 'HFM科目',
    },
    {
      ...commonTextOption,
      field: 'company_code',
      title: 'HFM代码',
    },
    {
      ...commonMediumTextOption,
      title: 'ACCOUNT',
      field: 'account_explain',
    },
    {
      ...commonMiniTextOption,
      field: 'icp',
      title: 'ICP',
    },
    {
      ...commonMiniTextOption,
      field: 'custom1',
      title: 'CUSTOM1',
    },
    {
      ...commonMiniTextOption,
      field: 'custom2',
      title: 'CUSTOM2',
    },
    {
      ...commonMiniTextOption,
      field: 'custom3',
      title: 'CUSTOM3',
    },
    {
      ...commonMiniTextOption,
      field: 'custom4',
      title: 'CUSTOM4',
    },
    {
      ...commonMiniTextOption,
      field: 'custom5',
      title: 'CUSTOM5',
    },
    {
      ...commonMiniTextOption,
      field: 'custom6',
      title: 'CUSTOM6',
    },
    {
      ...commonMiniTextOption,
      field: 'custom7',
      title: 'CUSTOM7',
    },
    {
      ...commonMiniTextOption,
      field: 'custom8',
      title: 'CUSTOM8',
    },
    {
      ...commonTextOption,
      field: 'desc1',
      title: 'DESC1',
    },
    {
      ...commonTextOption,
      field: 'desc2',
      title: 'DESC2',
    },
    {
      ...commonMiniValueOption,
      field: 'amount',
      title: '金额',
    },
    {
      ...commonMediumTextOption,
      field: 'data_source',
      title: '周报（标识）',
    },
    {
      ...commonTextOption,
      field: 'mandt',
      title: 'MANDT',
    },
    {
      ...commonTextOption,
      field: 'etl_date',
      title: '推送时间',
    },
    {
      ...commonMiniTextOption,
      field: 'api_source',
      title: '周报',
    },
  ];
  return columns;
};
