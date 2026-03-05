import { commonMiniTextOption, commonMediumTextOption, commonValueOption, commonLargeValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption, EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

import { commonSyOrgCodeFormOptions, commonDateRangeFormOptions, commonDayWeekMonthFormOptions } from '/@/views/dataAnalysis/config';

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  commonDayWeekMonthFormOptions,
  commonDateRangeFormOptions,
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '科室',
    key: 'dataSource',
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      title: '科室',
      field: 'dataSource',
    },
    {
      ...commonValueOption,
      title: '在职人数',
      field: 'allZaiZhiNum',
    },
    {
      ...commonValueOption,
      title: '排班人数',
      field: 'paibanNum',
    },
    {
      ...commonValueOption,
      title: '打卡人数',
      field: 'daKaChuQinNum',
    },
    {
      ...commonLargeValueOption,
      width: 85,
      title: 'A类员工超10H人数',
      field: 'aWorkTime10Num',
    },
    {
      ...commonLargeValueOption,
      title: '非类员工超12H人数',
      field: 'notAWorkTime12Num',
    },
    {
      ...commonLargeValueOption,
      title: '非A类员工上班超27天人数',
      field: 'notADaKaChuQinNum',
    },
    {
      ...commonLargeValueOption,
      title: '非A类员工上班超27天人数',
      field: 'notAContinuous27PlusNum',
    },
    {
      ...commonLargeValueOption,
      title: 'A类员工上班超6天人数',
      field: 'aContinuousOver6Num',
    },
    {
      ...commonValueOption,
      title: '出勤率',
      field: 'chuQinLv',
    },
    {
      ...commonValueOption,
      title: '违规打卡人数汇总',
      field: 'illegalBrushNum',
    },
    {
      ...commonValueOption,
      title: '上班违规打卡人数',
      field: 'earlyBrushNum',
    },
    {
      ...commonValueOption,
      title: '下班违规打卡人数',
      field: 'lateBrushNum',
    },
  ];
  return columns;
};
