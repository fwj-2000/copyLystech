export function findNodeById(data, targetId) {
  // 使用深度优先搜索遍历树
  function dfs(node) {
    // 如果当前节点匹配，直接返回
    if (node.id === targetId) {
      return node;
    }

    // 如果有子节点，继续搜索
    if (node.children && node.children.length > 0) {
      for (let child of node.children) {
        const result = dfs(child);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  // 遍历所有根节点
  for (let node of data) {
    const result = dfs(node);
    if (result) {
      return result;
    }
  }

  return null;
}
