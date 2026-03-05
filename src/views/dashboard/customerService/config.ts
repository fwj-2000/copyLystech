import { cloneDeep, merge } from 'lodash-es';
import { VxeGridPropTypes } from 'vxe-table';

import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { getFieldValue } from '../commonComponents/SearchForm/utils';
import { fcdatareasoninfosubmit, getCustomerNameBind } from '/@/api/dashbord/fc';
import { getOrganization } from '/@/api/dashbord/operate';
import dayjs from 'dayjs';
import { useUserStore } from '/@/store/modules/user';
import XEUtils from 'xe-utils';

// 获取登录用户名放到默认客服名字
const getUserName = () => {
  const { userInfo } = useUserStore();
  const { userName = '' } = userInfo ?? {};
  return userName?.split('/')[1] ?? '';
};
// 通用字段配置
export const allColumns = {
  seq: {
    width: 60,
    type: 'seq',
    headerAlign: 'center',
  },
  VmiOrJit: {
    width: 80,
    title: '交易模式',
  },
  TradeCurrency: {
    width: 60,
    title: '币别',
    filters: [
      { label: 'CNY', value: 'CNY' },
      { label: 'USD', value: 'USD' },
    ],
  },
  CurrentTotalPrice: {
    title: '金额',
    sortable: true,
    formatter: ({ cellValue }) => {
      if (!cellValue) {
        return cellValue;
      }
      return XEUtils.commafy(cellValue, { digits: 2 });
    },
  },
  LastTotalPrice: {
    formatter: ({ cellValue }) => {
      if (!cellValue) {
        return cellValue;
      }
      return XEUtils.commafy(cellValue, { digits: 2 });
    },
  },
  CurrentQuantity: {
    title: '数量',
    sortable: true,
    formatter: ({ cellValue }) => {
      if (!cellValue) {
        return cellValue;
      }
      return XEUtils.commafy(cellValue, { digits: 2 });
    },
  },
  CauseAnalysis: {
    title: '原因分析',
    showOverflow: 'tooltip',
    editRender: { name: 'input' },
    params: {
      modifyMth: (params: { fcDataId: string; reason: string }) => fcdatareasoninfosubmit(params),
    },
  },
  CustomerCode: {
    title: '客户',
    showOverflow: 'tooltip',
  },
  CustomerPerson: {
    title: '客服',
    showOverflow: 'tooltip',
  },
  OrgCode: {
    title: '厂区',
    showOverflow: 'tooltip',
  },
  OrgName: {
    title: '厂区',
    showOverflow: 'tooltip',
  },
  ProductCategory: {
    title: '产品种类',
    showOverflow: 'tooltip',
  },
  Project: {
    title: '项目',
    showOverflow: 'tooltip',
  },
  ProjectPhase: {
    title: '项目阶段',
    showOverflow: 'tooltip',
  },
  Custprodno: {
    title: '终端料号',
    showOverflow: 'tooltip',
  },
  InnerMaterialNumber: {
    title: '内部编码',
    showOverflow: 'tooltip',
  },
};
// 获取表头配置
type TGetColumnsParams = Omit<VxeGridPropTypes.Column, 'field'> & { field: string }[];
export const getColumns = (columns: TGetColumnsParams) => {
  // 导出问题，必须加上一个携带children的字段
  return columns.map(item => {
    const { field } = item;
    return merge(cloneDeep(allColumns[field]), item);
  });
};

// 搜索组件配置
const timeDimensionOptions = [
  { text: '周', value: 'week' },
  { text: '月', value: 'month' },
  { text: '年', value: 'year' },
];
const priceOptions = [
  { text: '全部', value: '' },
  { text: '是', value: '是' },
  { text: '否', value: '否' },
];
const projectOptions = [
  { text: 'Ram up', value: 'Ram up' },
  { text: '其他', value: '其他' },
  { text: '将EOL', value: '将EOL' },
  { text: '正常量产', value: '正常量产' },
  { text: '维修需求', value: '维修需求' },
  { text: '量试', value: '量试' },
];
const tradeOptions = [
  { text: '全部', value: '' },
  { text: 'JIT', value: 'JIT' },
  { text: 'VMI', value: 'VMI' },
];

export const commonOptions: TFormItemOption[] = [
  {
    type: EFormItemType.SELECT,
    default: 'week',
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(4, 'day'),
    key: 'date',
    pickerKey: 'dimension',
    attrs: {
      allowClear: false,
    },
    isOverrideDefault: true,
    setDefault: (_, routeQuery) => {
      if (routeQuery.date) {
        return dayjs(routeQuery.date);
      }
      return dayjs().subtract(4, 'day');
    },
  },
  {
    type: EFormItemType.SELECT,
    default: [],
    key: 'orgCode',
    options: [],
    attrs: {
      mode: 'multiple',
      showSearch: true,
      dropdownMatchSelectWidth: false,
    },
    getOptions: async (params = {}) => {
      const { data } = await getOrganization(params);
      const list = data.list ?? data;
      // 将结果处理成下拉菜单的属性
      const handleList = list
        .filter(item => item.org_Level === 4)
        .map(item => {
          // const idValue = item.id || item.ID;
          return {
            value: getFieldValue(item, 'org_Code'),
            text: getFieldValue(item, 'org_Name'),
          };
        });
      // 转换成树形结构数据
      return handleList;
    },
  },
  {
    type: EFormItemType.SELECT,
    default: '',
    key: 'materialIsMore',
    label: '单价大于0.2',
    attrs: {
      buttonStyle: 'solid',
      allowClear: false,
    },
    options: priceOptions,
  },
  {
    type: EFormItemType.SELECT,
    attrs: {
      mode: 'multiple',
      style: 'min-width: 84px',
    },
    isOverrideDefault: true,
    default: [],
    label: '客服名字',
    key: 'customerPerson',
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getCustomerNameBind(params);
      const list = data.list ?? data;
      return [].concat(list.map(item => ({ text: item.CustomerPerson, value: item.CustomerPerson })));
    },
    setDefault: (options, routeQuery) => {
      if (routeQuery.customerPerson) {
        return [routeQuery.customerPerson];
      }
      const name = getUserName();
      const isCustomerPerson = options.map(item => item.value).includes(name);
      return isCustomerPerson ? [name] : [options[0]?.value];
    },
  },
  {
    type: EFormItemType.SELECT,
    attrs: {
      mode: 'multiple',
      style: 'min-width: 84px',
    },
    default: [],
    label: '项目阶段',
    key: 'projectPhase',
    options: projectOptions,
  },
  {
    type: EFormItemType.SELECT,
    default: '',
    label: '交易模式',
    key: 'vmiOrJit',
    options: tradeOptions,
    attrs: {
      allowClear: false,
    },
  },
];
