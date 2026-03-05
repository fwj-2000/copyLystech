// 类型定义
interface ColumnItem {
  rowIndex: number;
  colIndex: number;
  columnName: string;
}

interface ErrorItem {
  rowIndex: number;
  colIndex: number;
  message: string;
  fullMessage?: string;
}

interface TableHeader {
  title: string;
  field: string;
  editRender?: { name: string };
  width?: number;
  fixed?: string;
  cellRender?: { name: string };
  children?: TableHeader[];
}

interface TableDataRow {
  errMsg?: string;
  _hasErrors?: boolean;
  _errorDetails?: ErrorItem[];
  [key: string]: any;
}

interface ProcessedTableData {
  headers: TableHeader[];
  tableData: TableDataRow[];
  errorMap: { [key: number]: ErrorItem[] & { combined?: string } };
  errors: ErrorItem[];
  fileName: string;
  id: string;
}

interface ErrorStats {
  totalRows: number;
  errorRows: number;
  totalErrors: number;
  errorRate: string;
}

/**
 * 修正版表格转换 - 正确处理所有数据行和年份列
 */
export function transformTableWithErrors(data: any): ProcessedTableData {
  if (!data || !data.columnList || !data.excelArray) {
    return {
      headers: [],
      tableData: [],
      errorMap: {},
      errors: [],
      fileName: '',
      id: '',
    };
  }

  // 处理校验信息，按行分组
  const errorMap = processErrors(data.errors);

  // 转换表头（添加校验信息列在最前面）
  const headers = transformHeadersWithErrorColumn(data.columnList);

  // 转换表格数据（处理所有行）
  const tableData = transformAllTableData(headers, data.excelArray, data.columnList, errorMap);

  return {
    headers,
    tableData,
    errorMap,
    errors: data.errors || [],
    fileName: data.fileName || '',
    id: data.id || '',
  };
}

/**
 * 处理校验信息，按行索引分组
 */
function processErrors(errors: ErrorItem[]): { [key: number]: ErrorItem[] & { combined?: string } } {
  const errorMap: { [key: number]: ErrorItem[] & { combined?: string } } = {};

  if (!errors || !Array.isArray(errors)) {
    return errorMap;
  }

  errors.forEach((error: ErrorItem) => {
    const { colIndex, message } = error;
    // 行索引值-1，因为首行空数据不显示
    const rowIndex = error.rowIndex - 1;

    if (!errorMap[rowIndex]) {
      errorMap[rowIndex] = [];
    }

    const errCol = colIndex + 1;
    errorMap[rowIndex].push({
      colIndex: errCol,
      message,
      fullMessage: `列${errCol}: ${message}`,
    } as ErrorItem);
  });

  // 对每行的校验信息进行整合
  Object.keys(errorMap).forEach(rowIndexStr => {
    const rowIndex = parseInt(rowIndexStr);
    const rowErrors = errorMap[rowIndex];
    const combinedMessage = rowErrors.map(err => err.fullMessage).join('; ');
    errorMap[rowIndex].combined = combinedMessage;
  });

  return errorMap;
}

/**
 * 转换表头，添加校验信息列
 */
function transformHeadersWithErrorColumn(columnList: ColumnItem[]): TableHeader[] {
  const baseHeaders = transformColumnHeaders(columnList);

  // 在表头最前面添加校验信息列
  const errorHeader: TableHeader = {
    title: '校验信息',
    field: 'errMsg',
    width: 120,
    fixed: 'left',
  };

  return [errorHeader, ...baseHeaders];
}

/**
 * 转换所有表格数据
 */
function transformAllTableData(
  headers: TableHeader[],
  excelArray: any[][],
  columnList: ColumnItem[],
  errorMap: { [key: number]: ErrorItem[] & { combined?: string } },
): TableDataRow[] {
  // 创建精确的列索引到表头字段的映射
  const colIndexToFieldMap = createColIndexToFieldMap(columnList);

  // 处理所有数据行
  return excelArray.map((excelRow: any[], rowIndex: number) => {
    const rowData: TableDataRow = {};

    // 添加校验信息
    const rowErrors = errorMap[rowIndex];
    rowData.errMsg = rowErrors ? rowErrors.combined : '';
    rowData._hasErrors = !!rowErrors;
    rowData._errorDetails = rowErrors || [];

    // 为每个列设置值
    Object.keys(colIndexToFieldMap).forEach(colIndexStr => {
      const colIndex = parseInt(colIndexStr);
      const fieldName = colIndexToFieldMap[colIndex];

      if (excelRow[colIndex] !== undefined) {
        // 保留原始值
        const value = excelRow[colIndex];
        rowData[fieldName] = cleanCellValue(value, fieldName);
      }
    });

    return rowData;
  });
}

/**
 * 创建列索引到字段的映射
 */
function createColIndexToFieldMap(columnList: ColumnItem[]): { [key: number]: string } {
  const map: { [key: number]: string } = {};

  // 处理固定列（第6行，索引5）
  const fixedColumns = columnList.filter(col => col.rowIndex === 5);
  fixedColumns.forEach(column => {
    map[column.colIndex] = column.columnName;
  });

  // 处理年份列（第1行，索引0）
  const yearColumns = columnList.filter(col => col.rowIndex === 0);
  yearColumns.forEach(column => {
    map[column.colIndex] = `${column.columnName}_${column.colIndex}`;
  });

  return map;
}

/**
 * 清洗单元格值
 */
function cleanCellValue(value: any, fieldName: string): any {
  // 如果是空字符串，直接返回
  if (value === '') {
    return '';
  }

  if (value === null || value === undefined) {
    return '';
  }

  // 转换为字符串处理
  const strValue = String(value);

  // 处理数值类型字段
  const numericFields = ['Cum/Weekly', 'Rev'];
  if (numericFields.some(field => fieldName.includes(field))) {
    // 如果是空字符串，返回空
    if (strValue.trim() === '') {
      return '';
    }
    // 移除逗号等分隔符，转换为数字
    const numValue = parseFloat(strValue.replace(/,/g, ''));
    return isNaN(numValue) ? strValue : numValue;
  }

  // 处理布尔值或特定文本
  if (strValue === 'true' || strValue === 'TRUE') return true;
  if (strValue === 'false' || strValue === 'FALSE') return false;
  //   if (strValue === 'N/A' || strValue === 'null') return '';

  return strValue;
}

/**
 * 转换表头的基础方法
 */
function transformColumnHeaders(columnList: ColumnItem[]): TableHeader[] {
  if (!columnList || !Array.isArray(columnList)) {
    return [];
  }

  // 处理固定列（第6行，索引5）
  const fixedColumns = columnList.filter(col => col.rowIndex === 5);
  const fixedHeaders: TableHeader[] = fixedColumns
    .sort((a, b) => a.colIndex - b.colIndex)
    .map(column => ({
      title: column.columnName,
      field: column.columnName,
      editRender: { name: 'Input' },
    }));

  // 处理年份列（第1行，索引0）
  const yearHeaders = processYearColumns(columnList);

  return [...fixedHeaders, ...yearHeaders];
}

/**
 * 处理年份列
 */
function processYearColumns(columnList: ColumnItem[]): TableHeader[] {
  const yearColumns = columnList.filter(col => col.rowIndex === 0).sort((a, b) => a.colIndex - b.colIndex);

  if (yearColumns.length === 0) {
    return [];
  }

  // 按年份分组
  const yearGroups: { [year: string]: ColumnItem[] } = {};
  yearColumns.forEach(column => {
    const year = column.columnName;
    if (!yearGroups[year]) {
      yearGroups[year] = [];
    }
    yearGroups[year].push(column);
  });

  const yearHeaders: TableHeader[] = [];

  // 为每个年份创建表头
  Object.entries(yearGroups).forEach(([year, columns]) => {
    // 检查是否有季度信息（第2行，索引1）
    const hasQuarterInfo = columnList.some(col => col.rowIndex === 1 && columns.some(yearCol => yearCol.colIndex === col.colIndex));

    if (hasQuarterInfo) {
      // 创建年份-季度的多级表头
      const yearHeader: TableHeader = {
        title: year,
        field: `${year}_group`,
        width: 100,
        children: [],
      };

      // 按季度分组
      const quarterGroups: { [quarter: string]: ColumnItem[] } = {};

      columns.forEach(column => {
        const quarterCol = columnList.find(col => col.rowIndex === 1 && col.colIndex === column.colIndex);
        const quarter = quarterCol ? quarterCol.columnName : 'Unknown';

        if (!quarterGroups[quarter]) {
          quarterGroups[quarter] = [];
        }
        quarterGroups[quarter].push(column);
      });

      // 添加季度子表头
      Object.entries(quarterGroups).forEach(([quarter, quarterColumns]) => {
        const quarterHeader: TableHeader = {
          title: quarter,
          field: `${year}_${quarter}_group`,
          width: 100,
          children: [],
        };

        // 添加月份/周信息
        quarterColumns.forEach(column => {
          const monthCol = columnList.find(col => col.rowIndex === 2 && col.colIndex === column.colIndex);
          const weekCol = columnList.find(col => col.rowIndex === 3 && col.colIndex === column.colIndex);

          const title = monthCol ? monthCol.columnName : weekCol ? weekCol.columnName : `${column.colIndex}`;

          quarterHeader.children!.push({
            title: title,
            field: `${year}_${column.colIndex}`,
            editRender: { name: 'Input' },
            width: 100,
          });
        });

        yearHeader.children!.push(quarterHeader);
      });

      yearHeaders.push(yearHeader);
    } else {
      // 直接添加年份列
      columns.forEach(column => {
        yearHeaders.push({
          title: year,
          field: `${year}_${column.colIndex}`,
          editRender: { name: 'Input' },
          width: 100,
        });
      });
    }
  });

  return yearHeaders;
}

/**
 * 获取错误统计信息
 */
export function getErrorStats(tableData: TableDataRow[]): ErrorStats {
  const totalRows = tableData.length;
  const errorRows = tableData.filter(row => row._hasErrors).length;
  const totalErrors = tableData.reduce((sum, row) => sum + (row._errorDetails ? row._errorDetails.length : 0), 0);

  return {
    totalRows,
    errorRows,
    totalErrors,
    errorRate: totalRows > 0 ? ((errorRows / totalRows) * 100).toFixed(2) + '%' : '0%',
  };
}

/**
 * 调试方法 - 检查数据转换结果
 */
export function debugTableData(data: any): any {
  const result = transformTableWithErrors(data);

  console.log('原始excelArray行数:', data.excelArray.length);
  console.log('转换后tableData行数:', result.tableData.length);
  console.log('表头字段数:', result.headers.length);

  if (result.tableData.length > 0) {
    console.log('第一行数据字段数:', Object.keys(result.tableData[0]).length);
    console.log('第一行数据:', result.tableData[0]);
  }

  // 检查年份列数据
  const yearColumns = data.columnList.filter((col: ColumnItem) => col.rowIndex === 0);
  console.log('年份列数量:', yearColumns.length);
  console.log('年份列:', yearColumns);

  return result;
}

/**
 * 简化版本 - 直接映射所有数据
 */
export function transformTableSimple(data: any): ProcessedTableData {
  if (!data || !data.columnList || !data.excelArray) {
    return {
      headers: [],
      tableData: [],
      errorMap: {},
      errors: [],
      fileName: '',
      id: '',
    };
  }

  // 处理校验信息
  const errorMap = processErrors(data.errors);

  // 创建简单表头
  const headers = createSimpleHeaders(data.columnList);

  // 创建简单数据映射
  const tableData = data.excelArray.map((excelRow: any[], rowIndex: number) => {
    const rowData: TableDataRow = {};

    // 添加校验信息
    const rowErrors = errorMap[rowIndex];
    rowData.errMsg = rowErrors ? rowErrors.combined : '';
    rowData._hasErrors = !!rowErrors;

    // 为每个列设置值
    data.columnList.forEach((column: ColumnItem) => {
      const { colIndex, columnName, rowIndex: colRowIndex } = column;

      // 确定字段名
      let fieldName = columnName;
      if (colRowIndex === 0) {
        // 年份列使用唯一字段名
        fieldName = `${columnName}_${colIndex}`;
      }

      if (excelRow[colIndex] !== undefined) {
        rowData[fieldName] = excelRow[colIndex] || '';
      }
    });

    return rowData;
  });

  return {
    headers,
    tableData,
    errorMap,
    errors: data.errors || [],
    fileName: data.fileName || '',
    id: data.id || '',
  };
}

/**
 * 创建简单表头
 */
function createSimpleHeaders(columnList: ColumnItem[]): TableHeader[] {
  const errorHeader: TableHeader = {
    title: '校验信息',
    field: 'errMsg',
    width: 120,
    fixed: 'left',
  };

  const otherHeaders = columnList
    .sort((a, b) => a.colIndex - b.colIndex)
    .map(column => {
      let fieldName = column.columnName;
      if (column.rowIndex === 0) {
        // 年份列使用唯一字段名
        fieldName = `${column.columnName}_${column.colIndex}`;
      }

      return {
        title: column.columnName,
        field: fieldName,
        editRender: { name: 'Input' },
        width: 100,
      };
    });

  return [errorHeader, ...otherHeaders];
}

// 使用示例
/*
const tableData = transformTableWithErrors(yourData.data);
console.log('表格数据行数:', tableData.tableData.length);

// 或者使用简化版本
const simpleTableData = transformTableSimple(yourData.data);

// 使用调试方法检查
const debugResult = debugTableData(yourData.data);
*/
