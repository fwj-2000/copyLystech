import { isEmpty, isFunction } from 'lodash-es';

// 返回字段有大驼峰有小驼峰，统一字段key
export const getFieldValue = (info, key) => {
  const upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
  return info[key] ?? info[upperCaseKey];
};

// 构建组织结构下拉菜单项
export const buildTree = (list: any) => {
  const map = new Map();
  const roots: any = [];

  // 遍历所有元素，并构建一个临时的 Map
  list.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  // 再次遍历所有元素，设置子节点
  list.forEach(item => {
    const parent = map.get(item.parentId);
    if (parent === undefined) {
      // 如果找不到父节点，则认为该节点是根节点
      roots.push(map.get(item.id));
    } else {
      // 否则，将该节点添加到其父节点的 children 数组中
      parent.children.push(map.get(item.id));
    }
  });

  return roots;
};

// 初始化配置信息
export const getOptionList = async ({ options, routeQuery, initParams, setSearchFormValue }) => {
  const resultList = await Promise.allSettled(
    options.map((item: any) => {
      if (isFunction(item?.getOptions)) {
        return item.getOptions(initParams);
      }
      return [];
    }),
  );
  return resultList.map((item: any, idx) => {
    // 赋予默认值
    const { key, isOverrideDefault = false, default: defaultValue, setDefault } = options[idx] as any;
    setSearchFormValue(key, defaultValue);
    if (isOverrideDefault) {
      // 覆盖默认值
      if (isFunction(setDefault)) {
        setSearchFormValue(key, setDefault(item.value, routeQuery));
      } else {
        const firstValue = item.value?.[0].value ?? '';
        setSearchFormValue(key, firstValue);
      }
    }
    if (item.status !== 'rejected') {
      if (isEmpty(item.value)) {
        return options[idx];
      }
      return {
        ...options[idx],
        options: item.value,
      };
    }
    return {
      ...options[idx],
      options: item.status === 'rejected' ? [] : item.value,
    };
  });
};
