import GapNetProfitSvg from '/@/assets/svg/report/gapNetProfit.svg';
import GapOutputValueSvg from '/@/assets/svg/report/gapOutputValue.svg';

import GapNetProfitPng from '/@/assets/images/report/gapNetProfit.png';
import GapOutputValuePng from '/@/assets/images/report/gapOutputValue.png';

// rate 颜色id
export enum ERateColorId {
  blue = 'paint0_linear_12845_45297',
  purple = 'paint0_linear_12797_33991',
}

// process 颜色id
export enum EProcessColorId {
  blue = 'paint1_linear_12797_33963',
  purple = 'paint1_linear_12797_33977',
}

// 颜色枚举
export enum EColor {
  blue = '#E5F9FF',
  purple = '#E9EEFF',
}

// 颜色-右上角Svg枚举
export enum EColorSvg {
  blue = GapNetProfitSvg,
  purple = GapOutputValueSvg,
}

// 颜色-左下角图片枚举
export enum EColorPng {
  blue = GapNetProfitPng,
  purple = GapOutputValuePng,
}

// 进度条颜色
export const EProgressColor = {
  blue: '#0EA2FF,#76C6FF',
  purple: '#3969D8,#84A8FF',
};
