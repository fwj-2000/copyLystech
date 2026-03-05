import dayjs from 'dayjs';
import { cloneDeep, merge } from 'lodash-es';
import { getFyOrganization } from '/@/api/dashbord/operate';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { VxeGridPropTypes } from 'vxe-table';

export const getCommonReqParams = (searchFromValue: Record<string, any>) => {
  const { orgCode, dateRange } = searchFromValue;
  const [startDate, endDate] = dateRange;
  const orgCodeStr = orgCode ? orgCode : '';
  return {
    orgCode: orgCodeStr,
    startTime: startDate.format('YYYY-MM'),
    endTime: endDate.format('YYYY-MM'),
  };
};

export const allOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getFyOrganization(params);
      const list = data.list ?? data;
      // 将结果处理成下拉菜单的属性
      const handleList = list.map(item => {
        return {
          id: item.ID,
          parentId: item.Parent_Id,
          value: item.Org_Code,
          text: item.Org_Name,
          level: item.Org_Level,
        };
      });
      // 转换成树形结构数据
      return handleList;
    },
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(1, 'month'), dayjs().tz()],
    key: 'dateRange',
    attrs: {
      picker: 'month',
    },
  },
];

// 通用字段配置
export const allColumns = {
  Year: {
    width: 60,
    title: '财年',
    headerAlign: 'center',
  },
  Month: {
    width: 80,
    title: '月',
    headerAlign: 'center',
  },
  Factory: {
    width: 80,
    title: '厂区',
    headerAlign: 'center',
  },
  Bu: {
    width: 80,
    title: 'Bu',
    headerAlign: 'center',
  },
  Sbu: {
    width: 80,
    title: 'Sbu',
    headerAlign: 'center',
  },
  ImportDate: {
    width: 80,
    title: '导入时间',
    headerAlign: 'center',
  },
  Ywfw: {
    width: 80,
    title: '业务范围',
    headerAlign: 'center',
  },
  YwfwMs: {
    width: 100,
    title: '业务范围描述',
    headerAlign: 'center',
  },
  YwfwYs: {
    width: 80,
    title: '分摊前业务范围',
    headerAlign: 'center',
  },
  YwfwMsYs: {
    width: 100,
    title: '分摊前业务范围描述',
    headerAlign: 'center',
  },
  Department: {
    width: 100,
    title: '部门',
    headerAlign: 'center',
  },
  Dygbsywd: {
    width: 100,
    title: '对应管报损益维度',
    headerAlign: 'center',
  },
  Fysx: {
    width: 100,
    title: '费用属性',
    headerAlign: 'center',
  },
  Fyxz: {
    width: 100,
    title: '费用性质',
    headerAlign: 'center',
  },
  Sjfl: {
    width: 100,
    title: '数据分类',
    headerAlign: 'center',
  },
  Ft: {
    width: 100,
    title: '数据来源',
    headerAlign: 'center',
  },
  Gnfw: {
    width: 100,
    title: '功能范围',
    headerAlign: 'center',
  },
  Gnfwms: {
    width: 100,
    title: '功能范围描述',
    headerAlign: 'center',
  },
  Km: {
    width: 100,
    title: '科目',
    headerAlign: 'center',
  },
  Kmms: {
    width: 100,
    title: '科目描述',
    headerAlign: 'center',
  },
  Mjkm: {
    width: 100,
    title: '末级科目',
    headerAlign: 'center',
  },
  Yskm: {
    width: 100,
    title: '预算科目',
    headerAlign: 'center',
  },
  Fylb: {
    width: 100,
    title: '费用类别',
    headerAlign: 'center',
  },
  Cbzx: {
    width: 100,
    title: '成本中心',
    headerAlign: 'center',
  },
  Cbzxms: {
    width: 100,
    title: '成本中心描述',
    headerAlign: 'center',
  },
  Cbysz: {
    width: 100,
    title: '成本元素组',
    headerAlign: 'center',
  },
  Cbyszms: {
    width: 100,
    title: '成本元素组描述',
    headerAlign: 'center',
  },
  Jthbje: {
    width: 100,
    title: '集团货币金额',
    headerAlign: 'center',
  },
};
// 获取表头配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    { field: 'Year' },
    { field: 'Month' },
    { field: 'Factory' },
    { field: 'Bu' },
    { field: 'Sbu' },
    { field: 'Ywfw' },
    { field: 'YwfwMs' },
    { field: 'YwfwYs' },
    { field: 'YwfwMsYs' },
    { field: 'Department' },
    { field: 'Dygbsywd' },
    { field: 'Fysx' },
    { field: 'Fyxz' },
    { field: 'Sjfl' },
    { field: 'Ft' },
    { field: 'Gnfw' },
    { field: 'Gnfwms' },
    { field: 'Km' },
    { field: 'Kmms' },
    { field: 'Mjkm' },
    { field: 'Yskm' },
    { field: 'Fylb' },
    { field: 'Cbzx' },
    { field: 'Cbzxms' },
    { field: 'Cbysz' },
    { field: 'Cbyszms' },
    { field: 'Jthbje' },
  ];
  return columns.map(item => {
    const { field } = item;
    return merge(cloneDeep(allColumns[field]), item);
  });
};
