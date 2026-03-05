import { EColumnsType, IColumnOptions, ECellType, IOption } from '../../types';
import { objectToQueryParams } from '../../operate/metricsCenter/utils';
import { getChanxiaolvCascade } from '/@/api/dashbord/report';

export const ALL_COLUMNS_OPTIONS = {
  // 主要报表
  factory: { width: 80, title: '厂区', isRowSpan: true },
  category: { width: 80, title: '指标类型', isRowSpan: true },
  metric: { width: 120, title: '指标' },
  vlist: { width: 80, type: EColumnsType.DATE_VALUE_LIST },
  // 分组表格
  prodline: { width: 80, title: '产品线', isRowSpan: true },
  item: { width: 80, title: '项目', isRowSpan: true },
  // 明细表格
  orgcode: { title: '厂区' },
  weeks: { title: '周别' },
  productline: { title: '产品线' },
  items: { title: '项目' },
  fproduct: { title: '品名' },
  fprocod: { title: '十码' },
  con: { title: '多项目' },
  weight: { title: '权重' },
  ycqty: { title: '未来 4 周', align: 'right', showWarning: true },
  mbchqty: { title: '目标出货数 (JIT)', align: 'right', showWarning: true },
  vmichqty: { title: 'VMI 目标出货数', align: 'right', showWarning: true },
  vmilpqty: { title: 'VMI 良品数', align: 'right', showWarning: true },
  vmiblpqty: { title: 'VMI 不良品数', align: 'right', showWarning: true },
  cpblpqty: { title: '不良品库存数', align: 'right', showWarning: true },
  sjchqty: { title: '实际出货数', align: 'right', showWarning: true },
  jitchqty: { title: 'JIT 出货数', align: 'right', showWarning: true },
  jitmfchqty: { title: 'JIT 免费出货数', align: 'right', showWarning: true },
  jit_total: { title: 'JIT 合计', align: 'right', showWarning: true },
  jit_diffqty: { title: 'JIT 差异', align: 'right', showWarning: true },
  mbczqty: { title: '目标产值 (排产)', align: 'right', showWarning: true },
  sjczqty: { title: '实际产值 (入库)', align: 'right', showWarning: true },
  vmilhqty: { title: 'VMI 拉货数', align: 'right', showWarning: true },
  vmimflhqty: { title: 'VMI 免费拉货数', align: 'right', showWarning: true },
  vmi_total: { title: 'VMI 合计', align: 'right', showWarning: true },
  vmi_diffqty: { title: 'VMI 差异', align: 'right', showWarning: true },
  cplpqty: { title: '良品库存数', align: 'right', showWarning: true },
  zzje: { title: 'WIP 在制金额', align: 'right', showWarning: true },
  cp_wos: { title: '库存 WOS', align: 'right', showWarning: true },
  cpzz_wos: { title: 'WIP 在制 WOS', align: 'right', showWarning: true },
};

// 首页-所有字段
const columns = [
  {
    dataIndex: 'factory',
    width: 80,
    hideBG: true,
    resize: false,
    cellType: ECellType.LINK,
    getPathUrl: ({ record, searchFormValue }) => {
      const orgCode = record.orgcode || 'MQ';
      const [startDate, endDate] = searchFormValue.dateRange;
      const query = {
        orgCode,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        timeDimension: searchFormValue.timeDimension,
      };
      // 构造路由参数
      const url = `/dashboard/operation/salesRate/group?${objectToQueryParams(query)}`;
      return url;
    },
  },
  {
    dataIndex: 'category',
    width: 100,
    resize: false,
    filterable: true,
  },
  {
    dataIndex: 'metric',
    width: 140,
    resize: false,
    filterable: true,
  },
  {
    dataIndex: 'vlist',
    width: 90,
    resize: false,
    getCustomCellStyle: (record, index, column) => {
      const { metric } = record;
      const { dataIndex } = column;
      const value = record[dataIndex] ?? '';
      if (['产值达成率', '出货达成率', '产销率'].includes(metric)) {
        return {
          ...(Number.parseInt(value, 10) < 100 ? { color: 'red !important' } : {}),
        };
      }
      return {};
    },
  },
];

// 字段配置
export const columnsOptions: IColumnOptions[] = columns.map(item => ({
  ...ALL_COLUMNS_OPTIONS[item.dataIndex],
  ...item,
}));

export const defaultOptionValue = {
  prodline: '',
  newOldProject: '',
  item: '',
};
// WOS趋势+FC趋势+2明细 ：4个页面的产品线项目查询，固定带isSimplify=true参数
export const getAllOptions = async (params: any): Promise<IOption[]> => {
  const { data } = (await getChanxiaolvCascade({ ...params, isSimplify: true }).catch()) || { data: {} };
  const { itemList = [], plineList, periodList } = data;
  return [
    {
      text: '产品线',
      width: 100,
      props: 'prodline',
      options: [{ label: '全部', value: '' }].concat(plineList.map(item => ({ label: item, value: item }))),
    },
    {
      text: '新旧项目',
      width: 100,
      props: 'newOldProject',
      options: [{ label: '全部', value: '' }].concat(periodList.map(item => ({ label: item, value: item }))),
    },
    {
      text: '项目',
      width: 100,
      props: 'item',
      options: [{ label: '全部', value: '' }].concat(itemList.map(item => ({ label: item, value: item }))),
    },
  ];
};
