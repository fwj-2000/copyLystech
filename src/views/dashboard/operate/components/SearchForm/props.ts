import { Dayjs } from 'dayjs';
import { SearchFormValueType } from '/@/views/dashboard/operate/types';

export const searchFormProps = {
  isRangePicker: {
    type: Boolean,
    default: false,
  }, // 是否展示范围选择
  noPermission: {
    type: Boolean,
    default: false,
  },
  isDateDisabled: {
    type: Boolean,
    default: false,
  }, // 是否禁用日期选择
  organizeKeyword: {
    type: String,
    default: '1',
  }, // 查询组织架构条件
  showTimeDimension: {
    type: Boolean,
    default: true,
  }, // 是否展示时间维度
  showOrganizeTreeSelect: {
    type: Boolean,
    default: false,
  }, // 是否展示组织树型选择
  showPeriodDimension: {
    type: Boolean,
    default: false,
  }, // 是否展示工作日和非工作日
  searchFormValue: {
    default: {} as SearchFormValueType,
  },
  defaultCatheData: {
    default: {} as any,
  },
  isHideBG: {
    type: Boolean,
    default: false, // 是否隐藏bu层级
  },
  isHideBU: {
    type: Boolean,
    default: false, // 是否隐藏bu层级
  },
  isFetchAllOrgCode: {
    type: Boolean,
    default: false, // 是否获取所有组织机构
  },
  afterGetOrganizationMth: {
    type: Function as PropType<(res: any) => void>,
    default: () => {},
  }, // 获取组织结构之后执行的方法
  disabledDate: {
    type: Function as PropType<(current: Dayjs) => boolean>,
    default: () => false,
  }, // 禁用日期
  getOrganizationApi: {
    type: Function as PropType<(params: any) => Promise<any>>,
  },
  treeAttrs: {
    type: Object,
    default: () => ({}),
  },
};
