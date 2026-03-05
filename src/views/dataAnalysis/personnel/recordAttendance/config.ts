import { TFormItemOption, EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import dayjs from 'dayjs';
import { commonLargeColumnOptions, commonSeqOption, commonColumnOptions } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

// 表单配置
export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(4, 'day'),
    key: 'date',
    getParam: value => {
      return { time: value.format('YYYY-MM-DD') };
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'workNow',
    label: '工号',
    attrs: {
      placeholder: '请输入工号',
    },
  },
];

// 导出表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns = [
    { ...commonSeqOption },
    {
      ...commonColumnOptions,
      title: '推送工号',
      field: 'PushWorkNo',
    },
    {
      ...commonLargeColumnOptions,
      title: '推送接收人',
      width: '80',
      field: 'PushUserName',
    },
    {
      ...commonLargeColumnOptions,
      title: '推送时间',
      field: 'PushTime',
      formatter: ({ cellValue }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: '推送内容',
      field: 'PushContent',
      width: 'auto',
      type: 'html' as const,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        // 1. 将 Markdown 链接转为 HTML 超链接
        let content = cellValue.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #1890ff; text-decoration: underline;">$1</a>');
        // 2. 移除所有换行符：包括 \r\n 和 <br> 标签
        content = content
          .replace(/\r\n/g, '') // 移除 \r\n
          .replace(/<br\s*\/?>/gi, ''); // 移除所有 <br> 变体（带/不带闭合）

        return content;
      },
    },
  ];
  return columns;
};
