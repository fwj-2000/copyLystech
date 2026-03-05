import { ECellType, IColumnOptions } from '/@/views/dashboard/types';
import InfoDetail from '/@/views/dashboard/operation/salesRate/wosTrend/infoDetail/index.vue';

const ALL_COLUMNS_OPTIONS = {
  // 明细表格
  WeekNum: { title: '周别' },
  ProductLine: { title: '产品线' },
  Items: { title: '项目' },
  fproduct: { title: '产品名称' },
  zzqty: { title: '在制数量(K)' },
  qty: { title: '库存(K)' },
  qty_wk4: { title: '未来四周平均需求(K)' },
  ttl: { title: 'TTL(K)' },
  cpwos: { title: '成品WOS(周)' },
  cptype: { title: '成品状态' },
  cpzzwos: { title: '+在制WOS(周)' },
  cpzztype: { title: '+在制状态' },
};

// 所有字段
const columns: IColumnOptions[] = [
  {
    dataIndex: 'WeekNum',
    title: '周别',
    width: 100,
    filterable: true,
    customRender: ({ text, record }) => {
      const indent = '  '.repeat(record._level || 0); // 每级两个空格
      return indent + text;
    },
  },
  { dataIndex: 'ProductLine', title: '产品线', width: 80, filterable: true },
  {
    dataIndex: 'Items',
    title: '项目',
    width: 80,
    filterable: true,
  },
  {
    dataIndex: 'fproduct',
    width: 120,
    filterable: true,
    cellType: ECellType.DIALOG,
    dialogCompo: InfoDetail,
    getQuery: ({ record, searchFormValue, getDateDimParams }) => {
      const orgCode = record.orgcode || 'MQ';
      const { startDim } = getDateDimParams();
      const { date } = searchFormValue;
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
  { dataIndex: 'zzqty', width: 80, sortable: true },
  { dataIndex: 'qty', width: 80, sortable: true },
  { dataIndex: 'qty_wk4', width: 80, sortable: true },
  { dataIndex: 'ttl', width: 80, sortable: true },
  { dataIndex: 'cpwos', width: 84, sortable: true },
  { dataIndex: 'cptype', width: 90, filterable: true },
  { dataIndex: 'cpzzwos', width: 94, sortable: true },
  { dataIndex: 'cpzztype', width: 94, filterable: true },
  { dataIndex: 'block' },
];

// 字段配置
export const columnsOptions: IColumnOptions[] = columns.map(item => {
  if (item?.children) {
    return {
      title: item.title,
      width: item.width,
      customHeaderCell: item?.customHeaderCell,
      children: item.children.map(child => ({
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

// 获取所有下拉条件
export const statusOptions = [
  { label: '全部', value: '' },
  { label: '4周无需求', value: '4周无需求' },
  { label: '0周', value: '0周' },
  { label: '0-1周', value: '0-1周' },
  { label: '1-2周', value: '1-2周' },
  { label: '2-4周', value: '2-4周' },
  { label: '4-6周', value: '4-6周' },
  { label: '大于6周', value: '大于6周' },
  { label: '超库龄', value: '超库龄' },
  { label: '量产呆滞', value: '量产呆滞' },
  { label: '量产汇总', value: '量产汇总' },
  { label: 'NPI呆滞', value: 'NPI呆滞' },
];
