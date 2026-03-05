import Decimal from 'decimal.js';
// 常量提取
const COLOR_LIST = ['header-orange', 'header-blue', 'header-skeyblue', 'header-green', 'header-red'];
const DEFAULT_WIDTH = 130;
// 工具函数
// 根据分组获取颜色
const getColorByGroup = group => {
  const groupNum = Number(group);
  if (Number.isNaN(groupNum)) return '';
  const colorIndex = (groupNum - 1) % COLOR_LIST.length;
  return COLOR_LIST[colorIndex];
};
// 检测值是否超出公差范围
const isOutOfTolerance = (value, standard, upper, lower) => {
  const numValue = Number(value);
  const numStandard = Number(standard);
  const numUpper = Number(upper);
  const numLower = Number(lower);
  if ([numValue, numStandard, numUpper, numLower].some(Number.isNaN)) {
    return false;
  }
  const upperLimit = Decimal(numStandard).plus(Decimal(numUpper));
  const lowerLimit = Decimal(numStandard).plus(Decimal(numLower));
  return numValue > Number(upperLimit) || numValue < Number(lowerLimit);
};

// 处理第一级子列
const processFirstLevelColumn = children1 => ({
  ...children1,
  children: children1.children?.map(children2 => processSecondLevelColumn(children2, children1)),
});
// 处理第二级子列
const processSecondLevelColumn = (children2, children1) => ({
  ...children2,
  children: children2.children?.map(children3 => processThirdLevelColumn(children3, children1, children2)),
});
// 处理第三级子列（最内层）
const processThirdLevelColumn = (children3, children1, children2) => {
  const standardValue = Number(children1.title);
  const upperTolerance = Number(children2.title);
  const lowerTolerance = Number(children3.title);
  const className = ({ row }) => {
    const value = row[children3.field];
    //  基于是否超出公差范围 动态赋予样式
    return isOutOfTolerance(value, standardValue, upperTolerance, lowerTolerance) ? 'cell-red' : '';
  };
  return {
    ...children3,
    width: DEFAULT_WIDTH,
    className,
  };
};

// 处理分组列
export const processGroupColumn = item => {
  const baseConfig = {
    ...item,
    width: DEFAULT_WIDTH,
    headerClassName: getColorByGroup(item.group),
  };
  if (item.children?.length > 0) {
    return {
      ...baseConfig,
      children: item.children.map(child => processFirstLevelColumn(child)),
    };
  }
  return baseConfig;
};
