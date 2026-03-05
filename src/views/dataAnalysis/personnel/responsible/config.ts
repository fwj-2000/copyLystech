import { commonMediumTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

// 表单配置
export const formOptions: TFormItemOption[] = [commonOrgCodeFormOptions];

// 导出表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns = [
    {
      ...commonMediumTextOption,
      title: '厂区代码',
      field: 'OrgCode',
    },
    {
      ...commonMediumTextOption,
      title: '厂区',
      field: 'Factory',
    },
    {
      ...commonMediumTextOption,
      title: '负责人',
      width: 150,
      field: 'ResponsiblePerson',
    },
  ];
  return columns;
};
