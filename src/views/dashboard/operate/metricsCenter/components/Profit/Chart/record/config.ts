import type { PropType } from 'vue';

import { EColor } from '../config';

export const propOptions = {
  /**
   * 颜色类型
   */
  colorType: {
    type: String as PropType<keyof typeof EColor>,
    default: 'blue',
  },
  /**
   * 当前月份
   * @type { String }
   */
  currentMonth: {
    type: String,
    required: true,
  },
  /**
   * 关键字
   * @type { String }
   */
  keyWord: {
    type: String,
    required: true,
  },
  /**
   * 当前月份值
   * @type { Number }
   */
  currentMonthValue: {
    type: Number,
    required: true,
  },
  /**
   * 所有月份总和数据
   * @type { Number }
   */
  totalValue: {
    type: Number,
    required: true,
  },
  /**
   * 不包含当前月份的总和数据
   * @type { Number }
   */
  reduceValue: {
    type: Number,
    required: true,
  },
  /**
   * 全部数据
   * @type { Object }
   */
  info: {
    type: Object as PropType<any>,
    required: true,
  },
  /**
   * 是否显示为红色百分比
   * @type { Boolean }
   */
  isShowRedRate: {
    type: Boolean,
    default: false,
  },
};
