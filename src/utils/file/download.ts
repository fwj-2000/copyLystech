import { openWindow } from '..';
import { dataURLtoBlob, urlToBase64 } from './base64Conver';
import { useGlobSetting } from '/@/hooks/setting';
import { isDevMode } from '/@/utils/env';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { isFunction } from 'lodash-es';

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
  urlToBase64(url).then(base64 => {
    downloadByBase64(base64, filename, mime, bom);
  });
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  const blobData = typeof bom === 'undefined' ? [data] : [bom, data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({ url, target = '_blank', fileName }: { url: string; target?: TargetContext; fileName?: string }): boolean {
  if (!url) return false;
  const globSetting = useGlobSetting();
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1;
  const isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  if (!/https?:\/\//.test(url) && url.indexOf('data:image/png;base64') < 0) url = globSetting.apiUrl + url;
  if (isDevMode() && isFirefox) {
    const VITE_PROXY: any = import.meta.env.VITE_PROXY || '';
    const proxyList = import.meta.env.VITE_PROXY ? JSON.parse(VITE_PROXY) : [];
    for (const [prefix, target] of proxyList) {
      if (prefix === globSetting.apiUrl) {
        url = url.replace(prefix, target);
        break;
      }
    }
  }
  if (fileName && url.indexOf('data:image/png;base64') < 0 && url.indexOf('&name=') < 0 && url.indexOf('?name=') < 0) {
    url = url + (url.indexOf('?') > -1 ? `&name=${encodeURIComponent(fileName)}` : `?name=${encodeURIComponent(fileName)}`);
  }
  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!');
    return false;
  }
  if (isChrome || isSafari || isFirefox) {
    const link = document.createElement('a');
    url = url.replace(/&amp;/g, '&');
    url = url.replace(/^http:/i, 'https:'); // 下载链接转换成https
    link.href = url;
    link.download = fileName || '';
    console.log('Downloading file with name:', url, link.download); // 调试信息
    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download';
  }
  console.log(url);
  openWindow(url, { target });
  return true;
}

// 判断文件是否为新版文件
export function isNewFile(url: string) {
  // 文件路径不含http，且以DocumentFile开头，则认为是新版文件
  // 文件路径转成小写，防止大小写问题
  url = url.toLowerCase();
  return !url.includes('http') && url.startsWith('document');
}

// 下载文件 适用于新版的文件下载
export function downloadFile(fileInfo: {
  filePath?: string;
  url?: string;
  fileName?: string;
  target?: TargetContext;
  version?: '1' | '2';
  originFileName?: string;
}) {
  let filePath = fileInfo.filePath || fileInfo.url;
  const fileName = fileInfo.fileName || fileInfo.name;
  const { target } = fileInfo;
  if (!filePath) return;
  let url = filePath;
  // 识别是否为新版
  const isV2 = (fileInfo.version && fileInfo.version == '2') || isNewFile(filePath);
  if (isV2) {
    const globSetting = useGlobSetting();
    // 如果filePath没有匹配到文件格式，则拼接fileName
    if (!filePath.includes('.')) {
      filePath = filePath + '/' + fileName;
    }
    url = `${globSetting.downloadUrl}?filePath=${filePath}&fileName=${fileInfo.originFileName || fileName}`;
    // window.open(url, '_self');
  }
  console.log('🚀 ~ downloadFile ~ url, target, fileName : ', url, target, fileName);
  downloadByUrl({ url, target, fileName: fileInfo.originFileName || fileName });
}

// 合并相同的单元格
const mergeSameCellsInColumn = ({ columnIndex, worksheetData, worksheet }) => {
  // 用于存储要合并的区域
  const mergeRegions: any = [];
  let startRow = 0;
  let currentValue = worksheetData[0][columnIndex];

  for (let row = 0; row < worksheetData.length; row++) {
    if (worksheetData[row][columnIndex] !== currentValue) {
      if (startRow < row - 1) {
        mergeRegions.push({
          s: { r: startRow, c: columnIndex },
          e: { r: row - 1, c: columnIndex },
        });
      }
      startRow = row;
      currentValue = worksheetData[row][columnIndex];
    }
  }

  // 应用合并
  mergeRegions.forEach((region: any) => {
    const range = {
      s: {
        r: region.s.r,
        c: region.s.c,
      },
      e: {
        r: region.e.r,
        c: region.e.c,
      },
    };
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push(range);
  });
};

export interface ISaveExcelParams {
  columns?: any[];
  tableList?: any[];
  fileName?: string;
  isCustomRender?: boolean;
  isRowSpan?: boolean;
}

// 前端保存表格数据
export const saveTableDatasToExcel = ({ columns, tableList, fileName = 'download', isCustomRender = true, isRowSpan = true }) => {
  const tableDatas = tableList.map(item => {
    return columns.reduce((pre, cur) => {
      if (isCustomRender && cur.customRender && isFunction(cur.customRender)) {
        pre[cur.dataIndex as string] = cur.customRender({ text: item[cur.dataIndex as string], record: item, column: cur } as any);
      } else {
        pre[cur.dataIndex as string] = item[cur.dataIndex as string];
      }
      return pre;
    }, {});
  });
  const worksheetData = [
    columns.map(col => col.title),
    ...tableDatas.map(item => columns.map(col => (col.dataIndex ? item[col.dataIndex as string] : ''))),
    columns.map(() => ''),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  // 遍历每一列进行合并
  columns.forEach((column, columnIndex) => {
    if (isRowSpan && column.customCell) {
      // 有合并方法才合并
      mergeSameCellsInColumn({ columnIndex, worksheetData, worksheet });
    }
  });
  // 设置样式，包括居中对齐
  const style = {
    alignment: {
      horizontal: 'center',
      vertical: 'center',
      wrapText: true, // 自动换行
    },
  };

  // 遍历每个单元格应用样式
  for (let row = 0; row < worksheetData.length; row++) {
    for (let col = 0; col < worksheetData[row].length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (worksheet[cellAddress]) {
        // return
        worksheet[cellAddress].s = { ...(worksheet[cellAddress]?.s || {}), ...style };
      }
    }
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `${fileName}.xlsx`);
};

// 是否是浮点数字符串
const isFloatString = str => {
  const floatStringPattern = /^[+-]?\d+\.\d+$/;
  return typeof str === 'string' && floatStringPattern.test(str);
};
// 是否是百分比字符串
const isPercentageString = str => {
  const percentagePattern = /^[+-]?\d+(\.\d+)?%$/;
  return typeof str === 'string' && percentagePattern.test(str);
};
// 是否是整数
const isIntegerStr = str => {
  const integerPattern = /^[+-]?\d+$/;
  return typeof str === 'string' && integerPattern.test(str);
};

// 前端保存表格数据-exceljs 库
export const saveTableDatasToExcelByExceljs = async ({ columns, tableList, fileName = 'download' }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.columns = columns.map(col => ({ header: col.title, key: col.dataIndex, width: (col.width / 60) * 8 || 10 }));

  // 填充值
  tableList.forEach(row => {
    worksheet.addRow(row);
  });

  // 设置行高
  worksheet.eachRow(row => {
    row.height = 22;
  });

  // 设置单元格值类型
  worksheet.eachRow(row => {
    row.eachCell(cell => {
      if (isIntegerStr(cell.value)) {
        cell.value = Number.parseInt(cell.value as string, 10);
        cell.numFmt = '0';
      }
      if (isFloatString(cell.value)) {
        cell.value = Number.parseFloat(cell.value as string);
        cell.numFmt = '0.0###';
      } else if (isPercentageString(cell.value)) {
        cell.value = Number.parseFloat(cell.value as string) / 100;
        cell.numFmt = '0.###%';
      }
    });
  });

  columns.forEach((item, colIdx) => {
    // 设置每列的对齐方式
    const column = worksheet.getColumn(colIdx);
    if (!column) return;
    column.alignment = {
      horizontal: item.align || 'center',
      vertical: 'middle',
      wrapText: true,
    };
    // 设置列为数值类型

    // 合并每列数据
    const { isRowSpan = false, dataIndex } = item;
    if (isRowSpan) {
      let currentValue = tableList[0][dataIndex]; // 当前值
      let startRow = 2; // 起始行
      let endRow = 2; // 结束行
      for (let rowIdx = 1; rowIdx < tableList.length; rowIdx++) {
        if (tableList[rowIdx][dataIndex] !== currentValue) {
          // 合并单元格
          // 按开始行，开始列，结束行，结束列合并
          worksheet.mergeCells(startRow, colIdx, endRow, colIdx);
          startRow = endRow + 1;
          currentValue = tableList[rowIdx][dataIndex]; // 重置当前需要合并的值
        }
        endRow++;
        // 最后一行也相同合并
        if (rowIdx === tableList.length - 1) {
          worksheet.mergeCells(startRow, colIdx, endRow, colIdx);
        }
      }
    }
  });

  // 设置表头样式
  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;
  headerRow.eachCell(cell => {
    cell.font = {
      bold: true,
      size: 12,
      color: { argb: 'FF000000' },
    };
  });
  // 冻结表头
  worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  // 将工作簿保存为Excel文件
  const excelBuffer = await workbook.xlsx.writeBuffer();
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `${fileName}.xlsx`);
};

export const saveVxeTableDatasToExcelByExceljs = async ({ columns, tableList, fileName = 'download' }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  const reduceColumns = columns.reduce((pre, cur) => {
    if (cur.children) {
      return [...pre, ...cur.children];
    }
    return [...pre, cur];
  }, []);

  worksheet.columns = reduceColumns.map(col => ({ header: col.title, key: col.field }));

  // 填充值
  tableList.forEach(row => {
    worksheet.addRow(
      reduceColumns.reduce((pre, cur) => {
        const { field, formatter = ({ cellValue }) => cellValue } = cur;
        return { ...pre, [field]: formatter({ cellValue: row[field], row }) };
      }, {}),
    );
  });

  // 设置行高
  worksheet.eachRow(row => {
    row.height = 22;
  });
  const maxColumn = worksheet.actualColumnCount;

  // 遍历每一列并设置宽度
  for (let col = 0; col < maxColumn; col++) {
    const colWidth = (reduceColumns[col].width ?? reduceColumns[col].minWidth ?? 80) / 5;
    worksheet.getColumn(col + 1).width = colWidth;
  }

  // 设置单元格值类型
  worksheet.eachRow(row => {
    row.eachCell(cell => {
      if (isIntegerStr(cell.value)) {
        cell.value = Number.parseInt(cell.value as string, 10);
        cell.numFmt = '0';
      }
      if (isFloatString(cell.value)) {
        // cell.value = parseFloat(cell.value as string);
        cell.numFmt = '0.0###';
      } else if (isPercentageString(cell.value)) {
        cell.value = Number.parseFloat(cell.value as string) / 100;
        cell.numFmt = '0.0###%';
      }
      if (Number.parseFloat(cell.value as string) < 0) {
        cell.font = { color: { argb: 'FFFF0000' } };
      }
    });
  });

  reduceColumns.forEach((item, cIdx) => {
    // 设置每列的对齐方式
    const colIdx = cIdx + 1; // 起始以1开始
    const column = worksheet.getColumn(colIdx);
    if (!column) return;
    column.alignment = {
      horizontal: item.align || 'center',
      vertical: 'middle',
      wrapText: true,
    };
    // 设置列为数值类型

    // 合并每列数据
    const { mergeConfig, isMergeRows = false, field } = item;
    const { needMergeRow = false } = mergeConfig ?? {};
    if (isMergeRows || needMergeRow) {
      let currentValue = tableList[0][field]; // 当前值
      let startRow = 2; // 起始行
      let endRow = 2; // 结束行
      for (let rowIdx = 1; rowIdx < tableList.length; rowIdx++) {
        if (tableList[rowIdx][field] !== currentValue) {
          // 合并单元格
          // 按开始行，开始列，结束行，结束列合并
          worksheet.mergeCells(startRow, colIdx, endRow, colIdx);
          startRow = endRow + 1;
          currentValue = tableList[rowIdx][field]; // 重置当前需要合并的值
        }
        endRow++;
        // 最后一行也相同合并
        if (rowIdx === tableList.length - 1) {
          worksheet.mergeCells(startRow, colIdx, endRow, colIdx);
        }
      }
    }
  });

  // 设置表头样式
  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;
  headerRow.eachCell(cell => {
    cell.font = {
      bold: true,
      size: 12,
      color: { argb: 'FF000000' },
    };
  });
  // 冻结表头
  worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  // 将工作簿保存为Excel文件
  const excelBuffer = await workbook.xlsx.writeBuffer();
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `${fileName}.xlsx`);
};

export const saveTableDatasToExcelProvider = ({
  columns,
  tableList,
  fileName = 'download',
  isCustomRender = true,
  isRowSpan = true,
  isTreeData = false, // 新增：是否为树形数据
  childrenKey = 'children', // 新增：子节点字段名
}) => {
  // 1. 如果需要处理树形，先展平所有节点，并添加层级
  let flatData: any[] = [];
  if (isTreeData) {
    const flatten = (nodes: any[], level = 0) => {
      nodes.forEach(node => {
        // 克隆节点并附加层级
        flatData.push({ ...node, _level: level });
        if (node[childrenKey]?.length) {
          flatten(node[childrenKey], level + 1);
        }
      });
    };
    flatten(tableList);
  } else {
    flatData = [...tableList];
  }

  // 2. 构建导出数据（原有逻辑，但使用 flatData）
  const tableDatas = flatData.map(item => {
    return columns.reduce((pre, cur) => {
      if (isCustomRender && cur.customRender && isFunction(cur.customRender)) {
        // 注意：customRender 的 record 现在包含 _level 字段，可用于缩进
        pre[cur.dataIndex as string] = cur.customRender({ text: item[cur.dataIndex as string], record: item, column: cur } as any);
      } else {
        pre[cur.dataIndex as string] = item[cur.dataIndex as string];
      }
      return pre;
    }, {});
  });

  // 3. 以下代码保持不变：构建 worksheetData、合并单元格、样式等
  const worksheetData = [
    columns.map(col => col.title),
    ...tableDatas.map(item => columns.map(col => (col.dataIndex ? item[col.dataIndex as string] : ''))),
    columns.map(() => ''),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  // 遍历每一列进行合并
  columns.forEach((column, columnIndex) => {
    if (isRowSpan && column.customCell) {
      // 有合并方法才合并
      mergeSameCellsInColumn({ columnIndex, worksheetData, worksheet });
    }
  });
  // 设置样式，包括居中对齐
  const style = {
    alignment: {
      horizontal: 'center',
      vertical: 'center',
      wrapText: true, // 自动换行
    },
  };

  // 遍历每个单元格应用样式
  for (let row = 0; row < worksheetData.length; row++) {
    for (let col = 0; col < worksheetData[row].length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (worksheet[cellAddress]) {
        // return
        worksheet[cellAddress].s = Object.assign({}, worksheet[cellAddress].s, style);
      }
    }
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `${fileName}.xlsx`);
};
