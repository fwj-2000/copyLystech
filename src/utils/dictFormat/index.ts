import { useBaseStore } from '/@/store/modules/base';
import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();

const baseStore = useBaseStore();

const normalThemeMap = {
  0: 'green',
  1: 'green',
  2: 'blue',
  3: 'yellow',
  4: 'red',
  5: 'purple',
  6: 'red',
  7: 'gray',
  8: 'red',
};
export interface DictItem {
  id: string | number;
  enCode: string | number;
  [key: string]: any;
}

export interface ThemeMap {
  [key: number]: string;
}

export interface FormatDictOptionsOptions<T extends DictItem> {
  dictList?: T[];
  dictKey?: string;
  key?: string;
  themeMap?: ThemeMap;
}

export type FormattedDictItem<T extends DictItem> = Omit<T, 'id'> & {
  _id: string | number;
  id: string | number;
  theme: string;
  rowKey: string;
};

export type FormatDictOptionsParams<T extends DictItem> = (
  | { dictList: T[]; dictKey?: never }
  | { dictKey: string; dictList?: never }
  | { dictList: T[]; dictKey: string }
) & {
  key?: string;
  themeMap?: ThemeMap;
};

/*
 生成tag 组件的options，兼容tag跟vxetable filter options 格式
 示例：
  export const classesOptions = await formatDictOptions({
    dictKey: 'ClassesName',
    key: 'testProgress',
    themeMap: {
      0: 'gray',
      1: 'blue',
      2: 'green',
    },
  });
输出:
[
  {
    id: '1',
    parentId: '0',
    fullName: '白班',
    enCode: '1',
    enabledMark: 1,
    sortCode: 1,
    theme: 'blue',
    rowKey: 'testProgress',
  },
];
*/
export async function formatDictOptions<T extends DictItem>(options: FormatDictOptionsParams<T>): Promise<FormattedDictItem<T>[]> {
  const { dictKey, key = 'statusDesc', themeMap = normalThemeMap } = options;
  let { dictList }: any = options;
  if (dictKey) {
    dictList = await baseStore.getDictionaryData(dictKey);
  }
  return dictList.map(item => {
    const numericCode = Number(item.enCode);
    const theme = themeMap[numericCode] || 'gray';

    return {
      ...item,
      _id: item.id,
      id: item.enCode,
      theme,
      rowKey: key,
    };
  });
}

export function openResouces({ url, fileName }: { url: string; fileName: string }) {
  return window.open(`${globSetting.apiUrl}/api/Information/fileinfo/downloadfile?filePath=${url}&fileName=${fileName}`);
}
