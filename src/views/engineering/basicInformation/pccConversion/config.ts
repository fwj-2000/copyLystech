import { h } from 'vue';
// import { isBoolean } from '/@/utils/is';
import { useI18n } from '/@/hooks/web/useI18n';
import { downloadByUrl } from '/@/utils/file/download';

import { LydcTag } from '/@/components/Lydc';

const { t } = useI18n();

/**
 * @description tabs类型枚举
 */
export enum TABS_ENUM {
  BOM = '0',
  工艺路线 = '1',
  生产版本 = '2',
}

/**
 * @description 是否导出枚举
 */
export enum IS_EXPORT_ENUM {
  '未导出' = 0,
  '已导出' = 1,
}

/**
 * 是否导出选项
 */
export const isExportOptions = [
  { id: `${IS_EXPORT_ENUM.未导出}`, fullName: t('common.notExported'), theme: 'gray' },
  { id: `${IS_EXPORT_ENUM.已导出}`, fullName: t('common.exported'), theme: 'green' },
];

/**
 * @description 是否同步枚举
 */
export enum IS_SYNC_ENUM {
  '未同步' = 0,
  '已同步' = 1,
}

/** 是否同步选项 */
export const isSyncOptions: Array<{ id: `${IS_SYNC_ENUM}`; fullName: string; theme: string }> = [
  { id: `${IS_SYNC_ENUM.未同步}`, fullName: t('common.notSynchronized'), theme: 'gray' },
  { id: `${IS_SYNC_ENUM.已同步}`, fullName: t('common.synchronized'), theme: 'green' },
];

/** 渲染`是否同步`单元格 */
export function renderIsSyncTableCell(row: any) {
  const isSync = `${row.syncSapTime ? IS_SYNC_ENUM.已同步 : IS_SYNC_ENUM.未同步}`;
  const option = isSyncOptions.find(item => item.id === isSync);

  return h(LydcTag, {
    theme: option?.theme || 'green',
    text: option?.fullName,
  });
}

/**
 * 版本显示样式
 * @returns
 */
export function formatVersion({ cellValue }) {
  return cellValue || cellValue === 0 ? `T${cellValue}` : cellValue;
}

/**
 * 下载文件
 * @param list
 * @returns
 */
export async function downloadFiles(list: Array<string | { url: string; name: string }>) {
  if (!Array.isArray(list) && list) {
    list = [list];
  }

  if (list.length === 0) {
    return false;
  }
  for (const item of list) {
    downloadByUrl({
      url: typeof item === 'string' ? item : item.url,
    });
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
