import { ECellType, IColumnOptions } from '/@/views/dashboard/types';
import InfoDetail from '/@/views/dashboard/operation/salesRate/wosTrend/infoDetail/index.vue';
import dayjs from 'dayjs';
import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
const ALL_COLUMNS_OPTIONS = {
  // 明细表格
  ProductLine: { title: '产品线' },
  Items: { title: '项目' },
  fproduct: { title: '料件' },
  upwkqty: { title: '上周需求数' },
  dqqty: { title: '当周需求数' },
  olldifference: { title: '整体差异数' },
  olldiffvalue: { title: '整体差异金额' },
  ollzb: { title: '整体变化幅度' },
  fcfourqty: { title: '4周未来需求数' },
  fcfiveqty: { title: '5周未来需求数' },
  fourdifference: { title: '4周差异数' },
  fourdiffvalue: { title: '4周差异金额' },
  chqty: { title: '拉货(K)' },
  fourzb: { title: '波动幅度(%)' },
};

// 所有字段
const columns: IColumnOptions[] = [
  { dataIndex: 'ProductLine', title: '产品线', width: 130, filterable: true },
  {
    dataIndex: 'Items',
    title: '项目',
    width: 130,
    filterable: true,
  },
  {
    dataIndex: 'fproduct',
    width: 130,
    filterable: true,
    cellType: ECellType.DIALOG,
    dialogCompo: InfoDetail,
    getQuery: ({ record, searchFormValue, getDateDimParams }) => {
      const orgCode = record.orgcode || searchFormValue.orgCode || 'MQ';
      const { startDim } = getDateDimParams();
      const date = searchFormValue.date.endOf('week');
      const startDate = date.subtract('13', 'week');
      const query = {
        orgCode,
        item: record.Items || '',
        prodLine: record.ProductLine || '',
        dimension: searchFormValue.timeDimension,
        keyword: record.fproduct || '',
        startDim: `${startDate.year()}WK${startDate.week().toString().padStart(2, '0')}`,
        endDim: startDim,
      };
      // 构造路由参数
      return query;
    },
  },
  {
    dataIndex: 'chqty',
    getTitleBySearch: ({ searchFormValue }) => {
      const { date = dayjs().tz() } = searchFormValue;
      const lastWeek = date.subtract(1, 'week');
      const weekString = `WK${lastWeek.week().toString().padStart(2, '0')}`;
      return `${weekString}出货(K)`;
    },
    width: 80,
    sortable: true,
  },
  {
    title: '20周需求整体对比',
    helpMessage: '显示20周内需求的整体对比数据，包括上周需求、当周需求、差异数及波动幅度',
    children: [
      {
        dataIndex: 'dqqty',
        getTitleBySearch: ({ dateDim }) => {
          const weekString = dateDim.startDim.slice(4);
          return `${weekString}-19周(K)`;
        },
        width: 80,
        sortable: true,
      },
      {
        dataIndex: 'upwkqty',
        getTitleBySearch: ({ searchFormValue }) => {
          const [startDate] = searchFormValue.dateRange || [dayjs().tz()];
          const lastWeek = startDate.subtract(1, 'week');
          const weekString = `WK${lastWeek.week().toString().padStart(2, '0')}`;
          return `${weekString}-20周(K)`;
        },
        width: 80,
        sortable: true,
      },
      {
        dataIndex: 'olldifference',
        title: '差异(K)',
        width: 80,
        sortable: true,
        getCustomCellStyle: record => {
          const value = record.olldifference ?? '';
          return {
            ...(Number.parseInt(value, 10) < 0 ? { color: 'red !important' } : {}),
          };
        },
      },
      {
        dataIndex: 'ollzb',
        title: '波动幅度(%)',
        width: 80,
        sortable: true,
        getCustomCellStyle: record => {
          const value = record.ollzb ?? '';
          return {
            ...(Number.parseInt(value, 10) < 0 ? { color: 'red !important' } : {}),
          };
        },
      },
    ],
  },
  {
    title: '4周需求对比',
    children: [
      {
        dataIndex: 'fcfourqty',
        getTitleBySearch: ({ searchFormValue }) => {
          const { date = dayjs().tz() } = searchFormValue;
          const weekString = `WK${date.week().toString().padStart(2, '0')}`;
          return `${weekString}-4周(K)`;
        },
        width: 80,
        sortable: true,
      },
      {
        dataIndex: 'fcfiveqty',
        getTitleBySearch: ({ searchFormValue }) => {
          const { date = dayjs().tz() } = searchFormValue;
          const lastWeek = date.subtract(1, 'week');
          const weekString = `WK${lastWeek.week().toString().padStart(2, '0')}`;
          return `${weekString}-5周(K)`;
        },
        width: 80,
        sortable: true,
      },
      // {
      //   dataIndex: 'chqty',
      //   getTitleBySearch: ({ searchFormValue }) => {
      //     const { date = dayjs().tz() } = searchFormValue;
      //     const lastWeek = date.subtract(1, 'week');
      //     const weekString = `WK${lastWeek.week().toString().padStart(2, '0')}`;
      //     return `${weekString}拉货(K)`;
      //   },
      //   width: 80,
      //   sortable: true,
      // },
      {
        dataIndex: 'fourdifference',
        title: '差异(K)',
        width: 80,
        sortable: true,
        getCustomCellStyle: record => {
          const value = record.fourzb ?? '';
          return {
            ...(Number.parseInt(value, 10) < 0 ? { color: 'red !important' } : {}),
          };
        },
      },
      {
        dataIndex: 'fourzb',
        width: 80,
        sortable: true,
        getCustomCellStyle: record => {
          const value = record.fourzb ?? '';
          return {
            ...(Number.parseInt(value, 10) < 0 ? { color: 'red !important' } : {}),
          };
        },
      },
    ],
  },
  {
    dataIndex: 'block',
  },
];

// 字段配置
export const columnsOptions: IColumnOptions[] = columns.map(item => {
  if (item?.children) {
    return {
      title: item.title,
      width: item.width,
      customHeaderCell: item?.customHeaderCell,
      helpMessage: item.helpMessage,
      children: item.children.map(child => ({
        ...ALL_COLUMNS_OPTIONS[child.dataIndex as string],
        ...child,
      })),
    };
  } else {
    return { ...ALL_COLUMNS_OPTIONS[item.dataIndex as string], ...item };
  }
});

export const defaultOptionValue = {
  prodline: '',
  item: '',
};
