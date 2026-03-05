import { isNullOrUnDef } from '/@/utils/is';

export function checkWidthMatch(str, width) {
  if (isNullOrUnDef(str)) return true;
  if (str.includes('YPL0000')) {
    return true;
  }

  // 将宽度转换为字符串
  const widthStr = String(width);

  // 匹配字符串末尾连续数字（可处理类似 -F、-XX 后缀）
  // 示例可匹配：0061（来自 "600-PST50130-0061" 或 "600-PST50130-0061-F"）
  const match = str.match(/(\d+)(?!.*\d)/);
  if (!match) return false;

  const digits = match[1];

  // 去除前导零
  const trimmed = digits.replace(/^0+/, '');

  // 数字完全匹配
  return trimmed === widthStr;
}
