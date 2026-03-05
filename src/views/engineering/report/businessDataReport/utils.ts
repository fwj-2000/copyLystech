export enum COLUMN_TYPE_ENUM {
  Dim_KEYS_VALUES = 'dim_keys_values',
}

/**
 * 获取表格列配置
 * @param param0
 * @returns
 */
export function getColumnsConfigList({ data, columns }) {
  const allColumns = [];

  // 首先添加序号列和工厂列
  // const seqColumn = {
  //   type: 'seq',
  //   title: '序号',
  //   width: 60,
  //   align: 'center'
  // };

  // const factoryColumn = {
  //   field: 'factory',
  //   title: '工厂',
  //   width: 150,
  //   align: 'center',
  //   className: 'factory-header'
  // };

  // allColumns.push(seqColumn, factoryColumn);

  // 处理数据列，生成两级表头
  columns.forEach(cur => {
    const { field, columnType, getChilrenTitle, getSlots, getChildrenConfig } = cur ?? {};

    if (columnType === COLUMN_TYPE_ENUM.Dim_KEYS_VALUES) {
      // 获取所有维度数据
      const firstFactoryData = data[0];
      const dimList = firstFactoryData[field];

      // 为每个维度创建列组
      dimList.forEach(dimItem => {
        const { dimKey, values } = dimItem;

        // 创建子列（周数列）
        const childrenColumns = values.map(valueItem => {
          const { k } = valueItem;
          const obj = {
            field: `${field}_${dimKey}_${k}`,
            title: typeof getChilrenTitle === 'function' ? getChilrenTitle({ key: k }) : k.slice(-4),
            align: 'center',
            minWidth: 80,
            // sortable: true,
            className: 'week-header',
            ...(typeof getChildrenConfig === 'function' ? getChildrenConfig() : {}),
          };

          if (typeof getSlots === 'function') {
            obj.slots = getSlots();
          }

          return obj;
        });

        // 创建维度父列
        const dimColumn = {
          title: dimKey,
          align: 'center',
          field: dimKey,
          className: 'dim-header',
          children: childrenColumns,
        };

        allColumns.push(dimColumn);
      });
    } else {
      // 非特殊列直接添加
      allColumns.push(cur);
    }
  });

  return allColumns;
}

// 格式化数据
export function transformTableData(originalData) {
  return originalData.map(factory => {
    const row = { factory: factory.factory };

    factory.list.forEach(dim => {
      dim.values.forEach(value => {
        // 创建字段名：list_dimKey_k
        const field = `list_${dim.dimKey}_${value.k}`;
        row[field] = value.v;
      });
    });

    return row;
  });
}

// 过滤掉不属于当前流程的数据
export function filteredData(originalData) {
  return originalData.map(factory => {
    // 深拷贝对象
    const filteredFactory = JSON.parse(JSON.stringify(factory));
    // 过滤list中values为空数组的项
    filteredFactory.list = filteredFactory.list.filter(item => item.values && item.values.length > 0);
    return filteredFactory;
  });
}
