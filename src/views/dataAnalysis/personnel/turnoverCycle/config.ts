import { getColumns } from '/@/views/dataAnalysis/personnel/config';
import { commonMediumFormatValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns = [{ field: 'seq' }, { field: 'Factory' }, { field: 'DeptNameLevel5' }, { field: 'MarkType' }, { field: 'PostName' }];
  return getColumns(columns).concat([
    {
      field: 'List',
      columnType: EColumnType.WEEK_KEYS_VALUES,
      childOption: {
        ...commonMediumFormatValueOption,
        width: '80',
      },
    },
  ]);
};
