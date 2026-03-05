import { hiprint as lydcPrint } from '../hiprint/index';
import dayjs from 'dayjs';

// 定义模板映射类型
const templateMap: Record<string, InstanceType<typeof lydcPrint.PrintTemplate>> = {};

type PrintTemplateOptions = ConstructorParameters<typeof lydcPrint.PrintTemplate>[0];
//
export function newLydcPrintPrintTemplate(key: string, options: PrintTemplateOptions) {
  const template = new lydcPrint.PrintTemplate(options);
  templateMap[key] = template;
  return template;
}

export function getLydcPrintPrintTemplate(key: string) {
  return templateMap[key];
}

interface TreeNode {
  fullName?: string;
  id?: string;
  parentId?: string;
  hasChildren?: boolean;
  children?: TreeNode[];
  [key: string]: any;
}

interface FlatNode {
  name?: string;
  code?: string;
  [key: string]: any;
}

/**
 * 扁平化树形结构数据
 * @param data 树形结构数据
 * @param parentName 父级名称（用于递归）
 * @returns 扁平化后的数组
 */
export function flattenTreeWithPrefix(data: TreeNode[], parentName: string = ''): FlatNode[] {
  return data.reduce((result: FlatNode[], node) => {
    const currentName = parentName ? `${parentName}.${node.fullName}` : node.fullName;

    // 添加当前节点（如果有子节点，则只添加父节点）
    if (node.children && node.children.length > 0) {
      // 递归处理子节点
      const children = flattenTreeWithPrefix(node.children, node.fullName);
      result.push(...children);
    } else {
      // 没有子节点的项直接添加
      result.push({
        name: currentName,
        code: node.id,
      });
    }

    return result;
  }, []);
}

/**
 * 将嵌套的字段数组扁平化并转换为指定格式
 * @param {Array} data - 原始嵌套数组
 * @returns {Array} 转换后的扁平数组
 */
export function flattenAndTransformFields(data) {
  const result = [];

  // 递归处理函数
  function processNode(node) {
    if (node.children && Array.isArray(node.children)) {
      // 如果是父节点，递归处理子节点
      node.children.forEach(child => processNode(child));
    } else {
      // 如果是叶子节点，转换为目标格式
      if (node.title && node.options && node.options.field) {
        result.push({
          text: node.title,
          field: node.options.field,
        });
      }
    }
  }

  // 处理所有根节点
  data.forEach(item => processNode(item));

  return result;
}

/**
 *
 * 转换时间戳为格式化日期字符串
 * @param obj 包含时间戳字段的对象
 * @returns 转换后的对象
 */
export function convertTimestampToFormattedDate(obj) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // 判断字段名是否以 Date 或 Time 结尾，且值是否为时间戳（大于等于 0 且为数字）
    if (key.endsWith('Date') && typeof value === 'number' && value >= 0) {
      // 使用 dayjs 转换为 年月日时分的时间
      result[key] = dayjs(value).format('YYYY-MM-DD');
    } else if (key.endsWith('Time') && typeof value === 'number' && value >= 0) {
      // 使用 dayjs 转换为 年月日时分的时间
      result[key] = dayjs(value).format('YYYY-MM-DD  HH:mm');
    } else {
      result[key] = value;
    }
  }

  return result;
}
