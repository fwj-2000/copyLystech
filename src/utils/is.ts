import { isEqualWith, sortBy, every, isFinite, toNumber } from 'lodash-es';
import dayjs from 'dayjs';

const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object');
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }

  return false;
}

export function arraysEqual(arr1, arr2) {
  // 首先检查数组长度是否相等
  if (arr1.length !== arr2.length) {
    return false;
  }

  // 对数组进行排序，确保对象的顺序不影响比较结果
  const sortedArr1 = sortBy(arr1, o => o.name);
  const sortedArr2 = sortBy(arr2, o => o.name);

  // 使用lodash的isEqual函数来比较两个数组的每个元素
  return isEqualWith(sortedArr1, sortedArr2, (a, b) => {
    // 这里可以自定义比较逻辑，比如比较对象属性
    if (isObject(a) && isObject(b)) {
      // 比较对象的name属性是否相等
      return a.name === b.name;
    }
    // 对于其他类型的值，使用默认的比较逻辑
    return undefined;
  });
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}

export function isExist(val: unknown): val is null | undefined {
  return !isNullOrUnDef(val);
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number');
}

export function isHttpUrl(url?: string): boolean {
  if (!url) {
    return false;
  }
  // 使用正则表达式测试URL是否以http:// 或 https:// 开头
  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

/**
 * 检查当前运行环境是否为Mac OS。
 *
 * 这个函数通过检查navigator.userAgent字符串来判断当前运行环境。
 * 如果userAgent字符串中包含"macintosh"或"mac os x"（不区分大小写），则认为当前环境是Mac OS。
 *
 * @returns {boolean} 如果当前环境是Mac OS，返回true，否则返回false。
 */
export function isMacOs(): boolean {
  const macRegex = /macintosh|mac os x/i;
  return macRegex.test(navigator.userAgent);
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean');
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp');
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window');
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName;
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map');
}

export function formatDate(time: number | string, format = 'YYYY-MM-DD') {
  try {
    const date = dayjs(time);
    if (!date.isValid()) {
      throw new Error('Invalid date');
    }
    return date.format(format);
  } catch (error) {
    console.error(`Error formatting date: ${error}`);
    return time;
  }
}

export function formatDateTime(time: number | string) {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss');
}

export function isDate(value: any): value is Date {
  return value instanceof Date;
}

export function isDayjsObject(value: any): value is dayjs.Dayjs {
  return dayjs.isDayjs(value);
}

export function getFirstNonNullOrUndefined<T>(...values: (null | T | undefined)[]): T | undefined {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

export function isUrl(path: string): boolean {
  const reg = /^http(s)?:\/\/([\w-]+(\.)?)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  return reg.test(path);
}

export function bindMethods<T extends object>(instance: T): void {
  const prototype = Object.getPrototypeOf(instance);
  const propertyNames = Object.getOwnPropertyNames(prototype);

  propertyNames.forEach(propertyName => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
    const propertyValue = instance[propertyName as keyof T];

    if (typeof propertyValue === 'function' && propertyName !== 'constructor' && descriptor && !descriptor.get && !descriptor.set) {
      instance[propertyName as keyof T] = propertyValue.bind(instance);
    }
  });
}

/**
 *
 * @param arr 需要校验数字的几个
 * @returns true 校验成功 false 校验失败
 * @description 校验数组中是否都是数字或者数字字符串
 */
export function isComputableArray(arr) {
  // 首先检查输入是否为数组
  if (!isArray(arr)) {
    return false;
  }

  // 检查数组中的每个元素
  return every(arr, item => {
    // 允许数字和数字字符串
    if (isNumber(item) && isFinite(item)) {
      return true;
    }

    // 检查数字字符串
    if (isString(item)) {
      // 使用lodash的toNumber尝试转换，并检查是否为NaN
      const num = toNumber(item);
      return isFinite(num) && !Number.isNaN(num);
    }

    // 其他情况都不允许
    return false;
  });
}

/**
 * 判断字符串是否为富文本内容
 * @param {string} str - 要检查的字符串
 * @returns {boolean} - 如果是富文本返回true，否则返回false
 */
export function isRichText(str) {
  if (typeof str !== 'string') return false;

  // 空字符串不算富文本
  if (str.trim() === '') return false;

  // 检查常见的HTML标签
  const htmlTagRegex = /<[a-z][\s\S]*>/i;
  if (!htmlTagRegex.test(str)) return false;

  // 检查常见的富文本特征
  const richTextIndicators = [
    /<[a-z]+[^>]*class=["'][^"']*rich-text/i, // 包含rich-text类
    /<[a-z]+[^>]*style=["'][^"']*(font-size|color|text-align)/i, // 包含样式
    /<(p|div|span|h[1-6]|strong|em|ul|ol|li|table|tr|td)/i, // 常见富文本标签
    /<img[^>]*>/i, // 图片
    /<a[^>]*href=["'][^"']*["'][^>]*>/i, // 链接
    /<[^>]*data-rich-text=["']true["'][^>]*>/i, // 自定义属性标记
  ];

  return richTextIndicators.some(regex => regex.test(str));
}
