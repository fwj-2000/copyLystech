import { BaseVxeTableTypes, EFilterSlot } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      field: 'FactoryName',
      title: '厂区',
      width: 100,
      align: 'center',
      className: 'bg-white',
      mergeConfig: {
        needMergeRow: true,
      },
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
    },
    {
      field: 'TimeDate',
      title: '日期',
      width: 120,
      align: 'center',
    },
    {
      field: 'TicketDimension',
      title: '工单维度（单位：张）',
      align: 'center',
      children: [
        {
          field: 'CountLessThan7Days',
          title: '7天以内',
        },
        {
          field: 'Count8To15Days',
          title: '8-15天',
        },
        {
          field: 'Count16To30Days',
          title: '16-30天',
        },
        {
          field: 'Count31To60Days',
          title: '31-60天',
        },
        {
          field: 'CountMoreThan60Days',
          title: '60天以上',
        },
        {
          field: 'CountTotal',
          title: '合计',
        },
      ],
    },
    {
      field: 'WIPAmount',

      title: 'WIP金额（单位：万元）',
      align: 'center',
      children: [
        {
          field: 'SumLessThan7Days',
          title: '7天以内',
        },
        {
          field: 'Sum8To15Days',
          title: '8-15天',
        },
        {
          field: 'Sum16To30Days',
          title: '16-30天',
        },
        {
          field: 'Sum31To60Days',
          title: '31-60天',
        },
        {
          field: 'SumMoreThan60Days',
          title: '60天以上',
        },
        {
          field: 'SumTotal',
          title: '合计',
        },
      ],
    },
  ];
  return columns;
};
