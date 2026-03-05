export function splitArrayIntoChunks(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    // 使用 slice 方法截取从 i 到 i + chunkSize 的部分
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}
