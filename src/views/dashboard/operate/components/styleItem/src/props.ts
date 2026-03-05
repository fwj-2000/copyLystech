import { SearchFormValueType, PopoverInfoList } from '/@/views/dashboard/operate/types';

type ListItem = {
  label: string;
  value: number | string;
  params?: Object; // 可点击携带的参数配置
};

export const valueListProps = {
  list: {
    type: Array as PropType<ListItem[]>,
    default: () => [],
  },
  valueClickable: {
    type: Boolean,
    default: false,
  },
  valueClickMth: {
    type: Function as PropType<(params?: Object) => void>,
    default: () => {},
  },
};

export const spinContentProps = {
  ...valueListProps,
  loading: {
    type: Boolean,
    default: false,
  }, // 加载中
  isEmptyData: {
    type: Boolean,
    default: false,
  }, // 空数据
  isRequestError: {
    type: Boolean,
    default: false,
  }, // 数据加载异常
  showList: {
    type: Boolean,
    default: true,
  }, // 是否展示数值图例
};

export const compoHeadProps = {
  title: {
    type: String,
    default: '',
  },
  mainPage: {
    type: String,
    default: '',
  },
  clickMth: {
    type: Function as PropType<(path: String, params?: Object) => void>,
    default: () => {},
  },
};

export const groupItemDataProps = {
  component: null,
  trendUrl: {
    type: String,
    default: '', // 趋势页路由
  },
  info: {
    type: Object,
    default: () => ({}),
  },
  listData: {
    type: Array,
    default: [],
  },
  extraInfo: {
    type: Object,
    default: () => ({}),
  },
};

export const groupItemHeadProps = {
  groupName: {
    type: String,
    default: '',
  },
  groupValue: {
    type: String,
    default: '',
  }, // 分组标题数据值的key
  title: {
    type: String,
    default: '',
  },
  trendUrl: {
    type: String,
    default: '', // 趋势页路由
  },
  orgCode: {
    type: String,
    default: '',
  },
  popoverInfoList: {
    type: Array as PropType<PopoverInfoList[]>,
    default: () => [],
  },
  searchFormValue: {
    type: Object as PropType<SearchFormValueType>,
    default: () => ({}),
  },
};
