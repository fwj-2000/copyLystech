/**
 * @description 本文件方法，用于在`vxeTable`中，处理黏贴料号和工厂的相关操作
 */

import { getPartNumberFactoryList, getPartNumberFactoryBulkList } from '/@/api/basicData/factory';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { nextTick } from 'vue';

const { createMessage } = useMessage();
const { t } = useI18n();

/**
 * 函数参数类型定义
 */
export type FunctionParams = {
  /** 列信息 */
  cols: Array<{ field: string }>;
  /** 行数据 */
  rows: Array<any>;
  /** 字段配置 */
  fields: {
    /** 料号字段 */
    partNumberField: string;
    /** 表格工厂value字段 */
    factoryField: string;
    /** 表格工厂名称显示字段 */
    factoryNameField: string;
    /** 工厂value取值字段 */
    factoryValueField: string;
    /** 工厂名称取值字段 */
    factoryLabelField?: string;
    /** 工厂名称格式化处理 */
    factoryNameFormat?: Array<string> | ((factoryInfo: any) => string);
  };
  /** 黏贴内容，如果没有传入，取`rows`中对应的内容 */
  pasteCells?: Array<Array<string>>;
  /** 黏贴接口额外的请求参数 */
  otherParams?: any;
  /** 获取复制信息之后，用于黏贴的回调函数 */
  afterPaste?: (params: { row: any; rows: Array<any>; col: any; pasteCell: string | [string, string]; factoryDetail: any }) => void;
};

/**
 * 判断黏贴的工厂内容是否与返回的工厂信息相等
 * @param factoryInfo
 * @param keyWord
 * @returns
 */
function factoryEqualTo(factoryInfo: any, keyWord: string) {
  return factoryInfo.Code === keyWord || factoryInfo.Name === keyWord || factoryInfo.Id === keyWord || `${factoryInfo.Code}/${factoryInfo.Name}` === keyWord;
}

/**
 * 根据配置，格式化黏贴的工厂名称
 */
function formatFactoryName(factoryInfo: any, fields: FunctionParams['fields']) {
  if (!factoryInfo) {
    return '';
  }

  const { factoryLabelField, factoryNameFormat } = fields;
  if (Array.isArray(factoryNameFormat)) {
    return factoryNameFormat
      .map((item, index) => {
        return index % 2 === 0 ? factoryInfo[item] : item;
      })
      .filter(Boolean)
      .join('');
  }
  if (typeof factoryNameFormat === 'function') {
    return factoryNameFormat(factoryInfo);
  }
  if (factoryLabelField) {
    return factoryInfo[factoryLabelField];
  }

  return '';
}

/** 工厂黏贴处理 */
async function pasteFactorys(params: FunctionParams) {
  const { cols, fields, rows, pasteCells, afterPaste } = params;

  // 判断是否存在目标字段
  const targetIndex = cols.findIndex((item: any) => item.field === fields.factoryField);
  if (targetIndex == -1) return false;

  // 搜集复制的内容
  const pasteContents = Array.isArray(pasteCells) ? pasteCells.map(item => item[targetIndex]) : rows.map((item: any) => item[fields.factoryField]);

  // 获取结果进行匹配复制处理
  return getPartNumberFactoryList({ factorys: [...new Set(pasteContents)], ...(params.otherParams ?? {}) }).then(res => {
    if (!Array.isArray(res.data)) {
      return false;
    }
    // 缓存记录
    const map = new Map<string, any>();
    // 循环便利黏贴值
    pasteContents.forEach((item, index) => {
      let target: any = null;
      if (map.has(item)) {
        target = map.get(item);
      } else {
        target = res.data.find((resItem: any) => factoryEqualTo(resItem, item));
        map.set(item, target);
      }
      !target && createMessage.warn(t('common.factoryNotExist', [item]));
      const row = rows[index];
      if (row) {
        // 置空再赋值，避免在前后`[fields.factoryField]`值一样的情况，改变了`fields.factoryNameField`的值，没有引发重新渲染的显示的情况
        row[fields.factoryField] = '';
        row[fields.factoryNameField] = '';
        nextTick(() => {
          Object.assign(row, {
            [fields.factoryField]: target?.[fields.factoryValueField] || '',
            [fields.factoryNameField]: formatFactoryName(target, fields),
          });
        });
      }
      typeof afterPaste === 'function' && afterPaste({ row: rows[index], rows, col: cols[targetIndex], pasteCell: item, factoryDetail: target });
    });
    return true;
  });
}

/**
 * 获取黏贴的内容
 * @params cols 列信息
 * @params rows 行数据
 * @params pasteCells 黏贴内容
 * @params partNumberIndex 料号字段索引
 * @params factoryIndex 工厂字段索引
 * @returns 黏贴的内容，格式为`Array<[料号，工厂Code或者Name]>`
 */
function getPasteContents(
  rows: any,
  pasteCells: Array<Array<string>> | undefined,
  partNumberIndex: number,
  factoryIndex: number,
  fields: FunctionParams['fields'],
): Array<[string, string]> {
  if (pasteCells === void 0) {
    return rows.map((item: any) => [item[fields.partNumberField], item[fields.factoryField]] as [string, string]);
  }

  // 当`partNumberIndex`或者`factoryIndex`不等于`-1`时，从`pasteCells`获取对应的值；
  // 当`partNumberIndex`等于`-1`时，从`rows`中获取对应的值；
  // 当`factoryIndex`等于`-1`时，从`rows`中获取对应的值；
  // 最后返回的格式为`Array<[料号，工厂Code或者Name]>`

  const pasteContents: Array<[string, string]> = [];
  if (partNumberIndex !== -1 && factoryIndex !== -1) {
    pasteContents.push(...pasteCells.map(item => [item[partNumberIndex], item[factoryIndex]] as [string, string]));
  } else if (partNumberIndex !== -1) {
    pasteContents.push(...pasteCells.map((item, index) => [item[partNumberIndex], rows[index][fields.factoryField]] as [string, string]));
  } else if (factoryIndex !== -1) {
    pasteContents.push(...pasteCells.map((item, index) => [rows[index][fields.partNumberField], item[factoryIndex]] as [string, string]));
  }
  return pasteContents;
}

/** 黏贴了工厂字段，并且同时数据存在料号 */
async function pastePartNumberAndFactory(params: FunctionParams) {
  const { cols, fields, rows, pasteCells, afterPaste } = params;

  const partNumberIndex = cols.findIndex((item: any) => item.field === fields.partNumberField);
  const factoryIndex = cols.findIndex((item: any) => item.field === fields.factoryField);

  if (partNumberIndex === -1 && factoryIndex === -1) {
    return false;
  }

  const contents = getPasteContents(rows, pasteCells, partNumberIndex, factoryIndex, fields);
  const list = [...new Set(contents.map(item => item.join(',')))].map(item => item.split(','));
  return getPartNumberFactoryBulkList(list as Array<[string, string]>).then(res => {
    if (!Array.isArray(res.data)) {
      return false;
    }
    const colIndex = factoryIndex === -1 ? partNumberIndex : factoryIndex;
    contents.forEach((item, index) => {
      const target = res.data.find((resItem: any) => resItem.PartNumber === item[0] && factoryEqualTo(resItem, item[1]));
      !target && createMessage.warn(t('common.partNumberFactoryNotExist', item));
      const row = rows[index];
      if (row) {
        // 置空再赋值，避免在前后`[fields.factoryField]`值一样的情况，改变了`fields.factoryNameField`的值，没有引发重新渲染的显示的情况
        row[fields.factoryField] = '';
        row[fields.factoryNameField] = '';
        nextTick(() => {
          Object.assign(row, {
            [fields.factoryField]: target?.[fields.factoryValueField] || '',
            [fields.factoryNameField]: formatFactoryName(target, fields),
          });
        });
      }
      typeof afterPaste === 'function' && afterPaste({ row: rows[index], rows, col: cols[colIndex], pasteCell: item, factoryDetail: target });
    });
    return true;
  });
}

/**
 * 在vxeTable中处理黏贴工厂的操作，及在料号限制，黏贴工厂的校验及赋值处理
 * @param {FunctionParams} params - 函数参数对象
 * @param {Array<{ field: string }>} params.cols - 表格列信息数组
 * @param {Array<any>} params.rows - 表格行数据数组
 * @param {Object} params.fields - 字段配置对象
 * @param {string} params.fields.partNumberField - 料号字段名
 * @param {string} params.fields.factoryField - 表格工厂value字段名
 * @param {string} params.fields.factoryNameField - 表格工厂名称显示字段名
 * @param {string} params.fields.factoryValueField - 工厂value取值字段名
 * @param {string} params.fields.factoryLabelField - 工厂名称取值字段名
 * @param {Array<Array<string>>} [params.pasteCells] - 可选，黏贴内容，如果没有传入，取rows中对应的内容
 * @param {any} [params.otherParams] - 可选，黏贴接口额外的请求参数
 * @param {Function} [params.afterPaste] - 可选，获取复制信息之后，用于黏贴的回调函数
 * @returns {Promise<Array<any>>} 处理结果的Promise数组
 * @example
 * // 基本使用示例
 * pastePartNumberFactorys({
 *   cols: [{ field: 'partNumber' }, { field: 'factory' }, { field: 'factoryName' }],
 *   rows: [{ partNumber: 'PN001', factory: '', factoryName: '' }],
 *   fields: {
 *     partNumberField: 'partNumber',
 *     factoryField: 'factory',
 *     factoryNameField: 'factoryName',
 *     factoryValueField: 'Id',
 *     factoryLabelField: 'Name'
 *   }
 * });
 */
export async function pastePartNumberFactorys(params: FunctionParams) {
  const { cols, fields, rows, pasteCells } = params;

  const factoryIndex = cols.findIndex((item: any) => item.field === fields.factoryField);

  if (factoryIndex === -1) {
    return false;
  }

  // 根据料号是否存在值，判断是单纯黏贴工厂，还是黏贴工厂时需要考虑料号的限制情况
  const { onlyFactoryRows, onlyFactoryPasteCells, withPartNumberRows, withPartNumberPasteCells } = rows.reduce(
    (obj, item, index) => {
      if (item[fields.partNumberField]) {
        obj.withPartNumberRows.push(item);
        pasteCells && obj.withPartNumberPasteCells.push(pasteCells[index]);
      } else {
        obj.onlyFactoryRows.push(item);
        pasteCells && obj.onlyFactoryPasteCells.push(pasteCells[index]);
      }
      return obj;
    },
    { onlyFactoryRows: [], onlyFactoryPasteCells: [], withPartNumberRows: [], withPartNumberPasteCells: [] },
  );

  return Promise.all([
    onlyFactoryRows.length > 0
      ? pasteFactorys({ ...params, rows: onlyFactoryRows, pasteCells: pasteCells ? onlyFactoryPasteCells : undefined })
      : Promise.resolve({}),
    withPartNumberRows.length > 0
      ? pastePartNumberAndFactory({ ...params, rows: withPartNumberRows, pasteCells: pasteCells ? withPartNumberPasteCells : undefined })
      : Promise.resolve({}),
  ]);
}
