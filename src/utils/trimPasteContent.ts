// 正则表达式：匹配开头和结尾的空白字符
const LEADING_WHITESPACE_REGEX = /^[\s\u00A0\u2000-\u200A\u2028\u2029\uFEFF]+/;
const TRAILING_WHITESPACE_REGEX = /[\s\u00A0\u2000-\u200A\u2028\u2029\uFEFF]+$/;

/**
 * 根据粘贴位置确定需要进行的trim操作类型
 * @param isAtStart 是否在文本开头
 * @param isAtEnd 是否在文本结尾
 * @param isSelection 是否是替换选中内容
 * @param inputValue 输入框当前值
 * @param selectionStart 选中起始位置
 * @param selectionEnd 选中结束位置
 * @returns 需要trim的操作类型
 */
function determineTrimStrategy(isAtStart: boolean, isAtEnd: boolean, isSelection: boolean): { needTrimStart: boolean; needTrimEnd: boolean } {
  // 对于开头、结尾或全选的情况，策略较为简单
  if ((isAtStart && isAtEnd) || isSelection) {
    return { needTrimStart: true, needTrimEnd: true };
  }

  if (isAtStart) {
    return { needTrimStart: true, needTrimEnd: false };
  }

  if (isAtEnd) {
    return { needTrimStart: false, needTrimEnd: true };
  }

  return {
    needTrimStart: false,
    needTrimEnd: false,
  };
}

/**
 * 根据trim策略处理粘贴文本
 * @param pasteText 原始粘贴文本
 * @param needTrimStart 是否需要去除开头空白
 * @param needTrimEnd 是否需要去除结尾空白
 * @returns 处理后的文本
 */
function trimPasteText(pasteText: string, needTrimStart: boolean, needTrimEnd: boolean): string {
  let trimmedText = pasteText;

  if (needTrimStart) {
    trimmedText = trimmedText.replace(LEADING_WHITESPACE_REGEX, '');
  }

  if (needTrimEnd) {
    trimmedText = trimmedText.replace(TRAILING_WHITESPACE_REGEX, '');
  }
  return trimmedText;
}

/**
 * 更新输入框值并处理相关事件
 * @param target 输入框元素
 * @param inputValue 当前输入框值
 * @param selectionStart 选中起始位置
 * @param selectionEnd 选中结束位置
 * @param processedText 处理后的文本
 */
function updateInputValue(
  target: HTMLInputElement | HTMLTextAreaElement,
  inputValue: string,
  selectionStart: number,
  selectionEnd: number,
  processedText: string,
): void {
  const newValue = [inputValue.substring(0, selectionStart), processedText, inputValue.substring(selectionEnd)].join('');

  if (target.tagName === 'INPUT') {
    // 将所有换行符、回车符等转换为空格，模仿原生黏贴的处理
    target.value = newValue.replaceAll(/[\n\v]/g, ' ');
  } else if (target.tagName === 'TEXTAREA') {
    target.value = newValue;
  }

  // 设置光标位置
  const newCursorPosition = selectionStart + processedText.length;
  target.setSelectionRange(newCursorPosition, newCursorPosition);

  // 触发事件
  target.dispatchEvent(new Event('input', { bubbles: true }));

  // 触发change事件以确保表单验证等功能正常工作
  setTimeout(() => {
    target.dispatchEvent(new Event('change', { bubbles: true }));
  }, 0);
}

/**
 * 黏贴到`input`、`textarea`时，根据粘贴位置智能处理空白字符
 * - 在文本开头粘贴：去除粘贴内容开头的空白字符
 * - 在文本结尾粘贴：去除粘贴内容结尾的空白字符
 * - 在文本中间粘贴：根据上下文智能处理空白字符
 * @param event 粘贴事件对象
 */

export function trimPasteContent(event: ClipboardEvent): void {
  // 快速检查事件和目标元素
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  if (!target?.tagName || target.tagName !== 'INPUT') {
    return;
  }

  // 获取粘贴的文本
  const pasteText = event.clipboardData?.getData?.('text/plain') || '';
  if (!pasteText) {
    return; // 空文本无需处理
  }

  // 获取当前输入框的值和光标位置
  const inputValue = target.value;
  const selectionStart = target.selectionStart || 0;
  const selectionEnd = target.selectionEnd || 0;

  // 计算粘贴位置相关标志
  const isAtStart = selectionStart === 0;
  const isAtEnd = selectionEnd === inputValue.length;
  const isSelection = selectionStart !== selectionEnd;

  // 确定trim策略
  const { needTrimStart, needTrimEnd } = determineTrimStrategy(isAtStart, isAtEnd, isSelection);

  // 处理粘贴文本
  const processedText = trimPasteText(pasteText, needTrimStart, needTrimEnd);

  // 如果文本有变化，则阻止默认粘贴并手动设置值
  if (processedText !== pasteText) {
    updateInputValue(target, inputValue, selectionStart, selectionEnd, processedText);
    event.preventDefault();
  }
}
