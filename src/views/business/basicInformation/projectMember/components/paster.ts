import { normalizeText } from '../utils';
import { useMessage } from '/@/hooks/web/useMessage';

const { createMessage } = useMessage();
type UserHit = { id: string; fullName: string };

export async function handleAfterPasteMethod({ targetAreas }: any, buildNameCacheFromGrid) {
  if (!targetAreas?.length) return false;

  const nameCache = buildNameCacheFromGrid();

  for (const area of targetAreas) {
    await processArea(area, nameCache);
  }

  return true;
}
// 拆解选中区域
async function processArea(area: any, nameCache: Map<string, UserHit>): Promise<void> {
  for (const row of area.rows) {
    await processRow(row, area.cols, nameCache);
  }
}
// 拆解表格行数据
async function processRow(row: any, cols: any[], nameCache: Map<string, UserHit>): Promise<void> {
  for (const col of cols) {
    await processCell(row, col, nameCache);
  }
}
// 拆解单元格数据
async function processCell(row: any, col: any, nameCache: Map<string, UserHit>): Promise<void> {
  const field = col.field;
  if (isDynamicUserSelectColumn(col, field)) {
    await handleCustomUserSelectPaste(row, col, field, nameCache);
    return;
  }
  if (field === 'pdName') {
    await handlePdNamePaste(row, nameCache);
  }
}

// 判断是否为用户选择列
export function isDynamicUserSelectColumn(col: any): boolean {
  const field = col.field;
  return col.editRender?.name === 'ACustomUserSelect' && field.endsWith('_Name');
}
// 处理用户选择列粘贴
async function handleCustomUserSelectPaste(row: any, col: any, field: string, nameCache: Map<string, UserHit>): Promise<void> {
  const pastedName = normalizeText(row[field]);
  if (!pastedName) return;

  const valueField = field.replace('_Name', '');
  const objKey = valueField + '__obj';
  const hit = nameCache.get(pastedName);

  if (!hit) {
    clearUserData(row, field, valueField, objKey, col.title);
    createMessage.warning(`未匹配到人员：${pastedName}`);
    return;
  }

  fillUserData(row, hit, field, valueField, objKey, col.title);
  cacheUserHit(nameCache, hit);
}
// 处理pdName粘贴
async function handlePdNamePaste(row: any, nameCache: Map<string, UserHit>): Promise<void> {
  const pastedName = normalizeText(row.pdName);
  if (!pastedName) return;

  const hit = nameCache.get(pastedName);

  if (!hit) {
    row.pdId = '';
    row.pdName = '';
    createMessage.warning(`未匹配到人员：${pastedName}`);
    return;
  }

  row.pdId = hit.id;
  row.pdName = hit.fullName;
  cacheUserHit(nameCache, hit);
}
// 清除用户数据
function clearUserData(row: any, nameField: string, valueField: string, objKey: string, columnTitle: string): void {
  row[valueField] = '';
  row[nameField] = '';
  row._dynamic = {
    ...row._dynamic,
    [objKey]: {
      configColumnName: columnTitle,
      configType: valueField,
      memberId: '',
      memberName: '',
    },
  };
}
// 填充用户数据
function fillUserData(row: any, hit: UserHit, nameField: string, valueField: string, objKey: string, columnTitle: string): void {
  row[valueField] = hit.id;
  row[nameField] = hit.fullName;
  row._dynamic = {
    ...row._dynamic,
    [objKey]: {
      configColumnName: columnTitle,
      configType: valueField,
      memberId: hit.id,
      memberName: hit.fullName,
    },
  };
}
// 缓存用户数据
function cacheUserHit(nameCache: Map<string, UserHit>, hit: UserHit): void {
  nameCache.set(hit.fullName, hit);
}
