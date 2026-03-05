export function getEncryptionParam(url: string): string | null {
  // 从 URL 中提取查询字符串部分
  const queryString = url.split('?')[1];
  if (!queryString) {
    return null;
  }

  // 分割查询字符串为键值对数组
  const params = queryString.split('&');

  // 遍历键值对数组，查找 'encryption' 参数
  for (let param of params) {
    const [key, value] = param.split('=');
    if (key === 'encryption') {
      return decodeURIComponent(value);
    }
  }

  // 如果没有找到 'encryption' 参数，返回 null
  return null;
}
