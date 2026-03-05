import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonTextOption,
  commonValueOption,
  commonMiniValueOption,
  commonMediumValueOption,
  commonMediumFormatValueOptionDecimal_2,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { ETimeDimension, EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import dayjs from 'dayjs';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import type { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import { h } from 'vue';
import { getProfitandlosDownloadTemplate } from '/@/api/dataAnalysis/financial';
import { useDownload } from '/@/views/dashboard/hooks/useDownload';
export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(2, 'week'), dayjs().subtract(1, 'week')],
    key: 'dateRange',
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.WEEK, value);
      return { startDim, endDim };
    },
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    // 业务范围	周期	销售收入（减掉客退数据）	销售收入	客退	直接人员	间接人员	管理人员	总人数	第1周	第2周	第3周	第4周	第5周	第6周	第1周	第2周	第3周	第4周	第5周	第6周	量试报废	量产报废	返工损失	报废原材/半成品	报废成品
    {
      ...commonTextOption,
      field: 'Gsber',
      title: '业务范围',
      // mergeConfig: {
      //   needMergeRow: true,
      // },
    },
    {
      ...commonTextOption,
      field: 'Weeks',
      title: '周期',
    },

    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonMediumValueOption,
      field: 'XssrKt',
      title: '销售收入（减掉客退数据）',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Xssr',
      title: '销售收入',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonMiniValueOption,
      field: 'Kt',
      title: '客退',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Zjry',
      title: '直接人员',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Jjry',
      title: '间接人员',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Glry',
      title: '管理人员',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Zrs',
      title: '总人数',
    },
    {
      headerAlign: 'center',
      title: '未来6周收入',
      field: 'Wlsr',
      children: [
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlsr1',
          title: '第1周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlsr2',
          title: '第2周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlsr3',
          title: '第3周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlsr4',
          title: '第4周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlsr5',
          title: '第5周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlsr6',
          title: '第6周',
        },
      ],
    },
    {
      field: 'Wlcb',
      headerAlign: 'center',
      title: '未来6周成本',
      children: [
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlcb1',
          title: '第1周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlcb2',
          title: '第2周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlcb3',
          title: '第3周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlcb4',
          title: '第4周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlcb5',
          title: '第5周',
        },
        {
          ...commonMediumFormatValueOptionDecimal_2,
          ...commonMiniValueOption,
          field: 'Wlcb6',
          title: '第6周',
        },
      ],
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Lsbf',
      title: '量试报废',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Lcbf',
      title: '量产报废',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Fgss',
      title: '返工损失',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      width: 90,
      field: 'Bfyc',
      title: '报废原材/半成品',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Bfcp',
      title: '报废成品',
    },
    {
      ...commonMediumFormatValueOptionDecimal_2,
      ...commonValueOption,
      field: 'Eobf',
      title: 'EO报废',
    },
  ];
  return columns;
};
/** 批量导入菜单 */
const { downloadFile: DownloadProfitandlosTemplate } = useDownload({
  requestApi: getProfitandlosDownloadTemplate,
});
/** 导入按钮配置 */
export const batchMenuItems: MenuItemType[] = [
  {
    label: '模版下载',
    key: 'profitTemplate',
    clickMethod: () => {
      return DownloadProfitandlosTemplate({ fileName: '海波龙补录导入模板' });
    },
  },
  {
    key: 'importhfmdata',
    label: h(SingleUploadComponent, {
      api: '/api/report/profitandlos/importhfmdata',
      buttonText: '导入',
    }),
  },
];
