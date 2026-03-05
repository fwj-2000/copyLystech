import { copyTextToClipboard } from '/@/hooks/web/useCopyToClipboard';

export { getDateRangeDim } from '/@/views/dataAnalysis/utils';
export { ETimeDimension } from '/@/views/dataAnalysis/types';

export enum COLUMN_TYPE_ENUM {
  KEYS_VALUES = 'keys_values',
  WEEKS = 'weeks',
  TOTAL = 'total',
}

export enum GENERAL_ENUM {
  UN_COMPLETE = 'un_',
}

/**
 * 获取表格列配置
 * @param param0
 * @returns
 */
export function getColumnsConfigList({ data, columns, query }: { data: any; columns: Array<any>; query: { startDim: string; endDim: string } }) {
  const allColumns: Array<any> = columns.reduce((pre, cur) => {
    const { field, columnType, getChilrenTitle, getSlots, getChildrenConfig } = cur ?? {};
    if (columnType === COLUMN_TYPE_ENUM.KEYS_VALUES) {
      const fieldStr = field as string;
      // 如果是指标，获取指标最多的一项，用于创建表头
      const firstList = field === 'TitleList' ? getMostTitleList(data)[fieldStr] : data[0][fieldStr];
      const columns = firstList.map((item: any) => {
        const obj = {
          ...cur,
          field: `${fieldStr}_${item.keys}`,
          title: typeof getChilrenTitle === 'function' ? getChilrenTitle({ key: item.keys }) : item.keys,
          align: 'left',
          minWidth: 80,
          ...(typeof getChildrenConfig === 'function' ? getChildrenConfig(cur, item) : {}),
        };
        if (typeof getSlots === 'function') {
          obj.slots = getSlots();
        }
        return obj;
      });
      // cur.children = columns;
      return pre.concat(columns);
    } else if (columnType === COLUMN_TYPE_ENUM.WEEKS) {
      let weeks = getWeeks(query.startDim, query.endDim);
      const firstList = data[0][field];
      if (weeks.length === 0) {
        weeks = firstList.map((item: any) => item.keys);
      }
      const columns = weeks.map((item: string) => {
        const obj = {
          ...cur,
          field: `${field}_${item}`,
          title: typeof getChilrenTitle === 'function' ? getChilrenTitle({ key: item }) : item,
          align: 'left',
          minWidth: 80,
          ...(typeof getChildrenConfig === 'function' ? getChildrenConfig() : {}),
        };
        if (typeof getSlots === 'function') {
          obj.slots = getSlots();
        }
        return obj;
      });
      // cur.children = columns;
      return pre.concat(columns);
    }
    return pre.concat([cur]);
  }, [] as Array<any>);
  return allColumns;
}

/**
 * 根据周次范围获取此范围内的所有周次
 * @param startDim 起始周，格式为`YYYYWKXX`，如：2025WK25
 * @param endDim 起始周，格式为`YYYYWKXX`，如：2025WK28
 * @returns 周次列表，如：['2025WK25', '2025WK26', '2025WK27', '2025WK28']
 */
function getWeeks(startDim: string, endDim: string) {
  // 1. 验证输入格式
  const isValidFormat = (str: string) => /^\d{4}WK\d{1,2}$/i.test(str);
  if (!isValidFormat(startDim) || !isValidFormat(endDim)) {
    return [];
  }

  // 2. 解析起始周和结束周
  const parseWeek = (str: string) => {
    const match = /^(\d{4})WK(\d{1,2})$/i.exec(str);
    return {
      year: match ? Number.parseInt(match[1], 10) : Number.NaN,
      week: match ? Number.parseInt(match[2], 10) : Number.NaN,
    };
  };
  const start = parseWeek(startDim);
  const end = parseWeek(endDim);

  // 3. 验证周数范围
  if (start.year > end.year || (start.year === end.year && start.week > end.week)) {
    return [];
  }

  // 4. 生成周次范围
  const weeks: string[] = [];
  let currentYear = start.year;
  let currentWeek = start.week;

  while (currentYear < end.year || (currentYear === end.year && currentWeek <= end.week)) {
    // 格式化周字符串 (WK01 格式)
    weeks.push(`${currentYear}WK${currentWeek.toString().padStart(2, '0')}`);

    // 移动到下一周
    currentWeek++;

    // 检查是否需要跨年
    const maxWeeks = currentYear % 4 === 0 ? 53 : 52; // 简化处理：闰年53周
    if (currentWeek > maxWeeks) {
      currentYear++;
      currentWeek = 1;
    }
  }

  return weeks;
}

/**
 * 获取指标项最多的数据，及`TitleList`最多的一项数据
 * @param data
 */
export function getMostTitleList(data: Array<{ TitleList: Array<{ keys: string; values?: string }> }>) {
  return data.reduce(
    (pre, cur) => {
      const { TitleList } = cur ?? {};
      if (TitleList && TitleList.length > pre.TitleList.length) {
        return cur;
      }
      return pre;
    },
    { TitleList: Array<{ keys: string; values?: string }> },
  );
}

/**
 * 从第二列开始，计算合并单元格
 */
function calculateMergeSpans(rowCount: number, fields: string[], rowSpans: number[][], data: any[]) {
  function setRowSpans(spanCount: number, currentRow: number, col: number) {
    if (spanCount <= 1) return;
    rowSpans[currentRow][col] = spanCount;
  }

  for (let col = 1; col < fields.length; col++) {
    for (let row = 0; row < rowCount; ) {
      // 如果前一列未合并则跳过
      if (rowSpans[row][col - 1] <= 1) {
        row++;
        continue;
      }
      // 获取前一列合并块范围
      const prevSpanEnd = row + rowSpans[row][col - 1] - 1;
      // 在当前列的前一列合并块内检查连续相同值
      let currentRow = row;
      while (currentRow <= prevSpanEnd) {
        // 查找连续相同值的结束行
        let endRow = currentRow;
        while (endRow < prevSpanEnd && data[endRow][fields[col]] === data[endRow + 1][fields[col]]) {
          endRow++;
        }
        // 计算当前列连续行数
        setRowSpans(endRow - currentRow + 1, currentRow, col);
        currentRow = endRow + 1; // 移动到下一个未处理行
      }
      // 跳过前一列合并块
      row = prevSpanEnd + 1;
    }
  }
}

/**
 * 生成单元格合并信息
 * @param data 表格数据（对象数组）
 * @param fields 列字段列表（如 ['FactoryName', 'TmlCusPrjCode', 'Title1', ...]）
 * @returns 合并信息数组
 */
export function generateMergeSpans(data: any[], fields: string[]): Array<{ row: number; rowspan: number; col: number; colspan: number }> {
  if (!data.length || !fields.length) return [];

  const mergeInfo: Array<{ row: number; rowspan: number; col: number; colspan: number }> = [];
  const rowCount = data.length;

  // 初始化合并状态矩阵（记录每行的合并行数）
  const rowSpans: number[][] = new Array(rowCount).fill(0).map(() => new Array(fields.length).fill(1));

  // 处理第一列
  for (let row = 0; row < rowCount - 1; ) {
    const currentValue = data[row][fields[0]];
    const nextValue = data[row + 1][fields[0]];

    if (currentValue === nextValue) {
      // 向后查找连续相同行
      let count = 1;
      while (row + count < rowCount && data[row][fields[0]] === data[row + count][fields[0]]) {
        count++;
      }
      rowSpans[row][0] = count;
      row += count - 1; // 跳过已合并行
    }
    row++;
  }

  // 处理其他列（从第二列开始）
  calculateMergeSpans(rowCount, fields, rowSpans, data);

  // 收集合并信息
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < fields.length; col++) {
      if (rowSpans[row][col] > 1) {
        mergeInfo.push({
          row,
          rowspan: rowSpans[row][col],
          col,
          colspan: 1,
        });
      }
    }
  }

  return mergeInfo;
}

/**
 * 计算TitleList_Title系列字段的合并列数
 * @param titleFields TitleList_Title字段列表
 * @param titleIndices TitleList_Title字段索引映射
 * @param startRow 合并开始行
 * @param endRow 合并结束行
 * @param fields 列字段列表
 * @param data 表格数据（对象数组）
 * @returns 合并列数
 */
function calculateTitleListMergeColspan(
  titleFields: string[],
  titleIndices: Map<string, number>,
  startRow: number,
  endRow: number,
  fields: string[],
  data: any[],
) {
  let mergeColspan = 1;
  for (let i = 1; i < titleFields.length; i++) {
    const field = titleFields[i];
    const colIndex = titleIndices.get(field);
    if (colIndex === undefined) break;

    let allEmpty = true;
    for (let r = startRow; r < endRow; r++) {
      const value = data[r]?.[fields[colIndex]];
      if (value != null && value !== '') {
        allEmpty = false;
        break;
      }
    }

    if (allEmpty) {
      mergeColspan++;
    } else {
      break;
    }
  }
  return mergeColspan;
}

/**
 * 生成TitleList_Title系列字段的特殊合并信息（优化版）
 * @param data 表格数据（对象数组）
 * @param fields 列字段列表
 * @returns 合并信息数组
 */
export function generateTitleListMergeSpans(data: any[], fields: string[]): Array<{ row: number; rowspan: number; col: number; colspan: number }> {
  // 1. 获取基础合并信息
  const baseMergeInfo = generateMergeSpans(data, fields);

  // 2. 提取并排序TitleList_Title字段
  const titleFields = fields
    .filter(f => f.startsWith('TitleList_Title'))
    .sort((a, b) => {
      const numA = Number.parseInt(a.replace('TitleList_Title', ''), 10);
      const numB = Number.parseInt(b.replace('TitleList_Title', ''), 10);
      return numA - numB;
    });

  if (titleFields.length === 0) return baseMergeInfo;

  const specialMergeInfo: typeof baseMergeInfo = [];
  const rowCount = data.length;

  // 3. 创建字段索引映射（优化：一次性计算所有字段索引）
  const titleIndices = new Map<string, number>();
  titleFields.forEach(field => {
    const index = fields.indexOf(field);
    if (index !== -1) titleIndices.set(field, index);
  });

  // 4. 获取TitleList_Title1的索引
  const title1Index = titleIndices.get('TitleList_Title1');
  if (title1Index === undefined) return baseMergeInfo;

  // 5. 创建合并块缓存，减少重复查找
  const rowspanCache: Record<number, { rowspan: number; startRow: number }> = {};
  baseMergeInfo.forEach(item => {
    if (item.col === title1Index) {
      for (let r = item.row; r < item.row + item.rowspan; r++) {
        rowspanCache[r] = {
          rowspan: item.rowspan,
          startRow: item.row,
        };
      }
    }
  });

  // 6. 处理每一行
  for (let row = 0; row < rowCount; ) {
    // 检查当前行是否属于某个合并块
    const spanInfo = rowspanCache[row];
    const isSpanStart = spanInfo?.startRow === row;

    // 只处理合并块首行或未合并行
    if (spanInfo && !isSpanStart) {
      row++;
      continue;
    }

    // 确定处理范围
    const startRow = spanInfo ? spanInfo.startRow : row;
    const rowspan = spanInfo ? spanInfo.rowspan : 1;
    const endRow = startRow + rowspan;

    // 7. 检查后续字段是否为空
    const mergeColspan = calculateTitleListMergeColspan(titleFields, titleIndices, startRow, endRow, fields, data);

    // 8. 添加特殊合并项
    if (mergeColspan > 1) {
      specialMergeInfo.push({
        row: startRow,
        rowspan,
        col: title1Index,
        colspan: mergeColspan,
      });
    }

    // 9. 跳过合并块内的其他行
    if (spanInfo) row = endRow - 1;

    row++;
  }

  // 10. 过滤基础合并信息
  const specialRows = new Set(specialMergeInfo.map(s => s.row));
  const finalMergeInfo = baseMergeInfo.filter(item => {
    if (!specialRows.has(item.row)) return true;
    return !specialMergeInfo.some(special => special.row === item.row && special.col <= item.col && item.col < special.col + special.colspan);
  });

  return [...finalMergeInfo, ...specialMergeInfo];
}

/** 获取表格合并信息 */
export function getMergeInfo(data: any[], fields: string[]) {
  return generateTitleListMergeSpans(data, fields);
}

/**
 * 格式化表格数据
 * @param param0
 * @returns
 */
export function formatDataList({ columns, data }) {
  const res = data.map((item: { List: Array<{ keys: string; value?: string | number }> } & Recordable<any>) => {
    // 合计项处理
    /** 合计项 */
    let totalItem: any = null;
    if (Array.isArray(item.List) && item.List.length) {
      const totalItemIndex = item.List.findIndex((el: { keys: string }) => !el.keys.includes('WK'));
      if (totalItemIndex !== -1) {
        totalItem = item.List[totalItemIndex];
        // 删除原本`List`里面的`合计`
        item.List.splice(totalItemIndex, 1);
      }
    }

    const columnData = columns.reduce((pre: any, cur: any) => {
      const { field, columnType } = cur ?? {};
      if (columnType === COLUMN_TYPE_ENUM.KEYS_VALUES || columnType === COLUMN_TYPE_ENUM.WEEKS) {
        return {
          ...pre,
          ...(item[field] ?? []).reduce((pre: any, cur: any) => {
            const key = `${field}_${cur.keys}`;
            return {
              ...pre,
              [key]: columnType === COLUMN_TYPE_ENUM.WEEKS ? formatNumberWithCommas(cur.values) : cur.values,
            };
          }, {}),
        };
      } else if (columnType === COLUMN_TYPE_ENUM.TOTAL) {
        return {
          ...pre,
          [field]: totalItem?.values ? formatNumberWithCommas(totalItem.values) : '',
        };
      }
      return {
        ...pre,
        [field]: item[field],
      };
    }, {});
    return {
      ...item,
      ...columnData,
    };
  });
  return res;
}

/**
 * 解析YYYYWKXX格式的周字符串，返回该周第一天(周一)或最后一天(周日)
 * @param input 输入字符串，如 "2025WK25"
 * @param returnEnd 是否返回周的最后一天（默认返回第一天）
 * @returns YYYY-MM-DD格式的日期字符串
 */
export function parseWeekString(input: string, returnEnd: boolean = false): string {
  // 1. 验证输入格式并提取数据
  const match = /^(\d{4})WK(\d{1,2})$/i.exec(input);
  if (!match) return input;

  const year = Number.parseInt(match[1], 10);
  const weekNum = Number.parseInt(match[2], 10);

  // 2. 计算该年1月4日（ISO周计算的基准点）
  const baseDate = new Date(year, 0, 4);

  // 3. 获取1月4日是星期几（0=周日,1=周一...6=周六）
  const baseDay = baseDate.getDay();

  // 4. 计算该年第一周的周一
  const firstMonday = new Date(baseDate);
  firstMonday.setDate(baseDate.getDate() - (baseDay === 0 ? 6 : baseDay - 1));

  // 5. 验证周数有效性（52或53周）
  const nextYearFirstMonday = new Date(year + 1, 0, 4);
  nextYearFirstMonday.setDate(nextYearFirstMonday.getDate() - (nextYearFirstMonday.getDay() === 0 ? 6 : nextYearFirstMonday.getDay() - 1));

  // @ts-ignore
  const maxWeeks = Math.floor((nextYearFirstMonday - firstMonday) / (7 * 24 * 60 * 60 * 1000));
  // 超出周数范围
  if (weekNum < 1 || weekNum > maxWeeks) {
    return input;
  }

  // 6. 计算目标周的周一
  const targetMonday = new Date(firstMonday);
  targetMonday.setDate(firstMonday.getDate() + (weekNum - 1) * 7);

  // 7. 返回周一或周日
  const resultDate = returnEnd
    ? new Date(targetMonday.getTime() + 6 * 24 * 60 * 60 * 1000) // 周一+6天=周日
    : targetMonday;

  // 8. 格式化为YYYY-MM-DD
  return [resultDate.getFullYear(), (resultDate.getMonth() + 1).toString().padStart(2, '0'), resultDate.getDate().toString().padStart(2, '0')].join('-');
}

/**
 * 计算数组元素之和（支持数字、百分比字符串和undefined）
 * @param arr - 包含数字、百分比字符串（如'xx.yy%'）或undefined的数组
 * @returns 所有有效数字之和（如果是百分比，则以百分比形式展示）或空字符串
 */
// export function sumWithUndefinedAsZero(arr: Array<number | string | undefined>): string {
//   let total = new Decimal(0);
//   let allUndefined = true;
//   let hasPercentage = false;
//
//   for (const item of arr) {
//     if (item === undefined) continue;
//
//     allUndefined = false;
//
//     if (typeof item === 'number') {
//       total = total.add(new Decimal(item));
//       continue;
//     }
//
//     if (typeof item === 'string') {
//       const trimmed = item.trim();
//
//       // 处理百分比字符串 (如 '25.5%')
//       if (trimmed.endsWith('%')) {
//         hasPercentage = true; // 标记存在百分比数据
//         const numPart = trimmed.slice(0, -1);
//         if (/^-?\d*\.?\d+(?:[eE][-+]?\d+)?$/.test(numPart)) {
//           total = total.add(new Decimal(numPart).dividedBy(100));
//           continue;
//         }
//       }
//
//       // 处理普通数字字符串
//       if (/^-?\d*\.?\d+(?:[eE][-+]?\d+)?$/.test(trimmed)) {
//         total = total.add(new Decimal(trimmed));
//         continue;
//       }
//
//       return ''; // 无效字符串立即终止
//     }
//
//     return ''; // 其他类型视为无效
//   }
//
//   if (allUndefined) return '';
//
//   // 如果有百分比数据，将结果转换为百分比格式
//   if (hasPercentage) {
//     const percentage = total.times(100);
//     // 最多显示 `100%`
//     return `${percentage.comparedTo(100) === 1 ? '100' : percentage}%`;
//   }
//
//   // 普通数字结果直接返回（保留两位小数）
//   return total.valueOf();
// }

/**
 * 获取元素到指定祖先元素的静态距离
 * @param element 目标元素
 * @param ancestor 祖先元素
 * @returns 相对距离
 */
export function getStaticOffset(element: HTMLElement, ancestor: HTMLElement) {
  let top = 0;
  let left = 0;
  let current: HTMLElement | null = element;

  while (current && current !== ancestor) {
    top += current.offsetTop;
    left += current.offsetLeft;
    current = current.offsetParent as HTMLElement | null;
  }

  return { top, left };
}

/**
 * 复制字符串到剪切板
 * @param text - 需要复制的字符串
 * @returns Promise 对象，操作成功时 resolve(true)，失败时 reject(error)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 方法1：优先使用 navigator.clipboard API（现代浏览器）
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(() => true);
  }

  // 方法2：降级方案（兼容旧浏览器）
  return new Promise((resolve, reject) => {
    copyTextToClipboard(text) ? resolve(true) : reject(new Error('Copy failed'));
  });
}

/**
 * 创建函数，该函数创建一个遮罩层，通过粘性定位，让合并行数较多的单元格的内容能始终显示在当前可视区域
 * @returns 返回函数，该函数创建一个遮罩层，通过粘性定位，让合并行数较多的单元格的内容能始终显示在当前可视区域
 */
function createStickyMaskFn() {
  let mask: HTMLDivElement | null = null;
  let timer: NodeJS.Timeout | null = null;

  return function createStickyMask() {
    // Todo: 支持虚拟滚动，动态更新遮罩（待处理）

    timer && clearTimeout(timer);

    timer = setTimeout(() => {
      if (mask) {
        mask.remove();
        mask = null;
      }

      const tableEl = document.querySelector<HTMLTableElement>('.vxe-table--body')!;
      const innerWrapperEl = document.querySelector<HTMLDivElement>('.vxe-table--body-inner-wrapper')!;
      const longMergeCells = document.querySelectorAll<HTMLElement>('.long-merge-cell');

      mask = document.createElement('div');
      mask.classList.add('absolute', 'inset-0', 'pointer-events-none');
      mask.style.width = `${tableEl.offsetWidth}px`;
      mask.style.height = `${tableEl.offsetHeight}px`;

      longMergeCells.forEach(element => {
        const { top, left } = getStaticOffset(element, tableEl);
        const div = document.createElement('div');
        div.classList.add('absolute', 'p-5px', 'leading-22px');
        div.style.top = `${top}px`;
        div.style.left = `${left}px`;
        div.style.width = `${element.offsetWidth}px`;
        div.style.height = `${element.offsetHeight}px`;

        const longMergeCellSpan = element.querySelector<HTMLSpanElement>('span.vxe-cell--label span')!;
        const stickySpan = document.createElement('span');
        stickySpan.classList.add('sticky', 'top-8px', 'break-all', 'max-h-full', 'overflow-hidden', 'inline-block');
        stickySpan.innerText = longMergeCellSpan.innerText;
        stickySpan.style.color = 'rgb(50, 54, 57)';
        div.appendChild(stickySpan);

        mask?.appendChild(div);
      });
      innerWrapperEl.appendChild(mask);
    });
  };
}

/** 创建一个遮罩层，通过粘性定位，让合并行数较多的单元格的内容能始终显示在当前可视区域 */
export const createStickyMask = createStickyMaskFn();

export function getRowClassNameFuncByGroupKey(groupKey: string): (params: any) => string {
  let lastValue = '';
  let lastCalss = '';
  const cacheInfo = {};
  return ({ row }) => {
    const value = row[groupKey];
    const { id } = row;
    if (cacheInfo[id]) {
      return cacheInfo[id];
    }
    if (lastValue !== value) {
      lastValue = value;
      lastCalss = lastCalss === 'bg-blue' ? 'bg-white' : 'bg-blue';
    }
    cacheInfo[id] = lastCalss;
    return lastCalss;
  };
}

/** 给`流程节点(合并了单元格)`设置斑马纹 */
export const getStripeClassByFlowNode = getRowClassNameFuncByGroupKey('FlowNode');

/**
 * 通过指定索引给单元格设置斑马纹
 * @param index
 * @returns
 */
export function getStripeClassByRowIndex(index: number) {
  return index % 2 === 1 ? 'bg-yellow' : '';
}

/**
 * 格式化数字为千分位字符串
 * @param input - 需要判断的值（数字、字符串或其他类型）
 * @returns 格式化后的千分位字符串或原值
 */
export function formatNumberWithCommas(input: any): any {
  // 处理数字类型
  if (typeof input === 'number') {
    return input.toLocaleString('en-US');
  }

  // 处理字符串类型
  if (typeof input === 'string') {
    // 去除首尾空格
    const trimmedInput = input.trim();

    // 空字符串直接返回原值
    if (trimmedInput === '') return input;

    // 使用 Number() 转换并验证
    const num = Number(trimmedInput);

    // 检查是否为有效数字（非 NaN 且有限）
    if (!Number.isNaN(num) && Number.isFinite(num)) {
      return num.toLocaleString('en-US');
    }
  }

  // 非数字/纯数字字符串返回原值
  return input;
}
