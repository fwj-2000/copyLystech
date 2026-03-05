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
