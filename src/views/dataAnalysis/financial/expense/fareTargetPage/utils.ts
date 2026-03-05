export const extractAnalysisFields = columns => {
  const result: string[] = [];
  function traverse(items) {
    for (const item of items) {
      // 检查当前字段是否包含 "_分析" 或 "_对策"
      if (item.field && (item.field.includes('_分析') || item.field.includes('_对策'))) {
        result.push(item.field);
      }

      // 递归遍历子节点
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  }

  traverse(columns);
  return result;
};

/**
 * 筛选包含 "_分析" 或 "_对策" 开头的字段  或 "DimesionType_"开头的字段
结尾的字段
 * @param {Object} item - 包含所有字段的对象
 * @returns {Object} - 筛选后的对象，仅包含符合条件的字段
 */
export const filterAnalysisAndStrategy = data => {
  return data.map(item => {
    const result = {};
    // 遍历所有属性，筛选符合条件的key
    Object.entries(item).forEach(([key, value]) => {
      if (key.endsWith('_分析') || key.endsWith('_对策') || key.startsWith('DimesionType_')) {
        result[key] = value;
      }
    });

    return result;
  });
};
/**
 *
 * @param data 原始数据
 * @param orgCode 组织编码
 * @returns 处理后的数组
 */
export const processData = (data, orgCode) => {
  const result: Record<string, any>[] = [];
  // 字段名映射表：旧字段名 → 新字段名（核心修改点）
  const fieldMap = {
    DimesionType_末级科目: 'finalSubject',
    DimesionType_对应管报损益维度: 'managementReport',
  };

  data.forEach(item => {
    // 1. 按映射表生成新的固定字段数据
    const fixedData = {};
    Object.entries(fieldMap).forEach(([oldKey, newKey]) => {
      fixedData[newKey] = item[oldKey]; // 旧key的值赋值给新key
    });

    // 2. 提取所有动态周度前缀（逻辑不变，支持任意周度）
    const weekPrefixes = [
      ...new Set(
        Object.keys(item)
          .filter(key => /^\d{4}WK\d{2}_(分析|对策)$/.test(key)) // 匹配周度字段格式
          .map(key => key.split('_')[0]), // 提取前缀（如2024WK47）
      ),
    ];

    // 3. 按周度拆分生成新对象（继承新的固定字段）
    weekPrefixes.forEach(prefix => {
      result.push({
        ...fixedData, // 继承固定维度
        dateStr: prefix,
        // [`${prefix}_分析`]: item[`${prefix}_分析`], // 当前周度分析
        // [`${prefix}_对策`]: item[`${prefix}_对策`], // 当前周度对策
        reason: item[`${prefix}_分析`] ?? '',
        measure: item[`${prefix}_对策`] ?? '',
        orgCode,
      });
    });
  });

  return result;
};
