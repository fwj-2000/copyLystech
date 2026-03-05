export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    // 使用navigator.clipboard API复制文本
    await navigator.clipboard.writeText(text);
    // 如果没有错误发生，返回true表示复制成功
    return true;
  } catch (err) {
    // 如果发生错误，打印错误并返回false表示复制失败
    console.error('Failed to copy text to clipboard', err);
    return false;
  }
}
