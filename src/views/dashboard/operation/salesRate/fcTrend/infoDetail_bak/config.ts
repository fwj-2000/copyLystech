import { commonDateOption, commonValueOption, commonMediumValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
// 首页-所有字段
import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: VxeGridPropTypes.Columns = [
    {
      field: 'ProductLine',
      title: '产品线',
      mergeConfig: {
        needMergeRow: true,
      },
      headerAlign: 'center',
      width: 80,
    },
    {
      field: 'Items',
      mergeConfig: {
        needMergeRow: true,
      },
      title: '项目',
      width: 80,
      headerAlign: 'center',
    },
    {
      field: 'Factory',
      mergeConfig: {
        needMergeRow: true,
      },
      title: '厂区',
      width: 80,
      headerAlign: 'center',
    },
    { field: 'WeekNum', title: '版本号', width: 100, headerAlign: 'center' },
    { field: 'MbQty', title: '目标出货数', ...commonMediumValueOption },
    { field: 'SjQty', title: '实际出货数', ...commonMediumValueOption },
    { field: 'ChdClv', title: '出货达成率', ...commonMediumValueOption },
    { field: 'Total', title: ' 汇总', ...commonMediumValueOption },
    { field: 'Wk1', title: ' Wk1', ...commonValueOption },
    { field: 'Wk2', title: ' Wk2', ...commonValueOption },
    { field: 'Wk3', title: ' Wk3', ...commonValueOption },
    { field: 'Wk4', title: ' Wk4', ...commonValueOption },
    { field: 'Wk5', title: ' Wk5', ...commonValueOption },
    { field: 'Wk6', title: ' Wk6', ...commonValueOption },
    { field: 'Wk7', title: ' Wk7', ...commonValueOption },
    { field: 'Wk8', title: ' Wk8', ...commonValueOption },
    { field: 'Wk9', title: ' Wk9', ...commonValueOption },
    { field: 'Wk10', title: ' Wk10', ...commonValueOption },
    { field: 'Wk11', title: ' Wk11', ...commonValueOption },
    { field: 'Wk12', title: ' Wk12', ...commonValueOption },
    { field: 'Wk13', title: ' Wk13', ...commonValueOption },
    { field: 'Wk14', title: ' Wk14', ...commonValueOption },
    { field: 'Wk15', title: ' Wk15', ...commonValueOption },
    { field: 'Wk16', title: ' Wk16', ...commonValueOption },
    { field: 'Wk17', title: ' Wk17', ...commonValueOption },
    { field: 'Wk18', title: ' Wk18', ...commonValueOption },
    { field: 'Wk19', title: ' Wk19', ...commonValueOption },
    { field: 'Wk20', title: ' Wk20', ...commonValueOption },
  ];
  return columns;
};
