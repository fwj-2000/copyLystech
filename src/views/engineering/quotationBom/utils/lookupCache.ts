import { getMaterialQueryByMaterialCode } from '/@/api/engineering/pcc';
import { getUserIdByPhone } from '/@/api/permission/user';
import { isNullOrUnDef } from '/@/utils/is';

type AnyRecord = Record<string, any>;

const MAX_MATERIAL_CACHE_SIZE = 5000;
const MAX_USER_CACHE_SIZE = 2000;

const materialByCodeCache = new Map<string, AnyRecord>();
const userByAccountCache = new Map<string, AnyRecord>();
const userByDisplayCache = new Map<string, AnyRecord>();

function setBounded<K, V>(map: Map<K, V>, key: K, value: V, maxSize: number) {
  if (map.has(key)) map.delete(key);
  map.set(key, value);
  if (map.size > maxSize) {
    const firstKey = map.keys().next().value;
    if (isNullOrUnDef(firstKey)) return;
    map.delete(firstKey);
  }
}

export function getLastDigits(text: string): string {
  const str = `${text ?? ''}`;
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    const c = str[i];
    if (c >= '0' && c <= '9') {
      result = c + result;
    } else if (result) {
      break;
    }
  }
  return result;
}

export async function queryMaterialsByCodesCached(materialCodes: string[]) {
  const uniqCodes = Array.from(new Set((materialCodes || []).filter(Boolean)));
  const missing: string[] = [];
  const result = new Map<string, AnyRecord | undefined>();

  uniqCodes.forEach(code => {
    const cached = materialByCodeCache.get(code);
    if (cached) {
      result.set(code, cached);
    } else {
      missing.push(code);
    }
  });

  if (missing.length) {
    const { data } = await getMaterialQueryByMaterialCode(missing);
    (Array.isArray(data) ? data : []).forEach(item => {
      const code = item?.materialCode;
      if (!code) return;
      setBounded(materialByCodeCache, code, item, MAX_MATERIAL_CACHE_SIZE);
    });

    missing.forEach(code => result.set(code, materialByCodeCache.get(code)));
  }

  return result;
}

export async function queryUsersByAccountsCached(accounts: string[]) {
  const uniqAccounts = Array.from(new Set((accounts || []).filter(Boolean)));
  const missing: string[] = [];
  const result = new Map<string, AnyRecord | undefined>();

  uniqAccounts.forEach(account => {
    const cached = userByAccountCache.get(account);
    if (cached) {
      result.set(account, cached);
    } else {
      missing.push(account);
    }
  });

  if (missing.length) {
    const { data } = await getUserIdByPhone({ accounts: missing });
    (Array.isArray(data) ? data : []).forEach(item => {
      const account = `${item?.Account ?? ''}`.trim();
      if (!account) return;
      setBounded(userByAccountCache, account, item, MAX_USER_CACHE_SIZE);
      const display = `${`${item?.RealName ?? ''}`.trim()}/${account}`;
      setBounded(userByDisplayCache, display, item, MAX_USER_CACHE_SIZE);
    });

    missing.forEach(account => result.set(account, userByAccountCache.get(account)));
  }

  return result;
}

export async function queryUsersByCellsCached(cells: string[]) {
  const uniqCells = Array.from(new Set((cells || []).filter(Boolean)));
  const accounts: string[] = [];
  uniqCells.forEach(cell => {
    const trimmed = `${cell ?? ''}`.trim();
    if (!trimmed) return;

    if (trimmed.includes('/')) {
      if (userByDisplayCache.has(trimmed)) return;
      const account = getLastDigits(trimmed);
      if (account && !userByAccountCache.has(account)) accounts.push(account);
      return;
    }

    const account = getLastDigits(trimmed);
    if (account && !userByAccountCache.has(account)) accounts.push(account);
  });

  if (accounts.length) {
    await queryUsersByAccountsCached(accounts);
  }

  const result = new Map<string, AnyRecord | undefined>();
  uniqCells.forEach(cell => {
    const trimmed = `${cell ?? ''}`.trim();
    if (!trimmed) return result.set(cell, undefined);

    if (trimmed.includes('/')) {
      const byDisplay = userByDisplayCache.get(trimmed);
      if (byDisplay) return result.set(cell, byDisplay);
    }

    const account = getLastDigits(trimmed);
    result.set(cell, account ? userByAccountCache.get(account) : undefined);
  });

  return result;
}
